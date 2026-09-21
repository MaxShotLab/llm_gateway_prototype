# Maxshot Gateway Subscription Feature Requirements

Status: Draft for Phase 2 definition
Updated: September 21, 2026
Parent document: [Phase 2 PRD And Features](./PHASE_2_PRD_AND_FEATURES.md)

## 1. Scope

Phase 2 introduces subscriptions as a second pay-to-use method alongside
pay-as-you-go credits:

```text
Pay-as-you-go credits + optional subscription plan
```

Pay-as-you-go remains the default usage model. A subscription is an optional
account entitlement that provides a configured monthly Credit allowance. It
does not change per-request pricing.

Subscription allowance is usage credit, not withdrawable user funds. It cannot
be redeemed for fiat or crypto or refunded as credits.

## 2. Required User Features

- View available subscription plans.
- Subscribe to a plan.
- Change plan.
- Cancel renewal.
- View the current plan, renewal date, allowance, used amount, and remaining
  amount.
- Apply subscription allowance before paid pay-as-you-go credits.
- Fall back to pay-as-you-go credits when the subscription allowance is
  exhausted, if usable credits remain.
- Block usage when neither subscription allowance nor usable credits can cover
  the request.
- View usage split between subscription allowance and pay-as-you-go credits.
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
- Keep existing pay-as-you-go Credits usable when renewal fails.

## 3. Credit Ledger Requirements

Subscription allowance, free credits, referral rewards, and paid credits must
remain separate ledger buckets. They must not be merged because they have
different sources, expiry rules, and accounting treatment.

| Bucket | Source | Expiry | Consumption order |
|---|---|---|---|
| Subscription allowance | Active plan period | End of billing period | First |
| Free credits | Registered-user grant | Configured policy | Second |
| Referral rewards | Confirmed referral reward | Configured policy | Third |
| Paid credits | User top-up | No expiry | Last |

## 4. Recommended Billing Algorithm

1. Resolve the account entitlement before each billable request.
2. Estimate the maximum required cost from the selected model, route, and
   request limits.
3. Check subscription status and remaining allowance for the current billing
   period.
4. Reserve the estimated cost from subscription allowance first.
5. If the allowance is insufficient, reserve the remainder from usable
   pay-as-you-go credits.
6. Reject the request before provider execution if neither source covers the
   estimated cost.
7. Execute the request through the gateway.
8. Convert the gateway metering event into the final user-facing cost.
9. Reconcile the reservation:
   - deduct actual cost from subscription allowance first;
   - deduct overflow from pay-as-you-go credits;
   - release unused reservation;
   - create exactly one usage record.
10. On renewal, create a new subscription-period ledger bucket. Do not merge
    it with pay-as-you-go credit buckets.
11. On cancellation, keep the current period active until its end and stop the
    next renewal.
12. Apply plan changes at the next renewal. Do not prorate or refund unused
    allowance as Credits.
13. On failed renewal payment, do not create a new allowance bucket. Existing
    free, referral, and paid Credits remain usable immediately.
14. Count the gross Credit cost of each API request against API-key spending
    limits regardless of which ledger bucket funds the request.
15. Before using subscription allowance, check the configured 5-hour, weekly,
    and billing-period limits. The available subscription amount is the lowest
    remaining amount across those windows.
16. When a subscription window reaches 90%, create one in-app warning for that
    window. When it reaches 100%, stop using subscription allowance until its
    reset and fall back to pay-as-you-go Credits when available.
17. Store the plan and limit configuration version on each subscription period
    so later protocol changes do not alter historical limits or usage.

## 5. Payment And Reward Rules

- Card payment support is a prerequisite for subscriptions and automatic
  monthly renewal.
- Store only the payment provider's tokenized payment-method reference. Never
  store raw card details.
- A user can select, replace, or remove the preferred card used for renewal,
  subject to provider capabilities.
- Payment execution, authentication, retries, and card-network behavior follow
  the selected payment provider's interface.
- Crypto remains a one-time pay-as-you-go top-up method. A crypto-funded plan,
  if added later, is a manually renewed pass rather than an auto-renewing
  subscription.
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
- A user can change plan or cancel renewal and see the resulting status.
- A billable request consumes subscription allowance before other credit
  buckets.
- When allowance is exhausted, the request can fall back to usable
  pay-as-you-go credits.
- A request is rejected before provider execution when available funding is
  insufficient.
- Final usage cost is reconciled against the reservation without double
  charging and unused reservation is released.
- Renewal starts a new allowance period without changing historical usage.
- Failed-payment and cancellation states are visible and do not corrupt
  pay-as-you-go balances.
- The UI shows the source of each consumed unit: subscription or credits.
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
- API-key limits use gross Credit cost regardless of funding source.
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
| 2026-09-21 | Moved the compact usage summary from Chat to the account menu and clarified that window availability gates the combined usable balance. |
| 2026-09-21 | Added card prerequisites, preferred payment method, invoices, separate PAYG/subscription views, versioned 5-hour and weekly limits, and in-app 90% warnings. Explicitly excluded trials, refunds, and admin operations. |
| 2026-09-21 | Locked the monthly allowance-only model, immediate PAYG fallback, renewal rules, payment rails, API-limit accounting, and referral exclusion. |
| 2026-09-21 | Extracted subscription requirements from the Phase 2 PRD into a standalone document. |
