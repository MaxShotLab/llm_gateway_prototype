import assert from "node:assert/strict";
import test from "node:test";

import { hasSystemicRateLimit, parseInferenceResponse, summarizeInferenceAttempts } from "../src/lib/inference.js";
import { applyFreeInferenceHealth, buildChatModelsJson, compareSelectedModels, DEFAULT_STRATEGY, MODEL_COUNT, selectionRefreshFingerprint, selectPortfolio, strategyDataFingerprint, totalValues, validateStrategy } from "../src/lib/strategy.js";

function candidate(id, category, scoreValue) {
  return {
    id,
    name: id,
    provider: id.split("/")[0],
    category,
    score: scoreValue,
    hardGateReasons: [],
    eligibility: {
      flagship: category === "flagship" || category === "balanced",
      reasoning: category === "reasoning" || category === "flagship",
      balanced: category !== "free",
      economy: category === "economy",
      code: category === "code",
      free: category === "free",
    },
    health: { verified: true, available: true, uptime: 99.9 },
    components: {},
    raw: { architecture: { input_modalities: ["text"] }, supported_parameters: [] },
    contextLength: 32_000,
  };
}

test("default strategy totals exactly 30 seats and 100 weight points", () => {
  assert.equal(totalValues(DEFAULT_STRATEGY.quotas), MODEL_COUNT);
  assert.equal(DEFAULT_STRATEGY.quotas.balanced, 6);
  assert.equal(DEFAULT_STRATEGY.quotas.free, 5);
  assert.equal(totalValues(DEFAULT_STRATEGY.weights), 100);
  assert.deepEqual(validateStrategy(DEFAULT_STRATEGY), []);
});

test("portfolio selection fills every configured category and returns 30 unique models", () => {
  const candidates = [];
  for (const [category, count] of Object.entries(DEFAULT_STRATEGY.quotas)) {
    for (let index = 0; index < count + 3; index += 1) {
      candidates.push(candidate(`${category}/model-${index}`, category, 100 - candidates.length));
    }
  }
  const result = selectPortfolio(candidates, DEFAULT_STRATEGY);
  assert.equal(result.selected.length, MODEL_COUNT);
  assert.equal(new Set(result.selected.map((model) => model.id)).size, MODEL_COUNT);
  assert.deepEqual(result.shortages, []);
  for (const [category, count] of Object.entries(DEFAULT_STRATEGY.quotas)) {
    assert.equal(result.selected.filter((model) => model.category === category).length, count);
  }
});

test("data fingerprint ignores object identity and detects decision-data changes", () => {
  const original = candidate("openai/model", "flagship", 90);
  const equivalent = structuredClone(original);
  assert.equal(strategyDataFingerprint([original]), strategyDataFingerprint([equivalent]));
  equivalent.health.uptime = 98;
  assert.notEqual(strategyDataFingerprint([original]), strategyDataFingerprint([equivalent]));
});

test("selected-model comparison reports only new, category, and price changes", () => {
  const previous = [
    { id: "vendor/stable", category: "flagship", rank: 1, inputPrice: 1, outputPrice: 2 },
    { id: "vendor/moved", category: "balanced", rank: 2, inputPrice: 1, outputPrice: 2 },
    { id: "vendor/ranked", category: "reasoning", rank: 3, inputPrice: 1, outputPrice: 2 },
    { id: "vendor/repriced", category: "economy", rank: 4, inputPrice: 1, outputPrice: 2 },
  ];
  const next = [
    { id: "vendor/stable", category: "flagship", rank: 1, inputPrice: 1, outputPrice: 2 },
    { id: "vendor/moved", category: "flagship", rank: 2, inputPrice: 1, outputPrice: 2 },
    { id: "vendor/ranked", category: "reasoning", rank: 8, inputPrice: 1, outputPrice: 2 },
    { id: "vendor/repriced", category: "economy", rank: 4, inputPrice: 1.5, outputPrice: 2 },
    { id: "vendor/new", category: "free", rank: 3, inputPrice: 0, outputPrice: 0 },
  ];
  assert.deepEqual(compareSelectedModels(previous, next), {
    "vendor/moved": { label: "Category", detail: "balanced → flagship" },
    "vendor/repriced": { label: "Price", detail: "Input/output 1/2 → 1.5/2" },
    "vendor/new": { label: "New", detail: "Newly selected model" },
  });
});

test("refresh fingerprint ignores ordering and score-source changes", () => {
  const before = [
    { id: "vendor/a", category: "flagship", inputPrice: 1, outputPrice: 2, rank: 1, score: 90, weeklyRank: 1, monthlyRank: 1, ageDays: 3 },
    { id: "vendor/b", category: "balanced", inputPrice: 0.5, outputPrice: 1, rank: 2, score: 80, weeklyRank: 2, monthlyRank: 2, ageDays: 10 },
  ];
  const reordered = [
    { ...before[1], rank: 1, score: 95, weeklyRank: 1, monthlyRank: 7, ageDays: 11 },
    { ...before[0], rank: 2, score: 70, weeklyRank: 8, monthlyRank: 3, ageDays: 4 },
  ];
  assert.equal(selectionRefreshFingerprint(before), selectionRefreshFingerprint(reordered));
  assert.notEqual(selectionRefreshFingerprint(before), selectionRefreshFingerprint([{ ...before[0], inputPrice: 1.1 }, before[1]]));
  assert.notEqual(selectionRefreshFingerprint(before), selectionRefreshFingerprint([{ ...before[0], category: "reasoning" }, before[1]]));
  assert.notEqual(selectionRefreshFingerprint(before), selectionRefreshFingerprint([before[0]]));
});

test("streaming inference requires visible content and a normal stop", () => {
  const success = [
    'data: {"provider":"Example","choices":[{"delta":{"content":"O"},"finish_reason":null}]}',
    'data: {"choices":[{"delta":{"content":"K"},"finish_reason":"stop"}]}',
    "data: [DONE]",
  ].join("\n\n");
  assert.deepEqual(parseInferenceResponse(200, success, 450), {
    success: true,
    httpStatus: 200,
    latencyMs: 450,
    provider: "Example",
    finishReason: "stop",
    errorCode: null,
    reason: null,
  });

  const empty = 'data: {"choices":[{"delta":{},"finish_reason":"length"}]}\n\ndata: [DONE]';
  assert.equal(parseInferenceResponse(200, empty, 300).success, false);
  assert.equal(parseInferenceResponse(200, empty, 300).reason, "No assistant content returned");

  const limited = parseInferenceResponse(429, '{"error":{"code":429,"message":"Rate limited"}}', 50);
  assert.equal(limited.success, false);
  assert.equal(limited.errorCode, 429);
  assert.equal(limited.reason, "Rate limited");
});

test("inference summaries expose success and repeated rate limits", () => {
  const success = summarizeInferenceAttempts([{ success: true, httpStatus: 200, latencyMs: 500, provider: "A", reason: null }], "now");
  assert.equal(success.available, true);
  assert.equal(success.latencyMs, 500);

  const rateLimited = summarizeInferenceAttempts([
    { success: false, httpStatus: 429, latencyMs: 50, provider: null, reason: "Limited" },
    { success: false, httpStatus: 429, latencyMs: 60, provider: null, reason: "Limited again" },
  ], "now");
  assert.equal(rateLimited.available, false);
  assert.equal(rateLimited.rateLimited, true);
  assert.equal(rateLimited.reason, "Limited again");
  assert.equal(hasSystemicRateLimit([rateLimited, rateLimited, success]), true);
  assert.equal(hasSystemicRateLimit([rateLimited, success, success]), false);
});

test("free inference health is a hard gate without affecting paid models", () => {
  const freeAvailable = candidate("vendor/free-ok", "free", 90);
  const freeUnavailable = candidate("vendor/free-bad", "free", 80);
  const freeUnchecked = candidate("vendor/free-unchecked", "free", 70);
  const paid = candidate("vendor/paid", "balanced", 60);
  const health = new Map([
    [freeAvailable.id, { verified: true, available: true, attempts: 1, successes: 1 }],
    [freeUnavailable.id, { verified: true, available: false, attempts: 2, successes: 0, reason: "No assistant content returned" }],
  ]);
  const [available, unavailable, unchecked, unchangedPaid] = applyFreeInferenceHealth(
    [freeAvailable, freeUnavailable, freeUnchecked, paid],
    health,
  );
  assert.deepEqual(available.hardGateReasons, []);
  assert.deepEqual(unavailable.hardGateReasons, ["No assistant content returned"]);
  assert.deepEqual(unchecked.hardGateReasons, ["Inference not verified"]);
  assert.equal(unchangedPaid, paid);
});

test("export creates exactly one default and preserves all selected model IDs", () => {
  const selected = [
    { ...candidate("openai/flagship", "flagship", 90), rank: 1 },
    { ...candidate("google/balanced", "balanced", 80), rank: 2 },
    { ...candidate("vendor/free", "free", 70), rank: 3, inferenceHealth: { available: true, attempts: 1, successes: 1, latencyMs: 400, provider: "Test", checkedAt: "now" } },
  ];
  const output = buildChatModelsJson(selected);
  assert.deepEqual(Object.keys(output), ["openai/flagship", "google/balanced", "vendor/free"]);
  assert.equal(Object.values(output).filter((model) => model.chatDefault).length, 1);
  assert.equal(output["google/balanced"].chatDefault, true);
  assert.deepEqual(output["vendor/free"].selection.inferenceHealth, {
    available: true,
    attempts: 1,
    successes: 1,
    latencyMs: 400,
    provider: "Test",
    checkedAt: "now",
  });
});
