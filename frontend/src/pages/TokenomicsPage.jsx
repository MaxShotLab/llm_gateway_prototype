import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { providerOfferings, providerProfiles } from "../data/providerCatalog";
import { sampleEarnedGrants, sampleGrantDate, sampleStakedAit, sampleWeeklyEarnedCredits } from "../data/earnedCreditSample";
import { launchConfig } from "../data/launchConfig";
import "./tokenomics.css";

const CAP = 50_000;
const MAX_SUPPLY = 1_000_000_000;
const SAMPLE_MAX_CIRCULATING = 200_000_000;
const MAX_DAILY_CHANGES = [52_000, -24_000, 39_000, 61_000, -18_000, 47_000];
const AIT_DAILY_CHANGES = [42, -18, 31, 24, -12, 28];
// [verify] against the live app.maxshot.ai route inventory before cutover (ACC-R10).
const AIT_EARN_PORTAL_URL = "https://app.maxshot.ai/yields";
const SAMPLE_TERM_VERSION = "example-v1";
const rate = (s) => 600 * (1 + 2 * (s / CAP) ** 2);
const curve = (s) => 600 * s + (400 * s ** 3) / CAP ** 2;
const fmt = (value, digits = 2) => Number(value).toLocaleString("en-US", { maximumFractionDigits: digits });
const fmtChange = (value) => `${value >= 0 ? "+" : ""}${fmt(value)}`;
const quoteMint = (outstanding, highWaterMark, amount) => {
  const refill = Math.min(amount, Math.max(0, highWaterMark - outstanding));
  const abovePeak = amount - refill;
  return { max: refill * rate(highWaterMark) + curve(highWaterMark + abovePeak) - curve(highWaterMark) };
};

function MintCurve({ outstanding, highWaterMark, amount }) {
  const [hoverSupply, setHoverSupply] = useState(null);
  const hasAmount = Number.isFinite(amount) && amount > 0;
  const left = 38;
  const top = 12;
  const width = 392;
  const height = 126;
  const x = (s) => left + width * s / CAP;
  const y = (s) => top + height * (1800 - rate(s)) / 1200;
  const after = Math.min(CAP, outstanding + (hasAmount ? amount : 0));
  const path = Array.from({ length: 65 }, (_, i) => `${i ? "L" : "M"}${x(i * CAP / 64).toFixed(1)},${y(i * CAP / 64).toFixed(1)}`).join(" ");
  const refillEnd = Math.min(after, highWaterMark);
  const rise = after > highWaterMark ? Array.from({ length: 17 }, (_, i) => `L${x(highWaterMark + (after - highWaterMark) * i / 16).toFixed(1)},${y(highWaterMark + (after - highWaterMark) * i / 16).toFixed(1)}`).join(" ") : "";
  const quotePath = `M${x(outstanding).toFixed(1)},${y(highWaterMark).toFixed(1)} L${x(refillEnd).toFixed(1)},${y(highWaterMark).toFixed(1)} ${rise}`;
  const moveHover = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const svgX = (event.clientX - bounds.left) * 460 / bounds.width;
    setHoverSupply(Math.round(Math.max(0, Math.min(CAP, (svgX - left) * CAP / width))));
  };
  const tooltipX = hoverSupply === null ? 0 : Math.max(5, Math.min(330, x(hoverSupply) - 60));
  return <svg className="token-curve" viewBox="0 0 460 178" role="img" aria-label={`Illustrative marginal MAX per AIT curve. Current outstanding ${fmt(outstanding)} AIT, high-water mark ${fmt(highWaterMark)} AIT, after selected mint ${fmt(after)} AIT.`} onPointerMove={moveHover} onPointerLeave={() => setHoverSupply(null)}>
    <line x1={left} y1={top + height} x2={left + width} y2={top + height} className="token-curve-axis" />
    <path d={path} className="token-curve-base" />
    <line x1={x(highWaterMark)} y1={top} x2={x(highWaterMark)} y2={top + height} className="token-curve-hwm" />
    {hasAmount && <><path d={quotePath} className="token-curve-selected" /><circle cx={x(outstanding)} cy={y(highWaterMark)} r="4" className="token-curve-current" /><circle cx={x(after)} cy={y(Math.max(highWaterMark, after))} r="5" className="token-curve-after" /></>}
    {hoverSupply !== null && <><line x1={x(hoverSupply)} y1={top} x2={x(hoverSupply)} y2={top + height} className="token-curve-hover-line" /><circle cx={x(hoverSupply)} cy={y(hoverSupply)} r="4" className="token-curve-hover-dot" /><g className="token-curve-tooltip" transform={`translate(${tooltipX} 4)`}><rect width="126" height="39" rx="6" /><text x="8" y="15">{fmt(hoverSupply)} AIT outstanding</text><text x="8" y="30">{fmt(rate(hoverSupply), 2)} MAX / AIT</text></g></>}
    <text x={left} y="163">0</text><text x={left + width / 2} y="163" textAnchor="middle">25k</text><text x={left + width} y="163" textAnchor="end">50k AIT</text>
    <text x={left - 7} y="20" textAnchor="end">1,800</text><text x={left - 7} y={top + height} textAnchor="end">600</text>
  </svg>;
}

const positionRows = [
  ["MAX backing AIT", "collateral", "MAX"],
  ["AIT staked", "stakedAit", "AIT"],
  ["AIT debt", "debt", "AIT"],
  ["MAX pending", "pendingMax", "MAX"],
];

function PositionPreview({ current, projected, children }) {
  return <section className="panel token-preview">
    <h2>Position preview</h2>
    {!projected && current.debt === 0 && current.stakedAit === 0 ? <p className="token-position-empty">No active position yet. Mint AIT with MAX to open one.</p> : <div className="token-position-rows">{positionRows.map(([label, key, unit]) => <div key={key}><span>{label}</span><strong>{fmt(current[key])}{projected && projected[key] !== current[key] ? ` → ${fmt(projected[key])}` : ""} {unit}</strong></div>)}</div>}
    {current.debt > 0 && <details className="token-position-details"><summary>Position details</summary><span>Average backing: {fmt(current.collateral / current.debt, 4)} MAX / AIT debt</span></details>}
    {children}
  </section>;
}

function DailyChangeChart({ changes, unit }) {
  const scale = Math.max(...changes.map((value) => Math.abs(value)), 1);
  return <svg className="token-daily-chart" viewBox="0 0 252 80" role="img" aria-label={`Seven-day daily net staking changes in ${unit}: ${changes.map((value) => `${value >= 0 ? "+" : ""}${fmt(value)} ${unit}`).join(", ")}`}>
    <line x1="0" y1="38" x2="252" y2="38" />
    {changes.map((value, index) => {
      const height = Math.max(3, Math.abs(value) / scale * 29);
      return <rect key={index} x={8 + index * 35} y={value >= 0 ? 38 - height : 38} width="21" height={height} rx="3" className={value >= 0 ? "up" : "down"} />;
    })}
    <text x="8" y="72">6 days ago</text><text x="244" y="72" textAnchor="end">Today</text>
  </svg>;
}

export const initialTokenState = {
  outstanding: 21_000, highWaterMark: 30_000,
  globalBackedMax: 18_900_000, globalStakedAit: 12_600, maxDailyDelta: 36_000, aitDailyDelta: 16,
  walletMax: 250_000, walletAit: 40, stakedAit: sampleStakedAit,
  debt: 120, collateral: 112_800, pendingMax: 0, withdrawalAt: null, earnedGrants: sampleEarnedGrants,
};
const scenarioState = (scenario) => {
  if (scenario === "new") return { ...initialTokenState, debt: 0, collateral: 0, walletAit: 0, stakedAit: 0, pendingMax: 0, withdrawalAt: null, earnedGrants: [] };
  if (scenario === "pending" || scenario === "ready") return { ...initialTokenState, outstanding: 20_960, globalBackedMax: 18_862_400, globalStakedAit: 12_580, maxDailyDelta: -1_600, aitDailyDelta: -4, debt: 80, collateral: 75_200, walletAit: 20, stakedAit: 60, pendingMax: 37_600, withdrawalAt: new Date(Date.now() + (scenario === "pending" ? 3 : -1) * 24 * 60 * 60 * 1000).toISOString() };
  return { ...initialTokenState };
};
export const prototypeWallet = "0x7A42...8E21";

export function TokenomicsPage({ onCredits, state, setState, scenario, setScenario, history, setHistory, acceptedPreviewTerms, setAcceptedPreviewTerms }) {
  const [activeAction, setActiveAction] = useState("entry");
  const [source, setSource] = useState("mint");
  const [mintAmount, setMintAmount] = useState("");
  const [stakeAfterMint, setStakeAfterMint] = useState(true);
  const [mintReview, setMintReview] = useState(false);
  const [reviewQuoteMax, setReviewQuoteMax] = useState(null);
  const [exitReview, setExitReview] = useState(false);
  const [exitMode, setExitMode] = useState("burn");
  const [unstakeForBurn, setUnstakeForBurn] = useState(true);
  const [slippageInput, setSlippageInput] = useState("0.5");
  const [stakeAmount, setStakeAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [buyTarget, setBuyTarget] = useState(null);
  const [buyAmount, setBuyAmount] = useState("");
  const [walletAction, setWalletAction] = useState(null);
  const [notice, setNotice] = useState("");
  const log = (action, detail) => setHistory((h) => [{ action, detail, time: new Date().toLocaleString() }, ...h].slice(0, 20));
  const mint = Number(mintAmount);
  const stake = Number(stakeAmount);
  const burn = Number(burnAmount);
  const mintQuote = Number.isFinite(mint) && mint > 0 && mint <= CAP - state.outstanding ? quoteMint(state.outstanding, state.highWaterMark, mint) : null;
  const slippage = Number(slippageInput);
  const maxMaxInput = reviewQuoteMax !== null && slippageInput !== "" && Number.isFinite(slippage) && slippage >= 0 && Number.isFinite(reviewQuoteMax * (1 + slippage / 100)) ? Math.ceil(reviewQuoteMax * (1 + slippage / 100) * 1e6) / 1e6 : null;
  const reviewReady = mintReview && maxMaxInput !== null && mintQuote && mintQuote.max <= maxMaxInput;
  const burnMax = Number.isFinite(burn) && burn > 0 && burn <= state.debt ? burn === state.debt ? state.collateral : burn * state.collateral / state.debt : 0;
  const burnShortfall = Number.isFinite(burn) && burn > state.walletAit && burn <= state.debt ? burn - state.walletAit : 0;
  const canSourceBurn = burnShortfall === 0 || (unstakeForBurn && burnShortfall <= state.stakedAit);
  const canBurn = burnMax > 0 && canSourceBurn;
  const canUnstakeOnly = Number.isFinite(burn) && burn > 0 && burn <= state.stakedAit;
  const mintPosition = mintQuote && mintQuote.max <= state.walletMax ? { ...state, walletMax: state.walletMax - mintQuote.max, collateral: state.collateral + mintQuote.max, walletAit: state.walletAit + (stakeAfterMint ? 0 : mint), stakedAit: state.stakedAit + (stakeAfterMint ? mint : 0), debt: state.debt + mint } : null;
  const stakePosition = Number.isFinite(stake) && stake > 0 && stake <= state.walletAit ? { ...state, walletAit: state.walletAit - stake, stakedAit: state.stakedAit + stake } : null;
  const burnPosition = canBurn ? { ...state, walletAit: state.walletAit + burnShortfall - burn, stakedAit: state.stakedAit - burnShortfall, collateral: state.collateral - burnMax, debt: state.debt - burn, pendingMax: state.pendingMax + burnMax } : null;
  const unstakePosition = canUnstakeOnly ? { ...state, walletAit: state.walletAit + burn, stakedAit: state.stakedAit - burn } : null;
  const projectedPosition = activeAction === "entry" ? source === "mint" ? mintPosition : stakePosition : exitMode === "burn" ? burnPosition : unstakePosition;
  const maxBackingRatio = state.globalBackedMax / SAMPLE_MAX_CIRCULATING * 100;
  const aitStakedRatio = state.globalStakedAit / state.outstanding * 100;
  const sampleTermStart = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000);
  const sampleTermEnd = new Date(sampleTermStart.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sampleNextGrant = new Date(sampleTermStart.getTime() + 14 * 24 * 60 * 60 * 1000);
  const estimatedNextGrant = sampleWeeklyEarnedCredits(state.stakedAit);

  const selectScenario = (next) => {
    setScenario(next);
    setState(scenarioState(next));
    setMintReview(false);
    setExitReview(false);
    setMintAmount("");
    setStakeAmount("");
    setBurnAmount("");
    setActiveAction("entry");
    setWalletAction(null);
    setNotice("");
    setHistory([]);
    setAcceptedPreviewTerms(next !== "new");
  };

  const simulateMint = () => {
    if (!mintReview || !mintQuote || maxMaxInput === null || mintQuote.max > maxMaxInput || mint > CAP - state.outstanding || mintQuote.max > state.walletMax) return;
    setState((s) => ({
      ...s, outstanding: s.outstanding + mint, highWaterMark: Math.max(s.highWaterMark, s.outstanding + mint),
      globalBackedMax: s.globalBackedMax + mintQuote.max, globalStakedAit: s.globalStakedAit + (stakeAfterMint ? mint : 0),
      maxDailyDelta: s.maxDailyDelta + mintQuote.max, aitDailyDelta: s.aitDailyDelta + (stakeAfterMint ? mint : 0),
      walletMax: s.walletMax - mintQuote.max, walletAit: s.walletAit + (stakeAfterMint ? 0 : mint),
      stakedAit: s.stakedAit + (stakeAfterMint ? mint : 0),
      debt: s.debt + mint, collateral: s.collateral + mintQuote.max,
    }));
    setMintReview(false);
    setScenario("custom");
    log(stakeAfterMint ? "Mint & stake" : "Mint", `${fmt(mint)} AIT for ${fmt(mintQuote.max)} MAX locked`);
    setNotice(stakeAfterMint ? `AIT minted and staked.${acceptedPreviewTerms ? "" : " Accept terms to start earning Credits."}` : "AIT minted to wallet.");
    setMintAmount("");
  };
  const simulateStake = (direction) => {
    const available = direction === "Stake" ? state.walletAit : state.stakedAit;
    if (!Number.isFinite(stake) || stake <= 0 || stake > available) return;
    setState((s) => ({ ...s,
      globalStakedAit: s.globalStakedAit + (direction === "Stake" ? stake : -stake),
      aitDailyDelta: s.aitDailyDelta + (direction === "Stake" ? stake : -stake),
      walletAit: s.walletAit + (direction === "Stake" ? -stake : stake),
      stakedAit: s.stakedAit + (direction === "Stake" ? stake : -stake),
    }));
    setScenario("custom");
    log(direction, `${fmt(stake)} AIT`);
    setNotice(`${fmt(stake)} AIT ${direction === "Stake" ? "staked" : "unstaked"}.${direction === "Stake" && !acceptedPreviewTerms ? " Accept terms to start earning Credits." : ""}`);
    setStakeAmount("");
  };
  const simulateBurn = () => {
    if (!canBurn) return;
    const withdrawalAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    setState((s) => ({ ...s,
      outstanding: s.outstanding - burn, walletAit: s.walletAit + burnShortfall - burn,
      globalBackedMax: s.globalBackedMax - burnMax, globalStakedAit: s.globalStakedAit - burnShortfall,
      maxDailyDelta: s.maxDailyDelta - burnMax, aitDailyDelta: s.aitDailyDelta - burnShortfall,
      stakedAit: s.stakedAit - burnShortfall,
      debt: s.debt - burn, collateral: s.collateral - burnMax,
      pendingMax: s.pendingMax + burnMax, withdrawalAt,
    }));
    setExitReview(false);
    setScenario("custom");
    log("Burn", `${fmt(burn)} AIT burned; ${fmt(burnMax)} MAX to pending redemption`);
    setNotice(`${fmt(state.pendingMax + burnMax)} MAX eligible to withdraw ${new Date(withdrawalAt).toLocaleString()}.${state.pendingMax ? " The previous pending balance uses this new date." : ""}`);
    setBurnAmount("");
  };
  const simulateUnstakeOnly = () => {
    if (!canUnstakeOnly) return;
    setState((s) => ({ ...s, walletAit: s.walletAit + burn, stakedAit: s.stakedAit - burn,
      globalStakedAit: s.globalStakedAit - burn, aitDailyDelta: s.aitDailyDelta - burn }));
    setExitReview(false);
    setScenario("custom");
    log("Unstake", `${fmt(burn)} AIT`);
    setNotice(`${fmt(burn)} AIT returned to your wallet. New Credit accrual stops for it.`);
    setBurnAmount("");
  };
  const simulateBuy = () => {
    const amount = Number(buyAmount);
    if (!buyTarget || !Number.isFinite(amount) || amount <= 0) return;
    setState((s) => ({ ...s, [buyTarget === "MAX" ? "walletMax" : "walletAit"]: s[buyTarget === "MAX" ? "walletMax" : "walletAit"] + amount }));
    setScenario("custom");
    setNotice(`${fmt(amount)} ${buyTarget} added to wallet.`);
    setBuyTarget(null);
    setBuyAmount("");
  };
  const withdraw = () => {
    if (!state.pendingMax || Date.now() < new Date(state.withdrawalAt).getTime()) return;
    setState((s) => ({ ...s, walletMax: s.walletMax + s.pendingMax, pendingMax: 0, withdrawalAt: null }));
    setScenario("custom");
    log("Withdraw", `${fmt(state.pendingMax)} MAX`);
    setNotice("MAX withdrawn.");
  };
  const confirmWalletAction = () => {
    const action = walletAction;
    setWalletAction(null);
    if (action === "Mint") simulateMint();
    if (action === "Stake" || action === "Unstake") simulateStake(action);
    if (action === "Burn") simulateBurn();
    if (action === "UnstakeOnly") simulateUnstakeOnly();
    if (action === "Withdraw") withdraw();
  };

  return <main className="content-page token-page">
    <div className="page-heading token-page-heading"><div><h1>Tokenomics</h1><p className="token-linked-wallet">Linked wallet · Ethereum · <strong>{prototypeWallet}</strong></p></div><div><span className="token-demo-pill">Sample data</span><label>Preview position<select value={scenario} onChange={(event) => selectScenario(event.target.value)}><option value="active">Active</option><option value="new">New</option><option value="pending">Pending MAX</option><option value="ready">Ready to withdraw</option><option value="custom" disabled>Current session</option></select></label></div></div>
    {notice && <p className="token-notice" role="status">{notice}</p>}
    <div className="token-two-col token-workbench">
      <div className="token-operate">
    {mintReview ? <section className="panel token-action token-breakdown token-mint-review">
      <h2>Review {stakeAfterMint ? "mint & stake" : "mint"}</h2>
      <div><span>AIT to mint</span><strong>{fmt(mint)} AIT</strong></div>
      <div><span>MAX to lock</span><strong>{fmt(reviewQuoteMax)} MAX</strong></div>
      <div><span>Stake minted AIT</span><strong>{stakeAfterMint ? "Yes" : "No"}</strong></div>
      <div><span>After · debt / backing MAX</span><strong>{fmt(state.debt + mint)} AIT / {fmt(state.collateral + mintQuote.max)} MAX</strong></div>
      <label>Slippage tolerance (%)<input type="number" min="0" step="0.1" value={slippageInput} onChange={(e) => setSlippageInput(e.target.value)} /></label>
      <div><span>Maximum MAX</span><strong>{maxMaxInput === null ? "—" : `${fmt(maxMaxInput, 6)} MAX`}</strong></div>
      {mintQuote && maxMaxInput !== null && mintQuote.max > maxMaxInput && <small className="token-review-error">Price moved above your maximum. Review again.</small>}
      <small className="token-review-risk">No automatic liquidation. AIT you sell must be bought back to unlock this MAX. MAX and AIT prices can move.</small>
      <div className="token-review-actions"><button className="secondary-button" onClick={() => setMintReview(false)}>Back</button><button className="primary-button" disabled={!reviewReady} onClick={() => setWalletAction("Mint")}>Continue to wallet</button></div>
    </section> : <section className="panel token-action">
        <h2>{source === "mint" ? "Mint AIT" : "Stake AIT Only"}</h2>
        <div className="token-source-select" role="group" aria-label="AIT source"><button className={source === "mint" ? "active" : ""} aria-pressed={source === "mint"} onClick={() => { setSource("mint"); setActiveAction("entry"); }}>Mint with MAX</button><button className={source === "wallet" ? "active" : ""} aria-pressed={source === "wallet"} onClick={() => { setSource("wallet"); setActiveAction("entry"); }}>Stake AIT Only</button></div>
        {source === "mint" ? <>
          <label>AIT amount<span className="token-available">Available: {fmt(state.walletMax)} MAX</span><input type="number" min="0" step="any" placeholder="0" value={mintAmount} onFocus={() => setActiveAction("entry")} onChange={(e) => { setMintAmount(e.target.value); setActiveAction("entry"); }} /></label>
          <div className="token-quick"><button onClick={() => { setMintAmount("1"); setActiveAction("entry"); }}>1 AIT</button><button onClick={() => { setMintAmount("10"); setActiveAction("entry"); }}>10 AIT</button><button onClick={() => { setMintAmount("100"); setActiveAction("entry"); }}>100 AIT</button></div>
          <label className="token-stake-toggle"><input type="checkbox" checked={stakeAfterMint} onChange={(e) => { setStakeAfterMint(e.target.checked); setActiveAction("entry"); }} /> Stake minted AIT</label>
          <button className="primary-button" disabled={!mintQuote || mintQuote.max > state.walletMax} onClick={() => { setReviewQuoteMax(mintQuote.max); setMintReview(true); }}>Review {stakeAfterMint ? "mint & stake" : "mint"} <ArrowRight size={14} /></button>
          <button className="token-inline-buy" onClick={() => { setBuyTarget("MAX"); setBuyAmount("100"); }}>Buy MAX ↗</button>
          {mint > CAP - state.outstanding && <small className="token-review-error">Cap remaining: {fmt(CAP - state.outstanding)} AIT</small>}
          {mintQuote && mintQuote.max > state.walletMax && <small className="token-review-error">Need {fmt(mintQuote.max - state.walletMax)} more MAX</small>}
        </> : <>
          <label>AIT amount<span className="token-available">Available: {fmt(state.walletAit)} AIT</span><input type="number" min="0" step="any" placeholder="0" value={stakeAmount} onFocus={() => setActiveAction("entry")} onChange={(e) => { setStakeAmount(e.target.value); setActiveAction("entry"); }} /></label>
          <button className="primary-button" disabled={!Number.isFinite(stake) || stake <= 0 || stake > state.walletAit} onClick={() => setWalletAction("Stake")}>Review stake <ArrowRight size={14} /></button>
          <button className="token-inline-buy" onClick={() => { setBuyTarget("AIT"); setBuyAmount("10"); }}>Buy AIT ↗</button>
        </>}
      </section>}

    {exitReview ? <section className="panel token-breakdown token-exit-review"><h2>Review {exitMode === "burn" ? "AIT burn" : "AIT unstake"}</h2>
      {exitMode === "burn" ? <><div><span>AIT to unstake first</span><strong>{fmt(burnShortfall)} AIT</strong></div><div><span>AIT to burn</span><strong>{fmt(burn)} AIT</strong></div><div><span>MAX moving to pending redemption</span><strong>{fmt(burnMax)} MAX</strong></div><div><span>Withdrawable from</span><strong>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString()}</strong></div>{state.pendingMax > 0 && <small>Burning again resets the wait for all pending MAX.</small>}</> : <><div><span>AIT to unstake</span><strong>{fmt(burn)} AIT</strong></div><div><span>Wallet AIT after</span><strong>{fmt(state.walletAit + burn)} AIT</strong></div></>}
      <div className="token-review-actions"><button className="secondary-button" onClick={() => setExitReview(false)}>Back</button><button className="primary-button" onClick={() => setWalletAction(exitMode === "burn" ? "Burn" : "UnstakeOnly")}>Continue to wallet</button></div>
    </section> : <>
      <section className="panel token-action"><h2>Exit your position</h2>
        <div className="token-source-select" role="group" aria-label="Exit action"><button className={exitMode === "burn" ? "active" : ""} aria-pressed={exitMode === "burn"} onClick={() => { setExitMode("burn"); setActiveAction("exit"); }}>Burn AIT to redeem MAX</button><button className={exitMode === "unstake" ? "active" : ""} aria-pressed={exitMode === "unstake"} onClick={() => { setExitMode("unstake"); setActiveAction("exit"); }}>Unstake AIT only</button></div>
        <label>AIT amount<span className="token-available">Available: {fmt(exitMode === "burn" ? Math.min(state.debt, state.walletAit + (unstakeForBurn ? state.stakedAit : 0)) : state.stakedAit)} AIT</span><input type="number" min="0" step="any" placeholder="0" value={burnAmount} onFocus={() => setActiveAction("exit")} onChange={(event) => { setBurnAmount(event.target.value); setActiveAction("exit"); }} /></label>
        <div className="token-quick"><button onClick={() => { setBurnAmount(String(exitMode === "burn" ? state.debt : state.stakedAit)); setActiveAction("exit"); }}>{exitMode === "burn" ? "Full debt" : "All staked"}</button>{exitMode === "burn" && <button onClick={() => { setBurnAmount(String(state.walletAit)); setActiveAction("exit"); }}>Wallet AIT</button>}</div>
        {exitMode === "burn" && <label className="token-stake-toggle"><input type="checkbox" checked={unstakeForBurn} onChange={(event) => { setUnstakeForBurn(event.target.checked); setActiveAction("exit"); }} /> Unstake AIT first if needed</label>}
        <button className="primary-button" disabled={exitMode === "burn" ? !canBurn : !canUnstakeOnly} onClick={() => setExitReview(true)}>Review {exitMode === "burn" ? "unstake & burn" : "unstake"} <ArrowRight size={14} /></button>
        {exitMode === "burn" && burnShortfall > state.stakedAit && <small className="token-review-error">Need {fmt(burnShortfall - state.stakedAit)} more AIT</small>}
        {exitMode === "burn" && !unstakeForBurn && burnShortfall > 0 && <small className="token-review-error">{fmt(burnShortfall)} AIT must reach your wallet first</small>}
        {exitMode === "burn" && <button className="token-inline-buy" onClick={() => { setBuyTarget("AIT"); setBuyAmount("10"); }}>Buy AIT ↗</button>}
      </section>
    </>}
    <details className="panel token-term-details token-grant-history"><summary>Grant history · Last 12 weeks</summary>
      <div className="token-grant-list">{state.earnedGrants.length ? state.earnedGrants.map((grant) => <div className="token-grant-row" key={grant.issuedAt.toISOString()}><span>{sampleGrantDate(grant.issuedAt)}</span><strong>+{fmt(grant.amount)} Credits</strong><small>{grant.expiresAt > new Date() ? "Available" : "Expired"} · {sampleGrantDate(grant.expiresAt)}</small></div>) : <p>No grants yet.</p>}</div>
    </details>

    <details className="panel token-term-details"><summary>Transactions · {history.length ? `${history.length} ${history.length === 1 ? "transaction" : "transactions"}` : "None yet"}</summary>
      {history.length ? history.map((event, i) => <div className="token-history-row" key={`${event.time}-${i}`}><span>{event.action}</span><p>{event.detail}</p><small>{event.time} · simulated</small></div>) : <p>Your mint, stake, unstake, burn and withdrawal transactions appear here.</p>}
    </details>
      </div>
      <div className="token-position-column">
      <section className="panel token-term-details token-term-card">
        <h2>AIT Earned Credit · Active funded term</h2>
        <small>{!acceptedPreviewTerms ? `${fmt(state.stakedAit)} AIT staked · Not earning yet` : state.stakedAit > 0 ? `${fmt(state.stakedAit)} AIT × $${launchConfig.aitUsdPerYear}/year → ~${fmt(estimatedNextGrant)} Credits · Next ${sampleGrantDate(sampleNextGrant)}` : `0 AIT staked · $${launchConfig.aitUsdPerYear} / AIT-year`}</small>
        {!acceptedPreviewTerms && <button className="secondary-button compact" onClick={() => setAcceptedPreviewTerms(true)}>{`Accept terms (${SAMPLE_TERM_VERSION}) to earn Credits`}</button>}
        <details className="token-term-rules"><summary>Term rules</summary>
          <div className="token-term-grid"><span>Period <strong>Every 7 days; posts after finality</strong></span><span>Expiry <strong>7 days after issue</strong></span><span>Rate <strong>{`$${launchConfig.aitUsdPerYear} / AIT-year`}</strong></span><span>Start <strong>{sampleTermStart.toLocaleDateString()}</strong></span><span>End <strong>{sampleTermEnd.toLocaleDateString()}</strong></span></div>
          <button className="secondary-button compact" onClick={onCredits}>View balance <ArrowRight size={14} /></button>
        </details>
      </section>
      <PositionPreview current={state} projected={projectedPosition}>
        <div className="token-curve-block"><div className="token-curve-head"><h3>Mint curve</h3><strong>{activeAction === "entry" && source === "mint" && mintPosition ? `${fmt(mintQuote.max)} MAX to lock` : ""}</strong></div><MintCurve outstanding={state.outstanding} highWaterMark={state.highWaterMark} amount={activeAction === "entry" && source === "mint" && mintPosition ? mint : 0} /><div className="token-curve-legend"><span>Curve</span>{activeAction === "entry" && source === "mint" && mintPosition && <span className="token-legend-selected">Selected mint</span>}<span className="token-legend-hwm">High-water mark</span></div></div>
        {activeAction === "exit" && exitMode === "burn" && burnPosition && <div className="token-preview-note"><span>MAX withdrawal wait</span><strong>7 days after burn</strong></div>}
        {state.pendingMax > 0 && <div className="token-pending-line"><span>MAX available {new Date(state.withdrawalAt).toLocaleString()}</span><button className="secondary-button compact" disabled={Date.now() < new Date(state.withdrawalAt).getTime()} onClick={() => setWalletAction("Withdraw")}>Withdraw MAX</button></div>}
      </PositionPreview>
      </div>
    </div>

    <section className="panel token-earn-card"><h2>Earn AIT</h2><a className="secondary-button compact" href={AIT_EARN_PORTAL_URL} target="_blank" rel="noopener noreferrer">Open AIT Earn ↗</a></section>
    <section className="token-dashboard" aria-label="MAX and AIT dashboard">
      <div className="token-flow-heading"><h2>MAX & AIT dashboard</h2></div>
      <div className="token-two-col">
        <article className="panel token-dashboard-card"><div className="token-dashboard-head"><div><span className="eyebrow">MAX</span><h3>{fmt(SAMPLE_MAX_CIRCULATING)} <small>circulating</small></h3></div><span>{fmt(maxBackingRatio, 2)}% backing AIT</span></div>
          <div className="token-supply-bar" aria-label={`${fmt(state.globalBackedMax)} MAX backing AIT; ${fmt(SAMPLE_MAX_CIRCULATING - state.globalBackedMax)} other circulating MAX`}><span style={{ width: `${maxBackingRatio}%` }} /></div>
          <div className="token-dashboard-breakdown"><div><span>Backing AIT</span><strong>{fmt(state.globalBackedMax)} MAX</strong></div><div><span>Other circulating</span><strong>{fmt(SAMPLE_MAX_CIRCULATING - state.globalBackedMax)} MAX</strong></div><div><span>Outside circulation</span><strong>{fmt(MAX_SUPPLY - SAMPLE_MAX_CIRCULATING)} MAX</strong></div></div>
          <div className="token-daily-head"><span>Daily change · MAX backing</span><strong className={state.maxDailyDelta >= 0 ? "up" : "down"}>{fmtChange(state.maxDailyDelta)} MAX today</strong></div>
          <DailyChangeChart changes={[...MAX_DAILY_CHANGES, state.maxDailyDelta]} unit="MAX" />
        </article>
        <article className="panel token-dashboard-card"><div className="token-dashboard-head"><div><span className="eyebrow">AIT</span><h3>{fmt(state.outstanding)} <small>outstanding</small></h3></div><span>{fmt(aitStakedRatio, 2)}% staked</span></div>
          <div className="token-supply-bar" aria-label={`${fmt(state.globalStakedAit)} AIT staked; ${fmt(state.outstanding - state.globalStakedAit)} AIT not staked`}><span style={{ width: `${aitStakedRatio}%` }} /></div>
          <div className="token-dashboard-breakdown"><div><span>Staked</span><strong>{fmt(state.globalStakedAit)} AIT</strong></div><div><span>Not staked</span><strong>{fmt(state.outstanding - state.globalStakedAit)} AIT</strong></div><div><span>Cap room</span><strong>{fmt(CAP - state.outstanding)} AIT</strong></div></div>
          <div className="token-daily-head"><span>Daily change · AIT staked</span><strong className={state.aitDailyDelta >= 0 ? "up" : "down"}>{fmtChange(state.aitDailyDelta)} AIT today</strong></div>
          <DailyChangeChart changes={[...AIT_DAILY_CHANGES, state.aitDailyDelta]} unit="AIT" />
        </article>
      </div>
    </section>

    {walletAction && <div className="token-wallet-backdrop"><section className="panel token-wallet-dialog" role="dialog" aria-modal="true" aria-labelledby="token-wallet-title">
      <h2 id="token-wallet-title">Confirm in wallet</h2>
      <p>{walletAction === "Withdraw" ? `${fmt(state.pendingMax)} MAX · Withdraw` : walletAction === "Mint" ? `${fmt(mint)} AIT · ${stakeAfterMint ? "Mint & stake" : "Mint"}` : walletAction === "Stake" ? `${fmt(stake)} AIT · Stake` : `${fmt(burn)} AIT · ${walletAction === "Burn" ? "Burn" : "Unstake"}`}</p>
      <div className="token-review-actions"><button className="secondary-button" onClick={() => setWalletAction(null)}>Cancel</button><button className="primary-button" onClick={confirmWalletAction}>Confirm</button></div>
    </section></div>}
    {buyTarget && <div className="token-wallet-backdrop"><section className="panel token-wallet-dialog" role="dialog" aria-modal="true" aria-labelledby="token-buy-title"><h2 id="token-buy-title">Buy {buyTarget}</h2><p>USDC → {buyTarget}</p><label className="token-buy-input">{buyTarget} received<input type="number" min="0" step="any" value={buyAmount} onChange={(event) => setBuyAmount(event.target.value)} /></label><div className="token-review-actions"><button className="secondary-button" onClick={() => setBuyTarget(null)}>Cancel</button><button className="primary-button" disabled={!Number.isFinite(Number(buyAmount)) || Number(buyAmount) <= 0} onClick={simulateBuy}>Add to preview</button></div></section></div>}
  </main>;
}

export function ProviderMarketPage({ onModelPricing }) {
  const [profileId, setProfileId] = useState(providerProfiles[0].id);
  const [comparisonModel, setComparisonModel] = useState(providerOfferings.find((offering) => offering.admitted).model);
  const [showAllModels, setShowAllModels] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const profile = providerProfiles.find((provider) => provider.id === profileId);
  const profileOfferings = providerOfferings.filter((offering) => offering.provider === profile.name);
  const comparedOfferings = providerOfferings.filter((offering) => offering.model === comparisonModel);
  return <main className="content-page token-page">
    <div className="page-heading"><div><span className="eyebrow">Simulated provider data</span><h1>Providers</h1></div><button className="secondary-button compact" onClick={() => setShowApply(!showApply)}>{showApply ? "Close" : "Become a provider"}</button></div>
    {showApply && <section className="panel token-provider-apply"><h2>Join Maxshot</h2><p>Apply → verify ownership, models, pricing and policy → admission test → routing.</p><small>Application submission is not available in this prototype.</small></section>}
      <section className="panel token-provider-profiles"><div className="panel-heading"><div><h2>Provider profiles</h2></div></div>
        <div className="token-provider-grid" role="group" aria-label="Choose provider">{providerProfiles.map((provider) => <button key={provider.id} className={`token-provider-card ${profileId === provider.id ? "active" : ""}`} aria-pressed={profileId === provider.id} onClick={() => { setProfileId(provider.id); setShowAllModels(false); }}><span className="token-provider-avatar">{provider.initials}</span><strong>{provider.name}</strong><small>{provider.type}</small></button>)}</div>
        <div className="token-provider-detail"><div className="token-provider-detail-head"><span className="token-provider-avatar large">{profile.initials}</span><div><span className="eyebrow">Provider profile · simulated</span><h3>{profile.name}</h3><p>{profile.summary}</p></div></div><div className="token-provider-facts"><div><span>Route type</span><strong>{profile.type}</strong></div><div><span>Offerings</span><strong>{profileOfferings.length}</strong></div><div><span>Focus</span><strong>{profile.focus}</strong></div></div><div className="token-provider-catalog"><div><h4>Models</h4></div>{(showAllModels ? profileOfferings : profileOfferings.slice(0, 5)).map((offering) => <button className="token-provider-model" key={offering.model} onClick={() => onModelPricing(offering.model)}><strong>{offering.model}</strong><small>{offering.available ? "Available" : offering.admitted ? "Unavailable" : "Admission pending"} · {offering.capabilities.join(" / ")}</small></button>)}{profileOfferings.length > 5 && <button className="unified-text-button token-show-models" onClick={() => setShowAllModels(!showAllModels)}>{showAllModels ? "Show fewer" : `Show all ${profileOfferings.length}`}</button>}</div></div>
      </section>
      <section className="panel token-provider-compare"><div className="panel-heading"><div><h2>Offering details</h2></div><label>Model / version<select value={comparisonModel} onChange={(event) => setComparisonModel(event.target.value)}>{[...new Set(providerOfferings.map((offering) => offering.model))].map((model) => <option key={model} value={model}>{model}</option>)}</select></label></div><div className="token-offering-grid">{comparedOfferings.map((offering) => <article key={offering.provider} className="token-offering-card"><div className="token-offering-head"><div><span className="eyebrow">{offering.provider}</span><h3>{offering.variant}</h3></div><span className={`token-offering-status ${offering.available ? "" : "pending"}`}>{offering.available ? "Available" : offering.admitted ? `Unavailable${offering.unavailableReason ? ` · ${offering.unavailableReason}` : ""}` : "Admission pending"}</span></div><div className="token-offering-field"><span>Admission</span><strong>{offering.admitted ? "Passed" : "Pending"}</strong></div><div className="token-offering-field"><span>Capabilities</span><div className="token-offering-tags">{offering.capabilities.map((capability) => <span key={capability}>{capability}</span>)}</div></div><div className="token-offering-field"><span>Limits</span><strong>{offering.limits}</strong></div><div className="token-offering-field"><span>Region / data policy</span><strong>{offering.policy}</strong></div><div className="token-offering-performance"><span>Observed · {offering.window || "simulated"}</span>{offering.success ? <div className="token-offering-stats"><div><strong>{offering.success}</strong><small>Delivered · {offering.attempts} attempts</small></div><div><strong>{offering.p50} / {offering.p95}</strong><small>{offering.latencyType} p50 / p95 · {offering.latencySamples} samples</small></div></div> : <strong>{offering.admitted ? `Insufficient data · ${offering.attempts} attempts` : "No observed sample"}</strong>}</div></article>)}</div></section>
      <details className="token-provider-later"><summary>Provider tokens · later phase</summary><p>Qualified participation requires approved rights, transfer policy, security and liquidity design.</p></details>
  </main>;
}
