const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const DAY_MS = 86_400_000;

export const MODEL_COUNT = 30;
export const DISPLAY_ORDER = ["flagship", "reasoning", "balanced", "economy", "code", "free"];
export const ALLOCATION_ORDER = ["free", "code", "flagship", "reasoning", "economy", "balanced"];

export const DEFAULT_STRATEGY = {
  quotas: { flagship: 8, reasoning: 4, balanced: 6, economy: 4, code: 3, free: 5 },
  weights: { weekly: 25, monthly: 20, newModel: 15, quality: 15, reliability: 10, performance: 10, value: 5 },
  minimumContext: 32_000,
};

const FLAGSHIP_PROVIDERS = new Set([
  "anthropic", "deepseek", "google", "minimax", "mistralai",
  "moonshotai", "openai", "qwen", "x-ai", "z-ai",
]);
const BLOCKED_MODEL = /(^openrouter\/|^stealth\/|\b(alpha|beta)\b|:(nitro|floor|thinking|extended)$)/i;
const CODE_MODEL = /(code|coder|codestral|devstral|programming)/i;

const asArray = (value) => Array.isArray(value) ? value : [];
const finiteNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
const perMillion = (value) => {
  const number = finiteNumber(value);
  return number === null ? null : number * 1_000_000;
};
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function validateStrategy(config) {
  const quotaTotal = Object.values(config.quotas).reduce((sum, value) => sum + value, 0);
  const weightTotal = Object.values(config.weights).reduce((sum, value) => sum + value, 0);
  if (DISPLAY_ORDER.some((category) => !Number.isInteger(config.quotas[category]) || config.quotas[category] < 0)) {
    throw new Error("Category quotas must be non-negative integers.");
  }
  if (Object.values(config.weights).some((weight) => !Number.isFinite(weight) || weight < 0)) {
    throw new Error("Scoring weights must be finite non-negative numbers.");
  }
  if (quotaTotal !== MODEL_COUNT) throw new Error(`Category quotas must total ${MODEL_COUNT}.`);
  if (weightTotal !== 100) throw new Error("Scoring weights must total 100.");
}

function rankMap(models) {
  return new Map(asArray(models).map((model, index) => [model.id, index + 1]));
}

function rankScore(rank, count) {
  if (!rank || count < 2) return 0;
  return Math.max(0, 1 - (rank - 1) / (count - 1));
}

function normalize(value, minimum, maximum) {
  if (value === null || maximum <= minimum) return 0;
  return Math.max(0, Math.min(1, (value - minimum) / (maximum - minimum)));
}

function benchmark(model, key) {
  return finiteNumber(model.benchmarks?.artificial_analysis?.[key]);
}

function aggregateMonthly(rows) {
  const totals = new Map();
  for (const row of asArray(rows)) {
    const slug = typeof row.model_permaslug === "string" ? row.model_permaslug : "";
    if (!slug || slug === "other") continue;
    totals.set(slug, (totals.get(slug) ?? 0) + (finiteNumber(row.total_tokens) ?? 0));
  }
  const sorted = [...totals].sort((left, right) => right[1] - left[1]);
  return {
    count: sorted.length,
    ranks: new Map(sorted.map(([slug], index) => [slug, index + 1])),
  };
}

function categoryEligibility(model, pricePercentile) {
  const intelligence = benchmark(model.raw, "intelligence_index") ?? 0;
  const coding = benchmark(model.raw, "coding_index") ?? 0;
  const rankWithin = (rank, maximum) => typeof rank === "number" && rank > 0 && rank <= maximum;
  const free = model.inputPrice === 0 && model.outputPrice === 0;
  return {
    free,
    code: !free && (CODE_MODEL.test(`${model.id} ${model.name}`) || coding >= 55),
    flagship: !free && FLAGSHIP_PROVIDERS.has(model.provider) && (
      intelligence >= 40 || rankWithin(model.weeklyRank, 25) || rankWithin(model.monthlyRank, 25) || model.ageDays <= 30
    ),
    reasoning: !free && model.supportsReasoning && (
      intelligence >= 25 || rankWithin(model.weeklyRank, 75) || rankWithin(model.monthlyRank, 75)
    ),
    economy: !free && pricePercentile <= 0.4,
    balanced: !free,
  };
}

function staticHardGateReasons(raw, config, nowMs) {
  const reasons = [];
  const inputs = asArray(raw.architecture?.input_modalities).map(String);
  const outputs = asArray(raw.architecture?.output_modalities).map(String);
  const inputPrice = perMillion(raw.pricing?.prompt);
  const outputPrice = perMillion(raw.pricing?.completion);
  const expirationMs = raw.expiration_date ? Date.parse(raw.expiration_date) : null;
  if (typeof raw.id !== "string" || !raw.id.includes("/")) reasons.push("Invalid model ID");
  if (BLOCKED_MODEL.test(`${raw.id ?? ""} ${raw.name ?? ""}`)) reasons.push("Dynamic or experimental model");
  if (!inputs.includes("text")) reasons.push("No text input");
  if (!outputs.includes("text")) reasons.push("No text output");
  if (inputPrice === null || outputPrice === null || inputPrice < 0 || outputPrice < 0) reasons.push("Price unavailable");
  if ((finiteNumber(raw.context_length) ?? 0) < config.minimumContext) reasons.push("Context below minimum");
  if (expirationMs && expirationMs < nowMs + 14 * DAY_MS) reasons.push("Expires within 14 days");
  if (!raw.top_provider) reasons.push("No active top provider");
  return reasons;
}

export function prepareCandidates(source, config = DEFAULT_STRATEGY, endpointHealth = new Map(), nowMs = Date.now()) {
  validateStrategy(config);
  const weeklyModels = asArray(source.weekly?.data);
  const rankSources = {
    weekly: rankMap(weeklyModels),
    newest: rankMap(source.newest?.data),
    intelligence: rankMap(source.intelligence?.data),
    throughput: rankMap(source.throughput?.data),
    latency: rankMap(source.latency?.data),
  };
  const monthly = aggregateMonthly(source.monthly?.data);
  const qualityValues = weeklyModels.map((model) => benchmark(model, "intelligence_index")).filter((value) => value !== null);
  const qualityMin = Math.min(...qualityValues, 0);
  const qualityMax = Math.max(...qualityValues, 100);

  const candidates = weeklyModels.map((raw) => {
    const canonicalSlug = raw.canonical_slug || raw.id;
    const inputPrice = perMillion(raw.pricing?.prompt);
    const outputPrice = perMillion(raw.pricing?.completion);
    const weightedPrice = inputPrice === null || outputPrice === null ? Infinity : 0.4 * inputPrice + 0.6 * outputPrice;
    const created = finiteNumber(raw.created);
    const ageDays = Math.max(0, Math.floor((nowMs - (created ? created * 1000 : nowMs)) / DAY_MS));
    const supportedParameters = asArray(raw.supported_parameters);
    return {
      id: raw.id,
      canonicalSlug,
      name: raw.name || raw.id,
      raw,
      provider: raw.id?.split("/")[0] || "unknown",
      inputPrice,
      outputPrice,
      weightedPrice,
      contextLength: finiteNumber(raw.context_length) ?? 0,
      ageDays,
      weeklyRank: rankSources.weekly.get(raw.id) ?? null,
      monthlyRank: monthly.ranks.get(canonicalSlug) ?? monthly.ranks.get(raw.id) ?? null,
      newestRank: rankSources.newest.get(raw.id) ?? null,
      intelligenceRank: rankSources.intelligence.get(raw.id) ?? null,
      throughputRank: rankSources.throughput.get(raw.id) ?? null,
      latencyRank: rankSources.latency.get(raw.id) ?? null,
      supportsReasoning: supportedParameters.some((value) => ["reasoning", "include_reasoning", "reasoning_effort"].includes(value)),
      endpointHealth: endpointHealth.get(raw.id) ?? null,
      hardGateReasons: staticHardGateReasons(raw, config, nowMs),
    };
  });

  const priced = candidates.filter((model) => Number.isFinite(model.weightedPrice)).sort((left, right) => left.weightedPrice - right.weightedPrice);
  const priceRanks = new Map(priced.map((model, index) => [model.id, index]));
  const priceDivisor = Math.max(1, priced.length - 1);

  return candidates.map((model) => {
    const pricePercentile = (priceRanks.get(model.id) ?? priceDivisor) / priceDivisor;
    const qualityIndex = benchmark(model.raw, "intelligence_index");
    const components = {
      weekly: rankScore(model.weeklyRank, rankSources.weekly.size),
      monthly: rankScore(model.monthlyRank, monthly.count),
      newModel: Math.exp(-model.ageDays / 30),
      quality: qualityIndex === null
        ? rankScore(model.intelligenceRank, rankSources.intelligence.size)
        : normalize(qualityIndex, qualityMin, qualityMax),
      reliability: model.endpointHealth?.verified ? normalize(model.endpointHealth.uptime, 0, 100) : 0.5,
      performance: (
        rankScore(model.throughputRank, rankSources.throughput.size)
        + rankScore(model.latencyRank, rankSources.latency.size)
      ) / 2,
      value: 1 - pricePercentile,
    };
    const hardGateReasons = [...model.hardGateReasons];
    if (model.endpointHealth?.verified && !model.endpointHealth.available) {
      hardGateReasons.push(model.endpointHealth.reason || "No healthy endpoint");
    }
    const score = Object.entries(config.weights).reduce((sum, [key, weight]) => sum + components[key] * weight, 0);
    return { ...model, pricePercentile, eligibility: categoryEligibility(model, pricePercentile), components, score, hardGateReasons };
  });
}

function applySupportedModelGate(candidates, supportedModelIds) {
  return candidates.map((model) => supportedModelIds.has(model.id)
    ? model
    : { ...model, hardGateReasons: [...model.hardGateReasons, "Unavailable in new-api"] });
}

export function applyFreeInferenceGate(candidates, inferenceHealth) {
  return candidates.map((model) => {
    if (!model.eligibility.free) return model;
    const probe = inferenceHealth.get(model.id);
    const hardGateReasons = [...model.hardGateReasons];
    if (!probe?.verified) hardGateReasons.push("Inference not verified");
    else if (!probe.available) hardGateReasons.push(probe.reason || "Inference unavailable");
    return { ...model, inferenceHealth: probe ?? null, hardGateReasons };
  });
}

export function selectPortfolio(candidates, config = DEFAULT_STRATEGY) {
  validateStrategy(config);
  const pool = candidates
    .filter((model) => model.hardGateReasons.length === 0)
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
  const selected = [];
  const selectedIds = new Set();
  const shortages = [];

  for (const category of ALLOCATION_ORDER) {
    const matches = pool.filter((model) => !selectedIds.has(model.id) && model.eligibility[category]);
    const chosen = matches.slice(0, config.quotas[category]);
    for (const model of chosen) {
      selectedIds.add(model.id);
      selected.push({ ...model, category });
    }
    if (chosen.length !== config.quotas[category]) shortages.push({ category, found: chosen.length, target: config.quotas[category] });
  }

  const categoryIndex = new Map(DISPLAY_ORDER.map((category, index) => [category, index]));
  selected.sort((left, right) => categoryIndex.get(left.category) - categoryIndex.get(right.category) || left.id.localeCompare(right.id));
  const rejected = candidates
    .filter((model) => !selectedIds.has(model.id))
    .map((model) => ({ ...model, rejectionReason: model.hardGateReasons[0] || "Lower score than category cutoff" }))
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
  return { selected, rejected, shortages };
}

export function selectionFingerprint(models) {
  return JSON.stringify(models
    .map((model) => [model.id, model.category, model.inputPrice, model.outputPrice])
    .sort((left, right) => left[0].localeCompare(right[0])));
}

async function mapWithConcurrency(items, limit, mapper) {
  const output = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await mapper(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return output;
}

function headers(apiKey, accept = "application/json") {
  return {
    accept,
    authorization: `Bearer ${apiKey}`,
    "content-type": "application/json",
    "HTTP-Referer": "https://maxshot.ai",
    "X-Title": "Maxshot Model Strategy",
  };
}

async function fetchJson(fetchImpl, apiKey, path, timeoutMs = 20_000) {
  const response = await fetchImpl(`${OPENROUTER_BASE_URL}${path}`, {
    headers: headers(apiKey),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message || `OpenRouter returned HTTP ${response.status}`);
  return body;
}

function dateString(date) {
  return date.toISOString().slice(0, 10);
}

export async function fetchSources(apiKey, fetchImpl = fetch, now = new Date()) {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 29);
  const paths = {
    weekly: "/models?sort=top-weekly",
    newest: "/models?sort=newest",
    intelligence: "/models?sort=intelligence-high-to-low",
    throughput: "/models?sort=throughput-high-to-low",
    latency: "/models?sort=latency-low-to-high",
    monthly: `/datasets/rankings-daily?start_date=${dateString(start)}&end_date=${dateString(end)}&modality=text`,
  };
  const entries = await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await fetchJson(fetchImpl, apiKey, path)]));
  return Object.fromEntries(entries);
}

async function fetchEndpointHealth(fetchImpl, apiKey, modelId) {
  const [provider, ...slug] = modelId.split("/");
  const path = `/models/${encodeURIComponent(provider)}/${encodeURIComponent(slug.join("/"))}/endpoints`;
  try {
    const body = await fetchJson(fetchImpl, apiKey, path);
    const endpoints = asArray(body?.data?.endpoints);
    const healthy = endpoints.filter((endpoint) => {
      const statusOk = endpoint.status === undefined || endpoint.status === null || endpoint.status === 0;
      const uptime = Number(endpoint.uptime_last_1d);
      return statusOk && (!Number.isFinite(uptime) || uptime >= 95);
    });
    const uptimes = healthy.map((endpoint) => Number(endpoint.uptime_last_1d)).filter(Number.isFinite);
    return {
      verified: true,
      available: healthy.length > 0,
      endpointCount: endpoints.length,
      healthyEndpointCount: healthy.length,
      uptime: uptimes.length > 0 ? Math.max(...uptimes) : healthy.length > 0 ? 95 : 0,
      reason: endpoints.length === 0 ? "No provider endpoints" : healthy.length === 0 ? "No endpoint meets 95% uptime" : null,
    };
  } catch (error) {
    return { verified: true, available: false, endpointCount: 0, healthyEndpointCount: 0, uptime: 0, reason: error.message };
  }
}

export function parseInferenceResponse(httpStatus, raw, latencyMs) {
  if (httpStatus < 200 || httpStatus >= 300) {
    let error;
    try { error = JSON.parse(raw)?.error; } catch { error = null; }
    return { success: false, httpStatus, latencyMs, provider: null, reason: error?.message || `HTTP ${httpStatus}` };
  }
  let content = "";
  let provider = null;
  let finishReason = null;
  let streamError = null;
  for (const line of raw.split(/\r?\n/)) {
    if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
    try {
      const event = JSON.parse(line.slice(6));
      provider ??= event.provider ?? null;
      if (typeof event.choices?.[0]?.delta?.content === "string") content += event.choices[0].delta.content;
      finishReason = event.choices?.[0]?.finish_reason ?? finishReason;
      if (event.error) streamError = event.error.message || "Stream error";
    } catch {
      streamError = "Invalid stream event";
    }
  }
  const success = !streamError && content.trim().length > 0 && finishReason === "stop";
  return {
    success,
    httpStatus,
    latencyMs,
    provider,
    reason: success ? null : streamError || (content.trim() ? `Unexpected finish reason: ${finishReason || "missing"}` : "No assistant content returned"),
  };
}

async function probeOnce(fetchImpl, apiKey, model) {
  const startedAt = Date.now();
  try {
    const response = await fetchImpl(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: headers(apiKey, "text/event-stream"),
      body: JSON.stringify({
        model: model.id,
        messages: [{ role: "user", content: "Reply with exactly OK." }],
        stream: true,
        temperature: 0,
        max_tokens: 256,
        ...(model.supportsReasoning ? { reasoning: { effort: "medium" } } : {}),
      }),
      signal: AbortSignal.timeout(30_000),
    });
    return parseInferenceResponse(response.status, await response.text(), Date.now() - startedAt);
  } catch (error) {
    return { success: false, httpStatus: null, latencyMs: Date.now() - startedAt, provider: null, reason: error.message };
  }
}

async function probeFreeModel(fetchImpl, apiKey, model) {
  const attempts = [await probeOnce(fetchImpl, apiKey, model)];
  if (!attempts[0].success) {
    await sleep(1_000);
    attempts.push(await probeOnce(fetchImpl, apiKey, model));
  }
  const successful = attempts.filter((attempt) => attempt.success);
  return {
    verified: true,
    available: successful.length > 0,
    attempts: attempts.length,
    successes: successful.length,
    latencyMs: successful.length ? Math.round(successful.reduce((sum, attempt) => sum + attempt.latencyMs, 0) / successful.length) : null,
    provider: successful.at(-1)?.provider ?? null,
    checkedAt: new Date().toISOString(),
    rateLimited: attempts.every((attempt) => attempt.httpStatus === 429),
    reason: successful.length ? null : attempts.at(-1).reason,
  };
}

export async function buildModelPortfolio({
  apiKey,
  supportedModelIds,
  config = DEFAULT_STRATEGY,
  fetchImpl = fetch,
  now = new Date(),
}) {
  if (!apiKey) throw new Error("OpenRouter API key is required.");
  if (!(supportedModelIds instanceof Set)) throw new Error("supportedModelIds must be a Set from new-api.");
  validateStrategy(config);

  const source = await fetchSources(apiKey, fetchImpl, now);
  const preliminary = applySupportedModelGate(prepareCandidates(source, config, new Map(), now.getTime()), supportedModelIds);
  const endpointCandidates = preliminary.filter((model) => model.hardGateReasons.length === 0);
  const endpointEntries = await mapWithConcurrency(endpointCandidates, 5, async (model) => [
    model.id,
    await fetchEndpointHealth(fetchImpl, apiKey, model.id),
  ]);
  const endpointHealth = new Map(endpointEntries);
  const scored = applySupportedModelGate(prepareCandidates(source, config, endpointHealth, now.getTime()), supportedModelIds);

  const freeProbePool = scored
    .filter((model) => model.hardGateReasons.length === 0 && model.eligibility.free)
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
    .slice(0, config.quotas.free * 2);
  const probeEntries = await mapWithConcurrency(freeProbePool, 2, async (model) => [
    model.id,
    await probeFreeModel(fetchImpl, apiKey, model),
  ]);
  const inferenceHealth = new Map(probeEntries);
  const probeResults = [...inferenceHealth.values()];
  if (probeResults.length >= 2 && probeResults.filter((result) => result.rateLimited).length >= Math.ceil(probeResults.length / 2)) {
    throw new Error("Free-model inference probes were systemically rate limited.");
  }

  const candidates = applyFreeInferenceGate(scored, inferenceHealth);
  const portfolio = selectPortfolio(candidates, config);
  if (portfolio.shortages.length || portfolio.selected.length !== MODEL_COUNT) {
    throw new Error(`Incomplete portfolio: ${portfolio.shortages.map(({ category, found, target }) => `${category} ${found}/${target}`).join(", ")}`);
  }

  return {
    ...portfolio,
    selectionFingerprint: selectionFingerprint(portfolio.selected),
    inferenceHealth,
    probeSummary: {
      checked: probeResults.length,
      passed: probeResults.filter((result) => result.available).length,
      failed: probeResults.filter((result) => !result.available).length,
    },
  };
}
