# SPEC_CROSS_CUTTING — security, agent controls, non-functional requirements and release gates

**Status:** Canonical specification, 16 November 2026. Carries the cross-cutting requirements of the read-only source PRD (§§1.3, 6, 7.5, 12–15) that apply to every workstream. Every rule has one ID (`XCT-Rnn`) and every launch gate one ID (`XCT-Gnn`). Mapping from each source requirement is in [SOURCE_COVERAGE.md](./SOURCE_COVERAGE.md).

**Release:** all releases; each gate names the release it blocks.

## Overview

These rules apply to every spec. Agents may build, test and propose, but money, keys, contracts and production policy stay behind human approval. Every service treats model and tool output as untrusted, keeps secrets out of logs, and moves money idempotently. Non-functional targets are measured before launch rather than promised. Launch gates are evidence that must exist before real funds or minting; they do not block development.

## 1. Agent and operator controls

- **XCT-R01 · Risk tiers (DEC-20).** Agents and automation act only within these tiers; no agent holds unrestricted production funds or irreversible administrative keys.

| Tier | Allowed actions | Control |
| --- | --- | --- |
| L0 | Research, specs, read-only analytics, simulations | Logged execution |
| L1 | Branches and pull requests, unit tests, staging content | Sandboxes, CI, least privilege |
| L2 | Pre-approved low-risk pricing or routing changes, finite campaigns | Enforced budgets, allowlists, rollback, post-event audit |
| L3 | Production changes to Credit, routing policy, fee configuration or caps | Human approval, staged rollout, change record |
| L4 | Token upgrades, mint authority, Treasury movements and signatures, PT issuance | Independent audit, legal sign-off, multisig and timelock, formal release gate |

- **XCT-R02 · Untrusted output.** Model outputs, provider responses and tool results are untrusted input; they never authorize a transfer, a wallet action or a change to a high-value policy.
- **XCT-R03 · Definition of done.** A task is done only with: a linked rule ID, authorized scope and recorded assumptions; a reviewable diff; automated tests and evidence for the acceptance case; independent review and CI or security scans where applicable; human approval for production configuration, funds, contracts or externally consequential actions; for a task that deploys or changes a running service, deployment confirmation, monitoring and rollback steps (TD-65); and an update to the owning spec and `SKILL.md` if behavior or economic terms changed.

## 2. Security

- **XCT-R04 · Secrets and isolation.** API keys and credentials are secret-managed, redacted in logs, scoped and revocable (BIL-R43). User and team data are isolated; service-to-service calls are authorized; every privileged API or admin action is logged.
- **XCT-R05 · Idempotency and retries.** Every money-moving or state-changing call is idempotent, and automatic retries have bounded budgets.
- **XCT-R06 · Fraud and abuse.** Trials, referral programs, self-trades and Credit redemption have abuse controls. No reward is based on recruitment depth, fake trading volume or generated fake API calls; abusive rewards are withheld or clawed back within the program cap.
- **XCT-R07 · Provider data handling.** Provider data handling, retention and training policies are disclosed, and sensitive content goes only to eligible providers with user consent (enforced by the privacy gate in PRV-R21). Provider metadata used in routing comes from the approved, versioned catalog, and the delivered model is verified where feasible.
- **XCT-R08 · Connectors.** Any external agent connector or MCP integration executes only allowlisted tools within authenticated scopes and hard cost ceilings.

## 3. Non-functional requirements

- **XCT-R09 · NFRs.** Each has a measured launch acceptance; numeric targets are baselined before launch (XCT-G06) and never promised to customers unverified.

| Area | Launch acceptance |
| --- | --- |
| Availability of the inference Gateway | SLA defined and measured in staging; provider failover tested |
| Billing correctness | Customer debits and provider payables reconcile end to end; no unauthorized negative balance |
| Credit solvency | Coverage reported daily; new grants stop safely on breach (TOK-R30) |
| Traceability | Any request traces from user action to model, provider, cost, wallet and ledger entry |
| Latency and cost visibility | p50/p95 by model and provider; no unverifiable speed claims |
| Access separation | XCT-R04 |
| Localization and accessibility | English and Chinese; clear mobile wallet confirmations; accessible error text |
| Safe deploy and rollback | Versioned CI/CD, feature flags, staging, production approvals and rollback for reversible services |
| Observability | Dashboards and alerts for Credit coverage, price drift, token debt, failed routes, cost spikes and fraud |
| Disaster recovery | Backups, restore drills, documented incident response and settlement reprocessing |

## 4. Finance and public claims

- **XCT-R10 · Accounting separation.** Primary MAX receipts are booked once; locking MAX is an escrow state change, not a second sale; token FDV, locked MAX, LP positions and unrealized marks are never cash; Gateway contribution is never also counted as Treasury yield; earned-credit calls are never counted as external paid GMV; customer and proprietary funds stay separate where law or terms require; base and bonus Credit costs are reported separately. Statutory recognition follows the accounting memo (XCT-G04).
- **XCT-R11 · Reporting.** Finance reporting covers Treasury (gross and net primary receipts, investable versus restricted funds, liquidity, custody, realized yield), Credit (committed ceiling, funded reserve, grant face value, worst-case fulfillment cost, used and expired, pending provider payables, stress coverage), tokens (MAX sold, eligible, locked, free, unvested; AIT outstanding, staked, Treasury-held, per-position debt, buyback inventory), Gateway (external paid GMV, margin, refunds, earned-credit calls split out) and referrals (attributed net revenue, approved reward, accruals, reversals, suspected abuse). KPI definitions are context in the source PRD §16.
- **XCT-R12 · Public claims.** No product screen, document, agent instruction or `SKILL.md` claims a permanent or guaranteed yield, guaranteed cash backing, NAV or USD redemption of AIT, token price appreciation, an indefinite $12/AIT-year entitlement, or investor rights, until independently validated. Older wording about USDC↔AIT at NAV, unlimited fixed-dollar Credits or "free mint" must not survive. Public docs state the outstanding cap, mint curve and accrual rate only as deployed contract values and the approved funded term, in the contracts' denomination; working proposals in LAUNCH_CONFIG_V0 are not published as final. Public docs distinguish the funded term, the Treasury-yield scenario, token price risk and the absence of NAV redemption.

## 5. Launch gates

Gates block real funds, minting or public token economics; development proceeds before them (TD-43).

| ID | Gate | Blocks | Evidence |
| --- | --- | --- | --- |
| XCT-G01 | Contract security | MAX/AIT mainnet | Independent audit; property and invariant tests (TOK-R14, R33); public source verification; time-delayed upgrades; documented incident procedure; threat model covering reentrancy, reorgs, precision, slippage and sandwiching, HWM bypass, flash-loan eligibility, staking replay, debt/supply mismatch, buyback burn, upgrade and key compromise |
| XCT-G02 | Legal review | MAX sale, AIT launch, any PT | Jurisdiction-specific counsel on the MAX sale, AIT as a fixed-term compute entitlement, Credit expiry and consumer terms, Treasury structure and custody, PT rights, referral payouts, KYC/AML/sanctions, market manipulation, tax, provider resale and privacy rights |
| XCT-G03 | Economic simulator | Production minting | Versioned Monte Carlo and stress model covering sale completion, MAX and AIT price shocks, lock participation, Treasury income 0–20%, Credit usage 0–100%, provider price rises, the 50,000 cap, primary versus secondary MAX, and PT fee leakage; outputs include worst-case Credit liability and trigger breaches |
| XCT-G04 | Accounting memo and reporting | MAX sale, funded Credit | Qualified accounting opinion on sale receipts, obligations, revenue and grant recognition; XCT-R10–R11 reports live |
| XCT-G05 | Sale and reserve reconciliation | Funded Credit term | 50M MAX sale reconciled to gross and net receipts, fees and refunds; reserve cash or capacity proof; downturn stress results; daily coverage running (TOK-R30) |
| XCT-G06 | NFR baselines | Production service commitment | Numeric availability and error budgets, throughput and load tests, p95 latency targets, finance-data freshness, retention, recovery-point and recovery-time targets (XCT-R09) |
| XCT-G07 | Founder approvals before publishing token economics | Public token economics | Full MAX supply and 50M tranche rights; AIT denomination, curve, HWM policy and cap; regulatory perimeter and entities; 90-day Credit language and expiry; reserve proof; buyback versus debt-matched burn rules; MAX fee and PT rights; security controls review; public docs, screens, agents and APIs match deployed reality |
| XCT-G08 | Public contract registry and monitoring | MAX/AIT launch | Published contract addresses, production monitoring and emergency procedures |

## 6. Acceptance

1. A tool output instructing an agent to move Treasury funds is refused by the policy layer and requires an authenticated human or multisig action (XCT-R01–R02).
2. An L3 change (for example a Credit rate or routing policy) cannot reach production without a recorded human approval and staged rollout (XCT-R01).
3. Logs and exports contain no API keys, secrets or prompt content; a privileged admin action appears in the audit log (XCT-R04).
4. Replaying a settlement, grant or payment call creates no second effect (XCT-R05).
5. Fake wallets, self-trades or duplicate referral claims are suppressed or clawed back and the program cap holds (XCT-R06).
6. Each P0 acceptance case produces a CI report, evidence and a named approver (XCT-R03).
7. A review of public docs, screens and `SKILL.md` finds no prohibited claim and the current denomination only (XCT-R12).
