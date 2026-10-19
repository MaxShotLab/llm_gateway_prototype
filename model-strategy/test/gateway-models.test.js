import assert from "node:assert/strict";
import test from "node:test";

import { allOpenRouterModels, describeVideoSku, effectiveTokenPricing, filterAndSortModels, formatDurationOptions, formatEndpointPricing, formatSourceDate, formatTokenCount, formatUsdPerMillion, formatVideoSkuPrice, groupBatchModels, mediaAbilities, modelId, nextPricingChange, paginateModels, pricePerMillion, pricingScheduleRows, readReferenceModel, searchableModelText, tokenRateForDisplay } from "../src/lib/gateway-models.js";

test("catalog search uses OpenRouter source fields", () => {
  const model = { id: "openai/gpt" };
  assert.equal(modelId(model), "openai/gpt");
  assert.match(searchableModelText(model, { supportedParameters: ["reasoning"] }), /reasoning/);
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

test("catalog includes every OpenRouter model without a gateway list", () => {
  const payload = { reference: { models: { "vendor/text": { outputModalities: ["text"] }, "vendor/image": { outputModalities: ["image"] } } } };
  assert.deepEqual(allOpenRouterModels(payload), [{ id: "vendor/text" }, { id: "vendor/image" }]);
  assert.deepEqual(allOpenRouterModels(null), []);
});

test("catalog groups exact batch variants under their standard model", () => {
  const standard = { id: "openai/gpt-5.6-sol" };
  const batch = { id: "openai/gpt-5.6-sol:batch" };
  const unmatched = { id: "other/model:batch" };
  assert.deepEqual(groupBatchModels([batch, unmatched, standard]), [
    { model: standard, batch },
    { model: unmatched, batch: null },
  ]);
  assert.deepEqual(groupBatchModels([batch], [standard, batch]), [{ model: standard, batch }]);
});

test("endpoint prices retain OpenRouter units and long-context overrides", () => {
  assert.equal(formatEndpointPricing({ prompt: "0.000001", completion: "0.000005", discount: 0.5, overrides: [{ min_prompt_tokens: 272000, prompt: "0.000002" }] }), "Input $1.00/1M · Output $5.00/1M · 50% off · >272K prompt: Input $2.00/1M");
  assert.equal(formatEndpointPricing([{ billable: "output_image", cost_usd: 0.04, unit: "image" }]), "output_image: $0.04/image");
  assert.equal(formatEndpointPricing([{ billable: "output_image", cost_usd: 0.041, unit: "image", variant: "768" }]), "768: output_image: $0.041/image");
  assert.equal(formatVideoSkuPrice("duration_seconds_720p", "0.0988"), "$0.0988/second");
  assert.equal(formatVideoSkuPrice("cents_per_video_output_second_720p", "3"), "$0.03/second");
  assert.equal(formatVideoSkuPrice("video_tokens", "0.0000107"), "$0.0000107/video token");
  assert.equal(formatVideoSkuPrice("reference_images", "0.04"), "$0.04/image");
  assert.equal(formatVideoSkuPrice("minimum_cents_per_generation", "5"), "$0.05 minimum/generation");
});

test("UTC pricing overrides apply only in their window and preserve base fields", () => {
  const pricing = {
    prompt: "0.0000003", completion: "0.0000012", input_cache_read: "0.000000006",
    overrides: [
      { utc_days: ["saturday", "sunday"], prompt: "0.00000015", completion: "0.0000006", input_cache_read: "0.000000003" },
      { utc_days: ["monday"], utc_start: 0, utc_end: 100, prompt: "0.00000015" },
      { utc_days: ["monday"], utc_start: 100, utc_end: 400, prompt: "0.0000003" },
      { utc_days: ["monday"], utc_start: 100, utc_end: 400, completion: "0.0000006" },
    ],
  };
  assert.deepEqual(effectiveTokenPricing(pricing, new Date("2026-10-18T12:00:00Z")), { prompt: "0.00000015", completion: "0.0000006", input_cache_read: "0.000000003" });
  assert.deepEqual(effectiveTokenPricing(pricing, new Date("2026-10-19T00:30:00Z")), { prompt: "0.00000015", completion: "0.0000012", input_cache_read: "0.000000006" });
  assert.deepEqual(effectiveTokenPricing(pricing, new Date("2026-10-19T01:00:00Z")), { prompt: "0.0000003", completion: "0.0000006", input_cache_read: "0.000000006" });
  assert.equal(nextPricingChange(pricing, new Date("2026-10-19T00:30:00Z")).toISOString(), "2026-10-19T01:00:00.000Z");
  assert.match(formatEndpointPricing(pricing), /Sat–Sun all day UTC/);
  assert.doesNotMatch(formatEndpointPricing(pricing), /≥— prompt|utc_start: \$/);
  assert.equal(pricingScheduleRows(pricing).length, 4);
});

test("media ability filters and price labels use reported modalities and SKU fields", () => {
  assert.deepEqual(mediaAbilities({ inputModalities: ["text", "image"], outputModalities: ["image"], imageInputReferencesMin: 1 }), { t2i: false, i2i: true, t2v: false, i2v: false, v2v: false });
  assert.deepEqual(mediaAbilities({ inputModalities: ["text", "image", "video"], outputModalities: ["video"] }), { t2i: false, i2i: false, t2v: true, i2v: true, v2v: true });
  assert.deepEqual(describeVideoSku("image_to_video_duration_seconds_1080p"), { group: "I2V", label: "1080p" });
  assert.deepEqual(describeVideoSku("video_tokens_4k_with_video_input"), { group: "V2V", label: "4K" });
  assert.deepEqual(describeVideoSku("duration_seconds_with_audio_720p"), { group: "Mode unspecified", label: "720p · With audio" });
  assert.equal(formatDurationOptions([5, 10]), "5s, 10s");
  assert.equal(formatDurationOptions([4, 5, 6, 7]), "4–7s");
});

test("zero token placeholders on media models are not shown as free pricing", () => {
  const media = { outputModalities: ["video"], pricing: { input: "0", output: "0" } };
  assert.equal(tokenRateForDisplay(media, "input"), null);
  assert.equal(tokenRateForDisplay(media, "output"), null);
  assert.equal(tokenRateForDisplay({ outputModalities: ["image", "text"], pricing: { input: "0.000001", output: "0" } }, "input"), "0.000001");
  assert.equal(tokenRateForDisplay({ outputModalities: ["text"], pricing: { input: "0", output: "0" } }, "input"), "0");
  const models = [{ id: "vendor/media" }, { id: "vendor/text" }];
  const payload = { reference: { models: { "vendor/media": media, "vendor/text": { outputModalities: ["text"], pricing: { input: "0.000001" } } } } };
  const filters = { query: "", inputModality: "all", outputModality: "all", minContext: 0, maxInputPrice: "", sort: "price" };
  assert.deepEqual(filterAndSortModels(models, payload, filters).map(modelId), ["vendor/text", "vendor/media"]);
  assert.deepEqual(filterAndSortModels(models, payload, { ...filters, maxInputPrice: "2" }).map(modelId), ["vendor/text"]);
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
  const base = { query: "", inputModality: "all", outputModality: "all", minContext: 0, maxInputPrice: "", sort: "price" };
  assert.deepEqual(filterAndSortModels(models, payload, base).map(modelId), ["vendor/cheap", "other/expensive:batch", "vendor/unknown"]);
  assert.deepEqual(filterAndSortModels(models, payload, { ...base, inputModality: "image" }).map(modelId), ["vendor/cheap"]);
  assert.deepEqual(filterAndSortModels(models, payload, { ...base, outputModality: "text" }).map(modelId), ["vendor/cheap", "other/expensive:batch"]);
  assert.deepEqual(filterAndSortModels(models, payload, { ...base, outputModality: "video" }).map(modelId), []);
  assert.deepEqual(filterAndSortModels(models, payload, { ...base, maxInputPrice: "2" }).map(modelId), ["vendor/cheap"]);
  assert.deepEqual(filterAndSortModels(models, payload, { ...base, minContext: 200_000 }).map(modelId), ["other/expensive:batch"]);
});

test("gateway pagination clamps page boundaries", () => {
  const models = Array.from({ length: 51 }, (_, index) => ({ id: String(index + 1) }));
  assert.deepEqual(paginateModels(models, 3, 25), { page: 3, pageCount: 3, items: [{ id: "51" }] });
  assert.equal(paginateModels(models, 9, 25).page, 3);
});
