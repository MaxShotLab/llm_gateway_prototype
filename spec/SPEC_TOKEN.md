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
- **TOK-R35 · Distribution labels.** Every MAX movement out of the genesis custodian wallets is labeled with its purpose: primary sale to Treasury, secondary trade, protocol LP transfer, team vesting, ecosystem incentive or another explicit category. Treasury capital increases only with actual inflows legally attributable to Treasury; secondary purchases, locks and token valuation are never counted as Treasury receipts.

### 2.3 Mint

- **TOK-R09 · Merged position (TD-02/11).** Each controller has one non-transferable active position. Every mint adds its AIT to `D` and its MAX charge to `M`; `P` and `unlockAt` are unaffected. The displayed ratio is `M/D` when `D > 0`; with `D = 0` there is no ratio. Each mint and burn is kept as an immutable event with its quote and before/after state.
- **TOK-R10 · Mint quote and HWM (TD-05/74).** Mint on the curve below, with the outstanding cap and a maximum-MAX-in guard derived from the user's chosen slippage tolerance. A mint at or below the HWM costs `R(H)` per AIT; the part that crosses the HWM costs the curve integral. Burns never lower the HWM. The integer evaluation is in §3.
- **TOK-R34 · Mint rate limits.** The minter supports configurable per-block and per-epoch mint limits and optional opening windows (values are release inputs). Pausing new mints leaves burns and withdrawals available unless their own pause is set for a specific security emergency (TOK-R05).

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
- **TOK-R33 · Contract governance.** No upgrade changes the curve or debt of existing positions retroactively. Upgrades go through the multisig with a time delay and public disclosure; contract source is publicly verified and addresses are published in a contract registry (XCT-G01, G08). No pause or emergency control can seize assets, mint beyond the cap, alter existing debt or bypass governance.

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
- **TOK-R17 · One result everywhere.** The on-chain quote, transaction check, backend quote and production UI return the same integer result. For a user-selected tolerance `t` expressed as a rational fraction, `maxMAXInWei = ceil(reviewed_MAX_charge_wei × (1 + t))`; this maximum stays fixed for the submitted transaction. The contract re-quotes at execution and reverts if its charge exceeds that maximum. There is no quote expiry or required deadline. The prototype's floating-point quote is not a reference.

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

- **TOK-R20 · Staking (TD-14/60/67/77).** Staking runs on Ethereum only. Maxshot maintains a current active funded term (TOK-R23), but staking remains possible during an exceptional term gap and accrues nothing then. For a linked wallet, accrual is time-weighted from the stake with no warm-up, subject to the start rule in TOK-R21. A confirmed unstake stops new accrual for the removed amount at once, with no cooldown; entitlement already accrued is kept for the next grant. Staked AIT must be unstaked before it can be burned (TOK-R11).
- **TOK-R21 · Accrual start (TD-60/67).** A stake accrues only while its wallet is linked to a Gateway account and the account has accepted the current term's terms version: accrual starts at the latest of the stake time, the time the link was verified, the term start and the time that terms version was accepted. Staking time before any of these earns nothing, and an existing stake does not accrue in a new term until its terms version is accepted.
- **TOK-R22 · Finality (TD-51).** Accrual and grants read only blocks at or below the Ethereum `finalized` tag, with no block-count heuristic. Stake and unstake times are block timestamps, not indexer observation times. A boundary posts once its timestamp is finalized and covers every finalized event up to it; a late batch posts the same amounts as an on-time one.
- **TOK-R23 · Funded term (TD-77).** Accrual happens only inside an approved, prefunded term. The approved base rate is **$12 per eligible staked AIT-year**, expressed exactly as `A_num/A_den = 12/1` USD per AIT per 365-day year in TOK-R25. Each term locks its length, a versioned rational Credits-per-USD rate `N/D`, its allowed catalog set and this base rate. Maxshot prepares and funds the successor term before the current one ends so there is always an active term in normal operation; a term is never created without approval and reserve coverage. Before any grant, the reserve covers the maximum fulfillment cost plus a buffer, and a daily coverage report stays above the approved threshold. If a successor cannot be funded, accrual stops at the current term end under TOK-R20; there is no unfunded entitlement.
- **TOK-R24 · Grants (TD-15/22).** All accounts share consecutive seven-day boundaries from the term start, plus a final short boundary at term end. The backend posts each grant automatically after finality; the user makes no claim. Each grant expires seven days after issue; a zero entitlement creates no grant.
- **TOK-R25 · Cumulative integer grant (TD-40).** Let `W(t)` be the eligible staked AIT wei × eligible seconds from term start to boundary `t`, clamped to the term and linked time (TOK-R21), in integer arithmetic without rounding individual intervals. With the term's `A_num/A_den` and `N/D` (TOK-R23), at each boundary:

  ```text
  cumulativeCredits(t) = floor(A_num × N × W(t) / (A_den × D × 10^18 × 365 × 86,400))
  grant(t) = cumulativeCredits(t) − Credits previously granted for this account and term
  ```

  Issue `grant(t)` once per account, term and boundary. Credits already granted are never recalculated, even if spent or expired. Fractions under one Credit carry across boundaries and unstaking and are discarded after the final short boundary. Splitting a stake, replaying a boundary or posting late never increases issuance.

Reference vectors (`A_num/A_den = 12/1` USD per AIT per year and `N/D = 1,000,000 Credits/USD`):

| Finalized staking history in a 10-day term | Day-7 grant | Final day-10 grant | Total |
|---|---:|---:|---:|
| 1 AIT staked continuously for 10 days | 230,136 | 98,631 | 328,767 |
| 1 AIT staked from day 3 through day 10, then unstaked | 131,506 | 98,630 | 230,136 |
| 0.001 AIT staked continuously for 10 days | 230 | 98 | 328 |

Splitting the day-3-to-day-10 stake into adjacent stake and unstake events gives the same `W` and the same 131,506 + 98,630 grants; replaying either boundary issues nothing more.

- **TOK-R30 · Coverage guard (TD-62).** Each day, check that eligible liquid fulfillment resources are at least the maximum cost of unexpired AIT Earned Credit, plus in-flight API commitments, plus unpaid provider liabilities allocated to Credit, plus the policy buffer. A term's budget is the lesser of its contractual ceiling, ring-fenced cash or prepaid capacity, the modeled maximum fulfillment cost and legally available reserve. On a breach, stop any new term commitment and any grant not covered by its funded reservation, optionally limit AIT Earned Credit spend on high-cost models in the set for new requests only, by routing or availability control, lifted once coverage is restored (TD-64), and page the designated owner; the term's locked catalog set, rate and length do not change; already funded active-term entitlement, issued grants and in-flight requests are honored. Future uncommitted terms may be reduced or suspended only with prospective notice.
- **TOK-R31 · Grant records and expiry.** Each grant records a unique ID, account, amount, issue time, expiry time, program ID and funding reservation ID, and traces to exactly one approved program and funded reservation. Expiry releases only unused funding capacity, after settled and in-flight costs are deducted, and never removes an in-flight provider obligation. AIT Earned Credit cannot be transferred, paid out as cash or USDC, or used to fund AIT buybacks.
- **TOK-R36 · Treasury and team AIT (TD-63).** AIT held by Treasury, team or protocol wallets does not accrue AIT Earned Credit at launch; any change is a new decision published before mint.

### 4.3 Spending, refunds and display

- **TOK-R26 · Spend and refund.** AIT Earned Credit is spent first in the funding order (BIL-R08), only on models whose catalog is in the term's set (BIL-R06), from the UI or a scoped key against the same account balance. Unused holds return to the original grant and expiry (BIL-R28). A refund of a settled charge restores the AIT portion as a new seven-day grant (BIL-R42).
- **TOK-R27 · Display (TD-07/51/71/75/76).** Tokenomics shows the relevant available token balance beside each action amount and one position preview with MAX backing AIT debt, staked AIT, active AIT debt, pending MAX and its next withdrawal time; it explains that another burn resets the pending wait. The position's `M/D` ratio remains available in its details. A stake appears only after its block is finalized. Tokenomics also shows eligible staked AIT, an explicit AIT × time → estimated Credit amount for the next seven-day boundary, funded term status and grant history for the recent 12 weeks. The term-rules disclosure shows only the seven-day grant period and post-finality posting, seven-day expiry after issue, approved rate, and term start/end. Credits shows the spendable AIT Earned Credit balance and next expiry in the balance row immediately after Dollar balance; grant history stays in Tokenomics. Unposted accrual is not spendable, and an account may retain an unexpired grant after its term ends.

- **TOK-R28 · Single-page actions (TD-66/69/70/71/72/73/74).** Tokenomics presents entry, exit, position and the network dashboard on one page without tabs. The default entry path locks MAX to mint AIT, then stakes that AIT; the user may mint without staking or stake wallet AIT separately. The default exit path unstakes any needed AIT, burns it against the controller's debt and starts the MAX withdrawal wait; the user may unstake AIT without burning. MAX backing AIT has no fixed lock term; burning AIT starts the seven-day pending wait (TOK-R11–R12). Entry and exit share one position preview of MAX backing AIT, AIT staked, AIT debt and pending MAX. Each amount input shows its relevant available balance: wallet MAX for minting, wallet AIT for staking, wallet plus eligible staked AIT for burning, and staked AIT for unstaking. The preview shows current values until a valid amount is entered, then the affected current → projected values; a new account with no active position sees an empty state until an action can open one. The mint curve remains visible for every action and responds to a mint amount; hovering shows AIT outstanding and marginal MAX/AIT rate. Technical HWM, cap and curve mechanics live in documentation, while action-specific funding errors, quote, user-selected slippage tolerance, derived maximum MAX and MAX withdrawal timing remain in the UI. The mint review states the unlock risks in one line: no automatic liquidation, AIT sold must be reacquired to unlock MAX, and MAX and AIT prices can move. The curve is explanatory; the production contract quote and fee are reviewed alongside the user's slippage tolerance and derived maximum-MAX-in guard before wallet approval. A History section on the same page lists the user's own mint, stake, unstake, burn and withdrawal transactions; there is no main-page Activity feed. The guided paths may need separate wallet approvals; if mint succeeds and stake fails, minted AIT remains in the wallet and can be staked separately. It may show derived average MAX per AIT; a USD estimate is not required. Production values match independently recomputed contract state. The prototype may switch between sample position states; those controls are not a live account feature.
- **TOK-R29 · Staking terms (TD-78/79/80).** Before staking, the user sees the term labeled "Active funded term"; that label is the funding status (TD-80). The user also sees its start/end, seven-day grant period and expiry after issue, and its locked **$12/AIT-year** base rate (TOK-R23). The terms version appears in the acceptance control. When a successor term is published, a user with an existing stake is asked to accept it. The accepted version and its acceptance time are recorded and gate accrual (TOK-R21). Acceptance never gates staking: Stake and Mint & stake work without it, and the UI shows "Accept terms to start earning Credits" with the acceptance control (TD-79). If no funded term is active, no action pauses; a single notice says no Credits accrue (TD-78). No screen claims a lifetime, guaranteed or permanent rate.
- **TOK-R37 · Get MAX / AIT (TD-69/71).** Buy MAX and Buy AIT appear beside the actions that need those tokens. Earn AIT is a separate entry on the same page, linking to the standalone AIT Earn portal's eligible Vault deposits or Partner Referral Program without implying guaranteed rewards. Production buy links use CoW Swap with Ethereum USDC as the sell token and the verified deployed MAX or AIT contract address as the buy token; no token-symbol-only or guessed address link is active. Until deployment, the prototype may simulate a purchase in page without executing or linking to a swap. Gateway Maxshot Referrals Program awards promotional Credits, not AIT (ACC-R11–R16). An in-app swap is later scope.
- **TOK-R38 · Network dashboard (TD-72).** In place of the main-page Activity feed, Tokenomics shows a compact MAX and AIT network dashboard. MAX shows circulating supply, MAX backing active AIT debt, the backing/circulating ratio, other circulating MAX and supply outside circulation. AIT shows outstanding, staked and unstaked amounts, the staked/outstanding ratio and remaining room under the configured cap. Both show daily net change in backing or staked amount over the past seven days. Live values use verified supply/custody classification, position and staking data, and finalized mint/burn/stake/unstake events; sample figures are identified as illustrative and never presented as live or approved launch values.
- **TOK-R32 · No fixed AIT conversion.** AIT is never converted to Credits or Dollars at a fixed rate, and burning AIT never grants Credit or Dollar balance. An opt-in AIT-to-USDC swap that tops up Dollar balance at an executable market rate is later scope.

## 5. Acceptance (formerly B5)

The browser prototype is illustrative; this repository has no production contracts, wallet connector, staking index or Credit ledger. Each part closes only when its live cases pass; screenshots cannot close it.

### 5.1 Ethereum token and position

| Case | Required live result |
| --- | --- |
| Genesis and chain scope (TOK-R01–R03, R06–R07) | Exactly 1,000,000,000 MAX with 18 decimals minted on Ethereum into the approved custodian wallets, reconciled to the manifest; no later mint path exists; restricted allocations cannot leave custody without their authorization. AIT has 18 decimals and lives on Ethereum only. |
| MAX movement (TOK-R02, R06) | Every enabled directed route among the four chains moves existing MAX, including direct non-Ethereum routes, with global supply conserved including in-flight amounts. MAX held elsewhere must return to Ethereum before locking. AIT cross-chain transfer is disabled. |
| Mint quote (TOK-R08, R10, R16–R17) | On-chain, transaction, backend and UI quotes match every reference vector; the cap and user-selected slippage-derived maximum-MAX-in guard hold, including a changed quote before execution; no deadline is required; secondary-market MAX mints without provenance checks; a split mint adds at most one wei per transaction. |
| Merged position and HWM (TOK-R09–R10) | Repeated mints build one non-transferable position; burn-then-refill pays `R(H)`; a crossing mint splits refill from the above-peak integral before the single rounding; the HWM never falls; every mint and burn event is retained. |
| Burn and redeem (TOK-R11–R13) | Only unstaked AIT against the controller's own debt burns; a partial burn rounds MAX down and a full burn moves all residual MAX; a second burn resets the whole pending wait; early withdrawal fails and an on-time withdrawal transfers once; withdrawn MAX is untouched by later burns. |
| Invariants and inventory (TOK-R14–R15) | All invariants reconcile after every transition, across partial burn → remint, full-burn dust, refill, HWM crossing, the cap boundary, repeated burns and pause transitions; market-bought AIT never reduces debt. |
| Pauses (TOK-R05) | Each pause blocks only its own operation; Pause All blocks all position actions; global and directed-route bridge pauses affect only the bridge. |
| Governance and limits (TOK-R33–R34) | An upgrade cannot change existing debt or the curve for existing positions and waits out its time delay; no pause can seize assets, mint past the cap or alter debt; per-block and per-epoch mint limits hold; pausing mints leaves burn and withdraw working. |
| Distribution labels (TOK-R35) | Every movement out of custody carries a purpose label; a secondary MAX purchase or a lock never appears as a Treasury receipt. |
| Single-page actions (TOK-R27–R28) | Entry and exit appear together with one position preview and the relevant available balance beside each amount input; the same position data is not repeated in a hero banner. Mint & stake is the default; Mint only and Stake existing are selectable. Unstake needed AIT & burn is the default exit; Unstake existing alone is selectable. All four choices update the same preview: current position without a valid input, affected current → projected values after one, and a new-position empty state before minting. The mint curve stays visible across actions and updates on mint input. Burning shows the MAX amount and seven-day withdrawal date, and a further burn resets all pending MAX to the new date. Mint input updates hover values, sample MAX quote and projected position. The mint review shows the one-line unlock-risk statement. History lists each of the user's finalized mint, stake, unstake, burn and withdrawal transactions. The reviewed contract quote, fee and debt values match independently recomputed contract state; the user chooses slippage tolerance and sees the derived maximum MAX separately from the quote. If an average MAX per AIT is displayed, it equals quoted MAX divided by AIT amount; no USD estimate is required. If mint succeeds but stake fails, AIT stays in the wallet and a separate stake is available. |
| Network dashboard (TOK-R38) | MAX circulating plus backing, other circulating and outside-circulation amounts reconcile to total genesis supply; its backing/circulating ratio matches those values. AIT staked plus unstaked reconciles to outstanding, cap room matches the configured cap, and the staked/outstanding ratio matches. Seven daily net changes reconcile to finalized contract events. The prototype labels all network figures illustrative. |
| Get MAX / AIT (TOK-R37) | Buy MAX and Buy AIT sit by their respective token-dependent actions; production CoW links use Ethereum USDC as sell token and the verified deployed target contract. Before deployment, any in-page buy is explicitly simulated and charges nothing. Earn AIT opens the standalone Vault/Partner Referral portal. Gateway referral rewards remain promotional Credits. |

Contract audit and security review remain release gates.

### 5.2 Wallet link and staking

| Case | Required live result |
| --- | --- |
| Link and duplicates (TOK-R18–R19) | A verified SIWE or ERC-1271 proof links a wallet once; a second wallet for the account or the same wallet for another account is rejected; attribution follows only the verified link; on-chain unstaking works with the Gateway UI down. |
| Stake, unstake and finality (TOK-R20–R22) | Within an active term whose version the account has accepted, for an already linked wallet, accrual starts at the stake's finalized block time with no warm-up; a partial unstake ends only the removed amount's accrual; accrued entitlement survives to the next grant; staked AIT cannot be burned. For a pre-link stake, the link time applies instead. |
| Pre-link staking (TOK-R21) | A wallet staked for three days before linking accrues only from the verified link time. |
| Term acceptance (TOK-R20, R21, R23, R29) | A prefunded successor term starts as the current term ends, with no planned gap. A linked stake accrues in each term only after acceptance of that term's version; a stake whose account never accepts earns nothing in that term. If a successor cannot be funded, every action keeps working, accrual stops safely at the current term end and a single notice says no Credits accrue. Staking without acceptance succeeds and shows the prompt to accept terms. |
| Index and replay (TOK-R22, R25) | Reprocessing, delayed finality or a reorganization never duplicates or misattributes AIT-wei-seconds; on-chain stake, indexed balance and account display reconcile. |

### 5.3 Off-chain AIT Earned Credit

| Case | Required live result |
| --- | --- |
| Program boundary (TOK-R23–R24) | Accrual happens only inside the funded term and for eligible linked time; the final short boundary grants once; an unstaked wallet receives its accrued amount at the next boundary, then nothing more; no grant posts without reserve coverage. |
| Grant ledger (TOK-R24–R25) | For each account, term and boundary, exactly one automatic grant with amount, issue time, seven-day expiry and program can be rebuilt from finalized events; a zero entitlement creates no grant; the vectors above reproduce exactly; grants, spending and expiry reconcile to the balance. |
| Spend and refund (TOK-R26) | Covered by SPEC_BILLING §7 cases 1, 6, 10 and 12. |
| Coverage guard (TOK-R30) | With 0% Treasury income, no new unfunded term or grant is created while the funded active term is honored; a coverage breach stops uncovered grants and pages the owner; any high-cost model limit applies only to new requests and leaves the term's locked catalog set, rate and length unchanged. |
| Grant records and expiry (TOK-R31) | Every grant carries its program and funding reservation; an expired grant releases only unused capacity after in-flight costs; Earned Credit cannot be cashed out or transferred. |
| Treasury and team AIT (TOK-R36) | A stake from a Treasury, team or protocol wallet accrues nothing. |
| Terms and conversion (TOK-R29, R32) | The term view shows the "Active funded term" label (or, during a gap, the no-accrual notice), period, expiry, approved rate and start/end before staking; the acceptance control shows the terms version and records acceptance time; burning AIT grants no Credit or Dollar balance. |
| Display (TOK-R27) | The position view shows debt, MAX, ratio, pending MAX and next withdrawal time and warns that another burn resets it; the staking view shows only finalized stakes. Tokenomics shows eligible AIT × time → estimated Credits, the next seven-day boundary and every grant in the recent 12-week window. Credits shows spendable balance and next expiry beside Dollar balance, including after a funded term ends, without duplicating grant history. |

## 6. Inputs, open items and out of scope

**Release inputs** ([LAUNCH_CONFIG_V0](./LAUNCH_CONFIG_V0.md), [DECISIONS §3](./DECISIONS.md)): purpose-specific genesis wallet manifest and vesting; the 50,000 AIT cap and 600→1,800 curve sign-off (DEC-04); funded-term length, `N/D` conversion rate, catalog set, reserve and buffer; LayerZero endpoint, DVN and executor configuration; AIT peer deployment; end-of-term stake handling. The $12 per eligible staked AIT-year base rate is decided (TD-77). The 50,000,000 MAX sale at $0.10 is decided (TD-09); sale execution sits with the commercial team.

**References:** [LayerZero OFT Standard](https://layerzero.network/resources/oft-standard); Robinhood Chain [network](https://docs.robinhood.com/chain/connecting/) and [bridging](https://docs.robinhood.com/chain/bridging/) documentation. Engineering verifies endpoint IDs, deployed contracts, peer configuration and route availability for all four chains before release; these links are not deployment evidence.

**Out of scope for this release:** AIT cross-chain transfer; wallet change, unlink or relink; the MAX Boost Bonus Pool and MAX fee-staking rights (later release, TD-61, DEC-11/12/19); Provider Token markets; debt-retiring AIT buybacks.

**Prototype limit:** `frontend/src/pages/TokenomicsPage.jsx` shows sample position states, a merged position, HWM refill, guided Mint & stake, separate stake and unstake, burn and the seven-day pending withdrawal in browser state. Buy adds sample tokens without a swap. The network dashboard uses illustrative circulating supply, staking totals and daily changes; simulated position actions update the corresponding figures. The combined mint/stake and unstake/burn outcomes are simulated; production may require separate wallet approvals and must handle a successful mint followed by failed stake as TOK-R28 states. Its mint math is floating-point and is not the contract reference.

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
