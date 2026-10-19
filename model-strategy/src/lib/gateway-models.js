export function modelId(model) {
  return String(model?.id ?? "");
}

export function readReferenceModel(payload, model) {
  return payload?.reference?.models?.[modelId(model)] ?? null;
}

export function allOpenRouterModels(payload) {
  return Object.keys(payload?.reference?.models ?? {}).map((id) => ({ id }));
}

export function groupBatchModels(models, availableModels = models) {
  const byId = new Map(availableModels.map((model) => [modelId(model), model]));
  const groups = new Map();
  for (const model of models) {
    const id = modelId(model);
    const primary = (id.endsWith(":batch") && byId.get(id.slice(0, -6))) || model;
    const primaryId = modelId(primary);
    if (!groups.has(primaryId)) groups.set(primaryId, { model: primary, batch: byId.get(`${primaryId}:batch`) ?? null });
  }
  return [...groups.values()];
}

export function pricePerMillion(value) {
  if (value === null || value === undefined || value === "") return null;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price * 1_000_000 : null;
}

export function formatTokenCount(value) {
  if (value === null || value === undefined || value === "") return "—";
  const tokens = Number(value);
  if (!Number.isFinite(tokens) || tokens < 0) return "—";
  if (tokens >= 1_000_000) return `${Number((tokens / 1_000_000).toFixed(2))}M`;
  if (tokens >= 1_000) return `${Number((tokens / 1_000).toFixed(1))}K`;
  return tokens.toLocaleString("en-US");
}

export function formatUsdPerMillion(value) {
  const price = pricePerMillion(value);
  if (price === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 8 }).format(price);
}

export function tokenRateForDisplay(reference, field) {
  const pricing = reference?.pricing;
  if (reference?.outputModalities?.some((value) => value === "image" || value === "video") && Number(pricing?.input) === 0 && Number(pricing?.output) === 0) return null;
  return pricing?.[field] ?? null;
}

export function mediaAbilities(reference) {
  const input = reference?.inputModalities ?? [];
  const output = reference?.outputModalities ?? [];
  return {
    t2i: output.includes("image") && input.includes("text") && !(Number(reference?.imageInputReferencesMin) > 0),
    i2i: output.includes("image") && input.includes("image"),
    t2v: output.includes("video") && input.includes("text"),
    i2v: output.includes("video") && input.includes("image"),
    v2v: output.includes("video") && input.includes("video"),
  };
}

export function formatDurationOptions(values) {
  if (!values?.length) return "Not reported";
  const ordered = [...values].map(Number).sort((a, b) => a - b);
  return ordered.length > 2 && ordered.every((value, index) => index === 0 || value === ordered[index - 1] + 1)
    ? `${ordered[0]}–${ordered.at(-1)}s`
    : ordered.map((value) => `${value}s`).join(", ");
}

export function describeVideoSku(key) {
  const group = key.startsWith("text_to_video_") ? "T2V"
    : key.startsWith("image_to_video_") ? "I2V"
      : key.startsWith("video_to_video_") || key.includes("with_video_input") || key.includes("video_continuation") ? "V2V"
        : key.includes("image_input") || key.includes("input_images") || key === "reference_images" ? "Input charges"
          : key.startsWith("reference_") ? "Reference mode" : "Mode unspecified";
  const sourceResolution = key.match(/(?:^|_)(\d+(?:\.\d+)?k|\d+p)(?:_|$)/i)?.[1];
  const resolution = sourceResolution?.toLowerCase().endsWith("p") ? sourceResolution.toLowerCase() : sourceResolution?.toUpperCase() ?? null;
  const detail = key.includes("without_audio") ? "No audio" : key.includes("with_audio") ? "With audio"
    : key.includes("creative") ? "Creative" : key.includes("precise") ? "Precise" : null;
  const label = [resolution, detail].filter(Boolean).join(" · ")
    || (group === "Input charges" ? "Reference image" : "Base rate");
  return { group, label };
}

export function formatVideoSkuPrice(key, value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  const cents = key.startsWith("cents_per_") || key === "minimum_cents_per_generation";
  const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 8 }).format(cents ? amount / 100 : amount);
  const unit = key.includes("megapixel_second") ? "/megapixel-second"
    : key.includes("second") ? "/second"
      : key.includes("video_tokens") ? "/video token"
        : key.includes("image") ? "/image"
          : key.includes("generation") ? "/generation" : "";
  return `${price}${key.startsWith("minimum_") ? " minimum" : ""}${unit}`;
}

const TOKEN_PRICE_FIELDS = { prompt: "Input", completion: "Output", input_cache_read: "Cache read", input_cache_write: "Cache write", input_cache_write_1h: "Cache write 1h" };
const UTC_WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export function isTimePricingOverride(override) {
  return Boolean(override?.utc_days?.length || (override?.utc_start != null && override?.utc_end != null));
}

function utcClock(value) {
  return `${String(Math.floor(value / 100)).padStart(2, "0")}:${String(value % 100).padStart(2, "0")}`;
}

export function overrideCondition(override) {
  const days = override.utc_days?.map((day) => day.toLowerCase()) ?? [];
  const dayLabel = days.length === 5 && ["monday", "tuesday", "wednesday", "thursday", "friday"].every((day) => days.includes(day)) ? "Mon–Fri"
    : days.length === 2 && days.includes("saturday") && days.includes("sunday") ? "Sat–Sun"
      : days.length ? days.map((day) => day.slice(0, 3).replace(/^./, (letter) => letter.toUpperCase())).join(", ") : "Every day";
  const end = override.utc_end === 0 && override.utc_start > 0 ? "24:00" : utcClock(override.utc_end);
  const window = override.utc_start != null && override.utc_end != null ? `${utcClock(override.utc_start)}–${end} UTC` : "all day UTC";
  return [override.min_prompt_tokens != null ? `>${formatTokenCount(override.min_prompt_tokens)} prompt` : null, isTimePricingOverride(override) ? `${dayLabel} ${window}` : null].filter(Boolean).join(" · ") || "Conditional rate";
}

export function effectiveTokenPricing(pricing, now, promptTokens = null) {
  const rates = Object.fromEntries(Object.keys(TOKEN_PRICE_FIELDS).filter((key) => pricing?.[key] != null).map((key) => [key, pricing[key]]));
  const day = UTC_WEEKDAYS[now.getUTCDay()];
  const clock = now.getUTCHours() * 100 + now.getUTCMinutes();
  for (const override of pricing?.overrides ?? []) {
    if (override.min_prompt_tokens != null && !(promptTokens > override.min_prompt_tokens)) continue;
    if (override.utc_days?.length && !override.utc_days.includes(day)) continue;
    if (override.utc_start != null && override.utc_end != null) {
      const { utc_start: start, utc_end: end } = override;
      if (!(start < end ? clock >= start && clock < end : clock >= start || clock < end)) continue;
    }
    for (const key of Object.keys(TOKEN_PRICE_FIELDS)) if (override[key] != null) rates[key] = override[key];
  }
  return rates;
}

export function pricingScheduleRows(pricing) {
  const groups = new Map();
  for (const override of pricing?.overrides ?? []) {
    if (!isTimePricingOverride(override)) continue;
    const rates = Object.fromEntries(Object.keys(TOKEN_PRICE_FIELDS).filter((key) => override[key] != null).map((key) => [key, override[key]]));
    const signature = JSON.stringify(rates);
    if (!groups.has(signature)) groups.set(signature, { rates, conditions: [] });
    groups.get(signature).conditions.push(overrideCondition(override));
  }
  return [...groups.values()];
}

export function nextPricingChange(pricing, now) {
  const boundaries = new Set();
  const dayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  for (let day = 0; day <= 7; day++) {
    const midnight = dayStart + day * 86_400_000;
    boundaries.add(midnight);
    for (const override of pricing?.overrides ?? []) {
      if (!isTimePricingOverride(override)) continue;
      for (const clock of [override.utc_start, override.utc_end]) {
        if (clock != null) boundaries.add(midnight + (Math.floor(clock / 100) * 60 + clock % 100) * 60_000);
      }
    }
  }
  const current = JSON.stringify(effectiveTokenPricing(pricing, now));
  for (const time of [...boundaries].sort((left, right) => left - right)) {
    if (time > now.getTime() && JSON.stringify(effectiveTokenPricing(pricing, new Date(time))) !== current) return new Date(time);
  }
  return null;
}

export function formatEndpointPricing(pricing) {
  const usd = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 8 }).format(Number(value));
  if (Array.isArray(pricing)) return pricing.map(({ billable, cost_usd, unit, variant }) => `${variant ? `${variant}: ` : ""}${billable}: ${usd(cost_usd)}/${unit}`).join(" · ") || "Pricing not reported";
  if (!pricing || typeof pricing !== "object") return "Pricing not reported";
  const parts = Object.entries(TOKEN_PRICE_FIELDS).filter(([key]) => pricing[key] != null).map(([key, label]) => `${label} ${formatUsdPerMillion(pricing[key])}/1M`);
  parts.push(...Object.entries(pricing).filter(([key, value]) => !(key in TOKEN_PRICE_FIELDS) && key !== "discount" && key !== "overrides" && value != null && typeof value !== "object").map(([key, value]) => `${key}: ${usd(value)}`));
  if (Number(pricing.discount) > 0) parts.push(`${Number(pricing.discount) * 100}% off`);
  for (const override of pricing.overrides ?? []) {
    const rates = Object.fromEntries(Object.entries(override).filter(([key]) => key in TOKEN_PRICE_FIELDS));
    parts.push(`${overrideCondition(override)}: ${formatEndpointPricing(rates)}`);
  }
  return parts.join(" · ") || "Pricing not reported";
}

export function formatSourceDate(value) {
  if (value === null || value === undefined || value === "") return "—";
  const date = /^\d+$/.test(String(value)) ? new Date(Number(value) * 1_000) : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", year: "numeric", month: "short", day: "numeric" }).format(date);
}

export function searchableModelText(model, reference) {
  return [
    modelId(model),
    reference?.name,
    reference?.description,
    reference?.inputModalities,
    reference?.outputModalities,
    reference?.supportedParameters,
  ].filter(Boolean).map((value) => typeof value === "object" ? JSON.stringify(value) : String(value)).join(" ").toLowerCase();
}

export function filterAndSortModels(models, payload, filters) {
  const query = filters.query.trim().toLowerCase();
  const filtered = models.filter((model) => {
    const reference = readReferenceModel(payload, model);
    const inputPrice = pricePerMillion(tokenRateForDisplay(reference, "input"));
    if (query && !searchableModelText(model, reference).includes(query)) return false;
    if (filters.inputModality !== "all" && !reference?.inputModalities?.includes(filters.inputModality)) return false;
    if (filters.outputModality !== "all" && !reference?.outputModalities?.includes(filters.outputModality)) return false;
    if (filters.minContext && !(Number(reference?.contextLength) >= filters.minContext)) return false;
    if (filters.maxInputPrice !== "" && (inputPrice === null || inputPrice > Number(filters.maxInputPrice))) return false;
    return true;
  });
  const metric = (model) => {
    const reference = readReferenceModel(payload, model);
    if (filters.sort === "context") return Number(reference?.contextLength) || null;
    if (filters.sort === "price") {
      const price = tokenRateForDisplay(reference, "input");
      return price == null ? null : Number(price);
    }
    if (filters.sort === "newest") return Number(reference?.created) || null;
    return null;
  };
  if (filters.sort === "id") return filtered.sort((left, right) => modelId(left).localeCompare(modelId(right)));
  return filtered.sort((left, right) => {
    const a = metric(left);
    const b = metric(right);
    if (a === null) return b === null ? modelId(left).localeCompare(modelId(right)) : 1;
    if (b === null) return -1;
    return (filters.sort === "price" ? a - b : b - a) || modelId(left).localeCompare(modelId(right));
  });
}

export function paginateModels(models, page, pageSize) {
  const pageCount = Math.max(1, Math.ceil(models.length / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  return {
    page: safePage,
    pageCount,
    items: models.slice(start, start + pageSize),
  };
}
