# Maxshot Gateway Admin: Early Operations Requirements

**Status:** Development handoff

**Scope:** Existing administrator dashboard

**Updated:** November 9, 2026

## Goal

Give an operator a reliable, read-only view of who uses Maxshot, where user funds and promotional value came from, how usage reaches OpenRouter, and which exceptions need action. Extend the existing dashboard and ledgers; do not create a second accounting system.

**Existing foundation:** The admin already has account balances, subscription operations, confirmed deposits, address balance caches, usage trends, request audit, model-source sync, supplier cost budgets, and exception queues. The requirements below add missing summaries, links, and evidence; they do not replace those views.

## Requirements

### P0 — User segments

- Add counts and filters for **free-only**, **topped-up**, and **current subscriber** accounts to the existing user page. Topped-up and subscriber are independent attributes and may overlap.
- Define **topped-up** as at least one confirmed, credited top-up; **current subscriber** as an unexpired `active` or `cancel_at_period_end` period; **free-only** as neither. Show enabled and disabled counts separately; do not hide disabled accounts from search.
- Show these attributes on each user row and link to the existing account, deposit, and subscription details. In account detail, separate free from referral Credits, which are currently combined.
- Compute totals and filters over all matching records, not just the loaded page; display their as-of time and an explicit unknown state if unavailable.

### P0 — Funds and provider flow

- Add a period summary linked to the existing deposit, accounting, subscription, and usage pages: **gross top-ups → fees → net Dollar credited → PAYG Dollar debits and Dollar-funded subscription debits**. Show direct card subscription receipts separately so an existing Dollar balance debit is not counted as new cash. Show free/referral grants and use, subscription allowances and use, and provider cost in separate lines and units.
- Link each total to its source records using existing IDs where available. Reconcile confirmed deposits with Dollar credits and settled usage with its funding debits and provider costs. Show mismatch count, amount, age, and records; mark incomplete or pending evidence explicitly. Missing amounts remain **unknown**, never zero.
- Summarize the existing on-chain address-balance cache by asset and network, with its freshness and errors. Show treasury/sweep balances and customer Dollar liability only when those sources exist. Calculate a difference only for a complete, comparable set of balances; otherwise label the comparison unavailable. On-chain holdings are not revenue.

### P0 — OpenRouter operations

- Add one OpenRouter operations summary using the existing request audit, model-source sync, and supplier-budget data: recent request success/error rate, 429 and 5xx counts, latency where recorded, last successful request, catalog-sync age, budget use, and unsettled cost/reservations. Link each measure to its existing detail view.
- Show the observation window and freshness for every status. A healthy gateway process must not mask an unhealthy upstream or stale data.
- Alert when upstream errors or latency cross documented operational thresholds, catalog sync is stale, or cost reconciliation lags. Link alerts to affected requests or source records. Show provider balance/runway and a low-funding alert only after an authoritative balance source is integrated; otherwise display **unavailable**.

### P0 — Referral records

- Add a read-only admin referral ledger linking referrer, referred account, qualifying confirmed top-up, reward policy used, calculated reward, grant ledger entry, and pending/granted/withheld/revoked status. Show the reason for withholding or revocation.
- Show free grants and referral rewards separately in account history. Reuse the existing reward rate, cap, and eligibility rules in the Gateway PRD; subscription payments remain ineligible.

## Acceptance checks

1. A reviewer can filter free-only, topped-up, and current subscribers, including overlapping segments and disabled accounts, and reproduce the displayed counts.
2. A confirmed top-up can be traced from payment/chain evidence through fees and net Dollar credit to account balance; any break appears as an exception rather than a zero.
3. A settled usage request can be traced to its funding bucket and provider cost or to an explicit pending/unknown cost state. Subscription debits from Dollar balance are not counted as new receipts.
4. An OpenRouter 429, 5xx, stale catalog, or cost-reconciliation warning appears with its observation time and a route to evidence; a healthy local service alone does not clear it.
5. A referral reward can be traced to one eligible top-up and its grant or withholding decision; free grants remain distinguishable.

## Delivery notes

- Reuse existing admin navigation, permissions, audit conventions, and pagination. New views are read-only; existing adjustment and settlement controls remain separate.
- Exports must state their scope and as-of time; existing page-limited exports must remain labeled as such.
- Never expose wallet secrets, API keys, or prompt/response content in these views or exports.
- Current observed exceptions to verify during implementation: an RPC endpoint in 429 cooldown, a pending account-funds check, and top-up income totals displayed as unknown for one payment path. These are examples, not hard-coded fixtures.
