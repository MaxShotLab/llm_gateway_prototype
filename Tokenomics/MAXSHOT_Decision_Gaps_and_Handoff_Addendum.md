# Maxshot — Decision Gaps and Development Handoff Addendum

**Status:** Working decision record and gap register  
**Date:** 2026-11-11  
**Source:** `MAXSHOT_Tokens_PRD_v1.0(read only).md` (unchanged)  
**Companion outputs:** `MAXSHOT_Feature_Requirements_PRD.md`, `MAXSHOT_Tokenomics_and_Flywheels.md`, `MAXSHOT_One_Pager.md`

## 1. How to use this file

The source PRD remains read-only at the founder's request. This addendum records the founder's later decisions and identifies where they supersede older source wording. For **only the rows marked Decided below**, implement this addendum over the conflicting source wording. All other source requirements and release gates continue to apply. A decision recorded here is a working product/engineering decision, **not** approval of token sale execution, credit funding, legal availability or mainnet deployment.

Engineering should link requirements and tests to both the original source section/ID and this addendum's decision ID. Do not silently implement the source's older separate-position, immediate-unlock, provenance-gated MAX mint or one-chain launch behavior. If a clause is not listed here, this file does not change it.

## 2. Superseded source wording and current decisions

| ID | Source location / prior wording | Founder decision for working implementation | Status |
|---|---|---|---|
| TD-01 | §2.3 J3 refers to a MAX *lock term*; §4.4 describes originating positions | There is **no time lock on the active mint position**. Each controller has one active merged position with uniform rights. | Decided |
| TD-02 | §4.3 says a mint creates a distinct debt position; §4.4 allows opening/adding a position without defining merger | Every mint by the same controller adds quoted MAX and new AIT debt to the controller's **single active merged position**. Display its current `remaining active MAX / remaining AIT debt` ratio. Preserve each mint's source, quote and state transition in event history. | Decided |
| TD-03 | §4.4 and FR-TOK-003/004 describe pro-rata unlock of an original position | A burn closes part or all of the **merged** position at its current blended ratio. For partial burn `b < D`, move `floor(b × M / D)` MAX wei to pending redemption, where `D` and `M` are active debt and active MAX immediately before the burn. If `b = D`, move all remaining `M`. No old mint is individually repriced or selectable for closeout. | Decided |
| TD-04 | §2.3 J5 and FR-TOK-004 imply MAX is unlocked on burn | Burning AIT moves MAX out of active collateral into the controller's **pending redemption balance**. It is withdrawable only after a seven-day wait. Every further burn adds to the same still-pending balance and sets its common withdrawal time to `latest burn timestamp + 7 days`. Amounts already withdrawn are unaffected. | Decided |
| TD-05 | §4.3 says refill below HWM costs *no less than* `R(HWM)` and leaves the exact rule proposed; DEC-05 is open | Global HWM is the peak historical outstanding AIT mint debt. Burning never lowers it. Minted AIT that refills below HWM costs **exactly `R(HWM)` per AIT** under the mathematical quote; any portion above HWM costs the original curve integral. HWM rises only when outstanding debt exceeds its old peak. | Decided working design; simulation/audit still required |
| TD-06 | §4.2 leaves token precision open; DEC-18 includes decimals | MAX and AIT each use **18 decimals**. Integer quote and redemption math must retain the approved economic formulas and protect escrow. | Decided |
| TD-07 | §4.4 and FR-TOK-007 require position and unlock visibility | UI must show the merged active debt, active MAX, blended MAX/AIT ratio, pending MAX, next withdrawal time and the effect of another burn resetting that time. | Derived acceptance requirement |
| TD-08 | DEC-01 leaves MAX supply open; §3.2 uses 1B as an assumption | **All 1,000,000,000 MAX are minted at launch on Ethereum into designated custodian wallets with distinct purposes.** This is the fixed maximum supply; there is no later discretionary issuance. LayerZero bridge crediting on a destination chain or return to Ethereum represents movement of existing global supply, not new issuance. The wallet addresses, purpose labels and vesting controls are deployment inputs. | Decided product/contract rule; deployment manifest pending |
| TD-09 | §3.2 treats the 50M primary sale at $0.10 as a direction/assumption | **50,000,000 MAX at $0.10** is confirmed as the initial sale quantity and price. Issuer, sale operation, vesting schedule and legal terms remain with the commercial team. | Decided commercial input; execution pending |
| TD-10 | §3.2, §4.5, FR-TOK-001/006 and DEC-03 require eligible-lot provenance | **Any transferable ERC-20 MAX is eligible to lock and mint AIT**, including MAX acquired on a secondary market. The minter does not trace token origin. Unsold Treasury/team allocations are held under operational restrictions, normally on-chain custody/vesting contracts with a documented release plan. | Decided product behavior; custody implementation pending |
| TD-11 | §4.4/FR-TOK-010 leave position transfer open | The merged MAX/AIT position is **non-transferable** at launch. AIT remains freely transferable. | Decided for launch |
| TD-12 | DEC-18 proposes one chain and no cross-chain bridge | **Ethereum mainnet is the home chain.** MAX LayerZero transfers launch across Ethereum, Base, Arbitrum One and Robinhood Chain, including **direct peer-to-peer routes** between destination chains. MAX must return to Ethereum before it can be locked to mint AIT. | Decided scope; endpoint/lane security configuration pending |
| TD-13 | Source assumes AIT is a single-chain ERC-20 for supply/accounting | AIT is **held and transferred on Ethereum only at launch**. Include LayerZero expansion capability in the token design, but do not enable AIT cross-chain transfers at launch. MAX lock, AIT mint/burn, merged positions, HWM, MAX redemption and AIT staking all operate on Ethereum only. Whether unused AIT peers are deployed at launch is an operational decision. | Decided launch behavior; peer deployment pending |
| TD-14 | §5.1 leaves staking warm-up/time-weighting open | Ethereum AIT staking accrues immediately from confirmed stake time, proportional to actual time staked, with **no warm-up**. Confirmed unstaking immediately stops new accrual and has no lock/cooldown; accrued but ungranted AIT Earned Credit is preserved and granted on the next program-wide weekly batch. Already issued grants retain their expiry. | Decided |
| TD-15 | §5.5 proposes weekly grants and leaves spend order open; DEC-16 is open | All stakers share a **program-wide weekly grant schedule**; each grant reflects actual eligible time and retains the source's seven-day expiry. Spend earliest-expiring eligible AIT Earned Credit first, then eligible subscription allowance (basic before premium for basic Chat), then other promotional Credits (free before referral), then Dollar balance. Ineligible models skip AIT Earned Credit. Only the portion charged to subscription allowance consumes its five-hour and weekly text windows; account, API-key, and job limits still apply. Unused preauthorization returns to its original source/grant with its original expiry; an expired grant is not revived. | Decided; settled-call refunds are in TD-19 |
| TD-16 | §5.3/5.5 and FR-CR-004 leave eligible-model implementation open | Earned Credit is spendable only on models in the funded program's **approved catalog set**, as specified by TD-23. It can be used from the Gateway UI or an authorized scoped key used by an external agent, subject to model and spending limits. | Decided behavior; catalog set/cost caps pending |
| TD-17 | §9.1 proposes an Agent Wallet but does not fix staking-wallet attribution | One verified Ethereum staking wallet may be linked to one Gateway account at launch; **changing or unlinking is unavailable**. Direct on-chain unstaking must remain possible if the Gateway UI is unavailable. | Decided |
| TD-18 | §4.5 and §12 discuss pause but do not define independent controls | Provide separate **Mint**, **Burn** and **Withdraw** pauses, plus **Pause All** for those position actions. MAX LayerZero transfers have an **independent bridge pause**. Role assignment, peer/lane controls and unpause procedure require security design. | Decided controls; authority/configuration pending |
| TD-19 | §5.5/DEC-16 leave refund behavior open | Unused preauthorization returns to its original source/grant and expiry. After a **settled** call is refunded for provider failure or overcharge, restore its AIT Earned Credit portion as a **new seven-day grant** and return its Dollar-funded portion to Dollar balance. Reversal must be idempotent and trace to the original request. | Decided |
| TD-20 | §4.4/§5.1 do not define interaction between staking and position burns | Staked AIT must be **unstaked first** before burning it for MAX redemption. Unstaking has no delay. | Decided |
| TD-21 | TD-18's separate MAX bridge pause leaves route granularity open | Support both a **global MAX bridge pause** and an **individual directed-route pause** so unaffected routes can continue. Neither is the position Pause All control. | Decided |
| TD-22 | §5.5 and §11.2 leave weekly grant implementation open | Earned Credit exists **only in the Gateway backend ledger**, not as a token. The backend posts grants automatically after finalized Ethereum staking data, without a user claim transaction. All stakers use consecutive seven-day intervals from program start; a final short interval is granted at term end. | Decided |
| TD-23 | §5.5/FR-CR-004 require eligible models but do not define catalog grouping | Each verified model belongs to **one current model catalog**. A funded program allows a set of catalogs. Model-to-catalog assignments may change; eligibility for a new request uses the assignment at preauthorization, while an in-flight request retains its prior authorization. | Decided |
| TD-24 | §9.1 proposes an Agent Wallet and FR-AG-004 leaves agent count/allocation open; earlier wording treated one managed Agent as a launch requirement | **Clarified 15 November 2026:** provide an agent-style Gateway integration interface so developers and agent creators can connect external agents, authenticate with scoped credentials, discover verified models, run bounded calls and inspect usage. Agent calls and the UI use the same eligible account Credit ledger. A managed Agent object, one-Agent-per-account limit, separate Agent Wallet/allocation and Agent Factory portal are **not confirmed must-haves for the Tokenomics release**; their scope needs a later decision. | Decided integration direction; managed-Agent scope deferred |
| TD-25 | J1 and FR-GW-004 require a paid first-call funding path | Use the Gateway's **existing crypto-deposit flow** to add Dollar balance at launch. The claim that the flow is already implemented is founder-provided context; engineering must verify the live transaction-to-balance path. | Decided product path; live verification pending |
| TD-26 | §8.1/FR-GW-001 and §8.2 leave the initial multi-provider catalog and default route open | The launch catalog is dynamic and includes **all verified models** from supported providers. Customers select a model; the Gateway chooses a verified provider deterministically. Default to the **lowest quoted cost** among providers meeting model/capability, quality, latency and data-policy requirements. Failover must remain inside the request's authorized maximum cost. | Decided policy; thresholds/configuration pending |
| TD-27 | §8.1/FR-GW-001 require exact model identity but do not define provider alias equivalence | Multiple providers share one customer-facing model ID **only when Maxshot verifies the same model version and required capabilities**. Different versions or behavior get separate catalog entries. | Decided |
| TD-28 | §8.2/FR-PR-002 do not state a minimum number of provider routes per published model | **One verified provider route is sufficient** to publish a model at launch. A second qualified route is preferred but not required. If its sole route is unavailable, mark the model unavailable; do not silently substitute another model. | Decided launch rule |
| TD-29 | §8.2/FR-PR-002 describes automated model/provisioning benchmarks as P0 | At launch, each offering must pass a **small repeatable scripted admission test** of exact model identity, advertised controls, valid output, usage and price, plus relevant failure handling; output quality receives manual review. Continuous benchmarking and ranking are later work. | Decided launch qualification scope |
| TD-30 | FR-PR-003 requires a provider payout and dispute ledger but does not fix launch automation | At launch, retain an **append-only provider attempt, metered cost, correction and dispute ledger**. Reconcile each provider invoice against those records and pay manually. Automated payouts and a provider-facing settlement portal are later work. Historical entries are corrected by new linked entries, not overwritten. | Decided launch settlement scope |
| TD-31 | TD-26 requires failover within the authorized maximum cost but leaves the default provider-switch policy open | For an unpinned request, allow **at most one automatic fallback to a verified equivalent provider offering for the same model/version** after a 429, 5xx, connection failure or timeout **before customer-visible output begins**. Recheck required capabilities and data policy; keep the original customer charge ceiling and aggregate provider-cost ceiling. An explicit provider pin has no automatic fallback. No cross-model fallback at launch. Record each attempt and settle the customer once. | Decided launch routing behavior |
| TD-32 | The routing drafts consider Auto model selection for web Chat, while the launch Gateway can route customer-selected models without it | **Auto model selection is not a launch requirement.** Launch with manual model selection and TD-26/31 provider routing. After launch, run Auto in shadow mode and then a limited opt-in web text-Chat pilot only after its evaluation set, cost ceiling, pass thresholds and cohort are approved. Studio and API do not gain Auto from this decision. | Decided release sequence; pilot parameters pending |
| TD-33 | §8.3/8.4 propose a later PT/MAX market; the routing drafts leave PT-linked preference open | The **first qualified Provider Token release has no effect on compute routing**. Link an approved PT to its qualified provider through a separate rights registry and fee ledger; route eligibility remains based on verified model, delivery, price, quality and policy. Any later PT-linked Auto preference requires a distinct product decision and measured pilot after Auto has real performance data. | Decided first PT integration boundary; PT legal/economic gates remain |
| TD-34 | FR-GW-001 requires a current customer price; TD-26/27 allow several providers for one model but do not define the retail display | **Do not assume equivalent providers charge the same customer rate.** Keep a customer rate schedule for each provider-model offering, separate from its internal provider cost schedule. Put Models & Pricing under Providers: one entry per exact model/version opens the provider offerings and their complete customer rate cards. Do not show one model price or combine minimum input and output rates from different providers into a fictitious quote. Chat and Studio show the selected offering's quote and maximum authorized charge before submission; the single-call API follows TD-37. The maximum includes permitted same-model fallback with a different rate. Charge from the actual serving offering's published rate and verified usage without exceeding that maximum. A provider pin uses only that offering and has no automatic fallback. Usage identifies the serving provider and rate. | Decided launch pricing and UI rule |
| TD-35 | FR-PR-002 and TD-29 require verified offerings; the launch measurement standard defines four operational measures but not their customer display | The **Providers page** owns provider profiles, approved offerings, admission status, availability, performance evidence, Provider Tokens, and how to apply. Show **Maxshot-observed delivered success and p50/p95 latency** per offering with window and sample count only when the sample supports them; otherwise show **Insufficient data** with the count. Streaming text uses dispatch-to-first-token latency; other modes use dispatch-to-completion. **Providers → Models & Pricing** compares the provider-specific customer rates for each model without performance/profile detail. Keep metering completeness, provider cost/reconciliation, 429 counts and raw attempts in operations. No public provider ranking or extra benchmark system is required for launch. | Decided minimum customer evidence display and page ownership |
| TD-36 | §4.2 precision and the companion feature PRD leave the MAX mint integer evaluation and rounding status inconsistent | **Confirmed 13 November 2026:** evaluate the complete real-number mint charge exactly in 18-decimal integer units, then round **once upward** to the next MAX wei. Use the operation order and vectors in §5; do not round refill and beyond-peak components independently. | Decided product/contract arithmetic; security review remains |
| TD-37 | TD-34 requires a selected-offering quote before acceptance, but an API call has no interactive confirmation step | **Confirmed 13 November 2026:** use one API call, without a separate quote-and-confirm endpoint. Publish complete offering rate cards. Before provider dispatch, the Gateway selects the eligible offering, computes and reserves the maximum customer charge from bounded request limits including permitted fallback, and rejects a request that cannot be funded or exceeds an optional caller-supplied per-request ceiling or account/API-key limits. Return selected/serving offering and rate metadata where response compatibility permits; always persist them in Usage. Chat and Studio show the server quote and maximum before submission. | Decided API authorization flow; live contract integration pending |
| TD-38 | Unified Gateway account linking could block a depositor from exiting a pre-existing Vault position | **Confirmed 13 November 2026:** an existing Vault depositor may connect the position's wallet and withdraw through the unchanged Vault flow before linking that wallet to a Gateway account. The wallet/contract authorization governs the withdrawal. Gateway account linking is required for unified Portfolio and Gateway account benefits, and remains one wallet per account; wallet-only exit does not create a linked account or grant Credit. | Decided migration access rule; Vault integration pending |
| TD-39 | Subscription §4.3 and older Studio/baseline wording reserve an estimate and allow a later shortfall, while TD-34/37 require an authorized maximum | **Confirmed 15 November 2026:** for text and media, compute an informative estimate and a hard maximum from bounded request settings and all permitted same-model serving rates. Chat/Studio disclose both before submission; API authorizes within its single call. Reserve the entire maximum across eligible funding buckets before dispatch. The final customer charge may exceed the estimate but never the accepted maximum; release unused holds to their original sources/expiries. If verified provider usage exceeds the maximum, cap the customer debit, record the excess as a platform/provider discrepancy, and stop further output when possible. No post-dispatch customer debit above the maximum. | Decided cross-product billing rule; live integration pending |
| TD-40 | §5.1/5.5 and TD-14/22 fix time-weighted accrual and grant epochs but leave fractional Credit rounding open | **Approved 15 November 2026:** fix one versioned rational Credit-per-USD conversion rate for each funded term. Accumulate eligible AIT-wei-seconds per linked account across finalized stake/unstake events. At every shared seven-day boundary and the final short boundary, floor the account's **cumulative** term entitlement to whole Credits and grant only the increase over Credits previously granted. Fractions carry across epochs and unstaking; discard the sub-Credit remainder only at term end. Splitting a stake or replaying a grant cannot increase issuance. See §3.5 for formula and vectors. | Decided arithmetic rule; term conversion value is a funded-program input |
| TD-41 | TD-26/28 define model admission and route minimums but do not define the customer-facing usable model list or catalog breadth | **Updated 15 November 2026:** Gateway maintains the current usable model list for Chat and Studio. Each enabled text, image, and video model catalog must launch with and maintain at least **five distinct usable models**; two provider routes for the same model count as one model. Chat/Studio pickers show only models with an admitted, available, policy-eligible route. Remove a model from those pickers when it becomes unavailable; keep historical records readable without offering that model for a new request. An outage below the five-model target is an operational deficiency, not permission to display an unavailable model or silently substitute another model. | Decided catalog and UI rule; live inventory/health integration pending |
| TD-42 | The referral prototype measured top-ups in Credits, while funded top-ups add Dollar balance | **Approved 15 November 2026:** Maxshot Referrals Program qualification uses a referred user's confirmed top-up event and the USD amount actually credited to Dollar balance after disclosed fees. Attribute each confirmed event at most once. Show top-up volume in USD; grant any approved referrer reward separately as promotional Credits using the reward program's versioned Credit/USD conversion. Subscription payments do not qualify. Reward rate, cap, funding and abuse policy remain commercial inputs. Partner Referral Program AIT accounting stays separate. | Decided event and unit boundary; commercial terms pending |

**Source requirements still in force:** the 50,000 outstanding AIT Genesis cap as a *working proposed parameter*; no cash/NAV redemption; no automatic liquidation; no AIT buyback burn without debt-safe settlement; funded finite credit terms; separate paid/earned/Treasury ledgers; contract audit, legal review and reserve gates. MAX provenance tracking in the minter, the source's one-chain/no-bridge launch assumption and optional per-agent Credit allocation are superseded by TD-10/12/13/24.

## 3. Exact state transition for contract design

### 3.1 State

```text
Global:
  O = outstanding AIT mint debt
  H = highest O ever reached (nondecreasing)
  C = 50,000 AIT proposed Genesis outstanding cap

Per controller:
  D = active AIT debt
  M = active locked MAX
  P = pending MAX redemption
  unlockAt = withdrawal timestamp for all still-pending P

MAX and AIT token precision: 18 decimals each
```

**MAX genesis supply:** Before user operations begin, the Ethereum genesis allocation transaction(s) must place the entire 1B MAX into the approved purpose-specific custodian wallets. The allocation manifest must sum to exactly 1B MAX and be reconciled to wallet balances. After genesis allocation, no administrator may mint additional global MAX. LayerZero bridge sends/receives may debit/credit local chain balances only to move that existing global supply, with global conservation checked across the four enabled chains and in-flight messages.

At launch, Ethereum AIT `totalSupply` equals `O` because AIT cannot bridge. A LayerZero bridge transfer of MAX does not change AIT debt. When AIT bridging is enabled in a future release, its cross-chain send/receive burns and mints must **not** be treated as position redemption; the accounting invariant must then use global AIT supply including in-flight messages rather than Ethereum's local `totalSupply`.

**Integration references:** [LayerZero OFT Standard](https://layerzero.network/resources/oft-standard) describes cross-chain token supply movement; [Robinhood Chain network documentation](https://docs.robinhood.com/chain/connecting/) and [bridging documentation](https://docs.robinhood.com/chain/bridging/) describe its EVM network and LayerZero route. Engineering must verify current endpoint IDs, deployed contracts, peer configuration and route availability for all four chains before release; these links do not substitute for deployment evidence.

`P` is separate from `M`: pending MAX no longer backs active AIT debt, but is still owed to the controller. The displayed blended ratio is `M/D` when `D > 0`; when `D = 0`, there is no active ratio. A new mint may create or add to active `D, M` without changing `P` or `unlockAt`.

### 3.2 Mint

Use the source curve with `C = 50,000`:

```text
R(s) = 600 × [1 + 2(s/C)^2]       MAX per marginal AIT
L(s) = 600s + 400s^3/C^2          cumulative uninterrupted MAX lock

Require q > 0 and O + q <= C.
newPeak = max(0, O + q − H)
refill  = q − newPeak
MAX_charge = refill × R(H) + L(H + newPeak) − L(H)

After payment/eligibility checks:
  O += q
  H = max(H, O)
  controller.D += q
  controller.M += actual MAX charged
  mint q AIT
```

If minting remains at or below the old HWM, `newPeak = 0`. If it crosses the old HWM, quote the refill and beyond-peak portions separately. Example: after `H = 30,000` and `O = 20,000`, minting `q = 15,000` charges `10,000 × 1,032 + [L(35,000) − L(30,000)] = 15,860,000 MAX`; new `H = 35,000`.

### 3.3 Burn and withdrawal

```text
Require 0 < b <= controller.D and controller authorization.
If b == D: maxToPending = M
Else:      maxToPending = floor(b × M / D) in MAX wei

Burn b AIT.
controller.D -= b
controller.M -= maxToPending
controller.P += maxToPending
controller.unlockAt = current burn timestamp + 7 days
O -= b
H remains unchanged

Withdrawal requires P > 0 and current timestamp >= unlockAt.
Transfer P MAX to the controller; set P = 0 and clear unlockAt.
```

The source's single-position partial-close formula still applies mathematically, but the relevant position is now the **merged active balance**. AIT transferred or sold remains fungible; the MAX claim remains with the position controller. A later burn before withdrawal resets the wait on *all* still-pending MAX, including MAX from earlier burns.

### 3.4 Invariants and minimum acceptance cases

Absent a separately designed recovery state:

```text
sum(controller.D) = O = AIT total supply
sum(controller.M) + sum(controller.P) = MAX allocated to user claims
0 <= O <= C
H >= O and H never decreases
```

Test at least: genesis MAX allocations sum to exactly 1B and no later discretionary mint can increase global supply; multiple mints into one blended ratio; partial burn then new mint; full burn with rounding remainder; burn below HWM then refill; a mint crossing HWM; repeated burn before seven days resets the entire pending deadline; withdrawal before deadline fails and withdrawal at/after deadline succeeds; withdrawn MAX is not affected by later burns; a transferable MAX acquired secondarily can mint after returning to Ethereum; restricted custody cannot release unsold MAX without its own authorization; market-bought AIT is not automatically burned or debt-retired; each independent pause and Pause All act only within their stated scope. MAX bridge tests must cover every enabled directed chain pair, global supply conservation and the independent bridge pause. Mint quote arithmetic must be deterministic with explicit slippage/deadline checks.

### 3.5 Staking and Credit ledger behavior

Staking and credit eligibility run on Ethereum only at launch. A verified wallet is linked to exactly one Gateway account, and each account links at most one staking wallet. Stake/unstake transactions are time-weighted from confirmation, without warm-up or unstake delay. Confirmed unstaking stops new accrual immediately but preserves AIT Earned Credit already accrued; a shared seven-day epoch from program start grants it automatically after chain finality, with the normal seven-day expiry. Issued grants retain their expiry. The final short program interval is also granted. AIT Earned Credit is an off-chain Gateway balance. The UI and authorized external agents using scoped keys may spend eligible grants from the same account ledger. Preauthorization follows TD-15's funding order; only subscription-funded text usage consumes subscription text windows. Unused reservations return to their original source/grant and do not extend expiry. A later provider-fault/overcharge refund creates a new seven-day AIT Earned Credit grant for that bucket's portion and restores the Dollar-funded portion to Dollar balance; other source portions follow their own bucket terms. Each settled request and reversal must be idempotent and remain subject to its account/key budget and current model-catalog allowlist for **new** requests. AIT must be unstaked before a position burn.

**TD-40 grant arithmetic:** For one funded term, lock the versioned conversion rate as `N/D` Credits per USD, with positive integer `N` and `D`; its numeric value is a term funding input, not set by this rule. Let `W(t) = Σ(eligible staked AIT wei × eligible seconds)` from term start through boundary `t`, clamped to the term. Use integer arithmetic without rounding individual stake intervals. At each finalized grant boundary:

```text
cumulativeCredits(t) = floor(12 × N × W(t) / (D × 10^18 × 365 × 86,400))
grant(t) = cumulativeCredits(t) − Credits previously granted for this account and term
```

Issue `grant(t)` once for that boundary; a zero grant creates no spendable balance. A partial unstake ends only the unstaked amount's accrual; earlier fractional entitlement stays in `W`. Credits already granted are never recalculated, even if spent or expired. The remaining fraction under one Credit carries through later boundaries and is discarded after the final short-interval grant. Finality or posting delay does not add eligible staking time beyond the term or duplicate a grant.

**Illustrative integer vectors** (use `N/D = 100 Credits/USD` only for these arithmetic examples, not as the production rate):

| Finalized staking history in a 10-day term | Day-7 grant | Final day-10 grant | Total |
|---|---:|---:|---:|
| 1 AIT staked continuously for 10 days | 23 | 9 | 32 |
| 1 AIT staked from day 3 through day 10, then unstaked | 13 | 10 | 23 |
| 0.001 AIT staked continuously for 10 days | 0 | 0 | 0 |

Splitting the day-3-to-day-10 stake into adjacent stake/unstake events leaves the same `W` and the same 13 + 10 grants. Replaying either grant boundary must issue zero additional Credits.

### 3.6 Gateway catalog and routing behavior

The launch Dollar-balance funding path uses the existing crypto-deposit flow after engineering verifies transaction-to-ledger reconciliation. The model catalog is generated from **verified models offered by all supported launch providers**, not a hard-coded list. Every model has one current catalog assignment; a funded AIT Earned Credit program allows a set of catalogs. Assignment is read and versioned when a request is preauthorized; later assignment changes affect only new requests. Provider aliases may map to one customer-facing model ID only after equivalence of model version and required capabilities is verified. Each offering has its own customer rate schedule and separate provider cost schedule; equivalent offerings need not have equal customer rates. For a selected model, deterministic routing chooses the lowest quoted-cost verified provider that meets model, quality, latency and data-policy requirements. Chat and Studio disclose the server-selected offering's estimated customer charge and hard authorized maximum before submission. API calls follow TD-37's single-call authorization: published rate cards and an optional caller ceiling bound the request, while the server computes and reserves the full maximum before provider dispatch. The maximum includes permitted same-model fallback rates and bounded usage. The final customer charge uses the actual serving offering's rate and verified usage, capped at the accepted maximum under TD-39; a provider overrun is a separately recorded platform/provider discrepancy. Models & Pricing is in Providers, with provider rates in each model's detail; Usage records the selected and serving offerings, rate version and fallback.

## 4. Remaining product and handoff gaps

These are **not** resolved by the founder's position/HWM/redemption decisions. They should be assigned to the indicated workstream before that workstream's production implementation or release, rather than filled with developer assumptions.

| Priority | Gap / source decision | Needed decision or artifact | Blocks |
|---|---|---|---|
| Deployment input | Purpose-specific genesis custody allocation and restrictions | Provide wallet addresses, purpose labels and amounts totaling 1B MAX; implement/test vesting or custody rules for restricted allocations | Distribution deployment, not contract architecture |
| P0 | DEC-04: final 50,000 AIT cap and 600→1,800 curve | Founder/quant sign-off and versioned simulator; stress-test merged positions and HWM refill | Mainnet mint configuration |
| P0 | DEC-06/08/09: Credit term, approved catalog set, provider-cost exposure and reserve | Versioned customer terms, catalog/cost caps, worst-case fulfillment model and liquid reserve proof; staking, grant, spend and refund rules are decided | Production Earned Credit program |
| P0 | LayerZero MAX launch across four chains; AIT expansion capability inactive | Endpoint/peer and DVN/executor configuration, all-pair route tests, global MAX supply accounting, independent bridge pause, incident recovery and finality policy; AIT peer deployment is operationally pending | Production cross-chain token deployment |
| P0 | §13/NFR: numeric Gateway SLA, latency, recovery and finance-data freshness | Measurable service targets and load/recovery acceptance tests | Production service commitment |
| P0 | DEC-17/22 and Gateway/provider requirements: actual endpoints, verified model-version mappings, prices and provider supply rights | Verified capability matrix, route constraints and provider contracts; confirm existing crypto-deposit ledger path; no guessed public `SKILL.md` references | Public Gateway and agent integrations |
| P1 | DEC-11/12/19: MAX fee-staking, bonus and Treasury/team-held AIT treatment | Documented rights, eligible balances and nonduplicated reward policy | MAX staking/bonus release |
| P2 | DEC-13/14/15: PT rights, jurisdiction, LP fee ownership and AIT buyback handling | Per-provider legal instrument, AMM fee-capture proof and debt-safe reserve policy | PT/MAX market |
| Cross-cutting | DEC-20 and §§12–14: agent authority, audits, economic stress and incident controls | Named approvers, audit/invariant evidence, multisig/pauses and runbooks | Irreversible production actions |

The **compute-first Gateway**, genesis MAX token/distribution contract, Ethereum merged MAX/AIT state machine, Ethereum-only AIT staking, off-chain Credit ledger and four-chain MAX bridge have no remaining founder-level **product-behavior** decision blocking development. Engineering can build and test them against this addendum. Purpose-specific wallet allocations, AIT peer deployment and end-of-term stake handling are operational inputs or later decisions. Economic approval, exact production configuration, security review and live verification remain release gates, not reasons to defer development. None of this authorizes production token launch or a funded Credit promise.

## 5. Confirmed integer mint quote

The founder confirmed **one upward rounding of the exact total MAX mint charge** on 13 November 2026. Let `W = 10^18` and express `O`, `H`, `q`, `refill`, `newPeak`, and `C = 50,000 × W` in AIT wei. MAX also has 18 decimals. Require `0 <= O <= H <= C`, `q > 0`, and `O + q <= C`. Compute `newPeak` and `refill` as in §3.2, then in this order:

```text
denominator = C × C
numerator = 1200 × refill × H × H
          + 400 × ((H + newPeak)^3 − H^3)
MAX_charge_wei = 600 × q + floor(numerator / denominator)
               + (numerator % denominator == 0 ? 0 : 1)
```

The one conditional wei rounds the **sum** of refill and beyond-peak charge, not either part separately. This is algebraically the §3.2 formula and does not change the real-number curve. With `H + newPeak <= C` and `refill <= C`, `numerator <= 1600 × C^3`, which is 237 bits at this cap and fits in `uint256`; checked arithmetic must still guard invalid inputs. The on-chain quote, transaction check, backend quote, and production UI must use the same integer result, including the existing maximum-MAX-in and deadline guards. The browser prototype's floating-point simulation is not a contract reference.

| Case | `O` | `H` | `q` | Expected `MAX_charge_wei` |
| --- | ---: | ---: | ---: | ---: |
| Initial mint | 0 | 0 | 1 AIT | 600000000160000000000 |
| Refill exactly to HWM | 20,000 AIT | 30,000 AIT | 10,000 AIT | 10320000000000000000000000 |
| Cross HWM | 20,000 AIT | 30,000 AIT | 15,000 AIT | 15860000000000000000000000 |
| Uninterrupted full cap | 0 | 0 | 50,000 AIT | 50000000000000000000000000 |
| Last AIT to cap | 49,999 AIT | 49,999 AIT | 1 AIT | 1799976000160000000000 |
| One-wei AIT dust from zero | 0 | 0 | 1 AIT wei | 601 |
| One-wei AIT refill | 20,000 AIT | 30,000 AIT | 1 AIT wei | 1032 |

For fractional and adversarial tests, convert each displayed AIT amount above to wei before evaluating. Test that splitting a mint into separate transactions can add at most one rounding wei **per transaction**, never undercharge either transaction, and preserves `O`, `H`, position debt, and escrow invariants. Security/quant review still validates the implementation, not the already confirmed rounding decision.

## 6. Change control

1. Keep the read-only source file intact. Record each later founder decision here with date and affected source sections/requirement IDs.
2. If a new decision changes a formula, user right, reserve obligation or unlock timing, update this addendum and the three companion documents together.
3. Engineering must include a source-plus-addendum requirement matrix and the tests in §3.4 in its handoff package.
4. Public launch materials must be reconciled to deployed contracts, funded programs and legal terms. A working decision here is not a live-product claim.
