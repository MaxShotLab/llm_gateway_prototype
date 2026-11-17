# Compaction trace — SPEC_PROVIDERS (16 November 2026)

Every normative statement in the pre-compaction `SPEC_PROVIDERS.md` (commit `ba49eda`), Gateway PRD §P0.7 and Studio PRD §5.3 maps to one rule below. "Merged" means duplicates were collapsed to the most specific or TD-governed wording. New behavior: TD-58 and TD-59 only, both decided in review. Size: 39.5 KB → 29.5 KB.

| Old location | Statement (abridged) | New rule | Note |
| --- | --- | --- | --- |
| §1 para 1 | Launch-ready definition; no portal, benchmark platform, ranking, PT | PRV-R01 | |
| §1 para 2; §1.1 trailing para; §1.3 para 1 | Offering definition; approval per offering; discovery doesn't publish; name ≠ equivalence; readiness flag can't bypass | PRV-R02 | merged (stated three times) |
| §1 para 2; §1.1 last para | One route publishes a model; second preferred | PRV-R03 | merged |
| §1 para 2 | Shared model ID needs verified equivalence | PRV-R04 | |
| §1 para 2; §1.1 last para; §2.2 model row; §7.1 last-offering row | Sole route unavailable → remove, reject, keep history, no substitution | PRV-R05 | merged |
| §1.1 table | Six gates | PRV-R06 | wording tightened; TD-29/30 cited |
| §1.2 para 1 + contract block | Reuse adapter; no new public/self-service API | PRV-R07 | |
| §1.2 para 2 | Streaming/async terminal state; missing usage pending; no content in telemetry | PRV-R08 | |
| §1.2 media paragraph | Media job time + grace < 24 h | PRV-R09 | same rule as BIL-R37 |
| §1.2 upstream paragraph; §1.3 upstream paragraph | Pin upstream endpoint, disable its fallback; otherwise excluded | PRV-R10 | conflict resolved by TD-58 (no launch route until all proofs pass, even when customer-pinned) |
| Studio PRD §5.3 | Media routing layer, not the chat endpoint | PRV-R11 | moved; Studio §5.3 now points here |
| §1.3 table + upstream proof sentence | Evidence packet | PRV-R12 | upstream proof added as a packet row |
| §1.3 para after table | Manual review, limited cohort | PRV-R13 | |
| §1.3 para after table; §1.3 last para; §7.2 duplicate row | First statement reconciled before payout | PRV-R14 | merged (three copies) |
| §1.3 "Platform proof" | Second offering once for shared route | PRV-R15 | |
| §2 owner note; §2.1 para 1 | Gateway owns catalog; one snapshot; server authoritative; price informational | PRV-R16 | merged |
| §2.1 para 2 | Public catalog only admitted; internal data stays internal; prototype pending rows | PRV-R17 | |
| §2.2 table | Entities | PRV-R18 | |
| §2.2 status paragraph | Status fields; only passed/enabled/healthy/eligible offerings route | PRV-R19 | |
| §2.2 money paragraph; §2.3 trailing sentence | Decimal strings, units, null vs zero, "from" not a quote, full conditions | PRV-R20 | merged |
| §2.3 | Snapshot example | §2.3 (example) | unchanged; not a rule |
| §3 item 1; §3.2 item 1 | Hard gates | PRV-R21 | merged; zero-retention routing restriction from Gateway PRD P1.1 named as part of the privacy gate |
| §3 item 2; §3 pin paragraph; §3.2 item 2 | Pin behavior and surfaces | PRV-R22 | merged |
| §3 item 3; §3.1 cost paragraph; §3.2 item 2 | Lowest request-specific quoted cost; tie by offering ID; unknown cost ineligible | PRV-R23 | merged |
| §3.1 exploration paragraph | Spend-capped exploration allocation | PRV-R23 | removed for launch by TD-59 |
| §3 item 5; §3.1 item 1; §3.2 item 3; §7.2 duplicated paragraphs | One same-model backup; triggers; ceilings; attempt IDs; pin never falls back | PRV-R24 | merged (four copies) |
| §3 item 5 (freeze versions) | Freeze offering, rate, ceiling, versions | BIL-R19 | cited, not restated |
| §3.1 item 2 | Cross-model fallback off; future Auto conditions | PRV-R25 | |
| §3.1 item 3 | No retry after output; no resubmit; record attempts and failed-attempt costs | PRV-R26 | |
| §3.1 item 4 | Health backoff | PRV-R27 | |
| §3.2 item 5; §4 refresh paragraph | Changes need review | PRV-R28 | merged |
| §3.2 item 4 | Charge once; provider cost separate | BIL-R30, BIL-R29 | cited, not restated |
| §3 item 4; §3 explanatory paragraph | Auto pilot ranking | §7.3, reference | explanation dropped; Auto remains a reference document |
| §4 table rows 1–4 | Profile, comparison, Models & Pricing, pickers | PRV-R29 | |
| §4 table row 5 (quote and Usage) | Quote, hold, Usage fields | BIL-R21–R22, BIL-R31 | cited, not restated |
| §4 picker row; §7.1 verification | Five usable models per catalog | PRV-R30 | merged |
| §4 refresh paragraph | Coherent refresh by catalogVersion | PRV-R31 | |
| §4.2 para 1 | Providers page ownership | PRV-R32 | |
| §4.2 para 1 (internal measures) | What stays internal | PRV-R33 | |
| §4.2 para 1; §4.2 para 3; §2.2 performance row | Observed performance, Insufficient data | PRV-R34; §7.1 performance display | merged (three copies); dedicated display acceptance added |
| §4.2 "External design reference"; §3.1 intro | OpenRouter references | §9 External references | links kept |
| §4.2 last para; §9 live-enable inputs | Live-enable inputs | §9 Inputs | merged |
| §5 table | Four measures | PRV-R35 | |
| §5 last para | Recomputable records, test call, per-offering floors | PRV-R36 | |
| §6 | Provider Tokens boundary | PRV-R37 | |
| §7.1 table + verification | Catalog transitions | §7.1 | rule IDs and PRV-R34 display acceptance added |
| §7.2 table | Shared routing scenarios | §7.2 | rule IDs added; upstream-router row added for TD-58 |
| B4 "closes only when per-offering packets and shared cases pass" | Closure condition | §7.2 intro | restored; it had been dropped in the first merge |
| §7.3 | Rollout | §7.3 | |
| §8 | Backend checklist | §8 | |
| §9 | Later work, inputs, open parameters, prototype | §9 | |
| Gateway PRD §P0.7 bullets 1, 3–5 and acceptance | Catalog, route/fallback, metering, eligibility, traceable IDs, failover preserves model | PRV-R16–R28, BIL-R18, R24–R31 | moved; P0.7 keeps only the OpenAI-compatible endpoint |

**Rules without their own acceptance row:** PRV-R32–R33 and R35–R37 (display ownership, internal measures, measurement and PT boundary). They are verified through operations reporting and the Providers screens, not a routing case.
