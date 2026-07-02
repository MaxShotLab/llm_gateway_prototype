# Maxshot LLM Gateway Product Requirements Document

**Status:** Authoritative delivery specification
**Baseline:** [llm-gateway-product-baselines.md](./llm-gateway-product-baselines.md)
**Updated:** July 2, 2026

## 1. Purpose

Maxshot is a multi-model chat and API gateway with prepaid usage, configurable
free credits, account funding, referral rewards, and spending limits. It gives
individuals and developers one account for using configured models through a
web chat or an OpenAI-compatible API.

This PRD is the single source of truth for product and engineering
collaboration. It defines:

- The production framework and ownership boundaries.
- The required user paths and feature behavior.
- Phase 1 and Phase 2 scope and priorities.
- Product terminology and acceptance conditions.
- The work required to deliver the approved product design.

[llm-gateway-product-baselines.md](./llm-gateway-product-baselines.md)
remains the single source of truth for product design. This PRD must implement
that design without changing its scope, phase, navigation, terminology, or
exclusions.

Governance:

- Product-design changes start in the baseline and update this PRD in the same
  change.
- Requirement, ownership, acceptance, and migration changes are maintained
  here.
- Product and engineering planning, implementation, and acceptance use this PRD.
- If the documents conflict, the baseline controls product design; delivery
  stops until both documents are corrected.

## 2. Goals

### Phase 1 Goals

- Establish a maintainable React chat frontend based on assistant-ui.
- Deliver the complete login-to-chat and login-to-API paths.
- Meter every billable request and deduct the correct credits.
- Let users fund an account and control spending.
- Keep product and gateway records under clear system ownership.

### Phase 2 Goals

- Add advanced chat privacy and memory controls.
- Add reusable prompts, agents, skills, knowledge, and tools.
- Expose detailed provider and failover information.
- Extend the product without replacing the Phase 1 framework or credit model.

## 3. Non-Goals

- Reproducing LibreChat or maintaining LibreChat compatibility.
- Account deletion.
- Team organizations, members, roles, or permissions.
- Public marketplaces, collaboration, or builder monetization.
- Trading, deposit, token, or reserve products.
- Postpaid balances, negative balances, or monthly/annual subscriptions.
- User-managed MCP servers or arbitrary custom tools.

## 4. Users And Key Paths

### Chat User

1. Log in by email.
2. Confirm available credits.
3. Select a model and see its price.
4. Send a message and receive a streaming response.
5. Reopen the conversation from history.
6. Review the usage charge.

### API Developer

1. Log in by email.
2. Create and copy an API key.
3. Set an optional monthly key limit.
4. Use the documented OpenAI-compatible endpoint.
5. Review request, token, and cost totals.
6. Revoke the key when it is no longer needed.

### Paying User

1. Review free, paid, and usable credit balances.
2. Choose a funding amount and payment method.
3. Review fees, exchange rate, and credits received.
4. Confirm payment.
5. Review status, receipt, and updated balance.

### Advanced Builder

1. Create a prompt, agent, or skill.
2. Configure instructions, model, knowledge, and allowed catalog tools.
3. Test the configuration in chat.
4. Review usage attributable to the agent.

The Advanced Builder path is Phase 2.

## 5. Product Framework

### 5.1 Frontend

The production frontend uses:

- React and TypeScript.
- assistant-ui as the chat component and runtime foundation.
- Maxshot-owned product shell, routes, domain screens, and design system.
- A Maxshot runtime adapter that sends chat requests to Maxshot services.

The team should extend assistant-ui primitives and starter components rather
than fork its entire monorepo. Maxshot owns the resulting application code and
visual implementation.

assistant-ui provides thread, message, composer, attachment, action, streaming,
and client runtime patterns. It is not a backend and is not the source of truth
for conversations, identity, billing, prompts, agents, skills, or memory.

The existing React/Vite prototype remains the approved workflow and visual
reference. Migration may replace internal components but must preserve approved
navigation, terminology, responsive behavior, and Maxshot styling.

### 5.2 Product Services

Maxshot services expose the product API and own:

- Authentication and sessions.
- Profiles and entitlements.
- Conversations, files, prompts, agents, skills, and memory.
- Funding, payment orchestration, and user-facing balances.
- Authorization and privacy policy enforcement.
- Translation between frontend requests and gateway operations.

### 5.3 Gateway

New API provides:

- Provider and model configuration.
- OpenAI-compatible request handling.
- Customer API-key enforcement.
- Primary routing and eligible failover.
- Token, latency, status, provider-cost, and request metadata.

New API is not exposed as the Maxshot account or billing source of truth.
Maxshot services map gateway records into user-facing usage and credit entries.

### 5.4 Data Ownership

| Record | Authoritative owner |
|---|---|
| User, session, profile | Maxshot services |
| Conversation and message | Maxshot services |
| Prompt, agent, skill, memory, file | Maxshot services |
| Product entitlement | Maxshot services |
| Funding transaction and user credit balance | Maxshot services |
| Referral attribution and reward ledger | Maxshot services |
| Provider and route configuration | New API |
| Raw gateway metering and routing event | New API |
| User-facing usage record | Maxshot services, derived from gateway events |
| API-key enforcement state | New API, referenced by Maxshot services |

All cross-system writes require stable identifiers and idempotency keys.
Billable requests must produce one gateway event and no more than one credit
deduction.

### 5.5 External References

- assistant-ui documentation: [assistant-ui docs](https://www.assistant-ui.com/docs)
- assistant-ui repository: [assistant-ui GitHub](https://github.com/assistant-ui/assistant-ui)
- New API documentation: [New API docs](https://docs.newapi.pro/en)
- New API repository: [New API GitHub](https://github.com/QuantumNous/new-api)

## 6. Scope And Priorities

Priority definitions:

- **P0:** Required for Phase 1 release.
- **P1:** Required for Phase 2 completion.
- **P2:** Explicitly deferred and not scheduled by this PRD.

## 7. Phase 1 Requirements

### P0.1 Framework Foundation

- Implement the Maxshot shell in React and TypeScript.
- Integrate assistant-ui thread, message, composer, action, and runtime
  primitives.
- Implement a Maxshot chat runtime adapter.
- Preserve the approved Maxshot UI tokens and responsive behavior.
- Add authenticated routing and consistent loading, empty, error, and disabled
  states.
- Add frontend analytics events without recording prompt or response content.

Acceptance:

- A mocked and a real backend runtime can use the same chat UI.
- Streaming updates do not require page-level state rewrites.
- Product pages remain independent of assistant-ui internals.

### P0.2 Account And Settings

- Email login, session persistence, and logout.
- Profile with email and display name.
- Account balance visible from the app shell.
- Monthly account spending limit and basic usage alerts.
- No account-deletion control or API.

Acceptance:

- Protected pages require a valid session.
- Limit changes are persisted and auditable.

### P0.3 Chat

- Configured default model list containing flagship models and a few free
  models.
- Model selection and visible model price.
- New conversation.
- Streaming response with stop and retry.
- Text, Markdown, code, error, and interrupted-response rendering.
- Persistent history with reopen, rename, and title search.
- Model identity retained per conversation.
- File upload with capability-aware model support.
- Temporary chat that is not saved to persistent history.
- Web search or reasoning controls shown only when supported by the selected
  model or route.
- At least one default model or route must support web search or reasoning if
  that capability is part of Phase 1 acceptance.

Acceptance:

- A user can complete the full Chat User key path.
- Reloading the application preserves saved conversations.
- A failed request is not charged unless the gateway reports billable usage.

### P0.4 API

- Create, name, display secret once at creation, copy then, and revoke keys.
- Daily and monthly limit per key.
- OpenAI-compatible base URL and quick-start example.
- Key summary: requests, input tokens, output tokens, cost, remaining limit, and
  last use.

Acceptance:

- Revoked keys cannot authenticate.
- A key at its limit cannot start another billable request.
- The full API Developer key path works with an OpenAI-compatible client.

### P0.5 Usage And Billing

- Unified chat and API usage records.
- Current-period request, token, and credit totals.
- Configurable registered-user free credits.
- Paid credits added after successful top-up.
- One usable spend balance in the UI, backed by separate free-credit and
  paid-credit ledger entries.
- Expiring or free credits consumed before paid credits.
- Atomic credit deduction from billable gateway events.
- Request blocking when available credits or limits are exhausted.
- No prompt or response content in usage or billing records.
- CSV export.

Acceptance:

- The displayed totals reconcile with gateway metering events.
- Retries and duplicate events do not create duplicate deductions.

### P0.6 Top-Up

- At least two configured top-up methods, including one fiat card payment path.
- One additional configured method, preferably Base USDC or Base AIT through
  wallet connect or deposit address.
- Funding amount selection.
- Exchange-rate, network-fee, payment-fee, and final-credit disclosure.
- Payment status, history, and receipt.

Acceptance:

- Credits are granted only after confirmed payment.
- Failed payments do not change the balance.
- Adding a payment method does not change the credit ledger model.
- Free and paid credit ledger entries remain distinguishable after top-up.
- Top-up credits are spend-only inside Maxshot; balance withdrawals, cash-out,
  refunds, and redemption back to fiat or crypto are not supported.

### P0.7 Gateway

- Configured multi-provider model catalog.
- OpenAI-compatible request endpoint.
- Primary route and configured eligible fallback.
- Meter requested model, serving provider, tokens, latency, status, and cost.
- Enforce privacy, balance, and spending-limit eligibility before billable use.

Acceptance:

- Every successful billable request has traceable routing and metering IDs.
- Failover preserves the requested model and applicable policy.

### P0.8 Referral And Rewards

- Generate a referral link for registered users.
- Attribute new registered users to the referring user.
- Reward the referrer when a referred user completes a confirmed top-up.
- Default reward rate is 10% of the referred user's confirmed top-up amount.
- Reward rate and maximum reward cap are configurable.
- Default maximum reward cap is $50 from each referred user.
- Show referral link, referred top-ups, earned rewards, and reward status.
- Grant rewards only after the referred top-up is confirmed.
- Withhold rewards for failed top-ups and revoke or withhold rewards for
  abusive top-ups.

Acceptance:

- A registered user can generate and share a referral link.
- A referred user's confirmed top-up creates at most one reward for the
  referrer.
- Referral rewards are tracked separately in the backend ledger and may appear
  in the combined usable spend balance.

## 8. Phase 2 Requirements

### P1.1 Advanced Chat And Privacy

- Search citations and advanced search UX.
- Conversation memory controls.
- Provider-eligible zero-retention mode.
- Do not save temporary or zero-retention conversations to persistent history.
- Disable memory automatically in zero-retention mode.
- Store only required non-content billing, abuse-prevention, and security
  metadata for zero-retention conversations.
- Data export.

### P1.2 Memory

- View, add, edit, and delete saved memories.
- Enable or disable memory for a conversation.
- Show memory use at conversation level.
- Exclude memory from temporary and zero-retention conversations.

### P1.3 Prompts

- Create, edit, delete, search, categorize, and insert personal prompts.
- Resolve editable variables before submission.

### P1.4 Agents

- Create, edit, delete, and search personal agents.
- Configure model, instructions, knowledge files, skills, and allowed tools.
- Start an agent conversation.
- Show per-agent usage.

### P1.5 Skills And Tools

- Create, edit, delete, search, enable, and disable personal skills.
- Store name, description, instructions, invocation mode, and allowed tools.
- Manual and agent-assigned invocation.
- Fixed tool catalog: web search, file search, and code interpreter.
- No custom tools or user-managed MCP servers.

### P1.6 Gateway Transparency

- Content-free request logs.
- Filters by key, model, status, and date.
- Serving-provider and failover disclosure.
- Expandable routing details and privacy-route eligibility.

Phase 2 acceptance:

- Each feature works with persistent data and production authorization.
- Builders cannot select tools outside the fixed catalog.
- Zero-retention controls cannot select an ineligible route.
- Advanced screens use the Phase 1 account, usage, and credit records.

## 9. P2 Deferred And Out-Of-Scope Work

- Organizations, members, roles, and permissions.
- Conversation sharing, branching, collaboration, and generated artifacts.
- Public prompt, agent, or skill marketplaces.
- Agent publishing, revenue sharing, schedules, subaccounts, or budgets.
- User-supplied provider credentials.
- User-managed MCP servers and custom tools.
- Automatic routing by benchmark or quality score.
- Semantic caching, batch inference, and shared capacity pools.
- Anthropic- and Gemini-compatible customer endpoints.
- Invoices and promotional rebates.
- Monthly and annual subscriptions.

P2 is not a third delivery phase. None of this work is scheduled by this PRD.
Adding it requires an approved product-baseline change before requirements or
implementation begin.

## 10. Navigation

Phase 1:

1. Chat
2. Usage
3. API
4. Top-up
5. Settings

Phase 2 adds:

6. Prompts
7. Agents
8. Skills
9. Memory

Phase 2 prototype screens may remain accessible during development but must not
be represented as Phase 1 production scope.

## 11. Terminology

- **Model:** A user-selectable LLM exposed by Maxshot.
- **Provider:** The upstream service executing a model request.
- **Route:** A configured mapping from a Maxshot model to a provider model.
- **Primary route:** The first configured route attempted for a request.
- **Fallback route:** An eligible route attempted after primary-route failure.
- **Failover:** The controlled retry from a failed primary route to a fallback.
- **Credit:** A non-transferable internal unit used to account for prepaid
  usage.
- **Free credit:** A configurable credit grant for registered users.
- **Paid credit:** A funded credit added after successful top-up.
- **Referral reward:** A promotional credit granted to a referrer after a
  referred user's confirmed top-up.
- **Available credits:** The credits eligible to pay for the next request.
- **Pay-as-you-go:** Metered usage deducted from available prepaid credits.
- **Account funding:** A payment that purchases credits.
- **Spending limit:** A monthly account or API-key ceiling.
- **Usage event:** Raw non-content metering data emitted by the gateway.
- **Usage record:** User-facing metering data derived from usage events.
- **Funding transaction:** A payment attempt to purchase credits.
- **Conversation:** A persisted ordered thread of user and assistant messages.
- **Temporary conversation:** A session-only conversation not saved to history.
- **Zero-retention mode:** A temporary conversation restricted to routes whose
  providers do not retain prompt or response content.
- **Prompt:** Reusable text inserted into the chat composer.
- **Agent:** A configured assistant with a model, instructions, knowledge,
  skills, and tools.
- **Skill:** Reusable instructions invoked from chat or assigned to an agent.
- **Tool:** A Maxshot-managed capability an agent or skill can call.
- **Memory:** User-approved information available to later conversations.
- **Entitlement:** Product access or a limit granted by account state.

## 12. Prototype Migration

The current prototype validates information architecture, visual design, and
mock workflows. It is not the production frontend foundation.

Migration order:

1. Establish the React/TypeScript shell and assistant-ui runtime boundary.
2. Migrate Chat while preserving approved visual behavior.
3. Connect identity, conversation persistence, and model catalog.
4. Connect API, usage, credits, funding, and Settings.
5. Validate all Phase 1 acceptance conditions.
6. Connect Phase 2 screens in priority order.

Do not rewrite all product pages around assistant-ui. Its responsibility is the
chat interaction layer; Maxshot owns the rest of the application.

## 13. Version History

| Date | Version | Changes |
|---|---|---|
| 2026-07-02 | File upload scope revision | Promoted capability-aware chat file upload into Phase 1 must-do scope. |
| 2026-07-02 | Referral cap clarification | Clarified referral rewards as 10% of confirmed referee top-ups, capped at $50 from each referred user. |
| 2026-07-02 | Referral reward revision | Added registered-user referral links and configurable top-up rewards. |
| 2026-07-02 | Phase 1 usage-based revision | Removed subscriptions from Phase 1, added configured flagship/free model list, registered-user free credits, separate free/paid credit ledger, at least two top-up methods including fiat, temporary chat, capability-aware search/reasoning, API key creation-time secret copy, and updated navigation/migration scope. |
| 2026-06-15 | Initial PRD | Defined original product delivery requirements, ownership boundaries, Phase 1/Phase 2 scope, subscriptions, credits, and prototype migration plan. |
