# Compaction trace — SPEC_ACCOUNT_VAULT, SPEC_ADMIN, SPEC_AGENT_INTEGRATION (16 November 2026)

Every normative statement in the pre-compaction files (commit `ba49eda`) and Gateway PRD §P0.8 maps to one rule below. No new behavior. Two dropped items from the first consolidation were restored (marked **restored**).

## SPEC_ACCOUNT_VAULT (10.0 KB → 9.5 KB)

| Old location | New rule | Note |
| --- | --- | --- |
| §1 para 1 | ACC-R01 | |
| §1 para 2; §4 item 2 | ACC-R02 | merged |
| §1 para 3; §3 rows 2–3 and closing para | ACC-R03 | merged (three copies) |
| §1 para 3 (one-wallet); §2 para 1; §2 link-proof para; §3 row 4 | ACC-R04 | merged; link method now cited from TOK-R18 instead of restated |
| §2 para 1 | ACC-R05 | |
| §2 para 2; §4 item 3 | ACC-R06 | merged |
| §3 table | ACC-R07 | |
| §4 item 1 | ACC-R08 | |
| §4 item 2 | ACC-R09 | |
| §4 item 4 | ACC-R10 | |
| §5 table and para 1 | ACC-R11 | |
| Gateway PRD §P0.8 bullets 1–2 | ACC-R12 | moved |
| §5 para 2; TD-42 para; Gateway PRD §P0.8 bullets 3, 8–9 | ACC-R13 | merged |
| §5 para 2; TD-42 para; Gateway PRD §P0.8 bullets 4–6 | ACC-R14 | merged; rate and cap marked pending commercial approval in LAUNCH_CONFIG_V0, with the PRD's 10%/$50 default and the 1% live-page observation kept as historical context (corrected in review) |
| Gateway PRD §P0.8 bullet 7; §5 TD-42 para (admin ledger) | ACC-R15 | merged |
| §6 table | §6 | rule IDs added; referral row added from Gateway PRD §P0.8 acceptance |
| §7 | §7 | 1% observation moved here from §5 |

## SPEC_ADMIN (8.0 KB → 9.0 KB)

| Old location | New rule | Note |
| --- | --- | --- |
| §1 Goal; Existing foundation | Overview; §1 intro | |
| §1.1 bullets 1–2 | ADM-R01 | merged |
| §1.1 bullet 3 | ADM-R02 | |
| §1.1 bullet 4 | ADM-R03 | |
| §1.2 bullets 1–3 | ADM-R04–R06 | |
| §1.3 bullets 1–2; "read per offering" note | ADM-R07 | merged |
| §1.3 bullet 3 | ADM-R08 | |
| §1.4 bullets 1–2 | ADM-R09 | |
| Original admin PRD "Delivery notes" | ADM-R10; observed-exceptions note | **restored**; dropped in the first consolidation |
| Request audit note (TD-44/46) | ADM-R11 | |
| §2 status sentence (audit log) | ADM-R12 | |
| §2 table rows 2.1–2.10 | ADM-R13–R22 | IDs added; row numbers kept for existing references |
| §1 acceptance 1–4 | §3 phase 1, 1–4 | |
| Original admin PRD acceptance 5 (referral trace) | §3 phase 1, 5 | **restored**; dropped in the first consolidation |
| — | §3 phase 1, 6 | checks ADM-R10–R11; restates existing rules as a check |
| §3 | §3 phase 2 | split in review: write actions R13–R19 get the action-and-audit check; views R20–R22 get view checks |

Size grew because of the restored items and the overview. ADM-R06 (on-chain balance summary) has no acceptance case, as in the original admin PRD.

## SPEC_AGENT_INTEGRATION (4.7 KB → 4.6 KB)

| Old location | New rule | Note |
| --- | --- | --- |
| §1 | AGT-R01 | |
| §2 rows 1–6 | AGT-R02–R07 | behavior now cited from BIL-/PRV- rules; `insufficient_funding` explicitly covers "Dollar spend not enabled", which BIL-R24 already groups with insufficient funding |
| §2 row 7 | AGT-R08 | |
| §3 | AGT-R09 | |
| §4 | §3 | rule IDs added |
| §5 | §4 | |

AGT-R01 (boundary) has no acceptance case of its own.
