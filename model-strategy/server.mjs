import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

import { hasSystemicRateLimit, parseInferenceResponse, summarizeInferenceAttempts } from "./src/lib/inference.js";
import { applyFreeInferenceHealth, buildChatModelsJson, DEFAULT_STRATEGY, MODEL_COUNT, prepareCandidates, selectionRefreshFingerprint, selectPortfolio, strategyDataFingerprint, validateStrategy } from "./src/lib/strategy.js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

async function loadEnvironment() {
  for (const filename of [".env.local", ".env"]) {
    try {
      const content = await fs.readFile(path.join(rootDir, filename), "utf8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const separator = trimmed.indexOf("=");
        if (separator < 1) continue;
        const key = trimmed.slice(0, separator).trim();
        const rawValue = trimmed.slice(separator + 1).trim();
        const value = rawValue.replace(/^(["'])(.*)\1$/, "$2");
        if (process.env[key] === undefined) process.env[key] = value;
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}

await loadEnvironment();

const isProduction = process.argv.includes("--production");
const port = Number(process.env.PORT || 4175);
const refreshIntervalMs = Math.max(60_000, Number(process.env.OPENROUTER_REFRESH_INTERVAL_MS || 300_000));
const openRouterBaseUrl = "https://openrouter.ai/api/v1";
const maxshotGatewayBaseUrl = "https://api.maxshot.ai/v1";
const freeProbePoolSize = DEFAULT_STRATEGY.quotas.free * 2;
let dataSnapshot = null;
let scoringSnapshot = null;
let updatePromise = null;
let updateTimer = null;
const updateStatus = {
  updating: false,
  updateStartedAt: null,
  lastUpdatedAt: null,
  nextUpdateAt: null,
  lastDurationMs: null,
  lastError: null,
  dataChangedSincePrevious: null,
  selectionChangedSincePrevious: null,
  lastChangedAt: null,
  unchangedUpdateCount: 0,
  freeProbeCount: 0,
  freeProbePassed: 0,
  freeProbeFailed: 0,
};

function json(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

function rankingsWindow(now = new Date()) {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 29);
  return { start: toDateString(start), end: toDateString(end) };
}

async function openRouterFetch(pathname) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    const error = new Error("OPENROUTER_API_KEY is required for live monthly rankings.");
    error.code = "OPENROUTER_API_KEY_MISSING";
    throw error;
  }
  const response = await fetch(`${openRouterBaseUrl}${pathname}`, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "http://127.0.0.1",
      "X-Title": "Maxshot Model Strategy",
    },
    signal: AbortSignal.timeout(20_000),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body?.error?.message || `OpenRouter request failed with ${response.status}`);
    error.code = `OPENROUTER_${response.status}`;
    throw error;
  }
  return body;
}

async function fetchGatewayModels() {
  const apiKey = process.env.MAXSHOT_API_KEY?.trim();
  if (!apiKey) {
    const error = new Error("Set MAXSHOT_API_KEY in model-strategy/.env, then restart the server.");
    error.code = "MAXSHOT_API_KEY_MISSING";
    throw error;
  }
  const response = await fetch(`${maxshotGatewayBaseUrl}/models`, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    signal: AbortSignal.timeout(20_000),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body?.error?.message || body?.message || `Maxshot Gateway returned HTTP ${response.status}`);
    error.code = `MAXSHOT_GATEWAY_${response.status}`;
    throw error;
  }
  return body;
}

async function fetchSources() {
  const window = rankingsWindow();
  const paths = {
    weekly: "/models?sort=top-weekly",
    newest: "/models?sort=newest",
    intelligence: "/models?sort=intelligence-high-to-low",
    throughput: "/models?sort=throughput-high-to-low",
    latency: "/models?sort=latency-low-to-high",
    monthly: `/datasets/rankings-daily?start_date=${window.start}&end_date=${window.end}&modality=text`,
  };
  const entries = await Promise.all(Object.entries(paths).map(async ([key, pathname]) => [key, await openRouterFetch(pathname)]));
  return Object.fromEntries(entries);
}

function endpointPath(modelId) {
  const [author, ...slugParts] = modelId.split("/");
  return `/models/${encodeURIComponent(author)}/${encodeURIComponent(slugParts.join("/"))}/endpoints`;
}

async function fetchEndpointHealth(modelId) {
  try {
    const payload = await openRouterFetch(endpointPath(modelId));
    const endpoints = Array.isArray(payload?.data?.endpoints) ? payload.data.endpoints : [];
    const healthy = endpoints.filter((endpoint) => {
      const statusOk = endpoint.status === undefined || endpoint.status === null || endpoint.status === 0;
      const uptime = Number(endpoint.uptime_last_1d);
      return statusOk && (!Number.isFinite(uptime) || uptime >= 95);
    });
    const uptimeValues = healthy.map((endpoint) => Number(endpoint.uptime_last_1d)).filter(Number.isFinite);
    const value = {
      verified: true,
      available: healthy.length > 0,
      endpointCount: endpoints.length,
      healthyEndpointCount: healthy.length,
      uptime: uptimeValues.length > 0 ? Math.max(...uptimeValues) : healthy.length > 0 ? 95 : 0,
      reason: endpoints.length === 0 ? "No provider endpoints" : healthy.length === 0 ? "No endpoint meets 95% uptime" : null,
    };
    return value;
  } catch (error) {
    const value = {
      verified: true,
      available: false,
      endpointCount: 0,
      healthyEndpointCount: 0,
      uptime: 0,
      reason: `Endpoint check failed: ${error.message}`,
    };
    return value;
  }
}

async function probeFreeModelOnce(model) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const startedAt = Date.now();
  try {
    const response = await fetch(`${openRouterBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        accept: "text/event-stream",
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
        "HTTP-Referer": "http://127.0.0.1",
        "X-Title": "Maxshot Free Model Availability Probe",
      },
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
    const raw = await response.text();
    return parseInferenceResponse(response.status, raw, Date.now() - startedAt);
  } catch (error) {
    return {
      success: false,
      httpStatus: null,
      latencyMs: Date.now() - startedAt,
      provider: null,
      finishReason: null,
      errorCode: error.name,
      reason: error.message,
    };
  }
}

async function probeFreeModel(model) {
  const attempts = [await probeFreeModelOnce(model)];
  if (!attempts[0].success) {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    attempts.push(await probeFreeModelOnce(model));
  }
  return summarizeInferenceAttempts(attempts);
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function scheduleNextUpdate() {
  clearTimeout(updateTimer);
  updateStatus.nextUpdateAt = new Date(Date.now() + refreshIntervalMs).toISOString();
  updateTimer = setTimeout(() => {
    void refreshDataSnapshot().catch((error) => console.error(`OpenRouter background update failed: ${error.message}`));
  }, refreshIntervalMs);
}

async function refreshDataSnapshot() {
  if (updatePromise) return updatePromise;
  updatePromise = (async () => {
    const startedAt = Date.now();
    updateStatus.updating = true;
    updateStatus.updateStartedAt = new Date(startedAt).toISOString();
    updateStatus.nextUpdateAt = null;
    updateStatus.lastError = null;
    try {
      const source = await fetchSources();
      const baseCandidates = prepareCandidates(source, DEFAULT_STRATEGY);
      scoringSnapshot = {
        candidates: baseCandidates,
        updatedAt: new Date().toISOString(),
      };
      const eligible = baseCandidates.filter((model) => model.hardGateReasons.length === 0);
      const checks = await mapWithConcurrency(eligible, 5, async (model) => [model.id, await fetchEndpointHealth(model.id)]);
      const health = new Map(checks);
      const prepared = prepareCandidates(source, DEFAULT_STRATEGY, health);
      const freeProbeCandidates = prepared
        .filter((model) => model.hardGateReasons.length === 0 && model.eligibility.free)
        .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
        .slice(0, freeProbePoolSize);
      const probeChecks = await mapWithConcurrency(freeProbeCandidates, 2, async (model) => [model.id, await probeFreeModel(model)]);
      const inferenceHealth = new Map(probeChecks);
      const probeResults = [...inferenceHealth.values()];
      updateStatus.freeProbeCount = probeResults.length;
      updateStatus.freeProbePassed = probeResults.filter((result) => result.available).length;
      updateStatus.freeProbeFailed = probeResults.length - updateStatus.freeProbePassed;
      if (hasSystemicRateLimit(probeResults)) {
        const error = new Error("Free-model inference probes were rate limited; keeping the previous snapshot.");
        error.code = "FREE_PROBE_RATE_LIMITED";
        throw error;
      }
      const verified = applyFreeInferenceHealth(prepared, inferenceHealth);
      const defaultResult = selectPortfolio(verified, DEFAULT_STRATEGY);
      if (defaultResult.shortages.length > 0 || defaultResult.selected.length !== MODEL_COUNT) {
        const shortage = defaultResult.shortages.map((item) => `${item.category}: ${item.found}/${item.target}`).join(", ");
        const error = new Error(`Could not fill all ${MODEL_COUNT} verified seats (${shortage || `${defaultResult.selected.length}/${MODEL_COUNT}`}).`);
        error.code = "PORTFOLIO_INCOMPLETE";
        throw error;
      }
      const fingerprint = createHash("sha256").update(strategyDataFingerprint(verified)).digest("hex");
      const defaultSelection = defaultResult.selected;
      const selectionFingerprint = createHash("sha256").update(selectionRefreshFingerprint(defaultSelection)).digest("hex");
      const previousFingerprint = dataSnapshot?.fingerprint ?? null;
      const previousSelectionFingerprint = dataSnapshot?.selectionFingerprint ?? null;
      const changedSincePrevious = previousFingerprint === null ? null : previousFingerprint !== fingerprint;
      const selectionChangedSincePrevious = previousSelectionFingerprint === null ? null : previousSelectionFingerprint !== selectionFingerprint;
      const updatedAt = new Date().toISOString();
      dataSnapshot = { source, health, inferenceHealth, updatedAt, fingerprint, selectionFingerprint };
      updateStatus.lastUpdatedAt = updatedAt;
      updateStatus.lastDurationMs = Date.now() - startedAt;
      updateStatus.dataChangedSincePrevious = changedSincePrevious;
      updateStatus.selectionChangedSincePrevious = selectionChangedSincePrevious;
      if (changedSincePrevious === false) {
        updateStatus.unchangedUpdateCount += 1;
      } else {
        updateStatus.unchangedUpdateCount = 0;
        updateStatus.lastChangedAt = updatedAt;
      }
    } catch (error) {
      updateStatus.lastError = error.message;
      throw error;
    } finally {
      updateStatus.lastDurationMs = Date.now() - startedAt;
      updateStatus.updating = false;
      updateStatus.updateStartedAt = null;
      scheduleNextUpdate();
    }
  })();
  try {
    return await updatePromise;
  } finally {
    updatePromise = null;
  }
}

function buildLiveStrategy(config) {
  if (!dataSnapshot) {
    const error = new Error("OpenRouter data is still loading. Please try again shortly.");
    error.code = "DATA_NOT_READY";
    throw error;
  }
  const { source, health, inferenceHealth, updatedAt } = dataSnapshot;
  const candidates = applyFreeInferenceHealth(prepareCandidates(source, config, health), inferenceHealth);
  const result = selectPortfolio(candidates, config);
  const unverified = result.selected.filter((model) => !model.health?.verified || !model.health.available);
  if (result.shortages.length > 0 || result.selected.length !== MODEL_COUNT || unverified.length > 0) {
    const shortage = result.shortages.map((item) => `${item.category}: ${item.found}/${item.target}`).join(", ");
    const error = new Error(`Could not fill all ${MODEL_COUNT} verified seats (${shortage || `${result.selected.length}/${MODEL_COUNT}`}${unverified.length ? `; ${unverified.length} unverified` : ""}).`);
    error.code = "PORTFOLIO_INCOMPLETE";
    error.details = { shortages: result.shortages, selected: result.selected.length };
    throw error;
  }

  const providerCount = new Set(result.selected.map((model) => model.provider)).size;
  const passedHardGates = candidates.filter((model) => model.hardGateReasons.length === 0).length;
  return {
    generatedAt: new Date().toISOString(),
    source: {
      name: "OpenRouter",
      modelCount: source.weekly.data.length,
      rankingsAsOf: source.monthly.meta?.as_of ?? null,
      rankingsWindow: {
        start: source.monthly.meta?.start_date ?? null,
        end: source.monthly.meta?.end_date ?? null,
      },
      dataUpdatedAt: updatedAt,
    },
    summary: {
      selected: result.selected.length,
      categories: new Set(result.selected.map((model) => model.category)).size,
      providers: providerCount,
      passedHardGates,
      totalModels: candidates.length,
    },
    selected: result.selected,
    rejected: result.rejected,
    exportJson: buildChatModelsJson(result.selected),
  };
}

function buildStrategyScores() {
  if (!scoringSnapshot) return { dataUpdatedAt: null, scores: {} };
  const { candidates, updatedAt } = scoringSnapshot;
  return {
    dataUpdatedAt: updatedAt,
    scores: Object.fromEntries(candidates.map((model) => [model.id, model.score])),
  };
}

async function readRequestBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1_000_000) throw new Error("Request body is too large.");
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/status") {
    json(response, 200, {
      configured: Boolean(process.env.OPENROUTER_API_KEY?.trim()),
      refreshIntervalMs,
      ...updateStatus,
    });
    return true;
  }
  if (request.method === "GET" && url.pathname === "/api/gateway-models") {
    try {
      const payload = await fetchGatewayModels();
      json(response, 200, { ...payload, strategy: buildStrategyScores() });
    } catch (error) {
      const status = error.code === "MAXSHOT_API_KEY_MISSING" ? 503 : 502;
      json(response, status, { error: { code: error.code || "GATEWAY_MODELS_FAILED", message: error.message } });
    }
    return true;
  }
  if (request.method === "POST" && url.pathname === "/api/strategy") {
    try {
      const body = await readRequestBody(request);
      const config = body.config || DEFAULT_STRATEGY;
      const errors = validateStrategy(config);
      if (errors.length > 0) {
        json(response, 400, { error: { code: "INVALID_STRATEGY", message: errors.join(" ") } });
        return true;
      }
      if (!dataSnapshot && updatePromise) await updatePromise;
      const payload = buildLiveStrategy(config);
      json(response, 200, payload);
    } catch (error) {
      const status = error.code === "OPENROUTER_API_KEY_MISSING" ? 503 : error.code === "PORTFOLIO_INCOMPLETE" ? 422 : 502;
      json(response, status, { error: { code: error.code || "STRATEGY_FAILED", message: error.message, details: error.details } });
    }
    return true;
  }
  return false;
}

let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({ root: rootDir, server: { middlewareMode: true }, appType: "spa" });
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
  if (url.pathname.startsWith("/api/") && await handleApi(request, response, url)) return;
  if (vite) {
    vite.middlewares(request, response, () => {
      response.writeHead(404).end("Not found");
    });
    return;
  }
  const requestedPath = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const candidate = path.resolve(rootDir, "dist", requestedPath);
  const distRoot = path.resolve(rootDir, "dist");
  const safePath = candidate.startsWith(distRoot) ? candidate : path.join(distRoot, "index.html");
  try {
    const content = await fs.readFile(safePath);
    response.writeHead(200, { "content-type": mimeTypes[path.extname(safePath)] || "application/octet-stream" });
    response.end(content);
  } catch {
    const content = await fs.readFile(path.join(distRoot, "index.html"));
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(content);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Model Strategy listening on http://127.0.0.1:${port}`);
  void refreshDataSnapshot().catch((error) => console.error(`OpenRouter background update failed: ${error.message}`));
});
