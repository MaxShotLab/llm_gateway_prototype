# SPEC_BILLING — request authorization, funding, settlement and API keys

**Status:** Canonical specification, compacted 16 November 2026. Every rule has one ID (`BIL-Rnn`) and is stated once; the reason for a rule is in the cited TD row of [DECISIONS.md](./DECISIONS.md). This file absorbs the request-charging, media-settlement and ledger-precision rules formerly in [SUBSCRIPTION §4.3–4.5](./SUBSCRIPTION.md); plan, lifecycle and payment rules stay in SUBSCRIPTION. AIT Earned Credit grant arithmetic is in [SPEC_TOKEN §4](./SPEC_TOKEN.md#4-staking-and-ait-earned-credit); provider admission and routing in [SPEC_PROVIDERS](./SPEC_PROVIDERS.md). Engineering owns tables, endpoints, field names and identifier formats.

**Release:** Foundation (build-order step 2) with Dollar balance and subscription buckets. The AIT Earned Credit bucket joins in the MAX/AIT release (step 8) and changes only hold and spend order (TD-43).

## Overview

Every Gateway request — Chat, Studio or API — follows one path. The Gateway identifies the request and its route, computes an informative estimate and a **hard maximum** charge, and holds that whole maximum across the customer's eligible funding sources in a fixed order before any provider is called. After the provider responds, it meters verified usage once, charges the serving offering's rate up to the maximum, and returns the unused hold to the exact sources it came from. Media jobs add explicit states, a manual resolution queue for jobs whose outcome is unknown, and a 24-hour automatic release. A refund after settlement reverses the charge once. API keys narrow what a request may do; they never hold money of their own.

```text
identify → select route → quote (estimate, hard maximum) → reserve maximum → dispatch (≤1 same-model fallback if unpinned)
        → settle at serving rate ≤ maximum → release unused hold → [refund: reverse once]
```

## 1. Ledgers and units

- **BIL-R01 · Dollar balance.** User-funded USD from confirmed top-ups through the Gateway's existing crypto-deposit flow; engineering verifies the live transaction-to-balance path (TD-25). It pays PAYG charges and full subscription payments.
- **BIL-R02 · Credit buckets.** Credits are integer off-chain allowances in separate buckets, each with its own terms and expiry: AIT Earned Credit, Basic-chat allowance, Premium allowance, Free Credits, Referral Credits. No bucket is cash.
- **BIL-R03 · Unit.** 1,000,000 Credits = $1, as in the live Gateway (TD-53). Conversions use a versioned rate.
- **BIL-R04 · Integer storage.** Store Credits as integers; funded balances, top-ups, plan prices and spending limits as integer cents; sub-cent request debits and equivalents as integer microdollars. Never use floating-point ledger arithmetic.
- **BIL-R05 · Versions.** Store the rate version and rounding policy with every conversion, and the plan, model-price, limit and rate versions with every accepted request, so later changes never alter an accepted request or a past period.

## 2. Funding buckets and eligibility

**BIL-R06 · Eligibility matrix (TD-47).** "Catalog" is the model's current catalog assignment at authorization (TD-23). "Label" is the Gateway-supplied Basic/Premium label on the model; it governs Chat and API text alike.

| Bucket | Chat text | Studio image/video | API text | API media | Consumes subscription text windows | Expiry |
| --- | --- | --- | --- | --- | --- | --- |
| AIT Earned Credit | catalog ∈ funded program set | same | same | same | no | 7 days from grant |
| Basic-chat allowance | Basic-labeled model | no | Basic-labeled model | no | yes (5-hour and weekly) | subscription period |
| Premium allowance | Premium-labeled model | yes | Premium-labeled model | yes | yes | subscription period |
| Free Credits | yes | yes | yes | yes | no | campaign terms |
| Referral Credits | yes | yes | yes | yes | no | campaign terms |
| Dollar balance | yes | yes | if the key allows Dollar spend | if the key allows Dollar spend | no | none |

Free/Referral scope on Studio and API is to be verified against the live Gateway (§8). Free-quota (`F`) web Chat models are funded under a separate free-model policy, outside this matrix (§8).

- **BIL-R07 · Plan-ineligible requests.** A supported model, route or modality that the customer's plan does not cover may still run on the remaining eligible buckets (PAYG).
- **BIL-R08 · Spend and hold order (TD-15).** Earliest-expiring eligible AIT Earned Credit → Basic allowance (Basic-labeled Chat or API text only) → Premium allowance → Free Credits → Referral Credits → Dollar balance.
- **BIL-R09 · Text windows.** Only the portion of Chat or API text charged to a subscription allowance consumes the 5-hour and weekly text windows; a request funded entirely by AIT Earned Credit leaves them untouched. An API key may consume the account's windows (TD-44). Image and video jobs never consume text windows; their per-job cost and concurrency limits apply instead.
- **BIL-R10 · Exhaustion.** At 100% of a window or allowance, stop using that allowance until it resets. Basic monthly exhaustion routes an eligible Basic-labeled Chat or API text request to Premium, then to the other eligible buckets; text-window exhaustion skips both subscription allowances while AIT Earned Credit, promotional Credits and authorized Dollar balance remain available. Tell the user when Basic Chat starts spending Premium.
- **BIL-R11 · Warnings.** At 90% of a text window or either monthly allowance, create one in-app warning per window or bucket. Premium usage percentage counts Pending media holds as held, not charged.

## 3. Scoped API key policy

One policy per key, editable by the account owner in Profile → Developer settings, enforced at authorization before dispatch (TD-44/56).

- **BIL-R12 · Allowed catalogs.** A key lists catalog IDs; a model is allowed when its current catalog assignment is listed. An empty list allows no model. A reassignment affects new requests only.
- **BIL-R13 · Per-request ceiling.** Optional USD-equivalent maximum. A request whose hard maximum exceeds it is rejected. When a caller also supplies a ceiling (TD-37), the lower one applies.
- **BIL-R14 · Daily and monthly budgets.** USD-equivalent caps measured as settled charges **plus currently held maximums**, at gross Dollar-equivalent cost whatever the funding source. Concurrent requests cannot exceed them, and Dollar-balance funding never bypasses them.
- **BIL-R15 · Funding.** A key always spends Credits in BIL-R08 order; it spends Dollar balance only if the owner enabled Dollar spend on that key (default off), for every request type.
- **BIL-R16 · Expiry and revocation.** Optional expiry; an expired key behaves as revoked. Revocation takes effect immediately; in-flight requests complete and settle once.
- **BIL-R17 · Attribution.** Every Usage row carries the key ID, and Usage can be filtered by key.

## 4. One accepted request

### 4.1 Identify and select

- **BIL-R18 · Request ID (TD-46).** Every accepted request gets one stable, opaque request ID before dispatch. The API returns it in a response header and the body; Usage detail shows it; Usage and support tooling search by it. Every attempt, hold, settlement, provider payable and reversal references it.
- **BIL-R19 · Selection.** Resolve the exact customer `modelId`, requested capabilities, account and key limits, the model's current catalog assignment and its qualified offerings. Freeze the accepted catalog, policy and rate versions; a later catalog refresh never changes an in-flight request.
- **BIL-R20 · Provider pin (TD-48).** Chat and Studio pickers offer a provider selector (default Auto); API requests accept an optional `offeringId`. A pinned offering is used only if it passes every gate; otherwise the request is rejected before dispatch, with no automatic or opt-in fallback. The quote and Usage show the pinned offering.

### 4.2 Quote and authorize

- **BIL-R21 · Estimate and hard maximum (TD-39).** From bounded request settings and every permitted serving rate, including a permitted same-model backup's rate, compute an informative estimate and a hard maximum customer charge. Media settings include model, path, count, duration, resolution, audio and other billable components. A fixed final charge is not required.
- **BIL-R22 · Disclosure.** Chat and Studio show the selected offering, rate version, estimate and maximum before submission; Studio shows an estimate and maximum for each independently billable component. The API authorizes inside one call using published rates and an optional caller ceiling; there is no separate quote-confirm endpoint (TD-37).
- **BIL-R23 · Dollar confirmation for media in the UI.** A Studio job that would debit Dollar balance shows the maximum Dollar amount and requires confirmation before submission.
- **BIL-R24 · Pre-dispatch rejection.** Reject before any provider attempt, with a stable code, when: the key is invalid, revoked or expired; the model's catalog is not allowed for the key; the model is unavailable or a pinned offering is ineligible; the hard maximum exceeds a key or caller ceiling; a daily or monthly key budget would be exceeded; eligible funding is insufficient or required Dollar spend is not authorized; or a job limit is exceeded. A rejection creates no durable debit and carries no request ID.

### 4.3 Reserve

- **BIL-R25 · Hold the full maximum.** Before dispatch, hold the entire hard maximum source by source in BIL-R08 order, recording each source and its original expiry. Holding only the estimate would allow a later debit the customer never approved. Concurrent requests cannot overspend, create a negative balance or debit an unapproved source.

### 4.4 Dispatch

- **BIL-R26 · Fallback (TD-31).** An unpinned request may use at most one qualified same-model backup, only after a provider fault before any customer-visible output, and only within the accepted customer and provider ceilings. A pinned request never falls back. Never retry after output has started; never resubmit a media job whose acceptance is uncertain.

### 4.5 Settle

- **BIL-R27 · Charge.** Meter verified billable units once and apply the **serving** offering's rate. The final charge may exceed the estimate only within the accepted maximum and the originally held sources. If provider-reported usage would exceed the maximum, cap the customer charge at the maximum, record the excess as a platform/provider discrepancy and stop further output where possible (TD-39).
- **BIL-R28 · Release.** Return unused holds to their original sources and original expiries. An expired grant is not revived.
- **BIL-R29 · Records.** Record provider cost separately from the customer charge, and record the native usage unit (text tokens, image outputs or the configured video unit). Prompt and output content stays out of routine billing records.
- **BIL-R30 · Once only.** Reconcile each charge once; duplicate settlement callbacks never create a second debit. Show the final adjustment.
- **BIL-R31 · Usage detail.** Usage shows the request ID, selected and serving offering, any fallback and its reason, verified units, accepted maximum, final charge, buckets used and hold released.

## 5. Media job lifecycle

- **BIL-R32 · States (TD-49).** `accepted → dispatched → delivered | failed | uncertain → settled | released`. Studio's Pending, Generated and Failed labels map onto these states.
- **BIL-R33 · Delivered.** Settle delivered outputs at the serving rate within the maximum and release the rest. On partial success, charge only delivered outputs. Independently billable preprocessing (for example search) that completed may settle even if generation fails. A canceled job pays for outputs and components completed before cancellation and releases the rest.
- **BIL-R34 · Failed.** A failure reported before output allows one same-model backup only if the request is unpinned (BIL-R26); otherwise release the whole hold with no generation charge.
- **BIL-R35 · Uncertain.** A job is uncertain when the provider accepted it but reported no terminal status within its declared maximum job time plus the grace window (LAUNCH_CONFIG_V0). It is never resubmitted; the hold stays until operations resolves it in the uncertain-job queue ([SPEC_ADMIN §2](./SPEC_ADMIN.md)) as delivered (settle once) or lost (release).
- **BIL-R36 · 24-hour auto-release.** Any hold still unresolved 24 hours after dispatch is released to the customer. Provider cost confirmed later goes to the discrepancy ledger, never to a customer debit. This replaces the earlier rule that a Pending hold could be released only after provider reconciliation.
- **BIL-R37 · Admission bound.** A media offering is admitted only if its declared maximum job time plus the grace window is under 24 hours, so an uncertain job can be resolved before auto-release (also stated in SPEC_PROVIDERS §1).
- **BIL-R38 · Pending view.** Until settlement or release, Usage shows the job as **Pending** with its held amount and no final deduction. A Pending job keeps its hold across a billing-period boundary and never consumes the new period's allowance.
- **BIL-R39 · Idempotency.** Callbacks, retries and polling are idempotent by job ID; a late success after auto-release or a timeout never charges again.
- **BIL-R40 · Concurrency.** At most three Pending videos per account unless a lower plan-specific limit is configured. Image jobs have no concurrency cap by default.
- **BIL-R41 · Job record.** Each media job records account, job and provider IDs, route, output modality, model and price versions, billable settings, estimate, accepted maximum, held bucket amounts, actual billable components, billing-period ID, status, final usage record ID and timestamps.

## 6. Refunds and reversals

- **BIL-R42 · Reverse a settled charge (TD-19/57).** When a settled charge is refunded for provider fault or overcharge, reverse it once, idempotently, traced to the request ID. Restore the AIT Earned Credit portion as a **new seven-day grant**; the Dollar portion to Dollar balance; subscription-allowance, Free and Referral portions to their original bucket with the original period or expiry if still valid, otherwise that portion lapses. Unused holds follow BIL-R28, not this rule.

## 7. Acceptance

Prove each case against the live Gateway with one real funded request and one controlled failure where noted.

1. **Mixed-bucket request** (BIL-R08, R21, R25, R27, R28, R31): an eligible text or media call holds the full maximum across at least two sources, settles once within it, releases the rest to the exact original buckets and expiries, and Usage matches the funding and provider ledgers.
2. **Fallback at a different rate** (BIL-R26, R27): the first offering fails before output; one qualified backup serves the same model; the charge uses the backup's rate within the original maximum and appears once. Repeat pinned and prove no fallback.
3. **Pre-dispatch rejection and Dollar confirmation** (BIL-R23, R24): insufficient funding, a disallowed model or capability, or a caller ceiling below the maximum produces no provider attempt and no durable debit. A Studio job that would debit Dollar balance is not submitted until the user confirms the shown maximum.
4. **Late or duplicate events** (BIL-R19, R30, R42): duplicate settlement or reversal callbacks leave one charge and one refund; an in-flight request keeps its accepted versions after a catalog refresh.
5. **Media and overrun** (BIL-R27, R33, R34): an undelivered output has no generation charge; delivered outputs and completed preprocessing settle within the maximum; provider usage above it becomes a discrepancy, not a debit.
6. **Key policy** (BIL-R12–R17): a key limited to one catalog is rejected for a model outside it; a maximum above the key ceiling is rejected; concurrent requests cannot exceed the daily budget counting holds; a key without Dollar spend is rejected once Credits run out; a revoked key fails immediately while its in-flight request settles once; Usage filters by the key.
7. **Request ID** (BIL-R18): the API response carries the ID; the same ID appears in Usage and on every attempt, hold, settlement and reversal record.
8. **Provider pin** (BIL-R20): a pinned Chat request is served by that offering or rejected, with no fallback; repeat via API with `offeringId`.
9. **Media lifecycle** (BIL-R35–R40): an offering whose job time plus grace reaches 24 hours is refused at admission; an uncertain job sits in the operations queue with its hold and shows Pending; resolving it as delivered settles once; an unresolved job auto-releases at 24 hours and a later provider cost lands in the discrepancy ledger; a fourth concurrent Pending video is rejected before dispatch.
10. **Basic API and promotional scope** (BIL-R06, R08, R09): a Basic-labeled API text request uses the Basic allowance after eligible AIT Earned Credit, with the same limits and text windows as Chat. Engineering verifies live Free/Referral funding on Studio and API and raises any difference as a change request.
11. **Subscription limits** (BIL-R09, R10, R11): a 90% warning appears once per window or bucket; Basic exhaustion moves eligible Chat and API text to Premium with a notice; window exhaustion skips both allowances for text while other buckets fund the request; an image or video job still uses Premium when a text window is exhausted, subject to its own job and concurrency limits.
12. **Refund portions** (BIL-R42): a refunded request funded by AIT Earned Credit, Premium and Dollar restores a new seven-day AIT grant, Premium to its original period if still open, and Dollar to Dollar balance, once. Lapse example: a request settled in the last subscription period with Premium and Referral Credits is refunded after that period ended and after the Referral Credits' original expiry; the Premium and Referral portions are not restored to any bucket, and the refund record shows them as lapsed. The AIT and Dollar portions are still restored.

## 8. Inputs, open items and out of scope

**Inputs** ([LAUNCH_CONFIG_V0](./LAUNCH_CONFIG_V0.md)): key default budgets and catalogs, media grace window, provider-cost ceilings, plan allowances and windows, funded-term catalog set.

**Open items:** live Free/Referral funding scope on Studio and API (TD-47, engineering to verify); free-model (`F`) quota and post-quota funding policy ([SUBSCRIPTION §7](./SUBSCRIPTION.md)); live crypto-deposit path (TD-25).

**Out of scope at launch:** per-key balances or wallets (TD-24); key-level subscription windows or a key toggle for allowance use; a public quote-confirm endpoint; IDs or a log for pre-dispatch rejections.

## 9. Prototype evidence and limit

The prototype shows the Chat and Studio quote (selected offering, Auto or Pinned, estimate, maximum, illustrative hold), a completed Chat example in Credits → Usage with request ID and a simulated pre-output fallback, key policy fields, request-ID and key filters and Pending rows, using the live 1,000,000 Credits/$1 unit (TD-54). It makes no provider call, hold, debit, refund, API authorization or reconciliation.
