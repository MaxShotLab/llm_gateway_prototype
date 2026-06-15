import { useMemo, useState } from "react";
import {
  ArrowRight,
  Brain,
  CaretDown,
  Check,
  Code,
  DotsThree,
  FilePlus,
  Globe,
  Lightning,
  MagnifyingGlass,
  MagicWand,
  PencilSimple,
  PaperPlaneRight,
  Plus,
  PuzzlePiece,
  Robot,
  Sparkle,
  Trash,
  UploadSimple,
  UserCircle,
  Wrench,
  X,
} from "@phosphor-icons/react";
import { ChatPage } from "./pages/ChatPage";
import { ApiPage } from "./pages/ApiPage";
import { FundingPage } from "./pages/FundingPage";
import { SubscriptionPage } from "./pages/SubscriptionPage";

const navItems = [
  { id: "chat", label: "New Chat", icon: "/assets/chat-light-new.svg" },
  { id: "prompts", label: "Prompts", Icon: MagicWand },
  { id: "agents", label: "Agents", Icon: Robot },
  { id: "skills", label: "Skills", Icon: PuzzlePiece },
  { id: "usage", label: "Usage", icon: "/assets/ai-light-new.svg" },
  { id: "api", label: "API", icon: "/assets/api-light-new.svg" },
  { id: "topup", label: "Fund account", icon: "/assets/purchase-light-new.svg" },
  {
    id: "subscription",
    label: "Subscription",
    icon: "/assets/subscription-light-new.svg",
  },
  { id: "memory", label: "Memory", icon: "/assets/memory-light-new.svg" },
];

const mockUsage = [
  ["Jun 11, 11:32", "MiniMax-M3", "Chat", "2,481", "3,147"],
  ["Jun 11, 09:18", "GPT-5 mini", "API", "1,907", "2,642"],
  ["Jun 10, 17:44", "Claude Sonnet 4.6", "Chat", "4,221", "9,885"],
  ["Jun 10, 14:06", "Gemini 3.1 Pro", "API", "2,814", "4,023"],
  ["Jun 09, 20:51", "DeepSeek V4 Flash", "Chat", "1,102", "1,398"],
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

function AppShell({ active, onNavigate, user, onLogin, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-shell ${collapsed ? "is-collapsed" : ""}`}>
      <aside className="sidebar">
        <button className="brand-button" onClick={() => onNavigate("chat")}>
          <img className="desktop-logo" src="/maxshot-assets/logo.svg" alt="Maxshot" />
          <img className="mobile-menu-logo" src="/maxshot-assets/menu.svg" alt="" />
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              className={`nav-item ${active === item.id ? "active" : ""}`}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
            >
              {item.Icon ? <item.Icon size={19} /> : <img src={item.icon} alt="" />}
              <span>{item.label}</span>
            </button>
          ))}
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
          {active !== "chat" ? (
            <button className="model-button">
              <span className="model-mark">
                <Lightning size={14} weight="fill" />
              </span>
              <span>MiniMax-M3</span>
              <CaretDown size={14} />
            </button>
          ) : (
            <span />
          )}

          {user ? (
            <button className="account-button">
              <UserCircle size={18} />
              <span>{user}</span>
            </button>
          ) : (
            <button className="login-button" onClick={onLogin}>
              Log in
            </button>
          )}
        </header>
        {children}
      </section>
    </div>
  );
}

function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
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

function UsagePage() {
  return (
    <main className="content-page">
      <PageHeader
        title="Usage"
        action={
          <button className="secondary-button">
            Last 30 days <CaretDown size={14} />
          </button>
        }
      />

      <section className="metric-grid">
        <MetricCard label="Purchased credits" value="48,200,000" note="Do not expire" />
        <MetricCard label="Subscription credits" value="6,800,000" note="Expire Jun 30" />
        <MetricCard label="Credits used" value="218,490" note="-8.4% vs May" />
        <MetricCard label="Estimated balance" value="$55.00" note="55,000,000 credits" />
      </section>

      <section className="panel usage-chart-panel">
        <div className="panel-heading">
          <div>
            <h2>Credit consumption</h2>
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
        <div className="chart" aria-label="Mock usage chart">
          {[42, 58, 35, 66, 52, 76, 61, 84, 70, 90, 63, 78, 55, 86].map(
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
          </div>
          <button className="icon-text-button">
            <MagnifyingGlass size={16} />
            Filter
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Model</th>
                <th>Source</th>
                <th>Tokens</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {mockUsage.map((row) => (
                <tr key={row.join("-")}>
                  {row.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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

function PromptsPage({ onUsePrompt }) {
  const [prompts, setPrompts] = useState(starterPrompts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [editing, setEditing] = useState(null);

  const filtered = prompts.filter((prompt) => {
    const matchesQuery = `${prompt.title} ${prompt.description}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (category === "All" || prompt.category === category);
  });

  const savePrompt = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = {
      id: editing?.id ?? Date.now(),
      title: form.get("title"),
      description: form.get("description"),
      category: form.get("category"),
      owner: "You",
      content: form.get("content"),
    };
    setPrompts((current) =>
      editing?.id
        ? current.map((prompt) => (prompt.id === editing.id ? next : prompt))
        : [next, ...current],
    );
    setEditing(null);
  };

  return (
    <main className="content-page feature-page">
      <PageHeader
        title="Prompts"
        action={
          <button className="primary-button compact" onClick={() => setEditing({})}>
            <Plus size={17} /> New prompt
          </button>
        }
      />
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
              <button className="ghost-icon" aria-label={`Edit ${prompt.title}`} onClick={() => setEditing(prompt)}>
                <PencilSimple size={17} />
              </button>
            </div>
            <span className="card-kicker">{prompt.category}</span>
            <h2>{prompt.title}</h2>
            <div className="prompt-preview">{prompt.content}</div>
            <footer>
              <button className="secondary-button compact" onClick={() => onUsePrompt(prompt.content)}>
                Use <ArrowRight size={15} />
              </button>
            </footer>
          </article>
        ))}
      </section>
      {editing && (
        <FeatureModal
          title={editing.id ? "Edit prompt" : "Create prompt"}
          onClose={() => setEditing(null)}
        >
          <form className="builder-form" onSubmit={savePrompt}>
            <label>
              Name
              <input name="title" defaultValue={editing.title || ""} placeholder="Prompt name" required />
            </label>
            <label>
              Description
              <input name="description" defaultValue={editing.description || ""} placeholder="When should this prompt be used?" required />
            </label>
            <label>
              Category
              <select name="category" defaultValue={editing.category || "Writing"}>
                <option>Writing</option>
                <option>Engineering</option>
                <option>Research</option>
                <option>Operations</option>
              </select>
            </label>
            <label>
              Prompt
              <textarea name="content" defaultValue={editing.content || ""} placeholder="Write the reusable prompt..." required />
            </label>
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => setEditing(null)}>Cancel</button>
              <button className="primary-button compact" type="submit">Save prompt</button>
            </div>
          </form>
        </FeatureModal>
      )}
    </main>
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

function SkillsPage() {
  const [skills, setSkills] = useState(starterSkills);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);

  const saveSkill = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = {
      id: editing?.id ?? Date.now(),
      name: form.get("name"),
      title: form.get("title"),
      description: form.get("description"),
      invocation: form.get("invocation"),
      active: editing?.active ?? true,
      tools: [...form.getAll("tools")],
      owner: "You",
    };
    setSkills((current) =>
      editing?.id
        ? current.map((skill) => (skill.id === editing.id ? next : skill))
        : [next, ...current],
    );
    setEditing(null);
  };

  const filtered = skills.filter((skill) =>
    `${skill.title} ${skill.name} ${skill.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="content-page feature-page">
      <PageHeader
        title="Skills"
        action={
          <div className="header-actions">
            <button className="secondary-button"><UploadSimple size={16} /> Import</button>
            <button className="primary-button compact" onClick={() => setEditing({})}><Plus size={17} /> New skill</button>
          </div>
        }
      />
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
            <button className="ghost-icon" onClick={() => setEditing(skill)} aria-label={`Edit ${skill.title}`}><PencilSimple size={17} /></button>
          </article>
        ))}
      </section>
      {editing && (
        <FeatureModal
          title={editing.id ? "Edit skill" : "Create skill"}
          onClose={() => setEditing(null)}
        >
          <form className="builder-form" onSubmit={saveSkill}>
            <div className="builder-grid">
              <label>Display name<input name="title" defaultValue={editing.title || ""} placeholder="Skill name" required /></label>
              <label>Identifier<input name="name" defaultValue={editing.name || ""} placeholder="kebab-case-name" pattern="[a-z0-9][a-z0-9-]*" required /></label>
            </div>
            <label>Description<input name="description" defaultValue={editing.description || ""} placeholder="Describe exactly when the model should use this skill." required /></label>
            <label>
              Invocation
              <select name="invocation" defaultValue={editing.invocation || "Model-invoked"}>
                <option>Manual with $</option>
                <option>Model-invoked</option>
                <option>Always apply</option>
              </select>
            </label>
            <fieldset>
              <legend>Allowed tools</legend>
              <div className="checkbox-list inline">
                {["Web search", "Code interpreter", "File search"].map((tool) => (
                  <label key={tool}><input type="checkbox" name="tools" value={tool} defaultChecked={editing.tools?.includes(tool)} /><span>{tool}</span></label>
                ))}
              </div>
            </fieldset>
            <label>Instructions<textarea name="instructions" defaultValue="# Instructions\n\nFollow the procedure for this skill." /></label>
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => setEditing(null)}>Cancel</button>
              <button className="primary-button compact" type="submit">Save skill</button>
            </div>
          </form>
        </FeatureModal>
      )}
    </main>
  );
}

function MemoryPage() {
  const [enabled, setEnabled] = useState(true);
  const [memories, setMemories] = useState(starterMemories);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

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
    <main className="content-page">
      <PageHeader
        title="Memory"
        action={
          <button className="primary-button compact" onClick={() => setAdding(true)}>
            <Plus size={17} /> Add memory
          </button>
        }
      />
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
        <button className="icon-text-button">
          <MagnifyingGlass size={16} /> Search
        </button>
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
        <button className="memory-import-card">
          <FilePlus size={24} />
          <strong>Import memories</strong>
        </button>
      </section>
    </main>
  );
}

export function App() {
  const [active, setActive] = useState("chat");
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState("");
  const [chatSeed, setChatSeed] = useState("");

  const page = useMemo(() => {
    if (active === "prompts") {
      return (
        <PromptsPage
          onUsePrompt={(prompt) => {
            setChatSeed(prompt);
            setActive("chat");
          }}
        />
      );
    }
    if (active === "agents") return <AgentsPage />;
    if (active === "skills") return <SkillsPage />;
    if (active === "usage") return <UsagePage />;
    if (active === "api") return <ApiPage />;
    if (active === "topup") return <FundingPage />;
    if (active === "subscription") return <SubscriptionPage />;
    if (active === "memory") return <MemoryPage />;
    return (
      <ChatPage
        seedPrompt={chatSeed}
        onSeedConsumed={() => setChatSeed("")}
      />
    );
  }, [active, chatSeed]);

  return (
    <>
      <AppShell
        active={active}
        onNavigate={setActive}
        user={user}
        onLogin={() => setLoginOpen(true)}
      >
        {page}
      </AppShell>
      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onSuccess={(email) => {
            setUser(email);
            setLoginOpen(false);
          }}
        />
      )}
    </>
  );
}
