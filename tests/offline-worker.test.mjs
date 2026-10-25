import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
const origin = "https://peyyfi.test";

function worker({ offline = false, cached = new Response("game"), keys = [] } = {}) {
  const handlers = {};
  const deleted = [];
  const fetched = [];
  const installed = [];
  let claimed = false;
  let skipped = false;
  const cache = {
    add: async (request) => { installed.push(request); },
    match: async () => cached,
  };
  vm.runInNewContext(source, {
    URL,
    Response,
    Request: class { constructor(path, options) { this.url = path; this.cache = options.cache; } },
    self: {
      location: { origin },
      addEventListener: (name, handler) => { handlers[name] = handler; },
      skipWaiting: async () => { skipped = true; },
      clients: { claim: async () => { claimed = true; } },
    },
    caches: {
      open: async () => cache,
      keys: async () => keys,
      delete: async (key) => { deleted.push(key); },
    },
    fetch: async (request) => {
      fetched.push(request);
      if (offline) throw new TypeError("Offline");
      return new Response("network");
    },
  });
  return {
    deleted, fetched, installed,
    get claimed() { return claimed; },
    get skipped() { return skipped; },
    lifecycle(name) {
      let pending;
      handlers[name]({ waitUntil: (promise) => { pending = promise; } });
      return pending;
    },
    request(path, { method = "GET", mode = "navigate" } = {}) {
      let response;
      handlers.fetch({
        request: { url: new URL(path, origin).href, method, mode },
        respondWith: (promise) => { response = promise; },
      });
      return response;
    },
  };
}

test("installation precaches the complete game before activating", async () => {
  const sw = worker();
  await sw.lifecycle("install");
  assert.equal(sw.installed[0].url, "/offline.html");
  assert.equal(sw.installed[0].cache, "reload");
  assert.equal(sw.skipped, true);
});

test("activation removes only obsolete game caches and controls existing tabs", async () => {
  const sw = worker({ keys: ["peyyfi-offline-v0", "peyyfi-offline-v1", "other-cache"] });
  await sw.lifecycle("activate");
  assert.deepEqual(sw.deleted, ["peyyfi-offline-v0"]);
  assert.equal(sw.claimed, true);
});

test("normal navigation uses the network", async () => {
  const sw = worker();
  assert.equal(await (await sw.request("/")).text(), "network");
});

test("failed navigation uses the cached game, including routes with query strings", async () => {
  const sw = worker({ offline: true });
  assert.equal(await (await sw.request("/?campaign=launch")).text(), "game");
});

test("embedded game is available directly from cache while offline", async () => {
  const sw = worker({ offline: true });
  assert.equal(await (await sw.request("/offline.html", { mode: "cors" })).text(), "game");
  assert.equal(sw.fetched.length, 0);
});

test("submissions, API requests, React payloads and external requests pass through", () => {
  const sw = worker({ offline: true });
  assert.equal(sw.request("/api/waitlist", { method: "POST" }), undefined);
  assert.equal(sw.request("/api/waitlist"), undefined);
  assert.equal(sw.request("/?_rsc=payload", { mode: "cors" }), undefined);
  assert.equal(sw.request("https://other.test/"), undefined);
});

test("a missing offline cache returns a network error, never a fake success", async () => {
  const evicted = worker({ offline: true, cached: null });
  assert.equal((await evicted.request("/")).type, "error");
});
