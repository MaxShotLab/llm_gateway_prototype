import { useCallback, useEffect, useMemo, useState } from "react";

import { modelId, modelProvider, paginateModels, readGatewayModels, searchableModelText } from "./lib/gateway-models.js";

const PAGE_SIZES = [25, 50, 100];

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function compactList(value) {
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (value && typeof value === "object") {
    return Object.entries(value).filter(([, enabled]) => Boolean(enabled)).map(([key]) => key).join(", ") || "—";
  }
  return displayValue(value);
}

function formatCreated(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(new Date(numeric * 1000));
}

function GatewayModelDetail({ model }) {
  if (!model) return <aside className="gateway-detail detail-empty">Select a model to inspect every returned parameter.</aside>;
  return (
    <aside className="gateway-detail">
      <div className="detail-header">
        <h2>{model.displayName ?? model.name ?? modelId(model)}</h2>
        <p>{modelId(model)}</p>
      </div>
      {model.description ? <p className="gateway-description">{model.description}</p> : null}
      <section className="detail-section facts gateway-parameter-list">
        <h3>All returned parameters</h3>
        {Object.entries(model).map(([key, value]) => (
          <div key={key}>
            <span>{key}</span>
            <strong title={displayValue(value)}>{displayValue(value)}</strong>
          </div>
        ))}
      </section>
    </aside>
  );
}

export default function GatewayModelsPage() {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedModel, setSelectedModel] = useState(null);

  const loadModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gateway-models");
      const nextPayload = await response.json();
      if (!response.ok) throw nextPayload.error || new Error("Gateway model request failed.");
      const models = readGatewayModels(nextPayload);
      setPayload(nextPayload);
      setSelectedModel((current) => models.find((model) => modelId(model) === modelId(current)) ?? models[0] ?? null);
    } catch (nextError) {
      setError(nextError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadModels(); }, [loadModels]);

  const models = useMemo(() => readGatewayModels(payload), [payload]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return models;
    return models.filter((model) => searchableModelText(model).includes(normalized));
  }, [models, query]);
  const paginated = useMemo(() => paginateModels(filtered, page, pageSize), [filtered, page, pageSize]);

  useEffect(() => { setPage(1); }, [query, pageSize]);

  return (
    <div className="gateway-models-page">
      <header className="gateway-page-header">
        <div>
          <h1>All Gateway Models</h1>
          <p>Live catalog from api.maxshot.ai/v1/models</p>
        </div>
        <div className="gateway-header-status">
          <span className={`status-dot ${payload ? "is-live" : ""}`} />
          <strong>{payload ? `${models.length} models` : "Waiting for data"}</strong>
          <button className="button button-primary" type="button" onClick={loadModels} disabled={loading}>
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </header>

      <div className="gateway-workspace">
        <main className="gateway-main">
          {error ? (
            <div className="setup-error" role="alert">
              <h2>{error.code === "MAXSHOT_API_KEY_MISSING" ? "Maxshot API key required" : "Gateway data unavailable"}</h2>
              <p>{error.message}</p>
              <button className="button" type="button" onClick={loadModels}>Retry</button>
            </div>
          ) : (
            <>
              <div className="gateway-toolbar">
                <label className="search-control gateway-search">
                  <span className="visually-hidden">Search model IDs</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search model IDs…" />
                </label>
                <label className="page-size-control">
                  <span>Rows</span>
                  <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
                    {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                </label>
              </div>

              {loading && !payload ? <div className="loading-state">Loading live Gateway models…</div> : (
                <div className="gateway-table-scroll">
                  <table className="gateway-model-table">
                    <thead><tr><th>Model ID</th><th>Object</th><th>Created</th><th>Owned by</th><th>Supported endpoints</th></tr></thead>
                    <tbody>
                      {paginated.items.map((model) => (
                        <tr key={modelId(model)} data-selected={modelId(selectedModel) === modelId(model)} tabIndex={0} onClick={() => setSelectedModel(model)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedModel(model); }}>
                          <td><span className="model-id">{modelId(model)}</span></td>
                          <td>{displayValue(model.object)}</td>
                          <td className="numeric">{formatCreated(model.created)}</td>
                          <td>{modelProvider(model)}</td>
                          <td title={compactList(model.supported_endpoint_types)}>{compactList(model.supported_endpoint_types)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 ? <div className="empty-table">No models match the current search.</div> : null}
                </div>
              )}

              <div className="gateway-pagination">
                <span>Showing {filtered.length === 0 ? 0 : (paginated.page - 1) * pageSize + 1}–{Math.min(paginated.page * pageSize, filtered.length)} of {filtered.length}</span>
                <div>
                  <button className="button" type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={paginated.page === 1}>Previous</button>
                  <span>Page {paginated.page} of {paginated.pageCount}</span>
                  <button className="button" type="button" onClick={() => setPage((current) => Math.min(paginated.pageCount, current + 1))} disabled={paginated.page === paginated.pageCount}>Next</button>
                </div>
              </div>
            </>
          )}
        </main>
        <GatewayModelDetail model={selectedModel} />
      </div>
    </div>
  );
}
