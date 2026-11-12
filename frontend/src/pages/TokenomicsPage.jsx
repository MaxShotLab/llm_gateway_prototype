import { useState } from "react";
import { ArrowRight, ArrowsLeftRight, Coins, ClockCountdown, LockKey, ShieldCheck, Wallet } from "@phosphor-icons/react";
import "./tokenomics.css";

const CAP = 50_000;
const TABS = ["Overview", "Mint", "Stake & Credit", "Burn & Withdraw", "Market"];
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
  history: [{ action: "Stake", detail: "80 AIT staked for weekly Earned Credit", time: "Sample history" }, { action: "Mint", detail: "120 AIT added to one merged position", time: "Sample history" }],
};

export function TokenomicsPage({ onCredits, state, setState }) {
  const [tab, setTab] = useState("Overview");
  const [mintAmount, setMintAmount] = useState("10");
  const [stakeAmount, setStakeAmount] = useState("10");
  const [burnAmount, setBurnAmount] = useState("10");
  const [notice, setNotice] = useState("");
  const mint = Number(mintAmount);
  const stake = Number(stakeAmount);
  const burn = Number(burnAmount);
  const mintQuote = Number.isFinite(mint) && mint > 0 ? quoteMint(state.outstanding, state.highWaterMark, mint) : null;
  const burnMax = Number.isFinite(burn) && burn > 0 && burn <= state.debt ? burn === state.debt ? state.collateral : burn * state.collateral / state.debt : 0;
  const nextWithdrawal = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const record = (action, detail) => ({ action, detail, time: "Just now · simulated" });

  const simulateMint = () => {
    if (!mintQuote || mint > CAP - state.outstanding || mintQuote.max > state.walletMax) return;
    setState((s) => ({
      ...s, outstanding: s.outstanding + mint, highWaterMark: Math.max(s.highWaterMark, s.outstanding + mint),
      walletMax: s.walletMax - mintQuote.max, walletAit: s.walletAit + mint,
      debt: s.debt + mint, collateral: s.collateral + mintQuote.max,
      history: [record("Mint", `${fmt(mint)} AIT for ${fmt(mintQuote.max)} MAX · merged position`), ...s.history],
    }));
    setNotice("Mint simulated. AIT and MAX balances updated in this browser session.");
  };
  const simulateStake = (direction) => {
    const available = direction === "Stake" ? state.walletAit : state.stakedAit;
    if (!Number.isFinite(stake) || stake <= 0 || stake > available) return;
    setState((s) => ({ ...s,
      walletAit: s.walletAit + (direction === "Stake" ? -stake : stake),
      stakedAit: s.stakedAit + (direction === "Stake" ? stake : -stake),
      history: [record(direction, `${fmt(stake)} AIT ${direction === "Stake" ? "staked" : "returned to wallet"}`), ...s.history],
    }));
    setNotice(`${direction} simulated. Accrued but ungranted Credit is preserved on unstake.`);
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
    setNotice("Burn simulated. The seven-day wait now applies to the entire pending MAX balance.");
  };
  const withdraw = () => {
    if (!state.pendingMax || Date.now() < new Date(state.withdrawalAt).getTime()) return;
    setState((s) => ({ ...s, walletMax: s.walletMax + s.pendingMax, pendingMax: 0, withdrawalAt: null,
      history: [record("Withdraw", `${fmt(s.pendingMax)} MAX returned to wallet`), ...s.history] }));
    setNotice("Withdrawal simulated.");
  };

  return <main className="content-page token-page">
    <div className="page-heading"><div><span className="eyebrow">Ethereum home chain · interactive prototype</span><h1>MAX & AIT</h1><p>Lock MAX, mint AIT, earn eligible compute Credit, and redeem MAX through one merged position.</p></div><span className="token-demo-pill">Simulated balances · no wallet transaction</span></div>
    <div className="token-tabs" role="tablist" aria-label="MAX and AIT"><>{TABS.map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => { setTab(item); setNotice(""); }}>{item}</button>)}</></div>
    {notice && <p className="token-notice" role="status">{notice}</p>}

    {tab === "Overview" && <>
      <div className="token-metrics">
        <article><span>MAX in wallet</span><strong>{fmt(state.walletMax)} <small>MAX</small></strong><p>Ethereum · available to mint</p></article>
        <article><span>AIT in wallet</span><strong>{fmt(state.walletAit)} <small>AIT</small></strong><p>{fmt(state.stakedAit)} AIT staked separately</p></article>
        <article><span>Active position</span><strong>{fmt(state.debt)} <small>AIT debt</small></strong><p>{fmt(state.collateral)} MAX locked</p></article>
        <article><span>Pending redemption</span><strong>{fmt(state.pendingMax)} <small>MAX</small></strong><p>{state.withdrawalAt ? `Available ${new Date(state.withdrawalAt).toLocaleString()}` : "No withdrawal pending"}</p></article>
      </div>
      <div className="token-two-col"><section className="panel token-feature"><div className="token-icon peach"><LockKey size={22} /></div><span className="eyebrow">One merged position</span><h2>Mint into a single MAX claim</h2><p>Every mint adds AIT debt and locked MAX to the same non-transferable position. Burns redeem MAX at its current blended ratio.</p><button className="secondary-button compact" onClick={() => setTab("Mint")}>Explore mint <ArrowRight size={14} /></button></section><section className="panel token-feature"><div className="token-icon blue"><Coins size={22} /></div><span className="eyebrow">Optional funded program</span><h2>Stake AIT for compute Credit</h2><p>Eligible staking time accrues from confirmation. The Gateway posts weekly Earned Credit grants that expire seven days after issuance.</p><button className="secondary-button compact" onClick={() => setTab("Stake & Credit")}>Explore staking <ArrowRight size={14} /></button></section></div>
      <section className="panel token-history"><div className="panel-heading"><div><h2>Position activity</h2><p>Example events and actions simulated in this session.</p></div></div>{state.history.map((event, i) => <div className="token-history-row" key={`${event.action}-${i}`}><span>{event.action}</span><p>{event.detail}</p><small>{event.time}</small></div>)}</section>
    </>}

    {tab === "Mint" && <div className="token-two-col"><section className="panel token-action"><span className="eyebrow">MAX → AIT · Ethereum</span><h2>Mint AIT</h2><p>Any transferable MAX in your Ethereum wallet can be locked. The quote is based on the global high-water mark and current outstanding AIT.</p><label>AIT to mint<input type="number" min="0" step="any" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} /></label><div className="token-quick"><button onClick={() => setMintAmount("1")}>1 AIT</button><button onClick={() => setMintAmount("10")}>10 AIT</button><button onClick={() => setMintAmount("100")}>100 AIT</button></div><button className="primary-button" disabled={!mintQuote || mint > CAP - state.outstanding || mintQuote.max > state.walletMax} onClick={simulateMint}>Simulate mint <ArrowRight size={14} /></button><small className="token-fine">Production flow: review quote and slippage → approve MAX → lock MAX and mint AIT. No approval or transaction occurs here.</small></section><section className="panel token-breakdown"><h2>Curve quote</h2><div><span>MAX required</span><strong>{mintQuote ? fmt(mintQuote.max) : "—"} MAX</strong></div><div><span>Protocol fee</span><strong>Pending configuration</strong></div><div><span>Refill at HWM rate</span><strong>{mintQuote ? `${fmt(mintQuote.refill)} AIT` : "—"}</strong></div><div><span>Above-peak curve</span><strong>{mintQuote ? `${fmt(mintQuote.abovePeak)} AIT` : "—"}</strong></div><div><span>Current position debt</span><strong>{fmt(state.debt)} AIT</strong></div><div><span>Current outstanding / cap</span><strong>{fmt(state.outstanding)} / {fmt(CAP)} AIT</strong></div><div><span>High-water mark</span><strong>{fmt(state.highWaterMark)} AIT</strong></div><div><span>Current HWM marginal rate</span><strong>{fmt(rate(state.highWaterMark))} MAX / AIT</strong></div><p className="token-callout">Burning AIT lowers outstanding debt but never lowers the high-water mark. Minting below the high-water mark uses its fixed marginal rate; a mint crossing it splits into refill and new-peak portions.</p><small>MAX stays locked while AIT debt remains; if AIT is sold, reacquire it to burn and redeem MAX. No time lock applies to the active position. Curve and cap are proposed Genesis parameters awaiting economic approval.</small></section></div>}

    {tab === "Stake & Credit" && <><div className="token-two-col"><section className="panel token-action"><span className="eyebrow">AIT staking · Ethereum</span><h2>Stake AIT</h2><p>One verified Ethereum wallet is linked to this Gateway account. Staking and unstaking have no lock or warm-up period.</p><div className="token-wallet-line"><span>Wallet AIT <strong>{fmt(state.walletAit)}</strong></span><span>Staked AIT <strong>{fmt(state.stakedAit)}</strong></span></div><label>AIT amount<input type="number" min="0" step="any" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} /></label><div className="token-actions"><button className="primary-button" disabled={!Number.isFinite(stake) || stake <= 0 || stake > state.walletAit} onClick={() => simulateStake("Stake")}>Simulate stake</button><button className="secondary-button" disabled={!Number.isFinite(stake) || stake <= 0 || stake > state.stakedAit} onClick={() => simulateStake("Unstake")}>Simulate unstake</button></div><small className="token-fine">Unstake AIT before burning it to redeem MAX. Accrued, ungranted Credit is retained for the next program batch.</small></section><section className="panel token-breakdown"><h2>Earned Credit terms</h2><div><span>Program status</span><strong>Draft · funding unverified</strong></div><div><span>Illustrative base rate</span><strong>$12 / 365 days / staked AIT</strong></div><div><span>Grant timing</span><strong>Every 7 days from program start</strong></div><div><span>Grant expiry</span><strong>7 days after issuance</strong></div><div><span>Eligible usage</span><strong>Approved model catalogs</strong></div><div><span>Credit location</span><strong>Gateway account ledger</strong></div><p className="token-callout">A funded, finite program term and approved model catalogs must be published before production staking rewards begin. This prototype does not represent an active reward promise.</p><button className="secondary-button compact" onClick={onCredits}>View Credits & Subscription <ArrowRight size={14} /></button></section></div><section className="panel token-history"><div className="panel-heading"><div><h2>Weekly grant flow</h2><p>Credit accrues by actual eligible staking time; the Gateway posts grants automatically after Ethereum finality.</p></div></div><div className="token-flow"><span>Stake AIT</span><ArrowRight size={16} /><span>Time-weighted accrual</span><ArrowRight size={16} /><span>Weekly Earned Credit</span><ArrowRight size={16} /><span>Eligible model usage</span></div><p className="token-fine">The account and its one Agent share Earned Credit. For eligible requests, spend earliest-expiring AIT Earned grants, then subscription allowance, other promotional Credits, and Paid balance. Ineligible models skip AIT Earned Credit.</p></section></>}

    {tab === "Burn & Withdraw" && <div className="token-two-col"><section className="panel token-action"><span className="eyebrow">AIT → pending MAX · Ethereum</span><h2>Burn AIT</h2><p>Burn AIT from your wallet against the merged position. The current blended MAX/AIT ratio determines how much MAX moves to pending redemption.</p><label>AIT to burn<input type="number" min="0" step="any" value={burnAmount} onChange={(e) => setBurnAmount(e.target.value)} /></label><div className="token-quick"><button onClick={() => setBurnAmount(String(state.walletAit))}>Wallet max</button><button onClick={() => setBurnAmount(String(state.debt))}>Full debt</button></div><div className="token-quote"><span>MAX moved to pending</span><strong>{fmt(burnMax)} MAX</strong></div><button className="primary-button" disabled={!burnMax || burn > state.walletAit} onClick={simulateBurn}>Simulate burn</button><small className="token-fine">Staked AIT must be unstaked first. AIT acquired in the market can be burned for your position debt.</small></section><section className="panel token-breakdown"><h2>Position & redemption</h2><div><span>Active AIT debt</span><strong>{fmt(state.debt)} AIT</strong></div><div><span>Active MAX collateral</span><strong>{fmt(state.collateral)} MAX</strong></div><div><span>Blended ratio</span><strong>{state.debt ? fmt(state.collateral / state.debt, 4) : "—"} MAX / AIT</strong></div><div><span>Pending MAX</span><strong>{fmt(state.pendingMax)} MAX</strong></div><div><span>Withdrawal time</span><strong>{state.withdrawalAt ? new Date(state.withdrawalAt).toLocaleString() : "—"}</strong></div><button className="secondary-button compact" disabled={!state.pendingMax || Date.now() < new Date(state.withdrawalAt).getTime()} onClick={withdraw}>Withdraw pending MAX</button><p className="token-callout"><ClockCountdown size={17} /> Each burn starts or resets a seven-day wait for the <strong>entire still-pending MAX balance</strong>. Burning again now would set its withdrawal time to {nextWithdrawal.toLocaleDateString()}.</p></section></div>}

    {tab === "Market" && <div className="token-two-col"><section className="panel token-feature"><div className="token-icon peach"><ArrowsLeftRight size={22} /></div><span className="eyebrow">MAX · LayerZero routes</span><h2>MAX across four chains</h2><p>MAX can move directly among Ethereum, Base, Arbitrum One, and Robinhood Chain. Return MAX to Ethereum before locking it to mint AIT.</p><div className="token-chain-list"><span>Ethereum</span><span>Base</span><span>Arbitrum One</span><span>Robinhood Chain</span></div><small className="token-fine">Bridge execution, route status and fees are outside this simulated screen.</small></section><section className="panel token-feature"><div className="token-icon blue"><Wallet size={22} /></div><span className="eyebrow">AIT · Ethereum only at launch</span><h2>Hold, transfer, or stake AIT</h2><p>AIT is transferable on Ethereum. Market-bought AIT can be staked for an eligible funded program or burned against your own position debt; buying AIT alone does not close debt.</p><p className="token-callout"><ShieldCheck size={17} /> AIT cross-chain capability is designed for a later release and is inactive at launch.</p></section></div>}
  </main>;
}

const sampleProviders = [
  { name: "Provider A", models: "Text · vision", median: "410 ms", availability: "99.9%", status: "Verified example" },
  { name: "Provider B", models: "Text · image", median: "520 ms", availability: "99.7%", status: "Verified example" },
  { name: "Provider C", models: "Text · reasoning", median: "690 ms", availability: "99.8%", status: "Verified example" },
];

export function ProviderMarketPage() {
  const [view, setView] = useState("Compute providers");
  return <main className="content-page token-page">
    <div className="page-heading"><div><span className="eyebrow">Provider Market · prototype</span><h1>Compute providers</h1><p>Explore verified inference supply and the path to becoming a Maxshot provider.</p></div><span className="token-demo-pill">Illustrative data · no live marketplace</span></div>
    <div className="token-tabs" role="tablist" aria-label="Provider market">{["Compute providers", "Provider tokens", "Apply"].map((item) => <button key={item} role="tab" aria-selected={view === item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item}</button>)}</div>
    {view === "Compute providers" && <><section className="panel token-feature"><span className="eyebrow">Verified routing</span><h2>One model, qualified supply</h2><p>Maxshot groups provider offerings under one customer-facing model ID only after verifying the same model version and capabilities. Routing chooses the lowest quoted cost among providers meeting quality, latency, and data requirements; failover stays within the request's authorized maximum cost.</p></section><div className="token-provider-grid">{sampleProviders.map((provider) => <article className="panel" key={provider.name}><span className="eyebrow">{provider.status}</span><h2>{provider.name}</h2><div><span>Capabilities</span><strong>{provider.models}</strong></div><div><span>Median latency</span><strong>{provider.median}</strong></div><div><span>Availability</span><strong>{provider.availability}</strong></div><small>Sample metrics for layout only</small></article>)}</div></>}
    {view === "Provider tokens" && <section className="panel token-feature"><span className="eyebrow">Later phase · qualified participation</span><h2>Provider tokens</h2><p>Provider Tokens (PT) require defined financial rights, transfer policy, legal and security approvals, and auditable MAX/PT liquidity design. No PT issuance or trading is offered in this prototype.</p><p className="token-callout">The operational compute marketplace can launch independently of provider tokens.</p></section>}
    {view === "Apply" && <section className="panel token-feature"><span className="eyebrow">Provider onboarding</span><h2>Join the compute network</h2><p>Application → ownership and terms verification → model, price, and SLA review → test key and benchmark → staged routing → reconciliation and payout.</p><div className="token-flow"><span>Apply</span><ArrowRight size={16} /><span>Verify</span><ArrowRight size={16} /><span>Benchmark</span><ArrowRight size={16} /><span>Route</span><ArrowRight size={16} /><span>Settle</span></div><small className="token-fine">Application submission and provider account setup are outside this UI prototype.</small></section>}
  </main>;
}
