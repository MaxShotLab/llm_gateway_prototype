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
  if (model?.owned_by) return String(model.owned_by);
  const id = modelId(model);
  return id.includes("/") ? id.split("/", 1)[0] : "—";
}

export function searchableModelText(model) {
  return [
    modelId(model),
    model?.displayName,
    model?.tags,
    model?.capabilities,
  ].filter(Boolean).map((value) => typeof value === "object" ? JSON.stringify(value) : String(value)).join(" ").toLowerCase();
}

export function readStrategyScore(payload, model) {
  const value = payload?.strategy?.scores?.[modelId(model)];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
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
