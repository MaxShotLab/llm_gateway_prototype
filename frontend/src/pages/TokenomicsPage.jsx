import { useState } from "react";
import { ArrowRight, ArrowsLeftRight, ClockCountdown, ShieldCheck, Wallet } from "@phosphor-icons/react";
import { PricingPage } from "./PricingPage";
import { providerOfferings, providerProfiles } from "../data/providerCatalog";
import "./tokenomics.css";

const CAP = 50_000;
const SAMPLE_TERM_VERSION = "sample-v1";
const TABS = ["Overview", "Mint", "Stake & Credit", "Burn & Withdraw", "Networks"];
const rate = (s) => 600 * (1 + 2 * (s / CAP) ** 2);
const curve = (s) => 600 * s + (400 * s ** 3) / CAP ** 2;
const fmt = (value, digits = 2) => Number(value).toLocaleString("en-US", { maximumFractionDigits: digits });
const quoteMint = (outstanding, highWaterMark, amount) => {
  const refill = Math.min(amount, Math.max(0, highWaterMark - outstanding));
  const abovePeak = amount - refill;
  return { refill, abovePeak, max: refill * rate(highWaterMark) + curve(highWaterMark + abovePeak) - curve(highWaterMark) };
};

export const initialTokenState = {
  outstanding: 21_000, highWaterMark: 30_000,
  walletMax: 250_000, walletAit: 40, stakedAit: 80,
  debt: 120, collateral: 112_800, pendingMax: 0, withdrawalAt: null,
  history: [{ action: "Stake", detail: "80 AIT staked; no funded Credit term active", time: "Sample history" }, { action: "Mint", detail: "120 AIT added to one merged position", time: "Sample history" }],
};

export function TokenomicsPage({ onCredits, state, setState, linkedWallet }) {
  const [tab, setTab] = useState("Overview");
  const [mintAmount, setMintAmount] = useState("10");
  const [mintReview, setMintReview] = useState(false);
  const [maxMaxInput, setMaxMaxInput] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [stakeAmount, setStakeAmount] = useState("10");
  const [burnAmount, setBurnAmount] = useState("10");
  const [previewTerm, setPreviewTerm] = useState(false);
  const [acceptedPreviewTerms, setAcceptedPreviewTerms] = useState(false);
  const [walletAction, setWalletAction] = useState(null);
  const [notice, setNotice] = useState("");
  const mint = Number(mintAmount);
  const stake = Number(stakeAmount);
  const burn = Number(burnAmount);
  const mintQuote = Number.isFinite(mint) && mint > 0 ? quoteMint(state.outstanding, state.highWaterMark, mint) : null;
  const reviewReady = mintReview && mintQuote && Number.isFinite(Number(maxMaxInput)) && Number(maxMaxInput) >= mintQuote.max && new Date(deadlineInput).getTime() > Date.now();
  const burnMax = Number.isFinite(burn) && burn > 0 && burn <= state.debt ? burn === state.debt ? state.collateral : burn * state.collateral / state.debt : 0;
  const burnShortfall = Number.isFinite(burn) && burn > state.walletAit && burn <= state.debt ? burn - state.walletAit : 0;
  const nextWithdrawal = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sampleTermEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const record = (action, detail) => ({ action, detail, time: "Just now · simulated" });

  const simulateMint = () => {
    if (!mintReview || !mintQuote || Number(maxMaxInput) < mintQuote.max || !(new Date(deadlineInput).getTime() > Date.now()) || mint > CAP - state.outstanding || mintQuote.max > state.walletMax) return;
    setState((s) => ({
      ...s, outstanding: s.outstanding + mint, highWaterMark: Math.max(s.highWaterMark, s.outstanding + mint),
      walletMax: s.walletMax - mintQuote.max, walletAit: s.walletAit + mint,
      debt: s.debt + mint, collateral: s.collateral + mintQuote.max,
      history: [record("Mint", `${fmt(mint)} AIT for ${fmt(mintQuote.max)} MAX · merged position`), ...s.history],
    }));
    setMintReview(false);
    setNotice("Mint simulated. AIT and MAX balances updated in this browser session.");
  };
  const simulateStake = (direction) => {
    const available = direction === "Stake" ? state.walletAit : state.stakedAit;
    if (!Number.isFinite(stake) || stake <= 0 || stake > available || (direction === "Stake" && previewTerm && !acceptedPreviewTerms)) return;
    setState((s) => ({ ...s,
      walletAit: s.walletAit + (direction === "Stake" ? -stake : stake),
      stakedAit: s.stakedAit + (direction === "Stake" ? stake : -stake),
      history: [record(direction, `${fmt(stake)} AIT ${direction === "Stake" ? "staked" : "returned to wallet"}${previewTerm ? " · sample term preview" : ""}`), ...s.history],
    }));
    setNotice(previewTerm ? `${direction} simulated under sample terms. No Credit posted.` : `${direction} simulated. AIT Earned Credit is inactive.`);
  };
  const simulateBurn = () => {
    if (!Number.isFinite(burn) || burn <= 0 || burn > state.debt || burn > state.walletAit) return;
    const withdrawalAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    setState((s) => ({ ...s,
      outstanding: s.outstanding - burn, walletAit: s.walletAit - burn,
      debt: s.debt - burn, collateral: s.collateral - burnMax,
      pendingMax: s.pendingMax + burnMax, withdrawalAt,
      history: [record("Burn", `${fmt(burn)} AIT burned · ${fmt(burnMax)} MAX pending until ${new Date(withdrawalAt).toLocaleDateString()}`), ...s.history],
    }));
    setBurnAmount("");
    setNotice(state.pendingMax ? "Burn simulated. Withdrawal time reset for all pending MAX." : "Burn simulated. MAX is available in seven days.");
  };
  const withdraw = () => {
    if (!state.pendingMax || Date.now() < new Date(state.withdrawalAt).getTime()) return;
    setState((s) => ({ ...s, walletMax: s.walletMax + s.pendingMax, pendingMax: 0, withdrawalAt: null,
      history: [record("Withdraw", `${fmt(s.pendingMax)} MAX returned to wallet`), ...s.history] }));
    setNotice("Withdrawal simulated.");
  };
  const confirmWalletAction = () => {
    const action = walletAction;
    setWalletAction(null);
    if (action === "Mint") simulateMint();
    if (action === "Stake" || action === "Unstake") simulateStake(action);
    if (action === "Burn") simulateBurn();
    if (action === "Withdraw") withdraw();
  };

  return <main className="content-page token-page">
    <div className="page-heading"><div><span className="eyebrow">Ethereum home chain · interactive prototype</span><h1>MAX & AIT</h1><p>Lock MAX, mint AIT, earn eligible compute Credit, and redeem MAX through one merged position.</p></div><span className="token-demo-pill">Simulated balances · no wallet transaction</span></div>
    <div className="token-tabs" role="tablist" aria-label="MAX and AIT"><>{TABS.map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => { setTab(item); setMintReview(false); setNotice(""); }}>{item}</button>)}</></div>
    {notice && <p className="token-notice" role="status">{notice}</p>}

    {tab === "Overview" && <>
      <div className="token-metrics">
        <article><span>Active AIT debt</span><strong>{fmt(state.debt)} <small>AIT</small></strong><p>Owed by this position</p></article>
        <article><span>MAX locked</span><strong>{fmt(state.collateral)} <small>MAX</small></strong><p>Backing active AIT debt</p></article>
        <article><span>Blended MAX / AIT</span><strong>{state.debt ? fmt(state.collateral / state.debt, 4) : "—"}</strong><p>Current position ratio</p></article>
        <article><span>Pending redemption</span><strong>{fmt(state.pendingMax)} <small>MAX</small></strong><p>{state.withdrawalAt ? `Available ${new Date(state.withdrawalAt).toLocaleString()}` : "No withdrawal pending"}</p></article>
      </div>
      <section className="panel token-history"><div className="panel-heading"><div><h2>Position activity</h2><p>Example events and actions simulated in this session.</p></div></div>{state.history.map((event, i) => <div className="token-history-row" key={`${event.action}-${i}`}><span>{event.action}</span><p>{event.detail}</p><small>{event.time}</small></div>)}</section>
    </>}

    {tab === "Mint" && (mintReview ? <section className="panel token-action token-breakdown token-mint-review">
      <h2>Review mint</h2>
      <div><span>AIT to mint</span><strong>{fmt(mint)} AIT</strong></div>
      <div><span>MAX required · illustrative</span><strong>{fmt(mintQuote.max)} MAX</strong></div>
      <label>Maximum MAX input<input type="number" min="0" step="any" value={maxMaxInput} onChange={(e) => setMaxMaxInput(e.target.value)} /></label>
      {maxMaxInput && Number(maxMaxInput) < mintQuote.max && <small className="token-review-error">Limit below quote</small>}
      <label>Deadline<input type="datetime-local" value={deadlineInput} onChange={(e) => setDeadlineInput(e.target.value)} /></label>
      {deadlineInput && !(new Date(deadlineInput).getTime() > Date.now()) && <small className="token-review-error">Choose a future time</small>}
      <div className="token-review-actions"><button className="secondary-button" onClick={() => setMintReview(false)}>Back</button><button className="primary-button" disabled={!reviewReady} onClick={() => setWalletAction("Mint")}>Continue to wallet</button></div>
      <small className="token-fine">Illustrative quote only. No wallet transaction occurs.</small>
    </section> : <div className="token-two-col">
      <section className="panel token-action">
        <span className="eyebrow">MAX → AIT · Ethereum</span><h2>Mint AIT</h2>
        <p>Any transferable MAX in your Ethereum wallet can be locked. The quote is based on the global high-water mark and current outstanding AIT.</p>
        <label>AIT to mint<input type="number" min="0" step="any" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} /></label>
        <div className="token-quick"><button onClick={() => setMintAmount("1")}>1 AIT</button><button onClick={() => setMintAmount("10")}>10 AIT</button><button onClick={() => setMintAmount("100")}>100 AIT</button></div>
        <button className="primary-button" disabled={!mintQuote || mint > CAP - state.outstanding || mintQuote.max > state.walletMax} onClick={() => { setMaxMaxInput(String(mintQuote.max)); setDeadlineInput(""); setMintReview(true); }}>Review mint <ArrowRight size={14} /></button>
        <small className="token-fine">Illustrative quote only. No wallet transaction occurs here.</small>
        <div className="token-mint-activity"><h3>Recent position activity</h3>{state.history.filter(({ action }) => ["Mint", "Burn", "Withdraw"].includes(action)).slice(0, 3).map((event, i) => <div className="token-history-row" key={`${event.action}-${i}`}><span>{event.action}</span><p>{event.detail}</p><small>{event.time}</small></div>)}</div>
      </section>
      <section className="panel token-breakdown">
        <h2>Mint quote · illustrative</h2>
        <div><span>MAX required for {mintQuote ? `${fmt(mint)} AIT` : "—"}</span><strong>{mintQuote ? fmt(mintQuote.max) : "—"} MAX</strong></div>
        <div><span>Protocol fee</span><strong>Pending configuration</strong></div>
        <div><span>Maximum MAX input · slippage guard</span><strong>Set at transaction review</strong></div>
        <div><span>Cap remaining</span><strong>{fmt(CAP - state.outstanding)} AIT</strong></div>
        <div><span>High-water mark</span><strong>{fmt(state.highWaterMark)} AIT</strong></div>
        <div><span>Current position</span><strong>{fmt(state.debt)} AIT debt · {fmt(state.collateral)} MAX locked</strong></div>
        <p className="token-callout">MAX stays locked while AIT debt remains. There is no automatic liquidation; AIT sold must be reacquired to unlock MAX. AIT and MAX market prices can change.</p>
        <details className="token-details"><summary>How the quote works</summary>
          <div><span>Average MAX / AIT</span><strong>{mintQuote ? fmt(mintQuote.max / mint, 4) : "—"}</strong></div>
          <div><span>Refill at HWM rate</span><strong>{mintQuote ? `${fmt(mintQuote.refill)} AIT` : "—"}</strong></div>
          <div><span>Above-peak curve</span><strong>{mintQuote ? `${fmt(mintQuote.abovePeak)} AIT` : "—"}</strong></div>
          <div><span>Current outstanding / cap</span><strong>{fmt(state.outstanding)} / {fmt(CAP)} AIT</strong></div>
          <div><span>Current HWM marginal rate</span><strong>{fmt(rate(state.highWaterMark))} MAX / AIT</strong></div>
          <p>Burning lowers outstanding but never the HWM. A mint below the HWM uses its fixed marginal rate; a mint crossing it splits into refill and new-peak portions.</p>
        </details>
        <small>No position time lock applies. This browser quote uses illustrative floating-point math; production uses the exact integer contract quote. Curve and cap are proposed Genesis parameters awaiting economic approval.</small>
      </section>
    </div>)}

    {tab === "Stake & Credit" && <div className="token-two-col">
      <section className="panel token-action">
        <span className="eyebrow">AIT staking · Ethereum</span><h2>Stake AIT</h2>
        <p>Linked staking wallet · Ethereum · <strong>{linkedWallet}</strong></p>
        <div className="token-wallet-line"><span>Wallet AIT <strong>{fmt(state.walletAit)}</strong></span><span>Staked AIT <strong>{fmt(state.stakedAit)}</strong></span></div>
        <label>AIT amount<input type="number" min="0" step="any" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} /></label>
        <div className="token-actions"><button className="primary-button" disabled={!Number.isFinite(stake) || stake <= 0 || stake > state.walletAit || (previewTerm && !acceptedPreviewTerms)} onClick={() => setWalletAction("Stake")}>Simulate stake</button><button className="secondary-button" disabled={!Number.isFinite(stake) || stake <= 0 || stake > state.stakedAit} onClick={() => setWalletAction("Unstake")}>Simulate unstake</button></div>
        <small className="token-fine">No lock or warm-up. Unstake before burning; unstaking stops new Credit accrual.</small>
      </section>
      <section className="panel token-breakdown">
        <h2>AIT Earned Credit: {previewTerm ? "Sample term" : "Inactive"}</h2>
        <p>{previewTerm ? "Preview only; no Credit is posted." : "Staking is available; no Credit accrues now."}</p>
        <button className="secondary-button compact" onClick={() => setPreviewTerm(!previewTerm)}>{previewTerm ? "Exit preview" : "Preview sample term"}</button>
        {previewTerm ? <>
          <div><span>Funding</span><strong>Sample prefunded</strong></div>
          <div><span>Sample end</span><strong>{sampleTermEnd.toLocaleDateString()}</strong></div>
          <div><span>Sample rate</span><strong>$12 / year / staked AIT</strong></div>
          <div><span>Eligible models</span><strong>Sample catalog set</strong></div>
          <div><span>Grant expiry</span><strong>7 days</strong></div>
          <div><span>Terms version</span><strong>{SAMPLE_TERM_VERSION}</strong></div>
          <div><span>Accepted version</span><strong>{acceptedPreviewTerms ? SAMPLE_TERM_VERSION : "None"}</strong></div>
          <button className="secondary-button compact" disabled={acceptedPreviewTerms} onClick={() => setAcceptedPreviewTerms(true)}>{acceptedPreviewTerms ? "Sample terms accepted" : "Accept sample terms"}</button>
        </> : <details className="token-details"><summary>Term details</summary>
          <div><span>Funded term</span><strong>Not published</strong></div>
          <div><span>Term end</span><strong>Not set</strong></div>
          <div><span>Illustrative rate</span><strong>$12 / year / staked AIT</strong></div>
          <div><span>Eligible models</span><strong>Not published</strong></div>
          <div><span>Terms version</span><strong>Not published</strong></div>
          <div><span>Accepted version</span><strong>None</strong></div>
          <p>Review and accept published terms before Credit earning.</p>
        </details>}
        <details className="token-details"><summary>How Credit works</summary><p>During a funded term, linked AIT stake earns Credit. Gateway grants post every seven days, expire seven days later, and spend on eligible models before subscription allowances.</p></details>
        <button className="secondary-button compact" onClick={onCredits}>View Credits <ArrowRight size={14} /></button>
      </section>
    </div>}

    {tab === "Burn & Withdraw" && <div className="token-two-col">
      <section className="panel token-action">
        <span className="eyebrow">AIT → pending MAX · Ethereum</span><h2>Burn AIT</h2>
        <p>Burn AIT from your wallet against the merged position. Its blended MAX/AIT ratio sets the MAX redemption amount.</p>
        <label>AIT to burn<input type="number" min="0" step="any" value={burnAmount} onChange={(e) => setBurnAmount(e.target.value)} /></label>
        <div className="token-quick"><button onClick={() => setBurnAmount(String(state.walletAit))}>Wallet max</button><button onClick={() => setBurnAmount(String(state.debt))}>Full debt</button></div>
        <div className="token-quote"><span>MAX moved to pending</span><strong>{burnMax ? `${fmt(burnMax)} MAX` : "—"}</strong></div>
        <button className="primary-button" disabled={!burnMax || burn > state.walletAit} onClick={() => setWalletAction("Burn")}>Simulate burn</button>
        <small className="token-fine">{burnShortfall ? `Need ${fmt(burnShortfall)} more AIT to burn. Unstake or obtain AIT.` : "Unstake AIT before burning it."}</small>
      </section>
      <section className="panel token-breakdown">
        <h2>Position & redemption</h2>
        <div><span>Active AIT debt</span><strong>{fmt(state.debt)} AIT</strong></div>
        <div><span>Active MAX collateral</span><strong>{fmt(state.collateral)} MAX</strong></div>
        <div><span>Blended ratio</span><strong>{state.debt ? fmt(state.collateral / state.debt, 4) : "—"} MAX / AIT</strong></div>
        <div><span>Pending MAX</span><strong>{fmt(state.pendingMax)} MAX</strong></div>
        <div><span>Withdrawal time</span><strong>{state.withdrawalAt ? new Date(state.withdrawalAt).toLocaleString() : "—"}</strong></div>
        <button className="secondary-button compact" disabled={!state.pendingMax || Date.now() < new Date(state.withdrawalAt).getTime()} onClick={() => setWalletAction("Withdraw")}>Withdraw pending MAX</button>
        <p className="token-callout"><ClockCountdown size={17} /> {state.pendingMax ? `Another burn resets the seven-day wait for all pending MAX to ${nextWithdrawal.toLocaleDateString()}.` : "Burning starts a seven-day wait before MAX can be withdrawn."}</p>
      </section>
    </div>}

    {tab === "Networks" && <div className="token-two-col"><section className="panel token-feature"><div className="token-icon peach"><ArrowsLeftRight size={22} /></div><span className="eyebrow">MAX · LayerZero routes</span><h2>MAX across four chains</h2><p>MAX can move directly among Ethereum, Base, Arbitrum One, and Robinhood Chain. Return MAX to Ethereum before locking it to mint AIT.</p><div className="token-chain-list"><span>Ethereum</span><span>Base</span><span>Arbitrum One</span><span>Robinhood Chain</span></div><small className="token-fine">Bridge execution, route status and fees are outside this simulated screen.</small></section><section className="panel token-feature"><div className="token-icon blue"><Wallet size={22} /></div><span className="eyebrow">AIT · Ethereum only at launch</span><h2>Hold, transfer, or stake AIT</h2><p>AIT is transferable on Ethereum. Market-bought AIT can be staked for an eligible funded program or burned against your own position debt; buying AIT alone does not close debt.</p><p className="token-callout"><ShieldCheck size={17} /> AIT cross-chain capability is designed for a later release and is inactive at launch.</p></section></div>}
    {walletAction && <div className="token-wallet-backdrop"><section className="panel token-wallet-dialog" role="dialog" aria-modal="true" aria-labelledby="token-wallet-title">
      <h2 id="token-wallet-title">Confirm in wallet</h2>
      <p>{walletAction === "Withdraw" ? `${fmt(state.pendingMax)} MAX` : `${fmt(walletAction === "Mint" ? mint : walletAction === "Burn" ? burn : stake)} AIT`} · {walletAction}</p>
      <small>Wallet authorization required. This is a simulation.</small>
      <div className="token-review-actions"><button className="secondary-button" onClick={() => setWalletAction(null)}>Cancel</button><button className="primary-button" onClick={confirmWalletAction}>Confirm simulation</button></div>
    </section></div>}
  </main>;
}

export function ProviderMarketPage({ initialView = "Profiles & performance" }) {
  const [view, setView] = useState(initialView);
  const [profileId, setProfileId] = useState(providerProfiles[0].id);
  const [comparisonModel, setComparisonModel] = useState(providerOfferings.find((offering) => offering.admitted).model);
  const [pricingModel, setPricingModel] = useState(null);
  const profile = providerProfiles.find((provider) => provider.id === profileId);
  const profileOfferings = providerOfferings.filter((offering) => offering.provider === profile.name);
  const comparedOfferings = providerOfferings.filter((offering) => offering.model === comparisonModel);
  return <main className="content-page token-page">
    <div className="page-heading"><div><span className="eyebrow">Provider Market · prototype</span><h1>Compute providers</h1><p>Explore provider models, admission evidence, and the path to becoming a Maxshot provider.</p></div><span className="token-demo-pill">Illustrative data · no live marketplace</span></div>
    <div className="token-tabs" role="tablist" aria-label="Provider market">{["Profiles & performance", "Models & Pricing", "Provider tokens", "Apply"].map((item) => <button key={item} role="tab" aria-selected={view === item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item}</button>)}</div>
    {view === "Profiles & performance" && <>
      <section className="panel token-provider-profiles"><div className="panel-heading"><div><h2>Provider profiles</h2><p>Choose a provider to review its sample model catalog. All data is simulated.</p></div></div>
        <div className="token-provider-grid" role="group" aria-label="Choose provider">{providerProfiles.map((provider) => <button key={provider.id} className={`token-provider-card ${profileId === provider.id ? "active" : ""}`} aria-pressed={profileId === provider.id} onClick={() => setProfileId(provider.id)}><span className="token-provider-avatar">{provider.initials}</span><strong>{provider.name}</strong><small>{provider.type}</small></button>)}</div>
        <div className="token-provider-detail"><div className="token-provider-detail-head"><span className="token-provider-avatar large">{profile.initials}</span><div><span className="eyebrow">Provider profile · simulated</span><h3>{profile.name}</h3><p>{profile.summary}</p></div></div><div className="token-provider-facts"><div><span>Route type</span><strong>{profile.type}</strong></div><div><span>Sample offerings</span><strong>{profileOfferings.length}</strong></div><div><span>Model focus</span><strong>{profile.focus}</strong></div></div><div className="token-provider-catalog"><div><h4>Model catalog</h4><span>Admission and policy vary by offering · simulated</span></div>{profileOfferings.map((offering) => <button className="token-provider-model" key={offering.model} onClick={() => { setPricingModel(offering.model); setView("Models & Pricing"); }}><strong>{offering.model}</strong><small>{offering.available ? "Available" : offering.admitted ? "Unavailable" : "Admission pending"} · {offering.capabilities.join(" / ")}</small></button>)}</div></div>
      </section>
      <section className="panel token-provider-compare"><div className="panel-heading"><div><h2>Compare model offerings</h2><p>Admission and observed performance belong to each provider-model route. Customer rates are compared under Models & Pricing.</p></div><label>Model / version<select value={comparisonModel} onChange={(event) => setComparisonModel(event.target.value)}>{[...new Set(providerOfferings.map((offering) => offering.model))].map((model) => <option key={model} value={model}>{model}</option>)}</select></label></div><div className="token-offering-grid">{comparedOfferings.map((offering) => <article key={offering.provider} className="token-offering-card"><div className="token-offering-head"><div><span className="eyebrow">{offering.provider}</span><h3>{offering.variant}</h3></div><span className={`token-offering-status ${offering.available ? "" : "pending"}`}>{offering.available ? "Available" : offering.admitted ? `Unavailable${offering.unavailableReason ? ` · ${offering.unavailableReason}` : ""}` : "Admission pending"} · simulated</span></div><div className="token-offering-field"><span>Admission</span><strong>{offering.admitted ? "Passed scripted test · simulated" : "Pending · simulated"}</strong></div><div className="token-offering-field"><span>{offering.admitted ? "Verified capabilities" : "Listed capabilities"}</span><div className="token-offering-tags">{offering.capabilities.map((capability) => <span key={capability}>{capability}</span>)}</div></div><div className="token-offering-field"><span>Limits</span><strong>{offering.limits}</strong></div><div className="token-offering-field"><span>Region / data policy</span><strong>{offering.policy}</strong></div><div className="token-offering-performance"><span>{offering.admitted ? `Observed performance · simulated ${offering.window}` : "Observed performance"}</span>{offering.success ? <div className="token-offering-stats"><div><strong>{offering.success}</strong><small>Delivered · {offering.attempts} attempts</small></div><div><strong>{offering.p50} / {offering.p95}</strong><small>{offering.latencyType} p50 / p95 · {offering.latencySamples} samples</small></div></div> : <strong>{offering.admitted ? `Insufficient data · ${offering.attempts} sample attempts` : "No observed sample · admission pending"}</strong>}</div></article>)}</div><small className="token-fine">The admission test verifies identity, controls, output, usage and price. A small observation sample does not establish a latency percentile or rank.</small></section>
    </>}
    {view === "Models & Pricing" && <PricingPage embedded initialModelId={pricingModel} />}
    {view === "Provider tokens" && <section className="panel token-feature"><span className="eyebrow">Later phase · qualified participation</span><h2>Provider tokens</h2><p>Provider Tokens (PT) require defined financial rights, transfer policy, legal and security approvals, and auditable MAX/PT liquidity design. No PT issuance or trading is offered in this prototype.</p><p className="token-callout">The operational compute marketplace can launch independently of provider tokens.</p></section>}
    {view === "Apply" && <section className="panel token-feature"><span className="eyebrow">Provider onboarding</span><h2>Join the compute network</h2><p>Application → ownership and terms verification → model, price, and policy review → scripted admission test → staged routing → reconciliation and payout.</p><div className="token-flow"><span>Apply</span><ArrowRight size={16} /><span>Verify</span><ArrowRight size={16} /><span>Admission test</span><ArrowRight size={16} /><span>Route</span><ArrowRight size={16} /><span>Settle</span></div><small className="token-fine">Application submission and provider account setup are outside this UI prototype.</small></section>}
  </main>;
}
