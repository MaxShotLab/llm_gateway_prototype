# Maxshot Gateway Subscription Feature Requirements

Status: Draft for Phase 2 definition
Updated: October 23, 2026
Parent document: [Phase 2 PRD And Features](./PHASE_2_PRD_AND_FEATURES.md)

## 1. Scope

Phase 2 introduces subscriptions as a second pay-to-use method alongside
pay-as-you-go:

```text
Dollar-funded pay-as-you-go + optional subscription plan
```

Pay-as-you-go remains the default usage model. A subscription is an optional
account entitlement that provides a restricted basic-chat Credit allowance
and one premium Credit allowance shared by eligible Chat, API, image, and
video usage. It does not change per-request or per-generation pricing. Image
and video usage is eligible only
where the corresponding Studio or API route is actually available; a
subscription does not introduce a new generation route.

Maxshot uses two units: Dollars represent user-funded value; Credits measure
text and media usage and allowances. They must never be combined into one
balance.
Subscription allowance is usage Credit, not withdrawable user funds. It cannot
be redeemed for fiat or crypto or refunded as Credits.

## 2. Required User Features

- View available subscription plans.
- Subscribe to a plan.
- Change plan.
- Cancel renewal.
- View the current plan, renewal date, and used and remaining Credits in each
  subscription allowance.
- See which supported models and modalities the plan allowance covers.
- See a web Chat eligibility index on every listed model: `B` for Basic Chat,
  `P` for Premium, and `F` for the existing free-model quota.
- Spend the basic-chat allowance only on eligible low-cost web Chat requests;
  spend one premium allowance across eligible Chat, API, image, and video
  requests without separate modality balances.
- See the estimated Credit charge, hard maximum, and funding sources before
  submitting an image or video job, including any maximum Dollar-balance
  debit; see the final charge and released hold after settlement.
- Apply the earliest-expiring eligible AIT Earned Credit before subscription
  allowance. Basic-chat requests then use basic Credits first, then premium
  Credits; other eligible requests use premium Credits only.
- Fall back to free Credits, referral Credits, then Dollar balance when the
  eligible Earned Credit and subscription allowances are exhausted.
- Block usage when no eligible Credit allowance or Dollar balance can cover the
  request.
- View Credit cost and actual Dollar debit separately.
- View configurable 5-hour and weekly subscription limits, usage, remaining
  allowance, and reset times for text Chat and text API usage.
- View both monthly balances and premium usage by channel (Chat, Studio, API) and
  modality (text, image, video), including pending media reservations.
- See a compact, expandable 5-hour and weekly usage summary in the account menu
  and full details on the Usage page.
- Keep subscription billing, invoices, and usage separate from pay-as-you-go
  balances, top-ups, and usage.
- If recurring card payment is supported, save and manage a tokenized preferred
  card through the payment provider.
- View subscription payment history and invoices.
- See renewal, failed-payment, allowance-low, and allowance-exhausted states.
- Let users pay the full subscription charge from Dollar balance. If recurring
  cards are supported, use a saved card for the full charge when the balance
  is insufficient; never split a charge.
- Keep existing Dollar balance and promotional Credits usable when renewal
  fails.

## 3. Credit Ledger Requirements

AIT Earned Credit, basic-chat allowance, premium allowance, free Credits, referral Credits, and
Dollar balance must remain separate ledger buckets. Dollars and Credits must not be merged
because they represent different units and accounting treatment.

| Bucket | Source | Expiry | Consumption order |
|---|---|---|---|
| AIT Earned Credit | Eligible funded AIT staking grant | Seven days after grant | First when its model catalog is eligible; earliest expiry first |
| Basic-chat allowance | Active plan period; eligible low-cost web Chat only | End of billing period | After eligible AIT Earned Credit for basic Chat |
| Premium allowance | Active plan period; eligible Chat, API, image, video | End of billing period | After eligible AIT Earned Credit otherwise; after basic for eligible basic Chat |
| Free credits | Registered-user grant | Configured policy | After subscription allowances |
| Referral rewards | Confirmed referral reward | Configured policy | After free Credits |
| Dollar balance (USD) | User top-up | No expiry | Last; converted at the versioned request rate |

Confirmed AIT unstaking stops new Earned Credit accrual immediately. Entitlement already accrued but not yet granted remains due at the next shared grant after chain finality; issued grants keep their original expiry.

The premium allowance is one account-level pool, including for supported API
keys; there are no separate image, video, or API balances. The basic-chat
allowance is a restricted Credit bucket, not a third unit or a cash balance.
It is capped in monthly Credits and by the configured 5-hour and weekly text
windows. Only listed low-cost models in web Chat qualify. API requests,
frontier models, search/tool surcharges, image, and video never use it.
The `B`/`P`/`F` index describes web Chat eligibility only. `F` is not a third
subscription bucket; its quota and post-quota behavior follow the separate
free-model policy. API and Studio usage follow their route and plan rules.
Limit context, output tokens, and concurrent requests for eligible basic Chat
so each Credit has a bounded provider cost. Do not advertise unlimited chat.
Each deduction keeps its source, model, modality, channel, route, and
billing-period ID so the premium balance can be reported by feature without
creating new buckets. Channel and modality are two views of the same usage;
an API image job counts once in the total, not once under each view.
Unreserved allowances expire at period end; a reservation made before that
time remains tied to its original period until the media job settles or fails.

### 3.1 Plan Coverage And Pricing

The recommended initial offer is Core and Plus; Studio is a later tier once
provider costs and multimodal demand are measured. PAYG remains available
without a subscription.

| Plan | Included basic Chat | Included premium allowance | Media coverage |
|---|---|---|---|
| Core | Capped low-cost web Chat | Shared across eligible Chat, text API, and image jobs | Video uses PAYG only |
| Plus | Higher capped low-cost web Chat | Shared across eligible Chat, API, image, and video jobs | Video draws from the premium allowance |
| Studio (later) | Higher capped low-cost web Chat | Larger premium allowance | Higher-cost eligible media models |

The plan catalog must version the price, both allowances, eligible model/route
lists for Core and Plus, text windows, media job and concurrency limits, and
Credit price schedule.
Eligibility refers to the configured production model catalog, not the
exploratory selection in [Media Model Selection](./model-strategy/MEDIA_STRATEGY_REFERENCE.md)
or the illustrative models in the Studio PRD.
Unsupported routes and models remain unavailable through the subscription;
where available through PAYG, they retain their published PAYG price. No plan
promises unlimited use. Image/video API usage follows the same rule only when
Maxshot exposes that API route.
Each eligible request uses the same published Credit price under subscription
and PAYG; the subscription's economic advantage is its included monthly
allowances, not a discounted per-request rate. Basic/Premium are allowance
classes, not four separately sold Core-Basic/Core-Premium/Plus-Basic/Plus-Premium
subscriptions. A model's allowance class and per-plan eligibility are
configured separately.

Publish numeric plan prices and allowances only after testing the maximum
provider cost of fully consuming *both* allowances under the allowed model
mix, including long-context basic Chat, provider failures/retries, and payment
fees, against target contribution margin. Monitor high-usage cohorts as well
as the aggregate subscriber cost; averages alone do not bound exposure.
Current prototype values are examples, not approved launch economics; in
particular, the $20/30-million-Credit Plus
example needs validation before it is offered as a real plan.
Development may use configurable mock values. Commercial prices and both
allowances require cost validation and approval before launch. New purchases
use the current catalog version; an existing paid period retains its price,
allowances, model eligibility, and limits until renewal. Adverse changes
(price increases, reduced allowances, or removed models) require in-app notice
before renewal. A scheduled change takes effect only on successful renewal;
accepted requests retain their original pricing and eligibility versions.

## 4. Subscription Lifecycle And Billing Algorithm

### 4.1 Canonical States

| State | Meaning | Allowed next states |
|---|---|---|
| `pending_payment` | Initial payment has started; no allowance is available | `active`, `ended` |
| `active` | Current paid period and allowance are available | `cancel_at_period_end`, `past_due`, `ended` |
| `cancel_at_period_end` | Current period remains active; next renewal is disabled | `active`, `ended` |
| `past_due` | Renewal failed; no new period or allowance was created | `active`, `ended` |
| `ended` | No active subscription entitlement | `pending_payment` |

A scheduled plan change is stored separately as `pending_plan_id`; it does not
change the current subscription state or allowance before renewal.

### 4.2 Initial Purchase And Renewal

Initial purchase and renewal use the same payment-source rule:

1. Create one stable idempotency key from account, operation type, plan, and
   target billing period.
2. If the full plan price is available, debit the complete price from Dollar
   balance.
3. If the balance is insufficient and recurring card support and a saved card
   are available, charge the complete price to that card. Do not partially
   debit Dollar balance and charge the remainder to card.
4. If neither source can pay the full price, initial purchase ends without an
   entitlement and renewal enters `past_due`.
5. After confirmed payment, atomically create or finalize exactly one payment
   record, invoice, subscription period, and both subscription Credit buckets.
6. Replaying a command or payment-provider webhook with the same idempotency
   key must return the original result without another debit, card charge,
   invoice, period, or allowance grant in either bucket.
7. On renewal failure, do not create a new period or either allowance. Promotional
   Credits and Dollar balance remain available for PAYG. Do not automatically
   retry or grant a grace-period allowance in this release. The user may add
   funds and manually renew; the new paid period starts on successful payment,
   not on the previous period's scheduled start.
8. Cancellation changes `active` to `cancel_at_period_end`; resuming before
   period end returns it to `active`. At period end it becomes `ended`.
9. Apply a pending plan change only after the next successful full payment. Do
   not prorate or refund unused allowance as Credits.

An active user may remove the saved card, when supported. Renewal then uses
Dollar balance only; if the full price is unavailable, renewal fails and
enters `past_due`.

### 4.3 Request And Generation Usage Charging

1. Resolve the account entitlement and verify that the model, route, and
   output modality are eligible for the plan. An ineligible but supported
   model or route may use PAYG under the normal funding rules.
2. For text, image, and video, compute a request-specific estimated charge and
   a **hard maximum customer charge** from the selected offering's published
   rate, bounded request settings and any permitted same-model fallback rate.
   Image/video settings include model, path, count, duration, resolution,
   audio, and other billable components. Chat and Studio show the server
   estimate and maximum before submission; API authorizes within one call.
   Reserve the **maximum**, not merely the estimate, before provider dispatch.
   The estimate is informative; a fixed final charge is not required.
   Additional verified usage may raise the final charge above the estimate
   only within the original maximum and original authorized funding sources.
   If provider-reported cost would exceed the maximum, cap the customer debit
   at that maximum, record the excess as a platform/provider discrepancy, and
   stop further output when possible. Never create a negative balance or
   debit an unapproved source.
3. Check eligible AIT Earned Credit grants and their model-catalog allowance,
   then the eligible monthly subscription allowance: basic Chat may use basic
   then premium Credits; all other eligible requests use premium Credits only.
   For the portion of text Chat and text API usage charged to subscription
   allowance, also check and consume the 5-hour and weekly text windows.
   Usage funded entirely by AIT Earned Credit leaves those subscription
   windows untouched; account, API-key, and job limits still apply.
   Image/video jobs do not
   consume those text windows; enforce their configured per-job cost and
   concurrency limits instead.
4. Reserve the maximum eligible cost from earliest-expiring AIT Earned Credit grants
   first, then eligible subscription allowance(s) in that order. Reserve any
   remainder from eligible free Credits, referral Credits, then Dollar balance
   at the versioned rate. A media UI job that would debit Dollar balance shows
   the maximum amount and requires confirmation before submission. An API key must be
   explicitly configured to allow Dollar-balance overage for media jobs.
5. Reject the request or job before provider execution when funding is
   insufficient, the required overage is not authorized, or a job limit is
   exceeded. PAYG fallback does not bypass hard API-key spending limits.
6. Execute the request or create one image/video job with a stable ID. Keep
   its reservation while Pending, including across a billing-period boundary;
   do not grant or consume a new period's allowance for that job.
7. On successful text completion, convert the metering event to final Credit
   cost and Dollar debit within the original authorized maximum. For media,
   settle only successfully delivered outputs at their actual billable cost
   within that maximum and release unused generation
   reservation; failed or undelivered outputs have no generation charge.
   Independently billable preprocessing that completed may settle even if
   generation fails. A canceled job still pays for outputs delivered before
   cancellation. Reconcile each charge once and show the final adjustment.
   Release unused holds to their original buckets and expiry; an excess
   provider charge is never collected from the customer after acceptance.
8. Count gross Dollar-equivalent cost against API-key spending limits at the
   versioned rate regardless of funding source and record the native usage
   unit: text tokens, image outputs, or the configured video pricing unit.
9. At 90% of a text window or either monthly allowance, create one in-app
   warning per window or bucket. Premium percentage includes Pending media
   reservations as held, not charged, Credits. At 100%, stop using the
   applicable allowance until its reset. Basic monthly exhaustion may route
   eligible Chat to Premium, then other eligible funding; text-window exhaustion
   skips both subscription allowances while eligible AIT Earned Credit,
   promotional Credits, and authorized PAYG remain available. Show the user
   when basic Chat starts spending Premium.
10. Store plan, model-price, limit, and Credit-to-Dollar rate versions so
    later changes do not alter accepted request rules or historical periods.

### 4.4 Media Job Settlement

Studio's Pending, Generated, and Failed states remain the user-facing job
states. Pending jobs hold funds but show no final deduction. Generated jobs
settle successful outputs against actual billable usage. For partial success,
charge only delivered outputs and release the failed portion's hold. Failed
jobs release the generation hold; independently completed, billable search or
preprocessing may still be charged within the original maximum. Show an
estimate and maximum for each independent billable component before submission
and its actual settlement afterward.
Canceled jobs release undelivered work but retain charges for any outputs or
independent components already completed.
Provider callbacks, retries, and polling must be idempotent by job ID. A job
that remains Pending needs reconciliation against provider state before its
hold can be released; a timeout alone must not allow a late success to charge
again. Studio's existing maximum of three Pending videos applies unless a
lower plan-specific limit is configured. Image jobs have no concurrency cap
in the Studio PRD; this document does not add one by default.

### 4.5 Precision And Minimum Records

- Store Credits as integers.
- Store funded balances, top-ups, plan prices, and spending limits as integer
  cents. Store sub-cent request Dollar debits and equivalents as integer
  microdollars. Never use floating-point values for ledger arithmetic.
- Store the rounding policy and rate version used for every Credit-to-Dollar
  conversion.
- AIT Earned Credit grants follow TD-40 in the Tokenomics handoff addendum: fix
  the conversion rate per funded term, floor cumulative time-weighted
  entitlement at each grant boundary, and issue only the increase over prior
  grants. Carry fractions through unstaking and later epochs.
- Each subscription payment/invoice records: account, plan and plan version,
  billing period, amount and currency, payment source, Dollar-balance debit,
  card charge, provider reference when applicable, status, timestamps, and
  idempotency key.
- Each subscription period records: period ID, start and end timestamps,
  subscription state, plan and limit versions, granted and consumed amounts
  for each allowance, and linked payment/invoice IDs.
- Each media job records: account, job and provider IDs, route, output modality,
  model and price versions, billable settings, estimated Credits, accepted
  maximum, reserved bucket amounts, actual billable components, billing-period ID, status, final
  usage record ID, and timestamps.

## 5. Payment And Reward Rules

- Recurring card support is optional for this release. Dollar-balance-funded
  initial purchase and renewal must work without it.
- If cards are supported, store only the payment provider's tokenized
  payment-method reference, never raw card details. Users may select, replace,
  or remove the preferred card subject to provider capabilities.
- Confirmed top-ups add Dollar balance net of disclosed fees. Dollar balance
  can fund PAYG usage or a full subscription charge.
- Dollar balance is the first payment source. If recurring cards are supported,
  a saved card is the fallback when the balance cannot cover the full charge.
- Split payment between Dollar balance and card is not supported in this
  version.
- Payment execution, authentication, and card-network behavior follow the
  selected provider's interface when cards are supported. Subscription renewal
  has no automatic retry or grace-period entitlement in this release.
- Crypto remains a one-time Dollar-balance top-up method.
- Subscription payments do not generate referral rewards.
- Subscription allowance does not roll over, expire early, support withdrawal,
  or support refund as Credits.
- Trials and refunds are not supported.
- Cancellation only disables the next billing cycle. The current paid period
  and its remaining allowance continue until period end.
- Subscription payment history and invoices are separate from pay-as-you-go
  top-up history and receipts.
- Subscription notifications are in-app only.
- The prototype uses simulated checkout and example plan values.

## 6. Acceptance Criteria

- A user can compare plans and subscribe to one plan.
- Core and Plus each include separate Basic and Premium allowances; model
  allowance class and plan eligibility are separately configurable.
- Initial purchase and renewal follow the same full-source payment rule.
- A user can change plan or cancel renewal and see the resulting status.
- Eligible low-cost web Chat consumes its capped basic allowance before the
  premium allowance; other eligible requests cannot consume basic Credits.
- Eligible Chat, API, image, and video requests share one premium monthly
  allowance; channel and modality views reconcile to that same premium total,
  not separate modality pools.
- Core video uses PAYG; Plus video can consume the premium allowance; an
  unsupported media API route is not implied by subscription coverage.
- When allowance is exhausted, the request can fall back to promotional
  Credits or Dollar balance.
- A request is rejected before provider execution when available funding is
  insufficient.
- Final usage cost is reconciled against the reserved maximum without double
  charging; unused reservation is released to its original source and expiry.
- An image or video UI job shows estimated Credits, hard maximum, and funding before
  submission; actual billable delivered outputs settle once with a visible
  adjustment. Failed generation releases its generation hold. Independently
  completed, billable preprocessing may still settle; canceled and partially
  successful jobs charge only completed billable components.
- A final customer charge may exceed the estimate but never the accepted
  maximum. A provider overrun is recorded as a platform/provider discrepancy,
  with no second customer authorization or debit after dispatch.
- Mixed Earned, subscription, promotional, and Dollar reservations cover the
  maximum in the approved spend order; unused amounts return to their original
  buckets and expiry. A same-model fallback at a different rate remains inside
  the same maximum and creates one customer charge.
- Text streaming and media jobs with unexpected verified usage stop further
  output when possible; a delivered overrun is recorded without a customer
  debit above the accepted maximum.
- A Pending video holds the period's reserved allowance across renewal and
  cannot receive a second grant or charge from the next period.
- Text windows do not block image/video jobs; media job and concurrency limits
  are checked separately against the premium monthly allowance.
- Dollar-funded media overflow requires UI confirmation or an API-key opt-in;
  hard API-key spending limits still apply.
- Renewal starts a new allowance period without changing historical usage.
- Duplicate commands or provider webhooks cannot create another charge,
  invoice, subscription period, or allowance grant.
- Failed-payment and cancellation states are visible and do not corrupt Dollar
  or Credit balances.
- The UI shows Credit cost, actual Dollar debit, and funding source separately.
- The account menu shows a compact, expandable 5-hour and weekly text-usage
  summary plus both monthly allowances for active subscription periods.
- Usage provides separate Subscription and PAYG views, feature-level usage and
  pending holds, and text-window reset times.
- A 90% subscription-window warning appears in-app and is not duplicated for
  the same window.
- A fully consumed text window falls back to eligible PAYG without consuming
  additional subscription allowance for text requests; media may continue
  using Premium if its monthly allowance and route limits permit.
- A depleted basic-chat bucket may use premium Credits at the published rate;
  the UI makes this transition visible, and no request consumes basic Credits
  from API or media routes.
- Subscription billing records are visible separately from PAYG receipts; a
  tokenized preferred card may be selected for renewal only if supported.
- Every successful initial purchase or renewal produces one billing record
  showing whether Dollar balance or an available card funded it.
- Insufficient renewal funding creates no new entitlement; manual payment
  after replenishment starts a new period at payment time, with no auto-retry.
- The current paid period keeps its price, allowances, limits, and eligibility
  version; adverse changes are notified before they apply at renewal.
- API-key limits use gross Dollar-equivalent cost regardless of funding source.
- A renewal uses the full Dollar balance charge or, if supported, the full
  saved-card charge, never a split payment.
- The UI never combines Dollars and Credits into one displayed balance.
- Subscription payments do not create referral rewards.

## 7. Deferred Provider And Operations Detail

- Commercially approved plan prices and both monthly allowances; mock values
  are for development only.
- Free-model quota and post-quota funding policy for `F` models.
- Exact model and media-route eligibility, image/video Credit price schedule,
  and plan-specific media job limits. A fixed **final** Credit charge is deferred;
  the hard maximum is required before dispatch.
- Studio tier price and allowance; defer launch until multimodal cost data is
  available.
- Recurring card billing provider, if cards are added.
- Exact 5-hour and weekly Credit limits; both are versioned configuration.
- Provider-specific payment authentication and failure behavior, if cards are
  added; subscription renewal itself has no auto-retry in this release.
- Administrative billing operations.

The warning threshold is fixed at 90% for this version. Notifications are
in-app only.

## Version History

| Date | Change |
|---|---|
| 2026-11-15 | Confirmed one hard maximum customer charge for text and media: reserve the maximum before dispatch, permit estimate shortfall only inside it, release unused holds, and never debit an overrun to the customer. |
| 2026-11-13 | Reconciled AIT Earned Credit with subscription: eligible expiring Earned grants spend first; only subscription-funded text usage consumes the five-hour and weekly subscription windows. |
| 2026-10-23 | Confirmed Core/Plus two-bucket value proposition and versioned eligibility; made cards optional, defined balance-only failed renewal and manual restart, adopted actual-cost media/preprocessing settlement, and fixed adverse plan changes to renewal only. |
| 2026-10-13 | Added B/P/F web Chat model eligibility index; free quota remains separate from subscription buckets. |
| 2026-10-13 | Split subscription benefit into capped low-cost web Chat Credits and one shared premium Credit pool for eligible Chat, API, image, and video; preserved the two-unit ledger and PAYG fallback, and required worst-case combined-cost validation. |
| 2026-10-12 | Extended one monthly allowance across eligible Chat, API, image, and video; added plan coverage, firm media quotes, Pending-job holds and settlement, feature-level usage, media overage authorization, and separate text windows versus media job limits. |
| 2026-09-21 | Added the canonical subscription state machine, identical initial-purchase and renewal source rules, idempotent payment and allowance creation, minimum billing records, fixed-point precision, card-removal behavior, and payment-source invoices. |
| 2026-09-21 | Replaced funded Credits with a two-unit model: Dollar balance for user funds and subscription payment, Credits for usage and allowances; added Dollar-balance-first renewal with card fallback and no split payment. |
| 2026-09-21 | Moved the compact usage summary from Chat to the account menu and clarified that window availability gates available funding. |
| 2026-09-21 | Added card prerequisites, preferred payment method, invoices, separate PAYG/subscription views, versioned 5-hour and weekly limits, and in-app 90% warnings. Explicitly excluded trials, refunds, and admin operations. |
| 2026-09-21 | Locked the monthly allowance-only model, immediate PAYG fallback, renewal rules, payment rails, API-limit accounting, and referral exclusion. |
| 2026-09-21 | Extracted subscription requirements from the Phase 2 PRD into a standalone document. |
