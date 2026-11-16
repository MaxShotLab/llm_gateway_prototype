# Request authorization and settlement handoff (B2)

**Status:** Development acceptance contract, 15 November 2026. This consolidates approved request behavior; it does not define a new product feature or mandate internal tables, endpoint names, or identifier formats. The production Gateway and ledger are not in this checkout.

**Authority:** [Decision addendum TD-15/19/34/37/39](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md), [subscription charging §4.3](../SUBSCRIPTION_FEATURE_REQUIREMENTS.md#43-request-and-generation-usage-charging), [multi-provider routing](./MULTI_PROVIDER_ROUTING_DESIGN.md), and the [shared catalog contract](./PROVIDERS_FRONTEND_DATA_CONTRACT.md). The read-only token source PRD remains unchanged.

## One accepted request

| Stage | Required behavior | Acceptance evidence |
| --- | --- | --- |
| Select | Resolve the exact customer `modelId`, requested capabilities, account/key limits, current catalog assignment and qualified offerings. A provider pin permits only that offering. | The accepted decision identifies the selected offering, catalog and policy versions, and any permitted same-model backup. A disallowed model/route stops before provider dispatch. |
| Quote and authorize | From bounded text/media settings and every permitted serving rate, compute an informative estimate and a **hard maximum customer charge**. Chat/Studio show selected offering, rate version, estimate and maximum before submission. API uses a single call with published rates and an optional caller ceiling. | The API rejects an unaffordable or over-ceiling request before dispatch. No separate public quote-confirm endpoint is required. |
| Reserve | Hold the **full maximum** across eligible AIT Earned Credit grants, subscription allowances, Free Credits, Referral Credits and Dollar balance in that order. Keep each source and original expiry. | One authorization has a source-by-source maximum hold; concurrent requests cannot overspend or create a negative balance. |
| Dispatch and fallback | A chosen-model request may use one qualified same-model backup only after a pre-output provider fault and only within the accepted customer/provider ceilings. An explicit offering pin never falls back. Never retry after customer-visible output or resubmit an uncertain accepted media job. | Every attempt is traceable to the same accepted request. Selected and actual serving offering, failure reason and rate version can be reconstructed without duplicate output. |
| Settle | Meter verified billable units once, apply the **actual serving offering's** rate, and cap the customer debit at the accepted maximum. Release unused holds to their original sources and expiry. Record provider cost separately. | Usage shows selected versus serving offering, fallback, verified units, accepted maximum, final charge, used buckets and released hold. A provider overrun is a platform/provider discrepancy, never a later customer debit. |
| Reverse | For a provider-fault or overcharge refund after settlement, reverse the affected charge once. Restore an AIT Earned Credit portion as a new seven-day grant and the Dollar-funded portion to Dollar balance; other buckets follow their own terms. | Repeated reversal events do not duplicate Credit or USD restoration; the reversal traces to the settled usage. |

Engineering may use a request ID and attempt IDs to correlate these records; the identifier and storage design are implementation choices. The **product acceptance** is that an operator and user-facing Usage detail can reconcile one accepted request, its attempts, one customer charge, provider payable, release and any reversal. Prompt and output content need not enter routine billing telemetry.

## Minimum production proof

1. **Ordinary mixed-bucket request:** An eligible text or media call reserves the full maximum across at least two eligible sources, settles once within the ceiling, releases unused amounts to the exact original buckets/expiries, and matches the user's Usage detail to the funding and provider ledgers.
2. **Same-model fallback with a different customer rate:** The first offering fails before output; one qualified backup serves the verified same model. The final charge uses the backup's rate and units, stays within the original maximum, and appears once in Usage. Repeat with an explicit offering pin and prove no fallback.
3. **Pre-dispatch rejection:** Insufficient funding, a disallowed model/capability, or an API caller ceiling below the computed maximum causes no provider attempt and no durable customer debit.
4. **Late or duplicate events:** Duplicate settlement/reversal callbacks leave one customer charge and one applicable refund. An in-flight request keeps its accepted catalog, policy and rate versions after a catalog refresh.
5. **Media and overrun boundary:** A failed/undelivered output has no generation charge; delivered outputs and independently billable completed preprocessing settle only within the accepted maximum. Verified provider usage above that maximum creates a separate discrepancy, not extra customer debit.

Use one real funded Gateway request and one controlled failure to prove the transaction-to-Dollar-balance path and customer/provider reconciliation. Operational rate values, provider-cost ceilings, and deployment configuration remain separate inputs.

## Prototype evidence and limit

The local Chat example shows an illustrative selected offering/rate, estimate, maximum and source hold before mock send. A completed Claude example appears in Credits → Usage: `or-sonnet` is selected, `b-sonnet` serves after a simulated pre-output failure, the maximum hold is **1,500 Credits** (500 hypothetical AIT Earned Credit + 1,000 Premium), verified units are 1,000 input/700 output tokens, the final charge is **1,335 Credits** (500 + 835), and **165 Premium Credits** return to their original bucket. Studio shows image/video pre-submit examples. No real provider call, reserve, debit, refund, API authorization, or backend reconciliation occurs in this prototype. The fixture's `100,000 Credits/$1` conversion is illustrative, not a funded-term or retail rate.
