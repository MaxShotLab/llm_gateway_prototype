---
title: "Maxshot — Product Requirements Document (PRD)"
subtitle: "Agent-Native AI Compute Network, MAX/AIT Tokenomics, Provider Market & Growth"
document_id: "MAXSHOT-PRD-001"
version: "1.0-draft"
status: "Working PRD — NOT approved for token launch or production smart-contract deployment"
last_updated: "2026-11-11"
product_owner: "Maxshot Founder / Product Council"
engineering_owner: "TBD"
security_owner: "TBD"
primary_language: "English"
classification: "Confidential — internal product, engineering, finance and legal working specification"
---

# Maxshot — Product Requirements Document (PRD)

> **Executive summary:** Maxshot is an agent-native AI inference network combining a model-first LLM gateway, a market for genuine inference providers, an optional PT/MAX provider token marketplace, and a dual-token MAX/AIT compute economy. MAX primary distribution funds an identifiable Treasury; eligible users lock MAX to mint AIT on a deterministic bonding curve; staked AIT receives a clearly communicated, term-limited compute-credit allowance supported by segregated funds. Agent-friendly onboarding, referrals and verified compute usage create demand. The project should be built and operated primarily by AI agents, subject to enforceable controls and human authority for money and irreversible changes.

**Important:** This document is a *product and delivery specification*, not a statement that proposed functions have launched, legal token offering terms, investment advice, an audited financial model, or a promise of investment/credit returns.

## Document control and interpretation

| Item | Definition |
|---|---|
| Purpose | Single source of truth for product scope, economics, software, contracts, accounting controls, acceptance criteria and release delivery. |
| Intended users | Founder, product and engineering agents, contract developers, finance, security, legal, provider partners and QA. |
| **[DECIDED-DIRECTION]** | A direction repeatedly selected in the product discussions; still subject to formal approval before launch. |
| **[BASELINE-ASSUMPTION]** | Number used for design and calculations; not yet a confirmed offering term. |
| **[PROPOSED]** | Recommended implementation that needs product/security review. |
| **[OPEN]** | Blocking or unresolved choice. Must not be silently assumed by an executing agent. |
| **[REQUIRED-GATE]** | A hard prerequisite to enable a function or release. |
| Source precedence | Latest explicit founder decision > this PRD's approved decision log > newest V4/V4.1 material > earlier discussions / early-stage deck. A documented change must update this PRD before code changes. |
| Requirement labels | `FR` functional, `ECON` economic, `ACC` accounting, `SEC` security, `NFR` non-functional, `TEST` QA, `REL` release. |

### Material used and changes relative to old versions

1. `Maxshot_V4_Provider_Market_Integrated.pptx` (30 pages): MAX primary distribution, capital/yield accounting, 3→9 curve for **10M older-unit AIT**, provider market, fee split and launch sequence.
2. `Maxshot_Onchain_Inference_Market_Discussion_v1.pdf` (internal strategy discussion): two markets, genuine provider supply, PT as potentially enforceable operating/GPU equity, independent financial rights, and user-facing USD billing.
3. `Maxshot Deck_v1.pptx`: historical DeFAI/Agent Factory positioning, Omni-Vault and product vision. This is *context*, not an instruction to launch the older roadmap unchanged.
4. `maxshot_agent_skill/SKILL.md` (integration draft): agent-friendly onboarding; do not fabricate Gateway API URLs, token contracts, credit claims, promotions or funding rights.
5. **Latest founder discussion supersedes the older AIT specification:** current preferred direction is **fixed-display compute allowance, 50,000 Genesis AIT capacity, and a 600→1,800 MAX/AIT mint curve**. The earlier 10M-AIT/floating-reward figures and the old NAV-gain-driven 40% AIT performance-fee mint are explicitly superseded for baseline implementation.

### Contents

1. Product thesis, objectives and non-goals
2. User types, journeys and information architecture
3. Token model and capital formation
4. MAX→AIT bonding curve, position lifecycle and market dynamics
5. AIT→Compute Credit economics and solvency
6. Treasury and accounting / financial controls
7. ROI and quantitative scenarios
8. Gateway and inference provider market
9. Provider token (PT) market and fee economics
10. Agent onboarding, `SKILL.md`, and referral growth
11. Functional requirements and acceptance criteria
12. Architecture, contracts, APIs and data
13. Security, compliance, observability and non-functional requirements
14. Test plan, release phases, operational ownership and open decisions
15. Appendices: formulas, glossary, proposed event and data schemas

---

# 1. Product thesis, objectives and non-goals

## 1.1 Product definition

**Maxshot = Compute Network + Agent Distribution + Crypto Economic Layer.**

- **Compute Network:** developer/agent-facing model catalog and LLM gateway with independently verified suppliers, routing, usage metering and USD-denominated prices.
- **Capital Formation:** initial sales of protocol-controlled MAX may yield actual cash/USDC proceeds for a ring-fenced Treasury; the size of the Treasury must be based on real receipts, **not token FDV, MAX lock value or secondary trading volume**.
- **Compute Rights:** a qualified MAX holder can lock MAX and mint AIT at a contract-defined curve. An AIT holder may stake AIT to receive compute-credit allowances from a *funded* credit program.
- **Provider Market:** compute suppliers compete on deliverable price, latency, reliability and compliance; select qualified providers may participate in an *optional* PT/MAX financial marketplace.
- **Growth:** agents and users can connect, use, share and refer through small frictionless pathways; financial incentives are supported by specific budgets or net revenues.
- **Operating model:** most discovery, analysis, code writing, quality checks, support and growth experiments are agent-operated; irreversible authority remains under explicit controls.

## 1.2 Primary objectives

| ID | Objective | Primary measurement |
|---|---|---|
| OBJ-01 | A developer or existing agent can complete their first verified Maxshot inference with minimal friction. | Time-to-first-success, verified successful calls, 7-/30-day repeat use. |
| OBJ-02 | MAX primary distribution forms auditable capital that can fund a sustainable compute program. | Net sale receipts, eligible reserve, cash-flow reconciliation, reserve coverage. |
| OBJ-03 | MAX lock and AIT issuance have deterministic, auditable economics. | Invariant-test pass rate, correct mint quote, supply/cap consistency. |
| OBJ-04 | AIT holders understand the base compute allowance without a complex floating formula. | Credit term visibility, accrued/claimed/spent accuracy, customer comprehension. |
| OBJ-05 | Provider competition improves genuine compute economics. | Cost per model vs benchmarks, paid GMV, contribution margin, uptime, retention. |
| OBJ-06 | PT/MAX activities create defensible MAX utility without masquerading as compute revenue. | Valid trading fees, fee accounting, provider activity, collateral/LP reconciliation. |
| OBJ-07 | Viral distribution converts to actual paying agent/developer users. | Qualified referral conversion, retained paid spend, referral contribution margin. |
| OBJ-08 | AI agents execute most routine delivery and operations safely. | Automated task throughput, automated QA coverage, audit trail, human high-risk approval compliance. |

## 1.3 Non-goals, especially at launch

- AIT is **not** a $1 stablecoin, not USD/NAV redeemable, and not an unconditional claim to Treasury principal.
- MAX locking does **not** create fresh cash; MAX trading FDV does **not** constitute protocol income.
- Base Gateway use will **not** require purchasing or holding MAX, AIT or PT.
- Automatic cash withdrawals by agents, permissionless Treasury trading, unrestricted token issuance, permissionless PT equity issuance and unaudited mainnet deployment are **out of MVP scope**.
- A marketplace full of unverified API wrappers, fake providers or volume-mined traffic is not a success metric.
- No guarantee of 15% Treasury returns, Token price appreciation or indefinite $1/month/AIT allowances.
- Old product descriptions of USDC↔AIT at NAV, unlimited fixed-dollar compute credits and unqualified “free mint” must not survive in new UI/documents.

## 1.4 Positioning and customer promise

**Human/developer:** “One account. One API. Competitive model pricing. Pay in normal credits. Crypto participation optional.”

**Agent builder:** “Give an agent a Maxshot skill/configuration, assign spending controls and usable credit, and run a verified model call.”

**Crypto participant:** “Lock eligible MAX to mint AIT at an explicitly quoted curve, or buy AIT in the market; stake AIT for a transparently funded compute allowance.”

**Provider:** “Connect real inference supply, compete on deliverable quality, settle usage, and optionally access a separately governed capital/Token market.”

---

# 2. Target users, journeys and information architecture

## 2.1 User groups

| Persona | Core job | Product entry |
|---|---|---|
| API Developer | Use a desired LLM at competitive cost, see exact usage/billing. | Models, Playground, API Keys, Billing. |
| Agent Builder (Hermes/other) | Configure an OpenAI-compatible provider, fund/limit the agent and run. | Connect Agent, `SKILL.md`, Agent Wallet. |
| Grok-hosted Bot User | Add permitted Maxshot tools without assuming replacement of Grok's underlying model. | Verified MCP connector (if deployed). |
| MAX Buyer / Locker | Understand lock terms, view mint quote and obtain AIT. | MAX & AIT → Mint. |
| AIT Holder | Buy or stake AIT, track base earned Credit, use on inference. | AIT Staking, Credits, Usage. |
| Referral Partner / Agent Creator | Share an agent/model/provider and earn from attributable legitimate usage. | Referrals, Agent Templates, Campaigns. |
| Compute Provider | Apply, benchmark, price, provide SLA and receive settlement. | Provider Console. |
| PT Issuer / Investor | Explore compliant rights-based provider tokens and market activity. | Provider Tokens (qualified/permissioned). |
| Treasury/Risk Operator | Track cash, investments, credit liabilities and fee obligations. | Admin Finance, Risk Dashboard, Approvals. |

## 2.2 User navigation — proposed

```text
maxshot.ai
  Overview / Network / Providers / Tokenomics / Docs / Connect Agent

gateway.maxshot.ai (illustrative product host; verify production deployment)
  Models / Playground / API Keys / Agents / Billing / Usage
  Earn & Rewards / Wallet & Credits
  MAX & AIT (Mint / Stake / Unlock / Market)
  Provider Market (Compute Providers / Tokens / Apply)
  Referrals / Profile / Security

admin.maxshot (internal-only host not prescribed)
  Treasury / Ledger / Credit Liability / Providers / Mint Controls
  Contract Registry / Campaigns / Incident Response / Agent Missions
```

## 2.3 Critical end-to-end journeys

**J1 — Developer first inference:** visit model page → sign up → choose paid funding or *actually available* trial → generate scoped API key → make short model call → validate response and exact charged usage.

**J2 — Bring an existing Hermes agent:** access `SKILL.md` → authenticate → receive verified API URL/model ID → configure Hermes custom OpenAI-compatible endpoint → set spend limit → verify call and ledger delta. Auxiliary models must be checked separately.

**J3 — MAX to AIT:** review eligibility, curve quote, current outstanding AIT, lock term and risk → approve MAX allowance → lock exact MAX and mint AIT → view position and original unlock debt → optionally stake AIT.

**J4 — AIT credit:** review active committed program period → stake AIT → receive daily accrual and weekly grant batches, each with actual expiry → choose eligible model → debit reward ledger → inspect history.

**J5 — Position closure:** acquire outstanding AIT debt from wallet/market → burn chosen AIT quantity → unlock the original position's pro-rata MAX → verify updated debt and collateral; no repricing of old debt.

**J6 — Provider onboarding:** application → legal/ToS verification → model/price/SLA checks → test key and benchmark → staged routing → reconciliation and provider payment → optionally independent PT review.

**J7 — Agent/referral growth:** share a model, agent template or compute drop with attribution → verified new paid usage → settle net contribution → pay approved referral reward from a designated budget → prevent self-referral and duplicate attribution.

---

# 3. Token model and initial capital formation

## 3.1 Token roles

| Token / balance | Role | Economic right / limitation |
|---|---|---|
| **MAX** | Network token; eligible MAX lock mints AIT; PT trading pair; staking fee participation and optional bonus-weight utility. | No automatic claim on individual PT equities or a guaranteed share of Treasury investments. |
| **AIT** | Freely transferable compute-rights token; mint only by eligible MAX lock (user-side); bought on secondary markets; stake for eligible compute allowances. | No NAV redemption, no USD peg, no direct claim to $5M reserve principal. AIT bought on DEX remains eligible to stake. |
| **PT** | Optional provider-specific token, with rights defined for each issuer/vehicle. | Not automatically provider equity. No PT listing before legal rights and transfer eligibility are established. |
| **Paid Credit** | Prepaid Gateway consumption balance. | Separate ledger, validity and payment/refund treatment based on customer terms. |
| **Earned Compute Credit** | Budget-funded, typically 7-day-expiring consumption allowance from AIT staking/campaigns. | Not cash or an on-chain token by default; program term/eligibility must be disclosed. |

## 3.2 Genesis assumptions and issuance boundaries

| Parameter | Baseline | Status |
|---|---:|---|
| MAX fully diluted valuation | **$100,000,000** | [DECIDED-DIRECTION] target |
| MAX fully diluted total supply | **1,000,000,000 MAX** | [BASELINE-ASSUMPTION], not fully confirmed |
| MAX initial implied price | **$0.10 / MAX** | Derived: $100M / 1B |
| MAX initial Treasury sale | **50,000,000 MAX** | [DECIDED-DIRECTION] amount |
| Initial sold percentage | **5%** of assumed supply | Derived |
| Gross primary sale proceeds | **$5,000,000** | Derived; *not* net of fees, refunds or reserves |
| Remaining initial MAX | **950,000,000 MAX** | Assuming all 1B initially Treasury/team controlled |
| Eligible Treasury capital | Actual net primary proceeds, not price × lock | [REQUIRED-GATE] independently reconciled |
| Assumed net annual reserve yield | **15%** | [BASELINE-ASSUMPTION], aggressive and unguaranteed |
| Illustrative yield allocation to compute | **80%** | [PROPOSED]; cash and obligations matter |
| Simplified annual compute envelope | **$5M × 15% × 80% = $600,000** | Scenario only, not a funded commitment |

**Funding rule:** every MAX distribution must be labeled `primary_sale_to_treasury`, `secondary_user_trade`, `protocol_lp_transfer`, `team_vesting`, `ecosystem_incentive` or another explicit category. Treasury capital increases only with *actual* cash/USDC inflows legally attributable to Treasury and available for its purpose.

**Team MAX restriction [REQUIRED-GATE]:** unissued/unpaid/unsold founder or Treasury MAX must not be able to mint reward-bearing AIT without an authorized mechanism that establishes matching economic capacity. Enforce via the **eligibility-controlled MAX distribution/lock architecture**, not solely off-chain wallet blacklists.

**Investor / offering risk [OPEN]:** a Token sale funding managed assets whose returns support holder benefits may be an investment/security arrangement under applicable laws. Final product availability, geography and disclosures depend on legal advice.

## 3.3 Financial flows at a glance

```text
PRIMARY CAPITAL (one-time or subsequent approved issues)
User buys eligible MAX from protocol-controlled distribution
   → Treasury receives actual USDC / cash net proceeds
   → Treasury custodies/invests eligible assets
   → Realized distributable income + separately approved subsidies
   → Prefunded Earned Credit reserve
   → AIT staking Credit grants → API usage → provider payments

TOKEN LOCK (not another cash inflow)
Eligible MAX holder locks MAX → Mint AIT → stake / hold / sell AIT
   ↘ later burn debt-matched AIT → original-position MAX unlock

PAID INFERENCE (separate operating income)
Customer pays USD / stablecoin → usage ledger → provider settlement
   → verified Gateway contribution after costs → allocated budget/retained cash

PROVIDER TOKEN MARKET (separate trading fee)
PT/MAX transactions → collectible net trading fees
   → 50% eligible LP / 30% MAX stakers / 20% AIT buyback reserve
```

---

# 4. MAX → AIT bonding curve and position lifecycle

## 4.1 Final proposed Genesis unit definition

**[PROPOSED, latest baseline]** Change the AIT denomination relative to the earlier V4 draft so that `1 AIT` maps to a simple **approximately $1 of Compute Credit per month during an approved funded commitment period**.

- Genesis maximum outstanding reward-eligible supply: **50,000 AIT**.
- Base MAX required for the *first marginal AIT*: **600 MAX**.
- Base MAX required for the *last marginal AIT at 50,000*: **1,800 MAX**.
- Mint rate grows convexly with issuance progress.
- When all 50,000 AIT have been minted from 0 with no intervening closeouts, **50M MAX** have been locked in aggregate.
- Old example `3→9 MAX/AIT over 10M AIT` is **the same economic denomination scaled by 200**, and should not coexist as a second public mint rule.

## 4.2 Bonding curve mathematics

Let:

- `C = 50,000 AIT` Genesis outstanding supply cap.
- `S` = reference point on the Genesis curve (AIT units).
- `R(S)` = marginal MAX units required to mint one more AIT.

```math
R(S) = 600 × [1 + 2 × (S / 50,000)^2]
```

Integral MAX requirement from 0 to `S`:

```math
L(S) = ∫[0,S] R(x) dx
     = 600 S + 400 S³ / (50,000²)
```

A trade minting from `S0` to `S1` locks:

```math
MAX_required = L(S1) - L(S0)
```

**Numerical examples — initial uninterrupted Genesis issuance:**

| Curve progress / AIT minted | Marginal MAX per AIT | Cumulative locked MAX |
|---:|---:|---:|
| 0 | 600 | 0 |
| 10,000 | 648 | 6,160,000 |
| 20,000 | 792 | 13,280,000 |
| 30,000 | 1,032 | 22,320,000 |
| 40,000 | 1,368 | 34,240,000 |
| 50,000 | 1,800 | **50,000,000** |

**Implementation note — precision:** use deterministic fixed-point integer arithmetic, quote and preview with explicit rounding directions, maximum `MAX_in`, minimum `AIT_out`, deadline, fees and stale-state reversion. Never use floating-point arithmetic on-chain.

## 4.3 Burning and re-minting: avoid a curve-reset exploit

A crucial detail missing from early decks: if the price curve simply uses **current outstanding AIT** and can move backward when someone burns AIT, a user may close a recent position and re-mint at an earlier, cheaper point. In addition, after independent position closures, the sum of actual locked MAX need not equal `L(current outstanding supply)`.

**[PROPOSED] Use separate state variables:**

- `outstandingMintDebt`: amount of AIT that existing positions still require to burn for MAX unlock; this is the true live AIT debt.
- `curveHighWatermark`: highest outstanding debt reached during Genesis; **monotonic, never decreases because of redemption**.
- `genesisOutstandingCap = 50,000`: hard maximum outstanding debt and reward-eligible AIT supply.
- `lockedMaxLiability`: actual remaining MAX owed across all open positions; use position ledger, not `L(outstandingMintDebt)`.

If minting again **below** a prior high watermark, quote at **no less than `R(curveHighWatermark)`** per AIT. Only when moving above the high watermark does the initial convex integral resume. This prevents an early-curve reset after closeouts while allowing supply vacancies to be refilled. This exact rule is a **design proposal** and needs formal economic/game-theory approval before deployment.

```text
mintQuote(new_AIT):
  assert outstandingMintDebt + new_AIT <= 50,000
  charge >= high-watermark rate for refilling previously redeemed supply
  if new outstanding exceeds prior HWM, integrate curve over the excess
  require minter eligibility, capital/program eligibility and slippage guard
  create distinct debt position; increase debt and actual MAX locked
```

## 4.4 Position and debt model

Each mint opens or adds to a **position record**:

```text
position_id
owner / controller
locked_MAX_initial
locked_MAX_remaining
minted_AIT_initial
AIT_debt_remaining
curve_quote_at_creation
created_at
eligibility_source
status
```

**Rules:**

1. AIT is fungible and transferable; the **MAX unlock entitlement is attached to the originating position**, not automatically to whoever owns AIT.
2. Only an authorized position controller may request unlocking MAX, and must deliver/burn the required fungible AIT.
3. Partial close burns fraction `b / position.AIT_debt_remaining`, unlocking the same proportional amount of `position.locked_MAX_remaining`, subject to rounding toward the protocol's safety side.
4. Closing a position never reprices the old position using the current Genesis rate.
5. If the original minter sells AIT, the minter remains exposed to buying it back or **choosing never to retrieve MAX**. No automatic liquidation is assumed.
6. `Transfer MAX lock position` is **[OPEN]**: MVP may prohibit transfer; later version may use a transferable position NFT with identity/compliance constraints.

**Illustrative payoff (not risk-free arbitrage):** a user locking $100 of MAX to mint AIT and selling AIT for $80 has reduced immediate net exposure but now has an AIT buyback obligation if they want MAX returned. AIT appreciation raises closeout cost. A minter can abandon MAX instead of repurchasing AIT, so some users may treat mint-and-sell as a costly one-way conversion. Do not advertise a guaranteed arbitrage spread or assured return of locked MAX.

## 4.5 Mint controls and eligibility

| Control | Requirement |
|---|---|
| Eligible MAX source | Protocol-recognized sold/circulating MAX or another explicitly approved source; treatment of pooled secondary MAX must be disclosed. |
| AIT supply cap | Enforced on-chain at 50,000 **outstanding** AIT during Genesis. |
| Capital sufficiency | Independently check economic capacity; no promise that locked MAX USD price equals Treasury receipts. |
| Mint speed | Per-block / per-epoch rate limits, anti-sandwich slippage constraints and optional opening windows. |
| Pause | Guardian may stop *new* mints, subject to contract governance; exiting funded original positions should remain possible unless a specific security emergency requires narrower controls. |
| Quote transparency | Display MAX amount, implied reference cost, AIT minted, cap progress, original unlock requirement and price risks. |
| On-chain restrictions | No ability for unsold Treasury MAX to produce reward-bearing AIT without a formally approved, funded expansion. |
| Curve updates | No silent retroactive changes to existing position debt; upgrades require multisig/time delay, disclosures and tests. |

## 4.6 Token market dynamics

- A direct **$1M AIT secondary purchase** ordinarily transfers value to existing sellers and/or AMM liquidity providers; it **does not itself add $1M to Treasury**.
- If price rises, original minters who sold AIT have more expensive buybacks (a short-AIT exposure); new MAX holders may become interested in minting, but this is **not automatic risk-free arbitrage**.
- New minting may acquire MAX from old MAX holders (no new Treasury cash) or a *new primary MAX distribution* (new Treasury cash, plus dilution and specific disclosure). These cases must not be conflated.
- More outstanding AIT does not mechanically increase total funded Credit beyond the program budget.
- Reserve-supported compute economics and price dynamics should appear separately on dashboards.

---

# 5. AIT Compute Credit: entitlement, funding, expiry and solvency

## 5.1 User-facing unit

**[PROPOSED]** During an explicitly announced, fully funded reward commitment term:

> **1 staked AIT earns Compute Credit at a rate equivalent to $12 per 365 days — approximately $1 per month.**

This is easier to understand than a variable-share model. The **AIT market price is floating**; the credit face-value earning schedule is fixed **only inside the approved term**. It is *not* a perpetual promise.

**Precise schedule:** daily eligible allowance = `12 / 365` USD-credit per AIT-day; grant batches are posted weekly, each valid for seven days. This defines the actual 365-day rate independently of calendar-month length. UI shorthand: `~$1 / month / staked AIT`.

**[OPEN] Eligibility boundary:** requirements for staking warm-up, vesting, time-weighting and same-epoch entry/exit must be finalized. Baseline proposes accrual only for genuinely staked time, no double-counting via transfers, and a configurable minimum warm-up.

## 5.2 Genesis obligation and 90-day launch program

At `50,000 AIT` staked for 365 days, annual maximum nominal face value equals:

```text
50,000 AIT × $12 / AIT-year = $600,000 per 365 days
```

For a **90-day** fixed program:

```text
50,000 × $12 × 90/365 = $147,945.21 max face value
```

Round up conservatively, plus reserve for model-cost changes and in-flight usage. A 90-day public commitment should not begin until the budget and eligible fulfillment capacity are actually reserved. **Do not advertise an unconditional permanent $1/month entitlement.**

**Base credit can be spent, not redeemed for cash**. Earned Credit grants expire seven days after issuance; an incurred provider payable or unsettled inference request remains payable after the user's credit expires.

## 5.3 Funding and reserve controls

Three independent ledgers are mandatory:

1. `paid_credit_liability`: externally funded customer prepayments, with applicable consumer payment/refund terms.
2. `earned_credit_outstanding`: unexpired and/or committed earned allowance, maximum cost to deliver, grant/expiration status.
3. `treasury_eligible_assets`: capital, investments, accrued/realized returns, permitted liquidity and restricted credit funding allocations.

**Economic budget** must be constrained by the lesser of:

- approved term's contractual ceiling;
- ring-fenced cash or eligible, transferable/prepaid third-party inference capacity;
- independently modeled **maximum fulfillment cost**, including expensive models, price revisions, usage concurrency, FX if applicable and provider payables;
- legal availability of allocated capital and reserve liquidity.

```math
Eligible liquid fulfillment resources
  >= maximum cost of unexpired earned credit
     + in-flight API commitments
     + unpaid provider liabilities allocated to credit
     + policy buffer
```

**First-loss avoidance:** if the Treasury yield underperforms, platform may choose to fund an *already promised* 90-day term with the already allocated credit reserve; it cannot reduce the term retroactively if the terms guarantee it. Future uncommitted terms may have lower allowances or be suspended with prospective notice.

## 5.4 Capital allocation contradiction — must show investors honestly

The convenient estimate `$5M × 15% × 80% = $600K/year` presumes the entire $5M is both invested and earns a **realized net** 15% equivalent. In practice, reserving cash up front for the 90-day reward program reduces investable principal unless that liquid cash also earns comparable eligible yield.

**Conservative illustration:** reserve `$147,945.21` for a 90-day maximum face liability, invest `$4,852,054.79` at 15% net, and distribute 80% of that income:

```text
Annual investable income example = $727,808.22
80% available to credit          = $582,246.58 / year
Full-year 50K AIT at $12/year     = $600,000.00 / year
Illustrative full-year gap        = $17,753.42
```

This is a **scenario**, not a prediction, but demonstrates that a **funded 90-day trial can be credible** while a *permanent* fixed entitlement cannot be justified solely by a 15% projection on capital that is partly held aside.

## 5.5 Credit granting, debiting and expiration

- Staking snapshot or time-weighted accrual is deterministic and auditable.
- Each weekly Credit grant has a unique ID, amount, `created_at`, `expires_at`, program ID and funding reservation ID.
- `available_reward_credit` is never negative; budget allocation uses atomic reservations and idempotent transitions.
- A request has a **preauthorization ceiling** based on the selected model and maximum tokens; final debit is reconciled to verified tokens/cost.
- A fallback model/provider may execute only if it respects account budget, consent, credit eligibility and max cost.
- `Earned Credit` cannot be transferred as cash, redeemed in USDC, or used to fund AIT buybacks without a separate approved mechanism.
- Expired unused grants return **unused funding capacity**, not already incurred cost; settled/in-flight liabilities must be deducted first.
- Paid and Earned Credit cannot be double spent; deduction-order policy is **[OPEN]**, with proposed default: soonest-to-expire eligible earned grant → paid balance.

## 5.6 Bonus vs base entitlement

MAX Staking Boost may receive a **separately funded Bonus Credit Pool**. It must **not** multiply the fixed `$12/AIT-year` base promise unless the extra amount is fully funded and clearly disclosed. The prior V4 variable-weight logic applies **only to a bonus pool**, not the new fixed base.

**Bonus allocation:**

```math
BonusCredit_i = BonusPool × (AITStake_i × MAXBoost_i) / Σ(All eligible weighted AIT stakes)
```

## 5.7 Using AIT for immediate compute payment

Do **not** set `Burn 1 AIT = $100 API Credit` or any other unbacked fixed USD conversion. Optional spend flow:

```text
AIT in user wallet → approved swap at executable market rate to USDC
→ transfer/settle actual proceeds → issue paid compute balance net of fees
```

This should be opt-in and respect slippage, market liquidity, sanctions/compliance and user approvals. Burning AIT to unlock MAX **must not also grant Paid Credit** from nowhere.

---

# 6. Treasury, accounting and financial reporting

## 6.1 Accounting principles

1. **Never double count capital.** MAX primary receipts are booked once; lock MAX is an escrow/contract state change, not a second sale.
2. **Never double count yield and operating margin.** Provider/Gateway contribution is not also 15% Treasury investment income if it comes from the same transaction/asset.
3. **Never treat token FDV as cash.** $100M MAX FDV is a valuation reference; initial capital under current assumptions is $5M **gross**.
4. **Never treat LP positions as freely available cash.** Locked PT/MAX or AIT/MAX LP may not be liquid and can suffer impermanent loss. Token minting into LP does not create cash by itself.
5. **Keep management accounting distinct from statutory accounting.** The final GAAP/IFRS recognition of token sale receipts, contract obligations, equity, revenue, grants and liabilities is **[OPEN]** for independent accounting opinion.
6. **Do not use “off balance sheet” as an escape hatch.** Whether a reserve/SPV consolidates depends on control/rights under applicable accounting rules.
7. **Separate customer funds and proprietary funds** where law/terms require; use verified reserve attestations and reconciliation.

## 6.2 Illustrative management-ledger entries

| Event | Asset/cash movement | Obligation/economic record | NOT implied |
|---|---|---|---|
| Treasury sells 50M MAX @ $0.10 | +$5M gross cash/USDC, then subtract fees | Record token sale contract/obligation per final accounting policy | Not $5M automatic accounting profit. |
| Treasury invests eligible assets | Cash → investments | Custody, market value, maturity/lockup, risk buckets | No additional capital appears. |
| Holder locks MAX to mint AIT | No cash to Treasury | MAX held in contract; AIT debt and supply created | Not a second `$MAX market value` capital inflow. |
| Eligible investment yield is realized | +settled proceeds (if realized cash) | Recognize under proper accounting policy | Unrealized marks cannot fund next-week credit without liquidity. |
| Treasury allocates 90-day Credit budget | Transfer cash/prepaid capacity to restricted fulfillment reserve | Record approved maximum commitment and grant liability when incurred | Internal earmarking is not automatically an operating expense. |
| Reward credit issued | No immediate cash payment | Outstanding credit commitment / maximum fulfillment cost | Not immediately new external revenue. |
| Earned Credit consumed | Settle/pay provider | Release relevant credit obligation and recognize cost/service entry under policy | Free-credit call is not another externally paid sale. |
| External user buys Paid Credit | +cash (net fees) | Paid balance / deferred performance obligation as applicable | Cash receipt is not immediately all profit. |
| API paid call completed | Provider payable and margin settled | Recognition of revenue/cost consistent with contract principal/agent role | Can't count gross volume as profit. |
| PT/MAX fee collected | +eligible fee cash/assets | Allocate 50/30/20 only from collectible, distributable fee base | No extra 20% referral on top of same 100%. |
| AIT bought from market | Treasury exchanges cash for AIT | Mark buyback reserve inventory and valuation | Not an automatic extinguishment of MAX debt. |

## 6.3 Required reporting dimensions

- Treasury: gross and **net** primary receipts; investable vs restricted funds; liquid assets; custody; asset-level risk; realized yield and P&L; available cash after liabilities; audited or attested coverage.
- Credit: base committed ceiling; funded reserves; grant face value; worst-case fulfillment cost; used/expired; model gross procurement cost; pending provider payables; expected run rate; stress coverage.
- Token: MAX sold/eligible/locked/free/unvested; AIT outstanding, staked, Treasury-held, per-position debt, buyback inventory; PT issued/LP held/transfer restricted.
- Gateway: external Paid GMV, realized margin, refunds, provider credits, subscriptions and earned-credit calls split out; no artificial paid GMV from internal funded calls.
- Referral: attributed paid net revenue, approved reward, unpaid accrual, reversals, suspected abuse.

## 6.4 Provider Market accounting example

Illustrative independent paid-usage year:

```text
External paid customer GMV      $2,000,000
Provider settlement            ($1,760,000)
Gateway gross spread             $240,000
Operating costs                 ($120,000)
New net operating contribution   $120,000
Optional incremental credit allocation at 50% = $60,000
```

**Constraint:** this `$60K` is incremental *only if* not already included in the Treasury investment return calculation, and only after settlement, cost/revenue recognition and approval. The fixed base AIT credit promise is not automatically raised by an incremental profit contribution; additional net income may replenish the base reserve, support an approved Bonus Pool, or enable future authorized issuance.

---

# 7. Quantitative ROI and sensitivity analysis

## 7.1 Correctly distinguish the four ROI denominators

| Metric | Formula | Interpretation |
|---|---|---|
| Treasury return | Realized net distributable investment income / eligible Treasury capital | Reserve performance, **not** Tokenholder guaranteed return. |
| Credit funding ratio | Funded cost of outstanding promised compute / worst-case fulfillment cost | Solvency measure; target >=1 plus buffer. |
| Historical MAX locker Credit face ROI | Annual face credit allocated to locker / historical MAX cost of locked coins | Uses original purchase cost and assumes Credit actually usable. |
| AIT market buyer Credit face yield | Annual face credit per AIT / actual AIT purchase price | Price-sensitive compute-use yield, not cash APY and not total investment return. |

**Economic realism:** subtract transaction fees, slippage, non-use/expiry and valuation of actual compute demand to obtain a user-specific *effective* yield. AIT price changes and MAX collateral price changes are separate and potentially dominant.

## 7.2 Genesis lock scenarios on revised curve

All values assume MAX initially purchased for `$0.10`, an intact 90-day fixed-rate Credit program, and all minted AIT continuously staked. For comparison, the `annual nominal Credit` column *annualizes* the rate; it is **not a 12-month promise**.

| Locked sold MAX | % of 50M sale | Minted AIT | Nominal $12/AIT-year face | Face ROI on MAX acquisition cost |
|---:|---:|---:|---:|---:|
| 10,000,000 | 20% | 15,645.42 | $187,745 | 18.77% |
| 20,000,000 | 40% | 27,678.69 | $332,144 | 16.61% |
| **30,000,000** | **60%** | **36,756.96** | **$441,084** | **14.70%** |
| 40,000,000 | 80% | 43,980.74 | $527,769 | 13.19% |
| 50,000,000 | 100% | 50,000.00 | $600,000 | 12.00% |

Note: The effect differs from the older *floating whole-pool* model, which could allocate an unchanged $600K across all currently staked AIT. **The revised fixed-base model does not distribute unissued credit capacity to early participants.**

## 7.3 AIT secondary-market buyer — face ROI

For a fully utilized fixed-base program, the **annualized** credit face return per AIT is `$12`. The following chart is a unit illustration only:

| AIT spot price | Annualized Credit face yield (`$12 / price`) |
|---:|---:|
| $10 | 120% |
| $20 | 60% |
| $30 | 40% |
| $40 | 30% |
| $50 | 24% |
| $75 | 16% |
| $100 | 12% |
| $150 | 8% |

**For a 90-day-only confirmed term**, user-accruable face value is `$12 × 90/365 = $2.9589 per AIT`, assuming full-time staking and full ability to use every grant. AIT at `$50` therefore has a **5.92% 90-day face benefit**, not a guaranteed 24% cash return. Future extensions are conditional.

## 7.4 Treasury yield sensitivity (50K AIT, full-year illustrative)

| Net return on fully earning $5M | Yearly net yield | 80% income allocation | $600K annual fixed face gap/surplus* |
|---:|---:|---:|---:|
| 0% | $0 | $0 | -$600K |
| 5% | $250K | $200K | -$400K |
| 10% | $500K | $400K | -$200K |
| **15%** | **$750K** | **$600K** | **$0** |
| 20% | $1M | $800K | +$200K |

\* This is the simplified *all capital invested at stated yield* comparison and omits prefunding cash drag and cost/price risks. It must **not** be used as a solvency attestation.

## 7.5 Economic simulator requirements

**[REQUIRED-GATE]** Before production mint launch, build a parameterized, versioned Monte Carlo and deterministic stress model covering:

- MAX primary sale completion (0–100%), discounts, vesting and net cash received.
- MAX spot price shock ±80%, AIT price shock ±90%, thin MAX/AIT LP, MEV and large slippage.
- Lock participation (10–100%), position closeout, abandoned locks and the effect on demand/available AIT.
- 0–20% Treasury income, principal drawdowns, lockups, delayed settlement, provider failures.
- 0–100% Earned Credit usage, rapid use before expiry, provider price increases and model mix shifts.
- 50K AIT outstanding cap; weekly/multi-epoch staking, credit coverage and P&L.
- Primary vs secondary MAX sourcing and whether new issuance expands actual capital.
- PT/MAX creation costs, LP fee collection, fee leakage, provider insolvency and correlated risk.

Outputs: token states, cash flows, worst-case credit liability, lock/unlock feasibility, Treasury liquidity, surplus/shortfall, trigger breaches and publication-ready sensitivity tables.

---

# 8. Gateway, compute provider market and PT marketplace

## 8.1 Gateway experience

- **Model-first** catalog: users choose models/capabilities/prices, not a required provider unless deliberately using an advanced comparison view.
- Standard API key workflow, playground, model details, request cost estimates, usage history, billing and team/agent budgets.
- Pricing and routing should be deterministic and observable; do **not** depend on an LLM making an unbounded cost decision in the request path.
- Router supports allowlisted OpenAI-compatible and other validated adapters, including existing gateway aggregators where contractually permitted.
- Real Provider identity may be shown in tracing/billing transparency where terms permit; actual model identity and delivered quality must be validated.
- Paid and Earned inference usage must be distinguished in ledger and reporting.

## 8.2 Compute Provider marketplace

The first marketplace is **real, deliverable inference capacity**.

**Provider onboarding states:** `applied → due_diligence → technical_verified → benchmarked → limited_traffic → active → suspended/removed`.

**Eligibility:** valid business/beneficial ownership as required; actual GPU/model capacity or legitimate supply contract; contractual rights to serve; security posture; model license/third-party terms compliance; price transparency; reliability; settlement identity.

**Benchmark** must cover model correctness/identity, context/token limits, throughput, latency p50/p95, error rate, tool calling, structured output, data-retention handling, failure retries and price/cost integrity.

**Routing factors:** model compatibility and explicit user preference; net procurement cost; quality; reliability; data handling; geography; SLA and risk/abuse; capacity and rate limits.

**Provider economics:** external Paid users generate revenue; provider settlement is cost; Maxshot keeps verified spread/contribution. Provider funding from Treasury must be separately approved and cannot be counted both as Reserve asset value and as an asset owned by PT holders.

## 8.3 PT / MAX Provider Token Market

The second marketplace is optional and should launch **after** a qualifying Provider proves real capacity and a legal instrument is established.

A PT may map to one of:

- `Project PT`: rights in a defined GPU/operating SPV and its cash-flow waterfall.
- `Growth PT`: rights in the provider operating company, if legally implementable.
- `Hybrid PT`: GPU/SPV rights plus documented parent-company rights or warrants.

**[OPEN/LEGAL]** Choose per-provider structure, jurisdiction, investor eligibility, rights registry, audits, governance, dilution, future fundraises, bankruptcy waterfall, transfer restrictions and treatment of assets if the Provider leaves Maxshot.

**Hard rule:** a PT is **not** presumed to confer ownership, dividends or liquidation rights by its ticker or on-chain listing alone. Rights must be recorded in binding legal documents and reconciliation systems.

## 8.4 PT/MAX liquidity and fee allocation

**[DECIDED-DIRECTION]** Target net trading-fee allocation:

| Recipient | Share of collectible distributable net launchpad fees |
|---|---:|
| Eligible LP or actual LP fee-right holder | **50%** |
| Qualified staked MAX holders | **30%** |
| AIT buyback reserve | **20%** |
| **Total** | **100%** |

**Questions requiring implementation-specific proof:** Which AMM hooks/router actually collect these fees? Who owns locked LP NFT/position and LP fees? Can the protocol collect enough of the fees to redirect 30%/20%? What are third-party fees, taxes, creator allocations and routing costs before the 50/30/20 base?

**AIT debt safety:** the 20% AIT budget should **buy AIT and hold it in a Treasury Buyback Reserve**. Do **not** burn purchased AIT until a formally specified debt-matching process ensures outstanding MAX unlock claims remain satisfiable. At launch, rename a claimed "Buyback & Burn" to **"Buyback Reserve (Burn Subject to Debt Settlement)"** if necessary for technical accuracy.

**LP issuance:** protocol-provided MAX for PT/MAX initial pools creates price/liquidity exposure and potentially new liquid supply even if LP is locked. Treat separately from the 50M primary MAX sale, with public supply and LP custody disclosures.

**PT secondary trading is not primary financing.** A Provider receives new cash for GPU capex only through a distinct primary raise, loan, revenue-sharing contract or legally effective financing transaction.

---

# 9. Agent integration, viral distribution and earned incentives

## 9.1 Agent-first onboarding

Create and publish a maintainable, version-controlled `SKILL.md` intended for Hermes, Grok-capable bots and other agents. It must:

- Explain how to connect to Maxshot *using only verified live URLs*, actual model IDs and available funding paths.
- Make the default first use **Pay-as-you-go** or a real, eligible trial, not a mandatory MAX/AIT trade.
- Direct the user through account creation, secure key generation and a short **funded, budget-limited test inference**.
- Explain AIT Mint/Stake/Credit as *optional features only when deployed and verified*.
- Avoid exposing private keys, seed phrases, full API keys or long-lived secrets in chat.
- Distinguish tool-only MCP connections from replacement of a hosted agent's internal reasoning model.

**Initial supported routes:**

1. Hermes: use a verified custom OpenAI-compatible endpoint and exact model ID; verify auxiliary-model paths independently.
2. Grok-hosted bot: connect through published MCP/API tools *only if* the current product supports it; do **not** assume Grok model calls can be re-routed through Maxshot.
3. Custom OpenAI-compatible SDK/app: verify base URL, model, streaming, tool calls, max tokens, billing and error handling.

**Proposed Agent Wallet:** account-linked subledger for per-agent paid/reward balances, model allowlist, daily/weekly spend cap, key scope and revocation. No default unrestricted on-chain private key.

## 9.2 Referral surfaces

Every appropriate non-sensitive product page may generate an attribution-preserving share link: model, provider profile, template, compliant PT info page, campaign and eligible vault/DeFi feature.

- Credit claims/Compute Drops require an explicit finite budget, anti-Sybil checks, claim expiry and per-account maximum.
- Referral payments must be linked to **realized, attributable net economic contribution** and an approved budget.
- For DeFi referral earnings, reward AIT must be **bought from circulating markets** or supplied from already owned inventory; **not newly minted without eligible MAX lock**.
- No extra referral share may be applied to a fee pool already fully allocated 50/30/20 unless the fee schedule is expressly amended.
- No rewards based solely on recruitment depth, fake trading volume or AI-generated fake API calls.

## 9.3 Proposed referral programs

| Program | Reward trigger | Funding source | Status |
|---|---|---|---|
| Developer Affiliate | Paid, settled Gateway net contribution | Approved growth / revenue share budget | [PROPOSED] |
| Compute Drop | Verified trial claim and actual inference use | Prepaid marketing compute budget | [PROPOSED] |
| Agent Template Referral | New account produces retained Paid usage | Approved partner budget | [PROPOSED] |
| DeFi Earn AIT | Confirmed Vault/Perps/Prediction referral commission | Real external DeFi net revenue → market-purchased AIT | [PROPOSED] |
| Provider Wars | Genuine benchmark/performance and qualified activation | Capped community budget | [PROPOSED] |
| MAX Boost Bonus | Valid MAX stake + AIT stake | Separately funded bonus Credit Pool | [PROPOSED]; never inflate fixed base |

---

# 10. Detailed functional requirements and acceptance criteria

Requirements in this section are *implementation obligations* for a designated phase, not proof that a live API already exists. **P0** essential, **P1** growth phase, **P2** conditional expansion.

## 10.1 Identity and Gateway

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-ID-001 | P0 | Email/social/wallet authentication using supported secure methods. | Verified login/logout, session expiry and revoked sessions; no unsafe fallback. |
| FR-ID-002 | P0 | Create/revoke API keys with limited scopes and masked presentation. | Plaintext only at creation; storage hashed/secure; revoke prevents next request. |
| FR-ID-003 | P0 | Assign per-account and per-agent usage limits. | Over-budget request rejected *before* provider invocation. |
| FR-GW-001 | P0 | Model catalog with exact ID, model features and current customer price. | Model ID accepted in real API smoke test; UI/API price reconciliation. |
| FR-GW-002 | P0 | Inference API supporting agreed streaming, structured output and tool-call behavior. | Integration contract suite for each advertised feature and enabled model. |
| FR-GW-003 | P0 | Meter and attribute each provider call, including failover. | Cost ledger reconciles provider usage/token count and customer bill. |
| FR-GW-004 | P0 | Provide Billing and separate Paid/Earned balances. | Paid funds never silently treated as earned subsidy or vice versa. |
| FR-GW-005 | P0 | Capture request id, selected route, latency, provider status, customer rate and cost. | Trace searchable by customer/service support with sensitive content redaction. |

## 10.2 MAX/AIT contracts and wallet UI

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-TOK-001 | P0 | MAX token supply/vesting/distribution and eligible-sale attribution. | Sale receipts and 50M distribution trace to wallet, funds and eligibility registry. |
| FR-TOK-002 | P0 | Eligible MAX lock to mint AIT on the approved deterministic curve. | Correct quote across boundaries; on-chain supply and escrow accounting invariant tests. |
| FR-TOK-003 | P0 | Individual mint positions with exact original debt and unlock obligations. | Partial/full closeout test and per-position ledger event proofs. |
| FR-TOK-004 | P0 | Burn AIT to unlock proportional original MAX. | Partial burn updates debt/collateral; cannot withdraw without AIT. |
| FR-TOK-005 | P0 | Genesis 50,000 outstanding AIT cap and nonresetting curve floor. | Boundary/mint-burn-remint adversarial tests; no 50,000+ issuance. |
| FR-TOK-006 | P0 | Block unauthorized use of unsold Treasury/team MAX for reward-bearing Mint. | Attempts using restricted allocations fail on-chain or via verifiable eligibility proofs. |
| FR-TOK-007 | P0 | Show current cap, outstanding AIT, quote, fees, debt, lock, unlock risk and transaction history. | Wallet UI matched to independently recomputed contract state. |
| FR-TOK-008 | P1 | AIT staking, unstaking and time-weighted eligibility. | Partial-period accrual and anti-double-counting tests. |
| FR-TOK-009 | P1 | Credit payout terms displayed before staking, including program expiration and funding status. | No UI claim of lifetime guaranteed $1/mo; terms version is recorded. |
| FR-TOK-010 | P2 | Position transfer/NFT if adopted. | Only after economic and legal approval; no loss of associated collateral/debt. |

## 10.3 Compute Credit and finance

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-CR-001 | P0 | Distinct Paid Credit and Earned Credit ledgers; grant lifecycle. | Full audit log and signed/traceable adjustments. |
| FR-CR-002 | P0 | Pre-fund and commit a finite reward term before issue. | Funded reserve ≥ maximum fulfillment exposure plus configured buffer. |
| FR-CR-003 | P0 | Daily `$12/365` accrual for qualified staked AIT within approved term. | Time-prorating boundary/rounding test; invariant of no overissue. |
| FR-CR-004 | P0 | Weekly Credit grants with 7-day expiration and eligible-model restrictions. | Grant claim, expiry, spend and in-flight reconciliation test. |
| FR-CR-005 | P0 | Preauthorize and settle each inference cost atomically. | No negative balance / overspend under concurrent load. |
| FR-CR-006 | P0 | Automatic shortage guard/kill switch for *new* uncommitted grants and excessive models. | Simulation triggers without breaking already funded obligations. |
| FR-CR-007 | P1 | Separate optional funded Bonus Pool and MAX boost weighting. | Base remains exactly unchanged; bonus cannot exceed budget. |
| FR-CR-008 | P1 | Transparent coverage panel: funded, granted, used, in-flight, reserved, expiring. | Financial-ledger reconciliation by grant and provider payable. |
| ACC-001 | P0 | Audit trail for primary MAX sale and asset ownership. | Independent reconciliation of 50M sale, fees, refunds and Treasury receipts. |
| ACC-002 | P0 | Separate capital, investment income, Gateway margin, PT fees, LP assets and subsidies. | Same cashflow never booked twice as distributable profit. |
| ACC-003 | P0 | Daily proof-of-funds/coverage with approved data sources. | Exceptions halt new grants and page designated owner. |

## 10.4 Provider market and launchpad

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-PR-001 | P0 | Provider KYC/ownership/ToS verification and capacity qualification. | Approval checklist and signed terms stored; unsupported provider blocked. |
| FR-PR-002 | P0 | Automated model/provisioning benchmark and sandbox routing. | Identity, latency, price and reliability results logged and reviewable. |
| FR-PR-003 | P0 | Provider payout and dispute ledger. | Provider invoice amount reconciles gateway usage, corrections and net settlement. |
| FR-PR-004 | P1 | Provider discovery/performance pages and cohort analytics. | Rankings based on verified, non-wash metrics. |
| FR-PT-001 | P2 | Issue PT only with legally defined financial rights and transfer policy. | Legal, security and finance approvals attached to token/issuer. |
| FR-PT-002 | P2 | Create auditable PT/MAX LP with protocol/LP ownership clear. | MAX/PT sources, LP lock, ownership and fee capture independently verified. |
| FR-PT-003 | P2 | Net fees split exactly 50/30/20 under effective AMM architecture. | Testnet and fork tests show fee routing and no double compensation. |
| FR-PT-004 | P2 | AIT buyback inventory stored without spontaneous debt-unmatched burn. | Buyback events and AIT debt invariants remain valid. |

## 10.5 Agent distribution and growth

| ID | Priority | Requirement | Acceptance evidence |
|---|---|---|---|
| FR-AG-001 | P0 | Publish a current versioned Maxshot `SKILL.md`. | No guessed URLs/contracts; a supported agent can follow it to verified first call. |
| FR-AG-002 | P0 | OpenAI-compatible agent setup guide with account-level API scopes. | Hermes/custom SDK smoke test; no secret leakage. |
| FR-AG-003 | P1 | Optional officially deployed MCP tool integration. | Authenticated test: model list/inference/balance/usage only within scopes and budget. |
| FR-AG-004 | P1 | Agent Compute Wallet: budget, model allowlist, paid/earned allocation, revocation. | Rogue tool call cannot exceed spending budget; revocation effective. |
| FR-GR-001 | P1 | Shareable attributed landing pages and attribution lifecycle. | Same-user/duplicate/Sybil events excluded; source preserved through conversion. |
| FR-GR-002 | P1 | Finite Compute Drops and referral rewards with approval and cost ceiling. | Cannot claim more than remaining funded cap; refunds reverse rewards. |
| FR-GR-003 | P1 | Earn AIT funded by secondary-market purchased or preexisting AIT inventory. | Reward claim reconciles purchase/treasury inventory and valid referral revenue. |

---

# 11. System architecture and implementation contracts

## 11.1 Reference architecture

```text
[Website / Gateway / Agent SDK / SKILL.md / (future MCP)]
                │
      [Identity & Auth / API Key / Agent Policy]
                │
     [Model Catalog & Quote / Billing Pre-Auth]
                │
    [Deterministic Gateway Router & Provider Adapters]
           ├── Verified external gateways
           ├── ComputeAI provider
           └── OpenGPU / qualified community providers
                │
     [Usage Meter / Provider Settlement / Ledger]
                │
     [Paid Credit] [Earned Credit] [Operations P&L]
                │
      [Treasury & Credit Solvency Controls]
                │
  [Blockchain indexer: MAX lock, AIT mint/debt/stake,
   optional PT/MAX LP fees, Treasury wallets]
                │
 [Contract Registry / Multisig Approvals / Audit & Monitoring]
```

**Engineering principle:** Inference hot path remains off-chain and deterministic; blockchain is for token economics and auditable settlement, not millisecond inference orchestration.

## 11.2 Proposed on-chain modules

| Module | Responsibility | Invariants / permissions |
|---|---|---|
| `MAXToken` | Total supply, authorized distribution and permitted vesting. | Fixed/controlled supply, no undisclosed mint, vesting controls. |
| `MAXDistribution` | Approved initial and future sales, payment receipts and eligible MAX origin. | External capital event recorded; reserve proof not inferred from spot price. |
| `AITToken` | Mint/burn only by authorized lock/debt controller. | Total supply aligned with valid debt and permitted inventory/recovery states. |
| `MAXAITMinter` | Curve quoting, escrow, position debt, partial redemption, HWM, caps. | Locked MAX covers actual unlock claims; mint capacity and math enforced. |
| `AITStaking` | Eligible AIT staking, time-weight snapshots, withdraw. | No double staking, controlled reentrancy, no phantom balances. |
| `CreditEntitlementOracle` | Publish authenticated epoch/term snapshot for off-chain Credit ledger. | No double grants, signed version, dispute/rollback procedure. |
| `FeeCollector` | Collect and allocate qualifying PT/MAX fees. | Total allocated never exceeds collectible net fees. |
| `BuybackReserve` | Hold acquired AIT until explicit debt-safe handling. | No discretionary automatic AIT destruction. |
| `Governance/Safe` | Emergency/security controls and upgrades. | Multisig, time locks, scope separation, on-chain event logs. |

**[OPEN]** On-chain vs off-chain issuance of weekly earned credits; baseline recommends **off-chain USD-denominated credit ledger** with cryptographically verifiable staking snapshots and reconciliation. Credit should not need to be an ERC-20.

## 11.3 Proposed backend service boundaries

- `identity-service`: user/organization/agent identities and scopes.
- `key-service`: API credentials and rotation.
- `catalog-service`: validated model + provider metadata.
- `inference-router`: deterministic provider selection and failover.
- `usage-meter`: tokens/cost/latency/source trace, anti-duplication.
- `billing-ledger`: paid charges and prepaid liability.
- `credit-rewards`: AIT stake snapshots, accrual/grants/expiry, funding linkage.
- `treasury-ledger`: investment assets, realized P&L, liquid credit reserves.
- `onchain-indexer`: canonical event ingestion with finality/reorg handling.
- `provider-service`: onboarding, SLA, settlement and disputes.
- `growth-service`: referral attribution, campaigns, finite grants.
- `mission-control`: agent work scheduler and controlled, observable tool execution.

**Use double-entry or invariant-preserving money movement:** every spend, reserve, reversal, provider settlement and grant should be idempotent and auditable, not an unchecked decrement of a balance field.

## 11.4 Proposed interfaces (not existing URLs)

These illustrate interface contracts, **not live endpoints**. API paths and conventions require architecture approval; never paste them into a production `SKILL.md` as already available.

```yaml
Public API concepts:
  GET   /models                         # exact IDs, capability and prices
  POST  /inference/chat-completions      # compatible route when deployed
  GET   /account/credits                # paid, earned, expiration
  POST  /api-keys                       # scoped credentials
  POST  /agents                         # agent identity and budget
  GET   /agents/{agent_id}/usage
  GET   /reward-programs/active         # term, funding, rate
  GET   /mint/quote                     # chain, source, qty, cap, slippage
  GET   /mint/positions/{id}
  GET   /providers                      # performance, verification status
  GET   /referrals/me

Internal concepts:
  POST  /credit-programs/{id}/fund       # controlled funding authorization
  POST  /credit-grants/allocate          # idempotent epoch allocation
  POST  /provider-settlements/reconcile
  POST  /risk/pause-new-grants           # protected action
  POST  /governance/approve-proposal     # signed human authorization
```

## 11.5 Key canonical events

```text
MAXPrimarySaleSettled(sale_id, buyer, max_qty, currency, net_proceeds)
MAXEligibilityRegistered(max_lot_or_proof, source, limit)
AITMinted(position_id, actor, max_locked, ait_out, curve_hwm)
AITBurnedForUnlock(position_id, actor, ait_burned, max_unlocked)
AITStaked(owner, ait, epoch)
AITUnstaked(owner, ait, epoch)
CreditProgramFunded(program_id, reserve_id, capacity)
CreditGranted(grant_id, owner, agent_id, amount, expires_at, funding_id)
CreditReserved(request_id, grant_id, amount)
CreditSettled(request_id, actual_cost)
CreditExpired(grant_id, unused_amount)
ProviderCallSettled(request_id, provider_id, cost, paid_or_earned)
PTTradeFeeCollected(pool_id, amount, denominated_asset)
FeeDistributed(pool_id, lp_amount, max_staker_amount, ait_buyback_amount)
AITPurchasedForReserve(trade_id, ait_qty, consideration)
ReferralRewardSettled(attribution_id, eligible_revenue, payout)
```

All events require correct chain/network or off-chain ledger identity, timestamps, idempotency keys, and reorg/reversal semantics.

---

# 12. Security, governance, compliance and risk controls

## 12.1 Principle: Agent-run, policy-controlled

AI agents can research, propose product changes, code, run tests, analyze usage and recommend Treasury/routing actions. **They must not directly control unrestricted production funds or irreversible administrative keys.**

| Risk tier | Allowed agent actions | Control |
|---|---|---|
| L0 | Research, PRDs, read-only analytics, simulations. | Logged execution. |
| L1 | Branch/PR creation, unit tests, staging content. | Sandboxes, CI, least privilege. |
| L2 | Pre-approved low-risk pricing/routing or finite campaigns. | Enforced budgets, allowlists, rollback, post-event audit. |
| L3 | Production changes to credit, routing policy, fee config or cap. | Human approval, staged rollout, change records. |
| L4 | Token upgrades, mint authority, Treasury/signatures, PT equity issuance. | Independent audit, legal signoff, multisig/timelock, formal release gate. |

## 12.2 Smart-contract attack categories

- Reentrancy, reorgs, precision/overflow, slippage and sandwiching, front-run quotes.
- Bonding curve burn/remint reset, HWM bypass, flash-loan MAX eligibility, multi-wallet team allocation bypass.
- Mint debt vs circulating AIT mismatch, incorrect partial unlock rounding, unclaimed abandoned position treatment.
- AMM LP locks falsely asserted as guaranteed liquidity or sale proceeds.
- Staking snapshot replay, same AIT double counting, fake staking events.
- AIT buyback followed by debt-unmatched burn.
- Compromised upgrade guardian, oracle manipulation, operator key leak.

**[REQUIRED-GATE]** Independent professional contract audit, formal property/invariant-based tests, public source verification, time-delayed upgrades and documented incident procedure before mainnet issuance.

## 12.3 Off-chain and agent security

- Prompt injection isolation: model outputs and provider responses are **untrusted input**, never authorize bank/wallet transfers or change high-value policies.
- API keys encrypted/secret-managed, redacted in logs, per-agent scoped, revocable and monitored.
- Service-to-service authorization, tenant separation, request idempotency and limited retry budgets.
- Fraud/abuse protection on trial claims, referral programs, self-trades and credit redemption.
- Pricing/routing controls using signed allowlisted provider metadata; verify *actually delivered* model where feasible.
- Provider data-handling, retention and training policies disclosed; sensitive content routed only to eligible providers with user consent.
- External agent connectors/mcp execute only whitelisted tools, authenticated scopes and hard cost ceilings.

## 12.4 Legal and financial regulatory dependencies

**[REQUIRED-GATE]** Jurisdiction-specific counsel and qualified accounting review before token offers and financial-right PT issuance. Review at minimum:

- MAX initial token sale financing and potential securities/investment scheme treatment.
- AIT as fixed-term economic compute entitlement, its trading and potential investment expectation.
- AIT Credit expiry, consumer protection, promotional terms, refunds and tax treatment.
- Treasury asset management/possible fund structures, custody, reserve claims and reporting/consolidation.
- PT as legally enforceable equity/debt/cash-flow interest and any platform exchange/transfer restrictions.
- Referral/affiliate payouts, geographic restrictions, KYC/AML/sanctions, anti-market-manipulation and tax documentation.
- Provider API/model rights, compute-credit resale/sub-licensing permissions and privacy obligations.

Any claim of a permanent fixed yield, guaranteed cash backing or investor rights must be prohibited until independently validated.

## 12.5 Risk register

| Risk | Severity | Detection / preventive control | Owner |
|---|---|---|---|
| 15% reserve net return underperforms | Critical for permanent credit claims | Prefund short term; no perpetual promise; scenario and maturity ladder | Finance/Risk |
| MAX secondary purchase mistaken for Treasury receipt | High | Source-labeled double-entry receipts, primary/secondary separation | Finance |
| Mint AIT from unissued team MAX | Critical | Eligibility controls and locked inventory, independent audit | Smart-contract/Risk |
| Curve can be reset by burns | High | HWM logic, sequence property tests, audit | Smart-contract |
| AIT buyback burns redemption debt coverage | Critical | Reserve first; no burn until matched debt settlement | Smart-contract/Risk |
| Provider vendor unexpectedly changes price/terms | High | Quote caps, margin buffers, kill switch, legal supply terms | Provider Ops |
| Earned Credit overspend/concurrent double-use | Critical | Atomic preauth/settlement and ledger reconciliation | Billing/Security |
| Fake API traffic / wash/referral farming | High | Verified billable usage, attribution controls, economics cap | Growth/Risk |
| PT lacks enforceable legal rights | Critical | Independent legal rights registry, regulated access | Legal |
| LP fee split not actually collectible | High | Fork tests, AMM fee-right proof, off-chain reconciliation | DeFi Engineering |
| Agent credential/prompt-injection escalation | Critical | Tool policy engine and no unrestricted wallets | Security |

---

# 13. Non-functional requirements and operational SLAs

| ID | Requirement | Launch acceptance |
|---|---|---|
| NFR-001 | Availability of critical inference gateway | Explicit SLA defined and measured in staging; provider failover tested. Target subject to infra review. |
| NFR-002 | Billing correctness | End-to-end reconciliation of customer debits/provider payables; no unauthorized negative credits. |
| NFR-003 | Credit solvency | Funded/committed liability coverage reported daily; new grants stop safely on breach. |
| NFR-004 | Traceability | A transaction/request can be traced from user action to model/provider, cost, wallet and ledger entry. |
| NFR-005 | Latency and cost visibility | p50/p95 service metrics by model/provider; app does not advertise unverifiable speed promises. |
| NFR-006 | Access separation | User/team data isolated; all privileged API/admin actions logged. |
| NFR-007 | Localization/accessibility | English and Chinese support, clear mobile wallet confirmations and accessible error text. |
| NFR-008 | Safe deploy and rollback | Versioned CI/CD, feature flags, staging, production approvals and rollback for reversible services. |
| NFR-009 | Open observability | Dashboards/alerts for credit coverage, price drift, token debt, failed routes, cost spikes and fraud. |
| NFR-010 | Disaster recovery | Backups, restore drills and documented incident response / settlement reprocessing. |

**To be baselined before launch:** numeric availability/error budgets, throughput, load tests, SLOs, p95 latency targets, financial reporting freshness, data retention, recovery-point and recovery-time targets. Do not invent guarantees in customer-facing materials.

---

# 14. QA plan, invariant tests and acceptance scenarios

## 14.1 Contract invariants — hard release gates

- `0 <= outstandingMintDebt <= 50,000 AIT` for Genesis.
- For every open position, `AIT_debt_remaining >= 0` and `locked_MAX_remaining >= 0`.
- `Σ position.AIT_debt_remaining == outstandingMintDebt` (subject only to explicitly modeled recovery accounting).
- `Σ position.locked_MAX_remaining == actual escrowed MAX attributable to open positions`.
- Mint only through authorized/eligible lots and funded capacity.
- `curveHighWatermark` is never reduced by burn; remint does not regain earlier cheaper curve pricing.
- Partial close of debt cannot unlock more MAX than the position's original pro-rata entitlement.
- AIT bought and held in protocol inventory is **not** treated as debt retired and cannot be casually burned.
- Contract fee distribution must satisfy `LP + MAX_staker + Buyback <= actual distributable collected fees`, with exact 50/30/20 when applied.
- Emergency pause does not secretly permit asset seizure, unlimited mint, altered old debt or bypass of governance.

## 14.2 Credit/finance invariants

- Every issued earned grant traces to a unique approved program and funded reservation.
- `Paid Credit` and `Earned Credit` are separate; a request may debit each only by explicit applicable rules.
- Aggregate committed/in-flight Credit fulfillment cost remains within reserved eligible resources, including stress buffer.
- Credit cannot be granted twice for the same staking period or idempotency key.
- Same customer API request cannot settle twice; rejected/cancelled requests release unused authorization.
- Expiry never eliminates legitimate in-flight provider obligations.
- Revenue attributed to an internal/funded reward call is not accidentally counted as external paid cash GMV.
- Primary sale cash receipt and token transfer reconcile; secondary MAX buy is not classified as new primary proceeds.
- Referral costs paid from designated pool; no duplicate reward on both referral and already fully allocated PT fees.

## 14.3 Minimum acceptance scenarios

| ID | Scenario | Expected result |
|---|---|---|
| TEST-01 | Genesis sale 50M MAX @ $0.10, no fees | Gross cash receipt $5M, separate net reconciliation. |
| TEST-02 | Sequential mint uninterrupted to 50K AIT | 50M MAX locked in aggregate, final marginal quote 1,800 MAX/AIT. |
| TEST-03 | Lock 30M MAX uninterrupted | Approx. 36,756.963 AIT, subject to token decimals/rounding. |
| TEST-04 | A user partially closes position after curve advances | Correct original-position pro-rata MAX returned; other positions unaffected. |
| TEST-05 | Burn, then remint | HWM pricing stays at least as high as prior; no early-curve reset. |
| TEST-06 | User sells minted AIT; AIT spot rises sharply | No automatic liquidation; unlock needs AIT repayment, risks shown. |
| TEST-07 | Protocol buys 10K AIT | Inventory increases, user mint debt unchanged; immediate naked burn blocked. |
| TEST-08 | 50K AIT staked over 90 days | Max accrued face value `$147,945.21`, before exact rounding/term boundaries. |
| TEST-09 | Annual Treasury return 0% | No new unfunded future commitment; funded active 90-day credits still honored. |
| TEST-10 | User invokes expensive model under insufficient credit | Fails preauth before downstream provider charge. |
| TEST-11 | 1M USD AIT secondary purchase | No automatic Treasury increase; separate market-flow metrics. |
| TEST-12 | Gateway 2M paid GMV with independent net contribution | Accurately report vendor settlement, margin and approved allocation without double count. |
| TEST-13 | PT fee collector receives 100 USDC of distributable fees | 50/30/20 exact allocation with independent LP rights proven. |
| TEST-14 | Referral fake wallets/self-trades | Suppressed or clawed back; program cap intact. |
| TEST-15 | Compromised tool output asks agent to transfer Treasury funds | Refused by policy layer; requires authenticated human/multisig. |
| TEST-16 | Hermes agent uses Maxshot as main endpoint | Real model response, correct usage and key-bounded spend; auxiliary calls audited. |
| TEST-17 | Provider fails or changes model identity/pricing | Router fails over within allowed policies or halts, never silently overcharges. |

## 14.4 Documentation acceptance

- A technically competent reader can reconstruct curve values and ROI from published formulas.
- UI and PRD show the **same denomination (50K AIT, 600→1,800)**; no stray outdated 10M AIT/$0.0816 floating model.
- Legal disclosure distinguishes 90-day funded entitlement, 15% hypothesis, 80% allocation, token price risk and no NAV redemption.
- `SKILL.md` only references verified executable actions and states when deployment is not available.
- Each P0 acceptance test produces CI report, evidence and named approver.

---

# 15. Delivery plan and release gates

## Phase 0 — Decisions, architecture and legal readiness

**Deliverables:** approved token economic spec; tranche/cap table; Genesis curve simulator; treasury/custody design; accounting memo; legal scope review; contract threat model; verified live Gateway/API capability matrix.

**Exit gate:** no open critical design contradictions about AIT fixed-term obligations, burn/debt accounting, token sale eligibility or Treasury custody. Budget and jurisdiction are approved.

## Phase 1 — Compute-first MVP

**Scope:** model catalog, API keys, payment/usage ledgers, provider routing and benchmark suite, first working `SKILL.md`, Hermes/custom agent connection, per-agent budget and basic provider console.

**Exit gate:** verified Paid first call, exact ledger match, core cost protection, provider settlement proof, no financial tokens required for normal usage.

## Phase 2 — MAX/AIT Genesis and funded Credit beta

**Scope:** primary MAX distribution/eligibility, token contracts, curve/position frontend, independent audit, staking, approved 90-day `$12/365` AIT credit accrual, grant/expiry and funded credit reserve dashboard.

**Exit gate:** 50K cap and debt invariants proven, full reserve prefunding, audits/legal approvals, public contract registry, production monitoring and emergency procedures.

## Phase 3 — Agent-led distribution and DeFi referrals

**Scope:** universal referral pages, Compute Drops, Agent Wallet, official verified MCP integration where available, agent templates, market-purchased AIT Earn programs, MAX bonus staking.

**Exit gate:** verified incrementality/retention, anti-fraud, no unfunded credits and channel contribution margin measured.

## Phase 4 — Qualified PT/MAX Provider Market

**Scope:** PT legal rights and issuer onboarding, permissioned PT trading architecture, initial LP and lock design, 50/30/20 net fee split, AIT buyback reserve and Provider primary financing workflows.

**Exit gate:** legal rights defensible, trading authorization resolved, fee capture correct, LP custody audited, no provider asset double-pledge.

## Phase 5 — Conditional scaling

**Scope:** second MAX primary tranche if approved, expansion of eligible capital/compute reserve, new AIT issuance season, provider financing/GPU SPVs, automated agent operations.

**Exit gate:** growth justified by **new real capital and/or sustainable verified operating income**; not MAX FDV or artificial Token demand alone.

## 15.1 Definition of Done for every agent-assigned task

A task cannot be marked Done solely because an AI agent claims it is complete. It requires:

1. Linked requirement ID, authorized scope and recorded assumptions.
2. Reproducible code/spec/UX artifact with reviewable diff.
3. Automated tests and evidence of business-level acceptance criteria.
4. Independent AI review and CI/security scans where applicable.
5. Human approval for production configuration, funds, contracts or externally consequential actions.
6. Deployment confirmation, monitoring and rollback instructions.
7. PRD and `SKILL.md` update if behavior or economic terms changed.

## 15.2 RACI-inspired accountability in an agent-native company

| Deliverable | Autonomous execution | Independent review | Final authority |
|---|---|---|---|
| Product research, PRD and backlog | Chief/Product Agents | Domain reviewer | Founder/Product Owner |
| API/UI code and staging | Coding Agents | QA/Security Agent, CI | Technical Owner |
| Model routing optimization | Provider/Operations Agents | Monitoring/QA Agent | Policy-controlled approval; human if risk tier escalates |
| Curve simulations | Tokenomics Agent | Independent Finance/Quant + Security | Founder/Product + qualified advisers |
| Production token deployment | Smart-contract Agent drafts only | Independent external audit + legal | Authorized multisig / governance |
| Treasury allocation or investment | Treasury Agent analyzes only | Risk/Finance + legal | Human signatories |
| Growth experiments | Growth Agent | Finance/fraud checks | Budget policy / approver |

---

# 16. KPI measurement and monitoring

## Product / network

- Activated account: completed first verified paid or authorized funded inference call, not just signup.
- Activated agent: verified Maxshot-routed request with an enforceable budget and retained connection.
- Paid GMV and **contribution margin** by provider/model/cohort; distinguish subsidized calls.
- True provider capacity: uptime, p95 latency, throughput, error rate, cost advantage and verified model delivery.
- Paid retention, repeat paid spend, time-to-first-inference, CAC versus realized margin.

## MAX / AIT

- MAX primary sold and **net Treasury receipts**, secondary liquidity and locked-eligible percentage.
- AIT outstanding / staked, mint/burn volumes, curve HWM, outstanding debt, oldest positions and abandoned-lock estimates.
- AIT secondary market price and depth; implied 90-day remaining Credit face benefit; no automatic price support inference.
- Credit granted, committed, used, expired, funded capacity and **worst-case outstanding obligation coverage**.
- Separate `base` and `bonus` credit costs, cost/model mix and claim completion.

## Provider / PT / referrals

- Qualified provider funnel from application through active paid calls.
- PT issuance and rights/LP disclosures, collectible net fees, fee split paid and buyback inventory.
- Referral contribution after verified external revenue and fraud/chargebacks; true first-customer and repeat customer conversion.

## Operating agents

- Accepted tasks, code/QA cycle time, correctness of changes, production rollback rate, human intervention rate, blocked/risk-escalated tool calls and model spend per business outcome.

---

# 17. Open decisions and founder sign-off checklist

A working PRD must make unresolved commercial terms visible rather than pretending they were agreed.

| Decision ID | Question | Proposed default | Owner / blocker |
|---|---|---|---|
| DEC-01 | Is total MAX supply definitively 1,000,000,000? | Keep as 1B **assumption**, do not finalize contracts/sale math otherwise. | Founder |
| DEC-02 | Exact token-sale issuer, jurisdiction, vesting and rights? | Legal entity + receipt custody + investor disclosure before sale. | Legal/Finance |
| DEC-03 | Does all 50M Genesis MAX become eligible to mint, including secondary transfers? | Eligibility follows documented legitimate distribution, not temporary wallet identity; anti-replay required. | Product/Security |
| DEC-04 | Is the intended Genesis AIT cap 50,000 with 600→1,800 MAX/AIT? | Yes as working latest baseline, pending formal approval. | Founder |
| DEC-05 | How should HWM curve behave when old positions burn? | Nondecreasing HWM floor as §4.3, with game-theory simulation. | Quant/Engineering |
| DEC-06 | Fixed Credit term after the first 90 days? | **No perpetual guarantee**; renew only after funded coverage approval. | Founder/Finance |
| DEC-07 | Does base Credit rate equal $12/365 per AIT-day? | Yes, displayed as ~$1/month; enforce 7-day grants. | Product/Finance |
| DEC-08 | Credit model eligibility and worst-case conversion cost? | Start with restricted supported models; price caps/reserve buffer. | Gateway/Finance |
| DEC-09 | How much cash is held aside before investment? | Prefund entire active term plus buffer; lower investment yield scenario accordingly. | Treasury/Risk |
| DEC-10 | Is 15% achievable after all risk/custody/operational costs? | Treat as scenario only; commission independent diligence. | Treasury/Finance |
| DEC-11 | What is MAX staking's fee entitlement vs lock-only mint position? | No automatic double counting; separate earned fee rights documented. | Product/Legal |
| DEC-12 | Does MAX Boost affect base or bonus? | **Bonus only**; base amount fixed within funded term. | Product |
| DEC-13 | PT rights / jurisdiction / transfer restrictions? | Per-provider legal docs, no informal equity claims. | Legal |
| DEC-14 | How is LP 50% actually captured and owned? | Prove AMM-specific mechanics before PT launch. | DeFi Engineering |
| DEC-15 | What happens to protocol AIT bought under 20% fee allocation? | Hold in buyback inventory; separate debt retirement design. | Smart-contract/Risk |
| DEC-16 | Credit spend order and refunds? | Earliest-expiring earned → paid, subject to terms; approval needed. | Billing/Legal |
| DEC-17 | Can DIEM / other provider compute be pooled and resold legally? | Require explicit provider/API contractual authorization. | Legal/Provider Ops |
| DEC-18 | Initial shipping chain, bridge policy and token decimals? | Choose one audited chain for MVP, no cross-chain token bridge initially. | Engineering/Security |
| DEC-19 | Does any Treasury/team-held AIT stake/earn? | Default no; publicly specify before mint. | Governance |
| DEC-20 | Which agents can act in production and up to which budget? | Risk-tiered policy; no master Treasury keys with agents. | Security/Founder |
| DEC-21 | Is the old Omni-Vault/DeFAI asset management product in MVP? | Optional later integration, not a dependency of Gateway + MAX/AIT. | Founder/Product |
| DEC-22 | Public availability and API base URLs for Agent Skills/MCP? | Publish only after authenticated end-to-end verification. | Engineering |

## Required approvals before publication of token economics

- [ ] Confirm full MAX supply and final 50M tranche rights/distribution details.
- [ ] Approve the exact AIT denomination, curve, HWM/refill policy and cap.
- [ ] Approve regulatory perimeter and actual sale/Treasury entities.
- [ ] Sign off on 90-day funded Credit language and expiry mechanics.
- [ ] Provide reserve cash/capacity proof, forecasts and downturn stress results.
- [ ] Approve AIT buyback reserve versus eventual debt-matched burn rules.
- [ ] Confirm MAX Fee Share / PT rights and non-duplicated revenue allocation.
- [ ] Review independent on-chain/off-chain security and operational controls.
- [ ] Verify all public docs, product screens, agents and API references match deployed reality.

---

# Appendix A — Formula reference and sample calculations

## A1. MAX price and primary proceeds

```text
Implied initial MAX price = MAX FDV / MAX fully diluted total supply
                           = $100,000,000 / 1,000,000,000
                           = $0.10/MAX

Gross primary proceeds    = 50,000,000 MAX × $0.10 = $5,000,000
Net eligible Treasury     = gross received - fees/refunds/restrictions
```

## A2. Mint curve (latest units)

```text
C = 50,000 AIT
R(S) = 600 × [1 + 2(S/C)²]                  MAX/AIT
L(S) = 600S + 400S³/C²                      MAX locked from 0 without burn
L(50,000) = 50,000,000 MAX
L(36,756.9629525) ≈ 30,000,000 MAX
```

**Decimal handling:** AIT and MAX on-chain decimals, minimum lot, and acceptable rounding error remain contract design choices. Use integer arithmetic. Figures above are analytic real-number approximations.

## A3. Compute budget and fixed-term liability

```text
Illustrative income:         $5,000,000 × 15% = $750,000 / year
Illustrative 80% allocation: $750,000 × 80% = $600,000 / year
Base AIT rate:               $12 / 365 days / 1 staked AIT
Max 50K annualized face:     50,000 × $12 = $600,000 / year
Max 50K 90-day face:         50,000 × $12 × 90/365 = $147,945.21
At 60% MAX lock:             36,756.96295 × $12 = $441,083.56 annualized
```

**All “annualized face” values assume persistent eligibility and face usability. Only the specifically announced, funded program term creates a committed reward obligation.**

## A4. Market ROI, example

```text
For one staked AIT, program rate annualized at $12 face:
Annualized Credit face yield = 12 / AIT spot price
At $50/AIT → 24% annualized face yield
90-day approved term → (12 × 90/365) / $50 ≈ 5.92% face benefit
```

## A5. Trade dynamics

```text
1) AIT buyer acquires $1M of AIT from DEX / users.
   → Price/liquidity changes; NO automatic Treasury cash receipt.
2) Some seller/minter later buys MAX and locks it.
   → MAX may lock, AIT supply may rise; NO new Treasury cash
     unless MAX was purchased from a new approved Treasury primary sale.
3) If new primary MAX sale occurs:
   → Record actual proceeds separately and recompute eligible reserve capacity.
```

## A6. Economic solvency is not a token market cap calculation

```text
DO NOT equate:
  market value of locked MAX
  = Treasury investable assets
  = AIT NAV
  = perpetual Compute liability coverage

Only real eligible cash/contractual capacity supports service fulfillment.
```

---

# Appendix B — Dictionary

| Term | Meaning |
|---|---|
| `FDV` | Fully diluted valuation of MAX based on total possible supply and reference spot/offer price. |
| `MAX primary distribution` | New sale by authorized token owner where proceeds genuinely enter the Treasury or designated eligible issuer structure. |
| `MAX lock` | Escrow of MAX in a smart contract in exchange for permission to mint AIT and a right to retrieve MAX only after burning a position's AIT debt. |
| `Mint debt` | The AIT quantity a position must burn to recover its underlying locked MAX. Not necessarily USD debt. |
| `Bonding curve` | Deterministic MAX-per-AIT issuance schedule; **not** a promise to redeem AIT for cash or at the current curve spot rate. |
| `Curve HWM` | Monotonic high-watermark for mint-rate progression, preventing cheap reset after AIT burn. |
| `AIT` | Tradable compute-rights Token in latest planned economics. |
| `Compute Credit` | USD-denominated *service consumption allowance*, distinct from cash, AIT or MAX. |
| `Earned Credit` | Time/eligibility-limited compute grant funded by protocol budget. |
| `Paid Credit` | Customer prepaid consumption balance, generally a separate economic/legal obligation. |
| `Provider Market` | Operational market in real inference supply and price/SLA competition. |
| `PT` | Provider-specific token with legally specified rights or utility; equity rights cannot be presumed. |
| `PT/MAX LP` | Liquidity position facilitating PT/MAX trading; not automatically liquid Treasury capital. |
| `Buyback Reserve` | Protocol-held AIT bought from market but not automatically burned, to preserve mint/unlock debt correctness. |
| `Agent Skill` | Markdown operational guidance and optionally verified tool/API hooks to help an AI agent connect to Maxshot. |
| `Face ROI` | Quoted Credit utilization value relative to acquisition cost; **not** cash return/APY. |
| `Eligible Treasury Assets` | Assets genuinely received/controlled/available under applicable accounting, legal and liquidity rules. |

---

# Appendix C — Engineering handoff checklist

An AI engineering agent receiving this PRD should:

1. Read the **decision table** first; do not implement an item marked `[OPEN]` without an approved resolution.
2. Generate a requirement-to-code/test traceability matrix keyed by FR/ECON/ACC/SEC/NFR/TEST IDs.
3. Build and freeze a numerically verified reference implementation of the mint curve and burn/remint HWM behavior before writing Solidity.
4. Build the Credit/finance ledger and worst-case reserve model before offering fixed-rate staking terms.
5. Build a functioning paid Gateway + provider usage/settlement path independent of token speculation.
6. Produce UI prototypes for Agent Connect, MAX→AIT Mint, AIT Staking/Credits, Provider Market and Treasury Risk.
7. Implement minimal-permission tools for AI agents; keep contract and money actions behind enforced human authority.
8. Complete security, legal and financial release gates, including audit evidence, before enabling real funds or minting.
9. Update public `SKILL.md` and model documentation only with verified production endpoints and contract addresses.
10. Report missing decisions explicitly, with recommended choices and quantified tradeoffs; never silently substitute older V4 parameters.

**End of PRD — Version 1.0 Draft.**
