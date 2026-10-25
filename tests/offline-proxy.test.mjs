import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../app/api/game/scores/route.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;

function proxy({ available = true } = {}) {
  const requests = [];
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, URL, Response, AbortSignal,
    process: { env: { WAITLIST_API_URL: "https://backend.test/", WAITLIST_API_SECRET: "server-only-secret" } },
    fetch: async (url, options) => {
      requests.push({ url, ...options });
      return available ? Response.json({ leaderboard: [] }) : new Response("unavailable", { status: 503 });
    },
  });
  return { api: exports, requests };
}

function request(payload, origin = "https://www.peyyfi.test") {
  return new Request("https://localhost/api/game/scores", {
    method: "POST",
    headers: { Host: "www.peyyfi.test", Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

test("score uploads accept the public Host when Next rewrites the internal URL", async () => {
  const app = proxy();
  const payload = { player_id: randomUUID(), score: 120 };
  assert.equal((await app.api.POST(request(payload))).status, 200);
  assert.deepEqual(JSON.parse(app.requests[0].body), payload);
  assert.equal(app.requests[0].url, "https://backend.test/api/game/scores/");
});

test("cross-origin uploads and invalid scores do not reach the backend", async () => {
  const app = proxy();
  const payload = { player_id: randomUUID(), score: 120 };
  assert.equal((await app.api.POST(request(payload, "https://other.test"))).status, 403);
  for (const score of [0, -1, true, 1.5, "100", 864001]) {
    assert.equal((await app.api.POST(request({ ...payload, score }))).status, 400);
  }
  assert.equal((await app.api.POST(request({ player_id: "invalid", score: 12 }))).status, 400);
  assert.equal(app.requests.length, 0);
});

test("backend secret is sent only server-side and leaderboard responses are not cached", async () => {
  const app = proxy();
  const response = await app.api.GET();
  assert.equal(app.requests[0].headers.Authorization, "Bearer server-only-secret");
  assert.equal(app.requests[0].cache, "no-store");
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert(!JSON.stringify(await response.json()).includes("server-only-secret"));
});

test("an unavailable backend returns failure so the client retains its pending best", async () => {
  const app = proxy({ available: false });
  assert.equal((await app.api.POST(request({ player_id: randomUUID(), score: 100 }))).status, 503);
});
