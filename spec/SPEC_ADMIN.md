# SPEC_ADMIN — administrator and operations surfaces

**Status:** Canonical specification, 16 November 2026 (TD-52). §1 carries the existing read-only admin requirements (formerly `ADMIN_GATEWAY_EARLY_OPERATIONS_PRD.md`, 9 November 2026) unchanged in scope. §2 adds the write actions that the Foundation, Unified app and MAX/AIT acceptance cases require. Every §2 action is audit-logged (actor, time, before/after, reason). Reuse existing admin navigation, permissions and pagination; never expose wallet secrets, API keys or prompt/response content.

## 1. Read-only operations (phase 1, existing dashboard)

### Goal

Give an operator a reliable, read-only view of who uses Maxshot, where user funds and promotional value came from, how usage reaches OpenRouter, and which exceptions need action. Extend the existing dashboard and ledgers; do not create a second accounting system.

**Existing foundation:** The admin already has account balances, subscription operations, confirmed deposits, address balance caches, usage trends, request audit, model-source sync, supplier cost budgets, and exception queues. The requirements below add missing summaries, links, and evidence; they do not replace those views.

### Requirements

### 1.1 User segments

- Add counts and filters for **free-only**, **topped-up**, and **current subscriber** accounts to the existing user page. Topped-up and subscriber are independent attributes and may overlap.
- Define **topped-up** as at least one confirmed, credited top-up; **current subscriber** as an unexpired `active` or `cancel_at_period_end` period; **free-only** as neither. Show enabled and disabled counts separately; do not hide disabled accounts from search.
- Show these attributes on each user row and link to the existing account, deposit, and subscription details. In account detail, separate free from referral Credits, which are currently combined.
- Compute totals and filters over all matching records, not just the loaded page; display their as-of time and an explicit unknown state if unavailable.

### 1.2 Funds and provider flow

- Add a period summary linked to the existing deposit, accounting, subscription, and usage pages: **gross top-ups → fees → net Dollar credited → PAYG Dollar debits and Dollar-funded subscription debits**. Show direct card subscription receipts separately so an existing Dollar balance debit is not counted as new cash. Show free/referral grants and use, subscription allowances and use, and provider cost in separate lines and units.
- Link each total to its source records using existing IDs where available. Reconcile confirmed deposits with Dollar credits and settled usage with its funding debits and provider costs. Show mismatch count, amount, age, and records; mark incomplete or pending evidence explicitly. Missing amounts remain **unknown**, never zero.
- Summarize the existing on-chain address-balance cache by asset and network, with its freshness and errors. Show treasury/sweep balances and customer Dollar liability only when those sources exist. Calculate a difference only for a complete, comparable set of balances; otherwise label the comparison unavailable. On-chain holdings are not revenue.

### 1.3 OpenRouter operations

- Add one OpenRouter operations summary using the existing request audit, model-source sync, and supplier-budget data: recent request success/error rate, 429 and 5xx counts, latency where recorded, last successful request, catalog-sync age, budget use, and unsettled cost/reservations. Link each measure to its existing detail view.
- Show the observation window and freshness for every status. A healthy gateway process must not mask an unhealthy upstream or stale data.
- Alert when upstream errors or latency cross documented operational thresholds, catalog sync is stale, or cost reconciliation lags. Link alerts to affected requests or source records. Show provider balance/runway and a low-funding alert only after an authoritative balance source is integrated; otherwise display **unavailable**.

### 1.4 Referral records

- Add a read-only admin referral ledger linking referrer, referred account, qualifying confirmed top-up, reward policy used, calculated reward, grant ledger entry, and pending/granted/withheld/revoked status. Show the reason for withholding or revocation.
- Show free grants and referral rewards separately in account history. Reuse the existing reward rate, cap, and eligibility rules in the Gateway PRD; subscription payments remain ineligible.

### Acceptance checks (phase 1)

1. A reviewer can filter free-only, topped-up, and current subscribers, including overlapping segments and disabled accounts, and reproduce the displayed counts.
2. A confirmed top-up can be traced from payment/chain evidence through fees and net Dollar credit to account balance; any break appears as an exception rather than a zero.
3. A settled usage request can be traced to its funding bucket and provider cost or to an explicit pending/unknown cost state. Subscription debits from Dollar balance are not counted as new receipts.
4. An OpenRouter 429, 5xx, stale catalog, or cost-reconciliation warning appears with its observation time and a route to evidence; a healthy local service alone does not clear it.

Where §1 says "OpenRouter", read **per offering** once multi-provider routing lands (§2.1); the measures are unchanged. Request audit gains a request ID search and a key ID filter (TD-46/44).

## 2. Write actions by release (phase 2)

| # | Action | Release | Required by | Minimum behavior |
| --- | --- | --- | --- | --- |
| 2.1 | Offering enable/disable and health override | Foundation | SPEC_PROVIDERS §1.1 gate 6, §3.1 | Toggle without deployment; disabled offering receives no new request; trace shows the block; reason recorded. |
| 2.2 | Rate card version publish per offering | Foundation | SPEC_PROVIDERS §2.2, TD-34 | New version with effective time; in-flight requests keep accepted versions; prior versions remain readable. |
| 2.3 | Model → catalog assignment change | Foundation | TD-23, SPEC_BILLING §2–3 | Changes affect new authorizations only; assignment history versioned. |
| 2.4 | Uncertain media job resolution queue | Foundation | SPEC_BILLING §5, TD-49 | List `uncertain` jobs with hold, age and provider state; resolve as delivered (settle once) or lost (release); 24-hour auto-release visible with its outcome. |
| 2.5 | Provider invoice reconciliation: correction and dispute entries | Foundation | TD-30, SPEC_PROVIDERS §1.3 | Append-only linked entries; first statement reconciled before payout; no edit of history. |
| 2.6 | Discrepancy ledger review | Foundation | TD-39, TD-49 | Provider cost above accepted maximum or after auto-release, with request ID and disposition. |
| 2.7 | Funded term configuration | MAX/AIT | SPEC_TOKEN §4.2 | Term start/end, versioned Credits-per-USD rate, allowed catalog set, reserve reference; locked once the term starts. |
| 2.8 | Grant ledger view | MAX/AIT | SPEC_TOKEN §6.3 | Per account/term/boundary: eligible AIT-wei-seconds, cumulative entitlement, grant, expiry, spend; reconstructable from finalized events. |
| 2.9 | Wallet link registry view | Unified app | SPEC_ACCOUNT_VAULT §2 | Account ↔ wallet, link time, proof reference; read-only (no relink, TD-50). |
| 2.10 | Pause state display | MAX/AIT | TD-18/21 | Read-only state of Mint/Burn/Withdraw/Pause All and bridge pauses; control stays with the multisig. |

Vault Merkle distribution publishing and history remain in the existing Vault operations tooling and are referenced, not rebuilt (TD-52).

## 3. Acceptance

For each §2 action: an operator performs it, the audit log shows it, and the corresponding spec's acceptance case observes the effect (for example, 2.1 → SPEC_PROVIDERS §7.2 "disabled or unhealthy offering"; 2.4 → SPEC_BILLING §7 case 9; 2.7–2.8 → SPEC_TOKEN §6.3). §1 acceptance checks apply unchanged.
