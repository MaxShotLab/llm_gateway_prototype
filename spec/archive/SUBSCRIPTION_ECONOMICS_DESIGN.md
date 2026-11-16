# Maxshot Subscription Economics Design

**Status:** Agreed pricing principles; commercial prices and allowances require validation.
**Scope:** Core and Plus subscription pricing relative to PAYG and plan-level contribution. The subscription lifecycle, two-unit ledger, and charging order remain defined by [Subscription Feature Requirements](./SUBSCRIPTION_FEATURE_REQUIREMENTS.md).

## Product offer

- PAYG remains available without a subscription. PAYG and subscription use the same published Credit price for a given request; there is no subscription-only per-request discount.
- Core and Plus each grant a capped monthly **Basic Chat** allowance and a separate capped **Premium** allowance. Basic Chat is limited to eligible low-cost web Chat models; Premium covers eligible Chat, API, image, and, for Plus, video. Core video uses PAYG only.
- Subscription value comes from included allowances and predictable monthly spend. The restricted Basic Chat allowance should carry most of the apparent usage advantage; the flexible Premium allowance must be sized against its higher possible provider cost.
- Neither allowance is cash, withdrawable value, or an unlimited-use promise. Unused allowances expire at period end under the subscription requirements.

## Launch pricing test

For each plan version, model the highest provider cost of fully consuming **both** allowances under every permitted model and route mix, including long-context Chat, media settings, retries, independently billable operations, and applicable text/media limits. Do not price from average subscriber usage alone.

```text
Minimum contribution at full use =
  plan price
  - payment and collection fees
  - worst-case provider cost of Basic Chat allowance
  - worst-case provider cost of Premium allowance
  - operating and incident reserve
```

**Launch rule:** the result must meet an approved non-negative contribution floor for Core and Plus independently. If it does not, adjust the plan price, allowances, eligible models/routes, context/output caps, or media limits before launch. Do not rely on subscriber underuse to make the plan viable. Also test heavy-user cohorts and realistic average-use scenarios to understand expected contribution; they do not replace the full-use test.

If PAYG pricing currently has little or no inference margin, a subscription cannot safely offer more *unrestricted Premium usage* than its net plan proceeds can support. The economic advantage must primarily come from bounded Basic Chat usage on demonstrably low-cost models, not from assuming Premium Credits will go unused.

## Revenue and reporting

- Separate plan payments from PAYG usage charges and top-ups. A Dollar-balance-funded subscription payment consumes an existing user liability; it is not another cash receipt after the original top-up.
- Track plan payments, allowance grants, held and settled usage, provider cost, payment fees, expired unused allowances, and contribution by plan version and subscriber cohort. Keep Basic and Premium provider cost visible separately.
- Treat unused allowances as a contribution upside, not a launch-pricing dependency. Finance determines revenue-recognition treatment; this product design does not prescribe when accounting revenue is recognized.
- Subscription payments do not create referral rewards. PAYG fallback remains a separate charge path and must not be counted as subscription allowance consumption.
- New purchases use the current plan version. Existing periods keep their price, allowances, eligibility, and limits until renewal; adverse changes require advance in-app notice as specified in the subscription requirements.

## Approval checks

- Publish numeric plan prices and allowances only after provider-cost simulation and approval. Prototype values are not launch prices.
- Verify full-use contribution for Core and Plus separately, including the most expensive eligible model/route and media mix.
- Verify user-facing examples show the same request Credit price under PAYG and subscription and make each plan's allowance restrictions clear.
- Monitor realized contribution and high-usage cohorts after launch; suspend new sales or revise future plan versions if the full-use floor is no longer met.

## Open parameters

- Core and Plus prices, both monthly allowances, model/route eligibility, text windows, and media limits.
- Approved contribution floor and operating/incident reserve.
- Current provider costs and payment fees used in the launch simulation.

## Version history

| Date | Change |
|---|---|
| 2026-11-04 | Documented the agreed full-use contribution rule, PAYG comparison, and non-reliance on unused allowances. |
