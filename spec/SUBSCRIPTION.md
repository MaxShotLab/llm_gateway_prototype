# SUBSCRIPTION — plans, lifecycle, allowances and pricing rule

**Status:** Canonical specification, compacted 16 November 2026. Every rule has one ID (`SUB-Rnn`) and is stated once. Merges the former `SUBSCRIPTION_FEATURE_REQUIREMENTS.md` (23 October 2026) and `SUBSCRIPTION_ECONOMICS_DESIGN.md` (4 November 2026), both in [`archive/`](./archive/). Request charging, funding order, media settlement, refunds of settled requests and ledger precision live only in [SPEC_BILLING](./SPEC_BILLING.md) and are cited here as `BIL-` rules. Commercial prices and allowances are inputs ([LAUNCH_CONFIG_V0](./LAUNCH_CONFIG_V0.md)).

## Overview

A subscription is an optional monthly plan on top of pay-as-you-go. It grants two Credit allowances: a capped **Basic** allowance for low-cost Basic-labeled Chat and API text, and one **Premium** pool shared by eligible Chat, API, image and video. Every request costs the same Credits with or without a plan; the plan's value is its included allowances. A plan is paid in full from Dollar balance, or from a saved card if cards are supported, never split. Renewal never retries automatically; a failed renewal leaves PAYG available.

```text
plan purchase/renewal: Dollar balance (full) → else saved card (full) → else no period (past_due)
request funding: AIT Earned Credit → Basic → Premium → Free → Referral → Dollar   (BIL-R08)
```

## 1. Scope and units

- **SUB-R01 · Optional plan.** Pay-as-you-go stays the default and remains available without a plan. A plan is an optional account entitlement; it never changes a request's price and never introduces a new generation route. Image and video are covered only where the Studio or API route actually exists.
- **SUB-R02 · Two units.** Dollars are user-funded value; Credits measure usage and allowances; the two are never combined into one balance (BIL-R01–R03). Allowance is usage Credit: it cannot be withdrawn, redeemed for fiat or crypto, or refunded as Credits when a plan ends or is cancelled. Reversal of a settled request follows BIL-R42.

## 2. User-facing features

- **SUB-R03 · Plan management.** Users can compare plans, subscribe, change plan and cancel renewal; see the current plan, renewal date, and used and remaining Credits in each allowance; and see which models and modalities the plan covers. Every listed model shows its web Chat index: `B` Basic, `P` Premium, `F` free-model quota.
- **SUB-R04 · Usage views.** Users see the configured 5-hour and weekly text windows with usage, remaining allowance and reset times; both monthly allowances; and Premium usage by channel (Chat, Studio, API) and modality (text, image, video), including Pending media holds. The account menu shows a compact, expandable summary of the windows and both allowances; the Usage page shows full detail with separate Subscription and PAYG views. Credit cost, Dollar debit and funding source are always shown separately.
- **SUB-R05 · Billing views and notices.** Subscription payment history and invoices are shown separately from PAYG top-ups and receipts. Users see renewal, failed-payment, allowance-low and allowance-exhausted states. Subscription notifications are in-app only.

Funding order, pre-submit estimates, holds and fallback when allowances run out are SPEC_BILLING rules (BIL-R08–R11, R21–R25).

## 3. Allowance buckets

- **SUB-R06 · Buckets.** The plan adds two buckets alongside AIT Earned Credit, Free Credits, Referral Credits and Dollar balance (BIL-R02):

| Bucket | Source | Covers | Expiry |
|---|---|---|---|
| Basic allowance | Active plan period | Eligible Basic-labeled Chat and API text only | End of billing period |
| Premium allowance | Active plan period | Eligible Chat, API, image and video under the plan's coverage (SUB-R10) | End of billing period |

- **SUB-R07 · One Premium pool.** Premium is one account-level pool, including for API keys; there are no separate image, video or API balances. Each deduction records source, model, modality, channel, route and billing-period ID so usage can be reported by feature without new buckets. Channel and modality are two views of the same usage: an API image job counts once in the total.
- **SUB-R08 · Basic restrictions.** Only listed Basic-labeled models in Chat or API text qualify; frontier models, search and tool surcharges, image and video never use Basic. Basic is capped in monthly Credits and by the 5-hour and weekly text windows, and context, output tokens and concurrency are limited so each Credit has a bounded provider cost. Unlimited chat is never advertised. `F` is not a subscription bucket; free-model quota follows its own policy (§7).
- **SUB-R09 · Period end.** Unreserved allowance expires at period end and never rolls over. A hold made before period end stays tied to its original period until the job settles or fails (BIL-R38).

### 3.1 Plan coverage and pricing

- **SUB-R10 · Plans.** The initial offer is Core and Plus; Studio is a later tier once multimodal cost data exists.

| Plan | Basic allowance | Premium allowance | Video |
|---|---|---|---|
| Core | Capped Basic-labeled Chat and API text | Shared across eligible Chat, text API and image jobs | PAYG only |
| Plus | Higher capped Basic-labeled Chat and API text | Shared across eligible Chat, API, image and video jobs | Draws from Premium |
| Studio (later) | Higher capped Basic-labeled Chat and API text | Larger Premium allowance | Higher-cost eligible media models |

- **SUB-R11 · Versioned plan catalog.** Each plan version fixes its price, both allowances, eligible model and route lists, text windows, media job and concurrency limits, and Credit price schedule. Eligibility comes from the configured production catalog, not from the exploratory [media model selection](../model-strategy/MEDIA_STRATEGY_REFERENCE.md) or Studio PRD examples. A model's allowance class (Basic or Premium) and its per-plan eligibility are configured separately; Basic and Premium are allowance classes, not separately sold subscriptions.
- **SUB-R12 · Same price, no unlimited use.** Every eligible request costs the same published Credits under a plan and under PAYG; a plan's advantage is its included allowances, never a per-request discount. Routes or models a plan does not cover stay unavailable through the plan and keep their PAYG price where offered. Media API usage is covered only where Maxshot exposes that route. No plan promises unlimited use.
- **SUB-R13 · Version continuity.** New purchases use the current plan version. A paid period keeps its price, allowances, eligibility and limits until renewal. A scheduled change applies only on a successful renewal; adverse changes (higher price, smaller allowances, removed models) need in-app notice before that renewal. Accepted requests keep their versions (BIL-R05).
- **SUB-R14 · Price approval.** Numeric prices and allowances are published only after the full-use cost test in §8 and approval. Prototype values, including the $20 / 30-million-Credit Plus example, are not launch economics; development may use configurable mock values.

## 4. Lifecycle and billing

### 4.1 Canonical states

- **SUB-R15 · State machine.**

| State | Meaning | Allowed next states |
|---|---|---|
| `pending_payment` | Initial payment started; no allowance available | `active`, `ended` |
| `active` | Current paid period and allowances available | `cancel_at_period_end`, `past_due`, `ended` |
| `cancel_at_period_end` | Current period still active; next renewal disabled | `active`, `ended` |
| `past_due` | Renewal failed; no new period or allowance created | `active`, `ended` |
| `ended` | No active entitlement | `pending_payment` |

A scheduled plan change is stored separately as `pending_plan_id` and never changes the current state or allowances before renewal.

### 4.2 Initial purchase and renewal

- **SUB-R16 · Idempotency key.** Every purchase or renewal has one stable idempotency key built from account, operation type, plan and target billing period.
- **SUB-R17 · Full-source payment.** Initial purchase and renewal follow the same rule. Debit the full price from Dollar balance if available. Otherwise, if card support exists and a saved card is available, charge the full price to the card. Never split a charge between Dollar balance and card. If neither source covers the full price, an initial purchase ends without entitlement and a renewal enters `past_due`.
- **SUB-R18 · Exactly once.** After confirmed payment, atomically create exactly one payment record, invoice, subscription period and both allowance buckets. Replaying a command or provider webhook with the same key returns the original result with no second debit, card charge, invoice, period or allowance grant.
- **SUB-R19 · Failed renewal.** A failed renewal creates no period and no allowance. Promotional Credits and Dollar balance stay usable for PAYG. There is no automatic retry and no grace-period allowance; after adding funds the user renews manually, and the new period starts at that payment, not at the missed scheduled start.
- **SUB-R20 · Cancel and resume.** Cancelling moves `active` to `cancel_at_period_end`; the current period and its allowance continue until period end, then the state becomes `ended`. Resuming before period end returns to `active`.
- **SUB-R21 · Plan change.** A pending plan change applies only after the next successful full payment. Unused allowance is never prorated or refunded as Credits.
- **SUB-R22 · Card removal.** A user may remove a saved card where supported; renewal then uses Dollar balance only, and enters `past_due` if the full price is not available.

### 4.3 Request And Generation Usage Charging

Owned by [SPEC_BILLING](./SPEC_BILLING.md): plan eligibility and PAYG (BIL-R07), estimate and hard maximum (BIL-R21–R23), spend and hold order (BIL-R08, R25), text windows, exhaustion and warnings (BIL-R09–R11), API-key limits and Dollar spend (BIL-R14–R15), rejection (BIL-R24), settlement and release (BIL-R27–R30), versions (BIL-R05).

### 4.4 Media Job Settlement

Owned by [SPEC_BILLING §5](./SPEC_BILLING.md#5-media-job-lifecycle) (BIL-R32–R41), including the 24-hour auto-release (TD-49).

### 4.5 Records

- **SUB-R23 · Billing records.** Each payment or invoice records account, plan and plan version, billing period, amount and currency, payment source, Dollar-balance debit, card charge, provider reference where applicable, status, timestamps and idempotency key. Each period records period ID, start and end, state, plan and limit versions, granted and consumed amounts for each allowance, and linked payment and invoice IDs. Ledger precision is BIL-R04–R05; media job records are BIL-R41; AIT Earned Credit grants are TOK-R25.

## 5. Payment rules

- **SUB-R24 · Cards optional.** Recurring card support is optional in this release; Dollar-balance purchase and renewal must work without it. With cards, store only the payment provider's tokenized reference, never raw card details; users may select, replace or remove the preferred card as the provider allows; authentication and card-network behavior follow the provider.
- **SUB-R25 · Funding sources.** Crypto remains a one-time top-up method that adds Dollar balance net of disclosed fees (BIL-R01). Dollar balance can fund PAYG usage or a full plan charge.
- **SUB-R26 · No trials, refunds or referral credit.** Trials are not offered and plan payments are not refunded. Subscription payments never create referral rewards (ACC-R13).

## 6. Acceptance

**Plans and lifecycle:**
1. A user compares plans, subscribes, changes plan and cancels renewal, and sees the resulting state (SUB-R03, R15, R20–R21).
2. Core and Plus each carry separate Basic and Premium allowances; allowance class and plan eligibility are configured separately (SUB-R06, R10–R11).
3. Initial purchase and renewal follow the same full-source rule: one billing record shows whether Dollar balance or a card paid; a split charge never occurs (SUB-R17, R23).
4. Duplicate commands or provider webhooks create no second charge, invoice, period or allowance grant (SUB-R16, R18).
5. Insufficient renewal funding creates no entitlement; a manual payment after adding funds starts a new period at payment time; there is no auto-retry (SUB-R19).
6. A tokenized preferred card can be selected for renewal only where card support exists, and removing it makes renewal Dollar-only; subscription payment history and invoices appear apart from PAYG receipts (SUB-R05, R22, R24).
7. Failed-payment and cancellation states are visible and corrupt neither Dollar nor Credit balances; renewal starts a new period without changing historical usage (SUB-R05, R19–R20).
8. A paid period keeps its price, allowances, limits and eligibility; adverse changes are notified before they apply at renewal (SUB-R13).
9. Subscription payments create no referral reward (SUB-R26).

**Allowances and views:**

10. Basic funds only Basic-labeled Chat and API text, never media; Chat, API, image and video share one Premium pool whose channel and modality views reconcile to the same total (SUB-R07–R08).
11. Core video uses PAYG; Plus video can use Premium; a media API route not offered by Maxshot is not implied by a plan (SUB-R10, R12).
12. The account menu shows the compact window and allowance summary; Usage shows separate Subscription and PAYG views, feature-level usage, Pending holds and window reset times; Dollars and Credits are never shown as one balance (SUB-R02, R04).
13. A Pending video keeps its hold across renewal and receives no grant or charge from the next period (SUB-R09).

**Request funding** (spend order, holds, fallback, Dollar confirmation, overruns, key limits, Pending holds, exhaustion and refunds) is accepted in SPEC_BILLING §7 cases 1, 2, 3, 5, 6, 9, 10, 11 and 12.

## 7. Deferred and inputs

- Commercially approved plan prices and both monthly allowances; mock values are for development only.
- Free-model (`F`) quota and post-quota funding policy.
- Exact model and media-route eligibility, image and video Credit price schedule and plan-specific media job limits. A fixed final Credit charge is deferred; the hard maximum is required before dispatch.
- Studio tier price and allowance, deferred until multimodal cost data exists.
- Recurring card provider and its authentication and failure behavior, if cards are added.
- Exact 5-hour and weekly Credit limits (versioned configuration).
- Administrative billing operations.

The warning threshold is fixed at 90% for this version (BIL-R11).

## 8. Pricing rule (formerly Subscription Economics Design)

- **SUB-R27 · Value from bounded Basic.** The restricted Basic allowance should carry most of the apparent usage advantage; the flexible Premium allowance is sized against its higher possible provider cost. If PAYG has little or no inference margin, a plan cannot offer more unrestricted Premium usage than its net proceeds support, and pricing never assumes Premium Credits go unused.
- **SUB-R28 · Full-use contribution test.** For each plan version, model the highest provider cost of fully consuming **both** allowances under every permitted model and route mix, including long-context Chat, media settings, provider failures and retries, independently billable operations and the applicable limits:

```text
Minimum contribution at full use =
  plan price
  - payment and collection fees
  - worst-case provider cost of Basic allowance
  - worst-case provider cost of Premium allowance
  - operating and incident reserve
```

  The result must meet an approved non-negative contribution floor for Core and Plus independently; otherwise adjust price, allowances, eligible models and routes, context and output caps, or media limits before launch. Heavy-user cohorts and realistic averages are also tested to understand expected contribution, but never replace the full-use test.
- **SUB-R29 · Revenue and reporting.** Plan payments are reported separately from PAYG usage and top-ups; a Dollar-funded plan payment consumes an existing user liability and is not new cash. Track plan payments, allowance grants, held and settled usage, provider cost, payment fees, expired allowances and contribution by plan version and cohort, with Basic and Premium provider cost shown separately. Unused allowance is contribution upside, not a pricing dependency. PAYG fallback is never counted as allowance consumption. Finance decides revenue recognition.
- **SUB-R30 · Approval checks.** Before launch: verify full-use contribution for Core and Plus separately, including the most expensive eligible model, route and media mix; verify user-facing examples show the same Credit price under PAYG and a plan and make each plan's restrictions clear. After launch: monitor realized contribution and high-usage cohorts, and suspend new sales or revise future plan versions if the full-use floor is no longer met.

**Open parameters:** Core and Plus prices, both monthly allowances, model and route eligibility, text windows and media limits; the approved contribution floor and operating and incident reserve; current provider costs and payment fees for the launch simulation.

## Version history

| Date | Change |
|---|---|
| 2026-11-16 | Compacted with SUB- rule IDs; request-charging rules cited from SPEC_BILLING; restored the economics approval checks and open parameters dropped in the first merge. |
| 2026-11-16 | Merged feature requirements and economics design into one file under spec/; SPEC_BILLING takes precedence for request charging. |
| 2026-11-15 | Confirmed one hard maximum customer charge for text and media: reserve the maximum before dispatch, permit estimate shortfall only inside it, release unused holds, and never debit an overrun to the customer. |
| 2026-11-13 | Reconciled AIT Earned Credit with subscription: eligible expiring Earned grants spend first; only subscription-funded text usage consumes the five-hour and weekly subscription windows. |
| 2026-11-04 | (Economics design) Documented the agreed full-use contribution rule, PAYG comparison, and non-reliance on unused allowances. |
| 2026-10-23 | Confirmed Core/Plus two-bucket value proposition and versioned eligibility; made cards optional, defined balance-only failed renewal and manual restart, adopted actual-cost media/preprocessing settlement, and fixed adverse plan changes to renewal only. |
| 2026-10-13 | Added B/P/F web Chat model eligibility index; free quota remains separate from subscription buckets. |
| 2026-10-13 | Split subscription benefit into capped low-cost web Chat Credits and one shared premium Credit pool for eligible Chat, API, image, and video; preserved the two-unit ledger and PAYG fallback, and required worst-case combined-cost validation. |
| 2026-10-12 | Extended one monthly allowance across eligible Chat, API, image, and video; added plan coverage, firm media quotes, Pending-job holds and settlement, feature-level usage, media overage authorization, and separate text windows versus media job limits. |
| 2026-09-21 | Added the canonical subscription state machine, identical initial-purchase and renewal source rules, idempotent payment and allowance creation, minimum billing records, fixed-point precision, card-removal behavior, and payment-source invoices. |
| 2026-09-21 | Replaced funded Credits with a two-unit model: Dollar balance for user funds and subscription payment, Credits for usage and allowances; added Dollar-balance-first renewal with card fallback and no split payment. |
| 2026-09-21 | Moved the compact usage summary from Chat to the account menu and clarified that window availability gates available funding. |
