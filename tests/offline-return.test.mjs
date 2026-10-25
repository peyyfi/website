import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const html = await readFile(new URL("../public/offline.html", import.meta.url), "utf8");
const source = html.match(/<script id="auto-return">([\s\S]*?)<\/script>/)[1];

function countdown({ online = false, visible = true } = {}) {
  const changes = [];
  const timers = new Map();
  let returns = 0;
  const create = vm.runInNewContext(source + "\ncreateAutoReturn", {
    setInterval(callback, delay) { assert.equal(delay, 1000); const key = Symbol(); timers.set(key, callback); return key; },
    clearInterval(key) { timers.delete(key); },
  });
  const api = create({ online, visible, onChange(value) { changes.push(value); }, onReturn() { returns += 1; } });
  return {
    api, changes,
    get returns() { return returns; },
    tick(seconds) { for (let i = 0; i < seconds; i++) for (const callback of [...timers.values()]) callback(); },
  };
}

test("an ordinary online visit never starts an automatic return", () => {
  const app = countdown({ online: true });
  app.api.setPlaying(false);
  app.tick(20);
  assert.deepEqual(app.changes, []);
  assert.equal(app.returns, 0);
});

test("reconnecting while idle shows a full ten-second countdown then returns once", () => {
  const app = countdown();
  app.api.setOnline(true);
  assert.equal(app.changes.at(-1), 10);
  app.tick(9);
  assert.equal(app.changes.at(-1), 1);
  assert.equal(app.returns, 0);
  app.tick(1);
  assert.equal(app.returns, 1);
  assert.equal(app.changes.at(-1), null);
  app.tick(20);
  assert.equal(app.returns, 1);
});

test("a run in progress prevents returning, and finishing gives a fresh countdown", () => {
  const app = countdown();
  app.api.setPlaying(true);
  app.api.setOnline(true);
  app.tick(30);
  assert.equal(app.returns, 0);
  assert.deepEqual(app.changes, []);
  app.api.setPlaying(false);
  assert.equal(app.changes.at(-1), 10);
  app.tick(10);
  assert.equal(app.returns, 1);
});

test("starting or resuming a game cancels the current countdown", () => {
  const app = countdown();
  app.api.setOnline(true);
  app.tick(7);
  app.api.setPlaying(true);
  app.tick(20);
  assert.equal(app.returns, 0);
  assert.equal(app.changes.at(-1), null);
  app.api.setPlaying(false);
  assert.equal(app.changes.at(-1), 10);
});

test("Stay here suppresses auto-return for the rest of this connection", () => {
  const app = countdown();
  app.api.setOnline(true);
  app.api.stay();
  app.api.setPlaying(true);
  app.api.setPlaying(false);
  app.api.setVisible(false);
  app.api.setVisible(true);
  app.tick(30);
  assert.equal(app.returns, 0);
  app.api.setOnline(false);
  app.api.setOnline(true);
  app.tick(10);
  assert.equal(app.returns, 1);
});

test("losing connection stops the timer and reconnecting starts a fresh ten seconds", () => {
  const app = countdown();
  app.api.setOnline(true);
  app.tick(8);
  app.api.setOnline(false);
  app.tick(30);
  assert.equal(app.returns, 0);
  app.api.setOnline(true);
  assert.equal(app.changes.at(-1), 10);
  app.tick(9);
  assert.equal(app.returns, 0);
});

test("hidden tabs and closed game panels cannot return the user automatically", () => {
  const app = countdown({ visible: false });
  app.api.setOnline(true);
  app.tick(30);
  assert.equal(app.returns, 0);
  app.api.setVisible(true);
  app.tick(5);
  app.api.setVisible(false);
  app.tick(30);
  assert.equal(app.returns, 0);
  app.api.setVisible(true);
  assert.equal(app.changes.at(-1), 10);
  app.tick(10);
  assert.equal(app.returns, 1);
});
