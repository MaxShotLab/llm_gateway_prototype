import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Brain,
  CaretDown,
  ChatsCircle,
  ChartPieSlice,
  Check,
  Code,
  Coins,
  Copy,
  DotsThree,
  Gauge,
  Globe,
  GithubLogo,
  Key,
  Lightning,
  MagnifyingGlass,
  MagicWand,
  PaperPlaneRight,
  Plus,
  PuzzlePiece,
  Robot,
  Moon,
  ShareNetwork,
  Sparkle,
  Sun,
  Trash,
  UploadSimple,
  UserCircle,
  Wallet,
  Wrench,
  X,
} from "@phosphor-icons/react";
import { ChatPage } from "./pages/ChatPage";
import { ApiPage } from "./pages/ApiPage";
import { FundingPage } from "./pages/FundingPage";
import { TokenomicsPage, ProviderMarketPage, initialTokenState } from "./pages/TokenomicsPage";
import { PortfolioPage, VaultsPage, prototypeWallet } from "./pages/UnifiedPortfolioPage";
import { StudioPage, platformWorks } from "./pages/StudioPage";
import { SharedWorkPage, StartersPage } from "./pages/GrowthPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { createBillingScenario, getBillingTotals, getSubscriptionWindows } from "./data/billingData";
import { sampleCreditsPerUsd, sampleOfferingLabel } from "./data/sampleRequest";

const phaseOneNavItems = [
  { id: "portfolio", label: "Portfolio", Icon: ChartPieSlice },
  { id: "chat", label: "Chat", Icon: ChatsCircle },
  { id: "studio", label: "Studio", Icon: MagicWand },
  { id: "topup", label: "Credits", Icon: Wallet },
  { id: "tokens", label: "Tokens", Icon: Coins },
  { id: "providers", label: "Providers", Icon: Globe },
  { id: "vaults", label: "Vaults", Icon: Wallet },
  { id: "referral", label: "Referrals", Icon: ShareNetwork },
];

function publicWork(work) {
  const creator = work.id.startsWith("discover-") ? "Maxshot demo" : work.creator;
  if (work.mode !== "result") return { ...work, creator };
  return { id: work.id, kind: work.kind, title: "Shared work", creator, art: work.art, status: "Generated", mode: "result" };
}

const protectedPageCopy = {
  usage: {
    label: "Usage",
    description: "Usage records and Credit balances are tied to your account.",
  },
  api: {
    label: "API",
    description: "Create keys, set limits, and review request logs after signing in.",
  },
  topup: {
    label: "Credits",
    description: "Top-ups, payment methods, receipts, and credit balances require an account.",
  },
  portfolio: {
    label: "Portfolio",
    description: "Your Vault deposits, token position, and Gateway account require login.",
  },
  tokens: {
    label: "Tokens",
    description: "Wallet positions, staking, and Earned Credit require an account.",
  },
  providers: {
    label: "Providers",
    description: "Provider discovery and applications require an account.",
  },
  referral: {
    label: "Referral",
    description: "Referral links and rewards are generated for registered users.",
  },
  settings: {
    label: "Profile",
    description: "Profile and account settings are available after login.",
  },
  agents: {
    label: "Agents",
    description: "Agents are an experimental workspace feature.",
  },
  toolkits: {
    label: "Toolkits",
    description: "Toolkits are an experimental workspace feature.",
  },
};

const mockUsage = [
  {
    time: "Jun 11, 11:32",
    source: "Chat",
    model: "MiniMax-M3",
    provider: "OpenRouter",
    input: "2,481",
    output: "3,147",
    subscriptionCost: 5_628,
    subscriptionBucket: "Basic Chat",
    paygCreditCost: 0,
    dollarDebitMicros: 0,
    funding: "Subscription (Phase 2)",
    status: "Charged",
  },
  {
    time: "Jun 11, 09:18",
    source: "API",
    model: "GPT-5 mini",
    provider: "OpenRouter",
    input: "1,907",
    output: "2,642",
    subscriptionCost: 4_549,
    subscriptionBucket: "Premium",
    paygCreditCost: 0,
    dollarDebitMicros: 0,
    funding: "Subscription (Phase 2)",
    status: "Charged",
  },
  {
    time: "Jun 10, 17:44",
    source: "Chat",
    model: "Claude Sonnet 4.6",
    provider: "Provider B",
    input: "4,221",
    output: "9,885",
    subscriptionCost: 10_000,
    subscriptionBucket: "Premium",
    paygCreditCost: 4_106,
    dollarDebitMicros: 4_106,
    funding: "Dollar balance",
    status: "Charged",
  },
  {
    time: "Jun 10, 15:22",
    source: "Studio",
    model: "Image model",
    provider: "OpenRouter",
    input: "—",
    output: "1 image",
    subscriptionCost: 120_000,
    subscriptionBucket: "Premium",
    paygCreditCost: 0,
    dollarDebitMicros: 0,
    funding: "Premium Credits",
    status: "Charged",
  },
  {
    time: "Jun 10, 14:55",
    source: "Studio",
    model: "Video model",
    provider: "—",
    input: "—",
    output: "8 sec",
    subscriptionCost: 0,
    subscriptionReserved: 800_000,
    subscriptionBucket: "Premium",
    paygCreditCost: 0,
    dollarDebitMicros: 0,
    funding: "Premium Credits",
    status: "Pending",
  },
  {
    time: "Jun 10, 14:22",
    source: "Studio",
    model: "Video model",
    provider: "—",
    input: "—",
    output: "—",
    subscriptionCost: 0,
    subscriptionBucket: "Premium",
    paygCreditCost: 0,
    dollarDebitMicros: 0,
    funding: "No charge",
    status: "Failed",
  },
  {
    time: "Jun 10, 14:06",
    source: "API",
    model: "Gemini 3.1 Pro",
    provider: "OpenRouter",
    input: "2,814",
    output: "4,023",
    subscriptionCost: 0,
    paygCreditCost: 6_837,
    dollarDebitMicros: 0,
    funding: "Free Credits",
    status: "Charged",
  },
  {
    time: "Jun 09, 20:51",
    source: "Chat",
    model: "DeepSeek V4 Flash",
    provider: "OpenRouter",
    input: "1,102",
    output: "1,398",
    subscriptionCost: 0,
    paygCreditCost: 0,
    dollarDebitMicros: 0,
    funding: "Free model",
    status: "Free",
  },
].map((row, index) => ({
  ...row,
  // TD-46: every accepted request carries a stable request ID; API rows carry the key used (TD-44).
  requestId: `req_demo${String(index + 1).padStart(3, "0")}`,
  keyId: row.source === "API" ? (index === 1 ? "key-production" : "key-development") : null,
  keyName: row.source === "API" ? (index === 1 ? "Production API" : "Development") : null,
}));

const dashboardChartData = {
  "7 days": [38, 52, 44, 68, 59, 74, 63],
  "30 days": [42, 58, 35, 66, 52, 76, 61, 84, 70, 90, 63, 78, 55, 86],
  All: [28, 34, 41, 36, 52, 48, 63, 58, 71, 66, 80, 74, 86, 79, 92, 88, 76, 83],
};

const referralConfig = {
  rewardRate: 1,
  capDollars: 50,
  code: "ms-demo-referral",
  link: "https://gateway.maxshot.ai/?ref=ms-demo-referral",
};

const referralTopUps = [
  {
    id: "ref-1042",
    user: "alex@builder.dev",
    joined: "Jun 12, 2026",
    topUpCents: 10_000,
    status: "Credited",
  },
  {
    id: "ref-1037",
    user: "mia@studio.ai",
    joined: "Jun 10, 2026",
    topUpCents: 25_000,
    status: "Pending",
  },
  {
    id: "ref-1031",
    user: "kai@agent.dev",
    joined: "Jun 8, 2026",
    topUpCents: 3_000,
    status: "Needs attention",
  },
];

const partnerReferrals = [
  { name: "Hyperliquid", type: "Perps DEX", logo: "/hyperliquid.png", connected: true, discount: "4% fee discount", earned: "12.4 AIT", href: "https://app.hyperliquid.xyz/join/MAXSHOT", eligibility: ["Rewards apply to the first $1B in lifetime volume per referee.", "At least one transaction on Hyperliquid activates the referral."] },
  { name: "Polymarket", type: "Prediction market", logo: "/polymarket.png", connected: false, discount: "0% fee discount", earned: "—", href: "https://polymarket.com/?r=MaxshotAI", eligibility: ["New Polymarket accounts only.", "Valid for the first 180 days from account creation."] },
];

const partnerRewardHistory = [
  { id: "#10", period: "Oct 9 → Oct 23, 2026", distribution: "24.00", earned: "8.2 AIT", status: "Claimable" },
  { id: "#9", period: "Sep 25 → Oct 9, 2026", distribution: "18.00", earned: "4.2 AIT", status: "Claimed" },
  { id: "#8", period: "Sep 11 → Sep 25, 2026", distribution: "0.00", earned: "—", status: "No reward" },
];

const starterMemories = [
  {
    id: 1,
    title: "Communication style",
    body: "Prefer concise answers with concrete recommendations and short examples.",
    tag: "Preference",
  },
  {
    id: 2,
    title: "Current project",
    body: "Building Maxshot, a multi-model AI gateway with crypto-native payments.",
    tag: "Project",
  },
  {
    id: 3,
    title: "Technical context",
    body: "Primary stack is TypeScript, React, PostgreSQL, and EVM-compatible contracts.",
    tag: "Profile",
  },
];

const starterPrompts = [
  {
    id: 1,
    title: "Executive brief",
    description: "Turn raw notes into a concise decision-ready update.",
    category: "Writing",
    owner: "You",
    content:
      "Create an executive brief from the following notes. Include context, key findings, risks, and recommended next steps:\n\n{{notes}}",
  },
  {
    id: 2,
    title: "API integration plan",
    description: "Produce an implementation plan with interfaces and test cases.",
    category: "Engineering",
    owner: "Maxshot",
    content:
      "Design an API integration plan for {{service}}. Cover authentication, data flow, failure modes, observability, and acceptance tests.",
  },
  {
    id: 3,
    title: "Research synthesis",
    description: "Compare sources and separate evidence from assumptions.",
    category: "Research",
    owner: "Team",
    content:
      "Synthesize the research on {{topic}}. Group findings by theme, flag contradictions, and finish with open questions.",
  },
  {
    id: 4,
    title: "Launch checklist",
    description: "Create a cross-functional release readiness checklist.",
    category: "Operations",
    owner: "Team",
    content:
      "Build a launch checklist for {{product}} across engineering, product, support, security, analytics, and communications.",
  },
];

const starterAgents = [
  {
    id: 1,
    name: "Gateway Architect",
    description: "Designs reliable multi-model routing and API integrations.",
    model: "Claude Sonnet 4.6",
    instructions:
      "Act as a senior platform architect. Prioritize explicit contracts, failure handling, observability, and pragmatic tradeoffs.",
    capabilities: ["Web search", "Code interpreter", "File search"],
    skills: ["api-design", "technical-review"],
    updated: "12 min ago",
  },
  {
    id: 2,
    name: "Research Analyst",
    description: "Finds, compares, and summarizes primary sources.",
    model: "Gemini 3.1 Pro",
    instructions:
      "Research claims using primary sources. Clearly separate source facts, synthesis, and inference.",
    capabilities: ["Web search", "File search"],
    skills: ["source-synthesis"],
    updated: "Yesterday",
  },
  {
    id: 3,
    name: "Product Writer",
    description: "Creates concise product copy in the Maxshot voice.",
    model: "GPT-5 mini",
    instructions:
      "Write direct, concrete product copy. Prefer active voice and avoid inflated claims.",
    capabilities: ["Artifacts"],
    skills: ["brand-guidelines"],
    updated: "Jun 8",
  },
];

const starterSkills = [
  {
    id: 1,
    name: "brand-guidelines",
    title: "Brand guidelines",
    description: "Use for public-facing copy that must match Maxshot terminology and tone.",
    invocation: "Always apply",
    active: true,
    tools: [],
    owner: "You",
  },
  {
    id: 2,
    name: "api-design",
    title: "API design",
    description: "Use when defining endpoints, request contracts, errors, and versioning.",
    invocation: "Model-invoked",
    active: true,
    tools: ["Code interpreter"],
    owner: "Maxshot",
  },
  {
    id: 3,
    name: "source-synthesis",
    title: "Source synthesis",
    description: "Use when comparing research and producing evidence-grounded conclusions.",
    invocation: "Manual with $",
    active: true,
    tools: ["Web search"],
    owner: "Team",
  },
  {
    id: 4,
    name: "technical-review",
    title: "Technical review",
    description: "Use for rigorous implementation and architecture reviews.",
    invocation: "Model-invoked",
    active: false,
    tools: ["Code interpreter"],
    owner: "Team",
  },
];

function AppShell({ active, onNavigate, user, onLogin, onLogout, authHint, theme, setTheme, billing, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [usageOpen, setUsageOpen] = useState(false);
  const isLight = theme === "light";
  const visibleAuthHint =
    authHint || (!user ? "Log in to unlock Usage, API, Credits, and account features." : "");
  const dollarBalanceCents = getBillingTotals(billing).dollarBalanceCents;
  const subscriptionWindows = getSubscriptionWindows(billing.subscription);

  return (
    <div className={`app-shell theme-${theme} ${collapsed ? "is-collapsed" : ""}`}>
      <aside className="sidebar">
        <button className="brand-button" onClick={() => onNavigate("chat")}>
          <img className="desktop-logo" src="/maxshot-assets/logo.svg" alt="Maxshot" />
          <img className="mobile-menu-logo" src="/maxshot-assets/menu.svg" alt="" />
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          <NavGroup
            items={phaseOneNavItems}
            active={active}
            collapsed={collapsed}
            user={user}
            onNavigate={onNavigate}
          />
        </nav>

        <button
          className="collapse-tab"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ArrowRight size={16} className={collapsed ? "" : "rotate"} />
        </button>

        <button className="language-button">EN</button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          {visibleAuthHint ? (
            <div className="auth-hint" role="status">
              {visibleAuthHint}
            </div>
          ) : (
            <span className="prototype-label">Prototype</span>
          )}

          {user ? (
            <div className="topbar-account">
              <a className="credit-pill" href="#" aria-label={`$${(dollarBalanceCents / 100).toFixed(2)} Dollar balance`} onClick={(event) => { event.preventDefault(); onNavigate("topup"); }}>
                ${(dollarBalanceCents / 100).toFixed(2)}
                <small>Dollar balance</small>
              </a>
              <div className="account-menu-wrap">
                <button
                  className="account-button"
                  aria-label={`Account: ${user}`}
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  <UserCircle size={18} />
                  <span>{user}</span>
                </button>
                {accountOpen && (
                  <div className="account-menu" role="menu">
                    <div className="account-menu-identity">
                      <UserCircle size={24} />
                      <span><strong>{user}</strong><small>{billing.subscription?.name || "PAYG"}</small></span>
                    </div>
                    {subscriptionWindows.length > 0 && (
                      <div className="account-usage-section">
                        <button
                          className="account-usage-toggle"
                          onClick={() => setUsageOpen((open) => !open)}
                          aria-expanded={usageOpen}
                          aria-controls="account-usage-details"
                        >
                          <span><Gauge size={17} /> Usage remaining</span>
                          <CaretDown className={usageOpen ? "open" : ""} size={15} />
                        </button>
                        {usageOpen && (
                          <div className="account-usage-details" id="account-usage-details">
                            <div><span>Basic Chat</span><strong>{getBillingTotals(billing).basicRemaining.toLocaleString()}</strong><small>Credits remaining</small></div>
                            <div><span>Premium</span><strong>{getBillingTotals(billing).premiumRemaining.toLocaleString()}</strong><small>Credits available</small></div>
                            {subscriptionWindows.map((window) => (
                              <div className={window.percent >= 90 ? "warning" : ""} key={window.id}>
                                <span>{window.label === "5-hour limit" ? "5 hours" : "Weekly"}</span>
                                <strong>{Math.max(100 - window.percent, 0)}%</strong>
                                <small>Resets {window.reset}</small>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <button
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false);
                        onNavigate("settings");
                      }}
                    >
                      Profile
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false);
                        onNavigate("api");
                      }}
                    >
                      Developer settings
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false);
                        onLogout();
                      }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
              <ThemeToggle isLight={isLight} onToggle={() => setTheme(isLight ? "dark" : "light")} />
            </div>
          ) : (
            <div className="topbar-account">
              <ThemeToggle isLight={isLight} onToggle={() => setTheme(isLight ? "dark" : "light")} />
              <button className="login-button" onClick={onLogin}>
                Log in
              </button>
            </div>
          )}
        </header>
        {children}
      </section>
    </div>
  );
}

function ThemeToggle({ isLight, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Dark theme" : "Light theme"}
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
      <span>{isLight ? "Dark" : "Light"}</span>
    </button>
  );
}

function NavGroup({ items, active, collapsed, user, onNavigate }) {
  return items.map((item) => {
    const locked = !user && Boolean(protectedPageCopy[item.id]);

    return (
      <button
        className={`nav-item ${active === item.id || (active === "pricing" && item.id === "providers") ? "active" : ""} ${locked ? "locked" : ""}`}
        key={item.id}
        onClick={() => onNavigate(item.id)}
        title={locked ? "Log in required" : collapsed ? item.label : undefined}
        aria-label={item.label}
        aria-disabled={locked}
        disabled={locked}
      >
        <item.Icon size={19} weight={active === item.id || (active === "pricing" && item.id === "providers") ? "duotone" : "regular"} />
        <span>{item.label}</span>
      </button>
    );
  });
}

function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("demo@maxshot.ai");
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="login-modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={25} />
        </button>
        <div className="login-content">
          <h2>{sent ? "Check your inbox" : "Log in to Maxshot"}</h2>
          <div className="gift-banner">
            <Sparkle size={17} weight="fill" />
            New User Gift: 500,000 Free Credits
          </div>
          {sent ? (
            <div className="sent-state">
              <div className="sent-icon">
                <PaperPlaneRight size={28} />
              </div>
              <p>
                We sent a sign-in link to <strong>{email}</strong>.
              </p>
              <button onClick={() => onSuccess(email)}>Open mock link</button>
              <button className="text-button" onClick={() => setSent(false)}>
                Use another email
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="email-form">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoFocus
              />
              <button className="primary-button" type="submit">
                Continue with email
                <ArrowRight size={17} />
              </button>
              <p className="terms-copy">
                By continuing, you agree to the Terms of Service and Privacy
                Policy.
              </p>
            </form>
          )}
        </div>
        <button className="language-button modal-language">EN</button>
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function DeferredNotice({ title }) {
  return (
    <section className="panel deferred-notice">
      <span>Experimental</span>
      <div>
        <h2>{title} are coming soon.</h2>
        <p>These exploratory controls are not part of the live Studio baseline.</p>
      </div>
    </section>
  );
}

function ReferralPage() {
  const [copied, setCopied] = useState("");
  const [program, setProgram] = useState("gateway");
  const [rewardStatus, setRewardStatus] = useState("All");
  const [sharePreview, setSharePreview] = useState("");
  const confirmedTopUps = referralTopUps.filter((item) => item.status === "Credited");
  const pendingTopUps = referralTopUps.filter((item) => item.status === "Pending");
  const rewardFor = (item) => Math.min(Math.floor(item.topUpCents * referralConfig.rewardRate * sampleCreditsPerUsd / 10_000), referralConfig.capDollars * sampleCreditsPerUsd);
  const confirmedTopUp = confirmedTopUps.reduce((sum, item) => sum + item.topUpCents, 0);
  const earnedRewards = confirmedTopUps.reduce((sum, item) => sum + rewardFor(item), 0);
  const pendingRewards = pendingTopUps.reduce((sum, item) => sum + rewardFor(item), 0);
  const visibleTopUps = rewardStatus === "All" ? referralTopUps : referralTopUps.filter((item) => item.status === rewardStatus);

  const copyReferralValue = (value, field) => {
    navigator.clipboard?.writeText(value);
    setCopied(field);
    window.setTimeout(() => setCopied(""), 1600);
  };

  return (
    <main className="content-page referral-page">
      <PageHeader
        title="Referrals"
      />

      <div className="billing-scope-tabs" role="tablist" aria-label="Referral program">
        <button className={program === "gateway" ? "active" : ""} onClick={() => { setProgram("gateway"); setCopied(""); }} role="tab" aria-selected={program === "gateway"}>Maxshot Referrals Program</button>
        <button className={program === "partner" ? "active" : ""} onClick={() => { setProgram("partner"); setCopied(""); }} role="tab" aria-selected={program === "partner"}>Partner Referral Program</button>
      </div>

      {program === "gateway" && <>

      <section className="referral-hero panel">
        <div>
          <h2>Invite users. Earn confirmed rewards.</h2>
          <p>Share your link. Example reward: {referralConfig.rewardRate}% of a referred user's confirmed Dollar-balance top-up, granted as promotional Credits. Final program terms are pending.</p>
          <ol className="referral-steps">
            <li><strong>1</strong><span><b>Share Invite</b><small>Send your personal link or code to friends and community.</small></span></li>
            <li><strong>2</strong><span><b>Friends Top Up</b><small>New users add Dollar balance; subscription payments do not qualify.</small></span></li>
            <li><strong>3</strong><span><b>Earn example Credits</b><small>Illustrative {referralConfig.rewardRate}% rate and {sampleCreditsPerUsd.toLocaleString()} Credits/$1 conversion; final terms are pending.</small></span></li>
          </ol>
        </div>
        <div className="referral-link-box">
          <div className="referral-link-field"><span>Your Referral Code</span><div><code>{referralConfig.code}</code><button className="secondary-button compact" onClick={() => copyReferralValue(referralConfig.code, "code")}>{copied === "code" ? <Check size={14} /> : <Copy size={14} />}{copied === "code" ? "Copied" : "Copy code"}</button></div></div>
          <div className="referral-link-field"><span>Your Referral Link</span><div><code>{referralConfig.link}</code><button className="primary-button compact" onClick={() => copyReferralValue(referralConfig.link, "link")}>{copied === "link" ? <Check size={14} /> : <Copy size={14} />}{copied === "link" ? "Copied" : "Copy link"}</button></div></div>
          <div className="referral-share-actions"><button className="secondary-button compact" onClick={() => setSharePreview("X")}>Share on X</button><button className="secondary-button compact" onClick={() => setSharePreview("Telegram")}>Telegram</button><button className="secondary-button compact" onClick={() => setSharePreview("Share")}>Share</button></div>
          {sharePreview && <p role="status" className="referral-share-preview">{sharePreview} preview: {referralConfig.link}</p>}
        </div>
      </section>

      <section className="metric-grid referral-metrics">
        <MetricCard label="Earned rewards" value={earnedRewards.toLocaleString()} note="Confirmed promotional Credits" />
        <MetricCard label="Confirmed top-up" value={`$${(confirmedTopUp / 100).toFixed(2)}`} note="Dollar balance added · USD" />
        <MetricCard label="Pending rewards" value={pendingRewards.toLocaleString()} note="Potential promotional Credits" />
        <MetricCard label="Referred accounts" value={referralTopUps.length.toLocaleString()} note="Unique attributed accounts" />
      </section>

      <section className="panel referral-table-panel">
        <div className="panel-heading">
          <div>
            <h2>Referred top-ups</h2>
          </div>
          <select aria-label="Reward status" value={rewardStatus} onChange={(event) => setRewardStatus(event.target.value)}><option>All</option><option>Credited</option><option>Pending</option><option>Needs attention</option></select>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Referee</th>
                <th>Top-up</th>
                <th>Reward</th>
                <th>Status</th>
                <th>Copy order ID</th>
              </tr>
            </thead>
            <tbody>
              {visibleTopUps.map((item) => (
                <tr key={item.id}>
                  <td>{item.joined}</td>
                  <td>{item.user}</td>
                  <td>${(item.topUpCents / 100).toFixed(2)}</td>
                  <td>{item.status === "Needs attention" ? "—" : `${rewardFor(item).toLocaleString()} Credits`}</td>
                  <td>
                    <span className={`status-pill ${item.status === "Credited" ? "success" : "neutral"}`}>
                      <i /> {item.status}
                    </span>
                  </td>
                  <td><button className="secondary-button compact" onClick={() => copyReferralValue(item.id, item.id)}>{copied === item.id ? "Copied" : "Copy"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </>}

      {program === "partner" && <>
        <div className="referral-partner-intro"><h2>Partner Referral Program</h2><p>Trade on partner platforms using Maxshot's referral link or by binding your account to earn AIT rewards.</p></div>
        <section className="panel referral-partner-summary"><div><span>Platforms Active</span><strong>2</strong></div><div><span>Distributing AIT</span><strong>12.4 <small>AIT · example</small></strong></div></section>
        <h3 className="referral-partner-heading">Active Partners</h3>
        <section className="referral-partner-grid">{partnerReferrals.map((partner) => <article className="panel" key={partner.name}>
          <header><img src={partner.logo} alt="" /><div><strong>{partner.name}</strong><small>{partner.type}</small></div><span className="referral-partner-state">{partner.connected ? "Referral Connected" : "Referral Not Connected"}</span></header>
          <div className="referral-partner-stats"><div><small>Fee Discount</small><strong>{partner.discount}</strong></div><div><small>My earned</small><strong>{partner.earned}</strong></div></div>
          <div className="referral-partner-action"><a className="secondary-button compact" href={partner.href} target="_blank" rel="noreferrer">Trade on {partner.name} ↗</a></div>
          <div className="referral-partner-eligibility"><strong>Eligibility:</strong>{partner.eligibility.map((rule) => <p key={rule}>· {rule}</p>)}</div>
        </article>)}</section>
        <section className="panel referral-table-panel"><div className="panel-heading"><div><h2>AIT Reward History</h2><p>Illustrative 14-day partner distribution cycles.</p></div></div><div className="table-scroll"><table><thead><tr><th>Id</th><th>Period</th><th>Epoch Distribution</th><th>My Earnings</th><th>Status</th></tr></thead><tbody>{partnerRewardHistory.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.period}</td><td>{item.distribution}</td><td>{item.earned}</td><td><span className={`status-pill ${item.status === "Claimable" ? "success" : "neutral"}`}><i /> {item.status}</span></td></tr>)}</tbody></table></div></section>
      </>}
    </main>
  );
}

function UsagePage({ billing, sampleUsage, embedded = false }) {
  const periods = ["7 days", "30 days", "All"];
  const [activePeriod, setActivePeriod] = useState("30 days");
  const chartData = dashboardChartData[activePeriod];
  const totals = getBillingTotals(billing);
  const windows = getSubscriptionWindows(billing.subscription);
  const [selectedBillingView, setBillingView] = useState(billing.subscription ? "subscription" : "payg");
  const billingView = billing.subscription ? selectedBillingView : "payg";
  const [usageTypes, setUsageTypes] = useState({ Chat: true, Studio: true, API: true });
  const [requestQuery, setRequestQuery] = useState("");
  const [keyFilter, setKeyFilter] = useState("all");
  const usageKeys = mockUsage.filter((row, index, rows) => row.keyId && rows.findIndex((item) => item.keyId === row.keyId) === index);
  const visibleUsage = mockUsage.filter((row) =>
    usageTypes[row.source] &&
    (!requestQuery.trim() || row.requestId.includes(requestQuery.trim().toLowerCase())) &&
    (keyFilter === "all" || row.keyId === keyFilter) && (
      billingView === "subscription"
        ? row.subscriptionCost > 0 || row.subscriptionReserved > 0 || row.status === "Failed" && row.source === "Studio"
        : row.paygCreditCost > 0 || row.funding === "Free model"
    ),
  );

  const Shell = embedded ? "div" : "main";
  return (
    <Shell className={embedded ? "dashboard-page embedded-usage" : "content-page dashboard-page"}>
      {!embedded && <PageHeader title="Usage" />}

      <div className="billing-scope-tabs" role="tablist" aria-label="Usage billing source">
        {billing.subscription && <button className={billingView === "subscription" ? "active" : ""} onClick={() => setBillingView("subscription")} role="tab" aria-selected={billingView === "subscription"}>Subscription</button>}
        <button className={billingView === "payg" ? "active" : ""} onClick={() => setBillingView("payg")} role="tab" aria-selected={billingView === "payg"}>PAYG</button>
      </div>

      {billingView === "subscription" ? (
        <>
          <section className="metric-grid subscription-usage-metrics">
            <MetricCard label="Basic Chat" value={totals.basicRemaining.toLocaleString()} note="Credits remaining · Basic-labeled Chat and API text" />
            <MetricCard label="Premium" value={totals.premiumRemaining.toLocaleString()} note={`${(billing.subscription?.premiumReserved || 0).toLocaleString()} reserved · Chat, API, Studio`} />
            {windows.map((window) => (
              <MetricCard key={window.id} label={window.label} value={`${window.percent}% used`} note={`Resets ${window.reset}`} />
            ))}
          </section>
          {windows.some((window) => window.percent >= 90) && (
            <div className="usage-limit-alert" role="status">A text usage window is above 90%. PAYG funding takes over when the limit is reached.</div>
          )}
          {totals.basicPercent >= 90 && <div className="usage-limit-alert" role="status">Basic Chat Credits {totals.basicPercent === 100 ? "are exhausted" : `are ${totals.basicPercent}% used`}. Eligible Chat and API text use {totals.premiumRemaining > 0 && totals.textWindowRemaining > 0 ? "Premium Credits" : "PAYG funding"} next.</div>}
          {totals.premiumPercent >= 90 && <div className="usage-limit-alert" role="status">Premium Credits {totals.premiumPercent === 100 ? "are exhausted" : `are ${totals.premiumPercent}% used, including reservations`}. PAYG funds eligible overage.</div>}
        </>
      ) : (
        <section className="metric-grid payg-usage-metrics">
          <MetricCard label="Dollar balance" value={`$${(totals.dollarBalanceCents / 100).toFixed(2)}`} note="Available for usage or renewal" />
          <MetricCard label="Promotional credits" value={totals.promotionalCredits.toLocaleString()} note="Free and referral Credits" />
          <MetricCard label="Free credits" value={billing.balances.free.toLocaleString()} note="Registered-user grant" />
          <MetricCard label="Referral rewards" value={billing.balances.referral.toLocaleString()} note="Promotional Credits" />
        </section>
      )}

      <section className="panel usage-chart-panel">
        <div className="panel-heading">
          <div>
            <h2>{billingView === "subscription" ? "Subscription usage" : "PAYG usage"}</h2>
            <p>Chat, Studio, and API usage are metered by funding source. Studio examples are simulated.</p>
          </div>
          <div className="period-tabs" aria-label="Usage period">
            {Object.keys(usageTypes).map((type) => (
              <button
                key={type}
                className={usageTypes[type] ? "active" : ""}
                onClick={() => setUsageTypes((current) => ({ ...current, [type]: !current[type] }))}
                aria-pressed={usageTypes[type]}
              >
                {type}
              </button>
            ))}
            {periods.map((period) => (
              <button
                key={period}
                className={period === activePeriod ? "active" : ""}
                onClick={() => setActivePeriod(period)}
                aria-pressed={period === activePeriod}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="legend">
            <span>
              <i className="legend-dot chat-dot" /> Chat
            </span>
            <span>
              <i className="legend-dot api-dot" /> API
            </span>
            {billingView === "subscription" && <span><i className="legend-dot studio-dot" /> Studio</span>}
          </div>
        </div>
        <div className="chart" aria-label={`Mock ${activePeriod} usage chart`}>
          {chartData.map(
            (height, index) => (
              <div className="bar-column" key={index}>
                {usageTypes.API && <span
                  className="chart-bar api-bar"
                  style={{ height: `${height * 0.45}%` }}
                />}
                {billingView === "subscription" && usageTypes.Studio && <span className="chart-bar studio-bar" style={{ height: `${height * 0.26}%` }} />}
                {usageTypes.Chat && <span
                  className="chart-bar chat-bar"
                  style={{ height: `${height}%` }}
                />}
              </div>
            ),
          )}
        </div>
      </section>

      {sampleUsage && <section className="panel sample-usage-detail" aria-label="Illustrative request detail">
        <div className="panel-heading"><div><h2>Latest simulated request</h2><p>{sampleUsage.time} · Chat · {sampleUsage.model} · no provider call or balance change</p></div></div>
        <div className="sample-usage-grid">
          <div><small>Request ID</small><strong><code>{sampleUsage.requestId}</code></strong><span>{sampleUsage.pinned ? "Provider pinned · no fallback" : "Auto provider selection"}</span></div>
          <div><small>Selected offering</small><strong>{sampleOfferingLabel(sampleUsage.selected)}</strong><span>Rate {sampleUsage.selected.customerRateCard.rateCardVersion}</span></div>
          <div><small>Serving offering</small><strong>{sampleOfferingLabel(sampleUsage.serving)}</strong><span>Rate {sampleUsage.serving.customerRateCard.rateCardVersion} · {sampleUsage.fallbackReason || "no fallback"}</span></div>
          <div><small>Verified billable units</small><strong>{sampleUsage.units.input.toLocaleString()} input · {sampleUsage.units.output.toLocaleString()} output tokens</strong><span>{sampleCreditsPerUsd.toLocaleString()} Credits = $1</span></div>
          <div><small>Authorization</small><strong>Estimate {sampleUsage.estimate.toLocaleString()} · maximum {sampleUsage.maximum.toLocaleString()} Credits</strong><span>Bound 1,000 input / 800 output tokens; reserved {sampleUsage.reserved.earned.toLocaleString()} hypothetical AIT Earned Credit + {sampleUsage.reserved.subscription.toLocaleString()} Premium</span></div>
          <div><small>Settled once</small><strong>{sampleUsage.charge.toLocaleString()} Credits final charge</strong><span>Used {sampleUsage.used.earned.toLocaleString()} AIT Earned Credit + {sampleUsage.used.subscription.toLocaleString()} Premium</span></div>
          <div><small>Unused hold released</small><strong>{(sampleUsage.released.earned + sampleUsage.released.subscription).toLocaleString()} Credits</strong><span>{sampleUsage.released.earned.toLocaleString()} to original AIT Earned Credit grant/expiry + {sampleUsage.released.subscription.toLocaleString()} to Premium</span></div>
        </div>
        <p>Illustrative funded-term scenario. The account above has no active AIT Earned Credit term; this record does not update its balances.</p>
      </section>}

      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent activity</h2>
            <p>Example text and generation records. Pending rows hold their maximum until settlement; an unresolved media hold releases automatically 24 hours after dispatch.</p>
          </div>
          <div className="usage-record-filters">
            <input type="search" value={requestQuery} onChange={(event) => setRequestQuery(event.target.value)} placeholder="Search request ID" aria-label="Search by request ID" />
            <select value={keyFilter} onChange={(event) => setKeyFilter(event.target.value)} aria-label="Filter by API key">
              <option value="all">All sources and keys</option>
              {usageKeys.map((row) => <option key={row.keyId} value={row.keyId}>API key: {row.keyName} ({row.keyId})</option>)}
            </select>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Request ID</th>
                <th>Source</th>
                <th>Model</th>
                <th>Serving provider</th>
                <th>Input</th>
                <th>Output / units</th>
                <th>Credit cost</th>
                <th>Dollar debit</th>
                <th>Funding source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsage.length === 0 && <tr><td colSpan={11} className="empty-row">No records match this request ID or key.</td></tr>}
              {visibleUsage.map((row) => {
                const viewCost = billingView === "subscription" ? row.subscriptionCost : row.paygCreditCost;
                const dollarDebitMicros = billingView === "subscription" ? 0 : row.dollarDebitMicros;
                const funding = billingView === "subscription" ? row.status === "Failed" ? "No charge" : `${row.subscriptionBucket} Credits` : row.funding;
                return (
                <tr key={`${billingView}-${row.time}-${row.model}`}>
                  <td>{row.time}</td>
                  <td><code>{row.requestId}</code></td>
                  <td>{row.source}{row.keyId ? <small className="usage-key-name">{row.keyName} · {row.keyId}</small> : null}</td>
                  <td>{row.model}</td>
                  <td>{row.provider}</td>
                  <td>{row.input}</td>
                  <td>{row.output}</td>
                  <td>{row.status === "Pending" && row.subscriptionReserved ? `${row.subscriptionReserved.toLocaleString()} held` : viewCost.toLocaleString()}</td>
                  <td>${(dollarDebitMicros / 1_000_000).toFixed(6)}</td>
                  <td>{funding}</td>
                  <td>
                    <span className={`status-pill ${row.status === "Failed" ? "failed" : row.status === "Free" || row.status === "Pending" ? "neutral" : "success"}`}>
                      <i /> {row.status}
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </section>
    </Shell>
  );
}

function SettingsPage({ user, onLogout, initialView = "account" }) {
  const [retention, setRetention] = useState("Permanent");
  const [developerMode, setDeveloperMode] = useState(false);
  const [profileView, setProfileView] = useState(initialView);

  return (
    <main className="content-page settings-page">
      <PageHeader title="Profile" />
      <div className="billing-scope-tabs" role="tablist" aria-label="Profile sections">
        <button className={profileView === "account" ? "active" : ""} onClick={() => setProfileView("account")} role="tab" aria-selected={profileView === "account"}>Account</button>
        <button className={profileView === "developer" ? "active" : ""} onClick={() => setProfileView("developer")} role="tab" aria-selected={profileView === "developer"}>Developer settings</button>
      </div>
      {profileView === "account" && <>
      <section className="panel settings-panel">
        <div className="panel-heading">
          <div>
            <h2>Account</h2>
            <p>Profile and account display settings.</p>
          </div>
        </div>
        <div className="settings-grid">
          <label>
            Display name
            <input defaultValue={user ? user.split("@")[0] : "Maxshot user"} />
          </label>
        </div>
        <div className="profile-actions">
          <button className="secondary-button compact">Save account</button>
        </div>
      </section>
      <section className="panel settings-panel profile-section">
        <div className="panel-heading">
          <div>
            <h2>Login methods</h2>
          </div>
        </div>
        <div className="profile-method-list">
          <div><span><UserCircle size={20} /><b>Google</b><small>{user || "demo@maxshot.ai"}</small></span><em>Connected</em></div>
          <div><span><GithubLogo size={20} /><b>GitHub</b><small>Not linked</small></span><button className="secondary-button compact">Bind</button></div>
          <div><span><Wallet size={20} /><b>Linked wallet</b><small>{prototypeWallet} · used for Vaults and AIT staking</small></span><em>One wallet per account</em></div>
        </div>
      </section>
      <section className="panel settings-panel profile-section">
        <div className="panel-heading">
          <div>
            <h2>Advanced</h2>
          </div>
        </div>
        <div className="profile-advanced-row">
          <div><b>Chat history retention</b><small>Choose how long saved conversations are retained.</small></div>
          <div className="period-tabs">
            {["Permanent", "90 days", "30 days"].map((option) => (
              <button key={option} className={retention === option ? "active" : ""} onClick={() => setRetention(option)}>{option}</button>
            ))}
          </div>
        </div>
        <div className="profile-advanced-row">
          <div><b>Developer mode</b><small>Show LLM parameter controls in Chat.</small></div>
          <button className={`switch ${developerMode ? "on" : ""}`} onClick={() => setDeveloperMode((value) => !value)} aria-pressed={developerMode}><span /></button>
        </div>
      </section>
      <section className="panel settings-panel profile-section">
        <div className="panel-heading"><div><h2>Session &amp; security</h2></div></div>
        <div className="profile-advanced-row">
          <div><b>Log out</b><small>End your active session on this device.</small></div>
          <button className="secondary-button compact" onClick={onLogout}>Log out</button>
        </div>
      </section>
      </>}
      {profileView === "developer" && <ApiPage embedded />}
    </main>
  );
}

function MetricCard({ label, value, note }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function SearchField({ value, onChange, placeholder }) {
  return (
    <label className="search-field">
      <MagnifyingGlass size={17} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function FeatureModal({ title, description, onClose, children, footer }) {
  return (
    <div className="modal-backdrop feature-backdrop" role="presentation">
      <section className="feature-modal" role="dialog" aria-modal="true">
        <header>
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button className="modal-close inline-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>
        <div className="feature-modal-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </section>
    </div>
  );
}

function PromptsPage({ onUsePrompt, embedded = false }) {
  const [prompts] = useState(starterPrompts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const Shell = embedded ? "section" : "main";

  const filtered = prompts.filter((prompt) => {
    const matchesQuery = `${prompt.title} ${prompt.description}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (category === "All" || prompt.category === category);
  });

  return (
    <Shell className={embedded ? "toolkit-panel feature-page" : "content-page feature-page"}>
      {!embedded ? (
        <PageHeader title="Prompts" />
      ) : (
        <div className="toolkit-panel-heading">
          <div>
            <h2>Prompts</h2>
            <p>Saved templates that can start a Chat request.</p>
          </div>
        </div>
      )}
      <div className="feature-toolbar">
        <SearchField value={query} onChange={setQuery} placeholder="Search prompts" />
        <div className="filter-tabs">
          {["All", "Writing", "Engineering", "Research", "Operations"].map((item) => (
            <button
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <section className="feature-card-grid">
        {filtered.map((prompt) => (
          <article className="feature-card prompt-card" key={prompt.id}>
            <div className="feature-card-top">
              <span className="feature-icon"><MagicWand size={20} /></span>
              <span className="card-kicker">{prompt.category}</span>
            </div>
            <h2>{prompt.title}</h2>
            <div className="prompt-preview">{prompt.content}</div>
            <footer>
              <button className="secondary-button compact" onClick={() => onUsePrompt(prompt.content)}>
                Use in Chat <ArrowRight size={15} />
              </button>
            </footer>
          </article>
        ))}
      </section>
    </Shell>
  );
}

function AgentsPage() {
  const [agents, setAgents] = useState(starterAgents);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [capabilities, setCapabilities] = useState([]);

  const openBuilder = (agent = {}) => {
    setCapabilities(agent.capabilities || ["Web search"]);
    setEditing(agent);
  };

  const toggleCapability = (capability) => {
    setCapabilities((current) =>
      current.includes(capability)
        ? current.filter((item) => item !== capability)
        : [...current, capability],
    );
  };

  const saveAgent = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = {
      id: editing?.id ?? Date.now(),
      name: form.get("name"),
      description: form.get("description"),
      model: form.get("model"),
      instructions: form.get("instructions"),
      capabilities,
      skills: [...form.getAll("skills")],
      updated: "Just now",
    };
    setAgents((current) =>
      editing?.id
        ? current.map((agent) => (agent.id === editing.id ? next : agent))
        : [next, ...current],
    );
    setEditing(null);
  };

  const filtered = agents.filter((agent) =>
    `${agent.name} ${agent.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="content-page feature-page">
      <PageHeader
        title="Agents"
        action={
          <button className="primary-button compact" onClick={() => openBuilder()}>
            <Plus size={17} /> Create agent
          </button>
        }
      />
      <DeferredNotice title="Agents" />
      <div className="feature-toolbar">
        <SearchField value={query} onChange={setQuery} placeholder="Search agents" />
      </div>
      <section className="feature-card-grid agents-grid">
        {filtered.map((agent) => (
          <article className="feature-card agent-card" key={agent.id}>
            <div className="agent-heading">
              <span className="agent-avatar"><Robot size={24} /></span>
              <button className="ghost-icon" aria-label={`Edit ${agent.name}`} onClick={() => openBuilder(agent)}>
                <DotsThree size={21} weight="bold" />
              </button>
            </div>
            <h2>{agent.name}</h2>
            <p>{agent.description}</p>
            <div className="agent-model"><Lightning size={14} weight="fill" /> {agent.model}</div>
            <div className="tag-row">
              {agent.capabilities.slice(0, 3).map((capability) => <span key={capability}>{capability}</span>)}
            </div>
            <footer>
              <span>{agent.capabilities.length} capabilities</span>
              <button className="secondary-button compact">Start chat <ArrowRight size={15} /></button>
            </footer>
          </article>
        ))}
      </section>
      {editing && (
        <FeatureModal
          title={editing.id ? "Edit agent" : "Create agent"}
          onClose={() => setEditing(null)}
        >
          <form className="builder-form agent-builder" onSubmit={saveAgent}>
            <div className="builder-grid">
              <label>
                Name
                <input name="name" defaultValue={editing.name || ""} placeholder="Agent name" required />
              </label>
              <label>
                Model
                <select name="model" defaultValue={editing.model || "MiniMax-M3"}>
                  <option>MiniMax-M3</option>
                  <option>Claude Sonnet 4.6</option>
                  <option>Gemini 3.1 Pro</option>
                  <option>GPT-5 mini</option>
                </select>
              </label>
            </div>
            <label>
              Description
              <input name="description" defaultValue={editing.description || ""} placeholder="What does this agent do?" required />
            </label>
            <label>
              Instructions
              <textarea name="instructions" defaultValue={editing.instructions || ""} placeholder="Define behavior, constraints, and output expectations." required />
            </label>
            <fieldset>
              <legend>Capabilities</legend>
              <div className="capability-grid">
                {[
                  ["Web search", Globe],
                  ["Code interpreter", Code],
                  ["File search", MagnifyingGlass],
                  ["Artifacts", Sparkle],
                  ["MCP tools", Wrench],
                  ["Memory", Brain],
                ].map(([name, Icon]) => (
                  <button
                    className={capabilities.includes(name) ? "selected" : ""}
                    type="button"
                    onClick={() => toggleCapability(name)}
                    key={name}
                  >
                    <Icon size={18} /> {name}
                    {capabilities.includes(name) && <Check size={15} />}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Skills</legend>
              <div className="checkbox-list">
                {starterSkills.map((skill) => (
                  <label key={skill.name}>
                    <input
                      type="checkbox"
                      name="skills"
                      value={skill.name}
                      defaultChecked={editing.skills?.includes(skill.name)}
                    />
                    <span><strong>{skill.title}</strong><small>${skill.name}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button className="upload-zone" type="button"><UploadSimple size={19} /> Add knowledge files</button>
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => setEditing(null)}>Cancel</button>
              <button className="primary-button compact" type="submit">Save agent</button>
            </div>
          </form>
        </FeatureModal>
      )}
    </main>
  );
}

function SkillsPage({ embedded = false }) {
  const [skills, setSkills] = useState(starterSkills);
  const [query, setQuery] = useState("");
  const Shell = embedded ? "section" : "main";

  const filtered = skills.filter((skill) =>
    `${skill.title} ${skill.name} ${skill.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Shell className={embedded ? "toolkit-panel feature-page" : "content-page feature-page"}>
      {!embedded ? (
        <PageHeader title="Skills" />
      ) : (
        <div className="toolkit-panel-heading">
          <div>
            <h2>Skills</h2>
            <p>Curated actions available to Chat when enabled.</p>
          </div>
        </div>
      )}
      <div className="feature-toolbar">
        <SearchField value={query} onChange={setQuery} placeholder="Search skills" />
        <div className="catalog-summary"><strong>{skills.filter((skill) => skill.active).length}</strong> active</div>
      </div>
      <section className="skill-list">
        {filtered.map((skill) => (
          <article className="skill-row" key={skill.id}>
            <span className="feature-icon"><PuzzlePiece size={20} /></span>
            <div className="skill-main">
              <div><h2>{skill.title}</h2><code>${skill.name}</code></div>
              <p>{skill.description}</p>
              <div className="tag-row">
                <span>{skill.invocation}</span>
                {skill.tools.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
            </div>
            <div className="skill-owner">{skill.invocation}</div>
            <button
              className={`switch ${skill.active ? "on" : ""}`}
              onClick={() => setSkills((current) => current.map((item) => item.id === skill.id ? { ...item, active: !item.active } : item))}
              aria-label={`Toggle ${skill.title}`}
            >
              <span />
            </button>
          </article>
        ))}
      </section>
    </Shell>
  );
}

function MemoryPage({ embedded = false }) {
  const [enabled, setEnabled] = useState(true);
  const [memories, setMemories] = useState(starterMemories);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const Shell = embedded ? "section" : "main";

  const addMemory = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setMemories((current) => [
      ...current,
      {
        id: Date.now(),
        title: "Custom memory",
        body: draft.trim(),
        tag: "Manual",
      },
    ]);
    setDraft("");
    setAdding(false);
  };

  return (
    <Shell className={embedded ? "toolkit-panel memory-page" : "content-page"}>
      {!embedded ? (
        <PageHeader
          title="Memory"
          action={
            <button className="primary-button compact" onClick={() => setAdding(true)}>
              <Plus size={17} /> Add memory
            </button>
          }
        />
      ) : (
        <div className="toolkit-panel-heading">
          <div>
            <h2>Memory</h2>
            <p>Saved context that can personalize future conversations.</p>
          </div>
          <button className="primary-button compact" onClick={() => setAdding(true)}>
            <Plus size={17} /> Add memory
          </button>
        </div>
      )}
      <section className="memory-hero">
        <div className="memory-hero-icon">
          <Sparkle size={27} />
        </div>
        <div>
          <h2>Long-term memory</h2>
        </div>
        <button
          className={`switch ${enabled ? "on" : ""}`}
          onClick={() => setEnabled((state) => !state)}
          aria-label="Toggle long-term memory"
        >
          <span />
        </button>
      </section>

      {adding && (
        <form className="panel add-memory-form" onSubmit={addMemory}>
          <div>
            <h2>Add a memory</h2>
          </div>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="For example: Always use TypeScript in code examples."
            autoFocus
          />
          <div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button compact">
              Save memory
            </button>
          </div>
        </form>
      )}

      <div className="memory-toolbar">
        <div>
          <h2>Memory vault</h2>
          <p>{memories.length} items</p>
        </div>
      </div>
      <section className="memory-grid">
        {memories.map((memory) => (
          <article className="memory-card" key={memory.id}>
            <div className="memory-card-top">
              <span>{memory.tag}</span>
              <button
                onClick={() =>
                  setMemories((current) =>
                    current.filter((item) => item.id !== memory.id),
                  )
                }
                aria-label={`Delete ${memory.title}`}
              >
                <Trash size={17} />
              </button>
            </div>
            <h3>{memory.title}</h3>
            <p>{memory.body}</p>
          </article>
        ))}
      </section>
    </Shell>
  );
}

function ToolkitsPage({ onUsePrompt }) {
  const [activeTab, setActiveTab] = useState("skills");
  const tabs = [
    { id: "skills", label: "Skills", Icon: PuzzlePiece },
    { id: "prompts", label: "Prompts", Icon: MagicWand },
    { id: "memory", label: "Memory", Icon: Brain },
  ];

  return (
    <main className="content-page toolkits-page">
      <PageHeader
        title="Toolkits"
        subtitle="Reusable Chat helpers: skills, prompt templates, and memory."
      />
      <DeferredNotice title="Toolkits" />
      <div className="toolkit-tabs" role="tablist" aria-label="Toolkit sections">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={activeTab === id ? "active" : ""}
            onClick={() => setActiveTab(id)}
            role="tab"
            aria-selected={activeTab === id}
          >
            <Icon size={17} /> {label}
          </button>
        ))}
      </div>
      {activeTab === "skills" && <SkillsPage embedded />}
      {activeTab === "prompts" && <PromptsPage embedded onUsePrompt={onUsePrompt} />}
      {activeTab === "memory" && <MemoryPage embedded />}
    </main>
  );
}

export function App() {
  const [active, setActive] = useState(() => new URLSearchParams(window.location.search).has("share") ? "shared" : "chat");
  const [shareId, setShareId] = useState(() => new URLSearchParams(window.location.search).get("share"));
  const [publicWorks, setPublicWorks] = useState(() => (JSON.parse(localStorage.getItem("maxshot-demo-public-works") || "null") || platformWorks).map(publicWork));
  const [studioSeed, setStudioSeed] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState("demo@maxshot.ai");
  const [chatSeed, setChatSeed] = useState("");
  const [theme, setTheme] = useState("light");
  const [authHint, setAuthHint] = useState("");
  const [billing, setBilling] = useState(() => createBillingScenario("active"));
  const [tokenState, setTokenState] = useState(initialTokenState);
  const [freeRequestsUsed, setFreeRequestsUsed] = useState(0);
  const [sampleUsage, setSampleUsage] = useState(null);
  useEffect(() => { localStorage.setItem("maxshot-demo-public-works", JSON.stringify(publicWorks)); }, [publicWorks]);
  useEffect(() => {
    const syncLocation = () => {
      const id = new URLSearchParams(window.location.search).get("share");
      setShareId(id);
      setActive(id ? "shared" : "chat");
    };
    window.addEventListener("popstate", syncLocation);
    return () => window.removeEventListener("popstate", syncLocation);
  }, []);

  const navigate = (nextPage) => {
    const protectedCopy = protectedPageCopy[nextPage];
    if (!user && protectedCopy) {
      setAuthHint(`Log in to access ${protectedCopy.label}.`);
      return;
    }
    setAuthHint("");
    if (shareId) {
      const url = new URL(window.location.href);
      url.searchParams.delete("share");
      window.history.pushState({}, "", url);
      setShareId(null);
    }
    setActive(nextPage);
  };

  const openShare = (id) => {
    const url = new URL(window.location.href);
    url.searchParams.set("share", id);
    window.history.pushState({}, "", url);
    setShareId(id);
    setActive("shared");
  };

  const openStudio = (seed) => {
    if (seed) setStudioSeed(seed);
    navigate("studio");
  };

  const logout = () => {
    setUser("");
    setAuthHint("");
    if (protectedPageCopy[active]) {
      setActive("chat");
    }
  };

  const page = useMemo(() => {
    if (active === "agents") return <AgentsPage />;
    if (active === "toolkits") {
      return (
        <ToolkitsPage
          onUsePrompt={(prompt) => {
            setChatSeed(prompt);
            navigate("chat");
          }}
        />
      );
    }
    if (active === "usage") return <FundingPage billing={billing} setBilling={setBilling} onTokens={() => navigate("tokens")} onModelPricing={() => navigate("pricing")} initialView="usage" usageContent={<UsagePage billing={billing} sampleUsage={sampleUsage} embedded />} />;
    if (active === "studio") return <StudioPage billing={billing} canGenerateAccount={Boolean(user)} onLoginRequired={() => { setAuthHint("Log in to generate."); setLoginOpen(true); }} seed={studioSeed} onSeedConsumed={() => setStudioSeed(null)} publicWorks={publicWorks} onPublish={(work) => setPublicWorks((current) => [publicWork(work), ...current.filter((item) => item.id !== work.id)])} onUnshare={(id) => setPublicWorks((current) => current.filter((item) => item.id !== id))} onOpenShare={openShare} />;
    if (active === "starters") return <StartersPage canRun={Boolean(user)} onLoginRequired={() => { setAuthHint("Log in to run this example."); setLoginOpen(true); }} onOpenStudio={openStudio} onPricing={() => navigate("pricing")} onApi={() => navigate("api")} onPlayground={() => navigate("playground")} />;
    if (active === "playground") return <PlaygroundPage onOpenChat={(prompt) => { setChatSeed(prompt); navigate("chat"); }} onOpenStudio={openStudio} onApi={() => navigate("api")} onPricing={() => navigate("pricing")} />;
    if (active === "shared") return <SharedWorkPage work={publicWorks.find((item) => item.id === shareId)} onBack={() => navigate("studio")} onTry={(work) => {
      const source = `Share: ${work.id}${new URLSearchParams(window.location.search).get("via") === "x" ? " via X" : ""}`;
      openStudio(work.mode === "method" ? { kind: work.kind, path: work.path, model: work.model, prompt: work.prompt, resolution: work.resolution, source } : { kind: work.kind, mode: "result", source });
    }} />;
    if (active === "pricing") return <ProviderMarketPage initialView="Models & Pricing" />;
    if (active === "api") return <SettingsPage user={user} onLogout={logout} initialView="developer" />;
    if (active === "topup") return <FundingPage billing={billing} setBilling={setBilling} onTokens={() => navigate("tokens")} onModelPricing={() => navigate("pricing")} usageContent={<UsagePage billing={billing} sampleUsage={sampleUsage} embedded />} />;
    if (active === "portfolio") return <PortfolioPage billing={billing} tokenState={tokenState} onNavigate={navigate} />;
    if (active === "vaults") return <VaultsPage accountSignedIn={Boolean(user)} onPortfolio={() => navigate("portfolio")} />;
    if (active === "tokens") return <TokenomicsPage state={tokenState} setState={setTokenState} linkedWallet={prototypeWallet} onCredits={() => navigate("topup")} />;
    if (active === "providers") return <ProviderMarketPage />;
    if (active === "referral") return <ReferralPage />;
    if (active === "settings") return <SettingsPage user={user} onLogout={logout} />;
    return (
      <ChatPage
        seedPrompt={chatSeed}
        onSeedConsumed={() => setChatSeed("")}
        canChat={Boolean(user)}
        onLoginRequired={() => {
          setAuthHint("Log in to start chatting.");
          setLoginOpen(true);
        }}
        billing={billing}
        freeRequestsUsed={freeRequestsUsed}
        onFreeRequest={() => setFreeRequestsUsed((used) => used + 1)}
        onCreditsRequired={() => navigate("topup")}
        onUsageRecorded={setSampleUsage}
      />
    );
  }, [active, billing, tokenState, chatSeed, freeRequestsUsed, user, publicWorks, shareId, studioSeed, sampleUsage]);

  return (
    <div className={`app-theme theme-${theme}`}>
      <AppShell
        active={active}
        onNavigate={navigate}
        user={user}
        onLogin={() => setLoginOpen(true)}
        onLogout={logout}
        authHint={authHint}
        theme={theme}
        setTheme={setTheme}
        billing={billing}
      >
        {page}
      </AppShell>
      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onSuccess={(email) => {
            setUser(email);
            setAuthHint("");
            setLoginOpen(false);
          }}
        />
      )}
    </div>
  );
}
