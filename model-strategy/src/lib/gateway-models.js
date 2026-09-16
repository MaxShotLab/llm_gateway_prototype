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
  const id = modelId(model).replace(/^~/, "");
  return id.includes("/") ? id.split("/", 1)[0] : String(model?.owned_by ?? "—");
}

export function modelVariant(model) {
  const id = modelId(model);
  if (id.startsWith("~")) return "latest";
  const variant = id.split(":")[1];
  return variant || "standard";
}

export function readReferenceModel(payload, model) {
  return payload?.reference?.models?.[modelId(model)] ?? null;
}

export function referencePricePerMillion(value) {
  if (value === null || value === undefined || value === "") return null;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price * 1_000_000 : null;
}

export function modelCapabilities(reference) {
  if (!reference) return [];
  const input = reference.inputModalities ?? [];
  const output = reference.outputModalities ?? [];
  const parameters = reference.supportedParameters ?? [];
  return [
    input.includes("image") && "Vision",
    (input.includes("audio") || output.includes("audio")) && "Audio",
    parameters.some((value) => ["reasoning", "include_reasoning", "reasoning_effort"].includes(value)) && "Reasoning",
    parameters.some((value) => ["tools", "tool_choice"].includes(value)) && "Tools",
    input.includes("file") && "Files",
  ].filter(Boolean);
}

export function searchableModelText(model, reference) {
  return [
    modelId(model),
    model?.displayName,
    reference?.name,
    reference?.description,
    model?.tags,
    modelCapabilities(reference),
  ].filter(Boolean).map((value) => typeof value === "object" ? JSON.stringify(value) : String(value)).join(" ").toLowerCase();
}

export function readStrategyScore(payload, model) {
  const value = payload?.strategy?.scores?.[modelId(model)];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function filterAndSortGatewayModels(models, payload, filters) {
  const query = filters.query.trim().toLowerCase();
  const filtered = models.filter((model) => {
    const reference = readReferenceModel(payload, model);
    const inputPrice = referencePricePerMillion(reference?.pricing?.input);
    if (query && !searchableModelText(model, reference).includes(query)) return false;
    if (filters.provider !== "all" && modelProvider(model) !== filters.provider) return false;
    if (filters.variant !== "all" && modelVariant(model) !== filters.variant) return false;
    if (filters.capability !== "all" && !modelCapabilities(reference).includes(filters.capability)) return false;
    if (filters.minContext && !(Number(reference?.contextLength) >= filters.minContext)) return false;
    if (filters.maxInputPrice !== "" && (inputPrice === null || inputPrice > Number(filters.maxInputPrice))) return false;
    return true;
  });
  const metric = (model) => {
    const reference = readReferenceModel(payload, model);
    if (filters.sort === "context") return Number(reference?.contextLength) || null;
    if (filters.sort === "price") return referencePricePerMillion(reference?.pricing?.input);
    if (filters.sort === "score") return readStrategyScore(payload, model);
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
