import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  allOpenRouterModels, describeVideoSku, effectiveTokenPricing, filterAndSortModels, formatDurationOptions, formatEndpointPricing, formatSourceDate, formatTokenCount, formatUsdPerMillion, formatVideoSkuPrice, groupBatchModels, isTimePricingOverride, mediaAbilities, modelId,
  nextPricingChange, overrideCondition, paginateModels, pricingScheduleRows, readReferenceModel, tokenRateForDisplay,
} from "./lib/gateway-models.js";

const PAGE_SIZES = [25, 50, 100];
const CONTEXT_OPTIONS = [[0, "Any context"], [32_000, "32K+"], [128_000, "128K+"], [200_000, "200K+"], [1_000_000, "1M+"]];
const ABILITY_OPTIONS = { image: [["t2i", "T2I"], ["i2i", "I2I"]], video: [["t2v", "T2V"], ["i2v", "I2V"], ["v2v", "V2V"]] };

function formatUpdatedAt(value) {
  if (!value) return "not loaded";
  return `${new Intl.DateTimeFormat("en", { timeZone: "UTC", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value))} UTC`;
}

function FactRows({ items }) {
  return <dl className="catalog-facts">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value ?? "—"}</dd></div>)}</dl>;
}

function TokenValue({ value, detail = false }) {
  const display = formatTokenCount(value);
  if (display === "—") return display;
  return <span title={`${Number(value).toLocaleString("en-US")} tokens`}>{display}{detail ? " tokens" : ""}</span>;
}

function PriceValue({ value, detail = false }) {
  if (value === null || value === undefined || value === "") return "—";
  return <span title={`OpenRouter: ${value} USD/token`}>{formatUsdPerMillion(value)}{detail ? <small className="catalog-raw-value">{value} USD/token</small> : null}</span>;
}

function DiscountBadge({ value }) {
  if (!value) return null;
  return <span className="catalog-discount-badge" title="Highest explicit discount among loaded provider endpoints; applies only to that endpoint.">{new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value * 100)}% off</span>;
}

function ScheduledPricing({ pricing, modelLevel = false }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const current = effectiveTokenPricing(pricing, now);
  const next = nextPricingChange(pricing, now);
  const rates = (values) => Object.entries({ Input: values.prompt, Output: values.completion, "Cache read": values.input_cache_read, "Cache write": values.input_cache_write, "Cache write 1h": values.input_cache_write_1h })
    .filter(([, value]) => value != null).map(([label, value]) => `${label} ${formatUsdPerMillion(value)}/1M`).join(" · ");
  return <div className="catalog-scheduled-pricing">
    <strong>Current reference rate · {new Intl.DateTimeFormat("en", { timeZone: "UTC", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now)} UTC</strong>
    <div>{rates(current)}</div>
    {next ? <small>Next rate change: {new Intl.DateTimeFormat("en", { timeZone: "UTC", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(next)} UTC</small> : null}
    <details><summary>UTC pricing rules</summary>{pricingScheduleRows(pricing).map(({ conditions, rates: values }, index) => <div key={index} className="catalog-schedule-row"><span>{conditions.join("; ")}</span><span>{rates(values)}</span></div>)}</details>
    {modelLevel ? <small>Model-level reference only. Provider endpoint prices may differ.</small> : null}
  </div>;
}

const ENDPOINT_PRICE_FIELDS = [
  ["prompt", "Input", "/M"], ["completion", "Output", "/M"],
  ["input_cache_read", "Cache read", "/M"], ["input_cache_write", "Cache write", "/M"],
  ["input_cache_write_1h", "Cache write 1h", "/M"], ["web_search", "Web search", "/call"],
];

function EndpointRateItems({ pricing }) {
  const known = new Set(ENDPOINT_PRICE_FIELDS.map(([key]) => key));
  const extras = Object.entries(pricing).filter(([key, value]) => !known.has(key) && !["discount", "overrides", "min_prompt_tokens", "utc_days", "utc_start", "utc_end"].includes(key) && value != null && typeof value !== "object");
  const items = [...ENDPOINT_PRICE_FIELDS.filter(([key]) => pricing[key] != null), ...extras.map(([key]) => [key, key.replaceAll("_", " "), ""])];
  const dollars = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 8 }).format(Number(value));
  return <span className="catalog-price-items">
    {items.map(([key, label, unit]) => <span className="catalog-price-item" key={key}><small>{label}</small><strong>{unit === "/M" ? formatUsdPerMillion(pricing[key]) : dollars(pricing[key])}{unit}</strong></span>)}
    {Number(pricing.discount) > 0 ? <span className="catalog-price-discount">{Number(pricing.discount) * 100}% off</span> : null}
  </span>;
}

function EndpointPricing({ pricing }) {
  if (!pricing || typeof pricing !== "object" || Array.isArray(pricing)) return formatEndpointPricing(pricing);
  const overrides = pricing.overrides ?? [];
  return <div className="catalog-endpoint-prices">
    <div className="catalog-price-tier">{overrides.length ? <span className="catalog-price-condition">Base</span> : null}<EndpointRateItems pricing={pricing} /></div>
    {overrides.filter((override) => !isTimePricingOverride(override)).map((override, index) => <div className="catalog-price-tier" key={index}><span className="catalog-price-condition">{overrideCondition(override)}</span><EndpointRateItems pricing={override} /></div>)}
    {overrides.some(isTimePricingOverride) ? <ScheduledPricing pricing={pricing} /> : null}
  </div>;
}

function EndpointRow({ endpoint, provider }) {
  const prefix = provider.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const tag = endpoint.tag?.startsWith(`${prefix}/`) ? `/${endpoint.tag.slice(prefix.length + 1)}` : endpoint.tag === prefix ? "" : endpoint.tag;
  return <div className="catalog-endpoint">
    <code className="catalog-endpoint-tag" title={endpoint.tag || undefined}>{tag || (endpoint.tag ? "root" : "tag unreported")}</code>
    <EndpointPricing pricing={endpoint.pricing} />
  </div>;
}

function EndpointGroups({ endpoints }) {
  const groups = new Map();
  for (const endpoint of endpoints) {
    const provider = endpoint.providerName || "Provider unreported";
    if (!groups.has(provider)) groups.set(provider, []);
    groups.get(provider).push(endpoint);
  }
  return [...groups].map(([provider, variants]) => <div className="catalog-provider-group" key={provider}>
    <strong>{provider}</strong>
    <div>{variants.map((endpoint, index) => <EndpointRow key={`${endpoint.tag}-${index}`} endpoint={endpoint} provider={provider} />)}</div>
  </div>);
}

function DateValue({ value }) {
  if (value === null || value === undefined || value === "") return "—";
  const display = formatSourceDate(value);
  return <span title={`Source value: ${value}`}>{display}{display === String(value) ? "" : " UTC"}</span>;
}

function FieldList({ values }) {
  if (!values?.length) return "—";
  return <span className="catalog-field-list">{values.map((value) => <code key={value}>{value}</code>)}</span>;
}

function AbilityBadges({ reference, outputModality }) {
  const abilities = mediaAbilities(reference);
  const labels = (ABILITY_OPTIONS[outputModality] ?? []).filter(([key]) => abilities[key]).map(([, label]) => label);
  return labels.length ? <span className="catalog-ability-badges">{labels.map((label) => <span key={label}>{label}</span>)}</span> : null;
}

function VideoPriceList({ skus, resolutions, durations }) {
  const entries = Object.entries(skus ?? {});
  const groups = ["T2V", "I2V", "V2V", "Reference mode", "Input charges", "Mode unspecified"];
  return <div className="catalog-video-prices">
    <div className="catalog-media-specs">Resolutions: {resolutions?.join(", ") || "not reported"} · Durations: {formatDurationOptions(durations)}</div>
    {entries.length ? groups.map((group) => {
      const rates = entries.filter(([key]) => describeVideoSku(key).group === group);
      return rates.length ? <div className="catalog-rate-group" key={group}><strong>{group}</strong>{rates.map(([key, value]) => <div className="catalog-rate-row" key={key} title={key}><span>{describeVideoSku(key).label}</span><span>{formatVideoSkuPrice(key, value)}</span></div>)}</div> : null;
    }) : <span>Video prices not reported.</span>}
  </div>;
}

function ImagePriceList({ result, resolutions, paused = false }) {
  return <div className="catalog-image-rate-list">
    <div className="catalog-media-specs">Resolutions: {resolutions?.join(", ") || "not reported"}</div>
    {!result?.endpoints ? (result?.loading ? "Loading image prices…" : result?.error || (paused ? "Paused by rate limit" : "Queued for loading…"))
      : result.endpoints.length ? <>{result.loading ? <small>Updating…</small> : result.error ? <small>Update failed: {result.error}</small> : null}{result.endpoints.map((endpoint, index) => <div className="catalog-rate-group" key={`${endpoint.tag}-${index}`}><strong>{endpoint.providerName || "Provider unreported"}{endpoint.tag ? <small> · {endpoint.tag}</small> : null}</strong>{Array.isArray(endpoint.pricing) ? endpoint.pricing.map((price, priceIndex) => <div className="catalog-rate-row" key={`${price.variant}-${price.billable}-${priceIndex}`}><span>{[price.variant, price.billable?.replaceAll("_", " ")].filter(Boolean).join(" · ") || "Rate"}</span><span>{Number.isFinite(Number(price.cost_usd)) ? `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 8 }).format(Number(price.cost_usd))}/${price.unit}` : "—"}</span></div>) : <span>{formatEndpointPricing(endpoint.pricing)}</span>}</div>)}</> : "Image prices not reported."}
  </div>;
}

function ModelInspector({ model, reference, outputModality, imagePrices, imagePricesPaused }) {
  const [copyStatus, setCopyStatus] = useState("idle");
  const id = modelId(model);

  useEffect(() => { setCopyStatus("idle"); }, [id]);

  async function copyId() {
    try {
      let copied = false;
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(id);
          copied = true;
        } catch {
          // Some embedded browsers deny the async clipboard API.
        }
      }
      if (!copied) {
        const input = document.createElement("textarea");
        input.value = id;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("Copy failed");
      }
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  if (!model) return <aside className="gateway-detail catalog-inspector detail-empty">Select a model to review its details.</aside>;

  return (
    <aside className="gateway-detail catalog-inspector" aria-label="Model details">
      <div className="catalog-inspector-head">
        <div><p className="catalog-overline">MODEL DETAILS</p><h2>{reference?.name || id}</h2><code>{id}</code></div>
        <button className="button" type="button" onClick={copyId} aria-label={`Copy ${id} model ID`}>{copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Copy failed" : "Copy ID"}</button>
      </div>
      {reference?.description ? <p className="gateway-description">{reference.description}</p> : null}

      <section className="catalog-inspector-section">
        <h3>Overview</h3>
        <FactRows items={[
          ["Context window", <TokenValue value={Number(reference?.contextLength) > 0 ? reference.contextLength : null} detail />],
          ["Max output", <TokenValue value={Number(reference?.maxOutputTokens) > 0 ? reference.maxOutputTokens : null} detail />],
          ...(outputModality === "text" ? [
            ["Base input / 1M tokens", <PriceValue value={tokenRateForDisplay(reference, "input")} detail />],
            ["Base output / 1M tokens", <PriceValue value={tokenRateForDisplay(reference, "output")} detail />],
          ] : []),
        ]} />
        <p className="catalog-source-note">Prices are OpenRouter reference rates, not Maxshot Gateway billing.</p>
        {outputModality === "text" && reference?.pricing?.overrides?.some(isTimePricingOverride) ? <ScheduledPricing pricing={{ prompt: reference.pricing.input, completion: reference.pricing.output, input_cache_read: reference.pricing.cacheRead, overrides: reference.pricing.overrides }} modelLevel /> : null}
      </section>

      {outputModality === "image" ? <section className="catalog-inspector-section"><h3>Image pricing · OpenRouter endpoints</h3><AbilityBadges reference={reference} outputModality="image" /><ImagePriceList result={imagePrices} resolutions={reference?.imageSupportedResolutions} paused={imagePricesPaused} /></section> : null}
      {outputModality === "video" ? <section className="catalog-inspector-section"><h3>Video pricing · OpenRouter SKUs</h3><AbilityBadges reference={reference} outputModality="video" /><VideoPriceList skus={reference?.videoPricingSkus} resolutions={reference?.videoSupportedResolutions} durations={reference?.videoSupportedDurations} /></section> : null}

      <section className="catalog-inspector-section">
        <h3>OpenRouter fields</h3>
        <FactRows items={[
          ["Input modalities", <FieldList values={reference?.inputModalities} />],
          ["Output modalities", <FieldList values={reference?.outputModalities} />],
          ["Request parameters", <FieldList values={reference?.supportedParameters} />],
        ]} />
      </section>

      <section className="catalog-inspector-section">
        <h3>Source & identity</h3>
        <FactRows items={[
          ["Canonical slug", reference?.canonicalSlug || "—"],
          ["OpenRouter created", <DateValue value={reference?.created} />],
          ["Expiration", <DateValue value={reference?.expirationDate} />],
        ]} />
      </section>
    </aside>
  );
}

export default function GatewayModelsPage() {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [inputModality, setInputModality] = useState("all");
  const [outputModality, setOutputModality] = useState("text");
  const [abilityFilter, setAbilityFilter] = useState("all");
  const [minContext, setMinContext] = useState(0);
  const [maxInputPrice, setMaxInputPrice] = useState("");
  const [sort, setSort] = useState("id");
  const [batchFilter, setBatchFilter] = useState("all");
  const [discountOnly, setDiscountOnly] = useState(false);
  const [referenceRateOnly, setReferenceRateOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedId, setSelectedId] = useState("");
  const [expandedEndpointsId, setExpandedEndpointsId] = useState("");
  const [endpointResults, setEndpointResults] = useState({});
  const [imagePricesPaused, setImagePricesPaused] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const initialLoadStarted = useRef(false);

  async function loadEndpoints(id, force = false, version = 0) {
    const previous = endpointResults[id] ?? payload?.endpointPrices?.[id];
    if (!force && previous?.endpoints) return true;
    setEndpointResults((current) => ({ ...current, [id]: { ...previous, loading: true, error: null } }));
    try {
      const response = await fetch(`/api/gateway-model-endpoints?model=${encodeURIComponent(id)}${force ? "&refresh=1" : ""}`);
      const result = await response.json();
      if (!response.ok) {
        const error = new Error(result.error || "Endpoint lookup failed.");
        error.rateLimited = response.status === 429;
        throw error;
      }
      setEndpointResults((current) => ({ ...current, [id]: { endpoints: result.endpoints, refreshedVersion: version } }));
      return true;
    } catch (endpointError) {
      setEndpointResults((current) => ({ ...current, [id]: { ...previous, error: endpointError.message } }));
      return !endpointError.rateLimited;
    }
  }

  function toggleEndpoints(id) {
    if (expandedEndpointsId === id) { setExpandedEndpointsId(""); return; }
    setExpandedEndpointsId(id);
    void loadEndpoints(id);
  }

  function selectOutputModality(value) {
    setOutputModality(value);
    setAbilityFilter("all");
    if (value !== "text") {
      setMaxInputPrice("");
      setSort((current) => current === "price" ? "id" : current);
    }
  }

  const loadModels = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/gateway-models${force ? "?refresh=1" : ""}`);
      const nextPayload = await response.json();
      if (!response.ok) throw nextPayload.error || new Error("OpenRouter catalog request failed.");
      setPayload(nextPayload);
      if (force) setRefreshVersion((current) => current + 1);
      setSelectedId((current) => nextPayload.reference?.models?.[current] ? current : "");
    } catch (nextError) {
      setError(nextError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialLoadStarted.current) return;
    initialLoadStarted.current = true;
    void loadModels();
  }, [loadModels]);

  const catalogModels = useMemo(() => allOpenRouterModels(payload), [payload]);
  const maxDiscountByModel = useMemo(() => new Map(Object.entries({ ...payload?.endpointPrices, ...endpointResults })
    .map(([id, result]) => [id, Math.max(0, ...(result.endpoints ?? []).map(({ pricing }) => Number(pricing?.discount) || 0))])
    .filter(([, discount]) => discount > 0)), [payload, endpointResults]);

  useEffect(() => {
    if (outputModality !== "image") return;
    setImagePricesPaused(false);
    const ids = catalogModels.filter((model) => readReferenceModel(payload, model)?.outputModalities?.includes("image"))
      .map(modelId).filter((id) => {
        const cached = endpointResults[id] ?? payload?.endpointPrices?.[id];
        return !endpointResults[id]?.loading && (!cached?.endpoints || (refreshVersion > 0 && endpointResults[id]?.refreshedVersion !== refreshVersion));
      });
    let active = true;
    let next = 0;
    let rateLimited = false;
    async function loadNext() {
      while (active && !rateLimited && next < ids.length) {
        if (!await loadEndpoints(ids[next++], refreshVersion > 0, refreshVersion)) {
          rateLimited = true;
          if (active) setImagePricesPaused(true);
        }
      }
    }
    void Promise.all(Array.from({ length: Math.min(3, ids.length) }, loadNext));
    return () => { active = false; };
  }, [outputModality, catalogModels, refreshVersion]);

  const inputModalities = useMemo(() => [...new Set(catalogModels.flatMap((model) => readReferenceModel(payload, model)?.inputModalities ?? []))].sort(), [catalogModels, payload]);
  const filtered = useMemo(() => filterAndSortModels(catalogModels, payload, {
    query, inputModality, outputModality, minContext, maxInputPrice, sort,
  }).filter((model) => abilityFilter === "all" || mediaAbilities(readReferenceModel(payload, model))[abilityFilter]), [catalogModels, payload, query, inputModality, outputModality, abilityFilter, minContext, maxInputPrice, sort]);
  const grouped = useMemo(() => {
    const groups = groupBatchModels(filtered, catalogModels);
    const batchGroups = batchFilter === "unmatched" ? groups.filter(({ model }) => modelId(model).endsWith(":batch")) : groups;
    const rateGroups = referenceRateOnly ? batchGroups.filter(({ model, batch }) => [model, batch].some((item) => item && readReferenceModel(payload, item)?.pricing?.overrides?.some(isTimePricingOverride))) : batchGroups;
    return discountOnly ? rateGroups.filter(({ model, batch }) => maxDiscountByModel.has(modelId(model)) || (batch && maxDiscountByModel.has(modelId(batch)))) : rateGroups;
  }, [filtered, catalogModels, payload, batchFilter, referenceRateOnly, discountOnly, maxDiscountByModel]);
  const paginated = useMemo(() => paginateModels(grouped, page, pageSize), [grouped, page, pageSize]);
  const selectedGroup = grouped.find(({ model, batch }) => modelId(model) === selectedId || (batch && modelId(batch) === selectedId));
  const inspectedModel = selectedGroup ? (modelId(selectedGroup.batch) === selectedId ? selectedGroup.batch : selectedGroup.model) : paginated.items[0]?.model ?? null;
  const referenceCount = Object.keys(payload?.reference?.models ?? {}).length;
  const referenceNotice = payload?.reference?.error
    ? referenceCount ? "OpenRouter update failed · showing cached data" : "OpenRouter request failed"
    : payload?.reference?.videoPricingError ? "Video prices unavailable · No availability probes" : "No availability probes on this page";

  useEffect(() => { setPage(1); }, [query, inputModality, outputModality, abilityFilter, minContext, maxInputPrice, sort, batchFilter, discountOnly, referenceRateOnly, pageSize]);

  return (
    <div className="gateway-models-page">
      <header className="gateway-page-header">
        <div><h1>All Models</h1><p>OpenRouter catalog</p></div>
        <div className="gateway-header-status"><span className={`status-dot ${referenceCount ? "is-live" : ""}`} /><strong>{payload ? `${catalogModels.length} models` : "Waiting for data"}</strong><button className="button button-primary" type="button" onClick={() => loadModels(true)} disabled={loading}>{loading ? "Loading…" : "Refresh"}</button></div>
      </header>

      <div className="catalog-reference-line">
        <span>{referenceCount ? `${referenceCount} OpenRouter models · updated ${formatUpdatedAt(payload?.reference?.dataUpdatedAt)}` : "OpenRouter model data unavailable."}</span>
        <span title={[payload?.reference?.error, payload?.reference?.videoPricingError].filter(Boolean).join(" · ") || undefined}>{referenceNotice}</span>
      </div>

      {error ? (
        <div className="setup-error" role="alert"><h2>Model data unavailable</h2><p>{error.message}</p><button className="button" type="button" onClick={() => loadModels(true)}>Retry</button></div>
      ) : (
        <div className="gateway-workspace catalog-workspace">
          <main className="gateway-main catalog-main">
            <div className="catalog-toolbar">
              <label className="search-control gateway-search"><span className="visually-hidden">Search models</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search source fields…" /></label>
              <label className="catalog-select"><span>Input modality</span><select value={inputModality} onChange={(event) => setInputModality(event.target.value)}><option value="all">All</option>{inputModalities.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <label className="catalog-select"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="id">Model ID A–Z</option>{outputModality === "text" ? <option value="price">Input price ↑</option> : null}<option value="context">Context ↓</option><option value="newest">Newest ↓</option></select></label>
            </div>
            <div className="catalog-output-filter" aria-label="Filter by output modality">{[["text", "Text"], ["image", "Image"], ["video", "Video"]].map(([value, label]) => <button key={value} type="button" aria-pressed={outputModality === value} onClick={() => selectOutputModality(value)}>{label} <span>{catalogModels.filter((model) => readReferenceModel(payload, model)?.outputModalities?.includes(value)).length}</span></button>)}</div>
            {ABILITY_OPTIONS[outputModality] ? <div className="catalog-ability-filter" aria-label="Filter by generation ability"><span>Ability</span>{[["all", "All"], ...ABILITY_OPTIONS[outputModality]].map(([key, label]) => <button key={key} type="button" aria-pressed={abilityFilter === key} onClick={() => setAbilityFilter(key)}>{label}</button>)}<small>Rates are grouped only when OpenRouter names the mode.</small></div> : null}
            <div className="catalog-filter-line">
              <label className="catalog-select"><span>Min context</span><select value={minContext} onChange={(event) => setMinContext(Number(event.target.value))}>{CONTEXT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="catalog-select"><span>Batch models</span><select value={batchFilter} onChange={(event) => setBatchFilter(event.target.value)}><option value="all">All</option><option value="unmatched">Without standard model</option></select></label>
              {outputModality === "text" ? <label className="catalog-price-filter"><span>Max input $/1M</span><input type="number" min="0" step="any" value={maxInputPrice} onChange={(event) => setMaxInputPrice(event.target.value)} placeholder="Any" /></label> : null}
              <label className="catalog-discount-filter" title="Only discounts reported by loaded provider endpoint prices; unchecked models are not scanned."><input type="checkbox" checked={discountOnly} onChange={(event) => setDiscountOnly(event.target.checked)} />Reported discounts</label>
              <label className="catalog-discount-filter" title="Models with a time-window pricing override in OpenRouter model-level reference rates."><input type="checkbox" checked={referenceRateOnly} onChange={(event) => setReferenceRateOnly(event.target.checked)} />Report Reference Rate</label>
              <label className="catalog-select"><span>Rows</span><select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
              <span className="catalog-result-count">{grouped.length} matching rows</span>
              <button className="catalog-clear" type="button" onClick={() => { setQuery(""); setInputModality("all"); setOutputModality("text"); setAbilityFilter("all"); setMinContext(0); setMaxInputPrice(""); setSort("id"); setBatchFilter("all"); setDiscountOnly(false); setReferenceRateOnly(false); }}>Clear filters</button>
            </div>

            {loading && !payload ? <div className="loading-state">Loading OpenRouter models…</div> : (
              <div className="gateway-table-scroll catalog-table-scroll">
                <table className={`gateway-model-table catalog-table${outputModality === "text" ? "" : " catalog-media-table"}`}>
                  <thead><tr><th>Model</th>{outputModality === "text" ? <><th>Context tokens</th><th>Input modalities</th><th>Output modalities</th><th>Base input / 1M</th><th>Base output / 1M</th></> : <><th>Abilities</th><th>Supported formats &amp; prices</th></>}</tr></thead>
                  <tbody>{paginated.items.map(({ model, batch }) => {
                    const id = modelId(model);
                    const reference = readReferenceModel(payload, model);
                    const batchReference = batch ? readReferenceModel(payload, batch) : null;
                    const endpointResult = endpointResults[id] ?? payload?.endpointPrices?.[id];
                    return (
                      <Fragment key={id}>
                      <tr data-selected={id === modelId(inspectedModel) || (batch && modelId(batch) === modelId(inspectedModel))} tabIndex={0} aria-label={`Inspect ${id}`} onClick={() => setSelectedId(id)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setSelectedId(id); } }}>
                        <td><span className="catalog-model-name">{reference?.name || id}</span><span className="catalog-model-id">{id}</span>{outputModality === "text" && reference?.pricing?.overrides?.some(isTimePricingOverride) ? <span className="catalog-schedule-badge">Scheduled pricing</span> : null}{batch ? <button className="catalog-batch-link" type="button" onClick={(event) => { event.stopPropagation(); setSelectedId(modelId(batch)); }}>Batch · {modelId(batch)}</button> : null}{outputModality === "text" ? <button className="catalog-endpoints-toggle" type="button" aria-expanded={expandedEndpointsId === id} onClick={(event) => { event.stopPropagation(); toggleEndpoints(id); }}>{expandedEndpointsId === id ? "Hide endpoints" : "Show endpoint prices"}</button> : null}</td>
                        {outputModality === "text" ? <><td className="numeric"><TokenValue value={Number(reference?.contextLength) > 0 ? reference.contextLength : null} /></td><td>{reference?.inputModalities?.join(", ") || "—"}</td><td>{reference?.outputModalities?.join(", ") || "—"}</td><td className="numeric catalog-money"><PriceValue value={tokenRateForDisplay(reference, "input")} /><DiscountBadge value={maxDiscountByModel.get(id)} />{batch ? <span className="catalog-batch-price" title="Batch price"><PriceValue value={tokenRateForDisplay(batchReference, "input")} /><DiscountBadge value={maxDiscountByModel.get(modelId(batch))} /></span> : null}</td><td className="numeric catalog-money"><PriceValue value={tokenRateForDisplay(reference, "output")} />{batch ? <span className="catalog-batch-price" title="Batch price"><PriceValue value={tokenRateForDisplay(batchReference, "output")} /></span> : null}</td></> : <><td><AbilityBadges reference={reference} outputModality={outputModality} /></td><td className="catalog-media-pricing">{outputModality === "image" ? <ImagePriceList result={endpointResults[id] ?? payload?.endpointPrices?.[id]} resolutions={reference?.imageSupportedResolutions} paused={imagePricesPaused} /> : <VideoPriceList skus={reference?.videoPricingSkus} resolutions={reference?.videoSupportedResolutions} durations={reference?.videoSupportedDurations} />}<DiscountBadge value={maxDiscountByModel.get(id)} /></td></>}
                      </tr>
                      {outputModality === "text" && expandedEndpointsId === id ? <tr className="catalog-endpoint-detail-row"><td colSpan={6}><div className="catalog-endpoints">{endpointResult?.loading ? "Loading endpoints…" : endpointResult?.error ? endpointResult.error : endpointResult?.endpoints?.length ? <EndpointGroups endpoints={endpointResult.endpoints} /> : "No provider endpoints reported."}</div></td></tr> : null}
                      </Fragment>
                    );
                  })}</tbody>
                </table>
                {grouped.length === 0 ? <div className="empty-table">{referenceCount ? "No models match these filters." : "OpenRouter model data is not available yet."}</div> : null}
              </div>
            )}

            <div className="gateway-pagination catalog-pagination"><span>Showing {grouped.length === 0 ? 0 : (paginated.page - 1) * pageSize + 1}–{Math.min(paginated.page * pageSize, grouped.length)} of {grouped.length}</span><div><button className="button" type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={paginated.page === 1}>Previous</button><span>Page {paginated.page} of {paginated.pageCount}</span><button className="button" type="button" onClick={() => setPage((current) => Math.min(paginated.pageCount, current + 1))} disabled={paginated.page === paginated.pageCount}>Next</button></div></div>
          </main>
          <ModelInspector model={inspectedModel} reference={readReferenceModel(payload, inspectedModel)} outputModality={outputModality} imagePrices={endpointResults[modelId(inspectedModel)] ?? payload?.endpointPrices?.[modelId(inspectedModel)]} imagePricesPaused={imagePricesPaused} />
        </div>
      )}
    </div>
  );
}
