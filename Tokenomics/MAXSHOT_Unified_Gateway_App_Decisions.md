# Maxshot unified Gateway application decisions

**Status:** Product direction confirmed for the UI prototype. This supplements `MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md`; the read-only source PRD is unchanged.

## Application boundary

`gateway.maxshot.ai` becomes the single application interface. The old `app.maxshot.ai` Mint, Dashboard, Staking, Markets, and Agents Factory portals are retired. The new MAX & AIT area in Gateway owns MAX locking, AIT minting, staking, burn, pending redemption, and withdrawal. The old 1 USDC → 1 AIT Mint flow is not part of the new application.

Vaults remain as a product with their existing deposit/withdrawal behavior. They move under the unified Gateway account and interface. Exact hosting, route redirects, and data migration are deployment work, not new Vault economics.

Existing Vault depositors may connect the wallet that holds a position and withdraw through the existing Vault flow **before** linking that wallet to a Gateway account. Wallet/contract authorization remains the withdrawal authority. Linking is required to show the position in the unified Portfolio and use Gateway account benefits; wallet-only withdrawal does not create a Gateway account or Earned Credit entitlement. The one-wallet-per-account rule applies when a wallet is linked.

## Account and Portfolio

Each Gateway account links at most one wallet. Portfolio summarizes, in separate sections, the linked wallet's Vault deposits, its MAX/AIT position, and Gateway Credits/subscription. It may use separate layouts for the underlying products; it is a summary and navigation surface. MAX locking, minting, staking, burning, and withdrawal interactions remain in MAX & AIT. The Vault transaction flow remains in Vaults.

Vault revenue funds purchases of existing AIT from the market. Operations prepare a manual Merkle-tree distribution **every 14 days** for eligible Vault depositors. Vault rewards do not mint new AIT and do not automatically alter MAX/AIT position debt. The Vault reward ledger and distribution history remain distinct from Gateway Earned Credit grants, which are off-chain compute Credit rather than AIT.

## Referrals

One Referrals page contains the two programs visible on the current live sites:

| Program | Audience and purpose | Separate records |
| --- | --- | --- |
| Maxshot Referrals Program | Invite users to Gateway compute and funded usage | Link/code, copy/share controls, attributed top-ups, reward balance, status filter, and history |
| Partner Referral Program | Earn AIT from eligible activity on integrated partner platforms | Partner cards, connection status, fee discounts, eligibility, AIT totals, and epoch reward history |

The programs share account identity but do not share attribution or reward accounting. Maxshot Referrals Program measures confirmed referred top-ups by the USD amount credited to Dollar balance after fees; approved rewards are separate promotional Credits at the program's versioned conversion. Subscription payments do not qualify. The live Gateway page displayed 1% promotional Credit rewards when captured for this prototype; that UI reference does not approve a change to launch economics. The live `app.maxshot.ai/referral` page shows Hyperliquid and Polymarket partner referrals. Community Referral Program and Community Rewards are hidden in the unified prototype for now. A separate Vault depositor referral program is not visible in that source and requires a later product decision if retained.

## Prototype scope

The Gateway prototype shows the unified navigation, Portfolio, Vaults overview, and the two referral views. Sample Vault balances and performance figures are labeled illustrative. It does not migrate live Vault contracts, wire wallet signatures, publish Merkle roots, or execute deposits/withdrawals. Those require the existing Vault implementation and production integration work.
