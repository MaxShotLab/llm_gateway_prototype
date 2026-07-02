# Maxshot LLM Gateway Product Baseline

**Status:** Authoritative product specification
**Scope:** Phase 1 usage-based release and Phase 2 advanced features
**Updated:** July 2, 2026

This document is the single source of truth for Maxshot LLM Gateway product
design. It defines the product, users, framework decisions, feature scope,
phases, navigation, terminology, and exclusions.

[MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) is the single source of truth
for product and engineering delivery. It translates this baseline into
requirements, ownership, acceptance criteria, and migration work without
changing product design.

Governance:

- Product-design decisions are approved and updated here first.
- Delivery detail is maintained in the PRD.
- The PRD may clarify implementation but cannot add, remove, or reclassify
  product scope without a corresponding baseline update.
- If the documents conflict, this baseline controls product design and both
  documents must be corrected in the same change.

## 1. Product Definition

Maxshot provides:

- Multi-model web chat.
- An OpenAI-compatible API gateway.
- Prepaid usage, free and paid credits, account funding, referral rewards, and
  spending limits.
- Advanced reusable prompts, agents, skills, and memory after Phase 1.

Users access the configured model catalog through chat or API keys. Maxshot
manages identity, usage accounting, billing, provider routing, and privacy
controls.

## 2. Target Users

- Individuals using multi-model chat.
- Developers integrating through API keys.
- Advanced users building reusable prompts, agents, and skills.

Organizations, members, roles, and permissions are outside both phases.

## 3. Product Framework

Use **assistant-ui + Maxshot services + New API** as the product foundation.

### assistant-ui

assistant-ui is the frontend foundation for chat. It owns:

- React chat primitives and accessible interaction patterns.
- Thread, message, composer, attachment, and action presentation.
- Client-side chat runtime state and streaming presentation.
- Runtime interfaces used by Maxshot adapters.

assistant-ui does not own Maxshot identity, persistence, billing, model routing,
prompts, agents, skills, memory, or product navigation.

### Maxshot Web Application

The Maxshot web application owns:

- Product navigation and Maxshot visual design.
- Chat, Dashboard, API, Credits, Referral, and Profile screens.
- Experimental Agents and Toolkits prototype surfaces when enabled.
- assistant-ui composition and runtime adapters.
- Product-specific validation and frontend state.

The production frontend uses React and TypeScript. The current React/Vite
prototype remains the visual and workflow reference during migration.

### Maxshot Services

Maxshot services own:

- Email identity, sessions, profile, and entitlements.
- Conversation, prompt, agent, skill, memory, and file persistence.
- Billing orchestration, payment integrations, and user-facing balances.
- The user-facing product API and authorization rules.

### New API

New API owns:

- Customer API-key enforcement.
- Provider and model configuration.
- OpenAI-compatible request handling.
- Provider routing and failover.
- Token metering, provider cost, and gateway request metadata.

Maxshot remains the authoritative user-facing system for balances, funding
transactions, and product entitlements. A record must have one authoritative
owner and must not be independently maintained by multiple systems.

## 4. Phase 1: Framework And Key Paths

**Priority:** P0
**Goal:** Deliver a production-capable foundation and the shortest complete
path from login to paid chat or API usage.

### 4.1 Account And Settings

- Email login and logout.
- Profile containing email and display name.
- Account balance.
- Monthly account spending limit.
- Basic usage alerts.

Account deletion is not supported.

### 4.2 Chat

- Start a conversation with a selected model.
- Select from a configured default model list containing flagship models and a
  few free models.
- Stream assistant responses.
- Stop and retry generation.
- Save, reopen, rename, and search conversation history.
- Show the selected model and model price before use.
- Render text, Markdown, code, and error states.
- Use temporary chat that is not saved to persistent history.
- Show web search or reasoning controls only when the selected model or route
  supports them.

### 4.3 API Access

- Create and name an API key.
- Display the secret once at creation and allow it to be copied then.
- Revoke an API key.
- Set or remove daily and monthly limits for each key.
- Show request count, token usage, total cost, remaining limit, and last use.
- Provide an OpenAI-compatible base URL and API documentation.

### 4.4 Usage

- Show chat and API usage in one account view.
- Show timestamp, model, input tokens, output tokens, and credit cost.
- Show current-period totals.
- Export usage records.
- Do not store prompt or response content in usage records.

### 4.5 Credits And Funding

- Maintain a prepaid balance denominated in credits.
- Grant configurable free credits to registered users.
- Add paid credits after successful top-up.
- Show one usable spend balance while retaining separate free-credit and
  paid-credit ledger entries internally.
- Show the estimated USD value.
- Consume expiring or free credits before paid credits.
- Deduct metered usage from available credits.
- Stop billable requests when balance or spending limits are exhausted.
- Fund the account through at least two configured top-up methods, including at
  least one fiat card path.
- Show exchange rates, network fees, payment fees, and final credit amount
  before confirmation.
- Show funding status, transaction history, and receipts.
- Support Phase 1 chat file upload when the selected model supports files.

One credit is an internal usage-accounting unit. Credits are not redeemable,
reserve-backed, transferable, or represented as cryptocurrency. Payments
purchase credits and do not create a stored fiat or cryptocurrency balance.
Top-up credits are spend-only inside Maxshot; balance withdrawals, cash-out,
refunds, and redemption back to fiat or crypto are not supported.

Monthly subscriptions are not part of Phase 1.

### 4.6 Gateway

- Connect to multiple configured model providers.
- Expose the configured models through an OpenAI-compatible API.
- Route requests through a configured primary route.
- Retry eligible requests through a configured fallback route.
- Record requested model, serving provider, tokens, latency, status, and cost.
- Keep user balances and per-key limits synchronized with billable requests.

### 4.7 Referral And Rewards

- Generate a referral link for registered users.
- Attribute new registered users to the referring user.
- Reward the referrer when a referred user completes a confirmed top-up.
- Use a configurable reward rate and maximum cap.
- Default reward rate is 10% of the referred user's confirmed top-up amount.
- Default maximum reward cap is $50 from each referred user.
- Show referral link, referred top-ups, earned rewards, and reward status.
- Grant rewards only after the referred top-up is confirmed.
- Withhold rewards for failed top-ups and revoke or withhold rewards for
  abusive top-ups.

Referral rewards are promotional credits. They must be tracked separately in
the backend ledger and may be shown inside the combined usable spend balance.

## 5. Phase 2: Advanced Features

**Priority:** P1 after Phase 1 acceptance
**Goal:** Add richer workflows, privacy controls, reusable builders, and deeper
gateway visibility without changing the Phase 1 credit model.

### 5.1 Advanced Chat And Privacy

- Search citations and advanced search UX.
- Per-conversation memory controls.
- Per-conversation zero-retention mode.
- Route zero-retention conversations only through eligible provider routes.
- Disable memory and persistent history automatically in zero-retention mode.
- Store only required non-content billing, abuse-prevention, and security
  metadata for zero-retention conversations.
- Data export.

Conversation sharing, branching, collaborative chat, and generated artifacts
are not included.

### 5.2 Memory

- View, add, edit, and delete saved memories.
- Enable or disable memory for a conversation.
- Show when memory affects a conversation.

### 5.3 Prompts

- Create, edit, delete, search, and categorize personal prompts.
- Insert a prompt into the chat composer.
- Support editable variables such as `{{topic}}`.

### 5.4 Agents

- Create, edit, delete, and search personal agents.
- Configure name, description, model, and instructions.
- Attach knowledge files.
- Assign enabled skills and tools.
- Start a chat with an agent.
- Show per-agent usage.

### 5.5 Skills And Tools

- Create, edit, delete, search, enable, and disable personal skills.
- Store name, description, instructions, invocation mode, and allowed tools.
- Invoke a skill manually from chat or through an assigned agent.

The initial user-facing tool catalog contains:

- Web search.
- File search.
- Code interpreter.

Administrators configure the catalog outside the user-facing product. Users
cannot add custom tools or MCP servers in either phase.

### 5.6 Advanced Gateway Visibility

- Content-free request logs.
- Serving-provider and failover disclosure.
- Request filtering and routing detail.
- Privacy-route eligibility visibility.

Automatic routing by benchmark or quality score, semantic caching, batch
inference, shared capacity pools, user-supplied provider credentials, and
Anthropic- or Gemini-compatible customer APIs are not included in Phase 2.

## 6. Navigation

Phase 1 navigation:

1. Chat
2. Dashboard
3. API
4. Credits
5. Referral
6. Profile

Experimental coming-soon surfaces may remain visible in the prototype when
clearly labeled as deferred and not part of Phase 1 production scope:

7. Agents
8. Toolkits

## 7. Required Definitions

- **Model:** The user-selected LLM exposed by Maxshot.
- **Provider:** The upstream service that executes a model request.
- **Route:** A configured connection from a Maxshot model to a provider model.
- **Failover:** Retrying an eligible request through a configured fallback
  route after the primary route fails.
- **Credit:** Maxshot's non-transferable prepaid usage-accounting unit.
- **Free credit:** A configurable credit grant for registered users.
- **Paid credit:** A funded credit added after successful top-up.
- **Referral reward:** A promotional credit granted to a referrer after a
  referred user's confirmed top-up.
- **Pay-as-you-go:** Metered usage deducted from prepaid credits.
- **Account funding:** Purchasing credits through a configured payment method.
- **Spending limit:** A monthly account or API-key ceiling that blocks further
  billable usage when reached.
- **Prompt:** Reusable text inserted into the chat composer.
- **Agent:** A configured assistant with a model, instructions, knowledge,
  skills, and tools.
- **Skill:** Reusable instructions invoked from chat or assigned to an agent.
- **Tool:** A Maxshot-managed capability available to an agent or skill.
- **Memory:** User-approved information saved for later conversations.
- **Temporary conversation:** A conversation processed during the active
  session and not saved to persistent history.
- **Zero-retention mode:** A temporary conversation restricted to eligible
  provider routes that do not retain prompt or response content.
- **Usage record:** Non-content metering data used for user visibility and
  billing.
- **Funding transaction:** A payment attempt that purchases credits.

## 8. Explicitly Out Of Scope

- Account deletion.
- Organizations, members, roles, and permissions.
- Public marketplaces and sharing.
- Agent publishing, revenue sharing, scheduled execution, and subaccounts.
- Custom tools and user-managed MCP servers.
- Independent agent balances or budgets.
- Monthly and annual subscriptions.
- Postpaid usage.
- Invoices and promotional rebates.
- Redeemable, reserve-backed, utility, governance, or creator tokens.
- Trading, deposits, and on-chain reserve accounting.

Any addition requires a product decision and an updated baseline.

## 9. Prototype Alignment

The prototype is a workflow and visual reference, not the production
architecture. It already mocks most Phase 1 and Phase 2 screens.

Required alignment work:

1. Migrate chat components and runtime state to assistant-ui.
2. Add Phase 1 Settings.
3. Align navigation to the phased release.
4. Label mock-only actions until their services are connected.
5. Connect Phase 2 builder screens only after Phase 1 acceptance.

## 10. Version History

| Date | Version | Changes |
|---|---|---|
| 2026-07-02 | File upload scope revision | Promoted capability-aware chat file upload into Phase 1 must-do scope. |
| 2026-07-02 | Prototype navigation alignment | Aligned navigation with current Phase 1 surfaces and moved Agents/Toolkits to Experimental coming soon. |
| 2026-07-02 | Referral cap clarification | Clarified referral rewards as 10% of confirmed referee top-ups, capped at $50 from each referred user. |
| 2026-07-02 | Referral reward revision | Added registered-user referral links and configurable top-up rewards. |
| 2026-07-02 | Phase 1 usage-based revision | Removed subscriptions from Phase 1, added configured flagship/free model list, registered-user free credits, separate free/paid credit ledger, at least two top-up methods including fiat, temporary chat, capability-aware search/reasoning, and updated navigation. |
| 2026-06-15 | Initial baseline | Defined original Phase 1/Phase 2 product baseline, assistant-ui/New API framework, subscriptions, credits, and advanced feature phases. |
