import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { displayPrice, priceUnit, publishedPrices, sortVeniceModels } from "./lib/venice-models.js";

const PAGE_SIZE = 25;
const usd = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 6 }).format(value);
const date = (value) => value ? new Intl.DateTimeFormat("en-US", { timeZone: "UTC", year: "numeric", month: "short", day: "numeric" }).format(new Date(value * 1000)) : "—";

function VideoQuote({ model }) {
  const constraints = model.model_spec?.constraints ?? {};
  const [duration, setDuration] = useState(constraints.durations?.[0] ?? "");
  const [resolution, setResolution] = useState(constraints.resolutions?.[0] ?? "");
  const [aspectRatio, setAspectRatio] = useState(constraints.aspect_ratios?.[0] ?? "");
  const [audio, setAudio] = useState(Boolean(constraints.audio));
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getQuote() {
    setLoading(true);
    setError("");
    setQuote(null);
    try {
      const response = await fetch("/api/venice-video-quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ model: model.id, duration, ...(resolution ? { resolution } : {}), ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}), ...(constraints.audio_configurable ? { audio } : {}) }),
      });
      const data = await response.json();
      if (!response.ok || !Number.isFinite(data.quote)) throw new Error(data.error || "Quote unavailable for this configuration.");
      setQuote(data.quote);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  }

  return <section className="venice-quote">
    <h3>Video price quote</h3>
    <p>Venice prices video per request configuration, not in the model list.</p>
    <div className="venice-quote-fields">
      <label>Duration<select value={duration} onChange={(event) => { setDuration(event.target.value); setQuote(null); }}>{(constraints.durations ?? []).map((value) => <option key={value}>{value}</option>)}</select></label>
      {constraints.resolutions?.length ? <label>Resolution<select value={resolution} onChange={(event) => { setResolution(event.target.value); setQuote(null); }}>{constraints.resolutions.map((value) => <option key={value}>{value}</option>)}</select></label> : null}
      {constraints.aspect_ratios?.length ? <label>Aspect ratio<select value={aspectRatio} onChange={(event) => { setAspectRatio(event.target.value); setQuote(null); }}>{constraints.aspect_ratios.map((value) => <option key={value}>{value}</option>)}</select></label> : null}
      {constraints.audio_configurable ? <label className="venice-audio-option"><input type="checkbox" checked={audio} onChange={(event) => { setAudio(event.target.checked); setQuote(null); }} />Audio</label> : null}
    </div>
    <button className="button" type="button" disabled={!duration || loading} onClick={getQuote}>{loading ? "Quoting…" : "Get quote"}</button>
    {quote !== null ? <strong className="venice-quote-result">{usd(quote)} / generation</strong> : null}
    {error ? <p className="is-invalid" role="alert">{error}</p> : null}
  </section>;
}

function ModelDetails({ model }) {
  if (!model) return <aside className="gateway-detail venice-detail">Select a model.</aside>;
  const spec = model.model_spec ?? {};
  const prices = publishedPrices(model);
  return <aside className="gateway-detail venice-detail" aria-label="Venice model details">
    <p className="catalog-overline">VENICE MODEL</p>
    <h2>{spec.name || model.id}</h2>
    <code>{model.id}</code>
    <p>{spec.description || "No description reported."}</p>
    <dl className="catalog-facts">
      <div><dt>Type</dt><dd>{model.type}</dd></div>
      <div><dt>Added</dt><dd>{date(model.created)}</dd></div>
      <div><dt>Privacy</dt><dd>{spec.privacy || "—"}</dd></div>
      <div><dt>Context</dt><dd>{spec.availableContextTokens?.toLocaleString("en-US") || "—"}</dd></div>
    </dl>
    {model.type === "video" ? <VideoQuote key={model.id} model={model} /> : <section className="venice-price-detail">
      <h3>Published USD prices</h3>
      {prices.length ? prices.map(({ label, usd: amount }) => <div key={label}><span>{label}</span><strong>{usd(amount)}</strong></div>) : <p>No price reported.</p>}
      <small>Price units follow each Venice pricing field. Text/embedding: per 1M tokens; TTS: per 1M characters.</small>
    </section>}
  </aside>;
}

export default function VeniceModelsPage() {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const started = useRef(false);

  const load = useCallback(async (refresh = false) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/venice-models${refresh ? "?refresh=1" : ""}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Venice catalog unavailable.");
      setPayload(result);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void load();
  }, [load]);

  const models = payload?.data ?? [];
  const types = useMemo(() => [...new Set(models.map((model) => model.type))].sort(), [models]);
  const sorted = useMemo(() => sortVeniceModels(models, type, query, sort), [models, type, query, sort]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = sorted.find((model) => model.id === selectedId) ?? visible[0] ?? null;

  useEffect(() => { setPage(1); }, [type, query, sort]);

  function selectType(nextType) {
    setType(nextType);
    if ((nextType === "all" || nextType === "video") && sort.startsWith("price")) setSort("newest");
  }

  return <div className="gateway-models-page venice-page">
    <header className="gateway-page-header">
      <div><h1>Venice Models</h1><p>Live Venice catalog · sortable prices and catalog dates</p></div>
      <div className="gateway-header-status"><span className={`status-dot ${models.length ? "is-live" : ""}`} /><strong>{models.length} models</strong><button className="button button-primary" type="button" disabled={loading} onClick={() => load(true)}>{loading ? "Loading…" : "Refresh"}</button></div>
    </header>
    <div className="catalog-reference-line"><span>{payload?.error ? `Update failed · showing previous data: ${payload.error}` : payload?.updatedAt ? `Updated ${new Date(payload.updatedAt).toLocaleString()}` : "Waiting for Venice data"}</span><span>Price sorting is within one model type; video requires a quote.</span></div>
    {error ? <div className="setup-error" role="alert">{error}<button className="button" type="button" onClick={() => load(true)}>Retry</button></div> : null}
    <div className="gateway-workspace catalog-workspace">
      <main className="gateway-main catalog-main">
        <div className="venice-toolbar">
          <label className="search-control gateway-search"><span className="visually-hidden">Search Venice models</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Venice models…" /></label>
          <label className="catalog-select"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option>{type !== "all" && type !== "video" ? <><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></> : null}</select></label>
        </div>
        <div className="catalog-output-filter" aria-label="Filter Venice models by type">{["all", ...types].map((value) => <button key={value} type="button" aria-pressed={type === value} onClick={() => selectType(value)}>{value === "all" ? "All" : value} <span>{value === "all" ? models.length : models.filter((model) => model.type === value).length}</span></button>)}</div>
        {type === "music" ? <p className="venice-note">Music models use different billing units. Numeric price sorting is not a like-for-like cost comparison.</p> : null}
        {loading && !payload ? <div className="loading-state">Loading Venice models…</div> : <div className="gateway-table-scroll catalog-table-scroll">
          <table className="gateway-model-table venice-table"><thead><tr><th>#</th><th>Model</th><th>Type</th><th>Published price</th><th>Added</th></tr></thead>
            <tbody>{visible.map((model, index) => {
              const amount = displayPrice(model);
              return <tr key={model.id} data-selected={selected?.id === model.id} tabIndex={0} onClick={() => setSelectedId(model.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedId(model.id); } }}>
                <td>{(page - 1) * PAGE_SIZE + index + 1}</td><td><strong>{model.model_spec?.name || model.id}</strong><code>{model.id}</code></td><td>{model.type}</td><td>{amount === null ? (model.type === "video" ? "Quote required" : "Not reported") : <>{usd(amount)} <small>{priceUnit(model)}</small></>}</td><td>{date(model.created)}</td>
              </tr>;
            })}</tbody>
          </table>
          {!sorted.length && payload ? <div className="empty-table">No Venice models match.</div> : null}
        </div>}
        <div className="gateway-pagination catalog-pagination"><span>Showing {sorted.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}</span><div><button className="button" type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {pageCount}</span><button className="button" type="button" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</button></div></div>
      </main>
      <ModelDetails model={selected} />
    </div>
  </div>;
}
