# SPEC_ADMIN — administrator and operations surfaces

**Status:** Canonical specification, compacted 16 November 2026 (TD-52). Every rule has one ID (`ADM-Rnn`). §1 carries the read-only requirements of the former `ADMIN_GATEWAY_EARLY_OPERATIONS_PRD.md` (9 November 2026) in their original scope; §2 adds the actions and views the Foundation, Unified app and MAX/AIT acceptance cases need.

## Overview

The admin extends the existing dashboard and ledgers; it never becomes a second accounting system. Phase 1 gives operators read-only evidence: who the users are, how money and promotional value flowed, how upstream providers behave, and which exceptions need action, with every total traceable to source records and anything missing shown as unknown, never zero. Phase 2 adds the few audited write actions that live provider routing, media jobs and funded Credit terms require. Contract pause controls stay with the multisig.

## 1. Read-only operations (phase 1)

**Existing foundation:** account balances, subscription operations, confirmed deposits, address-balance caches, usage trends, request audit, model-source sync, supplier cost budgets and exception queues. Phase 1 adds summaries, links and evidence to these; it replaces none of them.

### 1.1 User segments

- **ADM-R01 · Segments.** The user page counts and filters **free-only**, **topped-up** and **current subscriber** accounts. Topped-up means at least one confirmed, credited top-up; current subscriber means an unexpired `active` or `cancel_at_period_end` period; free-only means neither. Topped-up and subscriber may overlap. Enabled and disabled counts are shown separately, and disabled accounts stay searchable.
- **ADM-R02 · Segment detail.** Each user row shows its segments and links to the existing account, deposit and subscription details. Account detail shows free Credits and referral Credits separately (they are combined today).
- **ADM-R03 · Complete totals.** Totals and filters cover all matching records, not just the loaded page, and show their as-of time, or an explicit unknown state when unavailable.

### 1.2 Funds and provider flow

- **ADM-R04 · Funds summary.** A period summary, linked to the deposit, accounting, subscription and usage pages, shows **gross top-ups → fees → net Dollar credited → PAYG Dollar debits and Dollar-funded subscription debits**. Direct card subscription receipts are shown separately so a Dollar-balance debit is never counted as new cash. Free and referral grants and use, subscription allowances and use, and provider cost appear on separate lines in their own units.
- **ADM-R05 · Reconciliation.** Each total links to its source records by existing IDs. Confirmed deposits reconcile to Dollar credits, and settled usage to its funding debits and provider costs. Mismatches show count, amount, age and records; incomplete or pending evidence is marked. Missing amounts are **unknown**, never zero.
- **ADM-R06 · On-chain balances.** The existing address-balance cache is summarized by asset and network with freshness and errors. Treasury and sweep balances and customer Dollar liability appear only when their sources exist; a difference is calculated only across a complete, comparable set, otherwise marked unavailable. On-chain holdings are not revenue.

### 1.3 Provider operations

- **ADM-R07 · Provider summary.** One operations summary per provider offering (OpenRouter today), built from request audit, model-source sync and supplier budgets: recent success and error rate, 429 and 5xx counts, recorded latency, last successful request, catalog-sync age, budget use and unsettled cost and holds, each linked to its detail view and shown with its observation window and freshness. A healthy Gateway process never masks an unhealthy upstream or stale data.
- **ADM-R08 · Alerts.** Alert when upstream errors or latency cross documented thresholds, catalog sync is stale or cost reconciliation lags, linking to the affected requests or records. Provider balance, runway and a low-funding alert appear only once an authoritative balance source exists; otherwise show **unavailable**.

### 1.4 Referral records

- **ADM-R09 · Referral ledger.** A read-only ledger links referrer, referred account, qualifying confirmed top-up, reward policy version, calculated reward, grant ledger entry and status (pending, granted, withheld, revoked), with the reason for any withholding or revocation. Free grants and referral rewards stay separate in account history. Eligibility follows ACC-R13–R14.

### 1.5 Delivery rules

- **ADM-R10 · Conventions.** Reuse the existing admin navigation, permissions, audit conventions and pagination. Phase-1 views are read-only; existing adjustment and settlement controls stay separate. Exports state their scope and as-of time, and page-limited exports stay labeled as such. Views and exports never expose wallet secrets, API keys or prompt and response content.
- **ADM-R11 · Request audit.** Request audit searches by request ID and filters by API key (BIL-R17–R18).

Exceptions observed at handoff, to verify during implementation (examples, not fixtures): an RPC endpoint in 429 cooldown, a pending account-funds check, and top-up income shown as unknown for one payment path.

## 2. Admin actions and views by release (phase 2)

- **ADM-R12 · Audit every action.** Every §2 write action (ADM-R13–R19) records actor, time, before and after state, and reason. ADM-R20–R23 are read-only views.

| # | ID | Action | Release | Required by | Minimum behavior |
| --- | --- | --- | --- | --- | --- |
| 2.1 | ADM-R13 | Offering enable/disable and health override | Foundation | PRV-R06 gate 6, PRV-R27 | Toggle without deployment; a disabled offering receives no new request; the trace shows the block. |
| 2.2 | ADM-R14 | Rate card version publish per offering | Foundation | PRV-R18, TD-34 | New version with effective time; in-flight requests keep accepted versions; earlier versions stay readable. |
| 2.3 | ADM-R15 | Model → catalog assignment change | Foundation | TD-23, BIL-R12 | Affects new authorizations only; assignment history is versioned. |
| 2.4 | ADM-R16 | Uncertain media job resolution queue | Foundation | BIL-R35–R36 | Lists uncertain jobs with hold, age and provider state; resolves as delivered (settle once) or lost (release); shows each 24-hour auto-release and its outcome. |
| 2.5 | ADM-R17 | Provider invoice corrections and disputes | Foundation | PRV-R14, TD-30 | Append-only linked entries; first statement reconciled before payout; history never edited. |
| 2.6 | ADM-R18 | Discrepancy ledger review | Foundation | BIL-R27, BIL-R36 | Provider cost above the accepted maximum or after auto-release, with request ID and disposition. |
| 2.7 | ADM-R19 | Funded term configuration | MAX/AIT | TOK-R23 | Term start and end, versioned Credits-per-USD rate, rational annual base accrual, allowed catalog set, reserve reference; locked once the term starts. |
| 2.8 | ADM-R20 | Grant ledger view | MAX/AIT | TOK-R24–R25 | Per account, term and boundary: eligible AIT-wei-seconds, cumulative entitlement, grant, expiry and spend, rebuildable from finalized events. |
| 2.9 | ADM-R21 | Wallet link registry view | Unified app | ACC-R04, TOK-R18 | Account ↔ wallet, link time and proof reference; read-only (no relink, TD-50). |
| 2.10 | ADM-R22 | Pause state display | MAX/AIT | TOK-R05 | Read-only state of Mint, Burn, Withdraw, Pause All and bridge pauses; control stays with the multisig. |
| 2.11 | ADM-R23 | Credit coverage view | MAX/AIT | TOK-R30, TD-62 | Per term and grant: funded, granted, used, in-flight, reserved and expiring amounts, reconciled to provider payables, with each day's coverage result and any breach. Internal only; a public panel needs legal sign-off (TD-62). |

Vault Merkle distribution publishing and history stay in the existing Vault operations tooling and are referenced, not rebuilt (TD-52).

## 3. Acceptance

**Phase 1:**
1. A reviewer filters free-only, topped-up and current subscribers, including overlaps and disabled accounts, and reproduces the counts (ADM-R01–R03).
2. A confirmed top-up traces from payment or chain evidence through fees and net Dollar credit to the balance; any break shows as an exception, not a zero (ADM-R04–R05).
3. A settled request traces to its funding bucket and provider cost, or to an explicit pending or unknown cost; Dollar-funded subscription debits are not counted as new receipts (ADM-R04–R05).
4. A provider 429, 5xx, stale catalog or reconciliation warning appears with its observation time and a route to evidence; a healthy local service alone does not clear it (ADM-R07–R08).
5. A referral reward traces to one eligible top-up and its grant or withholding decision; free grants stay distinguishable (ADM-R09).
6. Request audit finds a request by ID and filters by key; an export shows its scope and as-of time; no view or export shows secrets, keys or content (ADM-R10–R11).

**Phase 2 actions:** for each action ADM-R13–R19, an operator performs it, the audit log records it (ADM-R12), and the owning spec's acceptance observes the effect, for example ADM-R13 → SPEC_PROVIDERS §7.2 "disabled or unhealthy offering"; ADM-R16 → SPEC_BILLING §7 case 9; ADM-R19 → SPEC_TOKEN §5.3.

**Phase 2 views:** ADM-R20 rebuilds each account's grants from finalized events and matches the Credit ledger (SPEC_TOKEN §5.3); ADM-R21 shows each verified link with its time and proof reference and offers no relink or edit; ADM-R22 shows the current state of every position and bridge pause and offers no control; ADM-R23 reconciles each term's funded, granted, used, in-flight, reserved and expiring amounts to provider payables and shows each daily coverage result (SPEC_TOKEN §5.3).
