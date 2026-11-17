# Compaction trace — SPEC_BILLING (16 November 2026)

Every normative statement in the pre-compaction `SPEC_BILLING.md` (commit `ba49eda`) and in `SUBSCRIPTION.md` §4.3–4.5 maps to one rule below. "Merged" means two or more statements said the same thing and the most specific wording, or the governing TD's wording, was kept. No behavior was added except TD-57 (decided in review) and its acceptance case 12.

| Old location | Statement (abridged) | New rule | Note |
| --- | --- | --- | --- |
| BILLING §1 bullet 1 | Dollar balance from crypto deposits; pays PAYG and subscriptions | BIL-R01 | |
| BILLING §1 bullet 2 | Credit buckets, integer, not cash; unit 1,000,000/$1 | BIL-R02, R03 | split |
| BILLING §1 bullet 3; SUB §4.5 bullets 1–3 | Integer cents/micros, no float; store rate + rounding version | BIL-R04, R05 | merged |
| SUB §4.3 item 10 | Store plan, price, limit, rate versions | BIL-R05 | merged |
| BILLING §2 table + intro | Eligibility matrix, catalog/label definitions | BIL-R06 | |
| BILLING §2 "Engineering must verify Free/Referral…" | Live verification of promo scope | §8 Open items; acceptance 10 | |
| SUB §4.3 item 1 | Plan-ineligible request may use PAYG | BIL-R07 | |
| BILLING §2 spend order; SUB §4.3 items 3–4 | AIT → Basic → Premium → Free → Referral → Dollar | BIL-R08 | merged |
| BILLING §2 windows sentence; SUB §4.3 item 3 | Only allowance portion consumes windows; AIT-only untouched; media uses job limits; API key may consume windows | BIL-R09 | merged |
| BILLING §2 exhaustion sentence; SUB §4.3 item 9 | Basic exhaustion → Premium; window exhaustion skips allowances; stop at 100%; show transition | BIL-R10 | merged; SUB item 9 said "Chat" only, TD-47 adds API text |
| SUB §4.3 item 9 | 90% warnings; Premium % includes Pending holds | BIL-R11 | |
| BILLING §3 table rows | Catalogs, ceiling, budgets, funding, expiry, state, attribution | BIL-R12–R17 | |
| SUB §4.3 items 5, 8 | PAYG fallback doesn't bypass key limits; gross cost counts regardless of source | BIL-R14 | merged |
| SUB §4.3 item 4 (Dollar opt-in sentence) | Key Dollar spend opt-in for every request type | BIL-R15 | merged |
| BILLING §3 "Out of scope" | No per-key balance, key windows, allowance toggle | §8 Out of scope | |
| BILLING §4 Request ID paragraph; "request ID above is required…" | Request ID before dispatch, everywhere | BIL-R18 | merged |
| BILLING §4 table "Select"; acceptance 4 (versions) | Resolve model, catalog, offerings; freeze versions | BIL-R19 | merged |
| BILLING §4 Provider pin paragraph | Selector, `offeringId`, reject if ineligible | BIL-R20 | |
| BILLING §4 "Quote and authorize"; SUB §4.3 item 2 | Estimate + hard maximum incl. backup rate; media settings | BIL-R21 | merged |
| BILLING §4 "Quote and authorize" (display); SUB §4.4 "estimate and maximum per component" | Chat/Studio disclosure; API single call | BIL-R22 | merged |
| SUB §4.3 item 4 (media UI confirmation) | Studio Dollar debit needs confirmation | BIL-R23 | |
| BILLING §4 rejection set; SUB §4.3 item 5 | Pre-dispatch rejection codes, no debit, no ID | BIL-R24 | merged |
| BILLING §4 "Reserve"; SUB §4.3 items 2, 4 | Hold full maximum in order; no negative or unapproved source | BIL-R25 | merged |
| BILLING §4 "Dispatch and fallback" | One same-model backup, pin never falls back, no retry after output | BIL-R26 | |
| BILLING §4 "Settle"; SUB §4.3 items 2, 7; BILLING §6 last sentence | Serving rate, cap at maximum, discrepancy, stop output | BIL-R27 | merged |
| BILLING §4 "Settle"; BILLING §6 first sentence; SUB §4.3 item 7 | Release unused holds to original sources/expiry | BIL-R28 | merged |
| BILLING §4 "Settle" (provider cost); "prompt and output content…"; SUB §4.3 item 8 (native unit) | Separate provider cost; native unit; no content | BIL-R29 | merged |
| SUB §4.3 item 7 "reconcile once, show adjustment"; acceptance 4 | Charge once; duplicates no second debit | BIL-R30 | merged |
| BILLING §4 "Settle" evidence column; "product acceptance…" | Usage detail fields | BIL-R31 | merged |
| BILLING §5 states; SUB §4.4 Studio labels | States and label mapping | BIL-R32 | merged |
| BILLING §5 `delivered`; SUB §4.4 partial, preprocessing, cancel; SUB §4.3 item 7 | Delivered/partial/preprocessing/cancel rules | BIL-R33 | merged |
| BILLING §5 `failed` | Failure before output | BIL-R34 | |
| BILLING §5 `uncertain` | Uncertain definition and queue | BIL-R35 | |
| BILLING §5 auto-release; SUB §4.4 "Pending needs reconciliation before release" | 24-hour auto-release | BIL-R36 | SUB §4.4 sentence superseded by TD-49 |
| BILLING §5 admission paragraph | Job time + grace < 24 h | BIL-R37 | also in SPEC_PROVIDERS §1 |
| BILLING §5 customer view; SUB §4.4 Pending; SUB §4.3 item 6 | Pending with held amount; across period boundary | BIL-R38 | merged |
| BILLING §5 idempotency; SUB §4.4 idempotency | Idempotent by job ID; no late double charge | BIL-R39 | merged |
| BILLING §5 last sentence; SUB §4.4 last two sentences | 3 Pending videos; no image cap | BIL-R40 | merged |
| SUB §4.5 media job record bullet | Media job record fields | BIL-R41 | |
| BILLING §4 "Reverse"; BILLING §6 | AIT new 7-day grant, Dollar to balance | BIL-R42 | merged; "other buckets per their own terms" replaced by TD-57 |
| BILLING §7 cases 1–10 | Acceptance | §7 cases 1–10 | text kept; rule IDs added. Added in review: case 3 checks Studio Dollar confirmation (BIL-R23); case 9 checks rejection of a fourth Pending video (BIL-R40) |
| SUB §6 bullets on 90% warning, Basic → Premium, window fallback | Acceptance | §7 case 11 | restated from SUB §6 |
| — | Refund portions, including lapse after the original period or expiry | §7 case 12 | new, from TD-57 |
| BILLING §8 | Prototype evidence | §9 | |

**Also corrected in `SUBSCRIPTION.md` §6** (already-decided rules, wording only): Dollar spend opt-in applies to every API request type (TD-56); Basic Credits fund Basic-labeled API text (TD-47).

**Rules without a dedicated acceptance case:** BIL-R01–R05, R07 (definitions and storage; proven by the funded-request and reconciliation evidence), R22 (UI disclosure; also SUB §6), R29, R32, R41. R23 is tested in case 3 and R40 in case 9 (added in review). Add cases only if engineering wants them.
