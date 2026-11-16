# LAUNCH_CONFIG_V0 — placeholder launch parameters

**Status:** Placeholder set v0, 16 November 2026 (TD-53). **Every value below is a placeholder and is not approved.** Its only purpose is to give fixtures, acceptance tests and the prototype one shared set of numbers so teams stop inventing their own. Real values are release inputs owned as listed; when a real value is approved, bump this file's version and record the source.

| Parameter | v0 placeholder | Owner of the real value | Used by |
| --- | --- | --- | --- |
| Credits per USD | **1,000,000 Credits = $1** (1 Credit = $0.000001), rational `N/D = 1,000,000/1`. Matches the live Gateway; **decided** (TD-53), not a placeholder. A funded AIT term may still lock its own versioned rate. | — | SPEC_BILLING §1, SPEC_TOKEN §4.2, prototype fixtures |
| Funded AIT Earned Credit term | 90 days | Founder (proposed in source PRD) | SPEC_TOKEN §4.2 |
| Base accrual | $12/365 per staked AIT per day | Founder (proposed) | SPEC_TOKEN §4.2 |
| AIT Earned Credit catalog set | `catalog_text` only | Product + finance | SPEC_BILLING §2 |
| Model catalogs at launch | `catalog_text`, `catalog_image`, `catalog_video` (Basic/Premium is a model label, not a catalog) | Product | SPEC_PROVIDERS §2, SPEC_BILLING §2 |
| Minimum usable models per enabled catalog | 5 (decided, TD-41) | — | SPEC_PROVIDERS §4.1 |
| Key default daily / monthly budget | $20 / $200 | Product | SPEC_BILLING §3 |
| Key default allowed catalogs | none (owner must select) | Product | SPEC_BILLING §3 |
| Key default Dollar spend | off (decided, TD-44) | — | SPEC_BILLING §3 |
| Media uncertain-job grace | provider's declared max job time + 15 min | Engineering | SPEC_BILLING §5 |
| Hold auto-release | 24 h after dispatch (decided, TD-49) | — | SPEC_BILLING §5 |
| Pending video jobs per account | 3 (existing Studio limit) | Product | SPEC_BILLING §5 |
| Provider health backoff | remove from routing after 5 consecutive 5xx/timeouts in 10 min; re-probe every 5 min | Operations | SPEC_PROVIDERS §3.1 |
| Performance display sample minimum | 100 dispatched attempts in a 7-day window | Operations | SPEC_PROVIDERS §4.2 |
| Per-offering provider-cost ceiling | 1.5 × the offering's published customer rate | Finance | SPEC_PROVIDERS §3.2 |
| Subscription plan prices, allowances, windows | as in the current live subscription configuration | Commercial | SUBSCRIPTION |
| AIT Genesis outstanding cap and curve | 50,000 AIT; `R(s) = 600[1 + 2(s/C)²]` (proposed, DEC-04 sign-off pending) | Founder/quant | SPEC_TOKEN §2–3 |
| MAX genesis sale | 50,000,000 MAX at $0.10 (decided, TD-09; execution pending) | Commercial | SPEC_TOKEN §5.1 |

Rules: a fixture that needs a value not listed here adds a row to this file rather than hard-coding one. Prototype code references these values by name in one place (`frontend/src/data/launchConfig.js`, to be created under TD-54). Acceptance tests that depend on a placeholder state so in their description.
