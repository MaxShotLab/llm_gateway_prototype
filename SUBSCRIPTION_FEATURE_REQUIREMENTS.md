# Maxshot Gateway Subscription Feature Requirements

Status: Draft for Phase 2 definition
Updated: October 12, 2026
Parent document: [Phase 2 PRD And Features](./PHASE_2_PRD_AND_FEATURES.md)

## 1. Scope

Phase 2 introduces subscriptions as a second pay-to-use method alongside
pay-as-you-go:

```text
Dollar-funded pay-as-you-go + optional subscription plan
```

Pay-as-you-go remains the default usage model. A subscription is an optional
account entitlement that provides one configured monthly Credit allowance
shared by eligible Chat, API, image, and video usage. It does not change
per-request or per-generation pricing. Image and video usage is eligible only
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
- View the current plan, renewal date, allowance, used amount, and remaining
  amount.
- See which supported models and modalities the plan allowance covers.
- Spend one monthly allowance across eligible Chat, API, image, and video
  requests without separate modality balances.
- See the exact configured Credit charge before submitting an image or video
  job, including its funding sources and any Dollar-balance debit.
- Apply subscription allowance before promotional Credits and Dollar balance.
- Fall back to free Credits, referral Credits, then Dollar balance when the
  subscription allowance is exhausted.
- Block usage when no eligible Credit allowance or Dollar balance can cover the
  request.
- View Credit cost and actual Dollar debit separately.
- View configurable 5-hour and weekly subscription limits, usage, remaining
  allowance, and reset times for text Chat and text API usage.
- View the shared monthly balance and usage by channel (Chat, Studio, API) and
  modality (text, image, video), including pending media reservations.
- See a compact, expandable 5-hour and weekly usage summary in the account menu
  and full details on the Usage page.
- Keep subscription billing, invoices, and usage separate from pay-as-you-go
  balances, top-ups, and usage.
- Save and manage a tokenized preferred card through the payment provider for
  recurring billing.
- View subscription payment history and invoices.
- See renewal, failed-payment, allowance-low, and allowance-exhausted states.
- Let users pay the full subscription charge from Dollar balance or a saved
  card, with a configurable Dollar-balance-first preference.
- Keep existing Dollar balance and promotional Credits usable when renewal
  fails.

## 3. Credit Ledger Requirements

Subscription allowance, free Credits, referral Credits, and Dollar balance
must remain separate ledger buckets. Dollars and Credits must not be merged
because they represent different units and accounting treatment.

| Bucket | Source | Expiry | Consumption order |
|---|---|---|---|
| Subscription allowance | Active plan period | End of billing period | First |
| Free credits | Registered-user grant | Configured policy | Second |
| Referral rewards | Confirmed referral reward | Configured policy | Third |
| Dollar balance (USD) | User top-up | No expiry | Last; converted at the versioned request rate |

The allowance is one account-level pool, including for supported API keys.
Each deduction keeps its source, model, modality, channel, route, and
billing-period ID so the shared balance can be reported by feature without
creating new buckets. Channel and modality are two views of the same usage;
an API image job counts once in the total, not once under each view.
Unreserved allowance expires at period end; a reservation made before that
time remains tied to its original period until the media job settles or fails.

### 3.1 Plan Coverage And Pricing

The recommended initial offer is Core and Plus; Studio is a later tier once
provider costs and multimodal demand are measured. PAYG remains available
without a subscription.

| Plan | Included monthly allowance | Media coverage | Capacity |
|---|---|---|---|
| Core | Shared across eligible Chat, text API, and image jobs | Video uses PAYG only | Entry text and image limits |
| Plus | Shared across eligible Chat, API, image, and video jobs | Video draws from the same allowance | Higher limits and media concurrency |
| Studio (later) | Same shared-pool rule with a larger allowance | Higher-cost eligible media models | Higher limits and media concurrency |

The plan catalog must version the price, allowance, eligible model/route list,
text windows, media job and concurrency limits, and Credit price schedule.
Eligibility refers to the configured production model catalog, not the
exploratory selection in [Media Model Selection](./model-strategy/MEDIA_STRATEGY_REFERENCE.md)
or the illustrative models in the Studio PRD.
Unsupported routes and models remain unavailable through the subscription;
where available through PAYG, they retain their published PAYG price. No plan
promises unlimited use. Image/video API usage follows the same rule only when
Maxshot exposes that API route.

Publish numeric plan prices and allowances only after testing a fully used
allowance against the allowed model mix, provider costs, payment fees, and
target contribution margin. Current prototype values are examples, not
approved launch economics; in particular, the $20/30-million-Credit Plus
example needs validation before it is offered as a real plan.

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
2. If Dollar-balance-first is enabled and the full plan price is available,
   debit the complete price from Dollar balance.
3. Otherwise charge the complete price to the saved card. Do not partially
   debit Dollar balance and charge the remainder to card.
4. If neither source can pay the full price, initial purchase ends without an
   entitlement and renewal enters `past_due`.
5. After confirmed payment, atomically create or finalize exactly one payment
   record, invoice, subscription period, and subscription Credit bucket.
6. Replaying a command or payment-provider webhook with the same idempotency
   key must return the original result without another debit, card charge,
   invoice, period, or allowance grant.
7. On renewal failure, do not create a new period or allowance. Promotional
   Credits and Dollar balance remain available for PAYG.
8. Cancellation changes `active` to `cancel_at_period_end`; resuming before
   period end returns it to `active`. At period end it becomes `ended`.
9. Apply a pending plan change only after the next successful full payment. Do
   not prorate or refund unused allowance as Credits.

An active user may remove the saved card. Renewal then uses Dollar balance only
when Dollar-balance-first is enabled and the full price is available; otherwise
renewal fails and enters `past_due`.

### 4.3 Request And Generation Usage Charging

1. Resolve the account entitlement and verify that the model, route, and
   output modality are eligible for the plan. An ineligible but supported
   model or route may use PAYG under the normal funding rules.
2. For variable-cost text, estimate the maximum from the selected model,
   route, and request limits. For image/video, calculate a firm user-facing
   Credit quote from the selected model, generation path, count, duration,
   resolution, audio, and other billable settings. Show the quote before a UI
   job is submitted; the successful job is charged that quoted amount even if
   the provider's actual cost differs.
3. Check the shared monthly allowance. For text Chat and text API requests,
   also check the 5-hour and weekly text windows. Image/video jobs do not
   consume those text windows; enforce their configured per-job cost and
   concurrency limits instead.
4. Reserve the eligible cost from subscription allowance first. Reserve any
   remainder from eligible free Credits, referral Credits, then Dollar balance
   at the versioned rate. A media UI job that would debit Dollar balance shows
   the amount and requires confirmation before submission. An API key must be
   explicitly configured to allow Dollar-balance overage for media jobs.
5. Reject the request or job before provider execution when funding is
   insufficient, the required overage is not authorized, or a job limit is
   exceeded. PAYG fallback does not bypass hard API-key spending limits.
6. Execute the request or create one image/video job with a stable ID. Keep
   its reservation while Pending, including across a billing-period boundary;
   do not grant or consume a new period's allowance for that job.
7. On successful text completion, convert the metering event to final Credit
   cost and Dollar debit. On a Generated media result, charge the quoted
   Credits exactly once. Reconcile reserved buckets once, release any unused
   text reservation, and create one usage record. A Failed media job produces
   no charge and releases its entire reservation; a retry is a new job with a
   new quote and reservation.
8. Count gross Dollar-equivalent cost against API-key spending limits at the
   versioned rate regardless of funding source and record the native usage
   unit: text tokens, image outputs, or the configured video pricing unit.
9. At 90% of a text window or the shared monthly allowance, create one in-app
   warning per window. At 100%, stop using the applicable allowance until its
   reset; use eligible PAYG funding only under the authorization rule above.
10. Store plan, model-price, limit, and Credit-to-Dollar rate versions so
    later changes do not alter accepted quotes or historical periods.

### 4.4 Media Job Settlement

Studio's Pending, Generated, and Failed states remain the user-facing job
states. Pending jobs hold funds but show no final deduction. Generated jobs
charge the upfront quote; Failed jobs release the hold and show no charge.
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
- Each subscription payment/invoice records: account, plan and plan version,
  billing period, amount and currency, payment source, Dollar-balance debit,
  card charge, provider reference when applicable, status, timestamps, and
  idempotency key.
- Each subscription period records: period ID, start and end timestamps,
  subscription state, plan and limit versions, granted allowance, consumed
  allowance, and linked payment/invoice IDs.
- Each media job records: account, job and provider IDs, route, output modality,
  model and price versions, billable settings, quoted Credits, reserved bucket
  amounts, billing-period ID, status, final usage record ID, and timestamps.

## 5. Payment And Reward Rules

- Card payment support is a prerequisite for subscriptions and automatic
  monthly renewal.
- Store only the payment provider's tokenized payment-method reference. Never
  store raw card details.
- A user can select, replace, or remove the preferred card used for renewal,
  subject to provider capabilities.
- Confirmed top-ups add Dollar balance net of disclosed fees. Dollar balance
  can fund PAYG usage or a full subscription charge.
- The user can choose Dollar-balance-first renewal. A saved card is the
  fallback when that preference is off or the Dollar balance is insufficient.
- Split payment between Dollar balance and card is not supported in this
  version.
- Payment execution, authentication, retries, and card-network behavior follow
  the selected payment provider's interface.
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
- Initial purchase and renewal follow the same full-source payment rule.
- A user can change plan or cancel renewal and see the resulting status.
- A billable request consumes subscription allowance before other credit
  buckets.
- Eligible Chat, API, image, and video requests share one monthly allowance;
  channel and modality views reconcile to the same total, not separate pools.
- Core video uses PAYG; Plus video can consume the shared allowance; an
  unsupported media API route is not implied by subscription coverage.
- When allowance is exhausted, the request can fall back to promotional
  Credits or Dollar balance.
- A request is rejected before provider execution when available funding is
  insufficient.
- Final usage cost is reconciled against the reservation without double
  charging and unused reservation is released.
- An image or video UI job shows a firm Credit quote before submission; a
  Generated result deducts that quote exactly once, while a Failed result
  releases its hold and deducts nothing.
- A Pending video holds the period's reserved allowance across renewal and
  cannot receive a second grant or charge from the next period.
- Text windows do not block image/video jobs; media job and concurrency limits
  are checked separately against the same monthly allowance.
- Dollar-funded media overflow requires UI confirmation or an API-key opt-in;
  hard API-key spending limits still apply.
- Renewal starts a new allowance period without changing historical usage.
- Duplicate commands or provider webhooks cannot create another charge,
  invoice, subscription period, or allowance grant.
- Failed-payment and cancellation states are visible and do not corrupt Dollar
  or Credit balances.
- The UI shows Credit cost, actual Dollar debit, and funding source separately.
- The account menu shows a compact, expandable 5-hour and weekly text-usage
  summary plus shared monthly allowance for active subscription periods.
- Usage provides separate Subscription and PAYG views, feature-level usage and
  pending holds, and text-window reset times.
- A 90% subscription-window warning appears in-app and is not duplicated for
  the same window.
- A fully consumed text window falls back to eligible PAYG without consuming
  additional subscription allowance for text requests.
- A tokenized preferred card can be selected for renewal, and subscription
  invoices are visible separately from PAYG receipts.
- Every successful initial purchase or renewal produces one invoice showing
  whether Dollar balance or card funded it.
- API-key limits use gross Dollar-equivalent cost regardless of funding source.
- A renewal uses the full Dollar balance charge or the full saved-card charge,
  never a split payment.
- The UI never combines Dollars and Credits into one displayed balance.
- Subscription payments do not create referral rewards.

## 7. Deferred Provider And Operations Detail

- Plan price and monthly allowance.
- Exact model and media-route eligibility, firm image/video Credit price
  schedule, and plan-specific media job limits.
- Studio tier price and allowance; defer launch until multimodal cost data is
  available.
- Recurring card billing provider.
- Exact 5-hour and weekly Credit limits; both are versioned configuration.
- Provider-specific payment authentication, retry, and failure behavior.
- Administrative billing operations.

The warning threshold is fixed at 90% for this version. Notifications are
in-app only.

## Version History

| Date | Change |
|---|---|
| 2026-10-12 | Extended one monthly allowance across eligible Chat, API, image, and video; added plan coverage, firm media quotes, Pending-job holds and settlement, feature-level usage, media overage authorization, and separate text windows versus media job limits. |
| 2026-09-21 | Added the canonical subscription state machine, identical initial-purchase and renewal source rules, idempotent payment and allowance creation, minimum billing records, fixed-point precision, card-removal behavior, and payment-source invoices. |
| 2026-09-21 | Replaced funded Credits with a two-unit model: Dollar balance for user funds and subscription payment, Credits for usage and allowances; added Dollar-balance-first renewal with card fallback and no split payment. |
| 2026-09-21 | Moved the compact usage summary from Chat to the account menu and clarified that window availability gates available funding. |
| 2026-09-21 | Added card prerequisites, preferred payment method, invoices, separate PAYG/subscription views, versioned 5-hour and weekly limits, and in-app 90% warnings. Explicitly excluded trials, refunds, and admin operations. |
| 2026-09-21 | Locked the monthly allowance-only model, immediate PAYG fallback, renewal rules, payment rails, API-limit accounting, and referral exclusion. |
| 2026-09-21 | Extracted subscription requirements from the Phase 2 PRD into a standalone document. |
