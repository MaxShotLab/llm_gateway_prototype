# Maxshot Gateway Subscription Feature Requirements

Status: Draft for Phase 2 definition
Updated: September 21, 2026
Parent document: [Phase 2 PRD And Features](./PHASE_2_PRD_AND_FEATURES.md)

## 1. Scope

Phase 2 introduces subscriptions as a second pay-to-use method alongside
pay-as-you-go:

```text
Dollar-funded pay-as-you-go + optional subscription plan
```

Pay-as-you-go remains the default usage model. A subscription is an optional
account entitlement that provides a configured monthly Credit allowance. It
does not change per-request pricing.

Maxshot uses two units: Dollars represent user-funded value; Credits measure
LLM usage and allowances. They must never be combined into one balance.
Subscription allowance is usage Credit, not withdrawable user funds. It cannot
be redeemed for fiat or crypto or refunded as Credits.

## 2. Required User Features

- View available subscription plans.
- Subscribe to a plan.
- Change plan.
- Cancel renewal.
- View the current plan, renewal date, allowance, used amount, and remaining
  amount.
- Apply subscription allowance before promotional Credits and Dollar balance.
- Fall back to free Credits, referral Credits, then Dollar balance when the
  subscription allowance is exhausted.
- Block usage when no eligible Credit allowance or Dollar balance can cover the
  request.
- View Credit cost and actual Dollar debit separately.
- View configurable 5-hour and weekly subscription limits, usage, remaining
  allowance, and reset times.
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

### 4.3 Request Usage Charging

1. Resolve the account entitlement before each billable request.
2. Estimate the maximum required cost from the selected model, route, and
   request limits.
3. Check subscription status and remaining allowance for the current billing
   period.
4. Reserve the estimated cost from subscription allowance first.
5. If the allowance is insufficient, reserve the remainder from free Credits,
   referral Credits, then Dollar balance at the versioned request rate.
6. Reject the request before provider execution if the combined eligible
   sources cannot cover the estimated cost.
7. Execute the request and convert its metering event into final user-facing
   Credit cost and Dollar debit.
8. Reconcile the reservation once: deduct actual subscription Credits first,
   deduct overflow from promotional Credits then Dollar balance, release unused
   reservation, and create exactly one usage record.
9. Count gross Dollar-equivalent cost against API-key spending limits at the
   versioned request rate regardless of funding source.
10. Gate subscription usage by the lowest remaining amount across 5-hour,
    weekly, and billing-period limits.
11. At 90% of a subscription window, create one in-app warning. At 100%, stop
    using subscription allowance until reset and use PAYG funding when
    available.
12. Store plan, limit, and Credit-to-Dollar rate versions so later changes do
    not alter active or historical periods.

### 4.4 Precision And Minimum Records

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
- When allowance is exhausted, the request can fall back to promotional
  Credits or Dollar balance.
- A request is rejected before provider execution when available funding is
  insufficient.
- Final usage cost is reconciled against the reservation without double
  charging and unused reservation is released.
- Renewal starts a new allowance period without changing historical usage.
- Duplicate commands or provider webhooks cannot create another charge,
  invoice, subscription period, or allowance grant.
- Failed-payment and cancellation states are visible and do not corrupt Dollar
  or Credit balances.
- The UI shows Credit cost, actual Dollar debit, and funding source separately.
- The account menu shows a compact, expandable 5-hour and weekly subscription
  usage summary for active subscription periods.
- Usage provides separate Subscription and PAYG views and shows window reset
  times.
- A 90% subscription-window warning appears in-app and is not duplicated for
  the same window.
- A fully consumed subscription window falls back to PAYG without consuming
  additional subscription allowance.
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
- Recurring card billing provider.
- Exact 5-hour and weekly Credit limits; both are versioned configuration.
- Provider-specific payment authentication, retry, and failure behavior.
- Administrative billing operations.

The warning threshold is fixed at 90% for this version. Notifications are
in-app only.

## Version History

| Date | Change |
|---|---|
| 2026-09-21 | Added the canonical subscription state machine, identical initial-purchase and renewal source rules, idempotent payment and allowance creation, minimum billing records, fixed-point precision, card-removal behavior, and payment-source invoices. |
| 2026-09-21 | Replaced funded Credits with a two-unit model: Dollar balance for user funds and subscription payment, Credits for usage and allowances; added Dollar-balance-first renewal with card fallback and no split payment. |
| 2026-09-21 | Moved the compact usage summary from Chat to the account menu and clarified that window availability gates available funding. |
| 2026-09-21 | Added card prerequisites, preferred payment method, invoices, separate PAYG/subscription views, versioned 5-hour and weekly limits, and in-app 90% warnings. Explicitly excluded trials, refunds, and admin operations. |
| 2026-09-21 | Locked the monthly allowance-only model, immediate PAYG fallback, renewal rules, payment rails, API-limit accounting, and referral exclusion. |
| 2026-09-21 | Extracted subscription requirements from the Phase 2 PRD into a standalone document. |
