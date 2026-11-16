# Provider admission and safe routing handoff (B4)

**Status:** Development integration acceptance, 15 November 2026. This organizes approved launch rules into proof scenarios. It does not set provider-specific operating thresholds or claim that production provider connections have been tested in this checkout.

**Authority:** [Provider launch minimum](./PROVIDER_INTEGRATION_MINIMUM_STANDARD.md), [multi-provider routing design](./MULTI_PROVIDER_ROUTING_DESIGN.md), [frontend catalog contract](./PROVIDERS_FRONTEND_DATA_CONTRACT.md), and [addendum TD-26–35/37/39/41](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md). The [B2 handoff](./REQUEST_AUTHORIZATION_SETTLEMENT_HANDOFF.md) owns the shared customer authorization and settlement lifecycle.

## Admission boundary

An **offering** is one approved provider endpoint/variant serving one verified model version with its own capabilities, policies, limits, customer rate card, and internal provider cost card. Approval belongs to the offering; a provider's other models do not inherit it. One admitted and available route is enough to publish a customer model. Two offerings may share a customer model ID only after Maxshot verifies the same model version and required capabilities. If its only route becomes unavailable, remove the model from new-request pickers and reject new API use; retain readable history.

Engineering and operations retain the [minimum evidence packet](./PROVIDER_INTEGRATION_MINIMUM_STANDARD.md#5-minimum-onboarding-proof) for **each** enabled offering:

| Gate | Acceptance evidence |
| --- | --- |
| Permission and identity | Approved right to serve/resell the exact model, provider contact, allowed regions/retention, and payout terms; stable provider, native model/version/variant, customer model, and offering IDs. |
| Connection and controls | Secret-backed authenticated call through the Gateway provider interface; supported parameters, modality, limits, streaming or media-job completion where offered. Unsupported controls are rejected. |
| Prices and admission | Effective, versioned customer and provider rates with units; repeatable scripted identity, valid-output, usage/price, invalid-input, 429 and timeout checks; manual output-quality review. |
| Metering and charge | One live request links the provider attempt/native request ID, verified billable units, provider cost, funding authorization, and exactly one final customer charge. Missing final usage holds settlement for reconciliation. |
| Safe operation | Manual enable/disable without deployment, health backoff, and a trace that proves a disabled or ineligible offering receives no new request. Changes to version, material capability, price or data policy require review before reuse. |

An upstream router counts as one approved offering only when its actual endpoint is pinned, its own provider/cross-model fallback is disabled, and its controls, data policy, cost ceiling and serving-endpoint trace can be verified. Otherwise it is ineligible for automatic routing or backup. The first provider statement is reconciled against append-only attempt/cost/correction records **before payout**, not before the first controlled request.

## Routing and billing proof

Use **two admitted offerings for one verified equivalent model** to prove the common route once. A second route is not required for every published model. Capture the accepted catalog, policy and rate versions and the selected and serving offering for each case. The internal identifier/schema is an engineering choice; records must still join attempts to the single customer charge.

| Scenario | Required result |
| --- | --- |
| Unpinned selected model; both offerings qualified | Select the lowest request-specific quoted provider cost; break an exact tie by stable offering ID. Model/version, controls, account eligibility, region/data policy, health and both cost ceilings are hard gates. |
| Customer pins one offering | Use that offering if qualified; otherwise return unavailable. No automatic provider or model switch. |
| Unpinned first attempt fails with 429, 5xx, connection failure or timeout **before** visible output | Try at most one other verified equivalent offering if it preserves controls and policy and fits the original authorized customer maximum and aggregate provider-cost ceiling. Record both attempts and the actual serving offering/rate; settle the customer once. If no backup qualifies, return an error. |
| Failure after visible stream output, or uncertain acceptance of a media job | Do not retry or resubmit automatically. Preserve the partial/uncertain attempt and reconcile usage and provider cost under the B2 lifecycle. |
| Unsupported parameter, changed model version, changed rate/policy, disabled or unhealthy offering | Reject or remove the affected offering from new routing until reapproved. Do not silently strip controls or substitute another model. |
| Duplicate callback, provider invoice correction or dispute | No second customer debit. Preserve append-only provider attempt, cost, correction and dispute records; reconcile the first statement before payout. |

Chat and Studio show the selected offering's server estimate and hard authorized maximum before submission. The single-call API authorizes internally before dispatch. The maximum includes any permitted backup's customer rate; the final charge uses the **serving** offering's published rate and verified units and cannot exceed the accepted maximum. Usage exposes selected/serving offerings, rate version, fallback, verified units, funding and one final charge under B2. Provider cost and invoice detail remain internal.

## Measurement and customer display

Operations measures delivered success, p50/p95 latency, metering completeness and cost reconciliation **per offering** under the [launch minimum](./PROVIDER_INTEGRATION_MINIMUM_STANDARD.md#4-minimum-measurement). Track 429 separately and exclude customer cancellations/user-input errors from delivered-success denominator. The Providers profile shows Maxshot-observed success and latency with window and sample count only when the sample is sufficient; otherwise it says **Insufficient data** with the count. Models & Pricing compares complete customer rate cards by provider, without presenting internal costs or a blended model price.

Before live enablement, operations supplies each offering's actual provider/model mapping, rates, region/retention, service limits, health and sample thresholds, provider-cost ceiling, contact, and payout terms. These values are configuration and evidence inputs, not missing product behavior decisions. Provider Tokens do not affect launch routing.

## Current evidence and limit

The prototype demonstrates provider profiles, simulated admission/availability, equivalent offerings with different customer prices, Models & Pricing, and a sample selected-versus-serving fallback in Usage. It does not prove authenticated provider calls, upstream endpoint pinning, live health backoff, immutable attempt/cost records, or invoice reconciliation. Production B4 closes only when the per-offering packets and shared-routing cases above pass against the live Gateway.
