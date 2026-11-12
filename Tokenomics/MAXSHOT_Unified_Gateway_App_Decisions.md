# Maxshot unified Gateway application decisions

**Status:** Product direction confirmed for the UI prototype. This supplements `MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md`; the read-only source PRD is unchanged.

## Application boundary

`gateway.maxshot.ai` becomes the single application interface. The old `app.maxshot.ai` Mint, Dashboard, Staking, Markets, and Agents Factory portals are retired. The new MAX & AIT area in Gateway owns MAX locking, AIT minting, staking, burn, pending redemption, and withdrawal. The old 1 USDC → 1 AIT Mint flow is not part of the new application.

Vaults remain as a product with their existing deposit/withdrawal behavior. They move under the unified Gateway account and interface. Exact hosting, route redirects, and data migration are deployment work, not new Vault economics.

## Account and Portfolio

Each Gateway account links at most one wallet. Portfolio summarizes, in separate sections, the linked wallet's Vault deposits, its MAX/AIT position, and Gateway Credits/subscription. It may use separate layouts for the underlying products; it is a summary and navigation surface. MAX locking, minting, staking, burning, and withdrawal interactions remain in MAX & AIT. The Vault transaction flow remains in Vaults.

Vault revenue funds purchases of existing AIT from the market. Operations prepare a manual Merkle-tree distribution **every 14 days** for eligible Vault depositors. Vault rewards do not mint new AIT and do not automatically alter MAX/AIT position debt. The Vault reward ledger and distribution history remain distinct from Gateway Earned Credit grants, which are off-chain compute Credit rather than AIT.

## Referrals

One Referrals page contains two separate programs:

| Program | Audience and purpose | Separate records |
| --- | --- | --- |
| Gateway referrals | Invite users to Gateway compute and funded usage | Link/code, attribution, reward balance, and history |
| Vault referrals | Invite eligible Vault depositors | Link/code, attribution, reward balance, and history |

The programs share account identity but do not share attribution or reward accounting. The exact Vault referral rate and eligibility remain governed by the existing Vault program; the UI prototype does not invent new reward terms.

## Prototype scope

The Gateway prototype shows the unified navigation, Portfolio, Vaults overview, and the two referral views. Sample Vault balances and performance figures are labeled illustrative. It does not migrate live Vault contracts, wire wallet signatures, publish Merkle roots, or execute deposits/withdrawals. Those require the existing Vault implementation and production integration work.
