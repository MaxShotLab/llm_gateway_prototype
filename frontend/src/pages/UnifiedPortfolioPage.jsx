import { ArrowRight, ChartPieSlice, Coins, Wallet } from "@phosphor-icons/react";
import "./unified-portfolio.css";

export const prototypeWallet = "0x7A42...8E21";

const exampleVaults = [
  { name: "USDC Vault", asset: "USDC", chain: "Base", apy7d: "5.8%", apy30d: "5.5%", deposited: "$8,250" },
  { name: "ETH Vault", asset: "ETH", chain: "Ethereum", apy7d: "3.9%", apy30d: "4.2%", deposited: "$4,230" },
];

export function PortfolioPage({ billing, tokenState, onNavigate }) {
  const subscription = billing.subscription;
  return <main className="content-page unified-page">
    <div className="page-heading"><div><span className="eyebrow">One account · one linked wallet</span><h1>Portfolio</h1><p>Your Gateway balance, Vault deposits, and MAX/AIT position in one place.</p></div><span className="unified-wallet"><Wallet size={15} /> {prototypeWallet}</span></div>
    <p className="unified-demo-note">Illustrative account and Vault figures. Token actions on this prototype are simulated.</p>
    <div className="unified-summary-grid">
      <article className="panel"><span>Vault deposits</span><strong>$12,480</strong><small>Example portfolio · 2 vaults</small></article>
      <article className="panel"><span>Gateway Dollar balance</span><strong>${(billing.balances.dollarCents / 100).toFixed(2)}</strong><small>{subscription ? `${subscription.name} subscription active` : "PAYG account"}</small></article>
      <article className="panel"><span>MAX locked</span><strong>{tokenState.collateral.toLocaleString()} <em>MAX</em></strong><small>{tokenState.debt.toLocaleString()} AIT active debt</small></article>
      <article className="panel"><span>AIT staked</span><strong>{tokenState.stakedAit.toLocaleString()} <em>AIT</em></strong><small>Earned Credit grants post separately</small></article>
    </div>
    <div className="unified-section-grid">
      <section className="panel unified-section"><div className="unified-section-icon"><ChartPieSlice size={22} /></div><span className="eyebrow">Earn · Vaults</span><h2>Vault deposits</h2><p>Review the same vault strategies and deposit activity under your linked wallet. Vault revenue funds market AIT purchases for a manual Merkle-tree distribution every two weeks.</p><div className="unified-stat-row"><span>7-day weighted APY</span><strong>5.2% <small>example</small></strong></div><div className="unified-stat-row"><span>30-day weighted APY</span><strong>5.0% <small>example</small></strong></div><button className="secondary-button compact" onClick={() => onNavigate("vaults")}>Open Vaults <ArrowRight size={14} /></button></section>
      <section className="panel unified-section"><div className="unified-section-icon"><Coins size={22} /></div><span className="eyebrow">MAX & AIT</span><h2>Token position</h2><p>One merged, non-transferable MAX/AIT position. Minting, burning, withdrawal, and AIT staking stay in the MAX & AIT portal.</p><div className="unified-stat-row"><span>Pending MAX redemption</span><strong>{tokenState.pendingMax.toLocaleString()} MAX</strong></div><div className="unified-stat-row"><span>AIT in wallet</span><strong>{tokenState.walletAit.toLocaleString()} AIT</strong></div><button className="secondary-button compact" onClick={() => onNavigate("tokens")}>Open MAX & AIT <ArrowRight size={14} /></button></section>
      <section className="panel unified-section"><div className="unified-section-icon"><Wallet size={22} /></div><span className="eyebrow">Spend · Gateway</span><h2>Credits & subscription</h2><p>Review subscription allowances, PAYG funds, and off-chain Earned Credit in the Gateway account. Eligible AIT Earned Credit spends before subscription allowance.</p><div className="unified-stat-row"><span>Subscription</span><strong>{subscription ? subscription.name : "None"}</strong></div><div className="unified-stat-row"><span>Earned Credit</span><strong>Program not active</strong></div><button className="secondary-button compact" onClick={() => onNavigate("topup")}>Open Credits <ArrowRight size={14} /></button></section>
      <section className="panel unified-section"><div className="unified-section-icon"><ArrowRight size={22} /></div><span className="eyebrow">Share · Referrals</span><h2>Two referral programs</h2><p>Invite Gateway users to paid compute or invite Vault depositors. Each program keeps its own link, attribution, and rewards.</p><button className="secondary-button compact" onClick={() => onNavigate("referral")}>Open Referrals <ArrowRight size={14} /></button></section>
    </div>
  </main>;
}

export function VaultsPage({ onPortfolio }) {
  return <main className="content-page unified-page">
    <div className="page-heading"><div><span className="eyebrow">Existing Vault product · Gateway account</span><h1>Vaults</h1><p>Explore vault strategies and review deposits from your single linked wallet.</p></div><span className="unified-wallet"><Wallet size={15} /> {prototypeWallet}</span></div>
    <p className="unified-demo-note">This screen represents the existing Vaults module inside the unified Gateway shell. Vault figures below are layout examples; deposit, withdrawal, and claim transactions are not simulated.</p>
    <div className="unified-summary-grid"><article className="panel"><span>My deposits</span><strong>$12,480</strong><small>Example linked-wallet balance</small></article><article className="panel"><span>7-day APY</span><strong>5.2%</strong><small>Example weighted annualized yield</small></article><article className="panel"><span>30-day APY</span><strong>5.0%</strong><small>Example weighted annualized yield</small></article><article className="panel"><span>AIT earned</span><strong>18.6 <em>AIT</em></strong><small>Example distributed amount</small></article></div>
    <section className="panel unified-vault-note"><div><h2>Vault-funded AIT</h2><p>Vault revenue is used to buy AIT on the market. Operations prepare a Merkle tree and distribute purchased AIT to depositors every two weeks. This does not mint new AIT or alter a depositor's MAX/AIT position.</p></div><button className="secondary-button compact" onClick={onPortfolio}>View Portfolio <ArrowRight size={14} /></button></section>
    <section className="panel unified-vault-list"><div className="panel-heading"><div><h2>Vaults</h2><p>Sample vault cards for the unified layout. The existing Vault transaction flow remains the implementation reference.</p></div></div><div className="unified-vault-grid">{exampleVaults.map((vault) => <article key={vault.name}><div><span className="unified-vault-asset">{vault.asset.slice(0, 1)}</span><span><strong>{vault.name}</strong><small>{vault.chain} · {vault.asset}</small></span></div><dl><dt>7-day APY</dt><dd>{vault.apy7d}</dd><dt>30-day APY</dt><dd>{vault.apy30d}</dd><dt>My deposit</dt><dd>{vault.deposited}</dd></dl></article>)}</div></section>
  </main>;
}
