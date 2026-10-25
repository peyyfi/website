import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import test from "node:test";
import vm from "node:vm";

const html = await readFile(new URL("../public/offline.html", import.meta.url), "utf8");
const source = html.match(/<script id="score-sync">([\s\S]*?)<\/script>/)[1];
const settle = () => new Promise((resolve) => setImmediate(resolve));
const bestKey = "peyyfi-jump-best";
const playerKey = "peyyfi-jump-player";
const boardKey = "peyyfi-jump-leaderboard";
const rows = [100, 80, 60].map((score, index) => ({ rank: index + 1, name: `Runner ABCDEF0${index}`, score }));

function client({ storage = new Map(), online = false, respond = async () => ({ leaderboard: rows }), blocked = false } = {}) {
  const elements = new Map();
  const events = {};
  const requests = [];
  const timers = new Map();
  class Element {
    textContent = "";
    children = [];
    append(...items) { this.children.push(...items); }
    replaceChildren() { this.children = []; }
  }
  const navigator = { onLine: online };
  const sandbox = {
    navigator, AbortSignal, Date, crypto: { randomUUID },
    localStorage: {
      getItem(key) { if (blocked) throw new Error("Storage blocked"); return storage.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error("Storage blocked"); storage.set(key, value); },
    },
    document: {
      hidden: false,
      getElementById(id) { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); },
      createElement() { return new Element(); },
      addEventListener() {},
    },
    window: { addEventListener(name, handler) { events[name] = handler; } },
    fetch: async (url, options) => {
      requests.push({ url, ...options });
      const data = await respond(url, options);
      return { ok: data.ok !== false, json: async () => data };
    },
    setTimeout(fn, delay) { const key = Symbol(); timers.set(key, { fn, delay }); return key; },
    clearTimeout(key) { timers.delete(key); },
  };
  const api = vm.runInNewContext(source + "\ncreateLeaderboard(value => { globalThis.best = value; });", sandbox);
  return { api, storage, requests, elements, events, navigator, timers, sandbox };
}

test("offline best persists across reload and is submitted on the next online visit", async () => {
  const offline = client();
  offline.api.record(90);
  offline.api.record(40);
  assert.equal(offline.storage.get(bestKey), "90");
  assert.equal(offline.requests.length, 0);
  const id = JSON.parse(offline.storage.get(playerKey)).id;
  const online = client({ storage: offline.storage, online: true, respond: async () => ({ leaderboard: rows, player: { name: "Runner ABCDEF00", best_score: 90 } }) });
  await settle();
  assert.deepEqual(JSON.parse(online.requests[0].body), { player_id: id, score: 90 });
  assert.equal(JSON.parse(online.storage.get(playerKey)).synced, 90);
  assert.equal(online.elements.get("score-sync-status").textContent, "Your best score is synced.");
});

test("reconnection submits the best and displays exactly three real scores", async () => {
  const app = client({ respond: async () => ({ leaderboard: rows, player: { name: "Runner ABCDEF00", best_score: 150 } }) });
  app.api.record(150);
  app.navigator.onLine = true;
  await app.events.online();
  assert.equal(JSON.parse(app.requests[0].body).score, 150);
  const rendered = app.elements.get("leaderboard").children;
  assert.equal(rendered.length, 3);
  assert.equal(rendered[0].children[0].textContent, "Runner ABCDEF00 (you)");
  assert.equal(rendered[1].children[1].textContent, "00080");
});

test("server failure retains the pending score and retries without needing another online event", async () => {
  let available = false;
  const app = client({ respond: async () => available ? { leaderboard: rows, player: { name: "Runner ABCDEF00", best_score: 120 } } : { ok: false } });
  app.api.record(120);
  app.navigator.onLine = true;
  await app.events.online();
  assert.equal(JSON.parse(app.storage.get(playerKey)).synced, 0);
  const retry = [...app.timers.values()][0];
  assert.equal(retry.delay, 30000);
  available = true;
  await retry.fn();
  assert.equal(JSON.parse(app.storage.get(playerKey)).synced, 120);
});

test("a newer best earned while a request is in flight is not acknowledged or lost", async () => {
  let finishRequest;
  const app = client({ respond: () => new Promise(resolve => { finishRequest = resolve; }) });
  app.api.record(100);
  app.navigator.onLine = true;
  const pending = app.events.online();
  app.api.record(200);
  finishRequest({ leaderboard: rows, player: { name: "Runner ABCDEF00", best_score: 100 } });
  await pending;
  assert.equal(app.storage.get(bestKey), "200");
  assert.equal(JSON.parse(app.storage.get(playerKey)).synced, 100);
  assert.equal([...app.timers.values()][0].delay, 0);
});

test("cached leaderboard remains visible offline and is marked as saved", () => {
  const storage = new Map([[boardKey, JSON.stringify({ rows, at: Date.now() })]]);
  const app = client({ storage });
  assert.equal(app.elements.get("leaderboard").children[0].children[1].textContent, "00100");
  assert.match(app.elements.get("leaderboard-updated").textContent, /Saved leaderboard/);
  assert.equal(app.requests.length, 0);
});

test("invalid acknowledgements cannot discard the outbox", async () => {
  const app = client({ respond: async () => ({ leaderboard: rows, player: { name: "Runner ABCDEF00", best_score: 10 } }) });
  app.api.record(100);
  app.navigator.onLine = true;
  await app.events.online();
  assert.equal(JSON.parse(app.storage.get(playerKey)).synced, 0);
  assert.equal(app.storage.get(bestKey), "100");
});

test("blocked storage still allows play and keeps the pending best in memory", () => {
  const app = client({ blocked: true });
  app.api.record(25);
  assert.equal(app.sandbox.best, 25);
  assert.match(app.elements.get("score-sync-status").textContent, /Keep this page open/);
});
