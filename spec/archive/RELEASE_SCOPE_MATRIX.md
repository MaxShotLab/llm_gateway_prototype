# Maxshot release scope for development handoff

**Status:** Working release-scope record, updated 15 November 2026. It separates an agent-facing integration interface from a managed Agent product. Release names express dependency order, not dates or authorization to deploy.

| Journey or feature | Gateway / subscription foundation | Unified MAX/AIT release | Later scope |
| --- | --- | --- | --- |
| Chat, Studio, API, verified provider routing, Dollar balance and Usage | Core Gateway paths; subscription allowances launch before tokenomics | Continue on the same account, catalog and ledger | Auto model selection is a later pilot |
| Agent-style Gateway integration | Versioned agent-consumable `SKILL.md` and verified setup path for an external agent; scoped credential, model permission, spend cap, funded test call and Usage inspection | Same authorized path may consume eligible AIT Earned Credit when that program is active and funded | Managed Agent objects, Agent Wallet/allocations, templates and Agent Factory require a separate decision; an official MCP surface is not assumed |
| Account and wallet | Gateway account and funding remain | One verified Ethereum wallet may link to one Gateway account; Portfolio combines Gateway, Vault and token summaries | Wallet relinking is not enabled at this release |
| Vault deposits, exits and AIT rewards | Existing Vault product continues | Preserve deposit/withdraw contracts and wallet-only exit for an existing position before account linking; show separate Vault position and 14-day market-bought AIT Merkle claim/history | No new Vault economics from this matrix |
| MAX/AIT and Earned Credit | Token education may be simulated; no active entitlement before funding | Ethereum mint/merged position, stake, burn, seven-day pending MAX withdrawal and approved off-chain Earned Credit program, subject to deployment/funding gates | AIT cross-chain transfer remains disabled initially |
| Maxshot Referrals Program | Existing Gateway referral behavior remains subject to approved terms | Include in unified Referrals page with its own attribution and Credit ledger | New campaigns/Compute Drops require separate funding and terms |
| Partner Referral Program | Existing partner activity remains in its current product until migration | Include in unified Referrals page with separate AIT rewards and partner history | Community Referral Program and Community Rewards remain hidden |
| Provider discovery and pricing | Providers profiles, admission evidence and per-offering customer rate cards; one catalog for pickers and API | Continue under the unified navigation | Provider Tokens and PT/MAX trading require separate rights and launch gates |
| Studio sharing | Existing Studio generation and owned creations continue | Preserve existing behavior during app consolidation | New opt-in public links, curated Starters and creator campaigns follow their separate growth plan |

## Agent integration boundary

An **external agent** is a developer- or creator-operated client of the Gateway. The minimum integration path is the source PRD's versioned `SKILL.md` or equivalent agent-consumable instructions backed by **verified live** URLs, models and authenticated actions. A user creates/revokes a scoped account credential, sets permitted models and a spend limit, funds the account, makes one supported real call, and sees the same request and charge in Usage. This path uses the Gateway's request authorization and account Credit ledger; it does not create a second Agent balance or require a Tokenomics portal.

This matrix does not approve a managed Agent object, a one-Agent-per-account cap, a separate Agent Wallet, an Agent Factory, or an MCP server as a mandatory release feature. Those are distinct product decisions. The read-only token source PRD retains older Agent Wallet language; [TD-24](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md) records the current clarification.

## Acceptance boundary

The Gateway integration path is accepted when a supported external agent follows the published current instructions to authenticate, discover an eligible model, make a funded call within its scoped limit, and match the request to one Usage and account-ledger entry. Invalid or revoked credentials, disallowed models and over-budget requests stop before provider dispatch. The Tokenomics release adds Earned Credit eligibility to that same path only when the funded program is active; it does not require a managed Agent UI.
