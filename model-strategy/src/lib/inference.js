function errorFromJson(raw) {
  try {
    const body = JSON.parse(raw);
    return {
      code: body?.error?.code ?? null,
      message: body?.error?.message ?? null,
    };
  } catch {
    return { code: null, message: null };
  }
}

export function parseInferenceResponse(httpStatus, raw, latencyMs) {
  if (httpStatus < 200 || httpStatus >= 300) {
    const error = errorFromJson(raw);
    return {
      success: false,
      httpStatus,
      latencyMs,
      provider: null,
      finishReason: null,
      errorCode: error.code,
      reason: error.message || `OpenRouter returned HTTP ${httpStatus}`,
    };
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
      const delta = event.choices?.[0]?.delta?.content;
      if (typeof delta === "string") content += delta;
      finishReason = event.choices?.[0]?.finish_reason ?? finishReason;
      if (event.error) streamError = event.error.message || "OpenRouter stream error";
    } catch {
      streamError = "Invalid OpenRouter stream event";
    }
  }

  const success = !streamError && content.trim().length > 0 && finishReason === "stop";
  return {
    success,
    httpStatus,
    latencyMs,
    provider,
    finishReason,
    errorCode: null,
    reason: streamError
      || (content.trim().length === 0 ? "No assistant content returned" : null)
      || (finishReason !== "stop" ? `Unexpected finish reason: ${finishReason || "missing"}` : null),
  };
}

export function summarizeInferenceAttempts(attempts, checkedAt = new Date().toISOString()) {
  const successful = attempts.filter((attempt) => attempt.success);
  const latencyMs = successful.length > 0
    ? Math.round(successful.reduce((sum, attempt) => sum + attempt.latencyMs, 0) / successful.length)
    : null;
  const last = attempts.at(-1);
  return {
    verified: true,
    available: successful.length > 0,
    attempts: attempts.length,
    successes: successful.length,
    latencyMs,
    provider: successful.at(-1)?.provider ?? last?.provider ?? null,
    checkedAt,
    rateLimited: attempts.length > 0 && attempts.every((attempt) => attempt.httpStatus === 429),
    reason: successful.length > 0 ? null : last?.reason || "Inference probe failed",
  };
}

export function hasSystemicRateLimit(results) {
  if (results.length < 2) return false;
  return results.filter((result) => result.rateLimited).length >= Math.ceil(results.length / 2);
}
