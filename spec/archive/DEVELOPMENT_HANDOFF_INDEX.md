# Maxshot development handoff index

**Status:** Working document authority map, confirmed 15 November 2026. This index assigns document ownership; it does not approve launch economics, deployment, or the release-scope decisions still being reviewed.

## Reading order and ownership

| Subject | Current owning document | How to use older documents |
| --- | --- | --- |
| Unified application boundary, navigation, Portfolio, Vaults, referrals | [Unified Gateway application decisions](./MAXSHOT_Unified_Gateway_App_Decisions.md), [B3 Vault/account migration handoff](./VAULT_ACCOUNT_MIGRATION_HANDOFF.md) for integration acceptance, and the [UI reference map](../frontend/TOKEN_UI_REFERENCE_MAP.md) for prototype mapping | Gateway and Studio PRD navigation sections and the Gateway product baseline describe the earlier app. They do not override the confirmed unified navigation. |
| Release sequencing and agent-style Gateway integration | [Release scope matrix](./RELEASE_SCOPE_MATRIX.md), with addendum TD-24 for the managed-Agent clarification | One external-agent integration path is distinct from a managed Agent product. Older one-Agent launch wording is superseded. |
| MAX/AIT contract behavior, staking, Earned Credit, and chain scope | [Decision gaps and handoff addendum](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md) for its listed decisions; [B5 token/wallet/Credit handoff](./TOKEN_WALLET_CREDIT_HANDOFF.md) for integration acceptance; [high-level feature requirements](./MAXSHOT_Feature_Requirements_PRD.md) for consolidated requirements | The read-only token source PRD remains background and the source for unsuperseded token requirements. Do not edit it. |
| Subscription entitlement, allowances, payment, and billing lifecycle | [Subscription feature requirements](../SUBSCRIPTION_FEATURE_REQUIREMENTS.md), the addendum's AIT Earned Credit spend/refund decisions, and the [B2 request authorization/settlement handoff](./REQUEST_AUTHORIZATION_SETTLEMENT_HANDOFF.md) for cross-product acceptance | Older Gateway and Studio estimate-only/media-shortfall examples remain historical where TD-39 supersedes them. Production billing integration remains unverified. |
| Provider admission, customer catalog, routing, and pricing | [Provider launch minimum](./PROVIDER_INTEGRATION_MINIMUM_STANDARD.md), [B4 admission/routing handoff](./PROVIDER_ADMISSION_ROUTING_HANDOFF.md) for integration acceptance, [routing design](./MULTI_PROVIDER_ROUTING_DESIGN.md), [frontend catalog contract](./PROVIDERS_FRONTEND_DATA_CONTRACT.md), and addendum TD-26–37 | Older single-price and standalone Pricing-page requirements in the Studio PRD are superseded. Provider costs remain internal; customer rates belong to individual offerings. |
| Chat, API, and Studio behavior outside the decisions above | [Gateway PRD](../MAXSHOT_GATEWAY_PRD.md) and [Studio PRD](../MAXSHOT_STUDIO_PRD.md), respectively | The [Gateway product baseline](../llm-gateway-product-baselines.md) is an earlier design baseline. Its token exclusion and navigation do not control the unified app. |

Read a document as authoritative **for its assigned subject**. Where a later, explicit decision changes an older clause, use the later decision only for that clause; retain unrelated older requirements. Record new conflicts here and resolve them in the owning document, rather than silently choosing the most recent file.

## Ledger naming for handoff

Use **Dollar balance (USD)** for user-funded value added by confirmed top-ups. Older token documents call this **Paid Credit** or **Paid balance**; those are legacy aliases, not another Credit bucket. Dollar balance pays PAYG charges or a full subscription payment under the subscription ledger rules.

Use **Credits** for integer, off-chain usage allowances: **AIT Earned Credit**, **Basic-chat allowance**, **Premium allowance**, **Free Credits**, and **Referral Credits**. AIT Earned Credit is the staking-derived bucket; the older **Earned Compute Credit** label is not a separate balance. A future campaign must name and fund its own promotional bucket rather than silently adding to staking entitlement. Confirmed unstaking stops new staking accrual immediately; accrued but ungranted entitlement remains due at the next shared grant, and issued grants retain their expiry. Dollar balance and Credit buckets remain separate; a versioned conversion applies only where a grant, reward, or usage charge requires it.

## Explicitly superseded clauses

| Earlier clause | Current rule |
| --- | --- |
| Gateway baseline §6 and Gateway PRD §10: Chat, Dashboard, API, Credits, Referral, Profile navigation; visible experimental Agents/Toolkits | Unified sidebar: **Portfolio, Chat, Studio, Credits, Tokens, Providers, Vaults, Referrals**. API keys live in Profile → Developer settings; Usage lives in Credits. Starters and Playground remain hidden. |
| Gateway baseline §8: tokens, trading, deposits, and on-chain accounting excluded | The new unified app includes Vaults and a gated MAX/AIT area. Their actual transactions and launch gates follow the unified decision and token addendum. |
| Studio PRD §P0.6 and §10: standalone shell Pricing item | **Providers → Models & Pricing** owns model/provider customer rate comparisons. Credits may link there. |
| Studio PRD §P0.6: model-level headline price or source-catalog rate as the pricing reference | Compare complete **customer rate cards per admitted provider-model offering**. A display rate is informational; the server quote and authorized maximum govern an actual request. |

## Production integration still to verify

The [B1 catalog acceptance matrix](./PROVIDERS_FRONTEND_DATA_CONTRACT.md#b1-catalog-acceptance-matrix) governs the live shared-catalog proof; the current prototype uses one simulated snapshot. The [B2 handoff](./REQUEST_AUTHORIZATION_SETTLEMENT_HANDOFF.md) governs accepted request, hold, fallback, settlement and reversal evidence. The [B3 handoff](./VAULT_ACCOUNT_MIGRATION_HANDOFF.md) governs existing Vault behavior, wallet-only exit, account attribution and migration proof. The [B4 handoff](./PROVIDER_ADMISSION_ROUTING_HANDOFF.md) governs provider admission and shared-routing proof. The [B5 handoff](./TOKEN_WALLET_CREDIT_HANDOFF.md) governs token, wallet and Credit integration proof. The [release matrix](./RELEASE_SCOPE_MATRIX.md) owns the journey sequence and agent-integration boundary; addendum TD-39 owns the hard maximum customer charge and TD-40 owns AIT Earned Credit grant rounding. A common request identity is a development suggestion, not an additional product requirement.
