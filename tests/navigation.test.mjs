import test from "node:test";
import assert from "node:assert/strict";
import { createWheelGate } from "../src/navigation/input.mjs";
const base = {
  mode: "WORKSPACE",
  now: 3000,
  lockedUntil: 2000,
  delta: 90,
  inside: false,
};

test("deliberate input permits forward and reverse navigation", () => {
  assert.equal(createWheelGate()(base), 1);
  assert.equal(createWheelGate()({ ...base, delta: -90 }), -1);
});
test("flight, expanded mode, internal content and cooldown reject navigation", () => {
  for (const change of [
    { mode: "FLYING" },
    { mode: "EXPANDED" },
    { inside: true },
    { lockedUntil: 3200 },
  ])
    assert.equal(createWheelGate()({ ...base, ...change }), 0);
});
test("small trackpad deltas accumulate into a single step", () => {
  const feed = createWheelGate();
  assert.equal(feed({ ...base, now: 3000, delta: 2 }), 0);
  assert.equal(feed({ ...base, now: 3016, delta: 8 }), 0);
  assert.equal(feed({ ...base, now: 3032, delta: 20 }), 1);
  assert.equal(feed({ ...base, now: 3048, delta: 100 }), 0);
});
test("a continuous momentum tail cannot consume another step", () => {
  const feed = createWheelGate();
  assert.equal(feed(base), 1);
  for (let now = 3050; now < 7000; now += 50)
    assert.equal(feed({ ...base, now, delta: 60 }), 0);
  assert.equal(feed({ ...base, now: 7300, delta: -60 }), -1);
});
test("a burst beginning during flight stays blocked after arrival", () => {
  const feed = createWheelGate();
  for (let now = 2100; now < 3000; now += 50)
    assert.equal(feed({ ...base, mode: "FLYING", now, delta: 60 }), 0);
  for (let now = 3000; now < 4100; now += 50)
    assert.equal(feed({ ...base, mode: "FOCUSED", now, delta: 60 }), 0);
  assert.equal(feed({ ...base, mode: "FOCUSED", now: 4400, delta: -60 }), -1);
});
test("scroll from content stays isolated when pointer exits during momentum", () => {
  const feed = createWheelGate();
  assert.equal(feed({ ...base, inside: true }), 0);
  assert.equal(feed({ ...base, now: 3050, inside: false }), 0);
  assert.equal(feed({ ...base, now: 3400, inside: false }), 1);
});
test("tiny isolated accidental input never advances", () => {
  const feed = createWheelGate();
  assert.equal(feed({ ...base, delta: 2 }), 0);
  assert.equal(feed({ ...base, now: 4000, delta: 2 }), 0);
});
