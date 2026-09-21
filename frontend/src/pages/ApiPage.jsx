import { useMemo, useState } from "react";
import {
  ArrowRight,
  CaretDown,
  Check,
  Copy,
  Key,
  Plus,
  ShieldCheck,
  Trash,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  createMockApiKey,
  starterApiKeys,
  starterRequestLogs,
} from "../data/apiData";

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);
const formatDollarCents = (value) => `$${(value / 100).toFixed(2)}`;
const formatDollarMicros = (value) => `$${(value / 1_000_000).toFixed(6)}`;

export function ApiPage() {
  const [keys, setKeys] = useState(starterApiKeys);
  const [selectedKeyId, setSelectedKeyId] = useState(starterApiKeys[0].id);
  const [createOpen, setCreateOpen] = useState(false);
  const [createdSecret, setCreatedSecret] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [copied, setCopied] = useState("");
  const [logKey, setLogKey] = useState("all");
  const [logStatus, setLogStatus] = useState("all");

  const selectedKey =
    keys.find((item) => item.id === selectedKeyId) || keys[0] || null;

  const filteredLogs = useMemo(
    () =>
      starterRequestLogs.filter(
        (item) =>
          (logKey === "all" || item.keyId === logKey) &&
          (logStatus === "all" || item.status === logStatus),
      ),
    [logKey, logStatus],
  );

  const copyText = (value, id) => {
    navigator.clipboard?.writeText(value);
    setCopied(id);
    window.setTimeout(() => setCopied(""), 1600);
  };

  const createKey = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name").trim();
    const dailyLimitCents = Math.round((Number(form.get("dailyLimit")) || 0) * 100);
    const monthlyLimitCents = Math.round((Number(form.get("monthlyLimit")) || 0) * 100);
    const expires = form.get("expires") || "Never";
    const created = createMockApiKey(name, dailyLimitCents, monthlyLimitCents, expires, keys.length + 1);

    setKeys((current) => [...current, created.key]);
    setSelectedKeyId(created.key.id);
    setCreateOpen(false);
    setCreatedSecret(created);
  };

  const updateLimit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const dailyLimitCents = Math.round((Number(form.get("dailyLimit")) || 0) * 100);
    const monthlyLimitCents = Math.round((Number(form.get("monthlyLimit")) || 0) * 100);
    setKeys((current) =>
      current.map((item) =>
        item.id === selectedKey.id ? { ...item, dailyLimitCents, monthlyLimitCents } : item,
      ),
    );
  };

  const revokeKey = (id) => {
    setKeys((current) => current.filter((item) => item.id !== id));
    if (selectedKeyId === id) {
      setSelectedKeyId(keys.find((item) => item.id !== id)?.id || null);
    }
  };

  return (
    <main className="content-page api-page">
      <div className="page-heading">
        <div>
          <h1>API</h1>
          <p>OpenAI-compatible keys, limits, and request usage.</p>
        </div>
        <button className="primary-button compact" onClick={() => setCreateOpen(true)}>
          <Plus size={17} /> Create API key
        </button>
      </div>

      <section className="api-intro">
        <div>
          <span className="api-chip">OpenAI compatible</span>
          <h2>One endpoint. Key-based access.</h2>
          <a className="api-doc-link" href="https://docs.maxshot.ai/" target="_blank" rel="noreferrer">
            Documentation <ArrowRight size={15} />
          </a>
        </div>
        <div className="code-block">
          <div className="code-top">
            <span>Base URL</span>
            <button onClick={() => copyText("https://api.maxshot.ai/llm/v1", "base-url")}>
              {copied === "base-url" ? <Check size={15} /> : <Copy size={15} />}
              {copied === "base-url" ? "Copied" : "Copy"}
            </button>
          </div>
          <code>https://api.maxshot.ai/llm/v1</code>
          <small>Authorization: Bearer YOUR_API_KEY</small>
        </div>
      </section>

      <section className="panel api-keys-panel">
        <div className="panel-heading">
          <div>
            <h2>API keys</h2>
          </div>
          <span className="panel-count">{keys.length} active</span>
        </div>

        <div className="key-list">
          {keys.map((item) => {
            const limitPercent = item.monthlyLimitCents
              ? Math.min((item.spentCents / item.monthlyLimitCents) * 100, 100)
              : 0;

            return (
              <article
                className={`key-row gateway-key-row ${selectedKeyId === item.id ? "selected" : ""}`}
                key={item.id}
                onClick={() => setSelectedKeyId(item.id)}
              >
                <div className="key-main">
                  <span className="key-icon"><Key size={19} /></span>
                  <div>
                    <strong>{item.name}</strong>
                    <code>{item.prefix}••••••••</code>
                  </div>
                </div>
                <div className="key-limit">
                  <span>
                    {formatDollarCents(item.spentCents)} of {item.monthlyLimitCents ? formatDollarCents(item.monthlyLimitCents) : "no limit"}
                  </span>
                  <i><b style={{ width: `${limitPercent}%` }} /></i>
                </div>
                <div className="key-meta">
                  <span>Created {item.created}</span>
                  <span>Last used {item.lastUsed}</span>
                  <span>Expires {item.expires}</span>
                </div>
                <div className="key-actions">
                  <button
                    aria-label={`Revoke ${item.name}`}
                    title="Revoke key"
                    onClick={(event) => {
                      event.stopPropagation();
                      setRevokeTarget(item);
                    }}
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </article>
            );
          })}
          {!keys.length && <div className="api-empty">No active API keys.</div>}
        </div>
      </section>

      {selectedKey && (
        <>
          <section className="api-key-overview">
            <div className="api-summary-heading">
              <div>
                <span>Selected key</span>
                <h2>{selectedKey.name}</h2>
              </div>
              <span className="status-pill success"><i /> Active</span>
            </div>
            <div className="api-metric-grid">
              <ApiMetric label="Requests" value={formatNumber(selectedKey.requests)} />
              <ApiMetric label="Input tokens" value={formatNumber(selectedKey.inputTokens)} />
              <ApiMetric label="Output tokens" value={formatNumber(selectedKey.outputTokens)} />
              <ApiMetric
                label="Daily remaining"
                value={selectedKey.dailyLimitCents ? formatDollarCents(Math.max(selectedKey.dailyLimitCents - selectedKey.dailySpentCents, 0)) : "Unlimited"}
              />
              <ApiMetric
                label="Monthly remaining"
                value={selectedKey.monthlyLimitCents ? formatDollarCents(Math.max(selectedKey.monthlyLimitCents - selectedKey.spentCents, 0)) : "Unlimited"}
              />
            </div>
            <form className="spending-limit-form" onSubmit={updateLimit}>
              <label>
                Daily spending limit
                <span className="currency-input">
                  <i>$</i>
                  <input
                    name="dailyLimit"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={selectedKey.dailyLimitCents / 100}
                    key={`${selectedKey.id}-daily`}
                    aria-label="Daily spending limit"
                  />
                </span>
              </label>
              <label>
                Monthly spending limit
                <span className="currency-input">
                  <i>$</i>
                  <input
                    name="monthlyLimit"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={selectedKey.monthlyLimitCents / 100}
                    key={selectedKey.id}
                    aria-label="Monthly spending limit"
                  />
                </span>
              </label>
              <button className="secondary-button compact" type="submit">Save limits</button>
              <p>Limits apply to all API usage.</p>
            </form>
          </section>

          <section className="panel request-log-panel">
            <div className="panel-heading request-log-heading">
              <div>
                <h2>Request log</h2>
                <p>Metadata only. Prompts and responses are not stored.</p>
              </div>
              <div className="log-filters">
                <label>
                  <span>API key</span>
                  <select value={logKey} onChange={(event) => setLogKey(event.target.value)}>
                    <option value="all">All keys</option>
                    {keys.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
                  </select>
                  <CaretDown size={13} />
                </label>
                <label>
                  <span>Status</span>
                  <select value={logStatus} onChange={(event) => setLogStatus(event.target.value)}>
                    <option value="all">All statuses</option>
                    <option value="Succeeded">Succeeded</option>
                    <option value="Failed">Failed</option>
                  </select>
                  <CaretDown size={13} />
                </label>
              </div>
            </div>

            <div className="table-scroll">
              <table className="request-log-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Key</th>
                    <th>Requested model</th>
                    <th>Tokens in / out</th>
                    <th>Latency</th>
                    <th>Credit cost</th>
                    <th>Dollar equivalent</th>
                    <th>Funding source</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((item) => (
                      <tr key={item.id}>
                        <td>{item.timestamp}</td>
                        <td>{item.keyName}</td>
                        <td><code>{item.model}</code></td>
                        <td>{formatNumber(item.inputTokens)} / {formatNumber(item.outputTokens)}</td>
                        <td>{item.latency}</td>
                        <td>{item.creditCost}</td>
                        <td>{formatDollarMicros(item.dollarEquivalentMicros)}</td>
                        <td>{item.funding}</td>
                        <td><span className={`status-pill ${item.status === "Succeeded" ? "success" : "failed"}`}><i /> {item.status}</span></td>
                      </tr>
                  ))}
                </tbody>
              </table>
              {!filteredLogs.length && <div className="api-empty">No requests match these filters.</div>}
            </div>
          </section>
        </>
      )}

      {createOpen && (
        <div className="modal-backdrop api-modal-backdrop" role="presentation">
          <section className="api-modal" role="dialog" aria-modal="true" aria-labelledby="create-key-title">
            <button className="modal-close" onClick={() => setCreateOpen(false)} aria-label="Close create API key dialog"><X size={19} /></button>
            <span className="api-modal-icon"><Key size={22} /></span>
            <h2 id="create-key-title">Create API key</h2>
            <form onSubmit={createKey}>
              <label>Key name<input name="name" placeholder="Production API" required autoFocus /></label>
              <label>Daily spending limit<span className="currency-input"><i>$</i><input name="dailyLimit" type="number" min="0" step="1" defaultValue="25" /></span></label>
              <label>Monthly spending limit<span className="currency-input"><i>$</i><input name="monthlyLimit" type="number" min="0" step="1" defaultValue="100" /></span></label>
              <label>Expiry<select name="expires" defaultValue="Never"><option>Never</option><option>30 days</option><option>90 days</option><option>1 year</option></select></label>
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setCreateOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button compact">Create key</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {createdSecret && (
        <div className="modal-backdrop api-modal-backdrop" role="presentation">
          <section className="api-modal secret-modal" role="dialog" aria-modal="true" aria-labelledby="secret-title">
            <span className="api-modal-icon"><ShieldCheck size={22} /></span>
            <h2 id="secret-title">Save your API key</h2>
            <div className="secret-warning"><WarningCircle size={18} /><span>Store it securely. Maxshot cannot reveal it again.</span></div>
            <div className="secret-value">
              <code>{createdSecret.secret}</code>
              <button onClick={() => copyText(createdSecret.secret, "secret")} aria-label="Copy new API key">
                {copied === "secret" ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
            <button className="primary-button" onClick={() => setCreatedSecret(null)}>
              I saved this key
            </button>
          </section>
        </div>
      )}

      {revokeTarget && (
        <div className="modal-backdrop api-modal-backdrop" role="presentation">
          <section className="api-modal revoke-modal" role="dialog" aria-modal="true" aria-labelledby="revoke-title">
            <button className="modal-close" onClick={() => setRevokeTarget(null)} aria-label="Close revoke API key dialog"><X size={19} /></button>
            <span className="api-modal-icon danger"><Trash size={21} /></span>
            <h2 id="revoke-title">Revoke {revokeTarget.name}?</h2>
            <p>This key will stop working immediately.</p>
            <div className="form-actions">
              <button className="secondary-button" onClick={() => setRevokeTarget(null)}>Cancel</button>
              <button
                className="danger-button"
                onClick={() => {
                  revokeKey(revokeTarget.id);
                  setRevokeTarget(null);
                }}
              >
                Revoke key
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function ApiMetric({ label, value }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}
