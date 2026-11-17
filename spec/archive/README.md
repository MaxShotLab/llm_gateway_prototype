# Archive

Documents merged into the canonical `spec/` files on 16 November 2026 (TD-55). They are kept for history only, are **not authoritative**, and their relative links are not maintained. Where each one went:

| Archived file | Now in |
| --- | --- |
| TOKENOMICS_AGENTS.md, DEVELOPMENT_HANDOFF_INDEX.md, RELEASE_SCOPE_MATRIX.md, MAXSHOT_Unified_Gateway_App_Decisions.md | `../00_README.md` (app boundary, account and referral sections also in `../SPEC_ACCOUNT_VAULT.md`) |
| MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md | `../DECISIONS.md` (TD ledger, gaps); `../SPEC_TOKEN.md` (§3 state machine, §5 integer quote, §3.5 grants); `../SPEC_PROVIDERS.md` / `../SPEC_BILLING.md` (§3.6) |
| MAXSHOT_Feature_Requirements_PRD.md | `../SPEC_TOKEN.md` (§4.2–4.3, §5 terms); `../00_README.md` (product definition, journeys summarized) |
| PROVIDER_INTEGRATION_MINIMUM_STANDARD.md, MULTI_PROVIDER_ROUTING_DESIGN.md, PROVIDERS_FRONTEND_DATA_CONTRACT.md (B1), PROVIDER_ADMISSION_ROUTING_HANDOFF.md (B4) | `../SPEC_PROVIDERS.md` |
| REQUEST_AUTHORIZATION_SETTLEMENT_HANDOFF.md (B2) | `../SPEC_BILLING.md` |
| VAULT_ACCOUNT_MIGRATION_HANDOFF.md (B3) | `../SPEC_ACCOUNT_VAULT.md` |
| TOKEN_WALLET_CREDIT_HANDOFF.md (B5) | `../SPEC_TOKEN.md` §6 |
| ADMIN_GATEWAY_EARLY_OPERATIONS_PRD.md | `../SPEC_ADMIN.md` §1 |
| SUBSCRIPTION_FEATURE_REQUIREMENTS.md, SUBSCRIPTION_ECONOMICS_DESIGN.md | `../SUBSCRIPTION.md` |
| llm-gateway-product-baselines.md | Superseded by `../MAXSHOT_GATEWAY_PRD.md` with override banners and `../00_README.md` §4 |
| STUDIO_PRD_P0.6_pricing_page_superseded.md | Moved out of `../MAXSHOT_STUDIO_PRD.md` §P0.6; superseded by TD-34 and `../SPEC_PROVIDERS.md` §4 |
| DECISIONS_full_record_2026-11-16.md | Full wording of TD-01–TD-61 as made, including the prior source wording each replaced; `../DECISIONS.md` is now a one-row-per-decision index |
| COMPACTION_TRACE_*.md | Rule-by-rule traces from the 16 November 2026 compaction of each spec |

**Source coverage pass (16 November 2026).** The read-only token source PRD is reference-only. Each surviving source requirement now binds through a canonical rule, gate or decision listed in `../SOURCE_COVERAGE.md`. The pass added SPEC_CROSS_CUTTING (XCT-R01–R12, XCT-G01–G08), TOK-R28–R36, BIL-R43–R44, ACC-R16, ADM-R23 and AGT-R10, and decisions TD-62 and TD-63. Each new rule restates source wording; no new behavior was added beyond TD-62 and TD-63.
