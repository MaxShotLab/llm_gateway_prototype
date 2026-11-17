# SPEC_TOKEN — MAX, AIT, positions, staking and AIT Earned Credit

**Status:** Canonical specification, compacted 16 November 2026. Every rule has one ID (`TOK-Rnn`) and is stated once; reasons are in the cited TD rows of [DECISIONS.md](./DECISIONS.md). Numeric parameters marked *proposed* or *placeholder* are release inputs ([LAUNCH_CONFIG_V0](./LAUNCH_CONFIG_V0.md)), not approved terms. Credit spending and refunds are owned by [SPEC_BILLING](./SPEC_BILLING.md); this file cites `BIL-` rules instead of restating them. Nothing here authorizes mainnet deployment, a token sale or a funded Credit promise.

**Release:** MAX/AIT (build-order steps 6–8 in [00_README §2](./00_README.md#2-releases-and-build-order)). Contract work starts now; economic sign-off, audit and legal review are launch gates (TD-43).

## Overview

All 1 billion MAX exist from genesis on Ethereum and move across four chains by LayerZero without new issuance. A holder brings MAX back to Ethereum and locks it to mint AIT on a fixed curve; each holder has one merged position that tracks the AIT owed and the MAX locked. A global high-water mark stops anyone regaining the cheap early curve price by burning and reminting. Burning AIT moves a proportional share of MAX into a pending balance that becomes withdrawable seven days after the latest burn. Staking AIT from a linked wallet during a funded term earns AIT Earned Credit, an off-chain Gateway Credit posted automatically every seven days from finalized chain data.

```text
MAX (any chain) → return to Ethereum → lock → mint AIT (curve, HWM) → [stake → weekly AIT Earned Credit grants]
burn AIT → proportional MAX to pending → wait 7 days after latest burn → withdraw MAX
```

## 1. Scope and chain layout

- **TOK-R01 · Home chain.** Ethereum mainnet hosts the MAX genesis supply, the merged positions, the HWM, MAX locking, AIT mint and burn, MAX redemption and AIT staking.
- **TOK-R02 · MAX (TD-12).** 18 decimals. LayerZero routes connect Ethereum, Base, Arbitrum One and Robinhood Chain, including direct routes between non-Ethereum chains. MAX must return to Ethereum before it can be locked.
- **TOK-R03 · AIT (TD-13).** 18 decimals, held and transferred on Ethereum only at launch; its LayerZero capability is built but inactive. If AIT bridging is enabled later, bridge burns and mints are not position redemptions, and the supply invariant switches to global supply including in-flight messages.
- **TOK-R04 · AIT Earned Credit (TD-22).** An off-chain Gateway Credit bucket, never a token or an on-chain claim. Its spending follows SPEC_BILLING.
- **TOK-R05 · Pause controls (TD-18/21).** Independent Mint, Burn and Withdraw pauses plus Pause All for those position actions; a global MAX bridge pause and per-directed-route pauses. Each control blocks only its own scope. Authority stays with the multisig and security process; the admin surface shows state only (TD-52).

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

### 2.2 Genesis and eligibility

- **TOK-R06 · Genesis supply (TD-08).** Before any user operation, the genesis transactions place all 1,000,000,000 MAX into the approved purpose-specific custodian wallets; the allocation manifest sums to exactly 1B and reconciles to wallet balances. No administrator can mint more MAX afterward. Bridge sends and receives only move existing supply, with global conservation checked across the four chains and in-flight messages.
- **TOK-R07 · Restricted custody (TD-10).** Unsold Treasury and team allocations stay under custody or vesting controls and cannot be released without their own authorization. Treasury sale receipts reconcile separately from token balances.
- **TOK-R08 · Any transferable MAX may lock (TD-10).** Any transferable ERC-20 MAX on Ethereum, including MAX bought on a secondary market, can be locked; the minter does not track provenance.

### 2.3 Mint

- **TOK-R09 · Merged position (TD-02/11).** Each controller has one non-transferable active position. Every mint adds its AIT to `D` and its MAX charge to `M`; `P` and `unlockAt` are unaffected. The displayed ratio is `M/D` when `D > 0`; with `D = 0` there is no ratio. Each mint and burn is kept as an immutable event with its quote and before/after state.
- **TOK-R10 · Mint quote and HWM (TD-05).** Mint on the curve below, with the outstanding cap, a maximum-MAX-in (slippage) guard and a deadline. A mint at or below the HWM costs `R(H)` per AIT; the part that crosses the HWM costs the curve integral. Burns never lower the HWM. The integer evaluation is in §3.

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

Example: after `H = 30,000` and `O = 20,000`, minting `q = 15,000` charges `10,000 × 1,032 + [L(35,000) − L(30,000)] = 15,860,000 MAX`; the new `H` is 35,000.

### 2.4 Burn and withdrawal

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

- **TOK-R11 · Burn (TD-01/03/20).** A controller burns held, unstaked AIT against its own debt only. A partial burn moves `floor(b × M / D)` MAX wei to pending; a full burn moves all remaining `M`, so rounding dust is never stranded. There is no position time lock and no repricing of earlier mints.
- **TOK-R12 · Pending and withdrawal (TD-04).** Every burn adds to the controller's pending MAX and resets the withdrawal time of the **entire** still-pending balance to that burn plus seven days. Pending MAX no longer backs AIT debt but is still owed to the controller. Withdrawal fails before that time and transfers the full pending amount once at or after it. MAX already withdrawn is unaffected by later burns.
- **TOK-R13 · AIT is fungible; the claim is not.** AIT transfers freely. The right to the locked MAX stays with the position controller; buying AIT never transfers someone else's position. A controller who sold AIT must reacquire it to close; there is no automatic liquidation.

### 2.5 Invariants

- **TOK-R14 · Invariants.** Absent a separately designed recovery state, these hold after every state transition:

```text
sum(controller.D) = O = AIT total supply
sum(controller.M) + sum(controller.P) = MAX allocated to user claims
0 <= O <= C
H >= O and H never decreases
```

- **TOK-R15 · Buyback inventory.** AIT bought on the market, including any protocol buyback, stays in circulating supply and never retires debt unless it is actually burned against a position; there is no automatic burn.

## 3. Confirmed integer mint quote

- **TOK-R16 · One upward rounding (TD-36).** Evaluate the whole real-number charge exactly in 18-decimal integer units and round **once** upward to the next MAX wei; never round the refill and beyond-peak parts separately. Express `O`, `H`, `q`, `refill`, `newPeak` and `C = 50,000 × 10^18` in AIT wei; require `0 <= O <= H <= C`, `q > 0` and `O + q <= C`; compute `newPeak` and `refill` as in §2.3, then:

  ```text
  denominator = C × C
  numerator = 1200 × refill × H × H
            + 400 × ((H + newPeak)^3 − H^3)
  MAX_charge_wei = 600 × q + floor(numerator / denominator)
                 + (numerator % denominator == 0 ? 0 : 1)
  ```

  With `H + newPeak <= C` and `refill <= C`, `numerator <= 1600 × C^3` (237 bits), which fits in `uint256`; checked arithmetic still guards invalid input.
- **TOK-R17 · One result everywhere.** The on-chain quote, transaction check, backend quote and production UI return the same integer result, with the same maximum-MAX-in and deadline guards. The prototype's floating-point quote is not a reference.

Reference vectors (convert displayed AIT amounts to wei before evaluating):

| Case | `O` | `H` | `q` | Expected `MAX_charge_wei` |
| --- | ---: | ---: | ---: | ---: |
| Initial mint | 0 | 0 | 1 AIT | 600000000160000000000 |
| Refill exactly to HWM | 20,000 AIT | 30,000 AIT | 10,000 AIT | 10320000000000000000000000 |
| Cross HWM | 20,000 AIT | 30,000 AIT | 15,000 AIT | 15860000000000000000000000 |
| Uninterrupted full cap | 0 | 0 | 50,000 AIT | 50000000000000000000000000 |
| Last AIT to cap | 49,999 AIT | 49,999 AIT | 1 AIT | 1799976000160000000000 |
| One-wei AIT dust from zero | 0 | 0 | 1 AIT wei | 601 |
| One-wei AIT refill | 20,000 AIT | 30,000 AIT | 1 AIT wei | 1032 |

Splitting a mint into several transactions may add at most one rounding wei per transaction, never undercharges either transaction, and preserves `O`, `H`, position debt and the escrow invariant.

## 4. Staking and AIT Earned Credit

### 4.1 Wallet link and authority

- **TOK-R18 · One linked wallet (TD-17/50).** A Gateway account links at most one Ethereum staking wallet and a wallet links to at most one account, compared by normalized address. The link proof is Sign-In with Ethereum (EIP-4361), with ERC-1271 for contract wallets, bound to the account, chain ID 1, a nonce and an expiry, using the flow already live. Connecting a browser wallet, holding AIT or using the Vault wallet-only exit does not create a link. No change, unlink or admin-assisted relink in this release.
- **TOK-R19 · On-chain authority.** The position controller signs every token operation; a Gateway login never substitutes for it. Direct on-chain unstaking stays possible when the Gateway UI is down.

### 4.2 Accrual, finality and grants

- **TOK-R20 · Staking (TD-14/60).** Staking runs on Ethereum only. For a linked wallet, accrual is time-weighted from the stake with no warm-up, subject to the later-of-stake-and-link rule in TOK-R21. A confirmed unstake stops new accrual for the removed amount at once, with no cooldown; entitlement already accrued is kept for the next grant. Staked AIT must be unstaked before it can be burned (TOK-R11).
- **TOK-R21 · Linked time only (TD-60).** A stake accrues only while its wallet is linked to a Gateway account: accrual starts at the later of the stake time and the time the link was verified. Staking time before the link earns nothing.
- **TOK-R22 · Finality (TD-51).** Accrual and grants read only blocks at or below the Ethereum `finalized` tag, with no block-count heuristic. Stake and unstake times are block timestamps, not indexer observation times. A boundary posts once its timestamp is finalized and covers every finalized event up to it; a late batch posts the same amounts as an on-time one.
- **TOK-R23 · Funded term.** Accrual happens only inside an approved, prefunded term. Each term locks its length, a versioned rational Credits-per-USD rate `N/D`, its allowed catalog set and a rational annual base accrual `A_num/A_den` USD per staked AIT (proposed `12/1`, equivalent to `$12/365` per day). Before any grant, the reserve covers the maximum fulfillment cost plus a buffer, and a daily coverage report stays above the approved threshold. No perpetual or unfunded entitlement.
- **TOK-R24 · Grants (TD-15/22).** All accounts share consecutive seven-day boundaries from the term start, plus a final short boundary at term end. The backend posts each grant automatically after finality; the user makes no claim. Each grant expires seven days after issue; a zero entitlement creates no grant.
- **TOK-R25 · Cumulative integer grant (TD-40).** Let `W(t)` be the eligible staked AIT wei × eligible seconds from term start to boundary `t`, clamped to the term and linked time (TOK-R21), in integer arithmetic without rounding individual intervals. With the term's `A_num/A_den` and `N/D` (TOK-R23), at each boundary:

  ```text
  cumulativeCredits(t) = floor(A_num × N × W(t) / (A_den × D × 10^18 × 365 × 86,400))
  grant(t) = cumulativeCredits(t) − Credits previously granted for this account and term
  ```

  Issue `grant(t)` once per account, term and boundary. Credits already granted are never recalculated, even if spent or expired. Fractions under one Credit carry across boundaries and unstaking and are discarded after the final short boundary. Splitting a stake, replaying a boundary or posting late never increases issuance.

Illustrative vectors (`A_num/A_den = 12/1 USD per AIT per year` and `N/D = 100 Credits/USD` for arithmetic only; the live unit is 1,000,000 Credits = $1):

| Finalized staking history in a 10-day term | Day-7 grant | Final day-10 grant | Total |
|---|---:|---:|---:|
| 1 AIT staked continuously for 10 days | 23 | 9 | 32 |
| 1 AIT staked from day 3 through day 10, then unstaked | 13 | 10 | 23 |
| 0.001 AIT staked continuously for 10 days | 0 | 0 | 0 |

Splitting the day-3-to-day-10 stake into adjacent stake and unstake events gives the same `W` and the same 13 + 10 grants; replaying either boundary issues nothing more.

### 4.3 Spending, refunds and display

- **TOK-R26 · Spend and refund.** AIT Earned Credit is spent first in the funding order (BIL-R08), only on models whose catalog is in the term's set (BIL-R06), from the UI or a scoped key against the same account balance. Unused holds return to the original grant and expiry (BIL-R28). A refund of a settled charge restores the AIT portion as a new seven-day grant (BIL-R42).
- **TOK-R27 · Display (TD-07/51).** The position view shows active AIT debt, active MAX, the `M/D` ratio, pending MAX, the next withdrawal time and that another burn would reset it. The staking view shows a stake only after its block is finalized, plus the funded term, its end and the remaining obligation.

## 5. Acceptance (formerly B5)

The browser prototype is illustrative; this repository has no production contracts, wallet connector, staking index or Credit ledger. Each part closes only when its live cases pass; screenshots cannot close it.

### 5.1 Ethereum token and position

| Case | Required live result |
| --- | --- |
| Genesis and chain scope (TOK-R01–R03, R06–R07) | Exactly 1,000,000,000 MAX with 18 decimals minted on Ethereum into the approved custodian wallets, reconciled to the manifest; no later mint path exists; restricted allocations cannot leave custody without their authorization. AIT has 18 decimals and lives on Ethereum only. |
| MAX movement (TOK-R02, R06) | Every enabled directed route among the four chains moves existing MAX, including direct non-Ethereum routes, with global supply conserved including in-flight amounts. MAX held elsewhere must return to Ethereum before locking. AIT cross-chain transfer is disabled. |
| Mint quote (TOK-R08, R10, R16–R17) | On-chain, transaction, backend and UI quotes match every reference vector; the cap, maximum-MAX-in and deadline guards hold; secondary-market MAX mints without provenance checks; a split mint adds at most one wei per transaction. |
| Merged position and HWM (TOK-R09–R10) | Repeated mints build one non-transferable position; burn-then-refill pays `R(H)`; a crossing mint splits refill from the above-peak integral before the single rounding; the HWM never falls; every mint and burn event is retained. |
| Burn and redeem (TOK-R11–R13) | Only unstaked AIT against the controller's own debt burns; a partial burn rounds MAX down and a full burn moves all residual MAX; a second burn resets the whole pending wait; early withdrawal fails and an on-time withdrawal transfers once; withdrawn MAX is untouched by later burns. |
| Invariants and inventory (TOK-R14–R15) | All invariants reconcile after every transition, across partial burn → remint, full-burn dust, refill, HWM crossing, the cap boundary, repeated burns and pause transitions; market-bought AIT never reduces debt. |
| Pauses (TOK-R05) | Each pause blocks only its own operation; Pause All blocks all position actions; global and directed-route bridge pauses affect only the bridge. |

Contract audit and security review remain release gates.

### 5.2 Wallet link and staking

| Case | Required live result |
| --- | --- |
| Link and duplicates (TOK-R18–R19) | A verified SIWE or ERC-1271 proof links a wallet once; a second wallet for the account or the same wallet for another account is rejected; attribution follows only the verified link; on-chain unstaking works with the Gateway UI down. |
| Stake, unstake and finality (TOK-R20–R22) | For an already linked wallet, accrual starts at the stake's finalized block time with no warm-up; a partial unstake ends only the removed amount's accrual; accrued entitlement survives to the next grant; staked AIT cannot be burned. For a pre-link stake, the link time applies instead. |
| Pre-link staking (TOK-R21) | A wallet staked for three days before linking accrues only from the verified link time. |
| Index and replay (TOK-R22, R25) | Reprocessing, delayed finality or a reorganization never duplicates or misattributes AIT-wei-seconds; on-chain stake, indexed balance and account display reconcile. |

### 5.3 Off-chain AIT Earned Credit

| Case | Required live result |
| --- | --- |
| Program boundary (TOK-R23–R24) | Accrual happens only inside the funded term and for eligible linked time; the final short boundary grants once; an unstaked wallet receives its accrued amount at the next boundary, then nothing more; no grant posts without reserve coverage. |
| Grant ledger (TOK-R24–R25) | For each account, term and boundary, exactly one automatic grant with amount, issue time, seven-day expiry and program can be rebuilt from finalized events; a zero entitlement creates no grant; the vectors above reproduce exactly; grants, spending and expiry reconcile to the balance. |
| Spend and refund (TOK-R26) | Covered by SPEC_BILLING §7 cases 1, 6, 10 and 12. |
| Display (TOK-R27) | The position view shows debt, MAX, ratio, pending MAX and next withdrawal time and warns that another burn resets it; the staking view shows only finalized stakes. |

## 6. Inputs, open items and out of scope

**Release inputs** ([LAUNCH_CONFIG_V0](./LAUNCH_CONFIG_V0.md), [DECISIONS §3](./DECISIONS.md)): purpose-specific genesis wallet manifest and vesting; the 50,000 AIT cap and 600→1,800 curve sign-off (DEC-04); funded-term length, base accrual, `N/D` rate, catalog set, reserve and buffer; LayerZero endpoint, DVN and executor configuration; AIT peer deployment; end-of-term stake handling. The 50,000,000 MAX sale at $0.10 is decided (TD-09); sale execution sits with the commercial team.

**References:** [LayerZero OFT Standard](https://layerzero.network/resources/oft-standard); Robinhood Chain [network](https://docs.robinhood.com/chain/connecting/) and [bridging](https://docs.robinhood.com/chain/bridging/) documentation. Engineering verifies endpoint IDs, deployed contracts, peer configuration and route availability for all four chains before release; these links are not deployment evidence.

**Out of scope for this release:** AIT cross-chain transfer; wallet change, unlink or relink; the MAX Boost Bonus Pool and MAX fee-staking rights (later release, TD-61, DEC-11/12/19); Provider Token markets; debt-retiring AIT buybacks.

**Prototype limit:** `frontend/src/pages/TokenomicsPage.jsx` shows a merged position, HWM refill, stake and unstake, burn and the seven-day pending withdrawal in browser state. Its mint math is floating-point and is not the contract reference.

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
