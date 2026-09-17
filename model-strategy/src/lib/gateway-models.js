export function readGatewayModels(payload) {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
}

export function modelId(model) {
  return String(model?.id ?? model?.model_name ?? model?.name ?? "");
}

export function modelProvider(model) {
  return String(model?.owned_by ?? "—");
}

export function readReferenceModel(payload, model) {
  return payload?.reference?.models?.[modelId(model)] ?? null;
}

export function modelsWithReference(models, payload) {
  return models.filter((model) => readReferenceModel(payload, model) !== null);
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

export function formatSourceDate(value) {
  if (value === null || value === undefined || value === "") return "—";
  const date = /^\d+$/.test(String(value)) ? new Date(Number(value) * 1_000) : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", year: "numeric", month: "short", day: "numeric" }).format(date);
}

export function searchableModelText(model, reference) {
  return [
    modelId(model),
    model?.displayName,
    reference?.name,
    reference?.description,
    model?.tags,
    reference?.inputModalities,
    reference?.outputModalities,
    reference?.supportedParameters,
  ].filter(Boolean).map((value) => typeof value === "object" ? JSON.stringify(value) : String(value)).join(" ").toLowerCase();
}

export function filterAndSortGatewayModels(models, payload, filters) {
  const query = filters.query.trim().toLowerCase();
  const filtered = models.filter((model) => {
    const reference = readReferenceModel(payload, model);
    const inputPrice = pricePerMillion(reference?.pricing?.input);
    if (query && !searchableModelText(model, reference).includes(query)) return false;
    if (filters.provider !== "all" && modelProvider(model) !== filters.provider) return false;
    if (filters.inputModality !== "all" && !reference?.inputModalities?.includes(filters.inputModality)) return false;
    if (filters.minContext && !(Number(reference?.contextLength) >= filters.minContext)) return false;
    if (filters.maxInputPrice !== "" && (inputPrice === null || inputPrice > Number(filters.maxInputPrice))) return false;
    return true;
  });
  const metric = (model) => {
    const reference = readReferenceModel(payload, model);
    if (filters.sort === "context") return Number(reference?.contextLength) || null;
    if (filters.sort === "price") return reference?.pricing?.input == null ? null : Number(reference.pricing.input);
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
