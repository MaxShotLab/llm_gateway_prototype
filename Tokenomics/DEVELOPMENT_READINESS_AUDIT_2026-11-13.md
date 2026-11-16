# Maxshot development readiness audit

**Date:** 13 November 2026 (Toronto)
**Scope:** Tokenomics requirements and later decisions, provider/routing/subscription designs, and the local unified Gateway prototype at `http://127.0.0.1:5173/`. This is a read-only assessment of the source PRD and existing implementation. No live contracts, production Gateway backend, provider accounts, or mobile/assistive-technology session were verified.

## Executive assessment

The proposed **navigation and core token behavior are coherent enough to start parallel implementation**. The MAX/AIT merged position, HWM refill, seven-day redemption reset, Ethereum-only AIT launch, MAX chain scope, Vault continuation, referral split, and minimum provider routing policy are written down. The current prototype communicates most of those decisions and labels its simulated data.

**Product requirements and prototype are ready for a scoped development handoff as of 15 November 2026.** The cross-product billing conflict and exact mint integer arithmetic were resolved, and B1–B5 now each have acceptance criteria linked from the [handoff index](./DEVELOPMENT_HANDOFF_INDEX.md). The prototype illustrates the agreed journeys with simulated data. No live common catalog, provider request, wallet transaction, Vault migration or Credit ledger was verified here; those outputs must pass the B1–B5 proofs before their implementations are accepted. Economic, legal, security and operational inputs remain separate release gates.

## Evidence and walkthrough

The desktop walkthrough used a 913 × 851 browser viewport. Screenshots below are exact UI captures; the browser returned JPEG bytes, so they are saved with `.jpg` extensions. Sequence:

| Step | Surface | Observation |
| --- | --- | --- |
| 1 | [Chat before correction](./audit-2026-11-14/01-chat.jpg) | Earlier capture showed a model picker and Auto toggle; the toggle was removed after the audit. |
| 2 | [Portfolio](./audit-2026-11-14/02-portfolio.jpg) | Gateway, Vault, and MAX/AIT summaries are in one account view. |
| 3 | [Credits](./audit-2026-11-14/03-credits.jpg) | Subscription and Earned Credit coexist; sample renewal date is stale. |
| 4–6 | [Token overview](./audit-2026-11-14/04-tokens.jpg), [Mint](./audit-2026-11-14/05-mint.jpg), [Burn](./audit-2026-11-14/06-burn.jpg) | Merged position, HWM quote, and pending redemption are shown as simulation. Burn explanation wraps poorly. |
| 7–8 | [Provider profiles](./audit-2026-11-14/07-providers.jpg), [Models & Pricing](./audit-2026-11-14/08-models-pricing.jpg) | Provider-specific offerings, status, performance, and rate comparison exist on one simulated catalog. |
| 9 | [Vaults](./audit-2026-11-14/09-vaults.jpg) | Summary/entry point is present; original transaction flow is not integrated here. |
| 10–11 | [Maxshot referrals](./audit-2026-11-14/10-referrals.jpg), [Partner referrals](./audit-2026-11-14/11-partner-referrals.jpg) | Two audiences and ledgers are visibly separated; Community views are hidden. |
| 12 | [Stake & Credit](./audit-2026-11-14/12-stake-credit.jpg) | Program is labeled draft and unfunded. |
| 13 | [Studio](./audit-2026-11-14/13-studio.jpg) | Media picker uses a separate static model list. |
| 14–15 | [Usage](./audit-2026-11-14/14-usage.jpg), [Developer settings/API log](./audit-2026-11-14/15-developer-settings.jpg) | Usage names a provider; stable serving offering/rate version/fallback trace are absent. API log shows only requested model. |

### Requirements and design inventory

| Area | Current source of truth | Audit result |
| --- | --- | --- |
| Source token proposal | `MAXSHOT_Tokens_PRD_v1.0(read only).md` | Preserved; several older individual-position and market assumptions are expressly superseded. |
| Confirmed token behavior | `MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md` §§2–3; `MAXSHOT_Feature_Requirements_PRD.md` §4.2 | Sufficient behavioral rules and invariant cases for development, subject to integer precision below. |
| Unified app | `MAXSHOT_Unified_Gateway_App_Decisions.md`; `frontend/TOKEN_UI_REFERENCE_MAP.md` | Navigation and ownership mostly match prototype. Vault transaction migration remains integration work. |
| Provider admission/routing | `PROVIDER_INTEGRATION_MINIMUM_STANDARD.md`; `MULTI_PROVIDER_ROUTING_DESIGN.md`; `PROVIDERS_FRONTEND_DATA_CONTRACT.md` | Minimum admission, single versioned catalog, chosen-model routing, one same-model backup, and billing trace are specified. Live backend output is unverified. |
| Auto model | `AUTO_MODEL_ROUTING_DESIGN.md` | Deferred from launch; the visible Chat toggle found in this audit was removed. |
| Subscription and Earned Credit | `SUBSCRIPTION_FEATURE_REQUIREMENTS.md`; token addendum §3.5; UI reference map | Composite spend order and text-window treatment reconciled on 13 November 2026; implementation remains. |

## A. Decisions/specification to close before the affected development is frozen

### A1 — One funding waterfall for subscription plus AIT Earned Credit **[resolved 13 November 2026]**

The founder's later decision is **eligible, earliest-expiring AIT Earned Credit first**, followed by subscription allowances, other promotional Credits, then Dollar balance. The subscription PRD, token addendum, feature PRD, and UI reference map now agree on this order. The founder additionally confirmed that requests funded entirely by AIT Earned Credit leave subscription five-hour and weekly text windows untouched; only the subscription-funded portion consumes those windows. Account, API-key, and job limits still apply. This closes the cross-document ordering conflict; implementation still needs reservation, settlement, and reversal tests across mixed buckets.

### A2 — Exact 18-decimal MAX mint evaluation **[resolved 13 November 2026]**

The founder confirmed rounding the **complete exact charge once upward** to MAX wei. [Addendum §5](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md#5-confirmed-integer-mint-quote) now gives the 18-decimal integer operation order and seven acceptance vectors, including HWM refill, crossing, cap, and dust. The prototype still computes with JavaScript floating point ([`TokenomicsPage.jsx` lines 7–16](../frontend/src/pages/TokenomicsPage.jsx#L7)); that is acceptable for a labeled visual simulation, not a contract or binding quote. Implementation and security review must match the confirmed formula.

## B. Integration work required before end-to-end feature acceptance

These are implementation outputs already described in the product documents, not unresolved marketing decisions.

### B1 — One verified catalog for every request surface **[agreed handoff requirement; blocks model launch integration]**

**Prototype update, 15 November 2026:** Providers, Chat and Studio now derive model identity, display name, and usable membership from the same simulated `providerSnapshot`. The [frontend data contract](./PROVIDERS_FRONTEND_DATA_CONTRACT.md#b1-catalog-acceptance-matrix) gives the remaining live acceptance transitions. No production Gateway catalog or viewer policy result was verified in this checkout; B1 remains a production integration proof.

At audit time, Provider profiles/pricing derived from `providerSnapshot`, while Chat and Studio retained separate model lists. That allowed picker membership to drift from admitted, available offerings. The founder agreed this is an implementation handoff requirement on 13 November 2026. **Close production B1 by serving one versioned Gateway catalog, mapping existing provider/native IDs to canonical IDs, and using it for Providers, Chat, Studio, and API eligibility.** Pending offerings shown for demonstration must not be routable or presented as active production prices.

### B2 — Authorization, price version, serving trace, and settlement **[API flow decided; blocks routing/billing acceptance]**

**Handoff update, 15 November 2026:** The [B2 request authorization/settlement handoff](./REQUEST_AUTHORIZATION_SETTLEMENT_HANDOFF.md) consolidates the approved lifecycle and minimum production proof. The prototype now contains one simulated Chat quote and a matching fallback/Usage detail, plus Studio pre-submit quotes. The actual API, hold/debit ledger, provider attempts, refund and reconciliation remain unverified in this checkout.

The contract requires a server quote with selected offering, rate version, estimate, and maximum; final Usage must show actual serving offering/rate, verified units, funding sources, one charge, and fallback. The founder confirmed a **single-call API** on 13 November 2026: published rate cards, optional caller per-request ceiling, and server-side quote/reservation before provider dispatch; no separate quote-and-confirm endpoint. Chat/Studio display the server quote before submission. At audit time, Usage showed only a provider label and the API log showed requested model, tokens, and charge without serving offering, price version, or fallback. The live backend endpoints and ledger were outside this audit. **Close production B2 with immutable accepted catalog/rate/policy versions, one bounded same-model fallback, idempotent funding/charge records, and a user-facing request detail.** A request ID is an implementation option, not a separate product requirement. Prove deposit-to-ledger reconciliation and provider-cost versus customer-charge reconciliation on a real request.

### B3 — Existing Vault and account migration **[access rule decided; blocks unified-app acceptance]**

**Handoff update, 15 November 2026:** The [B3 Vault/account migration handoff](./VAULT_ACCOUNT_MIGRATION_HANDOFF.md) separates wallet-only exit, verified account attribution, unchanged Vault transactions, 14-day AIT claims and route cutover acceptance. The prototype now shows the logged-out wallet-only entry while keeping Portfolio login-gated. Live contracts, wallet linking, Merkle claims and redirects remain unverified here.

The agreed app keeps the Vault deposit/withdraw flow intact and binds one wallet to one Gateway account ([unified decisions](./MAXSHOT_Unified_Gateway_App_Decisions.md)). The founder confirmed on 13 November 2026 that an existing depositor may connect the position wallet and withdraw before Gateway account linking; the link is required for unified Portfolio and Gateway benefits, not for exit. At audit time the local prototype was a summary and link gated behind login; it now represents the wallet-only exit entry. **Close production B3 with one verified identity/wallet link for account views, live Vault position reads, unchanged deposit/withdraw calls, 14-day Merkle claim/history, and verified redirects from retired app routes.** No new Vault economics are needed.

### B4 — Provider admission and safe routing proof **[blocks provider go-live]**

**Handoff update, 15 November 2026:** The [B4 provider admission/routing handoff](./PROVIDER_ADMISSION_ROUTING_HANDOFF.md) consolidates the per-offering evidence packet and the once-per-platform shared-routing acceptance cases. Production provider calls, health backoff, attempt/cost records, and first-invoice reconciliation remain unverified in this checkout.

The minimum is intentionally small: rights, authenticated connection, exact offering identity/capabilities/prices, scripted admission, metering, and disable control ([six gates](./PROVIDER_INTEGRATION_MINIMUM_STANDARD.md#L11)). The agreed [minimum proof packet](./PROVIDER_INTEGRATION_MINIMUM_STANDARD.md#5-minimum-onboarding-proof) retains those facts and a live request/billing/failure trace per offering. A second provider offering for one equivalent model proves shared routing, explicit pinning, one pre-output fallback, original cost ceilings, and one customer charge; a second route is not required for every model. An upstream router must not add its own unapproved fallback ([routing lines 25–53](./MULTI_PROVIDER_ROUTING_DESIGN.md#L25)). Per-offering numeric health floors, cost ceilings, and sample thresholds are operational configuration before enabling an offering. The first invoice is reconciled before payout, not before the first controlled request.

### B5 — Token/wallet and Credit implementation proof **[blocks token feature acceptance]**

**Handoff update, 15 November 2026:** The [B5 token/wallet/Credit handoff](./TOKEN_WALLET_CREDIT_HANDOFF.md) consolidates the Ethereum state and bridge tests, verified wallet attribution, finalized staking accrual, automatic grant arithmetic, and ledger acceptance cases. Live contracts, signatures, event indexing and Credit issuance remain unverified in this checkout.

Mint, burn, stake, and withdrawal in the prototype mutate browser sample state only ([`TokenomicsPage.jsx` lines 18–75](../frontend/src/pages/TokenomicsPage.jsx#L18)). The addendum provides the needed invariants and boundary cases ([lines 127–142](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md#L127)). **Close with audited Ethereum contracts, wallet signatures and pause scopes, event indexing, one-way verified wallet attribution, epoch accrual/automatic off-chain grants, and idempotent ledger reconciliation.** Treat this as build/test work; the prototype has not demonstrated live behavior.

## C. Prototype/design corrections before a launch representation

1. **Auto model launch representation resolved 13 November 2026.** The earlier [screenshot](./audit-2026-11-14/01-chat.jpg) captured a toggle that disabled manual selection without an approved Auto route. The toggle has been removed from the launch prototype; manual model selection remains. Auto is deferred under the [routing decision](./MULTI_PROVIDER_ROUTING_DESIGN.md#L32).
2. **Sample-specific correction resolved 13 November 2026.** The earlier [Credits screenshot](./audit-2026-11-14/03-credits.jpg) showed a past renewal date; the prototype now generates future sample renewal and weekly-reset dates. The copied referral 1% rate remains in simulated calculations but is explicitly labeled an example with final terms pending, consistent with the [unified decision](./MAXSHOT_Unified_Gateway_App_Decisions.md#L28). Replace example values with approved live terms before launch.
3. **Token callout wrapping resolved 13 November 2026.** The earlier [Burn screenshot](./audit-2026-11-14/06-burn.jpg) showed narrow word columns. The shared [callout style](../frontend/src/pages/tokenomics.css#L36) now lets text and the bold phrase wrap as one paragraph. Other small table/caption text remains a general readability consideration, not a token behavior blocker.
4. **Pricing default corrected 13 November 2026.** The earlier [screenshot](./audit-2026-11-14/08-models-pricing.jpg) opened an admission-pending model. The prototype now defaults each model type to an available admitted model and labels models with no admitted offering as pending examples. Production should list admitted offerings, show complete per-offering rates/units/conditions/version, and never make a catalog display price a binding quote ([data contract lines 27–29, 114–118](./PROVIDERS_FRONTEND_DATA_CONTRACT.md#L27)).

## D. Deferred release inputs; exclude from the development blocker list

The addendum already assigns genesis custodian addresses/allocation restrictions, final curve/cap economic sign-off, funded Credit term/reserve, LayerZero peer/DVN/executor configuration, operational numeric SLA and provider thresholds, MAX fee staking, PT legal rights, AMM fee capture, and incident/security approvals to their respective workstreams ([§4](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md#L148)). They gate their deployments or later phases. Auto model, PT trading, Community referrals/rewards, and broader agent features are outside the current launch slice. Do not implement a speculative rule to fill any of these inputs.

## Recommended handoff order and acceptance checks

1. **Implement reconciled billing rules** → test one spend/reservation/refund waterfall for subscription allowances + AIT Earned Credit + promotional Credits + Dollar balance.
2. **Implement confirmed integer token reference** → shared vectors for refill, HWM crossing, cap, partial/final burns, and seven-day reset; contract and quote service match exactly.
3. **Map the live Gateway contract** → one catalog/price snapshot plus preauthorization and final Usage schema; verify one provider end to end, then a second and a failed attempt.
4. **Bind unified account surfaces** → Chat/Studio/API/Providers share IDs and availability; Vaults and MAX/AIT use the linked wallet and live event/ledger reads.
5. **Run release-specific proofs** → custody manifest, bridge supply conservation, provider admission, funded Credit reserve, security controls, and approved public terms.

**Audit limit:** I inspected source documents, prototype code, and desktop rendered screens. I did not test mobile breakpoints, keyboard navigation, screen readers, live Gateway APIs, on-chain transactions, LayerZero routes, actual provider contracts, or production financial ledgers. Those need separate implementation and release evidence.
