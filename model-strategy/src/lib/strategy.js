export const CATEGORY_ORDER = ["flagship", "reasoning", "balanced", "economy", "code", "free"];
export const MODEL_COUNT = 30;

export const DEFAULT_STRATEGY = {
  quotas: {
    flagship: 8,
    reasoning: 4,
    balanced: 6,
    economy: 4,
    code: 3,
    free: 5,
  },
  weights: {
    weekly: 25,
    monthly: 20,
    newModel: 15,
    quality: 15,
    reliability: 10,
    performance: 10,
    value: 5,
  },
  filters: {
    requirePrice: true,
    requireAvailable: true,
    requireTextOutput: true,
    minimumContext: 32_000,
  },
};

const FLAGSHIP_AUTHORS = new Set([
  "anthropic",
  "deepseek",
  "google",
  "minimax",
  "mistralai",
  "moonshotai",
  "openai",
  "qwen",
  "x-ai",
  "z-ai",
]);

const BLOCKED_ID = /(^openrouter\/|^stealth\/|\b(alpha|beta)\b|:(nitro|floor|thinking|extended)$)/i;
const CODE_ID = /(code|coder|codestral|devstral|programming)/i;

export function totalValues(values) {
  return Object.values(values).reduce((sum, value) => sum + Number(value || 0), 0);
}

export function validateStrategy(config) {
  const errors = [];
  if (totalValues(config.quotas) !== MODEL_COUNT) errors.push(`Category seats must total ${MODEL_COUNT}.`);
  if (totalValues(config.weights) !== 100) errors.push("Scoring weights must total 100.");
  for (const key of CATEGORY_ORDER) {
    if (!Number.isInteger(config.quotas[key]) || config.quotas[key] < 0) {
      errors.push(`${key} seats must be a non-negative integer.`);
    }
  }
  return errors;
}

export function strategyDataFingerprint(candidates) {
  return JSON.stringify(candidates
    .map((model) => ({
      id: model.id,
      name: model.name,
      canonicalSlug: model.canonicalSlug,
      inputPrice: model.inputPrice,
      outputPrice: model.outputPrice,
      contextLength: model.contextLength,
      ageDays: model.ageDays,
      weeklyRank: model.weeklyRank,
      monthlyRank: model.monthlyRank,
      newestRank: model.newestRank,
      intelligenceRank: model.intelligenceRank,
      throughputRank: model.throughputRank,
      latencyRank: model.latencyRank,
      supportsReasoning: model.supportsReasoning,
      eligibility: model.eligibility,
      hardGateReasons: model.hardGateReasons,
      health: model.health ? {
        available: model.health.available,
        healthyEndpointCount: model.health.healthyEndpointCount,
        uptime: Math.round(model.health.uptime * 100) / 100,
      } : null,
      inferenceHealth: model.inferenceHealth ? {
        available: model.inferenceHealth.available,
        attempts: model.inferenceHealth.attempts,
        successes: model.inferenceHealth.successes,
      } : null,
      inputModalities: model.raw.architecture?.input_modalities ?? [],
      supportedParameters: model.raw.supported_parameters ?? [],
    }))
    .sort((left, right) => left.id.localeCompare(right.id)));
}

export function applyFreeInferenceHealth(candidates, inferenceHealth) {
  return candidates.map((model) => {
    if (!model.eligibility.free) return model;
    const probe = inferenceHealth.get(model.id);
    const hardGateReasons = [...model.hardGateReasons];
    if (!probe?.verified) hardGateReasons.push("Inference not verified");
    else if (!probe.available) hardGateReasons.push(probe.reason || "Inference unavailable");
    return { ...model, inferenceHealth: probe ?? null, hardGateReasons };
  });
}

export function compareSelectedModels(previous, next) {
  const previousById = new Map(previous.map((model) => [model.id, model]));
  return Object.fromEntries(next.flatMap((model) => {
    const before = previousById.get(model.id);
    if (!before) return [[model.id, { label: "New", detail: "Newly selected model" }]];
    if (before.category !== model.category) {
      return [[model.id, { label: "Category", detail: `${before.category} → ${model.category}` }]];
    }
    if (before.inputPrice !== model.inputPrice || before.outputPrice !== model.outputPrice) {
      return [[model.id, {
        label: "Price",
        detail: `Input/output ${before.inputPrice}/${before.outputPrice} → ${model.inputPrice}/${model.outputPrice}`,
      }]];
    }
    return [];
  }));
}

export function selectionRefreshFingerprint(models) {
  return JSON.stringify(models
    .map((model) => [model.id, model.category, model.inputPrice, model.outputPrice])
    .sort((left, right) => left[0].localeCompare(right[0])));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function finiteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function perMillion(value) {
  const parsed = finiteNumber(value);
  return parsed === null ? null : parsed * 1_000_000;
}

function rankMap(models) {
  return new Map(asArray(models).map((model, index) => [model.id, index + 1]));
}

function rankScore(rank, count) {
  if (!rank || count < 2) return 0;
  return Math.max(0, 1 - (rank - 1) / (count - 1));
}

function normalizeNumber(value, min, max) {
  if (value === null || max <= min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function rankWithin(value, maximum) {
  return typeof value === "number" && value > 0 && value <= maximum;
}

function monthlyRanks(rows) {
  const totals = new Map();
  for (const row of asArray(rows)) {
    const slug = typeof row.model_permaslug === "string" ? row.model_permaslug : "";
    if (!slug || slug === "other") continue;
    const amount = finiteNumber(row.total_tokens) ?? 0;
    totals.set(slug, (totals.get(slug) ?? 0) + amount);
  }
  const sorted = [...totals.entries()].sort((left, right) => right[1] - left[1]);
  return {
    count: sorted.length,
    ranks: new Map(sorted.map(([slug], index) => [slug, index + 1])),
    totals,
  };
}

function getBenchmark(model, key) {
  return finiteNumber(model.benchmarks?.artificial_analysis?.[key]);
}

function categoryEligibility(model, pricePercentile) {
  const provider = model.id.split("/")[0];
  const intelligence = getBenchmark(model.raw, "intelligence_index") ?? 0;
  const coding = getBenchmark(model.raw, "coding_index") ?? 0;
  const free = model.inputPrice === 0 && model.outputPrice === 0;
  const code = CODE_ID.test(`${model.id} ${model.name}`) || coding >= 55;
  const flagship = !free && FLAGSHIP_AUTHORS.has(provider) && (
    intelligence >= 40 || rankWithin(model.weeklyRank, 25) || rankWithin(model.monthlyRank, 25) || model.ageDays <= 30
  );
  const reasoning = !free && model.supportsReasoning && (
    intelligence >= 25 || rankWithin(model.weeklyRank, 75) || rankWithin(model.monthlyRank, 75)
  );
  const economy = !free && pricePercentile <= 0.4;

  return {
    free,
    flagship,
    code: !free && code,
    reasoning,
    economy,
    balanced: !free,
  };
}

function hardGateReasons(model, config, nowMs) {
  const reasons = [];
  const input = asArray(model.architecture?.input_modalities).map(String);
  const output = asArray(model.architecture?.output_modalities).map(String);
  const inputPrice = perMillion(model.pricing?.prompt);
  const outputPrice = perMillion(model.pricing?.completion);
  const expirationMs = model.expiration_date ? Date.parse(model.expiration_date) : null;

  if (typeof model.id !== "string" || !model.id.includes("/")) reasons.push("Invalid model ID");
  if (BLOCKED_ID.test(`${model.id ?? ""} ${model.name ?? ""}`)) reasons.push("Dynamic or experimental model");
  if (config.filters.requireTextOutput && !output.includes("text")) reasons.push("No text output");
  if (!input.includes("text")) reasons.push("No text input");
  if (config.filters.requirePrice && (inputPrice === null || outputPrice === null || inputPrice < 0 || outputPrice < 0)) {
    reasons.push("Price unavailable");
  }
  if ((finiteNumber(model.context_length) ?? 0) < config.filters.minimumContext) reasons.push("Context below minimum");
  if (expirationMs && expirationMs < nowMs + 14 * 86_400_000) reasons.push("Expires within 14 days");
  if (config.filters.requireAvailable && !model.top_provider) reasons.push("No active top provider");
  return reasons;
}

export function prepareCandidates(source, config, endpointHealth = new Map(), nowMs = Date.now()) {
  const weeklyModels = asArray(source.weekly?.data);
  const newestModels = asArray(source.newest?.data);
  const intelligenceModels = asArray(source.intelligence?.data);
  const throughputModels = asArray(source.throughput?.data);
  const latencyModels = asArray(source.latency?.data);
  const weekly = rankMap(weeklyModels);
  const newest = rankMap(newestModels);
  const intelligence = rankMap(intelligenceModels);
  const throughput = rankMap(throughputModels);
  const latency = rankMap(latencyModels);
  const monthly = monthlyRanks(source.monthly?.data);
  const qualityValues = weeklyModels.map((model) => getBenchmark(model, "intelligence_index")).filter((value) => value !== null);
  const qualityMin = Math.min(...qualityValues, 0);
  const qualityMax = Math.max(...qualityValues, 100);

  const preliminary = weeklyModels.map((raw) => {
    const canonicalSlug = raw.canonical_slug || raw.id;
    const inputPrice = perMillion(raw.pricing?.prompt);
    const outputPrice = perMillion(raw.pricing?.completion);
    const weightedPrice = inputPrice === null || outputPrice === null ? Number.POSITIVE_INFINITY : inputPrice * 0.4 + outputPrice * 0.6;
    const createdMs = finiteNumber(raw.created) ? Number(raw.created) * 1000 : nowMs;
    const ageDays = Math.max(0, Math.floor((nowMs - createdMs) / 86_400_000));
    const monthlyRank = monthly.ranks.get(canonicalSlug) ?? monthly.ranks.get(raw.id) ?? null;
    const health = endpointHealth.get(raw.id);
    return {
      id: raw.id,
      canonicalSlug,
      name: raw.name || raw.id,
      description: raw.description || "",
      raw,
      provider: raw.id?.split("/")[0] || "unknown",
      inputPrice,
      outputPrice,
      weightedPrice,
      contextLength: finiteNumber(raw.context_length) ?? 0,
      ageDays,
      weeklyRank: weekly.get(raw.id) ?? null,
      monthlyRank,
      newestRank: newest.get(raw.id) ?? null,
      intelligenceRank: intelligence.get(raw.id) ?? null,
      throughputRank: throughput.get(raw.id) ?? null,
      latencyRank: latency.get(raw.id) ?? null,
      supportsReasoning: asArray(raw.supported_parameters).some((value) => ["reasoning", "include_reasoning", "reasoning_effort"].includes(value)),
      health,
      hardGateReasons: hardGateReasons(raw, config, nowMs),
    };
  });

  const priced = preliminary.filter((model) => Number.isFinite(model.weightedPrice)).sort((left, right) => left.weightedPrice - right.weightedPrice);
  const priceRank = new Map(priced.map((model, index) => [model.id, index]));
  const priceDivisor = Math.max(1, priced.length - 1);

  return preliminary.map((model) => {
    const pricePercentile = (priceRank.get(model.id) ?? priceDivisor) / priceDivisor;
    const eligibility = categoryEligibility(model, pricePercentile);
    const qualityIndex = getBenchmark(model.raw, "intelligence_index");
    const components = {
      weekly: rankScore(model.weeklyRank, weekly.size),
      monthly: rankScore(model.monthlyRank, monthly.count),
      newModel: Math.exp(-model.ageDays / 30),
      quality: qualityIndex === null
        ? rankScore(model.intelligenceRank, intelligence.size)
        : normalizeNumber(qualityIndex, qualityMin, qualityMax),
      reliability: model.health?.verified ? Math.max(0, Math.min(1, model.health.uptime / 100)) : 0.5,
      performance: (rankScore(model.throughputRank, throughput.size) + rankScore(model.latencyRank, latency.size)) / 2,
      value: 1 - pricePercentile,
    };
    const score = Object.entries(config.weights).reduce((sum, [key, weight]) => sum + components[key] * weight, 0);
    const hardGateReasons = [...model.hardGateReasons];
    if (model.health?.verified && !model.health.available) hardGateReasons.push(model.health.reason || "No healthy endpoint");
    return {
      ...model,
      eligibility,
      components,
      score,
      hardGateReasons,
    };
  });
}

const ALLOCATION_ORDER = ["free", "code", "flagship", "reasoning", "economy", "balanced"];

export function selectPortfolio(candidates, config) {
  const selected = [];
  const selectedIds = new Set();
  const sorted = candidates
    .filter((model) => model.hardGateReasons.length === 0)
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
  const shortages = [];

  for (const category of ALLOCATION_ORDER) {
    const target = config.quotas[category];
    const matches = sorted.filter((model) => !selectedIds.has(model.id) && model.eligibility[category]);
    const chosen = matches.slice(0, target);
    for (const model of chosen) {
      selectedIds.add(model.id);
      selected.push({ ...model, category });
    }
    if (chosen.length < target) shortages.push({ category, target, found: chosen.length });
  }

  selected.sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
  const selectedWithRank = selected.map((model, index) => ({ ...model, rank: index + 1 }));
  const rejected = candidates
    .filter((model) => !selectedIds.has(model.id))
    .map((model) => ({
      ...model,
      rejectionReason: model.hardGateReasons[0] || "Lower score than category cutoff",
    }))
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));

  return { selected: selectedWithRank, rejected, shortages };
}

export function buildChatModelsJson(selected) {
  const defaultModel = selected.find((model) => ["balanced", "economy"].includes(model.category) && model.health?.available)
    ?? selected[0];
  const recommended = selected.find((model) => model.category === "flagship") ?? selected[0];

  return Object.fromEntries(selected.map((model, index) => {
    const inputModalities = asArray(model.raw.architecture?.input_modalities);
    const params = asArray(model.raw.supported_parameters);
    const reasoning = model.supportsReasoning;
    const requestPatches = {
      webSearch: {
        tools: [{ type: "openrouter:web_search", parameters: { engine: "exa", max_results: 5 } }],
      },
      ...(reasoning ? { reasoning: { reasoning: { effort: "medium" } } } : {}),
    };
    return [model.id, {
      displayName: model.name,
      description: model.description,
      tier: model.category,
      recommended: model.id === recommended?.id,
      chatEnabled: true,
      chatRank: (index + 1) * 10,
      chatDefault: model.id === defaultModel?.id,
      capabilities: {
        files: inputModalities.includes("file"),
        vision: inputModalities.includes("image"),
        audio: inputModalities.includes("audio"),
        webSearch: true,
        reasoning,
      },
      requestPatches,
      contextLength: model.contextLength,
      selection: {
        score: Number(model.score.toFixed(2)),
        weeklyRank: model.weeklyRank,
        monthlyRank: model.monthlyRank,
        newestRank: model.newestRank,
        intelligenceRank: model.intelligenceRank,
        inferenceHealth: model.inferenceHealth ? {
          available: model.inferenceHealth.available,
          attempts: model.inferenceHealth.attempts,
          successes: model.inferenceHealth.successes,
          latencyMs: model.inferenceHealth.latencyMs,
          provider: model.inferenceHealth.provider,
          checkedAt: model.inferenceHealth.checkedAt,
        } : null,
      },
    }];
  }));
}
