# Maxshot Gateway and MAX/AIT — development handoff

**Status:** Canonical entry point, 16 November 2026. Supersedes the former `Tokenomics/AGENTS.md`, `DEVELOPMENT_HANDOFF_INDEX.md`, `RELEASE_SCOPE_MATRIX.md` and `MAXSHOT_Unified_Gateway_App_Decisions.md` (kept in [`archive/`](./archive/)). It assigns document ownership and release order; it does not approve launch economics, deployment or token sale terms.

## 1. What is being built

Maxshot is a multi-model inference Gateway with one customer account for Chat, Studio image/video generation, API and external-agent calls, provider discovery, funding, subscription allowances, Credits and Usage. For a customer-selected model the Gateway picks the lowest quoted provider cost among qualified offerings, authorizes a hard maximum charge before dispatch, meters the actual serving offering and settles the account once. An unpinned request may use at most one same-model fallback after a pre-output failure; a pinned offering never falls back. Customers can use the Gateway without holding MAX or AIT.

`gateway.maxshot.ai` is the single application. The former `app.maxshot.ai` Mint, Dashboard, Staking, Markets and Agents Factory portals are retired. Vaults keep their existing deposit/withdrawal contracts and move under the unified account. Unified sidebar: **Portfolio, Chat, Studio, Credits, Tokens, Providers, Vaults, Referrals**. Tokens opens MAX & AIT; API keys live in Profile → Developer settings; Usage lives in Credits. Starters and Playground stay hidden.

Three instruments, summarized (full rules in [`SPEC_TOKEN.md`](./SPEC_TOKEN.md)):

| Item | Role | Boundary |
| --- | --- | --- |
| **MAX** | Fixed 1B supply, fully minted on Ethereum at genesis into purpose-specific custodian wallets; LayerZero routes among Ethereum, Base, Arbitrum One, Robinhood Chain. Any transferable MAX can be locked on Ethereum to mint AIT. | Bridging moves existing supply; MAX must return to Ethereum before minting. |
| **AIT** | 18-decimal token minted against locked MAX on a curve; Genesis outstanding cap 50,000 (proposed). Stake on Ethereum to accrue AIT Earned Credit in a funded term; burn against the controller's merged position to start a 7-day MAX redemption. | Not cash-redeemable, not a stablecoin, not a Treasury claim. Ethereum-only at launch. |
| **AIT Earned Credit** | Off-chain Gateway Credit bucket granted weekly from finalized staking time during a prefunded term; each grant expires 7 days after issue. | Not an ERC-20. No unfunded or perpetual entitlement. |

Dollar balance (user-funded USD) and the Credit buckets (AIT Earned Credit, Basic-chat allowance, Premium allowance, Free Credits, Referral Credits) are separate ledgers. Naming rules in §5.

## 2. Releases and build order

Release names express dependency order, not dates or authorization to deploy. Decided in [DECISIONS.md TD-43](./DECISIONS.md).

| Order | Workstream | Release | Depends on | Owning spec |
| --- | --- | --- | --- | --- |
| 1 | Catalog read snapshot: admitted offerings, rate cards, availability (B1) | Foundation | — | [SPEC_PROVIDERS](./SPEC_PROVIDERS.md) |
| 2 | Authorize → reserve → dispatch → settle → reverse with Dollar balance and subscription buckets (B2) | Foundation | 1 | [SPEC_BILLING](./SPEC_BILLING.md) |
| 3 | Provider admission packet and two-offering same-model routing proof (B4) | Foundation | 1, 2 | [SPEC_PROVIDERS](./SPEC_PROVIDERS.md) |
| 4 | External-agent path: scoped key, discovery, funded call, Usage match | Foundation | 2 | [SPEC_AGENT_INTEGRATION](./SPEC_AGENT_INTEGRATION.md) |
| 5 | Vault wallet-only exit, account link, Portfolio, old-URL redirects (B3) | Unified app | 1 for Portfolio balances only | [SPEC_ACCOUNT_VAULT](./SPEC_ACCOUNT_VAULT.md) |
| 6 | Ethereum contracts: MAX genesis, bridge, merged position, HWM, burn/pending (B5 §1) | MAX/AIT | none; audit gate | [SPEC_TOKEN](./SPEC_TOKEN.md) |
| 7 | Staking index and wallet attribution (B5 §2) | MAX/AIT | 5, 6 | [SPEC_TOKEN](./SPEC_TOKEN.md) |
| 8 | AIT Earned Credit grants; AIT bucket added to the B2 spend order (B5 §3) | MAX/AIT | 2, 7, funded-term inputs | [SPEC_TOKEN](./SPEC_TOKEN.md), [SPEC_BILLING](./SPEC_BILLING.md) |

Rules: every Foundation proof passes with the AIT bucket absent; adding it in step 8 changes only hold/spend order. Contract work starts now; economic sign-off (curve, cap, genesis manifest, reserve) is a launch gate, not a development gate. Admin write actions ship in the same release as the proof they support ([SPEC_ADMIN](./SPEC_ADMIN.md)).

Later scope, not in these releases: Auto model selection ([reference](./reference/AUTO_MODEL_ROUTING_DESIGN.md)), managed Agent objects / Agent Wallet / Agent Factory, MCP surface, AIT cross-chain transfer, wallet relink, Provider Tokens and PT/MAX trading, new referral campaigns, Studio public links and Starters.

## 3. Document map and precedence

Read a document as authoritative **for its subject**. Where a later explicit decision changes an older clause, the decision applies to that clause only. If a spec and `DECISIONS.md` disagree, or two specs disagree, raise it with product before building; record the resolution in `DECISIONS.md`. Never silently pick the newest file.

**Engineering owns** schemas, storage, endpoint paths and field names, internal identifiers, contract interfaces, service boundaries and test tooling, within the behavior these specs define. A change to behavior, user rights, formulas or acceptance cases needs a new TD entry.

| Subject | Owning document | Notes |
| --- | --- | --- |
| Decisions, overrides, gap register | [DECISIONS.md](./DECISIONS.md) | TD-01…TD-56. The single override record. |
| MAX/AIT contracts, positions, staking, Earned Credit grants, chain scope | [SPEC_TOKEN.md](./SPEC_TOKEN.md) | Includes exact integer mint quote and B5 acceptance. |
| Request authorization, funding buckets, API keys, settlement, refunds, media jobs | [SPEC_BILLING.md](./SPEC_BILLING.md) | Includes funding eligibility matrix, key policy, request ID and B2 acceptance. |
| Provider admission, catalog, routing, pricing display | [SPEC_PROVIDERS.md](./SPEC_PROVIDERS.md) | Includes B1 data contract and B4 acceptance. |
| Account, wallet link, Portfolio, Vaults, Referrals, migration | [SPEC_ACCOUNT_VAULT.md](./SPEC_ACCOUNT_VAULT.md) | Includes B3 acceptance. |
| External-agent integration guide | [SPEC_AGENT_INTEGRATION.md](./SPEC_AGENT_INTEGRATION.md) | Product-owned; engineering fills verified values. |
| Admin and operations surfaces | [SPEC_ADMIN.md](./SPEC_ADMIN.md) | Read-only phase 1 plus write actions by release. |
| Subscription plans, lifecycle, allowances, pricing rule | [SUBSCRIPTION.md](./SUBSCRIPTION.md) | |
| Placeholder launch parameters for fixtures and tests | [LAUNCH_CONFIG_V0.md](./LAUNCH_CONFIG_V0.md) | Every value marked not approved. |
| Chat, API, Studio behavior outside the above | [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md), [MAXSHOT_STUDIO_PRD.md](./MAXSHOT_STUDIO_PRD.md) | Superseded sections carry inline override banners. |
| Frontend prototype | [../frontend/AGENTS.md](../frontend/AGENTS.md), [../frontend/TOKEN_UI_REFERENCE_MAP.md](../frontend/TOKEN_UI_REFERENCE_MAP.md) | Simulation only. |

`reference/` holds context that is not a rule: the read-only token source PRD and marketing deck (do not edit), the tokenomics economic companion, the one-pager and the Auto routing pilot design. `archive/` holds the documents merged into the specs above; they are kept for history and are not authoritative.

## 4. Explicitly superseded clauses

| Earlier clause | Current rule |
| --- | --- |
| Gateway baseline §6 and Gateway PRD §10: Chat, Dashboard, API, Credits, Referral, Profile navigation; visible Agents/Toolkits | Unified sidebar in §1. API keys in Profile → Developer settings; Usage in Credits. |
| Gateway baseline §8: tokens, trading, deposits and on-chain accounting excluded | Unified app includes Vaults and a gated MAX/AIT area under SPEC_TOKEN and SPEC_ACCOUNT_VAULT. |
| Studio PRD §P0.6 and §10: standalone Pricing item | Providers → Models & Pricing owns rate comparison; Credits may link there. |
| Studio PRD §P0.6: model-level headline price | Compare complete customer rate cards per offering; the server quote and authorized maximum govern a request. |
| Older Gateway/Studio estimate-only and media-shortfall wording | TD-39 hard maximum rule in SPEC_BILLING. |
| Source PRD Agent Wallet / one-Agent-per-account | TD-24: external-agent integration path only; managed Agent product deferred. |
| Routing design "do not add a separate provider selector" | TD-48: provider pin available in Chat, Studio and API. |
| Handoff index "request identity is a development suggestion" | TD-46: stable request ID is a product requirement. |

## 5. Ledger naming

- **Dollar balance (USD):** user-funded value from confirmed top-ups. Older documents say *Paid Credit* or *Paid balance*; those are aliases, not another bucket. Pays PAYG charges or a full subscription payment.
- **Credits:** integer off-chain allowances: **AIT Earned Credit**, **Basic-chat allowance**, **Premium allowance**, **Free Credits**, **Referral Credits**. The older *Earned Compute Credit* label is AIT Earned Credit. A new campaign must name and fund its own bucket.
- Credit unit: 1,000,000 Credits = $1, as in the live Gateway (TD-53). A versioned rate is stored with every conversion.

## 6. How an agent or engineer should work here

1. **Locate the owning rule** in §3, then the relevant decision in DECISIONS.md. Distinguish confirmed behavior from proposed economics and operational inputs; the read-only source PRD still supplies requirements that later decisions have not superseded.
2. **State the task and its success check.** For a UI change, name the screen and rule it must show. For implementation, name the acceptance case in the owning spec and the evidence required. Resolve real product ambiguity with the product owner; leave schema and routine engineering choices to the team.
3. **Make a narrow change.** Keep the shared catalog, Credit naming and authorized-maximum rules consistent across Providers, Chat, Studio, Credits and API. Do not replace the Vault transaction flow or add a managed Agent product.
4. **Verify at the right boundary.** Prototype: `npm run build` in `frontend/` and inspect the screen. Contracts/backend: the integer vectors in SPEC_TOKEN and the live proofs in each spec's acceptance section. Report what remains unverified.
5. **Update the owning document when a decision changes**, add a TD entry, and keep this README's map current. One source of truth per subject.

## 7. Current state (16 November 2026)

Requirements, design and the labeled UI prototype are ready for scoped development. Acceptance cases exist for every workstream in §2; none of the live Gateway, provider, Vault, wallet, contract or Credit-ledger proofs has been verified in this repository. Deployment economics, legal/security approvals and provider/program configuration remain separate release gates. The repository's `frontend/` is a React/Vite simulation: browser token actions mutate local sample state; sample rates, quotes and Usage records prove nothing about production.
