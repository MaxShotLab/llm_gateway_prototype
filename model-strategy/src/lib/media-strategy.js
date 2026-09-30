export const MEDIA_COUNTS = { image: 15, video: 10 };

function rankScores(models, field) {
  const ranked = [...models].filter((model) => model[field] > 0).sort((a, b) => b[field] - a[field]);
  return new Map(ranked.map((model, index) => [model.id, { rank: index + 1, score: 1 - index / Math.max(1, ranked.length - 1) }]));
}

function usageTotals(rows, endDate) {
  const totals = new Map();
  const weekStart = new Date(`${endDate}T00:00:00Z`);
  weekStart.setUTCDate(weekStart.getUTCDate() - 6);
  const firstWeekDay = weekStart.toISOString().slice(0, 10);
  for (const row of rows) {
    if (!row.model_permaslug || row.model_permaslug === "other") continue;
    const value = Number(row.total_tokens);
    if (!Number.isFinite(value) || value < 0) continue;
    const total = totals.get(row.model_permaslug) ?? { weekly: 0, monthly: 0 };
    total.monthly += value;
    if (row.date >= firstWeekDay && row.date <= endDate) total.weekly += value;
    totals.set(row.model_permaslug, total);
  }
  return totals;
}

function freshness(created, nowSeconds) {
  const ageDays = Math.max(0, (nowSeconds - Number(created || 0)) / 86_400);
  return Math.exp(-ageDays / 180);
}

function abilities(input, output) {
  return {
    t2i: output.includes("image") && input.includes("text"),
    i2i: output.includes("image") && input.includes("image"),
    t2v: output.includes("video") && input.includes("text"),
    i2v: output.includes("video") && input.includes("image"),
    v2v: output.includes("video") && input.includes("video"),
  };
}

export function selectMediaModels({ models, imageModels, videoModels, imageUsage }, now = Date.now()) {
  const imageById = new Map(imageModels.map((model) => [model.id, model]));
  const videoById = new Map(videoModels.map((model) => [model.id, model]));
  const usage = usageTotals(imageUsage.data, imageUsage.meta.end_date);
  const nowSeconds = now / 1_000;
  const image = [];
  const video = [];

  for (const model of models) {
    const input = model.architecture?.input_modalities ?? [];
    const output = model.architecture?.output_modalities ?? [];
    if (model.expiration_date && Number(model.expiration_date) * 1_000 <= now) continue;
    const capability = abilities(input, output);
    const base = {
      id: model.id,
      name: model.name,
      description: model.description,
      created: model.created,
      abilities: capability,
      inputModalities: input,
      outputModalities: output,
    };
    if (capability.t2i || capability.i2i) {
      const detail = imageById.get(model.id);
      const requiresReference = Number(detail?.supported_parameters?.input_references?.min) > 0;
      const totals = usage.get(model.canonical_slug ?? model.id) ?? { weekly: 0, monthly: 0 };
      const imageAbilities = { ...capability, t2i: capability.t2i && !requiresReference };
      if (imageAbilities.t2i || imageAbilities.i2i) image.push({
        ...base,
        abilities: imageAbilities,
        weeklyTokens: totals.weekly,
        monthlyTokens: totals.monthly,
        imageOutputPrice: model.pricing?.image_output ?? null,
        inImageApi: Boolean(detail),
        supportedParameters: detail?.supported_parameters ?? {},
        supportsStreaming: detail?.supports_streaming ?? null,
      });
    }
    if (videoById.has(model.id) && (capability.t2v || capability.i2v || capability.v2v)) {
      const detail = videoById.get(model.id);
      video.push({
        ...base,
        generateAudio: detail.generate_audio,
        supportedDurations: detail.supported_durations ?? [],
        supportedResolutions: detail.supported_resolutions ?? [],
        supportedFrameImages: detail.supported_frame_images ?? [],
        pricingSkus: detail.pricing_skus ?? {},
      });
    }
  }

  const weekly = rankScores(image, "weeklyTokens");
  const monthly = rankScores(image, "monthlyTokens");
  for (const model of image) {
    model.weeklyRank = weekly.get(model.id)?.rank ?? null;
    model.monthlyRank = monthly.get(model.id)?.rank ?? null;
    model.score = Math.round(100 * (
      0.45 * (weekly.get(model.id)?.score ?? 0) +
      0.25 * (monthly.get(model.id)?.score ?? 0) +
      0.20 * freshness(model.created, nowSeconds) +
      0.10 * (Number(model.abilities.t2i) + Number(model.abilities.i2i)) / 2
    ));
  }
  for (const model of video) {
    const breadth = (Number(model.abilities.t2v) + Number(model.abilities.i2v) + Number(model.abilities.v2v)) / 3;
    const specs = (Number(model.supportedDurations.length > 0) + Number(model.supportedResolutions.length > 0) + Number(model.supportedFrameImages.length > 0)) / 3;
    model.score = Math.round(100 * (0.60 * freshness(model.created, nowSeconds) + 0.25 * breadth + 0.15 * specs));
  }
  const order = (a, b) => b.score - a.score || b.created - a.created || a.id.localeCompare(b.id);
  const selectedImage = image.sort(order).slice(0, MEDIA_COUNTS.image);
  const imageIds = new Set(selectedImage.map((model) => model.id));
  return {
    image: selectedImage,
    video: video.sort(order).filter((model) => !imageIds.has(model.id)).slice(0, MEDIA_COUNTS.video),
    candidates: { image: image.length, video: video.length },
  };
}
