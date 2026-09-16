import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  filterAndSortGatewayModels, modelCapabilities, modelId, modelProvider, modelVariant,
  paginateModels, readGatewayModels, readReferenceModel, readStrategyScore, referencePricePerMillion,
} from "./lib/gateway-models.js";

const PAGE_SIZES = [25, 50, 100];
const CAPABILITIES = ["Vision", "Audio", "Reasoning", "Tools", "Files"];
const CONTEXT_OPTIONS = [[0, "Any context"], [32_000, "32K+"], [128_000, "128K+"], [200_000, "200K+"], [1_000_000, "1M+"]];

function formatTokens(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "—";
  if (number >= 1_000_000) return `${Number((number / 1_000_000).toFixed(2))}M`;
  if (number >= 1_000) return `${Number((number / 1_000).toFixed(1))}K`;
  return String(number);
}

function formatPrice(value) {
  const price = referencePricePerMillion(value);
  if (price === null) return "—";
  if (price === 0) return "$0";
  return `$${price < 0.01 ? price.toFixed(4) : price < 1 ? price.toFixed(3) : price.toFixed(2)}`;
}

function formatDate(value) {
  const timestamp = Number(value);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return "—";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(new Date(timestamp * 1000));
}

function formatUpdatedAt(value) {
  if (!value) return "not loaded";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function variantNote(variant) {
  if (variant === "latest") return "Moving alias: the concrete model can change without changing this ID.";
  if (variant === "batch") return "Asynchronous batch variant; not intended for interactive chat.";
  if (variant === "free") return "Free variant; rate limits and availability may differ from the paid model.";
  if (variant === "standard") return "Standard model ID without a routing variant.";
  return `Variant: ${variant}. Check its routing behavior before use.`;
}

function FactRows({ items }) {
  return <dl className="catalog-facts">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value ?? "—"}</dd></div>)}</dl>;
}

function ModelInspector({ model, reference, score }) {
  const [copyStatus, setCopyStatus] = useState("idle");
  const id = modelId(model);
  const variant = modelVariant(model);
  const capabilities = modelCapabilities(reference);

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
        <div><p className="catalog-overline">MODEL DETAILS</p><h2>{reference?.name || model.displayName || model.name || id}</h2><code>{id}</code></div>
        <button className="button" type="button" onClick={copyId} aria-label={`Copy ${id} model ID`}>{copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Copy failed" : "Copy ID"}</button>
      </div>
      <div className="catalog-inspector-status"><span className="catalog-variant" data-variant={variant}>{variant}</span><span>Listed by Gateway · live availability not checked</span></div>
      <p className="catalog-variant-note">{variantNote(variant)}</p>
      {reference?.description ? <p className="gateway-description">{reference.description}</p> : null}

      <section className="catalog-inspector-section">
        <h3>Overview</h3>
        <FactRows items={[
          ["Provider", modelProvider(model)],
          ["Context window", formatTokens(reference?.contextLength)],
          ["Max output", formatTokens(reference?.maxOutputTokens)],
          ["Input · USD / 1M", formatPrice(reference?.pricing?.input)],
          ["Output · USD / 1M", formatPrice(reference?.pricing?.output)],
          ["Strategy score", score === null ? "—" : score.toFixed(1)],
        ]} />
        <p className="catalog-source-note">Prices are OpenRouter reference rates, not Maxshot Gateway billing. Score is derived without live availability checks.</p>
      </section>

      <section className="catalog-inspector-section">
        <h3>Capabilities & limits</h3>
        <div className="catalog-detail-tags">{capabilities.length ? capabilities.map((capability) => <span key={capability}>{capability}</span>) : <span className="catalog-muted">No capability metadata</span>}</div>
        <FactRows items={[
          ["Input modalities", reference?.inputModalities?.join(", ") || "—"],
          ["Output modalities", reference?.outputModalities?.join(", ") || "—"],
          ["Request parameters", reference?.supportedParameters?.join(", ") || "—"],
        ]} />
      </section>

      <section className="catalog-inspector-section">
        <h3>Source & identity</h3>
        <FactRows items={[
          ["OpenRouter listing", reference ? "Matched" : "No exact ID match"],
          ["Canonical slug", reference?.canonicalSlug || "—"],
          ["OpenRouter created", formatDate(reference?.created)],
          ["Gateway created", formatDate(model.created)],
          ["Expiration", reference?.expirationDate || "—"],
          ["Gateway object", model.object || "—"],
          ["Gateway endpoints", model.supported_endpoint_types?.join(", ") || "—"],
        ]} />
        <details className="catalog-raw-data"><summary>Gateway response · raw JSON</summary><pre>{JSON.stringify(model, null, 2)}</pre></details>
      </section>
    </aside>
  );
}

export default function GatewayModelsPage() {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState("all");
  const [variant, setVariant] = useState("all");
  const [capability, setCapability] = useState("all");
  const [minContext, setMinContext] = useState(0);
  const [maxInputPrice, setMaxInputPrice] = useState("");
  const [sort, setSort] = useState("id");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedId, setSelectedId] = useState("");
  const initialLoadStarted = useRef(false);

  const loadModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gateway-models");
      const nextPayload = await response.json();
      if (!response.ok) throw nextPayload.error || new Error("Gateway model request failed.");
      const models = readGatewayModels(nextPayload);
      setPayload(nextPayload);
      setSelectedId((current) => models.some((model) => modelId(model) === current) ? current : "");
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

  const models = useMemo(() => readGatewayModels(payload), [payload]);
  const providers = useMemo(() => [...new Set(models.map(modelProvider))].sort(), [models]);
  const variants = useMemo(() => [...new Set(models.map(modelVariant))].sort(), [models]);
  const filtered = useMemo(() => filterAndSortGatewayModels(models, payload, {
    query, provider, variant, capability, minContext, maxInputPrice, sort,
  }), [models, payload, query, provider, variant, capability, minContext, maxInputPrice, sort]);
  const paginated = useMemo(() => paginateModels(filtered, page, pageSize), [filtered, page, pageSize]);
  const inspectedModel = filtered.find((model) => modelId(model) === selectedId) ?? paginated.items[0] ?? null;
  const referenceCount = Object.keys(payload?.reference?.models ?? {}).length;

  useEffect(() => { setPage(1); }, [query, provider, variant, capability, minContext, maxInputPrice, sort, pageSize]);

  return (
    <div className="gateway-models-page">
      <header className="gateway-page-header">
        <div><h1>All Gateway Models</h1><p>Live Gateway catalog · OpenRouter reference metadata</p></div>
        <div className="gateway-header-status"><span className={`status-dot ${payload ? "is-live" : ""}`} /><strong>{payload ? `${models.length} models` : "Waiting for data"}</strong><button className="button button-primary" type="button" onClick={loadModels} disabled={loading}>{loading ? "Loading…" : "Refresh"}</button></div>
      </header>

      <div className="catalog-reference-line">
        <span>{referenceCount ? `${referenceCount} OpenRouter reference records · updated ${formatUpdatedAt(payload?.reference?.dataUpdatedAt)}` : "OpenRouter reference metadata pending; Gateway catalog remains usable. Refresh to check the latest background snapshot."}</span>
        <span>No availability probes on this page</span>
      </div>

      {error ? (
        <div className="setup-error" role="alert"><h2>{error.code === "MAXSHOT_API_KEY_MISSING" ? "Maxshot API key required" : "Gateway data unavailable"}</h2><p>{error.message}</p><button className="button" type="button" onClick={loadModels}>Retry</button></div>
      ) : (
        <div className="gateway-workspace catalog-workspace">
          <main className="gateway-main catalog-main">
            <div className="catalog-toolbar">
              <label className="search-control gateway-search"><span className="visually-hidden">Search models</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ID, name, capability…" /></label>
              <label className="catalog-select"><span>Provider</span><select value={provider} onChange={(event) => setProvider(event.target.value)}><option value="all">All</option>{providers.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <label className="catalog-select"><span>Variant</span><select value={variant} onChange={(event) => setVariant(event.target.value)}><option value="all">All</option>{variants.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <label className="catalog-select"><span>Capability</span><select value={capability} onChange={(event) => setCapability(event.target.value)}><option value="all">All</option>{CAPABILITIES.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <label className="catalog-select"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="id">Model ID A–Z</option><option value="price">Input price ↑</option><option value="context">Context ↓</option><option value="score">Score ↓</option><option value="newest">Newest ↓</option></select></label>
            </div>
            <div className="catalog-filter-line">
              <label className="catalog-select"><span>Min context</span><select value={minContext} onChange={(event) => setMinContext(Number(event.target.value))}>{CONTEXT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="catalog-price-filter"><span>Max input $/M</span><input type="number" min="0" step="any" value={maxInputPrice} onChange={(event) => setMaxInputPrice(event.target.value)} placeholder="Any" /></label>
              <label className="catalog-select"><span>Rows</span><select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
              <span className="catalog-result-count">{filtered.length} matching models</span>
              <button className="catalog-clear" type="button" onClick={() => { setQuery(""); setProvider("all"); setVariant("all"); setCapability("all"); setMinContext(0); setMaxInputPrice(""); setSort("id"); }}>Clear filters</button>
            </div>

            {loading && !payload ? <div className="loading-state">Loading live Gateway models…</div> : (
              <div className="gateway-table-scroll catalog-table-scroll">
                <table className="gateway-model-table catalog-table">
                  <thead><tr><th>Model</th><th>Context</th><th>Capabilities</th><th>Input / 1M</th><th>Output / 1M</th><th>Score</th></tr></thead>
                  <tbody>{paginated.items.map((model) => {
                    const id = modelId(model);
                    const reference = readReferenceModel(payload, model);
                    const score = readStrategyScore(payload, model);
                    const capabilities = modelCapabilities(reference);
                    return (
                      <tr key={id} data-selected={id === modelId(inspectedModel)} tabIndex={0} aria-label={`Inspect ${id}`} onClick={() => setSelectedId(id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedId(id); } }}>
                        <td><span className="catalog-model-name">{reference?.name || model.displayName || id}</span><span className="catalog-model-id">{id}</span><span className="catalog-variant" data-variant={modelVariant(model)}>{modelVariant(model)}</span></td>
                        <td className="numeric">{formatTokens(reference?.contextLength)}</td>
                        <td><span className="catalog-capabilities">{capabilities.length ? capabilities.map((value) => <span key={value}>{value}</span>) : <span className="catalog-muted">—</span>}</span></td>
                        <td className="numeric catalog-money">{formatPrice(reference?.pricing?.input)}</td>
                        <td className="numeric catalog-money">{formatPrice(reference?.pricing?.output)}</td>
                        <td className="numeric score-cell">{score === null ? "—" : score.toFixed(1)}</td>
                      </tr>
                    );
                  })}</tbody>
                </table>
                {filtered.length === 0 ? <div className="empty-table">No models match these filters.</div> : null}
              </div>
            )}

            <div className="gateway-pagination catalog-pagination"><span>Showing {filtered.length === 0 ? 0 : (paginated.page - 1) * pageSize + 1}–{Math.min(paginated.page * pageSize, filtered.length)} of {filtered.length}</span><div><button className="button" type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={paginated.page === 1}>Previous</button><span>Page {paginated.page} of {paginated.pageCount}</span><button className="button" type="button" onClick={() => setPage((current) => Math.min(paginated.pageCount, current + 1))} disabled={paginated.page === paginated.pageCount}>Next</button></div></div>
          </main>
          <ModelInspector model={inspectedModel} reference={readReferenceModel(payload, inspectedModel)} score={readStrategyScore(payload, inspectedModel)} />
        </div>
      )}
    </div>
  );
}
