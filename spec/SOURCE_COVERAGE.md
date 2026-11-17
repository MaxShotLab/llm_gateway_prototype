# SOURCE_COVERAGE — read-only token PRD to canonical rules

**Status:** Canonical coverage matrix, 16 November 2026. Maps every requirement in the read-only source [`reference/MAXSHOT_Tokens_PRD_v1.0(read only).md`](./reference/MAXSHOT_Tokens_PRD_v1.0%28read%20only%29.md) (unchanged) to where it now binds. **The source PRD is reference-only:** a source requirement binds only through the rule, gate or decision listed here. Anything marked Context, Later or Superseded does not bind the current releases.

**Dispositions:** **Rule** — carried into the named canonical rule(s). **Superseded** — replaced by the named decision; the replacement rule binds. **Gate** — a launch gate in SPEC_CROSS_CUTTING §5 or a release input in DECISIONS §3. **Later** — out of scope for the Foundation, Unified app and MAX/AIT releases. **Engineering** — proposed design that engineering owns within the rules (00_README §3). **Context** — explanation, scenario or illustration; no requirement.

## 1. Numbered requirements (source §§10, 13, 14.3, 17)

| Source ID | Disposition | Where it binds |
| --- | --- | --- |
| FR-ID-001 | Rule | Gateway PRD §P0.2 (authentication) |
| FR-ID-002 | Rule | BIL-R12, R16, R43 |
| FR-ID-003 | Rule | BIL-R12–R14, R24 (per agent = per scoped key, TD-24) |
| FR-GW-001 | Rule | PRV-R18, R29; BIL-R22 |
| FR-GW-002 | Rule | Gateway PRD §P0.4; PRV-R06 gate 4 |
| FR-GW-003 | Rule | BIL-R29; PRV-R24, R36 |
| FR-GW-004 | Rule | BIL-R02; XCT-R10 |
| FR-GW-005 | Rule | BIL-R18, R31; PRV-R36; ADM-R11 |
| FR-TOK-001 | Rule + Gate | TOK-R06, R07, R35; XCT-G05. Eligibility registry superseded by TD-10 |
| FR-TOK-002 | Rule | TOK-R08, R10, R16, R17 |
| FR-TOK-003 | Superseded | TD-02 → TOK-R09 (one merged position) |
| FR-TOK-004 | Superseded | TD-03/04 → TOK-R11, R12 |
| FR-TOK-005 | Rule | TOK-R10, R14 |
| FR-TOK-006 | Superseded | TD-10 → TOK-R07 (custody controls instead of mint eligibility) |
| FR-TOK-007 | Rule | TOK-R27, R28 (TD-66: average MAX per AIT replaces implied reference cost) |
| FR-TOK-008 | Rule | TOK-R20–R22 |
| FR-TOK-009 | Rule | TOK-R29; acceptance gates accrual (TD-67) |
| FR-TOK-010 | Superseded | TD-11 (position non-transferable); transfer is Later |
| FR-CR-001 | Rule | BIL-R02, R44; TOK-R24, R31 |
| FR-CR-002 | Rule | TOK-R23, R30 |
| FR-CR-003 | Rule | TOK-R23, R25 |
| FR-CR-004 | Rule | TOK-R24, R26; BIL-R06 (no claim step, TD-22) |
| FR-CR-005 | Rule | BIL-R25, R27, R30 |
| FR-CR-006 | Rule | TOK-R30 |
| FR-CR-007 | Later | TD-61 |
| FR-CR-008 | Rule + Later | ADM-R23 (internal, TD-62); public panel Later |
| ACC-001 | Rule + Gate | TOK-R35; XCT-G05 |
| ACC-002 | Rule | XCT-R10, R11 |
| ACC-003 | Rule | TOK-R30; ADM-R23 |
| FR-PR-001 | Rule + Gate | PRV-R06 gate 1; XCT-G02 (KYC/beneficial ownership) |
| FR-PR-002 | Superseded | TD-29 → PRV-R06 gate 4, PRV-R13; continuous benchmarking Later |
| FR-PR-003 | Rule | PRV-R14; ADM-R17 (manual payout, TD-30) |
| FR-PR-004 | Rule + Later | PRV-R32, R34; public rankings Later (TD-35) |
| FR-PT-001 | Later | PRV-R37; DECISIONS §3 (P2) |
| FR-PT-002 | Later | PRV-R37; DECISIONS §3 (P2) |
| FR-PT-003 | Later | PRV-R37; DECISIONS §3 (P2) |
| FR-PT-004 | Rule | TOK-R15 |
| FR-AG-001 | Rule | AGT-R09 |
| FR-AG-002 | Rule | AGT-R02–R04, R10 |
| FR-AG-003 | Later | TD-45; XCT-R08 applies if built |
| FR-AG-004 | Superseded | TD-24 → BIL-R12–R17 (scoped key policy, no Agent Wallet) |
| FR-GR-001 | Rule + Later | ACC-R12 (referral link); attributed landing pages Later |
| FR-GR-002 | Later | Compute Drops and new campaigns (ACC-R11) |
| FR-GR-003 | Rule | ACC-R16 |
| NFR-001 | Rule + Gate | XCT-R09 (availability); numeric targets XCT-G06 |
| NFR-002 | Rule + Gate | XCT-R09 (billing correctness); BIL-R44; numeric targets XCT-G06 |
| NFR-003 | Rule + Gate | XCT-R09 (Credit solvency); TOK-R30; numeric targets XCT-G06 |
| NFR-004 | Rule + Gate | XCT-R09 (traceability); numeric targets XCT-G06 |
| NFR-005 | Rule + Gate | XCT-R09 (latency and cost visibility); numeric targets XCT-G06 |
| NFR-006 | Rule + Gate | XCT-R04; numeric targets XCT-G06 |
| NFR-007 | Rule + Gate | XCT-R09 (localization and accessibility); numeric targets XCT-G06 |
| NFR-008 | Rule + Gate | XCT-R09 (safe deploy and rollback); numeric targets XCT-G06 |
| NFR-009 | Rule + Gate | XCT-R09 (observability); numeric targets XCT-G06 |
| NFR-010 | Rule + Gate | XCT-R09 (disaster recovery); numeric targets XCT-G06 |
| TEST-01 | Gate | XCT-G05 |
| TEST-02 | Rule | TOK-R16 reference vector "Uninterrupted full cap" |
| TEST-03 | Rule | TOK-R10, R16 (inverse of the curve; the ≈36,756.963 AIT figure is illustrative) |
| TEST-04 | Superseded | TD-03 → TOK-R11 (merged position, not original-position pro-rata) |
| TEST-05 | Rule | TOK-R10 |
| TEST-06 | Rule | TOK-R13, R28 |
| TEST-07 | Rule | TOK-R15 |
| TEST-08 | Rule | TOK-R23, R25 ($147,945.21 is the 90-day maximum face-value scenario) |
| TEST-09 | Rule | TOK-R30 |
| TEST-10 | Rule | BIL-R24 |
| TEST-11 | Rule | TOK-R35; XCT-R10 |
| TEST-12 | Rule | XCT-R10, R11 |
| TEST-13 | Later | PT fee allocation |
| TEST-14 | Rule | XCT-R06 |
| TEST-15 | Rule | XCT-R01, R02 |
| TEST-16 | Rule | SPEC_AGENT_INTEGRATION §3 |
| TEST-17 | Rule | PRV-R24, R28; BIL-R27 |
| DEC-01 | Superseded | TD-08 |
| DEC-02 | Gate | XCT-G02, G07; DECISIONS §3 |
| DEC-03 | Superseded | TD-10 |
| DEC-04 | Gate | DECISIONS §3 (P0); XCT-G03, G07 |
| DEC-05 | Superseded | TD-05 |
| DEC-06 | Rule + Gate | TOK-R23 (no perpetual term); DECISIONS §3 |
| DEC-07 | Gate | TOK-R23 proposed rate; LAUNCH_CONFIG_V0 placeholder |
| DEC-08 | Gate | DECISIONS §3 (catalog set and cost caps) |
| DEC-09 | Rule + Gate | TOK-R30; DECISIONS §3 |
| DEC-10 | Gate | XCT-G03, G05 |
| DEC-11 | Later | TD-61 |
| DEC-12 | Later | TD-61 |
| DEC-13 | Later | DECISIONS §3 (P2) |
| DEC-14 | Later | DECISIONS §3 (P2) |
| DEC-15 | Rule | TOK-R15 |
| DEC-16 | Superseded | TD-15, TD-19, TD-57 |
| DEC-17 | Rule + Gate | PRV-R06 gate 1; DECISIONS §3 |
| DEC-18 | Superseded | TD-06, TD-12, TD-13 |
| DEC-19 | Superseded | TD-63 → TOK-R36 |
| DEC-20 | Rule | XCT-R01 |
| DEC-21 | Later | Old asset-management product not a dependency; existing Vaults per ACC-R02 |
| DEC-22 | Rule | AGT-R09, TD-45 |
| ACC-/SEC-/ECON- family (Appendix C) | — | Covered by the rows above and §2 |

## 2. Unnumbered requirements by section

| Source section | Disposition | Where it binds |
| --- | --- | --- |
| §1.1–1.2 Product definition, objectives | Context | 00_README §1 |
| §1.3 Non-goals | Rule | XCT-R12 (claims), TOK-R32, XCT-R01 (no agent cash withdrawal); Gateway usable without tokens: 00_README §1, AGT-R10 |
| §1.4 Positioning | Context | — |
| §2.1 User groups; §2.3 journeys | Context | Covered by the specs' rules |
| §2.2 Navigation | Superseded | 00_README §1 (unified sidebar) |
| §3.1 Token roles | Rule | SPEC_TOKEN §7 |
| §3.2 Genesis table and funding rule | Rule + Gate | TD-08/09; TOK-R07, R35; FDV, 15% and 80% figures are Context (XCT-G03); investor risk XCT-G02 |
| §3.3 Financial flows | Context | — |
| §4.1–4.3 Unit, curve, HWM | Rule | TOK-R10, R16 (TD-05 exact refill) |
| §4.4 Position and debt model | Superseded | TD-01–04 → TOK-R09–R12 |
| §4.5 Mint controls | Rule | Source TOK-R08 (TD-10); cap TOK-R10; capital sufficiency XCT-G03; mint speed TOK-R34; pause TOK-R05, R34; quote transparency TOK-R28 (implied reference cost superseded by TD-66); restrictions TOK-R07; curve updates TOK-R33 |
| §4.6 Market dynamics | Rule + Context | TOK-R35; XCT-R10; remaining text Context |
| §5.1 User-facing unit | Rule | TOK-R23, R29; warm-up superseded by TD-14 |
| §5.2 Genesis obligation, 90-day program | Rule | TOK-R23, R29, R31 |
| §5.3 Funding and reserve controls | Rule | TOK-R30; BIL-R02; XCT-R10 |
| §5.4 Capital allocation scenario | Context | XCT-R12 (honest disclosure) |
| §5.5 Granting, debiting, expiry | Rule | TOK-R22, R31; BIL-R25–R28; spend order superseded by TD-15 |
| §5.6 Bonus pool | Later | TD-61 |
| §5.7 AIT for immediate payment | Rule + Later | TOK-R32; swap top-up Later |
| §6.1 Accounting principles | Rule + Gate | XCT-R10; XCT-G04 |
| §6.2, §6.4 Ledger and provider examples | Context | — |
| §6.3 Reporting dimensions | Rule | XCT-R11 |
| §7.1–7.4 ROI analysis | Context | — |
| §7.5 Economic simulator | Gate | XCT-G03 |
| §8.1 Gateway experience | Rule | PRV-R23 (deterministic routing), PRV-R29 and BIL-R22 (prices, estimates), BIL-R12–R14 (budgets), BIL-R02 (paid vs earned); playground and model details: Gateway PRD |
| §8.2 Provider marketplace | Rule + Superseded | PRV-R06 (eligibility, benchmark at admission, TD-29), PRV-R13 (staged traffic), PRV-R21, R23 (routing factors as gates and cost), XCT-R10 (provider economics); full onboarding state machine superseded by TD-29 |
| §8.3–8.4 PT market and fee split | Later | PRV-R37; buyback handling TOK-R15 |
| §9.1 Agent onboarding | Rule + Superseded | AGT-R02–R04, R09, R10; Agent Wallet superseded by TD-24 |
| §9.2 Referral surfaces | Rule + Later | ACC-R12–R16; XCT-R06; Compute Drops and share pages Later |
| §9.3 Proposed programs | Rule + Later | ACC-R11 (Maxshot and Partner programs); others Later |
| §11.1–11.5 Architecture, modules, services, interfaces, events | Engineering | 00_README §3; principles carried: off-chain deterministic hot path (PRV-R23), double-entry money movement (BIL-R44), off-chain Credit ledger (TOK-R04), finality-aware indexer (TOK-R22) |
| §12.1 Agent risk tiers | Rule | XCT-R01 |
| §12.2 Contract attack categories, audit gate | Gate | XCT-G01; invariants TOK-R14, R33 |
| §12.3 Off-chain and agent security | Rule | XCT-R02, R04–R08; BIL-R43 |
| §12.4 Legal dependencies | Gate | XCT-G02; prohibited claims XCT-R12 |
| §12.5 Risk register | Context | Controls carried by the rules cited above |
| §13 NFRs and baselines | Rule + Gate | XCT-R09; XCT-G06 |
| §14.1 Contract invariants | Rule | TOK-R10, R11, R14, R15, R33; "authorized lots" superseded by TD-10; fee-distribution invariant Later (PT) |
| §14.2 Credit and finance invariants | Rule | TOK-R25, R31, R35; BIL-R28, R30; XCT-R10; ACC-R16 |
| §14.4 Documentation acceptance | Rule | XCT-R03, R12; AGT-R09 |
| §15 Phases and exit gates | Superseded + Gate | Build order TD-43 (00_README §2); exit evidence XCT-G01–G08 |
| §15.1 Definition of Done | Rule | XCT-R03 |
| §15.2 RACI | Context | Authority limits carried by XCT-R01 |
| §16 KPIs | Rule + Context | XCT-R09 (observability), XCT-R11 (reporting); KPI definitions Context |
| §17 Founder approvals checklist | Gate | XCT-G07 |
| Appendix A Formulas | Rule + Context | TOK-R10, R16, R25; worked examples Context |
| Appendix B Dictionary | Rule | SPEC_TOKEN §7; 00_README §5 |
| Appendix C Engineering checklist | Rule | 00_README §6; XCT-R01, R03; TOK §3 vectors; XCT-G01–G08; AGT-R09 |

## 3. Maintenance

When a decision changes a carried requirement, update the rule and this matrix in the same change. A source requirement that appears nowhere in this file does not bind; if one is found, raise it with product and add a row.
