# SPEC_ACCOUNT_VAULT — account, wallet link, Portfolio, Vaults, Referrals and migration

**Status:** Canonical specification, compacted 16 November 2026. Every rule has one ID (`ACC-Rnn`) and is stated once; reasons are in the cited TD rows of [DECISIONS.md](./DECISIONS.md). Absorbs the referral rules formerly in Gateway PRD §P0.8. The wallet-link method is owned by [SPEC_TOKEN](./SPEC_TOKEN.md) (TOK-R18–R19) and cited here. This spec does not change Vault economics, contracts or reward cadence; the production Vault implementation, wallet connector, Merkle service and live route map are not in this repository.

**Release:** Unified app (build-order step 5). No token dependency; Portfolio's Gateway balances need only the Foundation catalog and ledger reads (TD-43).

## Overview

`gateway.maxshot.ai` becomes the one application. Existing Vaults keep their contracts and wallet-signed transactions and move under the unified account; an existing depositor can always connect the position wallet and withdraw without a Gateway login. Linking that wallet to an account adds a read-only Portfolio summary and account benefits, never control over on-chain funds. Referrals has two separate programs on one page.

```text
visitor → connect position wallet → withdraw through existing Vault flow (no account needed)
account → link one wallet (TOK-R18) → Portfolio: Vault deposits | MAX/AIT position | Gateway balances
```

## 1. Application boundary

- **ACC-R01 · One application.** `gateway.maxshot.ai` is the single interface. The `app.maxshot.ai` Mint, Dashboard, Staking, Markets and Agents Factory portals are retired; the old 1 USDC → 1 AIT Mint flow is not carried over. MAX & AIT in the Gateway owns locking, minting, staking, burning, pending redemption and withdrawal.
- **ACC-R02 · Vaults unchanged.** Vaults keep their existing deposit and withdrawal behavior, limits, fees, timing, claim mechanics and failure states, and move under the unified account and interface. Hosting, redirects and data migration are deployment work, not new Vault economics.
- **ACC-R03 · Wallet-only exit (TD-38).** An existing depositor may connect the position wallet and withdraw through the existing Vault flow before, or without, linking a Gateway account. The wallet and Vault contract remain the withdrawal authority; a Gateway login or link is never a condition for exit and never overrides on-chain rights. Wallet-only withdrawal creates no account, link, AIT Earned Credit or other entitlement.

## 2. Account, wallet link and Portfolio

- **ACC-R04 · Link.** Each account links at most one wallet and each wallet at most one account, using the method and no-relink rule in TOK-R18. Connecting a wallet in the browser never attributes its positions or rewards to the signed-in account; only a verified link does.
- **ACC-R05 · Portfolio.** Portfolio summarizes, in separate sections, the linked wallet's Vault deposits, its MAX/AIT position and the account's Gateway Credits and subscription. It is a summary and navigation surface: token actions stay in MAX & AIT and Vault transactions stay in Vaults.
- **ACC-R06 · Vault AIT rewards.** Vault revenue buys existing AIT on the market; operations publish a manual Merkle distribution every 14 days for eligible depositors, who see cycle, amount, claim status and history from the existing claim process. A claim moves existing AIT; it never mints AIT, retires position debt or grants AIT Earned Credit. This ledger stays separate from the seven-day Gateway grants.

## 3. Access by state (formerly B3)

- **ACC-R07 · Access table.**

| State | Vault access | Gateway account and Portfolio |
| --- | --- | --- |
| Visitor, no wallet connected | Finds the existing-position withdrawal entry and connects a wallet | No personal Portfolio or benefits |
| Position wallet connected, no login or link | Inspects that wallet's position and withdraws through the wallet-authorized Vault flow | No account, link or entitlement is created (ACC-R03) |
| Signed in, wallet not linked | Vault access follows the existing wallet flow | No attribution of the browser wallet's positions or rewards (ACC-R04) |
| Signed in with a verified linked wallet | That wallet's Vault summary in Portfolio; deposit and withdraw in Vaults | One wallet per account; no change or unlink in this release |

## 4. Data and transaction integration

- **ACC-R08 · Read sources.** Read Vault positions, balances, events and transaction status from the existing contracts and their verified index; use the connected wallet for wallet-only exit and the linked wallet for Portfolio. Keep chain, Vault contract and wallet identity explicit so a same-address or cross-chain display never merges distinct positions.
- **ACC-R09 · Reuse transactions.** Reuse the existing Vault deposit, withdrawal and claim calls and their wallet signatures. The prototype's balances and buttons are entry examples, not contract specifications.
- **ACC-R10 · Redirects.** Map old `app.maxshot.ai` entry links and deep links to the surviving Gateway areas so a depositor can still reach Vault withdrawal without a forced link step. Exact URLs, redirect codes and migration are verified against the live route inventory before cutover. Retired portals never become Vault pages or perform a new economic action.

## 5. Referrals

- **ACC-R11 · Two programs, one page.** Referrals shows the Maxshot Referrals Program and the Partner Referral Program. They share account identity but never attribution or reward accounting. Community Referral Program and Community Rewards stay hidden; a Vault depositor referral program would need a later decision.

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
| An account verifies and links one wallet (ACC-R04–R05, R08) | Portfolio shows only that wallet's Vault positions, its separate MAX/AIT position and the account's Gateway balances; a second link or duplicate attribution is rejected. |
| The linked wallet deposits, withdraws and claims a Vault distribution (ACC-R02, R06, R09) | Calls, amounts, fees and statuses match the existing app and contract; the 14-day Merkle cycle and AIT claims stay separate from Gateway AIT Earned Credit grants. |
| An old app link or deep link is used after cutover (ACC-R01, R10) | The user reaches the matching Gateway destination, including wallet-only exit, without a forced link; no retired portal performs a new economic action. |
| A partner AIT reward is paid (ACC-R16) | The AIT traces to a market purchase or existing inventory and to partner revenue; no mint occurs. |
| A referred user registers through a link and completes a confirmed top-up (ACC-R11–R15) | Exactly one reward is created for that top-up, measured on the USD credited after fees, granted as Referral Credits shown apart from Dollar balance; a failed top-up or a subscription payment creates none; a withheld or revoked reward shows its reason. |

Engineering captures the live contract addresses and chain IDs, connector behavior, index and claim source, route inventory and transaction evidence as implementation artifacts; this specification does not invent those values.

## 7. Prototype evidence and limit

The prototype shows a logged-out **Connect position wallet → Withdraw** entry, a login-gated Portfolio that keeps Vault, MAX/AIT and Gateway balances separate, sample Vault positions with 14-day AIT distribution history, and the two referral views with Community tabs hidden. Connection, positions, claims, transactions and attribution are simulated. The live Gateway referral page showed 1% promotional Credit rewards when captured; that observation does not approve a launch rate.
