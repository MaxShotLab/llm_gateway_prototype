import assert from "node:assert/strict";
import test from "node:test";

import {
  ALLOCATION_ORDER,
  applyFreeInferenceGate,
  DEFAULT_STRATEGY,
  DISPLAY_ORDER,
  MODEL_COUNT,
  parseInferenceResponse,
  selectionFingerprint,
} from "../reference-implementation.js";

test("reference constants match the algorithm document", () => {
  assert.equal(Object.values(DEFAULT_STRATEGY.quotas).reduce((sum, value) => sum + value, 0), MODEL_COUNT);
  assert.deepEqual(DEFAULT_STRATEGY.quotas, { flagship: 8, reasoning: 4, balanced: 6, economy: 4, code: 3, free: 5 });
  assert.deepEqual(ALLOCATION_ORDER, ["free", "code", "flagship", "reasoning", "economy", "balanced"]);
  assert.deepEqual(DISPLAY_ORDER, ["flagship", "reasoning", "balanced", "economy", "code", "free"]);
});

test("reference inference parser rejects empty HTTP 200 responses", () => {
  const empty = 'data: {"choices":[{"delta":{},"finish_reason":"length"}]}\n\ndata: [DONE]';
  assert.equal(parseInferenceResponse(200, empty, 100).success, false);

  const usable = [
    'data: {"provider":"Test","choices":[{"delta":{"content":"OK"},"finish_reason":null}]}',
    'data: {"choices":[{"delta":{},"finish_reason":"stop"}]}',
    "data: [DONE]",
  ].join("\n\n");
  const result = parseInferenceResponse(200, usable, 100);
  assert.equal(result.success, true);
  assert.equal(result.reason, null);
});

test("reference Free inference check is a hard gate", () => {
  const model = { id: "vendor/free", eligibility: { free: true }, hardGateReasons: [] };
  const failed = applyFreeInferenceGate([model], new Map([[model.id, { verified: true, available: false, reason: "Failed" }]]));
  assert.deepEqual(failed[0].hardGateReasons, ["Failed"]);
  assert.deepEqual(applyFreeInferenceGate([model], new Map(), true), [model]);
});

test("reference refresh fingerprint ignores order and score", () => {
  const left = [
    { id: "b", category: "free", inputPrice: 0, outputPrice: 0, score: 10 },
    { id: "a", category: "flagship", inputPrice: 1, outputPrice: 2, score: 20 },
  ];
  const right = [{ ...left[1], score: 1 }, { ...left[0], score: 99 }];
  assert.equal(selectionFingerprint(left), selectionFingerprint(right));
});
