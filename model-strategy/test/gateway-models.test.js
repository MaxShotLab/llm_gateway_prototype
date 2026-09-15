import assert from "node:assert/strict";
import test from "node:test";

import { modelId, modelProvider, paginateModels, readGatewayModels, searchableModelText } from "../src/lib/gateway-models.js";

test("gateway models normalize documented and internal list envelopes", () => {
  assert.deepEqual(readGatewayModels({ data: [{ id: "openai/gpt" }] }), [{ id: "openai/gpt" }]);
  assert.deepEqual(readGatewayModels({ items: [{ model_name: "anthropic/claude" }] }), [{ model_name: "anthropic/claude" }]);
});

test("gateway model helpers support search and provider fallback", () => {
  const model = { model_name: "openai/gpt", tags: ["reasoning"] };
  assert.equal(modelId(model), "openai/gpt");
  assert.equal(modelProvider(model), "openai");
  assert.match(searchableModelText(model), /reasoning/);
  assert.doesNotMatch(searchableModelText({ id: "anthropic/claude", supported_endpoint_types: ["openai"] }), /openai/);
});

test("gateway pagination clamps page boundaries", () => {
  const models = Array.from({ length: 51 }, (_, index) => ({ id: String(index + 1) }));
  assert.deepEqual(paginateModels(models, 3, 25), { page: 3, pageCount: 3, items: [{ id: "51" }] });
  assert.equal(paginateModels(models, 9, 25).page, 3);
});
