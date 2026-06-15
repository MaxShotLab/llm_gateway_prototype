# Maxshot LLM Gateway Product Baseline

**Status:** Authoritative product specification
**Scope:** Phase 1 initial release and Phase 2 advanced features
**Updated:** June 15, 2026

This document is the single source of truth for Maxshot LLM Gateway product
design. It defines the product, users, framework decisions, feature scope,
phases, navigation, terminology, and exclusions.

`MAXSHOT_GATEWAY_PRD.md` is the single source of truth for product and
engineering delivery. It translates this baseline into requirements, ownership,
acceptance criteria, and migration work without changing product design.

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
- Prepaid usage, account funding, and monthly subscriptions.
- Advanced reusable prompts, agents, skills, and memory.

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
- Account, Usage, API, Fund account, Subscription, Memory, Prompts, Agents,
  Skills, and Settings screens.
- assistant-ui composition and runtime adapters.
- Product-specific validation and frontend state.

The production frontend uses React and TypeScript. The current React/Vite
prototype remains the visual and workflow reference during migration.

### Maxshot Services

Maxshot services own:

- Email identity, sessions, profile, and entitlements.
- Conversation, prompt, agent, skill, memory, and file persistence.
- Billing orchestration, payment integrations, and subscription state.
- The user-facing product API and authorization rules.

### New API

New API owns:

- Customer API-key enforcement.
- Provider and model configuration.
- OpenAI-compatible request handling.
- Provider routing and failover.
- Token metering, provider cost, and gateway request metadata.

Maxshot remains the authoritative user-facing system for balances,
subscriptions, funding transactions, and product entitlements. A record must
have one authoritative owner and must not be independently maintained by
multiple systems.

## 4. Phase 1: Framework And Key Paths

**Priority:** P0
**Goal:** Deliver a production-capable foundation and the shortest complete
path from login to paid chat or API usage.

### 4.1 Account And Settings

- Email login and logout.
- Profile containing email and display name.
- Account balance and subscription status.
- Monthly account spending limit.
- Basic usage alerts.

Account deletion is not supported.

### 4.2 Chat

- Start a conversation with a selected model.
- Stream assistant responses.
- Stop and retry generation.
- Save, reopen, rename, and search conversation history.
- Show the selected model and model price before use.
- Render text, Markdown, code, and error states.

### 4.3 API Access

- Create and name an API key.
- Display the secret once and allow it to be copied.
- Revoke an API key.
- Set or remove a monthly limit for each key.
- Show request count, token usage, total cost, remaining limit, and last use.
- Provide an OpenAI-compatible base URL and API documentation.

### 4.4 Usage

- Show chat and API usage in one account view.
- Show timestamp, model, input tokens, output tokens, and credit cost.
- Show current-period totals.
- Do not store prompt or response content in usage records.

### 4.5 Credits And Funding

- Maintain a prepaid balance denominated in credits.
- Show purchased credits separately from subscription credits.
- Show the estimated USD value.
- Deduct metered usage from available credits.
- Stop billable requests when balance or spending limits are exhausted.
- Fund the account through configured methods, including cards, Alipay, USDC,
  and other supported cryptocurrencies.
- Show exchange rates, network fees, payment fees, and final credit amount
  before confirmation.
- Show funding status, transaction history, and receipts.

One credit is an internal usage-accounting unit. Credits are not redeemable,
reserve-backed, transferable, or represented as cryptocurrency. Payments
purchase credits and do not create a stored fiat or cryptocurrency balance.

### 4.6 Subscription

- Offer monthly plans.
- Grant recurring subscription credits and displayed product limits.
- Show current plan and renewal date.
- Expire unused subscription credits at the end of the billing period.
- Keep purchased credits until consumed.
- Support confirmed plan changes.

Subscriptions do not provide unlimited or postpaid usage.

### 4.7 Gateway

- Connect to multiple configured model providers.
- Expose the configured models through an OpenAI-compatible API.
- Route requests through a configured primary route.
- Retry eligible requests through a configured fallback route.
- Record requested model, serving provider, tokens, latency, status, and cost.
- Keep user balances and per-key limits synchronized with billable requests.

## 5. Phase 2: Advanced Features

**Priority:** P1 after Phase 1 acceptance
**Goal:** Add richer workflows, privacy controls, reusable builders, and deeper
gateway visibility without changing the Phase 1 credit model.

### 5.1 Advanced Chat And Privacy

- Temporary conversations that are not saved to history.
- File and image attachments.
- Web search for eligible models.
- Search citations.
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
2. Usage
3. API
4. Fund account
5. Subscription
6. Settings

Phase 2 adds:

7. Prompts
8. Agents
9. Skills
10. Memory

## 7. Required Definitions

- **Model:** The user-selected LLM exposed by Maxshot.
- **Provider:** The upstream service that executes a model request.
- **Route:** A configured connection from a Maxshot model to a provider model.
- **Failover:** Retrying an eligible request through a configured fallback
  route after the primary route fails.
- **Credit:** Maxshot's non-transferable prepaid usage-accounting unit.
- **Purchased credit:** A credit bought through account funding that remains
  until consumed.
- **Subscription credit:** A recurring plan credit that expires at the end of
  its billing period.
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
- Annual subscriptions and postpaid usage.
- Invoices and promotional rebates.
- Redeemable, reserve-backed, utility, governance, or creator tokens.
- Trading, referrals, deposits, and on-chain reserve accounting.

Any addition requires a product decision and an updated baseline.

## 9. Prototype Alignment

The prototype is a workflow and visual reference, not the production
architecture. It already mocks most Phase 1 and Phase 2 screens.

Required alignment work:

1. Migrate chat components and runtime state to assistant-ui.
2. Add Phase 1 Settings.
3. Align navigation to the phased release.
4. Restrict agent and skill tools to the defined catalog.
5. Complete builder deletion, agent-to-chat launch, and per-agent usage.
6. Label mock-only actions until their services are connected.
