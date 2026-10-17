export function publishedPrices(model) {
  const rows = [];
  function visit(value, path = []) {
    if (!value || typeof value !== "object") return;
    if (Number.isFinite(value.usd)) {
      rows.push({ label: path.join(" · "), usd: value.usd });
      return;
    }
    for (const [key, nested] of Object.entries(value)) visit(nested, [...path, key]);
  }
  visit(model.model_spec?.pricing);
  return rows;
}

export function displayPrice(model) {
  const pricing = model.model_spec?.pricing;
  const amount = (value) => Number.isFinite(value?.usd) ? value.usd : null;
  if (model.type === "video") return null;
  if (["text", "decision", "embedding", "tts"].includes(model.type)) return amount(pricing?.input);
  if (model.type === "asr") return amount(pricing?.per_audio_second);
  const rows = publishedPrices(model).filter(({ label }) => !label.startsWith("upscale") && !label.startsWith("inputImages"));
  return rows.length ? Math.min(...rows.map(({ usd }) => usd)) : null;
}

export function priceUnit(model) {
  if (["text", "decision", "embedding"].includes(model.type)) return "/1M tokens input";
  if (model.type === "tts") return "/1M characters";
  if (model.type === "asr") return "/audio second";
  if (model.type === "image") return "/image";
  if (model.type === "inpaint") return "/edit";
  if (model.type === "upscale") return "/generation";
  return " · see pricing";
}

export function sortVeniceModels(models, type, query, sort) {
  const search = query.trim().toLowerCase();
  return models.filter((model) => (type === "all" || model.type === type) && (!search || `${model.id} ${model.model_spec?.name ?? ""} ${model.model_spec?.description ?? ""}`.toLowerCase().includes(search)))
    .sort((left, right) => {
      if (sort.startsWith("price")) {
        const a = displayPrice(left);
        const b = displayPrice(right);
        if (a === null || b === null) return a === null ? (b === null ? left.id.localeCompare(right.id) : 1) : -1;
        return (sort === "price-asc" ? a - b : b - a) || left.id.localeCompare(right.id);
      }
      const order = sort === "newest" ? -1 : 1;
      return order * ((Number(left.created) || 0) - (Number(right.created) || 0)) || left.id.localeCompare(right.id);
    });
}
