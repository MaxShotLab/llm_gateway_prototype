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
| TD-14 | §5.1 leaves staking warm-up/time-weighting open | Ethereum AIT staking accrues immediately from confirmed stake time, proportional to actual time staked, with **no warm-up**. Unstaking is immediate with no lock/cooldown; accrued but ungranted Credit is preserved and granted on the next program-wide weekly batch. | Decided |
| TD-15 | §5.5 proposes weekly grants and leaves spend order open; DEC-16 is open | All stakers share a **program-wide weekly grant schedule**; each grant reflects actual eligible time and retains the source's seven-day expiry. Spend earliest-expiring eligible Earned Credit first, then Paid Credit. Unused preauthorization returns to its original source/grant with its original expiry; an expired grant is not revived. | Decided; settled-call refunds are in TD-19 |
| TD-16 | §5.3/5.5 and FR-CR-004 leave eligible-model implementation open | Earned Credit is spendable only on models in the funded program's **approved catalog set**, as specified by TD-23. It can be used from the Gateway UI or the account's scoped Agent key, subject to model and spending limits. | Decided behavior; catalog set/cost caps pending |
| TD-17 | §9.1 proposes an Agent Wallet but does not fix staking-wallet attribution | One verified Ethereum staking wallet may be linked to one Gateway account at launch; **changing or unlinking is unavailable**. Direct on-chain unstaking must remain possible if the Gateway UI is unavailable. | Decided |
| TD-18 | §4.5 and §12 discuss pause but do not define independent controls | Provide separate **Mint**, **Burn** and **Withdraw** pauses, plus **Pause All** for those position actions. MAX LayerZero transfers have an **independent bridge pause**. Role assignment, peer/lane controls and unpause procedure require security design. | Decided controls; authority/configuration pending |
| TD-19 | §5.5/DEC-16 leave refund behavior open | Unused preauthorization returns to its original source/grant and expiry. After a **settled** call is refunded for provider failure or overcharge, restore its Earned Credit portion as a **new seven-day grant** and return its Paid Credit portion to Paid Credit. Reversal must be idempotent and trace to the original request. | Decided |
| TD-20 | §4.4/§5.1 do not define interaction between staking and position burns | Staked AIT must be **unstaked first** before burning it for MAX redemption. Unstaking has no delay. | Decided |
| TD-21 | TD-18's separate MAX bridge pause leaves route granularity open | Support both a **global MAX bridge pause** and an **individual directed-route pause** so unaffected routes can continue. Neither is the position Pause All control. | Decided |
| TD-22 | §5.5 and §11.2 leave weekly grant implementation open | Earned Credit exists **only in the Gateway backend ledger**, not as a token. The backend posts grants automatically after finalized Ethereum staking data, without a user claim transaction. All stakers use consecutive seven-day intervals from program start; a final short interval is granted at term end. | Decided |
| TD-23 | §5.5/FR-CR-004 require eligible models but do not define catalog grouping | Each verified model belongs to **one current model catalog**. A funded program allows a set of catalogs. Model-to-catalog assignments may change; eligibility for a new request uses the assignment at preauthorization, while an in-flight request retains its prior authorization. | Decided |
| TD-24 | §9.1 proposes per-agent wallets and FR-AG-004 leaves agent count/allocation open | Allow **one Agent per Gateway account at launch**. That Agent and the UI spend from the **shared account-level Earned Credit balance**, subject to its scoped key, model permissions and spending limits; no per-agent Credit allocation is needed. | Decided |
| TD-25 | J1 and FR-GW-004 require a paid first-call funding path | Use the Gateway's **existing crypto-deposit flow** for Paid Credit at launch. The claim that the flow is already implemented is founder-provided context; engineering must verify the live transaction-to-balance path. | Decided product path; live verification pending |
| TD-26 | §8.1/FR-GW-001 and §8.2 leave the initial multi-provider catalog and default route open | The launch catalog is dynamic and includes **all verified models** from supported providers. Customers select a model; the Gateway chooses a verified provider deterministically. Default to the **lowest quoted cost** among providers meeting model/capability, quality, latency and data-policy requirements. Failover must remain inside the request's authorized maximum cost. | Decided policy; thresholds/configuration pending |
| TD-27 | §8.1/FR-GW-001 require exact model identity but do not define provider alias equivalence | Multiple providers share one customer-facing model ID **only when Maxshot verifies the same model version and required capabilities**. Different versions or behavior get separate catalog entries. | Decided |

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

Staking and credit eligibility run on Ethereum only at launch. A verified wallet is linked to exactly one Gateway account, and each account links at most one staking wallet. Stake/unstake transactions are time-weighted from confirmation, without warm-up or unstake delay. An unstake preserves Credit already accrued; a shared seven-day epoch from program start grants it automatically after chain finality, with the normal seven-day expiry. The final short program interval is also granted. Earned Credit is an off-chain Gateway balance. The UI and the account's sole Agent may spend eligible grants. Preauthorization uses the earliest-expiring eligible grant before Paid Credit; unused reservations return to the original grant and do not extend its expiry. A later provider-fault/overcharge refund creates a new seven-day Earned grant for the Earned portion and restores the Paid portion to Paid Credit. Each settled request and reversal must be idempotent and remain subject to its account/agent budget and current model-catalog allowlist for **new** requests. AIT must be unstaked before a position burn.

### 3.6 Gateway catalog and routing behavior

The launch Paid Credit path uses the existing crypto-deposit flow after engineering verifies transaction-to-ledger reconciliation. The model catalog is generated from **verified models offered by all supported launch providers**, not a hard-coded list. Every model has one current catalog assignment; a funded Credit program allows a set of catalogs. Assignment is read and versioned when a request is preauthorized; later assignment changes affect only new requests. Provider aliases may map to one customer-facing model ID only after equivalence of model version and required capabilities is verified. For a selected model, deterministic routing chooses the lowest quoted-cost verified provider that meets model, quality, latency and data-policy requirements. Fallback must remain within the user's preauthorized maximum cost; otherwise the call stops before provider charge.

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

## 5. One remaining precision item

The founder fixed both tokens at 18 decimals and approved safe partial-burn rounding. The companion tokenomics document recommends **rounding the exact total MAX mint charge up to the next MAX wei**. That is a sensible anti-undercharge implementation rule, but it was not separately stated by the founder in the decision message. Security/quant review should confirm the exact integer evaluation order and rounding equivalence before a Solidity implementation is frozen. This does not alter the real-number curve above.

## 6. Change control

1. Keep the read-only source file intact. Record each later founder decision here with date and affected source sections/requirement IDs.
2. If a new decision changes a formula, user right, reserve obligation or unlock timing, update this addendum and the three companion documents together.
3. Engineering must include a source-plus-addendum requirement matrix and the tests in §3.4 in its handoff package.
4. Public launch materials must be reconciled to deployed contracts, funded programs and legal terms. A working decision here is not a live-product claim.
