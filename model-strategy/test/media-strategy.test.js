import assert from "node:assert/strict";
import test from "node:test";

import { selectMediaModels } from "../src/lib/media-strategy.js";

test("media selection uses canonical image usage, preserves multiple abilities, and never repeats an ID", () => {
  const imageModels = Array.from({ length: 17 }, (_, index) => ({ id: `image/${index}`, supported_parameters: index === 0 ? { input_references: { type: "range", min: 1, max: 1 } } : {} }));
  const videoModels = [{ id: "image/0", generate_audio: false }, ...Array.from({ length: 11 }, (_, index) => ({ id: `video/${index}`, generate_audio: index % 2 === 0 }))];
  const models = [
    ...imageModels.map(({ id }) => ({ id, canonical_slug: `${id}-canonical`, created: 1_700_000_000, architecture: { input_modalities: ["text", "image"], output_modalities: ["image", ...(id === "image/0" ? ["video"] : [])] } })),
    ...videoModels.slice(1).map(({ id }) => ({ id, created: 1_700_000_000, architecture: { input_modalities: ["text", "image", "video"], output_modalities: ["video"] } })),
  ];
  const imageUsage = { meta: { end_date: "2026-09-29" }, data: [{ date: "2026-09-29", model_permaslug: "image/0-canonical", total_tokens: "1000" }] };
  const result = selectMediaModels({ models, imageModels, videoModels, imageUsage }, 1_800_000_000_000);
  assert.equal(result.image.length, 15);
  assert.equal(result.video.length, 10);
  assert.equal(new Set([...result.image, ...result.video].map((model) => model.id)).size, 25);
  assert.equal(result.image.find((model) => model.id === "image/0").weeklyTokens, 1000);
  assert.equal(result.image.find((model) => model.id === "image/0").abilities.i2i, true);
  assert.equal(result.image.find((model) => model.id === "image/0").abilities.t2i, false);
  assert.equal(result.video[0].abilities.v2v, true);
  assert.equal(result.video.some((model) => model.generateAudio === false), true);
});
