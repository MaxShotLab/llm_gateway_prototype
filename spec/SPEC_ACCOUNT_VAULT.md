# SPEC_ACCOUNT_VAULT — account, wallet link, Portfolio, Vaults, Referrals and migration

**Status:** Canonical specification, 16 November 2026. Merges the former unified Gateway application decisions and the B3 Vault/account migration handoff ([`archive/`](./archive/)) under TD-17/38/42/50 ([DECISIONS.md](./DECISIONS.md)). It does not change Vault economics, contracts or reward cadence. The production Vault implementation, wallet connector, Merkle service and live route map are not in this repository.

**Release:** Unified app (build-order step 5). No token dependency; Portfolio's Gateway balances need only the Foundation catalog/ledger reads (TD-43).

## 1. Application boundary

`gateway.maxshot.ai` becomes the single application interface. The old `app.maxshot.ai` Mint, Dashboard, Staking, Markets, and Agents Factory portals are retired. The new MAX & AIT area in Gateway owns MAX locking, AIT minting, staking, burn, pending redemption, and withdrawal. The old 1 USDC → 1 AIT Mint flow is not part of the new application.

Vaults remain as a product with their existing deposit/withdrawal behavior. They move under the unified Gateway account and interface. Exact hosting, route redirects, and data migration are deployment work, not new Vault economics.

Existing Vault depositors may connect the wallet that holds a position and withdraw through the existing Vault flow **before** linking that wallet to a Gateway account. Wallet/contract authorization remains the withdrawal authority. Linking is required to show the position in the unified Portfolio and use Gateway account benefits; wallet-only withdrawal does not create a Gateway account or Earned Credit entitlement. The one-wallet-per-account rule applies when a wallet is linked.

## 2. Account, wallet link and Portfolio

Each Gateway account links at most one wallet. Portfolio summarizes, in separate sections, the linked wallet's Vault deposits, its MAX/AIT position, and Gateway Credits/subscription. It may use separate layouts for the underlying products; it is a summary and navigation surface. MAX locking, minting, staking, burning, and withdrawal interactions remain in MAX & AIT. The Vault transaction flow remains in Vaults.

Vault revenue funds purchases of existing AIT from the market. Operations prepare a manual Merkle-tree distribution **every 14 days** for eligible Vault depositors. Vault rewards do not mint new AIT and do not automatically alter MAX/AIT position debt. The Vault reward ledger and distribution history remain distinct from Gateway Earned Credit grants, which are off-chain compute Credit rather than AIT.

**Wallet link proof (TD-50):** Sign-In with Ethereum (EIP-4361) with ERC-1271 validation for contract wallets, using the flow already implemented in the live product; message bound to the Gateway account, chain ID 1, nonce and expiry. One wallet ↔ one account on the normalized address. **No change or unlink of any kind in this release**, admin-assisted included (TD-17). Direct on-chain actions (Vault withdrawal, AIT unstake) never depend on the link.

## 3. Access and ownership boundary (formerly B3)

| State | Vault access | Gateway account and Portfolio |
| --- | --- | --- |
| Visitor, no connected wallet | Can find the existing-position withdrawal entry and connect a wallet | No personal Portfolio or account benefits |
| Existing depositor's position wallet connected, no Gateway login/link | Can inspect that wallet's existing position and withdraw through the unchanged wallet-authorized Vault flow | Connection alone creates no Gateway account, wallet link, AIT Earned Credit, or other account entitlement |
| Gateway account signed in, wallet not linked | Existing Vault access follows its existing wallet flow; account-linked position display waits for verified linking | Do not attribute a wallet's positions or rewards to the account merely because the browser connected it |
| Gateway account with verified linked wallet | Can see that wallet's Vault summary in Portfolio and use the existing Vault deposit/withdraw flow in Vaults | One verified wallet per account; the same wallet cannot be attributed to two accounts. Wallet changing/unlinking is unavailable in this release |

The wallet and Vault contract remain the authority for deposits and withdrawals. Gateway login or account linking must not be added as a condition for an existing depositor to exit. The account link authorizes a unified **view and Gateway benefits**, not an override of on-chain withdrawal rights. Direct on-chain unstaking of AIT under TD-17 is a separate token action and does not alter Vault access.

## 4. Data and transaction integration

1. Read Vault positions, balances, deposit/withdraw events and transaction status from the existing chain contracts and their verified index. Use the connected wallet for wallet-only exit; use the verified account-linked wallet for Portfolio. Keep chain, Vault contract and wallet identity explicit so a same-address or cross-chain display does not merge distinct positions by accident.
2. Reuse the existing Vault deposit and withdrawal transaction calls and their wallet signatures. Preserve current limits, fees, timing, claim mechanics and failure states from that implementation. The prototype's sample balances and buttons are entry examples, not contract specifications.
3. Show the Vault-funded AIT distribution separately: Vault revenue buys existing AIT from the market, operations publish a manual Merkle distribution every 14 days, and eligible depositors see cycle, amount, claim status and history from the existing claim process. A claim moves existing AIT; it does not mint AIT, retire MAX/AIT position debt, or grant Gateway AIT Earned Credit.
4. Map old `app.maxshot.ai` entry links to the surviving Gateway areas so an existing depositor can still reach Vault withdrawal. Exact old/new URLs, redirect codes, hosting and data migration are deployment work; verify them against the live route inventory before cutover. Retired Mint, Dashboard, Staking, Markets and Agents Factory portals do not become Vault pages.

## 5. Referrals

One Referrals page contains the two programs visible on the current live sites:

| Program | Audience and purpose | Separate records |
| --- | --- | --- |
| Maxshot Referrals Program | Invite users to Gateway compute and funded usage | Link/code, copy/share controls, attributed top-ups, reward balance, status filter, and history |
| Partner Referral Program | Earn AIT from eligible activity on integrated partner platforms | Partner cards, connection status, fee discounts, eligibility, AIT totals, and epoch reward history |

The programs share account identity but do not share attribution or reward accounting. Maxshot Referrals Program measures confirmed referred top-ups by the USD amount credited to Dollar balance after fees; approved rewards are separate promotional Credits at the program's versioned conversion. Subscription payments do not qualify. The live Gateway page displayed 1% promotional Credit rewards when captured for this prototype; that UI reference does not approve a change to launch economics. The live `app.maxshot.ai/referral` page shows Hyperliquid and Polymarket partner referrals. Community Referral Program and Community Rewards are hidden in the unified prototype for now. A separate Vault depositor referral program is not visible in that source and requires a later product decision if retained.

TD-42: Maxshot Referrals Program qualification uses a referred user's confirmed top-up event and the USD amount actually credited to Dollar balance after disclosed fees, attributed at most once; rewards are separate promotional Credits at the program's versioned conversion; subscription payments do not qualify. Reward rate, cap, funding and abuse policy are commercial inputs. Admin referral ledger requirements are in [SPEC_ADMIN §1](./SPEC_ADMIN.md).

## 6. Acceptance (formerly B3)

| Scenario | Required result |
| --- | --- |
| Existing depositor visits while logged out, connects the correct position wallet, and withdraws | The existing Vault contract accepts the wallet-authorized transaction. Position and transaction history update. No Gateway account or Credit entitlement is created. |
| A different wallet or account tries to withdraw that position | The existing Vault authorization rejects it; the Gateway cannot grant withdrawal through a login or an off-chain wallet association. |
| An account verifies and links one wallet | Portfolio shows only that wallet's Vault positions, separate MAX/AIT position and Gateway balances. A second wallet link or duplicate account attribution is rejected under the launch rule. |
| The linked wallet deposits/withdraws and claims a Vault AIT distribution | Vault calls, amounts, fees and statuses match the existing app/contract behavior; the 14-day Merkle cycle and AIT claim/history remain distinct from seven-day Gateway AIT Earned Credit grants. |
| Old app entry or deep link is used after cutover | The user reaches the corresponding Gateway destination, including wallet-only Vault exit, without a forced account-link step. No retired portal silently performs a new economic action. |

Engineering captures the live contract addresses/chain IDs, connector behavior, index/claim source, route inventory and transaction evidence as implementation artifacts; this specification does not invent those values.

## 7. Prototype evidence and limit

The prototype shows a logged-out **Connect position wallet → Withdraw** entry and keeps Portfolio login-gated. Authenticated Portfolio summarizes Vault deposits separately from MAX/AIT and Gateway balances; Vaults shows sample positions and 14-day AIT distribution history; Referrals shows the two program views with Community tabs hidden. Connection, positions, claims, transactions and attribution are simulated; the prototype cannot prove a live wallet signature, contract withdrawal, verified account link, Merkle claim or redirect.
