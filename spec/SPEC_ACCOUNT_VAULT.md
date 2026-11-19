# SPEC_ACCOUNT_VAULT — account, wallet link, AIT Earn portal, Referrals and migration

**Status:** Canonical specification, compacted 16 November 2026. Every rule has one ID (`ACC-Rnn`) and is stated once; reasons are in the cited TD rows of [DECISIONS.md](./DECISIONS.md). Absorbs the referral rules formerly in Gateway PRD §P0.8. The wallet-link method is owned by [SPEC_TOKEN](./SPEC_TOKEN.md) (TOK-R18–R19) and cited here. This spec does not change Vault economics, contracts or reward cadence; the production Vault implementation, wallet connector, Merkle service and live route map are not in this repository.

**Release:** Gateway and standalone AIT Earn integration (build-order step 5). No token dependency (TD-43).

## Overview

`gateway.maxshot.ai` hosts Gateway and MAX/AIT activity. Existing Vaults and Partner Referral Program stay in the standalone `app.maxshot.ai` AIT Earn portal. An existing depositor can connect the position wallet and withdraw without a Gateway login. Gateway shows a link to that portal in Tokenomics; it does not duplicate Vault balances or transactions. Gateway Referrals shows only the Maxshot Referrals Program (TD-68).

```text
visitor → connect position wallet → withdraw through existing Vault flow (no account needed)
account → link one wallet (TOK-R18) → MAX/AIT position in Tokenomics | Dollar balance and Credits in Credits
Tokenomics → AIT Earn portal → Vault deposits | Partner Referral Program
```

## 1. Application boundary

- **ACC-R01 · Application boundary (TD-68).** `gateway.maxshot.ai` hosts Chat, Studio, Credits, Tokenomics, Models, Providers and Maxshot Referrals. There is no Portfolio page. The old `app.maxshot.ai` Mint, Dashboard, Staking, Markets and Agents Factory portals are retired; the old 1 USDC → 1 AIT Mint flow is not carried over. MAX/AIT locking, minting, staking, burning, pending redemption and withdrawal live in Gateway Tokenomics. The standalone `app.maxshot.ai` AIT Earn portal retains Vaults and Partner Referral Program.
- **ACC-R02 · Vaults unchanged (TD-68).** Vaults stay in the standalone AIT Earn portal with their existing deposit and withdrawal behavior, limits, fees, timing, claim mechanics and failure states. Gateway links to the portal; hosting and redirects are deployment work, not new Vault economics.
- **ACC-R03 · Wallet-only exit (TD-38).** An existing depositor may connect the position wallet and withdraw through the existing Vault flow before, or without, linking a Gateway account. The wallet and Vault contract remain the withdrawal authority; a Gateway login or link is never a condition for exit and never overrides on-chain rights. Wallet-only withdrawal creates no account, link, AIT Earned Credit or other entitlement.

## 2. Account, wallet link and destination pages

- **ACC-R04 · Link.** Each account links at most one wallet and each wallet at most one account, using the method and no-relink rule in TOK-R18. Connecting a wallet in the browser never attributes its positions or rewards to the signed-in account; only a verified link does.
- **ACC-R05 · Destination pages (TD-68).** Tokenomics shows the linked wallet and its MAX/AIT position and links to AIT Earn. Credits shows Dollar balance, Credit buckets, subscription and Usage. Profile shows the linked wallet. Vault deposits, claims and partner AIT rewards remain in the standalone AIT Earn portal. No Gateway Portfolio aggregates these balances.
- **ACC-R06 · Vault AIT rewards.** Vault revenue buys existing AIT on the market; operations publish a manual Merkle distribution every 14 days for eligible depositors, who see cycle, amount, claim status and history from the existing claim process. A claim moves existing AIT; it never mints AIT, retires position debt or grants AIT Earned Credit. This ledger stays separate from the seven-day Gateway grants.

## 3. Access by state (formerly B3)

- **ACC-R07 · Access table.**

| State | Vault access | Gateway account |
| --- | --- | --- |
| Visitor, no wallet connected | Finds the existing-position withdrawal entry and connects a wallet | No attributed position or benefits |
| Position wallet connected, no login or link | Inspects that wallet's position and withdraws through the wallet-authorized Vault flow | No account, link or entitlement is created (ACC-R03) |
| Signed in, wallet not linked | Vault access follows the existing wallet flow | No attribution of the browser wallet's positions or rewards (ACC-R04) |
| Signed in with a verified linked wallet | Deposit and withdraw in the standalone Vault portal | Tokenomics and Profile show the linked wallet; one wallet per account; no change or unlink in this release |

## 4. Data and transaction integration

- **ACC-R08 · Read sources.** The standalone Vault portal reads positions, balances, events and transaction status from the existing contracts and verified index; use the connected wallet for wallet-only exit. Gateway Tokenomics attributes MAX/AIT only to the verified linked wallet. Keep chain, contract and wallet identity explicit so a same-address or cross-chain display never merges distinct positions.
- **ACC-R09 · Reuse transactions.** Reuse the existing Vault deposit, withdrawal and claim calls and their wallet signatures. The prototype's balances and buttons are entry examples, not contract specifications.
- **ACC-R10 · Redirects.** Map retired `app.maxshot.ai` entry and deep links to the matching Gateway or surviving standalone AIT Earn destination. A depositor still reaches Vault withdrawal without a forced link step. Exact URLs and redirect codes are verified against the live route inventory before cutover.

## 5. Referrals

- **ACC-R11 · Separate referral programs (TD-68).** Gateway Referrals shows only the Maxshot Referrals Program. The Partner Referral Program remains in the standalone AIT Earn portal. They never share attribution or reward accounting. Community Referral Program and Community Rewards stay hidden; a Vault depositor referral program would need a later decision.

| Program | Purpose | Separate records |
| --- | --- | --- |
| Maxshot Referrals Program | Invite users to Gateway compute and funded usage | Link or code, copy and share, attributed top-ups, reward balance, status filter, history |
| Partner Referral Program | Earn AIT from eligible activity on integrated partner platforms (currently Hyperliquid and Polymarket) | Partner cards, connection status, fee discounts, eligibility, AIT totals, epoch history |

- **ACC-R12 · Link and attribution.** A registered user can generate and share a referral link; a new registered user who arrives through it is attributed to the referrer.
- **ACC-R13 · Qualifying event (TD-42).** A reward qualifies only from a referred user's **confirmed** top-up, measured as the USD actually credited to Dollar balance after disclosed fees, and each top-up is attributed at most once. Subscription payments never qualify. Failed top-ups earn nothing; rewards for abusive top-ups are withheld or revoked, with a reason.
- **ACC-R14 · Reward.** An approved reward is granted as Referral Credits, a promotional bucket separate from Dollar balance, at the program's versioned Credit/USD conversion. Reward rate, per-referred-user cap, funding and abuse policy are configurable commercial inputs ([LAUNCH_CONFIG_V0](./LAUNCH_CONFIG_V0.md)).
- **ACC-R15 · Referrer view.** The referrer sees the link, referred top-ups in USD, earned rewards and each reward's status. The admin referral ledger is SPEC_ADMIN ADM-R09.

- **ACC-R16 · Partner AIT rewards.** AIT paid by the Partner Referral Program comes from market purchases or existing inventory funded by real partner net revenue; it is never newly minted without a MAX lock. A reward pool already fully allocated (for example the PT 50/30/20 split) never pays an extra referral share unless that schedule is amended.

## 6. Acceptance (formerly B3)

| Scenario | Required result |
| --- | --- |
| Logged-out depositor connects the position wallet and withdraws (ACC-R03, R07, R09) | The existing Vault contract accepts the wallet-signed withdrawal; position and history update; no account or Credit entitlement is created. |
| Another wallet or account tries to withdraw that position (ACC-R03) | The Vault authorization rejects it; no login or off-chain association grants withdrawal. |
| An account verifies and links one wallet (ACC-R04–R05, R08) | Tokenomics and Profile show that wallet; Credits shows the account's Gateway balances; Vault positions remain in the standalone portal. A second link or duplicate attribution is rejected. |
| The linked wallet deposits, withdraws and claims a Vault distribution (ACC-R02, R06, R09) | Calls, amounts, fees and statuses match the existing app and contract; the 14-day Merkle cycle and AIT claims stay separate from Gateway AIT Earned Credit grants. |
| An old app link or deep link is used after cutover (ACC-R01, R10) | The user reaches the matching Gateway or surviving AIT Earn destination, including wallet-only exit, without a forced link; no retired portal performs a new economic action. |
| A partner AIT reward is paid (ACC-R16) | The AIT traces to a market purchase or existing inventory and to partner revenue; no mint occurs. |
| A referred user registers through a link and completes a confirmed top-up (ACC-R11–R15) | Exactly one reward is created for that top-up, measured on the USD credited after fees, granted as Referral Credits shown apart from Dollar balance; a failed top-up or a subscription payment creates none; a withheld or revoked reward shows its reason. |

Engineering captures the live contract addresses and chain IDs, connector behavior, index and claim source, route inventory and transaction evidence as implementation artifacts; this specification does not invent those values.

## 7. Prototype evidence and limit

The Gateway prototype shows Tokenomics, Credits, Profile and Maxshot Referrals separately, with an AIT Earn link in Tokenomics. It does not simulate Vault deposits, claims or partner referrals inside Gateway. The standalone Vault connector, claims, transactions and attribution require verification in the surviving portal. The live Gateway referral page showed 1% promotional Credit rewards when captured; that observation does not approve a launch rate.
