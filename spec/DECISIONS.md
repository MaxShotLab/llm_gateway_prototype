# Maxshot — Decisions and gap register

**Status:** Decision index, compacted 16 November 2026. Behavior lives only in the specs; each row here records what was decided and which rules carry it. If a row and a rule ever disagree, raise it with product before building. The full wording of every decision as made, including the prior source wording it replaced, is preserved in [archive/DECISIONS_full_record_2026-11-16.md](./archive/DECISIONS_full_record_2026-11-16.md). The read-only source is [`reference/MAXSHOT_Tokens_PRD_v1.0(read only).md`](./reference/MAXSHOT_Tokens_PRD_v1.0%28read%20only%29.md).

## 1. How to use this file

- The read-only source PRD is reference-only. Its surviving requirements bind through the rules, gates and decisions named in [SOURCE_COVERAGE.md](./SOURCE_COVERAGE.md); a source requirement not carried there does not bind. A **Decided** row records why a source requirement was replaced.
- A decision is a working product and engineering decision, **not** approval of a token sale, Credit funding, legal availability or mainnet deployment.
- Link tests to the governing rule ID and, where useful, the TD number.

**Source requirements carried into rules:** the 50,000 outstanding AIT cap as a working proposed parameter (TOK-R10); no cash or NAV redemption (TOK-R12, R13); no automatic liquidation (TOK-R13); no AIT buyback burn without debt-safe settlement (TOK-R15); funded, finite Credit terms (TOK-R23, R31); separate paid, earned and Treasury ledgers (BIL-R02, XCT-R10); contract audit, legal review and reserve gates (XCT-G01, G02, G05). Minter provenance tracking, the one-chain launch assumption and per-agent Credit allocation are superseded (TD-10/12/13/24).

## 2. Decisions

| ID | Decision | Governing rules | Status |
| --- | --- | --- | --- |
| TD-01 | No time lock on the active mint position. | TOK-R11 | Decided |
| TD-02 | One merged active position per controller; every mint adds to it; each mint event is retained. | TOK-R09 | Decided |
| TD-03 | A burn closes part or all of the merged position at its blended ratio; partial burn rounds MAX down, full burn moves all MAX. | TOK-R11 | Decided |
| TD-04 | Burned MAX goes to a pending balance withdrawable seven days after the latest burn; each burn resets the whole pending wait. | TOK-R12 | Decided |
| TD-05 | HWM is the peak outstanding AIT debt and never falls; refill below it costs `R(HWM)`, the part above it the curve integral. | TOK-R10 | Decided working design; simulation/audit still required |
| TD-06 | MAX and AIT use 18 decimals. | TOK-R02, TOK-R03 | Decided |
| TD-07 | The position view shows debt, MAX, ratio, pending MAX, next withdrawal time and the reset effect of another burn. | TOK-R27 | Derived acceptance requirement |
| TD-08 | All 1B MAX minted on Ethereum at genesis into purpose-specific custodian wallets; no later issuance; bridging moves existing supply. | TOK-R06 | Decided product/contract rule; deployment manifest pending |
| TD-09 | Initial sale: 50,000,000 MAX at $0.10; execution with the commercial team. | SPEC_TOKEN §6 | Decided commercial input; execution pending |
| TD-10 | Any transferable MAX may lock without provenance tracking; unsold allocations stay under custody controls. | TOK-R07, TOK-R08 | Decided product behavior; custody implementation pending |
| TD-11 | The merged position is non-transferable at launch; AIT is freely transferable. | TOK-R09, TOK-R13 | Decided for launch |
| TD-12 | Ethereum is the home chain; MAX routes across Ethereum, Base, Arbitrum One and Robinhood Chain; MAX returns to Ethereum to lock. | TOK-R01, TOK-R02 | Decided scope; endpoint/lane security configuration pending |
| TD-13 | AIT stays on Ethereum at launch; its LayerZero capability is built but inactive. | TOK-R03 | Decided launch behavior; peer deployment pending |
| TD-14 | Staking accrues from stake time with no warm-up; unstaking stops accrual at once and keeps accrued entitlement. | TOK-R20 | Decided |
| TD-15 | Program-wide weekly grants; spend order AIT Earned Credit → Basic → Premium → Free → Referral → Dollar; only allowance-funded text uses text windows; unused holds return to source and expiry. | BIL-R08, BIL-R09, BIL-R28, TOK-R24 | Decided; settled-call refunds are in TD-19 |
| TD-16 | AIT Earned Credit is spendable only on the funded term's catalog set, from the UI or a scoped key. | BIL-R06, TOK-R26 | Decided behavior; catalog set/cost caps pending |
| TD-17 | One verified staking wallet per account; no change or unlink; direct on-chain unstake stays available. | TOK-R18, TOK-R19, ACC-R04 | Decided |
| TD-18 | Independent Mint, Burn, Withdraw pauses plus Pause All, and an independent bridge pause. | TOK-R05 | Decided controls; authority/configuration pending |
| TD-19 | Unused holds return to source and expiry; a refunded settled charge restores AIT as a new seven-day grant and Dollar to Dollar balance. | BIL-R28, BIL-R42 | Decided |
| TD-20 | Staked AIT must be unstaked before burning; unstaking has no delay. | TOK-R11, TOK-R20 | Decided |
| TD-21 | Both a global MAX bridge pause and per-directed-route pauses. | TOK-R05 | Decided |
| TD-22 | AIT Earned Credit exists only in the Gateway ledger; grants post automatically after finality in shared seven-day intervals. | TOK-R04, TOK-R24 | Decided |
| TD-23 | Each model has one current catalog; a funded term allows a set; eligibility is read at authorization; in-flight requests keep their decision. | BIL-R06, BIL-R12, PRV-R18, ADM-R15 | Decided |
| TD-24 | Agent-style integration through scoped keys on the same account ledger; managed Agent objects, Agent Wallet and Agent Factory deferred. | AGT-R01 | Decided integration direction; managed-Agent scope deferred |
| TD-25 | Dollar balance is funded through the existing crypto-deposit flow; the live path is to be verified. | BIL-R01 | Decided product path; live verification pending |
| TD-26 | The catalog includes all verified models; unpinned routing picks the lowest quoted provider cost among qualified offerings. | PRV-R23 | Decided policy; thresholds/configuration pending |
| TD-27 | Offerings share a customer model ID only after verified version and capability equivalence. | PRV-R04 | Decided |
| TD-28 | One verified route is enough to publish a model; if it fails the model is unavailable, never substituted. | PRV-R03, PRV-R05 | Decided launch rule |
| TD-29 | Each offering passes a small scripted admission test plus manual quality review; continuous benchmarking is later. | PRV-R06 | Decided launch qualification scope |
| TD-30 | Append-only provider attempt, cost, correction and dispute ledger; manual payout after invoice reconciliation. | PRV-R06, PRV-R14, ADM-R17 | Decided launch settlement scope |
| TD-31 | At most one same-model fallback, before output, within the original ceilings; a pin never falls back; no cross-model fallback. | PRV-R24, PRV-R25, BIL-R26 | Decided launch routing behavior |
| TD-32 | Auto model selection is not a launch requirement; later shadow test and opt-in web text-Chat pilot. | PRV §7.3, reference/AUTO_MODEL_ROUTING_DESIGN.md | Decided release sequence; pilot parameters pending |
| TD-33 | The first Provider Token release has no effect on routing. | PRV-R37 | Decided first PT integration boundary; PT legal/economic gates remain |
| TD-34 | Each offering has its own customer rate card; Models & Pricing sits under Providers; charge from the serving offering's rate within the maximum. | PRV-R18, PRV-R29, ADM-R14, BIL-R27 | Decided launch pricing and UI rule |
| TD-35 | Providers shows observed success and p50/p95 latency per offering only with a sufficient sample, otherwise Insufficient data. | PRV-R32–R34 | Decided minimum customer evidence display and page ownership |
| TD-36 | The mint charge is evaluated exactly in integer wei and rounded up once. | TOK-R16, TOK-R17 | Decided product/contract arithmetic; security review remains |
| TD-37 | The API authorizes in one call with an optional caller ceiling; no quote-confirm endpoint. | BIL-R13, BIL-R22 | Decided API authorization flow; live contract integration pending |
| TD-38 | An existing Vault depositor can withdraw with the position wallet before or without linking an account. | ACC-R03 | Decided migration access rule; Vault integration pending |
| TD-39 | Reserve a hard maximum before dispatch; the final charge may exceed the estimate but never the maximum; overruns are provider discrepancies. | BIL-R21, BIL-R25, BIL-R27 | Decided cross-product billing rule; live integration pending |
| TD-40 | Cumulative integer grant: floor cumulative term entitlement to whole Credits and grant only the increase. | TOK-R25 | Decided arithmetic rule; term conversion value is a funded-program input |
| TD-41 | Pickers show only usable models; each enabled catalog keeps at least five distinct usable models. | PRV-R05, PRV-R29, PRV-R30 | Decided catalog and UI rule; live inventory/health integration pending |
| TD-42 | Maxshot referral rewards qualify on confirmed top-ups at the USD credited after fees, once per top-up; subscription payments never qualify. | ACC-R13, ACC-R14 | Decided event and unit boundary; commercial terms pending |
| TD-43 | Build order and release tags; B3 ships in the Unified app cut; contract work starts now; economic sign-off is a launch gate. | 00_README §2 | Decided |
| TD-44 | Scoped API key policy: catalogs, per-request ceiling, daily and monthly budgets, Credits first, Dollar only if enabled, expiry, revocation, key ID in Usage. | BIL-R09, BIL-R12–R17 | Decided |
| TD-45 | The external-agent guide is product-owned; discovery is the filtered catalog read; MCP not required. | AGT-R01–R09 | Decided |
| TD-46 | One stable request ID per accepted request, returned by the API and shown in Usage. | BIL-R18, ADM-R11 | Decided |
| TD-47 | Funding eligibility matrix; Basic covers Basic-labeled API text; Premium covers Studio media; Free and Referral apply everywhere, to verify live. | BIL-R06, BIL-R08 | Decided; live Free/Referral behavior to verify |
| TD-48 | Provider pin in Chat, Studio and API; an ineligible pin is rejected with no fallback. | BIL-R20, PRV-R22 | Decided; prototype done 16 November 2026 |
| TD-49 | Media job states, manual resolution of uncertain jobs, 24-hour auto-release, Pending shown with the held amount. | BIL-R32–R40 | Decided |
| TD-50 | Wallet link by SIWE (EIP-4361) with ERC-1271; no relink of any kind in this release. | TOK-R18, ACC-R04, ADM-R21 | Decided |
| TD-51 | Accrual and grants read only finalized blocks with block timestamps; stakes are shown only once finalized. | TOK-R22, TOK-R27 | Decided |
| TD-52 | Admin write actions and views by release; Vault Merkle publishing stays in Vault tooling; pauses stay with the multisig. | ADM-R12–R22 | Decided |
| TD-53 | 1,000,000 Credits = $1; LAUNCH_CONFIG_V0 labels every other value by status. | BIL-R03, LAUNCH_CONFIG_V0 | Decided values and release-input placeholders identified per row |
| TD-54 | Prototype aligned: provider selector, key policy, request ID and key filter, Pending holds, live Credit unit. | frontend/AGENTS.md | Decided; prototype done 16 November 2026 |
| TD-55 | Canonical documents consolidated into `spec/`; merged sources in `archive/`, context in `reference/`. | 00_README §3 | Decided |
| TD-56 | A key's Dollar spend is opt-in for every request type, not only media. | BIL-R15 | Decided |
| TD-57 | A refunded settled charge restores allowance, Free and Referral portions to the original bucket if still valid, otherwise they lapse. | BIL-R42 | Decided |
| TD-58 | A nonconforming upstream router is not admitted or routed, even when pinned. | PRV-R10 | Decided |
| TD-59 | No exploration traffic at launch; unpinned routing is strictly lowest quoted cost. | PRV-R23 | Decided |
| TD-60 | Staking accrues only from the later of stake time and verified link time (extended by TD-67). | TOK-R20, TOK-R21, TOK-R25 | Decided |
| TD-61 | MAX Boost Bonus Pool and MAX fee-staking rights move to a later release. | SPEC_TOKEN §6 | Decided |
| TD-62 | The source's coverage panel and reserve dashboard are an internal admin view in the MAX/AIT release; a public coverage panel is a later decision needing legal sign-off. | TOK-R30, ADM-R23 | Decided |
| TD-63 | Treasury-, team- and protocol-held AIT accrues no AIT Earned Credit at launch (source DEC-19 default). | TOK-R36 | Decided |
| TD-64 | On a coverage breach, a limit on AIT Earned Credit spend for high-cost models is a prospective routing or availability control for new requests only; it never changes a term's locked catalog set, rate or length. | TOK-R23, TOK-R30 | Decided |
| TD-65 | Deployment confirmation, monitoring and rollback evidence are required only for tasks that deploy or change a running service; development and documentation tasks close without them. | XCT-R03 | Decided |
| TD-66 | The mint view shows the exact contract-quoted MAX for the chosen AIT amount and a separate user-set maximum-MAX-in guard, and may show the derived average MAX per AIT. It replaces the source's "implied reference cost"; no USD estimate is required. | TOK-R28 | Decided |
| TD-67 | Staking is open with no active funded term and accrues nothing then. Accrual starts at the latest of stake time, verified link time, term start and acceptance of that term's terms version; an existing stake needs acceptance of each new term. | TOK-R20, TOK-R21, TOK-R29 | Decided |

## 3. Remaining gaps (release inputs, not product-behavior decisions)

These are **not** resolved by the decisions above. Assign each to the named workstream before that workstream's production release; do not fill them with developer assumptions.

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

Closed since 15 November 2026 by TD-43…TD-67: build order, key policy, agent guide ownership, request ID, funding matrix, provider pin scope, media job lifecycle, wallet link method, finality rule, admin write actions, placeholder configuration, stale clauses and document structure.

The compute-first Gateway, genesis MAX contract, Ethereum merged position state machine, Ethereum-only staking, off-chain Credit ledger and four-chain MAX bridge have no remaining founder-level **product-behavior** decision blocking development. Economic approval, production configuration, security review and live verification remain release gates. None of this authorizes production token launch or a funded Credit promise.

## 4. Change control

1. Keep the read-only source intact. Record each new decision here as one row with its governing rule IDs; put the behavior in the owning spec in the same change.
2. A decision that changes a formula, user right, reserve obligation or unlock timing updates this file and the owning spec together.
3. Engineering's handoff package includes a requirement matrix by rule ID and the acceptance cases of each spec. Source traceability is [SOURCE_COVERAGE.md](./SOURCE_COVERAGE.md); a change to a carried source requirement updates that file in the same change.
4. Public launch materials are reconciled to deployed contracts, funded programs and legal terms; a working decision here is not a live-product claim.
