import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CATEGORY_ORDER, compareSelectedModels, DEFAULT_STRATEGY, MODEL_COUNT, totalValues, validateStrategy } from "./lib/strategy.js";

const CATEGORY_LABELS = {
  flagship: "Flagship",
  reasoning: "Reasoning",
  balanced: "Balanced",
  economy: "Economy",
  code: "Code",
  free: "Free",
};

const CATEGORY_INDEX = new Map(CATEGORY_ORDER.map((category, index) => [category, index]));

function orderSelectedModels(models) {
  return [...models].sort((left, right) => (
    (CATEGORY_INDEX.get(left.category) ?? CATEGORY_ORDER.length) - (CATEGORY_INDEX.get(right.category) ?? CATEGORY_ORDER.length)
    || left.id.localeCompare(right.id)
  ));
}

const WEIGHT_LABELS = {
  weekly: "Weekly",
  monthly: "Monthly",
  newModel: "New",
  quality: "Quality",
  reliability: "Reliability",
  performance: "Performance",
  value: "Value",
};

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatPrice(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  if (value === 0) return "$0";
  if (value < 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(2)}`;
}

function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds)) return "—";
  return milliseconds < 10_000 ? `${(milliseconds / 1000).toFixed(1)}s` : `${Math.round(milliseconds / 1000)}s`;
}

function formatCountdown(nextUpdateAt, now) {
  if (!nextUpdateAt) return "—";
  const remainingSeconds = Math.max(0, Math.ceil((Date.parse(nextUpdateAt) - now) / 1000));
  const minutes = Math.floor(remainingSeconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;
}

function rank(value) {
  return value ? `#${value}` : "—";
}

function score(value) {
  return Number.isFinite(value) ? value.toFixed(1) : "—";
}

function Stepper({ label, value, onChange, minimum = 0, maximum = 100 }) {
  return (
    <div className="stepper-row">
      <span>{label}</span>
      <div className="stepper" aria-label={`${label} value`}>
        <button type="button" onClick={() => onChange(Math.max(minimum, value - 1))} disabled={value <= minimum} aria-label={`Decrease ${label}`}>−</button>
        <input
          type="number"
          min={minimum}
          max={maximum}
          value={value}
          onChange={(event) => onChange(Math.max(minimum, Math.min(maximum, Number(event.target.value) || 0)))}
          aria-label={label}
        />
        <button type="button" onClick={() => onChange(Math.min(maximum, value + 1))} disabled={value >= maximum} aria-label={`Increase ${label}`}>+</button>
      </div>
    </div>
  );
}

function DataFreshness({ resultDataUpdatedAt }) {
  const [status, setStatus] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let active = true;
    const loadStatus = async () => {
      try {
        const response = await fetch("/api/status");
        if (response.ok && active) setStatus(await response.json());
      } catch {
        // The strategy request surfaces server errors; keep this indicator quiet.
      }
    };
    void loadStatus();
    const statusTimer = window.setInterval(loadStatus, 2_000);
    const clockTimer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => {
      active = false;
      window.clearInterval(statusTimer);
      window.clearInterval(clockTimer);
    };
  }, []);

  const elapsed = status?.updating && status.updateStartedAt ? now - Date.parse(status.updateStartedAt) : null;
  const changeState = status?.dataChangedSincePrevious;
  const showingLatestSnapshot = Boolean(resultDataUpdatedAt && status?.lastUpdatedAt && resultDataUpdatedAt === status.lastUpdatedAt);
  const changeLabel = showingLatestSnapshot
    ? `Showing latest Top ${MODEL_COUNT}`
    : changeState === false
    ? "Basic data unchanged · Refresh can be skipped"
    : status?.selectionChangedSincePrevious === false
      ? `Basic data changed · Top ${MODEL_COUNT} unchanged`
      : status?.selectionChangedSincePrevious === true
        ? "Selection or price changed · Refresh recommended"
        : "First snapshot · comparison pending";
  return (
    <div className="data-freshness" aria-live="polite">
      <span>{status?.updating ? `Updating · ${formatDuration(elapsed)}` : `Next data update · ${formatCountdown(status?.nextUpdateAt, now)}`}</span>
      <small>Data {formatDate(status?.lastUpdatedAt)} · last took {formatDuration(status?.lastDurationMs)}</small>
      <small className={showingLatestSnapshot || changeState === false || status?.selectionChangedSincePrevious === false ? "snapshot-unchanged" : status?.selectionChangedSincePrevious === true ? "snapshot-changed" : ""}>{changeLabel}</small>
      {status?.lastError ? <small className="is-invalid">Last update failed · using previous data</small> : null}
    </div>
  );
}

function AppHeader({ data, loading, onRefresh }) {
  return (
    <header className="app-header">
      <div>
        <h1>Model Strategy</h1>
        <p>Live OpenRouter selection</p>
      </div>
      <div className="source-strip" aria-label="Data source status">
        <span className={`status-dot ${data ? "is-live" : ""}`} />
        <strong>{data ? "Live data" : "Waiting for data"}</strong>
        <span>OpenRouter API</span>
        <span>{data ? `${data.source.modelCount} models scanned` : "— models scanned"}</span>
      </div>
      <div className="header-actions">
        <DataFreshness resultDataUpdatedAt={data?.source.dataUpdatedAt} />
        <button className="button button-primary" type="button" onClick={onRefresh} disabled={loading} title="Recalculate using the latest completed data snapshot">
          <RefreshIcon />
          {loading ? "Recalculating…" : "Refresh"}
        </button>
      </div>
    </header>
  );
}

function StrategyPanel({ config, setConfig, errors, onRun, onReset, loading }) {
  const updateNested = (section, key, value) => {
    setConfig((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value },
    }));
  };

  return (
    <aside className="strategy-panel">
      <div className="panel-title">
        <h2>Strategy</h2>
        <span>Live recompute</span>
      </div>

      <section className="control-section">
        <div className="section-heading">
          <h3>Category seats</h3>
          <span>must total {MODEL_COUNT}</span>
        </div>
        {CATEGORY_ORDER.map((category) => (
          <Stepper
            key={category}
            label={CATEGORY_LABELS[category]}
            value={config.quotas[category]}
            maximum={MODEL_COUNT}
            onChange={(value) => updateNested("quotas", category, value)}
          />
        ))}
        <div className="control-total">
          <span>Total seats</span>
          <strong className={totalValues(config.quotas) === MODEL_COUNT ? "is-valid" : "is-invalid"}>
            {totalValues(config.quotas)} / {MODEL_COUNT}
          </strong>
        </div>
      </section>

      <section className="control-section">
        <div className="section-heading">
          <h3>Scoring weights</h3>
          <span>must total 100</span>
        </div>
        {Object.entries(config.weights).map(([key, value]) => (
          <Stepper
            key={key}
            label={WEIGHT_LABELS[key]}
            value={value}
            onChange={(next) => updateNested("weights", key, next)}
          />
        ))}
        <div className="control-total">
          <span>Total weight</span>
          <strong className={totalValues(config.weights) === 100 ? "is-valid" : "is-invalid"}>
            {totalValues(config.weights)} / 100
          </strong>
        </div>
      </section>

      <section className="control-section hard-filters">
        <div className="section-heading">
          <h3>Hard filters</h3>
          <span>all required</span>
        </div>
        {[
          ["Priced", "Input and output price known"],
          ["Available", "Healthy OpenRouter endpoint"],
          ["Text output", "Must support text output"],
        ].map(([label, help]) => (
          <div className="locked-filter" key={label}>
            <span className="switch is-on" aria-hidden="true"><span /></span>
            <span><strong>{label}</strong><small>{help}</small></span>
          </div>
        ))}
        <label className="select-control">
          <span>Minimum context</span>
          <select
            value={config.filters.minimumContext}
            onChange={(event) => updateNested("filters", "minimumContext", Number(event.target.value))}
          >
            <option value={8_000}>8K</option>
            <option value={16_000}>16K</option>
            <option value={32_000}>32K</option>
            <option value={64_000}>64K</option>
            <option value={128_000}>128K</option>
          </select>
        </label>
      </section>

      {errors.length > 0 ? <p className="validation-error">{errors[0]}</p> : null}
      <button className="button button-run" type="button" onClick={onRun} disabled={errors.length > 0 || loading}>
        {loading ? "Running strategy…" : "Run strategy"}
      </button>
      <button className="button button-reset" type="button" onClick={onReset} disabled={loading}>
        <RefreshIcon />Reset to defaults
      </button>
    </aside>
  );
}

function SummaryStrip({ summary }) {
  const stats = [
    [summary?.selected ?? 0, "selected"],
    [summary?.categories ?? 0, "categories"],
    [summary?.providers ?? 0, "providers"],
    [`${summary?.passedHardGates ?? 0} / ${summary?.totalModels ?? 0}`, "passed hard gates"],
  ];
  return (
    <div className="summary-strip">
      {stats.map(([value, label]) => (
        <div className="summary-stat" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function ModelTable({ models, mode, selectedId, onSelect, modelChanges }) {
  if (models.length === 0) {
    return <div className="empty-table">No models match the current search.</div>;
  }
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Category</th>
            <th>Price in/out</th>
            <th>Weekly</th>
            <th>Monthly</th>
            <th>Age</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => {
            const change = mode === "selected" ? modelChanges[model.id] : null;
            return (
              <tr
                key={model.id}
                data-selected={selectedId === model.id}
                data-change={change?.label.toLowerCase()}
                tabIndex={0}
                onClick={() => onSelect(model)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onSelect(model);
                }}
              >
              <td><span className="model-id">{model.id}</span></td>
              <td>{mode === "selected" ? <span className="category-label">{CATEGORY_LABELS[model.category]}</span> : "—"}</td>
              <td className="numeric price-cell">{formatPrice(model.inputPrice)} <span>/</span> {formatPrice(model.outputPrice)}</td>
              <td className="numeric">{rank(model.weeklyRank)}</td>
              <td className="numeric">{rank(model.monthlyRank)}</td>
              <td className="numeric">{model.ageDays}d</td>
              <td className="numeric score-cell">{score(model.score)}</td>
              <td>
                {change ? (
                  <span className="change-label" title={change.detail}><span className="change-dot" />{change.label}</span>
                ) : mode === "selected" ? (
                  <span className="status-label"><span className="status-dot is-live" />Selected</span>
                ) : (
                  <span className="rejected-reason" title={model.rejectionReason}>{model.rejectionReason}</span>
                )}
              </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ModelDetail({ model }) {
  if (!model) {
    return <aside className="detail-panel detail-empty">Select a model to inspect its score and checks.</aside>;
  }
  const reasons = [
    model.weeklyRank && model.weeklyRank <= 20 ? `Weekly usage rank ${rank(model.weeklyRank)}` : null,
    model.monthlyRank && model.monthlyRank <= 20 ? `Monthly usage rank ${rank(model.monthlyRank)}` : null,
    model.ageDays <= 30 ? `Released ${model.ageDays} days ago` : null,
    model.category ? `Fills a ${CATEGORY_LABELS[model.category]} seat` : model.rejectionReason,
  ].filter(Boolean);

  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <h2>{model.id}</h2>
        <p>{model.category ? CATEGORY_LABELS[model.category] : "Rejected candidate"}</p>
      </div>

      <section className="detail-section score-breakdown">
        <div className="detail-section-heading">
          <h3>Score breakdown</h3>
          <strong>{score(model.score)}</strong>
        </div>
        {Object.entries(model.components).map(([key, value]) => (
          <div className="score-row" key={key}>
            <span>{WEIGHT_LABELS[key]}</span>
            <div><span style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} /></div>
            <strong>{(value * 100).toFixed(0)}%</strong>
          </div>
        ))}
      </section>

      <section className="detail-section">
        <h3>Why {model.category ? "selected" : "rejected"}</h3>
        <ul className="reason-list">
          {reasons.map((reason) => <li key={reason}><CheckIcon />{reason}</li>)}
        </ul>
      </section>

      <section className="detail-section facts">
        <h3>Availability checks</h3>
        <div><span>OpenRouter endpoint</span><strong className={model.health?.available ? "is-valid" : "is-invalid"}>{model.health?.available ? "OK" : "Not verified"}</strong></div>
        <div><span>Healthy providers</span><strong>{model.health?.healthyEndpointCount ?? "—"}</strong></div>
        <div><span>Best 1d uptime</span><strong>{model.health?.verified ? `${model.health.uptime.toFixed(2)}%` : "—"}</strong></div>
        {model.eligibility?.free ? (
          <>
            <div><span>Live inference</span><strong className={model.inferenceHealth?.available ? "is-valid" : "is-invalid"} title={model.inferenceHealth?.reason || undefined}>{model.inferenceHealth?.available ? "Usable" : model.inferenceHealth?.verified ? "Failed" : "Not checked"}</strong></div>
            <div><span>Probe attempts</span><strong>{model.inferenceHealth ? `${model.inferenceHealth.successes}/${model.inferenceHealth.attempts}` : "—"}</strong></div>
            <div><span>Probe latency</span><strong>{Number.isFinite(model.inferenceHealth?.latencyMs) ? formatDuration(model.inferenceHealth.latencyMs) : "—"}</strong></div>
          </>
        ) : null}
        <div><span>Context</span><strong>{Math.round(model.contextLength / 1000)}K</strong></div>
      </section>

      <section className="detail-section facts">
        <h3>Pricing <small>per 1M tokens</small></h3>
        <div><span>Input</span><strong>{formatPrice(model.inputPrice)}</strong></div>
        <div><span>Output</span><strong>{formatPrice(model.outputPrice)}</strong></div>
      </section>

      <section className="detail-section facts">
        <h3>Source ranks</h3>
        <div><span>Weekly popularity</span><strong>{rank(model.weeklyRank)}</strong></div>
        <div><span>Monthly popularity</span><strong>{rank(model.monthlyRank)}</strong></div>
        <div><span>Newest</span><strong>{rank(model.newestRank)}</strong></div>
        <div><span>Intelligence</span><strong>{rank(model.intelligenceRank)}</strong></div>
        <div><span>Throughput</span><strong>{rank(model.throughputRank)}</strong></div>
        <div><span>Latency</span><strong>{rank(model.latencyRank)}</strong></div>
      </section>
    </aside>
  );
}

function SetupError({ error, onRetry }) {
  const missingKey = error?.code === "OPENROUTER_API_KEY_MISSING";
  return (
    <div className="setup-error" role="alert">
      <h2>{missingKey ? "OpenRouter API key required" : "Live data unavailable"}</h2>
      <p>{error?.message || "The live OpenRouter strategy could not be loaded."}</p>
      {missingKey ? (
        <ol>
          <li>Copy <code>.env.example</code> to <code>.env.local</code>.</li>
          <li>Set <code>OPENROUTER_API_KEY</code> in <code>.env.local</code>.</li>
          <li>Restart this prototype and refresh.</li>
        </ol>
      ) : null}
      <button className="button" type="button" onClick={onRetry}>Retry live data</button>
    </div>
  );
}

function RefreshIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" /></svg>;
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 12 3 3 7-7" /><circle cx="12" cy="12" r="9" /></svg>;
}

export default function App() {
  const [config, setConfig] = useState(DEFAULT_STRATEGY);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("selected");
  const [query, setQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelChanges, setModelChanges] = useState({});
  const initialLoadStarted = useRef(false);
  const errors = validateStrategy(config);

  const runStrategy = useCallback(async () => {
    const currentErrors = validateStrategy(config);
    if (currentErrors.length > 0) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/strategy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const payload = await response.json();
      if (!response.ok) throw payload.error || new Error("Live strategy request failed.");
      setModelChanges(data ? compareSelectedModels(data.selected, payload.selected) : {});
      setData(payload);
      setSelectedModel((current) => payload.selected.find((model) => model.id === current?.id) ?? orderSelectedModels(payload.selected)[0] ?? null);
    } catch (nextError) {
      setError(nextError);
    } finally {
      setLoading(false);
    }
  }, [config, data]);

  useEffect(() => {
    if (initialLoadStarted.current) return;
    initialLoadStarted.current = true;
    void runStrategy();
  }, []); // Initial live load only; changes are applied explicitly.

  const visibleModels = useMemo(() => {
    const source = mode === "selected" ? data?.selected ?? [] : data?.rejected ?? [];
    const normalized = query.trim().toLowerCase();
    const filtered = normalized
      ? source.filter((model) => `${model.id} ${model.name} ${model.category ?? ""} ${model.rejectionReason ?? ""}`.toLowerCase().includes(normalized))
      : source;
    if (mode === "rejected") return filtered;
    return orderSelectedModels(filtered);
  }, [data, mode, query]);

  const exportJson = () => {
    if (!data?.exportJson) return;
    const blob = new Blob([`${JSON.stringify(data.exportJson, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "chat-models.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell">
      <AppHeader data={data} loading={loading} onRefresh={runStrategy} />
      <div className="workspace">
        <StrategyPanel
          config={config}
          setConfig={setConfig}
          errors={errors}
          onRun={runStrategy}
          onReset={() => setConfig(DEFAULT_STRATEGY)}
          loading={loading}
        />
        <main className="main-panel">
          <SummaryStrip summary={data?.summary} />
          {error && !data ? (
            <SetupError error={error} onRetry={runStrategy} />
          ) : (
            <>
              {error ? <div className="inline-error" role="alert">{error.message}</div> : null}
              <div className="table-toolbar">
                <div className="tabs" role="tablist">
                  <button type="button" role="tab" aria-selected={mode === "selected"} onClick={() => setMode("selected")}>Selected <strong>{data?.selected.length ?? 0}</strong></button>
                  <button type="button" role="tab" aria-selected={mode === "rejected"} onClick={() => setMode("rejected")}>Rejected <strong>{data?.rejected.length ?? 0}</strong></button>
                </div>
                <div className="toolbar-actions">
                  <label className="search-control">
                    <span className="visually-hidden">Search models</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search models" />
                  </label>
                  <button className="button" type="button" onClick={exportJson} disabled={!data}><DownloadIcon />Export JSON</button>
                </div>
              </div>
              {loading && !data ? <div className="loading-state">Loading live OpenRouter models and rankings…</div> : (
                <ModelTable models={visibleModels} mode={mode} selectedId={selectedModel?.id} onSelect={setSelectedModel} modelChanges={modelChanges} />
              )}
              <div className="table-footer">
                <span>Showing {visibleModels.length} of {mode === "selected" ? data?.selected.length ?? 0 : data?.rejected.length ?? 0} {mode}</span>
                <span>Monthly window: {data?.source.rankingsWindow.start ?? "—"} → {data?.source.rankingsWindow.end ?? "—"}</span>
              </div>
            </>
          )}
        </main>
        <ModelDetail model={selectedModel} />
      </div>
    </div>
  );
}

function DownloadIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></svg>;
}
