# Maxshot Gateway Phase 1 PRD And Features

**Status:** Draft for team discussion
**Scope:** Phase 1 usage-based LLM Gateway release
**Updated:** July 2, 2026

## 1. Phase 1 Goal

Phase 1 delivers a comprehensive web chat and API gateway with a complete
usage-based loop:

```text
Sign up -> top up -> chat or API usage -> token metering -> usage totals and limits
```

The release is usage-based only. Monthly subscriptions are not included in this
version.

## 2. Product Surfaces

| Surface | Phase 1 Scope |
|---|---|
| Chat | Multi-model chat with configured model list, history, temporary chat, and supported model capabilities |
| Usage and billing | Free credits, paid credits, token histories, usage totals, balance, and spending limits |
| Top-up | At least two configured top-up methods, including one fiat path |
| Account | Email login and profile |
| API keys | Multiple API keys with usage and limit controls |
| Referral and rewards | Registered-user referral links and configurable top-up rewards |

## 3. Key Paths

Phase 1 must optimize for six complete paths:

1. **Chat user:** sign up, top up, select a model, chat, review cost, continue
   from history.
2. **Power chat user:** use temporary chat plus web search or reasoning when
   supported by the selected model.
3. **API developer:** create an API key, call the OpenAI-compatible endpoint,
   monitor usage, set a limit, revoke the key.
4. **Paying user:** top up through a configured payment method, see fees and
   received balance, review receipts.
5. **Controlled spender:** set account/key limits, hit a limit, and see a clear
   blocked state.
6. **Referrer:** generate a referral link and receive configurable rewards when
   referred users top up.

## 4. Must-Do Scope

| Area | Must do in Phase 1 |
|---|---|
| Chat | Configured flagship/free model list, streaming chat, stop/retry/regenerate, history, search, file upload, model price/capability display, temporary chat, web search/reasoning toggles when supported |
| Usage | Configurable registered-user free credits, paid credits after top-up, token histories, per-request costs, current-period totals, CSV export, chat/API split |
| Limits | Account limits, API-key limits, low-balance warning, hard block on exhausted balance/limit |
| Top-up | At least two configured top-up methods, including one fiat path, receipts, status |
| Account | Email login, profile, logout |
| API | Multiple keys, OpenAI-compatible endpoint, docs, usage by key, revoke |
| Referral | Registered-user referral link, attributed referee top-ups, configurable reward rate and cap |

## 5. Chat

Phase 1 chat should feel like a complete product, not a gateway demo.

Must-do features:

- New chat and persistent history.
- Reopen, rename, delete, and search conversations.
- Streaming responses, stop, retry, and regenerate.
- Configurable default model list with flagship models and a few free models.
- Model selector with provider, price, context, and capability metadata.
- Selected model and estimated cost visible before use.
- File upload with capability-aware model support.
- Web search toggle when the selected model or route supports it.
- Deep thinking/reasoning toggle when the selected model supports it.
- Temporary chat not saved to persistent history.

Feature controls must be capability-aware. If the selected model does not
support search, tools, files, vision, audio, or reasoning, the UI must show that
clearly and disable unsupported controls.

The default model list must include at least one model or route that supports
web search or reasoning if that feature is part of Phase 1 acceptance.

## 6. Usage-Based Billing

Phase 1 uses prepaid usage only. Do not expose monthly plans, recurring
subscription credits, plan renewal, or subscription expiry in this version.

Must-do features:

- Usable spend balance and USD estimate.
- Configurable free credits granted to registered users.
- Paid credits added after user top-up.
- Free and paid credits combined into one usable spend balance.
- Chat and API usage separated by source.
- Token consumption history.
- Current-period request, token, and cost totals.
- Per-request records with timestamp, source, model, input tokens, output
  tokens, cached tokens when available, and cost.
- CSV export.
- Top-up records and receipts.
- Account-level daily and monthly spending limits.
- API-key-level daily and monthly spending limits.
- Low-balance alerts.
- Hard stop when balance is insufficient or a limit is reached.

Usage records must not store prompt or response content.

The UI may show one combined usable balance, but the backend ledger must retain
separate free-credit and paid-credit entries, including source, grant/top-up
time, expiry policy, and consumption order. Expiring or free credits are
consumed before paid credits.

## 7. Top-Up

Top-up converts external payment into gateway spend balance. Phase 1 requires
at least two configured top-up methods, including at least one fiat payment
path.

Must-do top-up:

- One confirmed fiat card payment path.
- One additional configured method, preferably Base USDC or Base AIT through
  wallet connect or deposit address.
- Quote, network fee, payment fee, expected credits, and final amount before
  confirmation.
- Transaction status and top-up history.
- Payment status, receipt, and credit arrival confirmation.

The conversion must be explicit:

```text
Pay $10, 10 USDC, or 10 AIT, subject to configured rates and fees -> receive estimated credits
```

Top-up credits are spend-only inside Maxshot. Phase 1 does not support balance
withdrawals, cash-out, refunds, or redemption back to fiat or crypto.

## 8. Account And Security

Must-do features:

- Email login.
- Profile with display name and email.
- Logout.
- Account balance visible from the app shell.

## 9. Referral And Rewards

Must-do features:

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

Referral rewards are promotional credits. They must be tracked separately in
the backend ledger and may be shown inside the combined usable spend balance.

## 10. API Keys

Must-do features:

- Create multiple API keys.
- Name keys.
- Display the secret once at creation and allow it to be copied then.
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
Actions: copy secret at creation, revoke
```

## 11. Phase 1 Acceptance Criteria

Phase 1 is acceptable when a test user can complete these paths end to end:

1. Create an account with email login.
2. Top up through at least two configured methods, including one fiat method.
3. Send chat messages, including file upload, a temporary chat, and a
   capability-aware model feature such as search or reasoning.
4. See token usage, request cost, and updated balance after chat usage.
5. Create multiple API keys, set limits, call the OpenAI-compatible API, and
   revoke a key.
6. Review request history, current-period totals, and exported usage across
   chat and API usage.
7. Hit a configured spending limit and see the request blocked clearly.
8. Generate a referral link, complete a referred top-up, and see the configured
   referral reward credited to the referrer.
9. Export usage records without prompt or response content.

## 12. Priority Order

1. Chat completeness.
2. Usage metering, usage totals, and spending limits.
3. Top-up and balance conversion.
4. Referral and reward attribution.
5. API key management.
6. Account, login, profile, and security.
7. Advanced chat controls: temporary chat, web search, and deep thinking.

## 13. Version History

| Date | Version | Changes |
|---|---|---|
| 2026-07-02 | File upload scope revision | Promoted capability-aware chat file upload into Phase 1 must-do scope. |
| 2026-07-02 | Referral cap clarification | Clarified referral rewards as 10% of confirmed referee top-ups, capped at $50 from each referred user. |
| 2026-07-02 | Referral reward revision | Added registered-user referral links and configurable top-up rewards. |
| 2026-07-02 | Tightened must-do revision | Reduced Phase 1 to must-do chat/API/top-up/usage/account surfaces, removed subscriptions/2FA/memory/prompts/agents/system prompts from launch scope, added configured flagship/free model list, registered-user free credits, separate free/paid credit ledger, at least two top-up methods including fiat, and creation-time-only API key secret copy. |
| 2026-07-02 | Initial Phase 1 draft | Added standalone Phase 1 PRD and feature surface document for team discussion. |
