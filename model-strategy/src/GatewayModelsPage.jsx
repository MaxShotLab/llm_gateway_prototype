import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  filterAndSortGatewayModels, formatSourceDate, formatTokenCount, formatUsdPerMillion, modelId, modelProvider, modelsWithReference,
  paginateModels, readGatewayModels, readReferenceModel,
} from "./lib/gateway-models.js";

const PAGE_SIZES = [25, 50, 100];
const CONTEXT_OPTIONS = [[0, "Any context"], [32_000, "32K+"], [128_000, "128K+"], [200_000, "200K+"], [1_000_000, "1M+"]];

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

function DateValue({ value }) {
  if (value === null || value === undefined || value === "") return "—";
  const display = formatSourceDate(value);
  return <span title={`Source value: ${value}`}>{display}{display === String(value) ? "" : " UTC"}</span>;
}

function FieldList({ values }) {
  if (!values?.length) return "—";
  return <span className="catalog-field-list">{values.map((value) => <code key={value}>{value}</code>)}</span>;
}

function ModelInspector({ model, reference }) {
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
        <div><p className="catalog-overline">MODEL DETAILS</p><h2>{reference?.name || model.displayName || model.name || id}</h2><code>{id}</code></div>
        <button className="button" type="button" onClick={copyId} aria-label={`Copy ${id} model ID`}>{copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Copy failed" : "Copy ID"}</button>
      </div>
      {reference?.description ? <p className="gateway-description">{reference.description}</p> : null}

      <section className="catalog-inspector-section">
        <h3>Overview</h3>
        <FactRows items={[
          ["Gateway owner", model.owned_by],
          ["Context window", <TokenValue value={reference?.contextLength} detail />],
          ["Max output", <TokenValue value={reference?.maxOutputTokens} detail />],
          ["Input / 1M tokens", <PriceValue value={reference?.pricing?.input} detail />],
          ["Output / 1M tokens", <PriceValue value={reference?.pricing?.output} detail />],
        ]} />
        <p className="catalog-source-note">Prices are OpenRouter reference rates converted from USD/token for display, not Maxshot Gateway billing.</p>
      </section>

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
          ["Gateway created", <DateValue value={model.created} />],
          ["Expiration", <DateValue value={reference?.expirationDate} />],
          ["Gateway object", model.object || "—"],
          ["Gateway endpoints", <FieldList values={model.supported_endpoint_types} />],
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
  const [inputModality, setInputModality] = useState("all");
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
      setSelectedId((current) => modelsWithReference(models, nextPayload).some((model) => modelId(model) === current) ? current : "");
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
  const matchedModels = useMemo(() => modelsWithReference(models, payload), [models, payload]);
  const providers = useMemo(() => [...new Set(matchedModels.map(modelProvider))].sort(), [matchedModels]);
  const inputModalities = useMemo(() => [...new Set(matchedModels.flatMap((model) => readReferenceModel(payload, model)?.inputModalities ?? []))].sort(), [matchedModels, payload]);
  const filtered = useMemo(() => filterAndSortGatewayModels(matchedModels, payload, {
    query, provider, inputModality, minContext, maxInputPrice, sort,
  }), [matchedModels, payload, query, provider, inputModality, minContext, maxInputPrice, sort]);
  const paginated = useMemo(() => paginateModels(filtered, page, pageSize), [filtered, page, pageSize]);
  const inspectedModel = filtered.find((model) => modelId(model) === selectedId) ?? paginated.items[0] ?? null;
  const referenceCount = Object.keys(payload?.reference?.models ?? {}).length;
  const referenceNotice = payload?.reference?.error
    ? referenceCount ? "OpenRouter update failed · showing cached data" : "OpenRouter request failed"
    : "No availability probes on this page";

  useEffect(() => { setPage(1); }, [query, provider, inputModality, minContext, maxInputPrice, sort, pageSize]);

  return (
    <div className="gateway-models-page">
      <header className="gateway-page-header">
        <div><h1>All Gateway Models</h1><p>Live Gateway catalog · OpenRouter reference metadata</p></div>
        <div className="gateway-header-status"><span className={`status-dot ${payload ? "is-live" : ""}`} /><strong>{payload ? `${matchedModels.length} models` : "Waiting for data"}</strong><button className="button button-primary" type="button" onClick={loadModels} disabled={loading}>{loading ? "Loading…" : "Refresh"}</button></div>
      </header>

      <div className="catalog-reference-line">
        <span>{referenceCount ? `${referenceCount} OpenRouter models (all modalities) · ${matchedModels.length} Gateway matches · ${models.length - matchedModels.length} unmatched hidden · updated ${formatUpdatedAt(payload?.reference?.dataUpdatedAt)}` : "OpenRouter metadata unavailable; models without an exact match are hidden."}</span>
        <span title={payload?.reference?.error || undefined}>{referenceNotice}</span>
      </div>

      {error ? (
        <div className="setup-error" role="alert"><h2>{error.code === "MAXSHOT_API_KEY_MISSING" ? "Maxshot API key required" : "Gateway data unavailable"}</h2><p>{error.message}</p><button className="button" type="button" onClick={loadModels}>Retry</button></div>
      ) : (
        <div className="gateway-workspace catalog-workspace">
          <main className="gateway-main catalog-main">
            <div className="catalog-toolbar">
              <label className="search-control gateway-search"><span className="visually-hidden">Search models</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search source fields…" /></label>
              <label className="catalog-select"><span>Gateway owner</span><select value={provider} onChange={(event) => setProvider(event.target.value)}><option value="all">All</option>{providers.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <label className="catalog-select"><span>Input modality</span><select value={inputModality} onChange={(event) => setInputModality(event.target.value)}><option value="all">All</option>{inputModalities.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <label className="catalog-select"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="id">Model ID A–Z</option><option value="price">Input price ↑</option><option value="context">Context ↓</option><option value="newest">Newest ↓</option></select></label>
            </div>
            <div className="catalog-filter-line">
              <label className="catalog-select"><span>Min context</span><select value={minContext} onChange={(event) => setMinContext(Number(event.target.value))}>{CONTEXT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="catalog-price-filter"><span>Max input $/1M</span><input type="number" min="0" step="any" value={maxInputPrice} onChange={(event) => setMaxInputPrice(event.target.value)} placeholder="Any" /></label>
              <label className="catalog-select"><span>Rows</span><select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
              <span className="catalog-result-count">{filtered.length} matching models</span>
              <button className="catalog-clear" type="button" onClick={() => { setQuery(""); setProvider("all"); setInputModality("all"); setMinContext(0); setMaxInputPrice(""); setSort("id"); }}>Clear filters</button>
            </div>

            {loading && !payload ? <div className="loading-state">Loading live Gateway models…</div> : (
              <div className="gateway-table-scroll catalog-table-scroll">
                <table className="gateway-model-table catalog-table">
                  <thead><tr><th>Model</th><th>Context tokens</th><th>Input modalities</th><th>Output modalities</th><th>Input / 1M tokens</th><th>Output / 1M tokens</th></tr></thead>
                  <tbody>{paginated.items.map((model) => {
                    const id = modelId(model);
                    const reference = readReferenceModel(payload, model);
                    return (
                      <tr key={id} data-selected={id === modelId(inspectedModel)} tabIndex={0} aria-label={`Inspect ${id}`} onClick={() => setSelectedId(id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedId(id); } }}>
                        <td><span className="catalog-model-name">{reference?.name || model.displayName || id}</span><span className="catalog-model-id">{id}</span></td>
                        <td className="numeric"><TokenValue value={reference?.contextLength} /></td>
                        <td>{reference?.inputModalities?.join(", ") || "—"}</td>
                        <td>{reference?.outputModalities?.join(", ") || "—"}</td>
                        <td className="numeric catalog-money"><PriceValue value={reference?.pricing?.input} /></td>
                        <td className="numeric catalog-money"><PriceValue value={reference?.pricing?.output} /></td>
                      </tr>
                    );
                  })}</tbody>
                </table>
                {filtered.length === 0 ? <div className="empty-table">{referenceCount ? "No models match these filters." : "OpenRouter reference metadata is not available yet."}</div> : null}
              </div>
            )}

            <div className="gateway-pagination catalog-pagination"><span>Showing {filtered.length === 0 ? 0 : (paginated.page - 1) * pageSize + 1}–{Math.min(paginated.page * pageSize, filtered.length)} of {filtered.length}</span><div><button className="button" type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={paginated.page === 1}>Previous</button><span>Page {paginated.page} of {paginated.pageCount}</span><button className="button" type="button" onClick={() => setPage((current) => Math.min(paginated.pageCount, current + 1))} disabled={paginated.page === paginated.pageCount}>Next</button></div></div>
          </main>
          <ModelInspector model={inspectedModel} reference={readReferenceModel(payload, inspectedModel)} />
        </div>
      )}
    </div>
  );
}
