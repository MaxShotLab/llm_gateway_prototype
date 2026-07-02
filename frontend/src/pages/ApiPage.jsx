import { Fragment, useMemo, useState } from "react";
import {
  ArrowRight,
  CaretDown,
  Check,
  Copy,
  DotsThree,
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

export function ApiPage() {
  const [keys, setKeys] = useState(starterApiKeys);
  const [selectedKeyId, setSelectedKeyId] = useState(starterApiKeys[0].id);
  const [createOpen, setCreateOpen] = useState(false);
  const [createdSecret, setCreatedSecret] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [copied, setCopied] = useState("");
  const [logKey, setLogKey] = useState("all");
  const [logStatus, setLogStatus] = useState("all");
  const [expandedLog, setExpandedLog] = useState(null);

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
    const monthlyLimit = Number(form.get("limit")) || 0;
    const created = createMockApiKey(name, monthlyLimit, keys.length + 1);

    setKeys((current) => [...current, created.key]);
    setSelectedKeyId(created.key.id);
    setCreateOpen(false);
    setCreatedSecret(created);
  };

  const updateLimit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const monthlyLimit = Number(form.get("monthlyLimit")) || 0;
    setKeys((current) =>
      current.map((item) =>
        item.id === selectedKey.id ? { ...item, monthlyLimit } : item,
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
          <h1>API Gateway</h1>
        </div>
        <button className="primary-button compact" onClick={() => setCreateOpen(true)}>
          <Plus size={17} /> Create API key
        </button>
      </div>

      <section className="api-intro">
        <div>
          <span className="api-chip">OpenAI compatible</span>
          <h2>One endpoint. Every model.</h2>
          <a className="api-doc-link" href={`${import.meta.env.BASE_URL}docs/api.html`} target="_blank" rel="noreferrer">
            Documentation <ArrowRight size={15} />
          </a>
        </div>
        <div className="code-block">
          <div className="code-top">
            <span>Base URL</span>
            <button onClick={() => copyText("https://api.maxshot.ai/v1", "base-url")}>
              {copied === "base-url" ? <Check size={15} /> : <Copy size={15} />}
              {copied === "base-url" ? "Copied" : "Copy"}
            </button>
          </div>
          <code>https://api.maxshot.ai/v1</code>
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
            const limitPercent = item.monthlyLimit
              ? Math.min((item.spent / item.monthlyLimit) * 100, 100)
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
                    ${item.spent.toFixed(2)} of {item.monthlyLimit ? `$${item.monthlyLimit}` : "no limit"}
                  </span>
                  <i><b style={{ width: `${limitPercent}%` }} /></i>
                </div>
                <div className="key-meta">
                  <span>Created {item.created}</span>
                  <span>Last used {item.lastUsed}</span>
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
                label="Remaining limit"
                value={selectedKey.monthlyLimit ? `$${Math.max(selectedKey.monthlyLimit - selectedKey.spent, 0).toFixed(2)}` : "Unlimited"}
              />
            </div>
            <form className="spending-limit-form" onSubmit={updateLimit}>
              <label>
                Monthly limit
                <span className="currency-input">
                  <i>$</i>
                  <input
                    name="monthlyLimit"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={selectedKey.monthlyLimit}
                    key={selectedKey.id}
                    aria-label="Monthly spending limit"
                  />
                </span>
              </label>
              <button className="secondary-button compact" type="submit">Save limit</button>
            </form>
          </section>

          <section className="panel request-log-panel">
            <div className="panel-heading request-log-heading">
              <div>
                <h2>Request log</h2>
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
                    <th>Serving provider</th>
                    <th>Tokens in / out</th>
                    <th>Latency</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((item) => (
                    <Fragment key={item.id}>
                      <tr className={expandedLog === item.id ? "expanded" : ""}>
                        <td>{item.timestamp}</td>
                        <td>{item.keyName}</td>
                        <td><code>{item.model}</code></td>
                        <td>
                          <span className="provider-cell">
                            {item.provider}
                            {item.failover && <b>Failover</b>}
                          </span>
                        </td>
                        <td>{formatNumber(item.inputTokens)} / {formatNumber(item.outputTokens)}</td>
                        <td>{item.latency}</td>
                        <td>{item.cost}</td>
                        <td><span className={`status-pill ${item.status === "Succeeded" ? "success" : "failed"}`}><i /> {item.status}</span></td>
                        <td>
                          <button
                            className="log-detail-button"
                            aria-label={`Show details for ${item.id}`}
                            onClick={() => setExpandedLog((current) => current === item.id ? null : item.id)}
                          >
                            <DotsThree size={18} weight="bold" />
                          </button>
                        </td>
                      </tr>
                      {expandedLog === item.id && (
                        <tr className="request-detail-row" key={`${item.id}-detail`}>
                          <td colSpan="9">
                            <div>
                              <span><b>Request ID</b><code>{item.id}</code></span>
                              <span><b>Route</b>{item.failover ? `${item.primaryProvider} → ${item.provider}` : item.provider}</span>
                              <span><b>Failover</b>{item.failover ? item.failoverReason : "No failover event"}</span>
                              <span><b>Content logging</b>Disabled</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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
              <label>Monthly limit<span className="currency-input"><i>$</i><input name="limit" type="number" min="0" step="1" defaultValue="25" /></span></label>
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
