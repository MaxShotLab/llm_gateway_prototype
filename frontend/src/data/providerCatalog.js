const generatedAt = "2026-11-14T00:00:00Z";
const charge = (kind, amount, unit, condition) => ({ kind, amount, unit, ...(condition ? { condition } : {}) });
const rates = (components) => ({ rateCardVersion: "sample-v1", currency: "USD", effectiveAt: generatedAt, components });
const observed = (dispatchedAttempts, deliveredSuccessPercent, latencySamples, p50Ms, p95Ms, latencyMetric) => ({
  windowStart: "2026-11-07T00:00:00Z", windowEnd: generatedAt, dispatchedAttempts,
  deliveredSuccessPercent, latencyMetric, latencySamples, p50Ms, p95Ms,
});
const sampleOffering = (offeringId, providerId, modelId, capabilities, components, details = {}) => ({
  offeringId, providerId, modelId, variantLabel: "Sample tier",
  admissionStatus: "pending", availability: "unavailable", policyEligible: true, capabilities, limits: {},
  dataPolicy: { regions: [], retentionLabel: "Pending review" },
  customerRateCard: rates(components), performance: null, ...details,
});
const usPolicy = { regions: ["US"], retentionLabel: "Zero retention" };
const euPolicy = { regions: ["EU"], retentionLabel: "Zero retention" };
const textRates = (input, output, cache) => [charge("input_tokens", input, "per_1m_tokens"), charge("output_tokens", output, "per_1m_tokens"), charge("cache_read_tokens", cache, "per_1m_tokens")];
const imageRates = (low, high) => [charge("output_image", low, "per_image", "1024 px"), charge("output_image", high, "per_image", "2048 px")];
const videoRates = (low, high) => [charge("output_video", low, "per_second", "720p"), charge("output_video", high, "per_second", "1080p")];

// Simulated Gateway read snapshot. No row is a live provider claim.
export const providerSnapshot = {
  catalogVersion: "sample-catalog-v1", generatedAt,
  providers: [
    { providerId: "openrouter", name: "OpenRouter", routeType: "aggregator", summary: "One approved upstream endpoint is pinned per offering, so Maxshot can verify the serving model and enforce its own fallback rules." },
    { providerId: "provider-b", name: "Provider B", routeType: "direct", summary: "Sample provider offering text and image inference through a direct Gateway connection." },
    { providerId: "provider-c", name: "Provider C", routeType: "direct", summary: "Sample provider offering text and video inference through a direct Gateway connection." },
  ],
  models: [
    { modelId: "aion-labs/aion-3.5-mini", displayName: "Aion 3.5 Mini", chatEligibilityIndex: "P", verifiedVersion: "sample-3.5-mini", modality: "text", description: "Text model with input, output, and cache-read rates.", catalogId: "catalog_text", offeringIds: ["or-aion"] },
    { modelId: "anthropic/claude-sonnet-4.6", displayName: "Claude Sonnet 4.6", chatEligibilityIndex: "P", verifiedVersion: "sample-4.6", modality: "text", description: "Text model with multiple provider routes; sample rates are illustrative.", catalogId: "catalog_text", offeringIds: ["or-sonnet", "b-sonnet"] },
    { modelId: "minimax/minimax-m3", displayName: "MiniMax-M3", chatEligibilityIndex: "B", verifiedVersion: "sample-m3", modality: "text", description: "Text model with input, output, and cache-read rates.", catalogId: "catalog_text", offeringIds: ["or-minimax", "c-minimax"] },
    { modelId: "google/gemini-3.1-pro", displayName: "Gemini 3.1 Pro", chatEligibilityIndex: "P", verifiedVersion: "sample-3.1", modality: "text", description: "Illustrative text model with a provider-specific customer rate.", catalogId: "catalog_text", offeringIds: ["or-gemini"] },
    { modelId: "deepseek/deepseek-v4-flash", displayName: "DeepSeek V4 Flash", chatEligibilityIndex: "P", verifiedVersion: "sample-v4-flash", modality: "text", description: "Illustrative low-cost text model.", catalogId: "catalog_text", offeringIds: ["or-deepseek"] },
    { modelId: "bytedance-seed/seedream-5-0-flash", displayName: "Seedream 5.0 Flash", verifiedVersion: "sample-5.0", modality: "image", description: "Image output is priced per generated image.", catalogId: "catalog_image", offeringIds: ["or-seedream"] },
    { modelId: "black-forest-labs/flux-3-image", displayName: "FLUX 3 Image", verifiedVersion: "sample-3", modality: "image", description: "Resolution can change the final price.", catalogId: "catalog_image", offeringIds: ["or-flux3", "b-flux3"] },
    { modelId: "black-forest-labs/flux.2-max", displayName: "FLUX.2 Max", verifiedVersion: "sample-2", modality: "image", description: "This model is priced per megapixel, not per image.", catalogId: "catalog_image", offeringIds: ["or-flux2"] },
    { modelId: "bytedance-seed/seedream-4-5", displayName: "Seedream 4.5", verifiedVersion: "sample-4.5", modality: "image", description: "Illustrative image model with per-image pricing.", catalogId: "catalog_image", offeringIds: ["or-seedream45"] },
    { modelId: "recraft/recraft-v4", displayName: "Recraft V4", verifiedVersion: "sample-v4", modality: "image", description: "Illustrative image model with per-image pricing.", catalogId: "catalog_image", offeringIds: ["or-recraft"] },
    { modelId: "alibaba/wan-3.0-prime", displayName: "Wan 3.0 Prime", verifiedVersion: "sample-3.0-prime", modality: "video", description: "Mode and resolution can change the final price.", catalogId: "catalog_video", offeringIds: ["or-wan-prime"] },
    { modelId: "alibaba/wan-3.0", displayName: "Wan 3.0", verifiedVersion: "sample-3.0", modality: "video", description: "Mode and resolution can change the final price.", catalogId: "catalog_video", offeringIds: ["or-wan3", "c-wan3"] },
    { modelId: "alibaba/wan-2.7", displayName: "Wan 2.7", verifiedVersion: "sample-2.7", modality: "video", description: "Video output is priced per generated second.", catalogId: "catalog_video", offeringIds: ["or-wan27"] },
    { modelId: "bytedance-seed/seedance-2-0-mini", displayName: "Seedance 2.0 Mini", verifiedVersion: "sample-2.0-mini", modality: "video", description: "Illustrative video model with per-second pricing.", catalogId: "catalog_video", offeringIds: ["or-seedance-mini"] },
    { modelId: "google/veo-3.1-fast", displayName: "Veo 3.1 Fast", verifiedVersion: "sample-3.1-fast", modality: "video", description: "Illustrative video model with per-second pricing.", catalogId: "catalog_video", offeringIds: ["or-veo-fast"] },
  ],
  offerings: [
    sampleOffering("or-aion", "openrouter", "aion-labs/aion-3.5-mini", ["streaming", "json"], textRates("0.70", "1.40", "0.18"), { variantLabel: "Sample text tier", admissionStatus: "passed", availability: "available", limits: { contextTokens: 128000, maxOutputTokens: 8000 }, dataPolicy: usPolicy }),
    sampleOffering("or-sonnet", "openrouter", "anthropic/claude-sonnet-4.6", ["streaming", "tools", "json"], textRates("3.00", "15.00", "0.30"), { variantLabel: "Verified standard tier", admissionStatus: "passed", availability: "available", limits: { contextTokens: 200000, maxOutputTokens: 8000 }, dataPolicy: usPolicy, performance: observed(280, "99.3", 278, 410, 920, "first_token") }),
    sampleOffering("b-sonnet", "provider-b", "anthropic/claude-sonnet-4.6", ["streaming", "tools", "json"], textRates("3.20", "14.50", "0.32"), { variantLabel: "Verified standard tier", admissionStatus: "passed", availability: "available", limits: { contextTokens: 200000, maxOutputTokens: 8000 }, dataPolicy: euPolicy, performance: observed(8, null, 8, null, null, "first_token") }),
    sampleOffering("or-minimax", "openrouter", "minimax/minimax-m3", ["streaming", "json"], textRates("0.30", "1.20", "0.06"), { variantLabel: "Verified standard tier", admissionStatus: "passed", availability: "available", limits: { contextTokens: 128000, maxOutputTokens: 8000 }, dataPolicy: usPolicy, performance: observed(146, "98.6", 144, 370, 1040, "first_token") }),
    sampleOffering("c-minimax", "provider-c", "minimax/minimax-m3", ["streaming", "json"], textRates("0.34", "1.10", "0.08"), { variantLabel: "Verified standard tier", admissionStatus: "passed", availability: "unavailable", unavailableReason: "paused", limits: { contextTokens: 128000, maxOutputTokens: 8000 }, dataPolicy: usPolicy, performance: observed(0, null, 0, null, null, "first_token") }),
    sampleOffering("or-gemini", "openrouter", "google/gemini-3.1-pro", ["streaming", "tools", "json"], textRates("1.25", "5.00", "0.25"), { variantLabel: "Sample text tier", admissionStatus: "passed", availability: "available", limits: { contextTokens: 1000000, maxOutputTokens: 8000 }, dataPolicy: usPolicy }),
    sampleOffering("or-deepseek", "openrouter", "deepseek/deepseek-v4-flash", ["streaming", "json"], textRates("0.20", "0.80", "0.04"), { variantLabel: "Sample text tier", admissionStatus: "passed", availability: "available", limits: { contextTokens: 128000, maxOutputTokens: 8000 }, dataPolicy: usPolicy }),
    sampleOffering("or-seedream", "openrouter", "bytedance-seed/seedream-5-0-flash", ["t2i", "i2i"], [charge("input_image", "0", "per_image"), charge("output_image", "0.018", "per_image")], { variantLabel: "Sample image tier", admissionStatus: "passed", availability: "available", limits: { maxImages: 2, maxResolutionPx: 2048 }, dataPolicy: usPolicy }),
    sampleOffering("or-flux3", "openrouter", "black-forest-labs/flux-3-image", ["t2i", "i2i"], imageRates("0.041", "0.082"), { variantLabel: "Verified image tier", admissionStatus: "passed", availability: "available", limits: { maxImages: 2, maxResolutionPx: 2048 }, dataPolicy: usPolicy, performance: observed(126, "98.4", 124, 9400, 21000, "completion") }),
    sampleOffering("b-flux3", "provider-b", "black-forest-labs/flux-3-image", ["t2i", "i2i"], imageRates("0.046", "0.092"), { variantLabel: "Verified image tier", admissionStatus: "passed", availability: "available", limits: { maxImages: 2, maxResolutionPx: 2048 }, dataPolicy: euPolicy, performance: observed(14, null, 14, null, null, "completion") }),
    sampleOffering("or-flux2", "openrouter", "black-forest-labs/flux.2-max", ["t2i", "i2i"], [charge("output_image", "0.07", "per_megapixel")], { variantLabel: "Sample image tier", admissionStatus: "passed", availability: "available", limits: { maxImages: 2, maxResolutionPx: 2048 }, dataPolicy: usPolicy }),
    sampleOffering("or-seedream45", "openrouter", "bytedance-seed/seedream-4-5", ["t2i", "i2i"], [charge("output_image", "0.024", "per_image")], { variantLabel: "Sample image tier", admissionStatus: "passed", availability: "available", limits: { maxImages: 2, maxResolutionPx: 2048 }, dataPolicy: usPolicy }),
    sampleOffering("or-recraft", "openrouter", "recraft/recraft-v4", ["t2i", "i2i"], [charge("output_image", "0.035", "per_image")], { variantLabel: "Sample image tier", admissionStatus: "passed", availability: "available", limits: { maxImages: 2, maxResolutionPx: 2048 }, dataPolicy: usPolicy }),
    sampleOffering("or-wan-prime", "openrouter", "alibaba/wan-3.0-prime", ["t2v", "i2v"], videoRates("0.068", "0.102"), { variantLabel: "Sample video tier", admissionStatus: "passed", availability: "available", limits: { maxDurationSeconds: 8 }, dataPolicy: usPolicy }),
    sampleOffering("or-wan3", "openrouter", "alibaba/wan-3.0", ["t2v", "i2v"], videoRates("0.05", "0.075"), { variantLabel: "Sample video tier", admissionStatus: "passed", availability: "available", limits: { maxDurationSeconds: 8 }, dataPolicy: usPolicy }),
    sampleOffering("c-wan3", "provider-c", "alibaba/wan-3.0", ["t2v", "i2v"], videoRates("0.054", "0.081")),
    sampleOffering("or-wan27", "openrouter", "alibaba/wan-2.7", ["t2v", "i2v"], [charge("output_video", "0.10", "per_second")], { variantLabel: "Sample video tier", admissionStatus: "passed", availability: "available", limits: { maxDurationSeconds: 8 }, dataPolicy: usPolicy }),
    sampleOffering("or-seedance-mini", "openrouter", "bytedance-seed/seedance-2-0-mini", ["t2v", "i2v"], videoRates("0.045", "0.070"), { variantLabel: "Sample video tier", admissionStatus: "passed", availability: "available", limits: { maxDurationSeconds: 8 }, dataPolicy: usPolicy }),
    sampleOffering("or-veo-fast", "openrouter", "google/veo-3.1-fast", ["t2v", "i2v"], videoRates("0.11", "0.16"), { variantLabel: "Sample video tier", admissionStatus: "passed", availability: "available", limits: { maxDurationSeconds: 8 }, dataPolicy: usPolicy }),
  ],
};

export const getUsableModels = (snapshot, modality) => snapshot.models.filter((model) =>
  model.modality === modality && snapshot.offerings.some((offering) =>
    offering.modelId === model.modelId && offering.admissionStatus === "passed" && offering.availability === "available" && offering.policyEligible === true));

const displayCapability = (value) => ({ t2i: "T2I", i2i: "I2I", t2v: "T2V", i2v: "I2V", json: "JSON" })[value] || value[0].toUpperCase() + value.slice(1);
const displayLimits = (limits) => [
  limits.contextTokens && `${Math.round(limits.contextTokens / 1000)}k context`, limits.maxOutputTokens && `${Math.round(limits.maxOutputTokens / 1000)}k output`,
  limits.maxImages && `Up to ${limits.maxImages} images`, limits.maxResolutionPx && `${limits.maxResolutionPx} px`,
  limits.maxDurationSeconds && `Up to ${limits.maxDurationSeconds}s`,
].filter(Boolean).join(" · ") || "Sample limits pending";
const displayLatency = (ms) => ms == null ? null : ms >= 5000 ? `${Number((ms / 1000).toFixed(1))} s` : `${ms.toLocaleString("en-US")} ms`;
const initials = (name) => name.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();

// Presentation mapping; replace providerSnapshot with the Gateway read snapshot when available.
export const providerProfiles = providerSnapshot.providers.map((provider) => {
  const offerings = providerSnapshot.offerings.filter((offering) => offering.providerId === provider.providerId);
  const focus = [...new Set(offerings.map((offering) => providerSnapshot.models.find((model) => model.modelId === offering.modelId).modality))];
  return { id: provider.providerId, name: provider.name, initials: initials(provider.name), type: provider.routeType === "aggregator" ? "Aggregator route" : "Direct inference", summary: provider.summary, focus: focus.map(displayCapability).join(" · ") };
});

export const providerOfferings = providerSnapshot.offerings.map((offering) => ({
  id: offering.offeringId, model: offering.modelId,
  provider: providerSnapshot.providers.find((provider) => provider.providerId === offering.providerId).name,
  variant: offering.variantLabel, admitted: offering.admissionStatus === "passed",
  available: offering.admissionStatus === "passed" && offering.availability === "available",
  unavailableReason: offering.unavailableReason,
  capabilities: [displayCapability(providerSnapshot.models.find((model) => model.modelId === offering.modelId).modality), ...offering.capabilities.map(displayCapability)], limits: displayLimits(offering.limits),
  policy: `${offering.dataPolicy.regions.join(", ") || "Region pending"} · ${offering.dataPolicy.retentionLabel.toLowerCase()}`,
  attempts: offering.performance?.dispatchedAttempts ?? 0,
  latencySamples: offering.performance?.latencySamples ?? 0,
  success: offering.performance?.deliveredSuccessPercent == null ? null : `${offering.performance.deliveredSuccessPercent}%`,
  p50: displayLatency(offering.performance?.p50Ms), p95: displayLatency(offering.performance?.p95Ms),
  latencyType: offering.performance?.latencyMetric === "first_token" ? "First token" : "Completion",
  window: offering.performance ? `${Math.round((Date.parse(offering.performance.windowEnd) - Date.parse(offering.performance.windowStart)) / 86400000)}-day sample` : null,
}));

export const modelCatalog = providerSnapshot.models.map((model) => {
  const offerings = providerSnapshot.offerings.filter((offering) => offering.modelId === model.modelId);
  const shared = offerings[0].capabilities.filter((capability) => offerings.every((offering) => offering.capabilities.includes(capability)));
  return {
    id: model.modelId, type: displayCapability(model.modality), detail: model.description,
    abilities: model.modality === "text" ? null : shared.map(displayCapability),
    providers: offerings.map((offering) => ({
      id: offering.offeringId,
      name: providerSnapshot.providers.find((provider) => provider.providerId === offering.providerId).name,
      admitted: offering.admissionStatus === "passed",
      available: offering.admissionStatus === "passed" && offering.availability === "available",
      rateCard: offering.customerRateCard,
    })),
  };
});
