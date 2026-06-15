# Maxshot LLM Gateway Product Baseline

**Status:** Authoritative product specification  
**Scope:** Current prototype and first production release

This document is the single source of truth for Maxshot LLM Gateway product
design. Features not listed under MVP Scope are not required for the first
production release. The first public production release is complete only when
Production Core and Builders are delivered.

## 1. Product Definition

Maxshot combines:

- A multi-model web chat.
- An OpenAI-compatible API gateway.
- Prepaid usage, subscriptions, and account funding.
- Reusable prompts, agents, skills, and memory.

Users access the configured model catalog through chat or API keys. Maxshot
manages login, usage accounting, billing, provider routing, and privacy
controls.

## 2. Target Users

- Individuals using multi-model chat.
- Developers integrating through API keys.
- Builders creating reusable prompts, agents, and skills.

Team organizations, member management, and role-based permissions are not part
of the first release.

## 3. MVP Scope

### 3.1 Account

- Email login.
- Basic profile containing email and display name.
- Account balance and subscription status.
- Log out.

### 3.2 Chat

- Start a conversation with a selected model.
- Stream assistant responses.
- Save and reopen conversation history.
- Search conversations by title.
- Start a temporary chat that is processed during the active session but never
  added to persistent conversation history.
- Attach files and images.
- Enable web search for models marked with the web-search capability.
- Display citations returned by search-enabled responses.
- Show the selected model for every conversation.
- Enable or disable saved memory.

Conversation sharing, branching, collaborative chat, and generated artifacts
are not required for the first release.

### 3.3 Prompts

- Create, edit, delete, and search personal prompts.
- Insert a prompt into the chat composer.
- Support editable prompt variables such as `{{topic}}`.

Shared and public prompt marketplaces are not required for the first release.

### 3.4 Agents

- Create, edit, delete, and search personal agents.
- Configure an agent name, description, model, and instructions.
- Attach knowledge files.
- Assign enabled skills and tools from the fixed Maxshot tool catalog.
- Start a chat with an agent.
- Show a per-agent usage summary.

Agent publishing, revenue sharing, scheduled execution, subaccounts, and
independent agent budgets are not required for the first release.

### 3.5 Skills

- Create, edit, delete, search, enable, and disable personal skills.
- Store a skill name, description, instructions, and allowed tools.
- Support manual invocation from chat and agent-assigned invocation.

Skill marketplaces and background execution are not required for the first
release.

The first-release tool catalog contains:

- Web search.
- File search.
- Code interpreter.

Maxshot administrators configure this catalog outside the user-facing product.
Users cannot add custom tools or MCP servers in the first release.

### 3.6 Memory and Privacy

- Let users view, add, and delete saved memories.
- Let users disable memory for a conversation.
- Let users export their account data.
- Encrypt stored provider credentials.
- Redact secrets from application logs.
- Provide a per-conversation zero-retention mode.
- Restrict zero-retention mode to model routes whose upstream provider does not
  retain prompt or response content.
- Automatically use a temporary chat and disable memory in zero-retention mode.
- Store only non-content metadata required for billing, abuse prevention, and
  security.
- Disable the control and explain why when no eligible route is available.

### 3.7 Billing

- Maintain a prepaid account balance denominated in credits.
- Show the credit balance and estimated USD value.
- Deduct metered pay-as-you-go usage from the prepaid credit balance.
- Stop billable requests when the available balance or spending limit is
  exhausted.
- Support account funding through configured payment methods, including cards,
  Alipay, USDC, and other supported cryptocurrencies.
- Show exchange rates, network fees, payment fees, and the final credit amount
  before payment confirmation.
- Show purchased credits separately from subscription credits.
- Provide monthly subscriptions containing recurring credits, premium access,
  and higher product limits.
- Expire unused subscription credits at the end of each billing period.
- Keep separately purchased credits until they are consumed.
- Show model pricing before use.
- Show model-consumption records under Usage.
- Show funding transactions under Fund account.
- Provide a configurable monthly spending limit.

One credit is an internal usage-accounting unit. Credits are not redeemable,
reserve-backed, transferable, or represented as a cryptocurrency.

Payments purchase credits directly. Maxshot does not maintain a user fiat or
cryptocurrency balance. Additional payment methods can be added to the
configured payment catalog without changing the credit model.

Invoices and promotional rebates belong to Later Capabilities.

### 3.8 API Keys

- Create, name, view once, copy, and revoke API keys.
- Let the user set or remove a monthly spending limit for each key.
- Show an API-key summary containing request count, input tokens, output tokens,
  total cost, remaining spending limit, and last-used time.
- Show a request log containing timestamp, API key, requested model, serving
  provider, input tokens, output tokens, latency, cost, status, and failover
  indicator.
- Exclude prompt and response content from request logs.
- Provide an OpenAI-compatible base URL and API documentation.

Anthropic- and Gemini-compatible customer APIs are not required for the first
release. Their models remain accessible through the OpenAI-compatible gateway.

### 3.9 Gateway

- Connect to multiple upstream model providers.
- Normalize every model in the configured catalog behind the OpenAI-compatible
  API.
- Route each request to the configured provider.
- Retry an eligible request through a configured fallback route when the primary
  route fails.
- Require the fallback route to satisfy the conversation's selected model and
  privacy requirements.
- Record the selected model, upstream provider, token usage, latency, and cost.
- Show the serving provider and failover event in usage details.

Automatic routing by quality, privacy, or benchmark score; semantic caching;
batch inference; shared capacity pools; and user-supplied provider credentials
are not required for the first release.

## 4. Product Navigation

The first-release navigation contains:

1. Chat
2. Prompts
3. Agents
4. Skills
5. Usage
6. API
7. Fund account
8. Subscription
9. Memory
10. Settings

- Fund account contains credit purchase, payment-method selection, funding
  transaction history, payment status, and receipts.
- Usage contains model-consumption records and credit deductions.
- Settings contains profile, monthly spending limit, usage alerts, privacy
  controls, and data export.

## 5. System Responsibilities

Use **LibreChat + New API** as the product foundation.

### LibreChat

LibreChat owns:

- Chat conversations and streaming presentation.
- Conversation history and search.
- Files, prompts, agents, skills, memory, and tool invocation within chat and
  agents.

### New API

New API owns:

- Customer API keys.
- Provider and model configuration.
- Request routing and failover.
- Usage metering and request logs.
- Credits, pricing, subscriptions, funding, and spending limits.

### Maxshot Application

The Maxshot application owns:

- Product navigation and visual design.
- Shared login between LibreChat and New API.
- Account settings and product entitlements.
- Consolidated usage, billing, and provider transparency.
- The fixed user-facing tool catalog.

Each API key, usage event, balance, price, and routing decision has one
authoritative owner. The same record must not be independently maintained by
both LibreChat and New API.

## 6. Required Product Definitions

- **Model:** The user-selected LLM, such as a specific GPT, Claude, Gemini, or
  open model version.
- **Provider:** The upstream service that executes a model request.
- **Credit:** Maxshot's internal prepaid usage-accounting unit.
- **Purchased credit:** A credit bought through account funding that remains
  available until consumed.
- **Subscription credit:** A recurring credit granted by a subscription that
  expires at the end of its billing period.
- **Subscription:** A monthly plan that grants recurring credits and the premium
  access and product limits displayed for that plan. It does not provide
  unlimited or postpaid usage.
- **Pay-as-you-go:** Metered model usage deducted from prepaid credits. Maxshot
  does not provide postpaid usage or permit a negative balance.
- **Account funding:** Purchasing non-transferable credits through a configured
  payment method. The payment does not create a stored fiat or cryptocurrency
  balance.
- **Prompt:** Reusable text inserted into the chat composer.
- **Agent:** A configured assistant with a model, instructions, knowledge,
  skills, and tools.
- **Skill:** Reusable instructions that can be invoked in chat or assigned to an
  agent.
- **Tool:** A Maxshot-managed capability that an agent or skill can use. The
  first-release catalog is web search, file search, and code interpreter.
- **Memory:** User-approved information saved for reuse in later conversations.
- **Temporary chat:** A conversation processed during the active session but
  never added to persistent conversation history. Memory is disabled, and the
  conversation disappears when the user closes or replaces it.
- **Zero-retention mode:** A temporary conversation routed only through a
  provider configuration that does not retain prompt or response content.
  Maxshot stores only required non-content billing, abuse-prevention, and
  security metadata.
- **Failover:** Retrying an eligible request through a configured fallback route
  after the primary route fails. The route must preserve the selected model and
  privacy requirements.

## 7. Delivery Order

### Phase 1: Product Prototype

- Complete all MVP screens with realistic mock data.
- Clearly identify actions that are not connected to production services.
- Validate desktop and mobile workflows.

### Phase 2: Production Core

- Email login and account settings.
- Persistent chat, history, temporary chats, files, and memory.
- Streaming responses, web search, citations, and zero-retention mode.
- Profile, privacy controls, usage alerts, and data export.
- API keys and OpenAI-compatible gateway access.
- Usage metering, prepaid credits, funding, and subscriptions.
- Basic provider routing and failover.

Phase 2 can be deployed internally but is not the complete public MVP.

### Phase 3: Builders

- Production prompts, agents, skills, catalog tools, and knowledge files.
- Per-agent usage visibility.

The first public production release requires both Phase 2 and Phase 3.

### Phase 4: Later Capabilities

- Anthropic- and Gemini-compatible customer APIs.
- User-supplied provider credentials.
- Advanced routing, caching, and batch inference.
- Organizations and role-based permissions.
- Public marketplaces and sharing.
- Scheduled agent tasks and MCP server administration.
- Invoices and promotional rebates.

## 8. Explicitly Out of Scope

The following are not part of the Maxshot LLM Gateway product baseline:

- Redeemable or reserve-backed AI tokens.
- Maxshot utility or governance tokens.
- Creator tokens.
- Trading, referral, or deposit products.
- On-chain reserve accounting.
- Builder revenue sharing.

Adding any out-of-scope feature requires a separate product decision and an
updated version of this document.

## 9. Prototype Alignment

The current mock prototype covers:

- Email login.
- Chat history and search, model selection, temporary chats, attachments,
  streaming, web search, citations, memory controls, and zero-retention mode.
- Prompt creation, editing, search, variables, and insertion into chat.
- Agent creation, editing, search, capabilities, skills, and knowledge upload.
- Skill creation, editing, search, activation, invocation mode, and allowed
  tools.
- Usage summaries and records.
- API-key creation, one-time secret display, revocation, key-level spending
  limits, key summaries, content-free request logs, provider disclosure, and
  failover details.
- Purchased and subscription credit balances, payment-method selection, fees
  and exchange rates, funding transactions, receipts, and account spending
  limits.
- Monthly subscription plans, renewal state, recurring credit grants, and
  subscription-credit expiry.
- Memory viewing, creation, and deletion.

The remaining prototype work, in priority order, is:

1. Add Settings for profile, usage alerts, privacy controls, and data export.
2. Complete builder deletion for prompts, agents, and skills.
3. Restrict agent and skill tools to the fixed first-release catalog: web
   search, file search, and code interpreter.
4. Start chat from a selected agent and show per-agent usage.
5. Mark all mock-only actions clearly until production services replace them.
