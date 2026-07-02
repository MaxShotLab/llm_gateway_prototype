# Maxshot Gateway Phase 1 PRD And Features

**Status:** Draft for team discussion
**Scope:** Phase 1 usage-based LLM Gateway release
**Updated:** July 2, 2026

## 1. Phase 1 Goal

Phase 1 delivers a comprehensive web chat and API gateway with a complete
usage-based loop:

```text
Sign up -> top up -> chat or API usage -> token metering -> bills and limits
```

The release is usage-based only. Monthly subscriptions are not included in this
version.

## 2. Product Surfaces

| Surface | Phase 1 Scope |
|---|---|
| Chat | Comprehensive multi-model chat web app |
| Usage and billing | Token histories, daily/weekly/monthly bills, spending limits |
| Top-up | Crypto and fiat top-up into usable credits/AIT balance |
| Account | Email login, two-factor authentication, profile, security settings |
| API keys | Multiple API keys with usage and limit controls |

## 3. Key Paths

Phase 1 must optimize for five complete paths:

1. **Chat user:** sign up, top up, select a model, chat, review cost, continue
   from history.
2. **Power chat user:** use temporary chat, system prompt, role preset, web
   search or reasoning when supported by the selected model.
3. **API developer:** create an API key, call the OpenAI-compatible endpoint,
   monitor usage, set a limit, revoke the key.
4. **Paying user:** top up with crypto or fiat, see fees and received balance,
   review receipts.
5. **Controlled spender:** set account/key limits, hit a limit, and see a clear
   blocked state.

## 4. Must-Do Versus Deferred

| Area | Must do in Phase 1 | Defer |
|---|---|---|
| Chat core | Streaming chat, stop/retry/regenerate, history, search, model price/capability display | Branching, sharing, collaborative chat, generated artifacts |
| Advanced chat | Temporary chat, system prompt, basic role presets, examples, web search/reasoning toggles when supported | Full prompt marketplace, agent builder, skill builder, custom tools |
| Memory | Basic memory preference, visible memory state, delete/disable controls | Complex memory editor, memory import/export, memory attribution timeline |
| Usage | Token histories, per-request costs, daily/weekly/monthly bills, chat/API split | Tax invoices, team cost allocation, advanced analytics |
| Limits | Account limits, API-key limits, low-balance warning, hard block on exhausted balance/limit | Budgets by project/team, soft approvals, postpaid usage |
| Top-up | One reliable crypto path and one reliable fiat path, receipts, status | Broad chain coverage, bridging, saved payment methods, promo campaigns |
| Account | Email login, OAuth, wallet binding, profile, 2FA, session management | Organizations, roles, account deletion, enterprise SSO |
| API | Multiple keys, OpenAI-compatible endpoint, docs, usage by key, revoke/rotate | Anthropic/Gemini-compatible APIs, batch API, user-supplied provider keys |

## 5. Chat

Phase 1 chat should feel like a complete product, not a gateway demo.

Must-do features:

- New chat, persistent history, rename, delete, and search.
- Streaming responses, stop, retry, and regenerate.
- Model selector with provider, price, context, and capability metadata.
- Per-message model identity and cost estimate.
- Web search toggle when the selected model or route supports it.
- Deep thinking/reasoning toggle when the selected model supports it.
- Temporary chat with no long-term history or memory.
- Basic memory on/off controls, visible memory state, deletion, and retention
  preference.
- System prompt editor.
- Basic role presets such as researcher, coder, trader, analyst, and writer.
- Basic prompt/examples gallery.
- Developer mode for system prompt, temperature, max tokens, and raw metadata.

Feature controls must be capability-aware. If the selected model does not
support search, tools, files, vision, audio, or reasoning, the UI must show that
clearly and disable unsupported controls.

Deferred:

- Full prompt library management.
- Agent and skill builders.
- Custom tools or user-managed MCP servers.
- Conversation sharing, branching, or collaborative chat.
- Advanced memory editor, memory import/export, or detailed memory attribution.
- Generated artifacts workspace.

## 6. Usage-Based Billing

Phase 1 uses prepaid usage only. Do not expose monthly plans, recurring
subscription credits, plan renewal, or subscription expiry in this version.

Must-do features:

- Credit/AIT balance and USD estimate.
- Chat and API usage separated by source.
- Token consumption history.
- Daily, weekly, and monthly bills.
- Per-request records with timestamp, source, model, input tokens, output
  tokens, cached tokens when available, and cost.
- CSV export.
- Top-up records and receipts.
- Account-level daily and monthly spending limits.
- API-key-level daily and monthly spending limits.
- Low-balance alerts.
- Hard stop when balance is insufficient or a limit is reached.

Usage records must not store prompt or response content.

Deferred:

- Tax invoices.
- Team/project allocation.
- Advanced cost analytics.
- Postpaid balances.
- Auto-refill unless explicitly approved later.

## 7. Top-Up

Top-up converts external payment into gateway spend balance.

Must-do crypto top-up:

- Wallet connect.
- Deposit address.
- Base USDC and Base AIT first.
- Quote, network fee, payment fee, expected credits, and final amount before
  confirmation.
- Transaction status and top-up history.

Must-do fiat top-up:

- Card payment.
- Payment status, receipt, and credit arrival confirmation.

The conversion must be explicit:

```text
Pay $10 / 10 USDC / 10 AIT -> receive 5,000,000 credits
```

Deferred:

- Broad multi-chain coverage beyond the first supported chain.
- Bridging and token swaps.
- Saved payment methods.
- Apple Pay, Google Pay, Alipay, and WeChat Pay if the selected payment partner
  is not ready for launch.
- Promo codes, referral credits, or campaign rewards.

## 8. Account And Security

Must-do features:

- Email login.
- Google and GitHub OAuth.
- Wallet connect and wallet binding.
- Two-factor authentication.
- Login method management.
- Bound wallet management.
- Active sessions and sign out from all devices.
- Profile with display name, email, avatar, language, timezone, and currency
  display.
- Chat retention preference.
- Memory preference.
- Developer mode preference.

Deferred:

- Organizations, teams, roles, and permissions.
- Enterprise SSO.
- Account deletion.
- Passkeys unless already available from the auth provider.

## 9. API Keys

Must-do features:

- Create multiple API keys.
- Name keys.
- Display secret once and copy it.
- Reveal or rotate according to security policy.
- Revoke keys.
- Show key prefix, status, created time, last used time, usage this period, and
  remaining limit.
- Set daily and monthly spending limits per key.
- Show usage by key.
- Provide OpenAI-compatible base URL.
- Provide quickstart examples for cURL, Python, and JavaScript.
- Show model list with pricing and copyable model IDs.

Required API key fields:

```text
Name
Key prefix
Status
Created
Last used
Used this period
Daily/monthly spending limit
Actions: copy, rotate, revoke
```

Deferred:

- Anthropic-compatible or Gemini-compatible customer APIs.
- Batch API.
- User-supplied provider credentials.
- Project/team scoped API keys.
- Fine-grained endpoint permissions.

## 10. Phase 1 Acceptance Criteria

Phase 1 is acceptable when a test user can complete these paths end to end:

1. Create an account with email login and enable two-factor authentication.
2. Top up through at least one crypto method and one fiat method.
3. Send chat messages, including a temporary chat and a capability-aware model
   feature such as search or reasoning.
4. See token usage, request cost, and updated balance after chat usage.
5. Create multiple API keys, set limits, call the OpenAI-compatible API, and
   revoke a key.
6. Review daily, weekly, and monthly bills across chat and API usage.
7. Hit a configured spending limit and see the request blocked clearly.
8. Export usage records without prompt or response content.

## 11. Priority Order

1. Chat completeness.
2. Usage metering, bills, and spending limits.
3. Top-up and balance conversion.
4. API key management.
5. Account, login, profile, and security.
6. Advanced chat controls: temporary chat, memory, system prompts, presets,
   examples, web search, and deep thinking.
