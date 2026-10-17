import assert from "node:assert/strict";
import test from "node:test";

import { displayPrice, priceUnit, publishedPrices, sortVeniceModels } from "../src/lib/venice-models.js";

test("Venice prices preserve published USD variants", () => {
  const image = { type: "image", model_spec: { pricing: { quality: { "1K": { low: { usd: 0.02, diem: 0.02 }, high: { usd: 0.1 } } }, upscale: { "2x": { usd: 0.01 } } } } };
  assert.deepEqual(publishedPrices(image), [
    { label: "quality · 1K · low", usd: 0.02 },
    { label: "quality · 1K · high", usd: 0.1 },
    { label: "upscale · 2x", usd: 0.01 },
  ]);
  assert.equal(displayPrice(image), 0.02);
  assert.equal(priceUnit(image), "/image");
  assert.equal(displayPrice({ type: "video", model_spec: { pricing: null } }), null);
});

test("Venice sorting is scoped to a type and keeps unpriced models last", () => {
  const models = [
    { id: "new", type: "text", created: 20, model_spec: { pricing: { input: { usd: 2 } } } },
    { id: "old", type: "text", created: 10, model_spec: { pricing: { input: { usd: 1 } } } },
    { id: "unknown", type: "text", created: 30, model_spec: { pricing: null } },
    { id: "image", type: "image", created: 40, model_spec: { pricing: { generation: { usd: 0.1 } } } },
  ];
  assert.deepEqual(sortVeniceModels(models, "text", "", "price-asc").map(({ id }) => id), ["old", "new", "unknown"]);
  assert.deepEqual(sortVeniceModels(models, "all", "", "newest").map(({ id }) => id), ["image", "unknown", "new", "old"]);
  assert.deepEqual(sortVeniceModels(models, "all", "NEW", "newest").map(({ id }) => id), ["new"]);
});
