# SPEC_BILLING — request authorization, funding, settlement and API keys

**Status:** Canonical specification, 16 November 2026. Merges the former B2 request authorization/settlement handoff with decisions TD-15/19/34/37/39/40 and the 16 November decisions TD-44/46/47/48/49/56 ([DECISIONS.md](./DECISIONS.md)). Subscription plan rules remain in [SUBSCRIPTION.md](./SUBSCRIPTION.md); AIT Earned Credit grant arithmetic in [SPEC_TOKEN §4](./SPEC_TOKEN.md#4-staking-and-ait-earned-credit); catalog and routing in [SPEC_PROVIDERS](./SPEC_PROVIDERS.md). This file does not mandate tables, endpoint names or identifier formats.

**Release:** Foundation (build-order step 2) with Dollar balance and subscription buckets; the AIT Earned Credit bucket is added in the MAX/AIT release (step 8) and must change only hold/spend order (TD-43).

## 1. Ledgers

- **Dollar balance (USD):** user-funded value from confirmed top-ups via the Gateway's existing crypto-deposit flow (TD-25; live transaction-to-balance path to be verified). Pays PAYG charges or a full subscription payment.
- **Credits:** integer off-chain allowances, each its own bucket with its own terms and expiry: **AIT Earned Credit**, **Basic-chat allowance**, **Premium allowance**, **Free Credits**, **Referral Credits**. No bucket is cash. A versioned Credits-per-USD rate (1,000,000 Credits = $1, the live Gateway unit, TD-53) applies only where a grant, reward or charge requires conversion.
- Store Credits as integers, funded balances and limits as integer cents, sub-cent debits as integer microdollars; never floating-point ledger arithmetic. Store the rate and rounding version used for every conversion ([SUBSCRIPTION §4.5](./SUBSCRIPTION.md)).

## 2. Funding buckets and eligibility

Eligibility per bucket and product (TD-47). "Catalog" is the model's current catalog assignment at authorization (TD-23); "label" is the Gateway-supplied Basic/Premium Chat label on the model.

| Bucket | Chat text | Studio image/video | API text | API media | Consumes subscription text windows | Expiry |
| --- | --- | --- | --- | --- | --- | --- |
| AIT Earned Credit | catalog ∈ funded program set | same | same | same | no | 7 days from grant |
| Basic-chat allowance | Basic-labeled model | no | Basic-labeled model | no | yes (5-hour and weekly) | subscription period |
| Premium allowance | Premium-labeled model | yes | Premium-labeled model | yes | yes | subscription period |
| Free Credits | yes | yes | yes | yes | no | campaign terms |
| Referral Credits | yes | yes | yes | yes | no | campaign terms |
| Dollar balance | yes | yes | if the key allows Dollar spend | if the key allows Dollar spend | no | none |

Free/Referral scope on Studio and API is to be confirmed against the current implementation; a difference is a change request, not a silent override (TD-47).

**Spend and hold order (TD-15):** earliest-expiring eligible AIT Earned Credit → Basic allowance (basic Chat only) → Premium allowance → Free Credits → Referral Credits → Dollar balance. The hold is taken source by source in this order for the full maximum; releases return to the same sources and original expiries; an expired grant is not revived. Only the portion charged to a subscription allowance consumes the 5-hour and weekly text windows; an API key may consume those windows (TD-44). Basic exhaustion may route eligible Chat to Premium; text-window exhaustion skips both subscription allowances while other eligible buckets remain available ([SUBSCRIPTION §4.3](./SUBSCRIPTION.md)).

## 3. Scoped API key policy

One policy object per key, editable by the account owner in Profile → Developer settings, enforced at authorization before dispatch (TD-44/56):

| Field | Rule |
| --- | --- |
| Allowed catalogs | List of catalog IDs; a model is allowed when its current catalog assignment is listed, evaluated at authorization. Empty list = no models. A catalog reassignment changes new requests only; in-flight requests keep their decision (TD-23). |
| Per-request ceiling | Optional USD-equivalent maximum; the request is rejected if its computed hard maximum exceeds it. A caller-supplied ceiling (TD-37) and the key ceiling both apply; the lower wins. |
| Daily and monthly budget | USD-equivalent caps on settled charges **plus currently held maximums**, so concurrent requests cannot exceed them. Gross Dollar-equivalent cost counts regardless of funding source. |
| Allowed funding | Credits in the §2 order always; **Dollar balance only if enabled on the key** (default off), for every request type. |
| Expiry | Optional timestamp; an expired key behaves as revoked. |
| State | `active` / `revoked`; revocation is immediate, in-flight requests complete. |
| Attribution | Every Usage row carries the key ID; Usage is filterable by key. |

Out of scope: per-key balances or wallets (would be a second ledger, TD-24), key-level subscription windows (account-level per TD-15), a key-level toggle for subscription allowance use.

## 4. One accepted request

**Request ID (TD-46):** every accepted request receives one stable, opaque request ID before dispatch. The API returns it in a response header and in the body; Chat/Studio show it in Usage detail; Usage and support tooling look it up by ID and filter by key ID. Every attempt, hold, settlement, provider payable and reversal references it. Attempt IDs and storage are engineering's choice. Pre-dispatch rejections carry no ID and no rejection log at launch.

**Provider pin (TD-48):** Chat and Studio model pickers offer a provider selector (default **Auto**); API requests accept an optional `offeringId`. A pinned offering is used only if it passes every gate; otherwise the request is rejected before dispatch with no automatic or opt-in fallback. The quote block and Usage show the pinned offering.

| Stage | Required behavior | Acceptance evidence |
| --- | --- | --- |
| Select | Resolve the exact customer `modelId`, requested capabilities, account/key limits, current catalog assignment and qualified offerings. A provider pin permits only that offering. | The accepted decision identifies the selected offering, catalog and policy versions, and any permitted same-model backup. A disallowed model/route stops before provider dispatch. |
| Quote and authorize | From bounded text/media settings and every permitted serving rate, compute an informative estimate and a **hard maximum customer charge**. Chat/Studio show selected offering, rate version, estimate and maximum before submission. API uses a single call with published rates and an optional caller ceiling. | The API rejects an unaffordable or over-ceiling request before dispatch. No separate public quote-confirm endpoint is required. |
| Reserve | Hold the **full maximum** across eligible AIT Earned Credit grants, subscription allowances, Free Credits, Referral Credits and Dollar balance in that order. Keep each source and original expiry. | One authorization has a source-by-source maximum hold; concurrent requests cannot overspend or create a negative balance. |
| Dispatch and fallback | A chosen-model request may use one qualified same-model backup only after a pre-output provider fault and only within the accepted customer/provider ceilings. An explicit offering pin never falls back. Never retry after customer-visible output or resubmit an uncertain accepted media job. | Every attempt is traceable to the same accepted request. Selected and actual serving offering, failure reason and rate version can be reconstructed without duplicate output. |
| Settle | Meter verified billable units once, apply the **actual serving offering's** rate, and cap the customer debit at the accepted maximum. Release unused holds to their original sources and expiry. Record provider cost separately. | Usage shows selected versus serving offering, fallback, verified units, accepted maximum, final charge, used buckets and released hold. A provider overrun is a platform/provider discrepancy, never a later customer debit. |
| Reverse | For a provider-fault or overcharge refund after settlement, reverse the affected charge once. Restore an AIT Earned Credit portion as a new seven-day grant and the Dollar-funded portion to Dollar balance; other buckets follow their own terms. | Repeated reversal events do not duplicate Credit or USD restoration; the reversal traces to the settled usage. |

The request ID above is required (TD-46); attempt identifiers and storage design are implementation choices. The **product acceptance** is that an operator and the user-facing Usage detail can reconcile one accepted request, its attempts, one customer charge, provider payable, release and any reversal. Prompt and output content need not enter routine billing telemetry.

Pre-dispatch rejection set (also used by [SPEC_AGENT_INTEGRATION](./SPEC_AGENT_INTEGRATION.md)): invalid or revoked key; key expired; catalog not allowed for key; model unavailable or pinned offering ineligible; hard maximum over per-request ceiling (key or caller); daily or monthly key budget exceeded; insufficient eligible funding; job limit exceeded. Each has a stable code; none causes a provider attempt or a durable customer debit.

## 5. Media job lifecycle

States (TD-49): `accepted → dispatched → delivered | failed | uncertain → settled | released`.

| State | Rule |
| --- | --- |
| `delivered` | Verified output; settle delivered outputs at the serving offering's rate within the accepted maximum; release the remainder. Partial success charges only delivered outputs; independently billable preprocessing that completed may settle even if generation fails ([SUBSCRIPTION §4.4](./SUBSCRIPTION.md)). |
| `failed` | Provider reported failure before output. One same-model backup is allowed only if pre-output and unpinned (TD-31); otherwise release the full hold, no generation charge. |
| `uncertain` | Provider accepted the job but reported no terminal status within its declared maximum job time plus a grace window (placeholder in LAUNCH_CONFIG_V0). Never resubmit. The hold stays until operations resolves it in the uncertain-job queue ([SPEC_ADMIN](./SPEC_ADMIN.md)): delivered → settle; lost → release. |
| Auto-release | Any hold unresolved **24 hours** after dispatch releases to the customer. Provider cost confirmed later goes to the discrepancy ledger, never to a customer debit. |
| Customer view | The request shows as **Pending** in Usage with the held amount until settlement or release. A Pending job keeps its reservation across a billing-period boundary and does not consume a new period's allowance. |

Callbacks, retries and polling are idempotent by job ID; a timeout alone must not allow a late success to charge again. Studio's maximum of three Pending videos applies unless a lower plan-specific limit is configured.

## 6. Refunds and reversals

Unused preauthorization returns to its original source/grant and expiry. After a **settled** charge is refunded for provider failure or overcharge: restore the AIT Earned Credit portion as a **new seven-day grant**, the Dollar-funded portion to Dollar balance, and other buckets per their own terms. Reversal is idempotent, happens once per charge and traces to the original request ID (TD-19). Provider-reported usage above the accepted maximum is a platform/provider discrepancy, never a later customer debit (TD-39).

## 7. Acceptance (formerly B2)

1. **Ordinary mixed-bucket request:** An eligible text or media call reserves the full maximum across at least two eligible sources, settles once within the ceiling, releases unused amounts to the exact original buckets/expiries, and matches the user's Usage detail to the funding and provider ledgers.
2. **Same-model fallback with a different customer rate:** The first offering fails before output; one qualified backup serves the verified same model. The final charge uses the backup's rate and units, stays within the original maximum, and appears once in Usage. Repeat with an explicit offering pin and prove no fallback.
3. **Pre-dispatch rejection:** Insufficient funding, a disallowed model/capability, or an API caller ceiling below the computed maximum causes no provider attempt and no durable customer debit.
4. **Late or duplicate events:** Duplicate settlement/reversal callbacks leave one customer charge and one applicable refund. An in-flight request keeps its accepted catalog, policy and rate versions after a catalog refresh.
5. **Media and overrun boundary:** A failed/undelivered output has no generation charge; delivered outputs and independently billable completed preprocessing settle only within the accepted maximum. Verified provider usage above that maximum creates a separate discrepancy, not extra customer debit.

6. **Scoped key policy (TD-44):** a key limited to one catalog is rejected for a model outside it; a request whose hard maximum exceeds the key's per-request ceiling is rejected; concurrent requests cannot exceed the daily budget counting held maximums; a key without Dollar spend enabled is rejected once Credits are exhausted; a revoked key fails immediately while its in-flight request settles once; Usage filters by that key.
7. **Request ID (TD-46):** the API response carries the request ID; the same ID appears in Usage detail and on every attempt, hold, settlement and reversal record for that request.
8. **Provider pin (TD-48):** a Chat request pinned to an offering is served by it or rejected; no fallback occurs. Repeat via API with `offeringId`.
9. **Media lifecycle (TD-49):** an `uncertain` job appears in the operations queue with its hold intact and shows Pending to the customer; resolving it as delivered settles once; an unresolved job auto-releases at 24 hours and a later provider cost lands in the discrepancy ledger.

Use one real funded Gateway request and one controlled failure to prove the transaction-to-Dollar-balance path and customer/provider reconciliation. Operational rate values, provider-cost ceilings and deployment configuration remain separate inputs.

## 8. Prototype evidence and limit

The prototype's Chat example shows a selected offering/rate, estimate, maximum and source hold before mock send, and a completed example in Credits → Usage where `or-sonnet` is selected and `b-sonnet` serves after a simulated pre-output failure with one final charge and a released remainder. It uses the live `1,000,000 Credits/$1` unit and shows the request ID, Auto/Pinned route, key policy fields, request-ID and key filters and the Pending state (TD-54). No real provider call, reserve, debit, refund, API authorization or backend reconciliation occurs in the prototype.
