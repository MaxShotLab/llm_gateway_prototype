# Maxshot provider onboarding: launch minimum

**Status:** Revised product proposal, 12 November 2026. Assumes the Gateway already has customer authentication, model selection, multi-provider routing, cost authorization, usage metering, and billing. This document defines only what is needed to plug another provider into those existing abilities.

## Decision

The first draft was too broad for a quick launch. A provider is **launch-ready** when Maxshot can identify it, configure at least one verified model offering, execute and meter a real request through the existing Gateway, charge the customer once, account for provider cost, and disable the offering when it fails. A self-service provider portal, automated benchmarks, ranking engine, and provider-token features are not part of this gate.

## 1. Six launch gates

| Gate | Minimum evidence | Owner |
| --- | --- | --- |
| 1. Commercial and data permission | Provider identity/contact, accepted terms or contract, right to route/resell the selected model, allowed regions and retention policy, payout terms | Business/operations |
| 2. Working connection | Endpoint, authentication stored as a secret, rate limits, timeout, and a successful authenticated call through the Gateway's existing provider interface | Engineering |
| 3. Verified offering | Stable provider ID and endpoint variant, native model ID/version and material variant (such as quantization or service tier), customer-facing model mapping, supported modality/controls, context or output limits, provider price and unit, effective price version | Product + engineering |
| 4. Contract test | Representative successful call, advertised controls, invalid request, rate limit, timeout, streaming or job completion when offered, model-identity check, and proof that unsupported parameters are rejected rather than silently ignored | Engineering |
| 5. Metering and settlement | Provider request ID, billable usage units, provider cost under the agreed rate card, one customer charge under the accepted customer price; a manual invoice reconciliation process is sufficient initially | Finance + engineering |
| 6. Safe operation | Offering can be enabled, disabled, and removed from eligible routes without code deployment; failed/unhealthy offerings stop receiving new traffic; support has a provider contact and request trace | Operations + engineering |

These gates apply **per offering**. One provider may launch with one text model while its media offerings remain unverified. Discovery of additional models does not publish them automatically. A model name alone does not establish version or capability equivalence. A declared provider readiness flag may pause an offering, but it cannot bypass Maxshot approval.

## 2. Smallest plug-in contract

Use the Gateway's existing provider adapter if it can represent the offering. Add a provider-specific adapter only for protocol differences. No new public customer API or provider self-service API is required.

```text
Configuration: provider_id, endpoint/secret reference, native_model_id,
  verified_model_version, customer_model_id, capabilities, region/retention,
  provider_rate_card_version, limits, enabled/disabled status.

Input to provider: request_id, attempt_id, native_model_id, supported
  parameters, timeout, provider cost ceiling.

Result from provider: native_request_id, completed/failed status, normalized
  output or error class, billable usage with units, timing.
```

For streaming, the adapter must identify a terminal success or failure and return final usage. For asynchronous image/video, it must identify the job and terminal status; this is required **only if that offering is launched**. If final usage is delayed or missing, keep the charge pending reconciliation rather than inventing billable units. Routine telemetry stores IDs and metrics, not prompt or output content.

When an upstream such as OpenRouter itself routes among underlying endpoints, its adapter must either pin the approved endpoint or constrain the upstream choice to verified equivalent endpoints that satisfy Maxshot's parameters, data policy and provider-cost ceiling. Disable upstream cross-model fallback unless Maxshot has independently authorized those backup models. Capture the actual serving endpoint where the upstream reports it. This prevents a second router from silently undoing Maxshot's offering approval.

## 3. Routing and accounting rules

1. An offering is eligible only if it is enabled, verified for the requested model/version and controls, permitted by the account and data policy, healthy, and within the authorized customer charge and provider cost ceilings.
2. For a customer-selected model, use the existing decided default: lowest quoted provider cost among qualified offerings. An explicitly pinned offering stays pinned. Score-based Auto selection follows its separate product design.
3. A retry or permitted failover uses a new attempt ID under the same Maxshot request ID. It must preserve the customer-facing model/version and required controls and stay inside the original charge ceiling. If this cannot be done, return an error.
4. The customer is charged **once** from the accepted customer price and verified usage. Provider cost and customer charge remain separate records. Duplicate callbacks, retries, and invoice corrections cannot create another customer deduction.
5. A provider price, model version, capability, or data-policy change makes the affected offering ineligible until its record is reviewed. Other verified offerings can continue.

## 4. Minimum measurement

Measure each **provider-model offering**, not just the provider. The launch dashboard or operations report needs only these four measures:

| Measure | Calculation | Launch use |
| --- | --- | --- |
| Delivered success | Valid completed attempts / dispatched attempts excluding customer cancellations and user-input errors; count provider setup errors, 5xx, malformed output, mid-stream failure and timeouts as failures; show 429 capacity rejects separately | Disable or investigate failing routes |
| Latency | p50 and p95 dispatch-to-first-token for streaming text, or dispatch-to-completion for other modes; show sample count | Compare against the offering's agreed limit |
| Metering completeness | Terminal attempts with verified billable units / terminal attempts | Block final settlement when usage is missing |
| Cost reconciliation | Sum of per-attempt provider cost plus recorded corrections versus provider invoice | Explain every payout difference before payment |

Keep raw attempt IDs, status/error class, native request ID, time, usage units, rate-card version, calculated provider cost, and customer charge so these measures can be recomputed. If traffic is too small for a meaningful percentile, show the sample count and use a simple scheduled test call as a health signal. Numeric latency and success floors are set per offering before it is enabled; a universal threshold across text, image, and video would be misleading.

**External design reference:** OpenRouter separates model choice from provider choice and filters providers by required parameters, data policy and price ceiling. Its provider integration also records endpoint capabilities, prices, capacity and readiness. Maxshot adopts those checks, while keeping manual approval of each offering. See [routing overview](https://openrouter.ai/blog/insights/model-routing/), [provider-selection controls](https://openrouter.ai/docs/guides/routing/provider-selection), and [provider integration](https://openrouter.ai/docs/guides/providers/integration).

## 5. Fast launch sequence and acceptance

1. Configure one provider and one offering. Verify permission, model identity, capabilities, price, and policy.
2. Pass the small contract test, then enable a limited volume or spend-capped cohort.
3. Confirm a real request produces a traceable provider attempt, valid usage, one customer charge, and a provider-cost record.
4. Exercise timeout, provider error, duplicate callback, and manual disable. Confirm no duplicate charge and no new dispatch to the disabled offering.
5. Reconcile the first provider statement/invoice to attempt records before paying it.

**Acceptance:** A second provider can be added through the same Gateway route and billing flow without changing customer-facing request semantics. A failing or changed offering can be removed from routing promptly.

## Later, after launch evidence

Automated benchmark suites, large-sample quality scoring, synthetic monitoring fleets, provider self-service application and payout portals, public provider rankings, commercial routing boosts, and provider tokens can follow. Stable IDs and versioned offering/price records preserve room for those features.

## Live-enable inputs

Before enabling each offering, operations must supply the actual provider, model mapping, rate card, permitted region/retention, numeric service limits, contact, and payout terms. These are provider-specific inputs, not a reason to build a larger onboarding platform first.
