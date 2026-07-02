# Maxshot LLM Gateway Prototype

Interactive frontend prototype for the Maxshot multi-model chat and API
gateway. It demonstrates chat, API access, usage, account funding,
subscriptions, prompts, agents, skills, memory, and email login with local mock
data.

This repository currently validates product workflows and visual design. It is
not connected to production identity, gateway, billing, payment, or persistence
services.

## Product Documents

| Document | Authority |
|---|---|
| [`llm-gateway-product-baselines.md`](./llm-gateway-product-baselines.md) | Single source of truth for product design, scope, phases, navigation, and terminology |
| [`PHASE_1_PRD_AND_FEATURES.md`](./PHASE_1_PRD_AND_FEATURES.md) | Current Phase 1 usage-based product surface definition for discussion |
| [`MAXSHOT_GATEWAY_PRD.md`](./MAXSHOT_GATEWAY_PRD.md) | Single source of truth for product and engineering delivery requirements |
| [`MAXSHOT_UI_SPECS.md`](./MAXSHOT_UI_SPECS.md) | Current visual tokens, typography, layout, and component rules |
| [`design-qa.md`](./design-qa.md) | Visual QA status, evidence, and known differences |

Product-design changes must start in the baseline and update the PRD in the
same change.

## Current Technology

- React 19
- Vite 6
- JavaScript with JSX
- Phosphor Icons
- Onest variable font
- Plain CSS

The production target defined by the PRD is React with TypeScript and
assistant-ui for the chat interaction layer. assistant-ui is not installed in
the current prototype yet.

## Run The Prototype

Prerequisites:

- Node.js 20 or later
- npm 10 or later

Install and start:

```bash
cd frontend
npm ci
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

The Vite development server binds to `127.0.0.1`. If port `5173` is already in
use, stop the existing process or run:

```bash
npm run dev -- --port 5174
```

## Build And Preview

```bash
cd frontend
npm run build
npm run preview
```

The production build is written to `frontend/dist/`. The preview server uses
Vite's default preview port, normally
[http://127.0.0.1:4173](http://127.0.0.1:4173).

## Prototype Features

- Mock email-link login.
- Multi-model chat with history search and simulated streaming.
- Temporary and zero-retention conversation controls.
- Mock file upload, web search, citations, and reasoning controls.
- Prompt creation, editing, search, variables, and insertion into chat.
- Agent and skill builders.
- Usage summaries and records.
- API-key creation, one-time secret display, limits, logs, and revocation.
- Free, paid, referral, and usable credit balances.
- Card, Alipay, USDC, and other cryptocurrency funding methods.
- Mock checkout, transactions, receipts, and monthly spending limits.
- Memory creation and deletion.

All changes are held in React state and reset after a page reload unless they
come from starter data.

## Source Structure

```text
index.html                  Committed GitHub Pages app shell for root publishing
assets/                     Committed Pages build assets
maxshot-assets/             Logo, menu icon, and Onest font for root Pages
docs/api.html               Static API quick-start page
qa-maxshot/                 Visual comparison pages and captures for root Pages
frontend/
  public/
    assets/                 Source static icons copied by Vite builds
    maxshot-assets/         Source logo, menu icon, and Onest font
    qa-maxshot/             Source visual comparison pages and captures
  src/
    data/
      apiData.js            API keys and request-log fixtures
      billingData.js        Payment, funding, and plan fixtures
      chatData.js           Models, conversations, and attachments
    pages/
      ApiPage.jsx           API-key and request-log workflow
      ChatPage.jsx          Chat history, composer, privacy, and streaming
      FundingPage.jsx       Credits, payment methods, and transactions
    App.jsx                 Shell, navigation, login, and remaining pages
    main.jsx                React entry point
    styles.css              Global Maxshot design system and responsive CSS
```

## Component Usage

### Application Shell

`AppShell` in `frontend/src/App.jsx` owns the sidebar, top bar, collapsed state,
login entry, and active-page presentation.

Navigation is currently state-based rather than URL-based. `App` stores the
active page identifier and selects the corresponding page component.

To add a prototype page:

1. Create or import the page component.
2. Add its item to `navItems` in `frontend/src/App.jsx`.
3. Add the page selection in the `App` component.
4. Use the shared `.content-page`, `.page-heading`, `.panel`, and button classes.
5. Add mock fixtures under `frontend/src/data/` when the data is shared or
   substantial.

### Chat

`ChatPage` owns conversation state, history search, model selection, privacy
controls, mock file upload, and simulated streaming.

It accepts:

```jsx
<ChatPage
  seedPrompt={chatSeed}
  onSeedConsumed={() => setChatSeed("")}
/>
```

`seedPrompt` transfers a prompt from the prompt library into the composer.
`onSeedConsumed` prevents the same prompt from being applied again.

During the production migration, this page should adopt assistant-ui thread,
message, composer, action, and runtime primitives while preserving the Maxshot
shell and styling. Other product pages should remain independent of
assistant-ui internals.

### API

`ApiPage` uses `starterApiKeys`, `starterRequestLogs`, and
`createMockApiKey()` from `frontend/src/data/apiData.js`.

The component demonstrates key creation, one-time secret display, selection,
monthly limits, request filtering, failover details, copying, and revocation.
It does not create usable credentials or send gateway requests.

### Credits

`FundingPage` uses fixtures from `frontend/src/data/billingData.js`.

Funding calculations are client-side demonstrations. Confirming a payment only
inserts a mock completed transaction.

### Prompts, Agents, Skills, Usage, And Memory

These pages currently remain in `frontend/src/App.jsx`. Their starter records
are local constants in the same file. They should be extracted into page and
data modules as production integration begins.

## Styling And Assets

- Global design rules live in `frontend/src/styles.css`.
- Product-page density overrides are near the end of that file.
- Visual tokens and layout requirements are documented in
  [MAXSHOT_UI_SPECS.md](./MAXSHOT_UI_SPECS.md).
- Public asset paths are absolute from `frontend/public/`, for example
  `/maxshot-assets/logo.svg`.

Avoid introducing a second component theme. New UI should reuse the existing
Maxshot tokens, Onest typography, panel classes, controls, and responsive
breakpoints.

## Visual QA

With the development server running, comparison pages are available at:

- [Current clean comparison](http://127.0.0.1:5173/qa-maxshot/clean-copy-compare.html)
- [Chat comparison](http://127.0.0.1:5173/qa-maxshot/compare.html)
- [API comparison](http://127.0.0.1:5173/qa-maxshot/api-compare.html)

See [design-qa.md](./design-qa.md) before treating historical screenshots as
current pixel references.

## Current Gaps

- No production backend or persistence.
- No real authentication, email delivery, API keys, payments, or subscriptions.
- No Settings page.
- Navigation does not yet follow the phased production release.
- assistant-ui and TypeScript migration has not started.
- Agent and skill tools are not fully restricted to the approved catalog.
- Builder deletion, agent-to-chat launch, and per-agent usage are incomplete.
- No automated test suite or lint script is configured.

The required implementation order and acceptance criteria are defined in
[MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md).
