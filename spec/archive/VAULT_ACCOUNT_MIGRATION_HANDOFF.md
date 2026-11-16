# Vault and Gateway account migration handoff (B3)

**Status:** Development integration acceptance, 15 November 2026. This records the confirmed unified-app and wallet-only exit rules; it does not change Vault economics, contracts, reward cadence, or authorize a new wallet-link policy. The production Vault implementation, wallet connector, Merkle service and live route map are not in this checkout.

**Authority:** [Unified Gateway decisions](./MAXSHOT_Unified_Gateway_App_Decisions.md), [release scope matrix](./RELEASE_SCOPE_MATRIX.md), [feature requirements](./MAXSHOT_Feature_Requirements_PRD.md) and [addendum TD-17/38](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md). The read-only token source PRD remains unchanged.

## Access and ownership boundary

| State | Vault access | Gateway account and Portfolio |
| --- | --- | --- |
| Visitor, no connected wallet | Can find the existing-position withdrawal entry and connect a wallet | No personal Portfolio or account benefits |
| Existing depositor's position wallet connected, no Gateway login/link | Can inspect that wallet's existing position and withdraw through the unchanged wallet-authorized Vault flow | Connection alone creates no Gateway account, wallet link, AIT Earned Credit, or other account entitlement |
| Gateway account signed in, wallet not linked | Existing Vault access follows its existing wallet flow; account-linked position display waits for verified linking | Do not attribute a wallet's positions or rewards to the account merely because the browser connected it |
| Gateway account with verified linked wallet | Can see that wallet's Vault summary in Portfolio and use the existing Vault deposit/withdraw flow in Vaults | One verified wallet per account; the same wallet cannot be attributed to two accounts. Wallet changing/unlinking is unavailable in this release |

The wallet and Vault contract remain the authority for deposits and withdrawals. Gateway login or account linking must not be added as a condition for an existing depositor to exit. The account link authorizes a unified **view and Gateway benefits**, not an override of on-chain withdrawal rights. Direct on-chain unstaking of AIT under TD-17 is a separate token action and does not alter Vault access.

## Data and transaction integration

1. Read Vault positions, balances, deposit/withdraw events and transaction status from the existing chain contracts and their verified index. Use the connected wallet for wallet-only exit; use the verified account-linked wallet for Portfolio. Keep chain, Vault contract and wallet identity explicit so a same-address or cross-chain display does not merge distinct positions by accident.
2. Reuse the existing Vault deposit and withdrawal transaction calls and their wallet signatures. Preserve current limits, fees, timing, claim mechanics and failure states from that implementation. The prototype's sample balances and buttons are entry examples, not contract specifications.
3. Show the Vault-funded AIT distribution separately: Vault revenue buys existing AIT from the market, operations publish a manual Merkle distribution every 14 days, and eligible depositors see cycle, amount, claim status and history from the existing claim process. A claim moves existing AIT; it does not mint AIT, retire MAX/AIT position debt, or grant Gateway AIT Earned Credit.
4. Map old `app.maxshot.ai` entry links to the surviving Gateway areas so an existing depositor can still reach Vault withdrawal. Exact old/new URLs, redirect codes, hosting and data migration are deployment work; verify them against the live route inventory before cutover. Retired Mint, Dashboard, Staking, Markets and Agents Factory portals do not become Vault pages.

## Minimum production proof

| Scenario | Required result |
| --- | --- |
| Existing depositor visits while logged out, connects the correct position wallet, and withdraws | The existing Vault contract accepts the wallet-authorized transaction. Position and transaction history update. No Gateway account or Credit entitlement is created. |
| A different wallet or account tries to withdraw that position | The existing Vault authorization rejects it; the Gateway cannot grant withdrawal through a login or an off-chain wallet association. |
| An account verifies and links one wallet | Portfolio shows only that wallet's Vault positions, separate MAX/AIT position and Gateway balances. A second wallet link or duplicate account attribution is rejected under the launch rule. |
| The linked wallet deposits/withdraws and claims a Vault AIT distribution | Vault calls, amounts, fees and statuses match the existing app/contract behavior; the 14-day Merkle cycle and AIT claim/history remain distinct from seven-day Gateway AIT Earned Credit grants. |
| Old app entry or deep link is used after cutover | The user reaches the corresponding Gateway destination, including wallet-only Vault exit, without a forced account-link step. No retired portal silently performs a new economic action. |

Engineering should capture the live contract addresses/chain IDs, connector behavior, index/claim source, route inventory and transaction evidence as implementation artifacts. This handoff does not invent those values.

## Prototype evidence and limit

The local prototype shows a logged-out **Connect position wallet → Withdraw** entry and keeps Portfolio login-gated. Its authenticated Portfolio summarizes Vault deposits separately from MAX/AIT and Gateway balances; authenticated Vaults shows sample positions and 14-day AIT distribution history. Connection, positions, claims and transactions are simulated. The prototype cannot prove a live wallet signature, contract withdrawal, verified account link, Merkle claim, or redirect.
