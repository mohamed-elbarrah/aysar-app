import assert from "node:assert/strict";
import { parseJsonBlocks } from "../app/lib/scripts";
import { settingsUpdateSchema } from "../app/lib/shared-types";

function test(name: string, callback: () => void) {
  callback();
  console.log(`PASS: ${name}`);
}

test("normalizes a modern block with safe defaults", () => {
  const [block] = parseJsonBlocks([{ id: "hero", location: "body", content: "<div>ok</div>" }]);
  assert.equal(block.id, "hero");
  assert.equal(block.enabled, true);
  assert.equal(block.scope, "global");
  assert.equal(block.runMode, "once-per-load");
});

test("preserves legacy inline blocks", () => {
  const [block] = parseJsonBlocks([{ id: "ga", type: "inline", content: "window.__test = true;" }]);
  assert.equal(block.location, "body");
  assert.match(block.content, /<script>/);
});

test("requires settings updates to be objects", () => {
  assert.equal(settingsUpdateSchema.safeParse("not-an-object").success, false);
  assert.equal(settingsUpdateSchema.safeParse({ scripts: [] }).success, true);
});

test("rejects malformed script arrays", () => {
  assert.equal(settingsUpdateSchema.safeParse({ scripts: "not-an-array" }).success, false);
});

console.log("Custom-code data-contract smoke test passed.");
