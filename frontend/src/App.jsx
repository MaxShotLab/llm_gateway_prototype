import { useMemo, useState } from "react";
import {
  ArrowRight,
  Brain,
  ChatsCircle,
  Check,
  Code,
  Copy,
  DotsThree,
  Gauge,
  Globe,
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

const phaseOneNavItems = [
  { id: "chat", label: "Chat", Icon: ChatsCircle },
  { id: "usage", label: "Dashboard", Icon: Gauge },
  { id: "api", label: "API", Icon: Key },
  { id: "topup", label: "Credits", Icon: Wallet },
  { id: "referral", label: "Referral", Icon: ShareNetwork },
  { id: "settings", label: "Profile", Icon: UserCircle },
];

const phaseTwoNavItems = [
  { id: "agents", label: "Agents", Icon: Robot },
  { id: "toolkits", label: "Toolkits", Icon: PuzzlePiece },
];

const protectedPageCopy = {
  usage: {
    label: "Dashboard",
    description: "Usage, bills, balances, and spending limits are tied to your account.",
  },
  api: {
    label: "API",
    description: "Create keys, set limits, and review request logs after signing in.",
  },
  topup: {
    label: "Credits",
    description: "Top-ups, payment methods, receipts, and credit balances require an account.",
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
    input: "2,481",
    output: "3,147",
    cost: "5,628",
    status: "Charged",
  },
  {
    time: "Jun 11, 09:18",
    source: "API",
    model: "GPT-5 mini",
    input: "1,907",
    output: "2,642",
    cost: "4,549",
    status: "Charged",
  },
  {
    time: "Jun 10, 17:44",
    source: "Chat",
    model: "Claude Sonnet 4.6",
    input: "4,221",
    output: "9,885",
    cost: "14,106",
    status: "Charged",
  },
  {
    time: "Jun 10, 14:06",
    source: "API",
    model: "Gemini 3.1 Pro",
    input: "2,814",
    output: "4,023",
    cost: "6,837",
    status: "Charged",
  },
  {
    time: "Jun 09, 20:51",
    source: "Chat",
    model: "DeepSeek V4 Flash",
    input: "1,102",
    output: "1,398",
    cost: "0",
    status: "Free",
  },
];

const dashboardChartData = {
  "7 days": [38, 52, 44, 68, 59, 74, 63],
  "30 days": [42, 58, 35, 66, 52, 76, 61, 84, 70, 90, 63, 78, 55, 86],
  All: [28, 34, 41, 36, 52, 48, 63, 58, 71, 66, 80, 74, 86, 79, 92, 88, 76, 83],
};

const referralConfig = {
  rewardRate: 10,
  maxRewardUsd: 50,
  link: "https://gateway.maxshot.ai/r/max-dchef",
};

const referralTopUps = [
  {
    id: "ref-1042",
    user: "alex@builder.dev",
    joined: "Jun 12, 2026",
    topUp: "$100.00",
    reward: "$10.00",
    status: "Confirmed",
  },
  {
    id: "ref-1037",
    user: "mia@studio.ai",
    joined: "Jun 10, 2026",
    topUp: "$250.00",
    reward: "$25.00",
    status: "Confirmed",
  },
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

function AppShell({ active, onNavigate, user, onLogin, onLogout, authHint, theme, setTheme, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const isLight = theme === "light";
  const visibleAuthHint =
    authHint || (!user ? "Log in to unlock Dashboard, API, Credits, and account features." : "");

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
          <div className="nav-section-label">Experimental <span>(Coming Soon)</span></div>
          <NavGroup
            items={phaseTwoNavItems}
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
            <span />
          )}

          {user ? (
            <div className="topbar-account">
              <a className="credit-pill" href="#" onClick={(event) => { event.preventDefault(); onNavigate("topup"); }}>
                55,500,000 credits
                <small>≈ $55.50</small>
              </a>
              <div className="account-menu-wrap">
                <button
                  className="account-button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  <UserCircle size={18} />
                  <span>{user}</span>
                </button>
                {accountOpen && (
                  <div className="account-menu" role="menu">
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
        className={`nav-item ${active === item.id ? "active" : ""} ${locked ? "locked" : ""}`}
        key={item.id}
        onClick={() => onNavigate(item.id)}
        title={locked ? "Log in required" : collapsed ? item.label : undefined}
        aria-label={item.label}
        aria-disabled={locked}
        disabled={locked}
      >
        <item.Icon size={19} weight={active === item.id ? "duotone" : "regular"} />
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
        <h2>{title} are not part of Phase 1.</h2>
        <p>This prototype is kept for product review. Launch scope remains Chat, Dashboard, API, Credits, Referral, and Profile.</p>
      </div>
    </section>
  );
}

function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const confirmedTopUp = referralTopUps.reduce(
    (sum, item) => sum + parseCurrency(item.topUp),
    0,
  );
  const earnedRewards = referralTopUps.reduce(
    (sum, item) => sum + parseCurrency(item.reward),
    0,
  );

  const copyReferralLink = () => {
    navigator.clipboard?.writeText(referralConfig.link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="content-page referral-page">
      <PageHeader
        title="Referral"
      />

      <section className="referral-hero panel">
        <div>
          <h2>Invite users. Earn confirmed rewards.</h2>
          <p>Share your link. When a referred user tops up, you receive 10% promotional credits, capped at $50 from each referee.</p>
        </div>
        <div className="referral-link-box">
          <code>{referralConfig.link}</code>
          <button className="secondary-button compact" onClick={copyReferralLink}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </section>

      <section className="referral-rules">
        <article>
          <strong>1</strong>
          <span>Registered users can invite.</span>
        </article>
        <article>
          <strong>{referralConfig.rewardRate}%</strong>
          <span>Reward from confirmed referee top-ups.</span>
        </article>
        <article>
          <strong>${referralConfig.maxRewardUsd}</strong>
          <span>Maximum reward from each referee.</span>
        </article>
      </section>

      <section className="metric-grid referral-metrics">
        <MetricCard label="Earned rewards" value={formatCurrency(earnedRewards)} note="Confirmed promotional credits" />
        <MetricCard label="Confirmed top-up" value={formatCurrency(confirmedTopUp)} note="Measured referee volume" />
        <MetricCard label="Reward rate" value={`${referralConfig.rewardRate}%`} note="Of confirmed referee top-up" />
        <MetricCard label="Reward cap" value={`$${referralConfig.maxRewardUsd}`} note="Per referred user" />
      </section>

      <section className="panel referral-table-panel">
        <div className="panel-heading">
          <div>
            <h2>Referred top-ups</h2>
            <p>{referralTopUps.length} confirmed rewards.</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Referee</th>
                <th>Joined</th>
                <th>Top-up</th>
                <th>Reward</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {referralTopUps.map((item) => (
                <tr key={item.id}>
                  <td>{item.user}</td>
                  <td>{item.joined}</td>
                  <td>{item.topUp}</td>
                  <td>{item.reward}</td>
                  <td>
                    <span className="status-pill success">
                      <i /> {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function parseCurrency(value) {
  return Number(String(value).replace(/[^0-9.-]+/g, "")) || 0;
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function UsagePage() {
  const periods = ["7 days", "30 days", "All"];
  const [activePeriod, setActivePeriod] = useState("30 days");
  const chartData = dashboardChartData[activePeriod];

  return (
    <main className="content-page dashboard-page">
      <PageHeader
        title="Dashboard"
      />

      <section className="metric-grid">
        <MetricCard label="Usable balance" value="$55.50" note="55,500,000 credits" />
        <MetricCard label="Free credits" value="6,800,000" note="Consumed before paid credits" />
        <MetricCard label="Paid credits" value="48,200,000" note="Top-up balance" />
        <MetricCard label="Period spend" value="31,120" note="Credits used in 30 days" />
      </section>

      <section className="limit-grid">
        <div className="panel limit-card">
          <span>Daily limit</span>
          <strong>$8.40 / $25.00</strong>
          <div className="limit-track"><i style={{ width: "34%" }} /></div>
        </div>
        <div className="panel limit-card">
          <span>Monthly limit</span>
          <strong>$55.50 / $150.00</strong>
          <div className="limit-track"><i style={{ width: "37%" }} /></div>
        </div>
      </section>

      <section className="panel usage-chart-panel">
        <div className="panel-heading">
          <div>
            <h2>Credit usage</h2>
            <p>Chat and API usage are metered without storing prompt or response content.</p>
          </div>
          <div className="period-tabs" aria-label="Usage period">
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
          </div>
        </div>
        <div className="chart" aria-label={`Mock ${activePeriod} usage chart`}>
          {chartData.map(
            (height, index) => (
              <div className="bar-column" key={index}>
                <span
                  className="chart-bar api-bar"
                  style={{ height: `${height * 0.45}%` }}
                />
                <span
                  className="chart-bar chat-bar"
                  style={{ height: `${height}%` }}
                />
              </div>
            ),
          )}
        </div>
      </section>

      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent activity</h2>
            <p>Per-request token and credit records.</p>
          </div>
          <button className="secondary-button compact">
            Export CSV
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Source</th>
                <th>Model</th>
                <th>Input</th>
                <th>Output</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockUsage.map((row) => (
                <tr key={`${row.time}-${row.model}`}>
                  <td>{row.time}</td>
                  <td>{row.source}</td>
                  <td>{row.model}</td>
                  <td>{row.input}</td>
                  <td>{row.output}</td>
                  <td>{row.cost}</td>
                  <td>
                    <span className={`status-pill ${row.status === "Free" ? "neutral" : "success"}`}>
                      <i /> {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function SettingsPage({ user }) {
  return (
    <main className="content-page settings-page">
      <PageHeader title="Profile" />
      <section className="panel settings-panel">
        <div className="panel-heading">
          <div>
            <h2>Account</h2>
            <p>Email login and account display settings.</p>
          </div>
        </div>
        <div className="settings-grid">
          <label>
            Display name
            <input defaultValue={user ? user.split("@")[0] : "Maxshot user"} />
          </label>
          <label>
            Email
            <input type="email" defaultValue={user || "demo@maxshot.ai"} readOnly />
          </label>
        </div>
        <div className="profile-actions">
          <button className="secondary-button compact">Save account</button>
        </div>
      </section>
      <section className="panel settings-panel">
        <div className="panel-heading">
          <div>
            <h2>Spend controls</h2>
            <p>Account-level limits block new billable requests when reached. API key limits stay on the API page.</p>
          </div>
        </div>
        <div className="settings-grid">
          <label>
            Daily limit
            <input defaultValue="$25" />
          </label>
          <label>
            Monthly limit
            <input defaultValue="$150" />
          </label>
        </div>
        <div className="profile-actions">
          <button className="secondary-button compact">Save limits</button>
        </div>
      </section>
      <section className="panel settings-panel">
        <div className="panel-heading">
          <div>
            <h2>Defaults</h2>
            <p>Global preferences used when a page does not override them.</p>
          </div>
        </div>
        <div className="settings-grid">
          <label>
            Default model
            <select defaultValue="MiniMax-M3">
              <option>MiniMax-M3</option>
              <option>GPT-5 mini</option>
              <option>Claude Sonnet 4.6</option>
              <option>Gemini 3.1 Pro</option>
            </select>
          </label>
          <label>
            Low-balance alert
            <input defaultValue="$10" />
          </label>
        </div>
        <div className="profile-actions">
          <button className="secondary-button compact">Save defaults</button>
        </div>
      </section>
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
  const [active, setActive] = useState("chat");
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState("demo@maxshot.ai");
  const [chatSeed, setChatSeed] = useState("");
  const [theme, setTheme] = useState("light");
  const [authHint, setAuthHint] = useState("");

  const navigate = (nextPage) => {
    const protectedCopy = protectedPageCopy[nextPage];
    if (!user && protectedCopy) {
      setAuthHint(`Log in to access ${protectedCopy.label}.`);
      return;
    }
    setAuthHint("");
    setActive(nextPage);
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
    if (active === "usage") return <UsagePage />;
    if (active === "api") return <ApiPage />;
    if (active === "topup") return <FundingPage />;
    if (active === "referral") return <ReferralPage />;
    if (active === "settings") return <SettingsPage user={user} />;
    return (
      <ChatPage
        seedPrompt={chatSeed}
        onSeedConsumed={() => setChatSeed("")}
        canChat={Boolean(user)}
        onLoginRequired={() => {
          setAuthHint("Log in to start chatting.");
          setLoginOpen(true);
        }}
      />
    );
  }, [active, chatSeed, user]);

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
