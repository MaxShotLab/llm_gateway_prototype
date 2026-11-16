# Maxshot provider onboarding: launch minimum

**Status:** Launch product rules partly confirmed, 12 November 2026. Assumes the Gateway already has customer authentication, model selection, multi-provider routing, cost authorization, usage metering, and billing. This document defines only what is needed to plug another provider into those existing abilities.

**Frontend handoff:** [Providers frontend data contract](./PROVIDERS_FRONTEND_DATA_CONTRACT.md) maps admitted offerings, customer rates, and observed evidence to the unified Providers UI.

## Decision

The first draft was too broad for a quick launch. A provider is **launch-ready** when Maxshot can identify it, configure at least one verified model offering, execute and meter a real request through the existing Gateway, charge the customer once, account for provider cost, and disable the offering when it fails. A self-service provider portal, continuous benchmark platform, ranking engine, and provider-token features are not part of this gate. A small scripted admission test **is** required for each offering.

## 1. Six launch gates

| Gate | Minimum evidence | Owner |
| --- | --- | --- |
| 1. Commercial and data permission | Provider identity/contact, accepted terms or contract, right to route/resell the selected model, allowed regions and retention policy, payout terms | Business/operations |
| 2. Working connection | Endpoint, authentication stored as a secret, rate limits, timeout, and a successful authenticated call through the Gateway's existing provider interface | Engineering |
| 3. Verified offering | Stable provider ID and endpoint variant, native model ID/version and material variant (such as quantization or service tier), customer-facing model mapping, supported modality/controls, context or output limits, provider price and unit, effective price version | Product + engineering |
| 4. Scripted admission test | Repeatable test of model identity, advertised controls, valid output, usage and price, invalid request, rate limit, timeout, and streaming or job completion when offered; unsupported parameters are rejected rather than silently ignored. Review output quality manually. | Engineering + product |
| 5. Metering and settlement | Provider request ID, billable usage units, provider cost under the agreed rate card, one customer charge under the accepted customer price; append-only attempt/cost/correction/dispute records and manual invoice reconciliation | Finance + engineering |
| 6. Safe operation | Offering can be enabled, disabled, and removed from eligible routes without code deployment; failed/unhealthy offerings stop receiving new traffic; support has a provider contact and request trace | Operations + engineering |

These gates apply **per offering**. One provider may launch with one text model while its media offerings remain unverified. Discovery of additional models does not publish them automatically. A model name alone does not establish version or capability equivalence. A declared provider readiness flag may pause an offering, but it cannot bypass Maxshot approval.

One verified route is enough to publish a customer-facing model at launch. A second qualified route is preferred for resilience, not required. If its sole route fails, mark the model unavailable rather than replacing it with another model without authorization.

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

When an upstream such as OpenRouter itself routes among underlying endpoints, pin its approved endpoint and disable upstream fallback at launch so Maxshot can enforce the one-backup limit across the full request. Require supported parameters, data policy and provider-cost ceiling; disable upstream cross-model fallback. Capture the actual serving endpoint where the upstream reports it. If an upstream cannot enforce these constraints, do not use it as an automatically selected backup. This prevents a second router from silently undoing Maxshot's offering approval.

## 3. Routing and accounting rules

1. An offering is eligible only if it is enabled, verified for the requested model/version and controls, permitted by the account and data policy, healthy, and within the authorized customer charge and provider cost ceilings.
2. For a customer-selected model, use the existing decided default: lowest quoted provider cost among qualified offerings. An explicitly pinned offering stays pinned. Score-based Auto selection follows its separate product design.
3. An unpinned request may try at most one verified equivalent provider offering for the same model/version after a 429, 5xx, connection failure or timeout before customer-visible output. A pinned offering never falls back automatically. Each attempt uses a new attempt ID under the same Maxshot request ID; the backup must preserve required controls and data policy and fit the original customer charge and aggregate provider-cost ceilings. If it cannot, return an error. Cross-model fallback is off at launch.
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

### Customer-facing offering evidence

The Providers page owns provider profiles, approved model/version and capabilities, current enabled/available state, and admission-test status. Once enough Maxshot-observed attempts exist, show delivered success and p50/p95 latency per offering with the measurement window and sample count, using first-token latency for streaming text and completion latency for other modes. If the sample is too small, show **Insufficient data** and the count instead of a percentile or ranking. Label prototype values simulated; do not present provider claims or scripted admission results as observed production performance. Providers → Models & Pricing compares provider-specific customer rates for the selected model without duplicating performance details. Metering completeness, provider costs, invoice reconciliation, 429 counts, and attempt traces remain in operations reporting.

**External design reference:** OpenRouter separates model choice from provider choice and filters providers by required parameters, data policy and price ceiling. Its provider integration also records endpoint capabilities, prices, capacity and readiness. Maxshot adopts those checks, while keeping manual approval of each offering. See [routing overview](https://openrouter.ai/blog/insights/model-routing/), [provider-selection controls](https://openrouter.ai/docs/guides/routing/provider-selection), and [provider integration](https://openrouter.ai/docs/guides/providers/integration).

## 5. Minimum onboarding proof

Keep one small, repeatable evidence packet **per offering**. A provider may launch with one admitted offering; its other models do not inherit approval.

| Packet item | Evidence to retain |
| --- | --- |
| Permission | Reference to approved right to serve/resell this exact model, allowed region and data policy, provider contact, and payout terms. |
| Offering record | Stable provider, customer model, and offering IDs; exact native version/variant; verified controls and limits; effective customer and provider rate-card versions. |
| Live call | One authenticated Gateway request with valid output and verified billable usage; keep request and attempt IDs, not routine prompt/output content. |
| Billing trace | The same request links the provider attempt, provider cost, funding reservation, and exactly one final customer charge. |
| Failure and disable | Scripted unsupported-parameter rejection, rate-limit and timeout handling, duplicate settlement/callback safety, and manual disable; no new request reaches the disabled offering. |

Review the scripted result and output quality manually, then enable a limited-volume or spend-capped cohort. If an upstream routes internally, retain proof that its approved endpoint is pinned and its own fallback is disabled. Reconcile the **first provider statement** against append-only attempt and cost records before payment; link corrections or disputes rather than editing history. The first invoice is a settlement checkpoint, not a prerequisite to the first controlled request.

**Platform proof, once for multi-provider routing:** Admit a second provider offering for the **same verified model/version and required capabilities** through the same packet. Show lowest-qualified-cost selection, preservation of an explicit provider pin, and at most one pre-output fallback after an allowed failure. The backup must remain within the original customer and provider cost ceilings, keep the same Maxshot request ID, and yield one customer charge. This proves the common route and billing flow; a second offering is **not** required for every published model.

## Later, after launch evidence

Continuous benchmark suites, large-sample quality scoring, synthetic monitoring fleets, automated provider payouts, provider self-service application and settlement portals, public provider rankings, commercial routing boosts, and provider tokens can follow. Stable IDs and versioned offering/price records preserve room for those features.

## Live-enable inputs

Before enabling each offering, operations must supply the actual provider, model mapping, rate card, permitted region/retention, numeric service limits, contact, and payout terms. These are provider-specific inputs, not a reason to build a larger onboarding platform first.
