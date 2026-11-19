# LAUNCH_CONFIG_V0 — launch parameters and placeholders

**Status:** Mixed decided values and placeholders, v0.2, 18 November 2026 (TD-53/77). Each row labels its approval status. Placeholder values are for fixtures, acceptance tests and the prototype; they are not approved launch parameters. When a placeholder is approved, bump this file's version and record the decision source.

| Parameter | v0 value | Status | Owner of the real value | Used by |
| --- | --- | --- | --- | --- |
| Credits per USD | **1,000,000 Credits = $1** (1 Credit = $0.000001), rational `N/D = 1,000,000/1`. A funded AIT term may still lock its own versioned rate. | Decided (TD-53; live Gateway unit) | — | SPEC_BILLING §1, SPEC_TOKEN §4.2, prototype fixtures |
| Funded AIT Earned Credit term | 90 days | Placeholder | Founder (proposed in source PRD) | SPEC_TOKEN §4.2 |
| Base accrual | **$12 per eligible staked AIT-year**; exact annual coefficient `A_num/A_den = 12/1` USD per AIT per 365-day year | Decided (TD-77, corrected) | — | TOK-R23, TOK-R25 |
| AIT Earned Credit catalog set | `catalog_text` only | Placeholder | Product + finance | SPEC_BILLING §2 |
| Model catalogs at launch | `catalog_text`, `catalog_image`, `catalog_video` (Basic/Premium is a model label, not a catalog) | Decided (TD-23/41) | — | SPEC_PROVIDERS §2, SPEC_BILLING §2 |
| Minimum usable models per enabled catalog | 5 | Decided (TD-41) | — | PRV-R30 |
| Key default daily / monthly budget | $20 / $200 | Placeholder | Product | SPEC_BILLING §3 |
| Key default allowed catalogs | none (owner must select) | Placeholder | Product | SPEC_BILLING §3 |
| Key default Dollar spend | off | Decided (TD-44) | — | SPEC_BILLING §3 |
| Media uncertain-job grace | provider's declared max job time + 15 min | Placeholder (15 min) | Engineering | SPEC_BILLING §5 |
| Hold auto-release | 24 h after dispatch | Decided (TD-49) | — | SPEC_BILLING §5 |
| Pending video jobs per account | 3 | Decided (existing Studio limit) | — | SPEC_BILLING §5 |
| Provider health backoff | remove from routing after 5 consecutive 5xx/timeouts in 10 min; re-probe every 5 min | Placeholder | Operations | PRV-R27 |
| Performance display sample minimum | 100 dispatched attempts in a 7-day window | Placeholder | Operations | PRV-R34 |
| Per-offering provider-cost ceiling | 1.5 × the offering's published customer rate | Placeholder | Finance | PRV-R21, PRV-R24 |
| Subscription plan prices, allowances, windows | as in the current live subscription configuration | Existing configuration; verify values | Commercial | SUBSCRIPTION |
| AIT Genesis outstanding cap and curve | 50,000 AIT; `R(s) = 600[1 + 2(s/C)²]` (proposed, DEC-04 sign-off pending) | Placeholder | Founder/quant | SPEC_TOKEN §2–3 |
| MAX genesis sale | 50,000,000 MAX at $0.10 | Decided (TD-09; execution pending) | Commercial | SPEC_TOKEN §6 |
| Maxshot referral reward rate and cap | None approved. Historical context only: the earlier Gateway PRD default was 10% of the confirmed top-up, capped at $50 per referred user; the live referral page showed 1% when captured | Pending commercial approval | Commercial | ACC-R14 |

Rules: a fixture that needs a value not listed here adds a row to this file rather than hard-coding one. Prototype code references these values by name in one place (`frontend/src/data/launchConfig.js`, created under TD-54). Acceptance tests that depend on a placeholder state that dependency in their description.
