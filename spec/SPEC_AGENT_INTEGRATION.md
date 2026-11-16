# SPEC_AGENT_INTEGRATION — external-agent integration guide

**Status:** Product-owned specification, 16 November 2026 (TD-24/45). Engineering supplies the verified live URLs, response shapes and error codes marked `[verify]`; nothing marked `[verify]` may appear in public instructions until confirmed against the live Gateway. This file defines the **content** of the agent-consumable guide; the published guide and its machine-readable copy are generated from it.

**Release:** Foundation (build-order step 4). Earned Credit eligibility is added on the same path in the MAX/AIT release when a funded program is active.

## 1. Boundary

An **external agent** is a developer- or creator-operated client of the Gateway. It uses the owner's Gateway account, a scoped API key and the same Credit ledger and request lifecycle as the UI. It does not get a second balance, an Agent object, an Agent Wallet, a managed template system or a Tokenomics portal; those are separate later decisions (TD-24). An MCP surface is not required (TD-45).

## 2. Guide content

| Section | Content | Source of truth |
| --- | --- | --- |
| 1. Credential | How the account owner creates a key in Profile → Developer settings and sets its policy: allowed catalogs, per-request ceiling, daily and monthly budgets, Dollar-spend toggle (default off), expiry. How the agent presents the key `[verify: header name]`. | [SPEC_BILLING §3](./SPEC_BILLING.md#3-scoped-api-key-policy) |
| 2. Discovery | One read of the catalog snapshot filtered by the key's allowed catalogs and current availability; returns usable models with their offerings and current rate-card versions. No separate discovery endpoint `[verify: URL, viewer-scoped filter]`. | [SPEC_PROVIDERS §2](./SPEC_PROVIDERS.md#2-catalog-data-contract-formerly-b1), TD-45 |
| 3. Request | The single-call API: model ID, bounded settings, optional caller ceiling, optional `offeringId` pin. The Gateway computes and reserves the hard maximum before dispatch. Response carries selected/serving offering, rate version, verified units, final charge and the **request ID** (header and body) `[verify: field names]`. | [SPEC_BILLING §4](./SPEC_BILLING.md#4-one-accepted-request), TD-37/46/48 |
| 4. Pre-dispatch rejections | Fixed code set: `key_invalid`, `key_revoked`, `key_expired`, `catalog_not_allowed`, `model_unavailable`, `pinned_offering_ineligible`, `over_request_ceiling`, `over_daily_budget`, `over_monthly_budget`, `insufficient_funding`, `job_limit_exceeded` `[verify: exact strings and HTTP status]`. None produces a provider attempt or a debit; none carries a request ID (TD-46). | [SPEC_BILLING §4](./SPEC_BILLING.md#4-one-accepted-request) |
| 5. Usage lookup | Fetch one request by request ID; list requests by key ID; each row shows selected vs serving offering, fallback, units, funding sources, final charge, released hold, Pending state for media `[verify: URL]`. | [SPEC_BILLING §4–5](./SPEC_BILLING.md) |
| 6. Funding | What the key can spend: Credits in the account order, Dollar balance only if enabled; that an API call may consume the owner's subscription text windows. In the MAX/AIT release: AIT Earned Credit applies when the model's catalog is in the funded program set. | [SPEC_BILLING §2](./SPEC_BILLING.md#2-funding-buckets-and-eligibility) |
| 7. Versioning | The guide carries a version; breaking changes bump it; the acceptance test runs against the version it names. | this file |

## 3. Machine-readable copy

A `SKILL.md` (or equivalent agent-consumable file) is generated from §2 with the verified values filled in; it is never hand-maintained separately. It contains the credential instructions, discovery read, request example, rejection codes, Usage lookup and version. It must not name URLs, models, rates or actions that are not live.

## 4. Acceptance

A supported external agent, following only the published guide at its named version: (1) authenticates with a scoped key; (2) discovers an eligible model from the filtered catalog read; (3) makes one funded call within the key's limits; (4) finds the same request by ID in Usage with one charge and one account-ledger entry. Negative cases: a revoked key, a model outside the key's catalogs, a request over the key's per-request ceiling and a request over the daily budget each stop before provider dispatch with the documented code. In the MAX/AIT release, the same call consumes eligible AIT Earned Credit first when the program is funded.

## 5. Open items for engineering

Verified base URL, authentication header, catalog read path and viewer-scoped filter, request/response field names, rejection code strings and statuses, Usage lookup paths. These are `[verify]` inputs, not product decisions.
