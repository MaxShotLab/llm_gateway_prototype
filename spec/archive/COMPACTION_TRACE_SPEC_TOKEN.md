# Compaction trace — SPEC_TOKEN (16 November 2026)

Every normative statement in the pre-compaction `SPEC_TOKEN.md` (commit `ba49eda`) maps to one rule below. State, mint, burn, invariant and integer-quote blocks and all reference vectors are copied verbatim (checked by script). The grant formula uses a locked rational term parameter in place of the proposed literal `12`; the `12/1` example and vectors retain the same arithmetic. New behavior: TD-60 and TD-61, decided in review. Size: 29.0 KB → 21.5 KB before this clarification.

**Section renumbering:** old §5 (feature tables) dissolved into rules; old §6 Live proof → §5 Acceptance (§6.1–6.3 → §5.1–5.3); new §6 Inputs and out of scope; §7 Terms unchanged. `SPEC_ADMIN` and `LAUNCH_CONFIG_V0` references updated.

| Old location | Statement (abridged) | New rule | Note |
| --- | --- | --- | --- |
| §1 bullet 1; §5.1 AIT chain scope | Ethereum hosts genesis, position, HWM, lock, mint/burn, redemption, staking | TOK-R01 | merged |
| §1 bullet 2; §5.1 MAX cross-chain; §6.1 MAX movement | MAX decimals, four-chain LayerZero, return to Ethereum | TOK-R02 | merged |
| §1 bullet 3; §2.1 AIT bridging paragraph; §5.1 AIT chain scope | AIT Ethereum-only; future bridging not redemption | TOK-R03 | merged |
| §1 bullet 4; §6.3 intro | Earned Credit is off-chain | TOK-R04 | merged |
| §1 bullet 5; §5.1 pause row; §6.1 pause row | Pause controls | TOK-R05 | merged |
| §1 references; §2.1 references | LayerZero and Robinhood links | §6 References | merged (stated twice) |
| §2.1 state block | State | §2.1 block | verbatim |
| §2.1 genesis paragraph; §5.1 primary distribution; §6.1 genesis | 1B genesis, manifest, no later mint, conservation | TOK-R06 | merged |
| §5.1 primary distribution; §6.1 custody | Restricted custody; Treasury receipts separate | TOK-R07 | merged |
| §5.1 primary distribution; §6.1 mint quote | Any transferable MAX, no provenance | TOK-R08 | merged |
| §2.1 P/ratio paragraph; §5.1 position ledger; §6.1 merged position | Merged position, ratio, events retained | TOK-R09 | merged |
| §2.2 block + example; §5.1 curve mint, remint protection; §5.1 approved quote rule | Curve, HWM refill, cap, slippage, deadline | TOK-R10 | merged; block verbatim |
| §2.3 block; §2.3 trailing para; §5.1 closeout; §6.1 burn; §6.2 unstake-before-burn | Burn rules | TOK-R11 | merged |
| §2.3 block; §5.1 redemption wait; §6.1 burn | Pending reset and withdrawal | TOK-R12 | merged |
| §2.3 trailing para | AIT fungible; claim stays with controller; no liquidation | TOK-R13 | no-liquidation from DECISIONS "source requirements still in force" |
| §2.4 block; §6.1 reconcile paragraph | Invariants after every transition | TOK-R14 | merged; block verbatim |
| §2.4 test list; §6.1 reconcile paragraph | Market-bought AIT is not debt retirement | TOK-R15 | merged |
| §2.4 test list | Minimum test list | §5.1 rows | each item now in a §5.1 case |
| §3 | Integer quote, one rounding | TOK-R16 | block and vectors verbatim |
| §3; §6.1 mint quote | Same result in contract, backend and UI | TOK-R17 | merged |
| §4.1; §4.2 first sentences; §5.1 wallet row; §6.2 intro | One linked wallet, SIWE/ERC-1271, no relink | TOK-R18 | merged (four copies) |
| §4.1; §6.2 intro | Controller signs; direct unstake | TOK-R19 | merged |
| §4.2 para 1; §5.1 stake row; §6.2 stake row | Staking, no warm-up, unstake stops accrual, unstake before burn | TOK-R20 | merged |
| §6.3 program boundary ("eligible linked staking time") | Pre-link time | TOK-R21 | ambiguity resolved by TD-60 |
| §4.2 finality rule | Finality | TOK-R22 | |
| §5.2 funded program, base accrual; §6.3 closing para | Funded term, rate, catalog set, reserve, coverage | TOK-R23 | merged |
| §4.2 para 1; §5.2 grant lifecycle; §6.3 intro | Shared seven-day boundaries, auto-post, expiry | TOK-R24 | merged |
| §4.2 TD-40 block and paragraph; §5.2 base accrual; §6.3 para 2 | Cumulative integer grant | TOK-R25 | merged; proposed `12` replaced by the locked `A_num/A_den` term parameter; vectors unchanged |
| §4.2 para 1 (spend, refund); §5.2 spend protection, refund; §6.3 eligibility, reservation rows | Spend and refund | TOK-R26 | cites BIL-R06, R08, R28, R42; "other portions follow their own terms" replaced by TD-57 via BIL-R42 |
| §5.1 stake and term display; §4.2 finality UI sentence; DECISIONS TD-07 | Position and staking display | TOK-R27 | TD-07 UI rule now in the spec |
| §5.2 separate balances | Separate ledgers | BIL-R02 | cited by SPEC_BILLING; not restated |
| §5.2 optional bonus | MAX Boost Bonus Pool | §6 Out of scope | moved to later release by TD-61 |
| §6.1–6.3 tables | Live proof | §5.1–5.3 | rule IDs added; pre-link row added for TD-60 |
| §6 intro; §6.3 prototype limit | Prototype limit, screenshots cannot close | §5 intro, §6 | |
| §7 | Terms | §7 | unchanged |

**Rule without its own acceptance row:** TOK-R04 (definition).
