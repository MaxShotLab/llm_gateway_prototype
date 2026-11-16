# Maxshot — High-Level Feature Requirements

**Status:** Working product specification, derived from `MAXSHOT_Tokens_PRD_v1.0(read only).md` (2026-11-11). Proposed economics and release gates are not approved launch terms.  
**Scope:** Gateway, compute supply, MAX/AIT, optional provider tokens, agent distribution, finance and controls.

**Founder decision update (2026-11-11):** One merged mint position per controller with the same terms; no position time lock. AIT burns move proportional MAX to a pending redemption balance. The entire pending balance becomes withdrawable seven days after the latest burn. HWM refill uses the exact two-part quote in §4.2. MAX and AIT each use 18 decimals. These decisions update the working design but do not waive launch gates.

**Development-round addendum:** `MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md` records later founder decisions where this document or the read-only source differs. It is the working override for those listed decisions.

## 1. Product definition

Maxshot is an agent-native AI inference network with three connected layers:

1. **Compute:** a model-first LLM Gateway that routes paid requests to verified providers, meters usage, and settles providers.
2. **Distribution:** developer and external-agent integration, share links and funded referral programs; a managed Agent Wallet is a separate later decision.
3. **Economics:** MAX capital formation and locking, AIT issuance and funded compute allowances, plus a later qualified provider-token market.

The basic Gateway works with normal payment; MAX, AIT and provider tokens are optional for inference customers. Inference routing and billing run off-chain. Contracts record token state and enforce economic rules.

At launch, Ethereum is the home chain for MAX/AIT mint positions and AIT staking. MAX moves by LayerZero between Ethereum, Base, Arbitrum One and Robinhood Chain, including direct routes between those chains. AIT remains on Ethereum at launch; its LayerZero capability is reserved for later activation.

## 2. System framework

```mermaid
flowchart TD
  U[Developer or agent] --> I[Identity, API keys, spend policy]
  I --> C[Model catalog and quote]
  C --> B[Billing preauthorization]
  B --> R[Gateway router]
  R --> P[Verified compute providers]
  P --> M[Usage meter and provider settlement]
  M --> L[Dollar balance / Credit bucket ledgers]
  X[Eligible MAX holder] --> K[MAX lock and AIT mint positions]
  K --> S[AIT staking snapshots]
  S --> E[Funded AIT Earned Credit program]
  E --> L
  T[Primary MAX sale receipts and other approved income] --> F[Treasury and reserve controls]
  F --> E
  Q[Qualified provider and PT issuer] --> V[Optional PT/MAX market]
  V --> W[Net fee collector]
  W --> Y[LP rights / MAX stakers / AIT buyback reserve]
```

**Accounting boundary:** only actual primary-sale receipts add initial Treasury capital. MAX locks, secondary token purchases and token FDV do not. Paid inference margin and PT trading fees are separate cash flows.

## 3. Users and primary journeys

| User | Job | Core journey |
|---|---|---|
| Developer | Call a model at a known price | Select model → fund account → scoped key → call → inspect usage and charge |
| Agent builder | Connect an existing agent safely | Read verified setup guide → scoped key → budget/model limits → test call |
| Compute provider | Sell real inference capacity | Apply → rights/technical review → benchmark → limited routing → settlement |
| MAX holder | Mint AIT using eligible MAX | Inspect quote and risks → lock MAX → record position and AIT debt |
| AIT holder | Receive usable compute allowance | Stake AIT in an active funded term → accrue/grant → spend before expiry |
| Position controller | Recover locked MAX | Obtain owed AIT → burn against merged position → wait seven days after latest burn → withdraw pending MAX |
| Qualified PT participant | Trade a provider-specific instrument | Review legally defined rights/eligibility → trade where permitted |
| Finance/risk operator | Maintain solvency | Reconcile receipts, liquid reserves, credit exposure and provider payables |

## 4. Feature requirements and acceptance

### 4.1 Gateway and accounts — compute-first MVP

| Feature | Requirement | Acceptance evidence |
|---|---|---|
| Identity and keys | Secure sign-in, scoped API keys, revocation, account and agent spending limits | Revoked keys fail; over-budget requests stop before provider invocation |
| Agent-style integration | Publish a versioned, agent-consumable `SKILL.md` and verified setup path for external agents: live URL/model discovery, account-authorized scoped credential, model permission, spend cap, a funded test call, and usage/charge inspection. No managed Agent object or Tokenomics portal is required by this row. | A supported external agent completes a bounded real call and the same account ledger records its charge; revoked or over-budget credentials fail before dispatch |
| Existing Vault exit | A depositor may connect the position wallet and withdraw through the unchanged Vault flow before linking a Gateway account; linking is needed for unified Portfolio and account benefits | Existing wallet-only depositor can withdraw without account login; no account Credit or wallet attribution is created |
| Model-first catalog | Dynamic list of verified models from supported launch providers; each enabled text, image, and video catalog maintains at least five distinct usable models. Chat/Studio pickers show only models with an admitted, available, policy-eligible route (TD-41); shared customer model ID requires verified same version/capabilities and a current catalog assignment. | Five usable models per enabled catalog at launch; unavailable models disappear from new-request pickers; historical records remain readable; mismatched versions have separate IDs |
| Inference API | Advertised streaming, structured output and tool behavior per enabled model | Contract tests for every advertised capability |
| Router and provider adapters | For the selected model, choose the lowest quoted-cost verified provider meeting capability, quality, latency and data-policy constraints; fallback only within a hard maximum customer charge. Chat/Studio show the server estimate and maximum; API uses one-call authorization with optional caller ceiling and no separate quote endpoint. Reserve the full maximum before dispatch, including permitted fallback rates. | Route and fallback traces show chosen provider, constraints and capped cost; unaffordable or over-ceiling API calls stop before dispatch |
| Usage and billing | Use existing crypto deposits to fund Dollar balance after verifying the live flow; request-level metering, idempotent maximum reservation/settlement and separate Dollar/Credit ledgers; eligible AIT Earned Credit usable through UI and authorized scoped keys used by external agents. Final charge may exceed estimate but never the accepted maximum; excess provider cost is a platform/provider discrepancy. | Deposit-to-balance and customer/provider ledgers reconcile; scoped-key model/spend limits hold; unused reservations return to original buckets and expiry |
| Provider operations | Legal/supply verification, benchmark, staged traffic, payout and dispute ledger | Qualified provider produces a verified paid call and reconciled settlement |

### 4.2 MAX and AIT — gated Genesis

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
| Wallet attribution | One verified Ethereum staking wallet per Gateway account; changing/unlinking unavailable at launch | No wallet can accrue into two accounts; direct on-chain unstake remains available |

**Approved mint quote rule:** Let `O` be global outstanding AIT debt, `H` the current HWM, `q` the new AIT quantity, `C = 50,000`, `R(s) = 600[1 + 2(s/C)²]` and `L(s) = 600s + 400s³/C²`. Require `O + q <= C`. Set `newPeak = max(0, O + q − H)` and `refill = q − newPeak`. Charge `refill × R(H) + L(H + newPeak) − L(H)` MAX, then set `H = max(H, O + q)`. MAX and AIT use 18 decimals; round the exact total mint charge up **once** to the next MAX wei, never below the formula. The [addendum §5](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md#5-confirmed-integer-mint-quote) fixes the integer evaluation order and acceptance vectors.

### 4.3 Compute Credit and solvency — gated Genesis

| Feature | Requirement | Acceptance evidence |
|---|---|---|
| Separate balances | Dollar balance and each Credit bucket have distinct ledgers and terms | No balance or revenue double count |
| Funded program | Commit finite term and reserve maximum fulfillment cost plus buffer before grants | Daily coverage report remains above approved threshold |
| Base accrual | Qualified AIT stake accrues `$12/365` USD-credit per AIT-day during the approved term; a fixed, versioned Credits-per-USD rate applies for that term. At each grant boundary, floor cumulative AIT-wei-second entitlement to integer Credits and issue only the increase over prior grants (TD-40). | Fractions carry across epochs and unstaking; final sub-Credit remainder is discarded; split stakes and replayed grants cannot increase issuance |
| Grant lifecycle | Off-chain Gateway ledger automatically grants Credit after chain finality in shared seven-day intervals from program start, including final short interval; each grant expires seven days after issue | No claim transaction; grant, use, expiry and provider obligations reconcile |
| Spend protection | Program allows a set of model catalogs; each model has one changeable catalog assignment, evaluated at new-request authorization; earliest-expiring eligible AIT Earned Credit before subscription allowance, other promotional Credits, then Dollar balance; only the subscription-funded portion consumes subscription text windows; unused preauthorization returns to original grant/expiry | Concurrency test has no negative balance or unfunded provider call; in-flight authorizations remain stable; expired remainder cannot be reused |
| Settled-call refund | Provider failure or overcharge restores the AIT Earned Credit portion as a new seven-day grant and the Dollar-funded portion to Dollar balance | Reversal is idempotent and traces to the original request without double credit |
| Optional bonus | Separately funded MAX Boost Bonus Pool | Base entitlement does not change; bonus stays within pool |

### 4.4 Growth and provider-token market — later phases

| Feature | Requirement | Acceptance evidence |
|---|---|---|
| Managed Agent wallet and templates | A separate later product decision may add managed Agent objects, per-agent wallets/allocations, templates or a portal; no one-Agent cap is assumed for the Tokenomics release | Acceptance is defined only if that later scope is approved |
| Referrals and Compute Drops | Attribution to settled economic activity, fixed funding cap, anti-abuse and reversals | Fraud/self-referral rejected; reward traces to approved budget |
| Provider token (PT) | Provider-specific legally documented rights, investor eligibility and transfer policy | Rights registry, legal approval and issuer reconciliation |
| PT/MAX trading and fees | Prove LP ownership and collectible fee rights; allocate distributable net fees 50% LP, 30% qualified MAX stakers, 20% AIT buyback reserve | Testnet/fork and accounting reconciliation; no duplicate fee allocation |
| AIT buyback reserve | Hold market-purchased AIT separately from debt retirement | Inventory purchase never silently cancels mint debt |

## 5. Terms and hard boundaries
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

## 6. Release sequence and gates

1. **Decision and legal readiness:** approve supply, distribution, curve/refill, term, custody, accounting, jurisdiction and economic stress model.
2. **Compute-first MVP:** verified paid inference, bounded agent integration, provider verification, usage and settlement.
3. **MAX/AIT Genesis:** audited contracts, eligibility, 50,000 AIT cap, position debt, 90-day funded credit program, reserve reporting and incident controls.
4. **Agent growth:** funded campaigns/referrals, agent wallet, market-purchased AIT rewards, optional bonus pool.
5. **Qualified PT market:** enforceable PT rights, compliant access, real LP fee rights, auditable 50/30/20 allocation.
6. **Conditional scale:** new issuance or longer credit terms only when supported by new real capital or verified sustainable income and approved coverage.

**Remaining release inputs, not development-blocking product decisions:** purpose-specific custodian wallet allocations and vesting configuration; approved Credit catalog set, worst-case cost and reserve; end-of-term stake handling; LayerZero lane/security configuration and AIT peer deployment; MAX fee-staking rights; PT issuer rights/AMM fee capture; numeric service targets; legal and accounting treatment. The full 1B MAX genesis mint, initial sale quantity/price, unrestricted eligibility of transferable MAX, merged-position/HWM rules, seven-day redemption wait, Ethereum-only AIT launch and 18-decimal token rules are founder-confirmed working decisions. No proposed mechanism should be presented as live before deployment and verification.
