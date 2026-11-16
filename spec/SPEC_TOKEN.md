# SPEC_TOKEN — MAX, AIT, positions, staking and AIT Earned Credit

**Status:** Canonical specification, 16 November 2026. Merges the former feature PRD §4.2–4.3/§5, decision addendum §3/§5 and the B5 token/wallet/Credit handoff (all in [`archive/`](./archive/)). Decisions are recorded in [DECISIONS.md](./DECISIONS.md); this file states the resulting behavior. Numeric parameters marked *proposed* or *input* are release inputs ([LAUNCH_CONFIG_V0](./LAUNCH_CONFIG_V0.md)), not approved launch terms. Nothing here authorizes mainnet deployment, a token sale or a funded Credit promise.

**Release:** MAX/AIT (build-order steps 6–8 in [00_README §2](./00_README.md#2-releases-and-build-order)). Contract work starts now; economic sign-off, audit and legal review are launch gates (TD-43).

## 1. Scope and chain layout

- **Ethereum mainnet** hosts the MAX genesis supply, the non-transferable merged position, HWM, MAX lock, AIT mint/burn, seven-day MAX redemption and AIT staking.
- **MAX** has 18 decimals and LayerZero routes among Ethereum, Base, Arbitrum One and Robinhood Chain, including direct destination-to-destination routes. MAX must return to Ethereum before it can be locked (TD-12).
- **AIT** has 18 decimals and is held and transferred on Ethereum only at launch; its LayerZero capability is built but inactive (TD-13).
- **AIT Earned Credit** is an off-chain Gateway Credit bucket, not a token (TD-22). Its spend rules are in [SPEC_BILLING](./SPEC_BILLING.md).
- Pause controls: independent Mint, Burn and Withdraw pauses plus Pause All for position actions; independent global MAX bridge pause and per-directed-route pauses (TD-18/21). Authority stays with the multisig/security process; the admin surface shows state only (TD-52).

Integration references: [LayerZero OFT Standard](https://layerzero.network/resources/oft-standard); [Robinhood Chain network](https://docs.robinhood.com/chain/connecting/) and [bridging](https://docs.robinhood.com/chain/bridging/) documentation. Engineering verifies current endpoint IDs, deployed contracts, peer configuration and route availability for all four chains before release.

## 2. Position state machine

### 2.1 State

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

### 2.2 Mint

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

### 2.3 Burn and withdrawal

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

### 2.4 Invariants and minimum acceptance cases

Absent a separately designed recovery state:

```text
sum(controller.D) = O = AIT total supply
sum(controller.M) + sum(controller.P) = MAX allocated to user claims
0 <= O <= C
H >= O and H never decreases
```

Test at least: genesis MAX allocations sum to exactly 1B and no later discretionary mint can increase global supply; multiple mints into one blended ratio; partial burn then new mint; full burn with rounding remainder; burn below HWM then refill; a mint crossing HWM; repeated burn before seven days resets the entire pending deadline; withdrawal before deadline fails and withdrawal at/after deadline succeeds; withdrawn MAX is not affected by later burns; a transferable MAX acquired secondarily can mint after returning to Ethereum; restricted custody cannot release unsold MAX without its own authorization; market-bought AIT is not automatically burned or debt-retired; each independent pause and Pause All act only within their stated scope. MAX bridge tests must cover every enabled directed chain pair, global supply conservation and the independent bridge pause. Mint quote arithmetic must be deterministic with explicit slippage/deadline checks.


## 3. Confirmed integer mint quote

The founder confirmed **one upward rounding of the exact total MAX mint charge** on 13 November 2026. Let `W = 10^18` and express `O`, `H`, `q`, `refill`, `newPeak`, and `C = 50,000 × W` in AIT wei. MAX also has 18 decimals. Require `0 <= O <= H <= C`, `q > 0`, and `O + q <= C`. Compute `newPeak` and `refill` as in §2.2, then in this order:

```text
denominator = C × C
numerator = 1200 × refill × H × H
          + 400 × ((H + newPeak)^3 − H^3)
MAX_charge_wei = 600 × q + floor(numerator / denominator)
               + (numerator % denominator == 0 ? 0 : 1)
```

The one conditional wei rounds the **sum** of refill and beyond-peak charge, not either part separately. This is algebraically the §2.2 formula and does not change the real-number curve. With `H + newPeak <= C` and `refill <= C`, `numerator <= 1600 × C^3`, which is 237 bits at this cap and fits in `uint256`; checked arithmetic must still guard invalid inputs. The on-chain quote, transaction check, backend quote, and production UI must use the same integer result, including the existing maximum-MAX-in and deadline guards. The browser prototype's floating-point simulation is not a contract reference.

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

## 4. Staking and AIT Earned Credit

### 4.1 Wallet link and attribution

One Gateway account links at most one verified Ethereum staking wallet, and one wallet cannot link to two accounts (TD-17). Link proof is **Sign-In with Ethereum (EIP-4361)**, with **ERC-1271** signature validation for contract wallets, using the flow already implemented in the live product; the message is bound to the Gateway account, chain ID 1, a nonce and an expiry (TD-50). Addresses are compared normalized. Merely connecting a browser wallet, holding AIT, or using the Vault wallet-only exit does not create attribution. **Changing or unlinking a wallet is unavailable in this release, admin-assisted included** (TD-17/50). The position controller signs token operations; Gateway login never substitutes for on-chain authority, and direct on-chain unstaking stays possible if the Gateway UI is down.

### 4.2 Accrual, finality and grants

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


**Finality rule (TD-51):** accrual and grant computation read only blocks at or below the Ethereum `finalized` tag; no block-count heuristic. Eligible AIT-wei-seconds use the stake/unstake event's block timestamp, not indexer observation time. A grant boundary posts once the boundary timestamp is itself finalized; the batch then covers all finalized events up to that boundary, and a delayed batch posts the same amounts as an on-time batch. The UI shows a stake only once its block is finalized; there is no pending-finality state.

## 5. Feature requirements and acceptance

### 5.1 MAX and AIT — gated Genesis

| Feature | Requirement | Acceptance evidence |
|---|---|---|
| Primary distribution | Mint the full fixed 1B MAX on Ethereum at launch into purpose-specific custodian wallets; no later discretionary global issuance; minter accepts any transferable MAX, including secondary purchases | Genesis allocation manifest and balances sum to 1B; restricted custody prevents unauthorized release; bridge transfers conserve global supply; Treasury receipts reconcile separately |
| MAX cross-chain | LayerZero MAX transfers across Ethereum, Base, Arbitrum One and Robinhood Chain, including direct chain-to-chain routes; lock/mint only on Ethereum | Enabled routes reconcile global supply; bridge has both global and directed-route pauses; remote MAX returns before mint |
| AIT chain scope | AIT mint/burn/stake and MAX redemption occur only on Ethereum; AIT bridge transfers are disabled at launch | No remote AIT mint or transfer route can create unbacked supply |
| Curve mint | Lock eligible MAX and mint AIT using approved deterministic quote with slippage and deadline guards | Boundary tests: 50,000 outstanding cap and 600→1,800 marginal MAX/AIT curve |
| Position ledger | Keep one non-transferable merged active position per controller: remaining locked MAX, remaining AIT debt and displayed `MAX/AIT` ratio; retain individual mint/burn events | Active debt reconciles to Ethereum AIT supply at launch; active plus pending MAX reconciles to allocated escrow |
| Closeout | Unstake AIT first if necessary, then burn against the merged position; move proportional MAX to pending redemption, with no position time lock or repricing | Partial burn rounds MAX down; final burn moves all remaining MAX; controller cannot withdraw before seven days after latest burn |
| Redemption wait | Every burn adds to the controller's pending MAX and resets the entire pending balance's withdrawal time to burn time plus seven days | A second burn before withdrawal delays all pending MAX; matured withdrawals remove only the amount actually withdrawn |
| Remint protection | HWM is the peak historical outstanding AIT debt; quote refills at `R(HWM)` and excess above HWM by the curve integral | Burn/remint sequence cannot regain early cheap curve price; split-crossing quote is exact |
| Pause controls | Independent Mint, Burn and Withdraw pauses; emergency Pause All for position actions; separate global and directed-route MAX bridge pauses | Each switch blocks only its operation, while Pause All blocks all position actions |
| Stake and term display | Ethereum-only stake/unstake with immediate time-weighted accrual, no warm-up or unstake delay; show funded term, expiry and remaining obligation | Accrued Credit survives unstake; stake snapshots match weekly grants and displayed terms |
| Wallet attribution | One verified Ethereum staking wallet per Gateway account, linked by SIWE (EIP-4361) with ERC-1271 for contract wallets; no change, unlink or admin-assisted relink in this release (TD-17/50) | No wallet can accrue into two accounts; direct on-chain unstake remains available |

**Approved mint quote rule:** Let `O` be global outstanding AIT debt, `H` the current HWM, `q` the new AIT quantity, `C = 50,000`, `R(s) = 600[1 + 2(s/C)²]` and `L(s) = 600s + 400s³/C²`. Require `O + q <= C`. Set `newPeak = max(0, O + q − H)` and `refill = q − newPeak`. Charge `refill × R(H) + L(H + newPeak) − L(H)` MAX, then set `H = max(H, O + q)`. MAX and AIT use 18 decimals; round the exact total mint charge up **once** to the next MAX wei, never below the formula. [§3](#3-confirmed-integer-mint-quote) fixes the integer evaluation order and acceptance vectors.

### 5.2 Compute Credit and solvency — gated Genesis

| Feature | Requirement | Acceptance evidence |
|---|---|---|
| Separate balances | Dollar balance and each Credit bucket have distinct ledgers and terms | No balance or revenue double count |
| Funded program | Commit finite term and reserve maximum fulfillment cost plus buffer before grants | Daily coverage report remains above approved threshold |
| Base accrual | Qualified AIT stake accrues `$12/365` USD-credit per AIT-day during the approved term; a fixed, versioned Credits-per-USD rate applies for that term. At each grant boundary, floor cumulative AIT-wei-second entitlement to integer Credits and issue only the increase over prior grants (TD-40). | Fractions carry across epochs and unstaking; final sub-Credit remainder is discarded; split stakes and replayed grants cannot increase issuance |
| Grant lifecycle | Off-chain Gateway ledger automatically grants Credit after chain finality in shared seven-day intervals from program start, including final short interval; each grant expires seven days after issue | No claim transaction; grant, use, expiry and provider obligations reconcile |
| Spend protection | Program allows a set of model catalogs; each model has one changeable catalog assignment, evaluated at new-request authorization; earliest-expiring eligible AIT Earned Credit before subscription allowance, other promotional Credits, then Dollar balance; only the subscription-funded portion consumes subscription text windows; unused preauthorization returns to original grant/expiry | Concurrency test has no negative balance or unfunded provider call; in-flight authorizations remain stable; expired remainder cannot be reused |
| Settled-call refund | Provider failure or overcharge restores the AIT Earned Credit portion as a new seven-day grant and the Dollar-funded portion to Dollar balance | Reversal is idempotent and traces to the original request without double credit |
| Optional bonus | Separately funded MAX Boost Bonus Pool | Base entitlement does not change; bonus stays within pool |

Spend protection and settled-call refund rows are owned by [SPEC_BILLING](./SPEC_BILLING.md) and repeated here for completeness.

## 6. Live proof (formerly B5)

The browser prototype is illustrative; this repository has no production token contracts, wallet connector, staking index or Gateway Credit ledger. Genesis allocations, bridge security configuration and funded-program parameters are release inputs.

### 6.1 Ethereum token and position proof

| Case | Required live result |
| --- | --- |
| Genesis and chain scope | Exactly 1,000,000,000 MAX with 18 decimals is minted on Ethereum into the approved purpose-specific custodian wallets; balances reconcile to the deployment manifest. No later discretionary global mint exists. AIT is 18 decimals and operates on Ethereum only at launch. |
| MAX movement | Every enabled directed route among Ethereum, Base, Arbitrum One and Robinhood Chain moves existing MAX without increasing global supply, including in-flight amounts. Direct destination-to-destination routes work. MAX must return to Ethereum before lock/mint. AIT cross-chain transfer is disabled. |
| Mint quote | On-chain quote, transaction check, backend quote and displayed production quote agree on the [exact integer formula and vectors](#3-confirmed-integer-mint-quote): one upward rounding of the total charge in MAX wei. Enforce the configured outstanding cap, maximum-MAX-in and deadline. Any transferable ERC-20 MAX can be used without provenance tracking. |
| Merged position and HWM | Repeated mints by one controller add to one non-transferable active position. Outstanding AIT debt equals AIT supply; global HWM never decreases. Burns do not lower HWM; refill at or below it uses its marginal rate, and a crossing mint splits refill from above-peak integral before the single rounding. Event history retains each mint even though the displayed ratio is current active MAX divided by active AIT debt. |
| Burn and redeem | Controller burns held, unstaked AIT against only their own debt. Partial burn moves `floor(b × M / D)` MAX wei from active to pending; final burn moves all remaining active MAX. Each burn resets the **entire still-pending** balance's withdrawal time to that burn plus seven days. Withdrawal before the deadline fails; at/after it, pending MAX transfers once. Earlier withdrawn MAX is unaffected. |
| Pauses and custody | Separate Mint, Burn, Withdraw and position Pause All scopes act as defined; independent global MAX bridge and directed-route pauses affect only the bridge. Restricted genesis allocations cannot escape their approved custody/vesting controls. |

Reconcile `sum(active AIT debt) = outstanding AIT = Ethereum AIT totalSupply`, `HWM >= outstanding`, and `sum(active MAX + pending MAX) = MAX owed to position controllers` after every state transition. Test partial burn → remint, full burn dust, refill, HWM crossing, cap boundary, repeated burn, and pause/unpause transitions with the shared reference vectors. AIT bought in the market remains circulating inventory until it is actually burned against debt; a buyback alone does not reduce debt. Contract audit and security review remain production release gates.

### 6.2 Wallet attribution and staking proof

One Gateway account links at most one verified Ethereum staking wallet, and one wallet cannot link to two accounts. Linking requires wallet proof; merely connecting a browser wallet, owning an AIT balance, or using the existing Vault wallet-only exit does not create account attribution. Changing or unlinking is unavailable in this release. The connected position controller signs token operations; Gateway login does not substitute for the wallet's on-chain authority. Direct on-chain unstaking remains possible if the Gateway UI is down.

| Case | Required live result |
| --- | --- |
| Link and duplicate | Verified signature links the wallet once. A second wallet for that account or the same wallet for another account is rejected; Portfolio and Credit attribution follow only the verified link. |
| Stake/unstake and finality | Confirmed Ethereum stake begins time-weighted accrual immediately, without warm-up. Partial or full confirmed unstake ends only the removed amount's new accrual immediately, without cooldown. Previously accrued but ungranted entitlement remains for the next shared grant. Staked AIT must be unstaked before position burn. |
| Index/replay | Finalized stake/unstake events drive account accrual once. Reprocessing, delayed finality or a chain reorganization does not duplicate or misattribute eligible AIT-wei-seconds. The on-chain stake, indexed balance and account display reconcile. |

### 6.3 Off-chain AIT Earned Credit proof

AIT Earned Credit is a Gateway ledger allowance, not an ERC-20 or on-chain claim. One funded term locks a versioned rational Credits-per-USD rate and approved model-catalog set. All accounts share consecutive seven-day grant boundaries from program start, with a final short boundary. After Ethereum finality, the backend posts each grant automatically; no user claim action is required. Grants expire seven days after issue.

Use the [TD-40 cumulative integer formula and illustrative vectors](#42-accrual-finality-and-grants) as shared backend tests. Floor **cumulative** term entitlement to whole Credits and grant only its increase over prior grants. Fractional entitlement carries across epochs and unstaking, then ends with the term. Splitting a stake, replaying an epoch, or delaying a posting cannot increase issuance; spent or expired earlier grants are not recalculated.

| Case | Required live result |
| --- | --- |
| Program boundary | Accrual occurs only during the approved funded term and for eligible linked staking time. The final short interval grants once. An unstaked wallet receives its already accrued amount at the next common boundary, then no new accrual. |
| Grant ledger | For each account/term/boundary, exactly one automatic grant, amount, issue time, seven-day expiry and source program can be reconstructed from finalized chain events. A zero entitlement creates no spendable grant. Grant, spend and expiry reconcile to the Credit balance. |
| Eligibility and spend | Each model has one current catalog; a program permits a set. New authorization checks the current assignment, while an accepted in-flight request retains its earlier decision. UI and scoped external-agent calls spend the same account balance. Earliest-expiring eligible AIT grants fund a request before subscription allowance, Free/Referral Credits and Dollar balance under [SPEC_BILLING](./SPEC_BILLING.md). |
| Reservation and refund | Unused hold returns to its original grant and original expiry; expiry is not extended or revived. A settled provider-fault/overcharge refund restores the AIT-funded portion as a **new seven-day grant**, with one idempotent reversal linked to the original charge. Dollar-funded portions return to Dollar balance. |

The numeric conversion rate, funded term, catalog set, provider-cost exposure and reserve must be supplied and approved before a live Earned Credit promise. They are program inputs; the arithmetic, attribution, grant and spend behavior above is ready for development. SPEC_BILLING owns request-level funding and provider-charge reconciliation.

**Prototype limit:** `frontend/src/pages/TokenomicsPage.jsx` illustrates a merged position, HWM refill, stake/unstake, burn and seven-day pending withdrawal in browser sample state. Its mint calculation is floating-point and is **not** the contract reference. Proof closes only when the live contract, index, account and ledger cases above pass; screenshots cannot close it.

## 7. Terms

| Term | Meaning |
|---|---|
| **MAX** | Network token; eligible units can be locked to mint AIT. A separate qualified stake may receive PT fee participation. |
| **AIT** | Fungible, tradable compute-rights token minted through eligible MAX lock. It is not a stablecoin or Treasury principal claim. |
| **Merged mint position / AIT debt** | One active position per controller: remaining MAX collateral and AIT quantity owed. Its displayed average is `remaining MAX / remaining AIT debt`; each mint changes that average and a partial burn preserves it except for integer rounding. Freely traded AIT does not transfer the position. |
| **Pending MAX redemption** | MAX moved out of active collateral by AIT burn. It becomes withdrawable seven days after the latest burn; any new burn resets the wait for all still-pending MAX. |
| **Curve high-watermark (HWM)** | Peak historical outstanding AIT debt. Burns never lower it. A mint at or below HWM costs `R(HWM)` per AIT; a mint crossing HWM splits into refill and above-peak integral portions. |
| **Dollar balance (USD)** | Customer-funded Gateway balance from confirmed top-ups, under payment/refund terms. Older token documents call it Paid Credit; it is not a Credit allowance. |
| **AIT Earned Credit** | Funded, term-limited, off-chain service allowance from eligible AIT staking; not cash or an ERC-20. Unstaking stops new accrual but preserves already accrued entitlement for the next grant. Future campaign Credits require separate funding and naming. |
| **PT** | Provider-specific token. Equity, debt or cash-flow rights exist only if binding issuer documents create them. |
| **Buyback reserve** | Protocol inventory of market-purchased AIT; holding it does not extinguish users' AIT mint debt. |
