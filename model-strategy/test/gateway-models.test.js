import assert from "node:assert/strict";
import test from "node:test";

import { filterAndSortGatewayModels, modelCapabilities, modelId, modelProvider, modelVariant, paginateModels, readGatewayModels, readReferenceModel, readStrategyScore, referencePricePerMillion, searchableModelText } from "../src/lib/gateway-models.js";

test("gateway models normalize documented and internal list envelopes", () => {
  assert.deepEqual(readGatewayModels({ data: [{ id: "openai/gpt" }] }), [{ id: "openai/gpt" }]);
  assert.deepEqual(readGatewayModels({ items: [{ model_name: "anthropic/claude" }] }), [{ model_name: "anthropic/claude" }]);
});

test("gateway model helpers support search and provider fallback", () => {
  const model = { model_name: "openai/gpt", tags: ["reasoning"] };
  assert.equal(modelId(model), "openai/gpt");
  assert.equal(modelProvider(model), "openai");
  assert.equal(modelProvider({ id: "~anthropic/claude-latest", owned_by: "openrouter" }), "anthropic");
  assert.match(searchableModelText(model), /reasoning/);
  assert.doesNotMatch(searchableModelText({ id: "anthropic/claude", supported_endpoint_types: ["openai"] }), /openai/);
});

test("catalog references derive honest variants, capabilities, and per-million prices", () => {
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
  assert.equal(modelVariant(model), "batch");
  assert.equal(modelVariant({ id: "~anthropic/claude-latest" }), "latest");
  assert.deepEqual(modelCapabilities(reference), ["Vision", "Reasoning", "Tools"]);
  assert.equal(referencePricePerMillion(reference.pricing.input), 3);
  assert.equal(referencePricePerMillion(null), null);
  assert.match(searchableModelText(model, reference), /claude/);
});

test("catalog filters and sorts known metadata without treating missing values as zero", () => {
  const models = [{ id: "vendor/unknown" }, { id: "vendor/cheap" }, { id: "other/expensive:batch" }];
  const payload = {
    reference: { models: {
      "vendor/cheap": { contextLength: 128_000, pricing: { input: "0.000001" }, inputModalities: ["image"], outputModalities: ["text"], supportedParameters: [] },
      "other/expensive:batch": { contextLength: 256_000, pricing: { input: "0.000004" }, inputModalities: ["text"], outputModalities: ["text"], supportedParameters: [] },
    } },
    strategy: { scores: { "vendor/cheap": 50 } },
  };
  const base = { query: "", provider: "all", variant: "all", capability: "all", minContext: 0, maxInputPrice: "", sort: "price" };
  assert.deepEqual(filterAndSortGatewayModels(models, payload, base).map(modelId), ["vendor/cheap", "other/expensive:batch", "vendor/unknown"]);
  assert.deepEqual(filterAndSortGatewayModels(models, payload, { ...base, provider: "vendor", capability: "Vision" }).map(modelId), ["vendor/cheap"]);
  assert.deepEqual(filterAndSortGatewayModels(models, payload, { ...base, maxInputPrice: "2" }).map(modelId), ["vendor/cheap"]);
  assert.deepEqual(filterAndSortGatewayModels(models, payload, { ...base, minContext: 200_000 }).map(modelId), ["other/expensive:batch"]);
});

test("gateway pagination clamps page boundaries", () => {
  const models = Array.from({ length: 51 }, (_, index) => ({ id: String(index + 1) }));
  assert.deepEqual(paginateModels(models, 3, 25), { page: 3, pageCount: 3, items: [{ id: "51" }] });
  assert.equal(paginateModels(models, 9, 25).page, 3);
});

test("gateway models read scores derived by Model Strategy", () => {
  const payload = { strategy: { scores: { "openai/gpt": 72.345 } } };
  assert.equal(readStrategyScore(payload, { id: "openai/gpt" }), 72.345);
  assert.equal(readStrategyScore(payload, { id: "missing/model" }), null);
});
