# Compaction trace — SUBSCRIPTION (16 November 2026)

Every normative statement in the pre-compaction `SUBSCRIPTION.md` (commit `ba49eda` plus the 16 November billing edits) maps to one rule below. No new behavior. Size: 32.2 KB → 19.6 KB. The economics "Approval checks" and "Open parameters" sections, dropped when the two subscription documents were first merged, are **restored**.

| Old location | New rule | Note |
| --- | --- | --- |
| §1 paras 1–2 | SUB-R01 | |
| §1 para 3; §6 "never combines Dollars and Credits" | SUB-R02 | merged; "not refunded as Credits" clarified as plan-level, with request reversals under BIL-R42 (TD-57) |
| §2 bullets: view plans, subscribe, change, cancel, current plan, coverage, B/P/F index | SUB-R03 | merged |
| §2 bullets: windows, monthly balances, channel/modality, account-menu summary, Credit vs Dollar display | SUB-R04 | merged |
| §2 bullets: billing separate, payment history, renewal/failed/low/exhausted states; §5 in-app notifications | SUB-R05 | merged |
| §2 bullets: basic/premium spend, estimate before media submit, Earned first, fallback order, block when unfunded | BIL-R06, R08, R10, R21–R24 | cited, not restated |
| §2 bullets: pay full charge from Dollar or card, no split; keep balances usable on failed renewal | SUB-R17, R19 | merged |
| §2 bullet: tokenized card | SUB-R24 | merged |
| §3 bucket table | SUB-R06; BIL-R02, R08 | plan buckets kept; order cited from BIL-R08 |
| §3 AIT unstaking sentence | TOK-R20 | owned by SPEC_TOKEN; removed from SUBSCRIPTION and not cited there |
| §3 Premium pool paragraph; deduction record sentence; channel/modality sentence | SUB-R07 | merged |
| §3 Basic restriction sentences; limit context/output; no unlimited; F index | SUB-R08 | merged |
| §3 "Unreserved allowances expire…"; §5 no rollover | SUB-R09 | merged |
| §3.1 para 1 and table | SUB-R10 | |
| §3.1 versioned catalog; production catalog; allowance class vs eligibility | SUB-R11 | merged |
| §3.1 same price; unsupported routes; no unlimited; media API; §8 Product offer bullet 1 | SUB-R12 | merged |
| §3.1 version continuity; §8 Revenue bullet 5; §6 period keeps version | SUB-R13 | merged |
| §3.1 publish after cost test; prototype values; mock values; §8 approval bullet 1 | SUB-R14 | merged |
| §4.1 | SUB-R15 | |
| §4.2 item 1 | SUB-R16 | |
| §4.2 items 2–4; §5 Dollar first, card fallback, no split | SUB-R17 | merged |
| §4.2 items 5–6 | SUB-R18 | |
| §4.2 item 7; §5 no auto-retry | SUB-R19 | merged |
| §4.2 item 8; §5 cancellation | SUB-R20 | merged |
| §4.2 item 9; §5 no prorate | SUB-R21 | merged |
| §4.2 card removal para | SUB-R22 | |
| §4.3, §4.4 pointers | §4.3, §4.4 | kept as pointers |
| §4.5 payment and period record bullets | SUB-R23 | |
| §5 cards optional, tokenized, provider behavior | SUB-R24 | merged |
| §5 crypto top-up; top-up net of fees; Dollar funds PAYG or plan | SUB-R25 | merged |
| §5 trials and refunds; subscription payments no referral rewards; §8 revenue bullet 4 | SUB-R26 | merged |
| §5 "prototype uses simulated checkout" | SUB-R14 | merged |
| §6 plan and lifecycle bullets | §6 cases 1–13 | rule IDs added |
| §6 billing bullets (fallback, rejection, reconcile, media estimate and settlement, maximum, mixed reservations, overrun stop, Dollar media confirmation, gross key cost, window vs media) | SPEC_BILLING §7 cases 1–3, 5–6, 9–12 | cited; "text windows do not block media" moved into BIL case 11 |
| §7 | §7 | 90% threshold now cites BIL-R11 |
| §8 Product offer bullets 2–4 | SUB-R10, R27, R02 | merged |
| §8 Launch pricing test and launch rule | SUB-R28 | formula verbatim |
| §8 PAYG margin paragraph | SUB-R27 | merged |
| §8 Revenue and reporting bullets 1–3 | SUB-R29 | merged |
| Economics design "Approval checks" bullets 2–4 | SUB-R30 | **restored** |
| Economics design "Open parameters" | §8 Open parameters | **restored** |
| Economics design version row (2026-11-04) | Version history | **restored** |

**Rules without their own acceptance case:** SUB-R01 (scope), R14 and R27–R30 (pricing approval process, verified by finance sign-off rather than product tests), R25 (covered by the Dollar top-up path in SPEC_BILLING).
