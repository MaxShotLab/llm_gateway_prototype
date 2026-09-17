import assert from "node:assert/strict";
import test from "node:test";

import { filterAndSortGatewayModels, formatSourceDate, formatTokenCount, formatUsdPerMillion, modelId, modelProvider, modelsWithReference, paginateModels, pricePerMillion, readGatewayModels, readReferenceModel, searchableModelText } from "../src/lib/gateway-models.js";

test("gateway models normalize documented and internal list envelopes", () => {
  assert.deepEqual(readGatewayModels({ data: [{ id: "openai/gpt" }] }), [{ id: "openai/gpt" }]);
  assert.deepEqual(readGatewayModels({ items: [{ model_name: "anthropic/claude" }] }), [{ model_name: "anthropic/claude" }]);
});

test("gateway model helpers search source fields without inferring provider", () => {
  const model = { model_name: "openai/gpt", tags: ["reasoning"] };
  assert.equal(modelId(model), "openai/gpt");
  assert.equal(modelProvider(model), "—");
  assert.equal(modelProvider({ id: "~anthropic/claude-latest", owned_by: "openrouter" }), "openrouter");
  assert.match(searchableModelText(model), /reasoning/);
  assert.doesNotMatch(searchableModelText({ id: "anthropic/claude", supported_endpoint_types: ["openai"] }), /openai/);
});

test("catalog references expose OpenRouter fields without derived labels or prices", () => {
  const model = { id: "anthropic/claude:batch" };
  const reference = {
    name: "Claude",
    contextLength: 200_000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    supportedParameters: ["tools", "reasoning"],
    pricing: { input: "0.000003", output: "0.000015" },
  };
  const payload = { reference: { models: { [model.id]: reference } } };
  assert.equal(readReferenceModel(payload, model), reference);
  assert.match(searchableModelText(model, reference), /claude/);
  assert.match(searchableModelText(model, reference), /image/);
  assert.match(searchableModelText(model, reference), /tools/);
});

test("catalog shows only Gateway models with exact OpenRouter records", () => {
  const models = [{ id: "vendor/matched" }, { id: "vendor/unmatched" }];
  const payload = { reference: { models: { "vendor/matched": { contextLength: 128_000, pricing: { input: "0.000001" } } } } };
  assert.deepEqual(modelsWithReference(models, payload), [models[0]]);
  assert.deepEqual(modelsWithReference(models, null), []);
});

test("catalog formats source numbers for reading without changing their values", () => {
  assert.equal(formatTokenCount(128_000), "128K");
  assert.equal(formatTokenCount(1_310_720), "1.31M");
  assert.equal(formatTokenCount(null), "—");
  assert.equal(pricePerMillion("0.000003"), 3);
  assert.equal(formatUsdPerMillion("0.000003"), "$3.00");
  assert.equal(formatUsdPerMillion("0"), "$0.00");
  assert.equal(formatUsdPerMillion(null), "—");
  assert.equal(formatSourceDate(1626777600), "Jul 20, 2021");
  assert.equal(formatSourceDate("2026-09-16"), "Sep 16, 2026");
});

test("catalog filters and sorts known metadata without treating missing values as zero", () => {
  const models = [{ id: "vendor/unknown" }, { id: "vendor/cheap" }, { id: "other/expensive:batch" }];
  const payload = {
    reference: { models: {
      "vendor/cheap": { contextLength: 128_000, pricing: { input: "0.000001" }, inputModalities: ["image"], outputModalities: ["text"], supportedParameters: [] },
      "other/expensive:batch": { contextLength: 256_000, pricing: { input: "0.000004" }, inputModalities: ["text"], outputModalities: ["text"], supportedParameters: [] },
    } },
  };
  const base = { query: "", provider: "all", inputModality: "all", minContext: 0, maxInputPrice: "", sort: "price" };
  assert.deepEqual(filterAndSortGatewayModels(models, payload, base).map(modelId), ["vendor/cheap", "other/expensive:batch", "vendor/unknown"]);
  assert.deepEqual(filterAndSortGatewayModels(models, payload, { ...base, inputModality: "image" }).map(modelId), ["vendor/cheap"]);
  assert.deepEqual(filterAndSortGatewayModels(models, payload, { ...base, maxInputPrice: "2" }).map(modelId), ["vendor/cheap"]);
  assert.deepEqual(filterAndSortGatewayModels(models, payload, { ...base, minContext: 200_000 }).map(modelId), ["other/expensive:batch"]);
});

test("gateway pagination clamps page boundaries", () => {
  const models = Array.from({ length: 51 }, (_, index) => ({ id: String(index + 1) }));
  assert.deepEqual(paginateModels(models, 3, 25), { page: 3, pageCount: 3, items: [{ id: "51" }] });
  assert.equal(paginateModels(models, 9, 25).page, 3);
});
