# Token, wallet and Credit integration handoff (B5)

**Status:** Development integration acceptance, 15 November 2026. This organizes confirmed behavior into live proof cases. The browser prototype is illustrative; this checkout has no production token contracts, wallet connector, staking index or Gateway Credit ledger. The read-only source PRD is unchanged.

**Authority:** [Decision addendum TD-01–23/36/40 and §§3/5](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md), [feature requirements §§4.2–4.3](./MAXSHOT_Feature_Requirements_PRD.md), [B2 request/settlement handoff](./REQUEST_AUTHORIZATION_SETTLEMENT_HANDOFF.md), and [B3 wallet/Vault handoff](./VAULT_ACCOUNT_MIGRATION_HANDOFF.md). Actual genesis allocations, bridge security configuration and funded-program parameters remain release inputs under the addendum, not new product behavior decisions.

## 1. Ethereum token and position proof

| Case | Required live result |
| --- | --- |
| Genesis and chain scope | Exactly 1,000,000,000 MAX with 18 decimals is minted on Ethereum into the approved purpose-specific custodian wallets; balances reconcile to the deployment manifest. No later discretionary global mint exists. AIT is 18 decimals and operates on Ethereum only at launch. |
| MAX movement | Every enabled directed route among Ethereum, Base, Arbitrum One and Robinhood Chain moves existing MAX without increasing global supply, including in-flight amounts. Direct destination-to-destination routes work. MAX must return to Ethereum before lock/mint. AIT cross-chain transfer is disabled. |
| Mint quote | On-chain quote, transaction check, backend quote and displayed production quote agree on the [exact integer formula and vectors](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md#5-confirmed-integer-mint-quote): one upward rounding of the total charge in MAX wei. Enforce the configured outstanding cap, maximum-MAX-in and deadline. Any transferable ERC-20 MAX can be used without provenance tracking. |
| Merged position and HWM | Repeated mints by one controller add to one non-transferable active position. Outstanding AIT debt equals AIT supply; global HWM never decreases. Burns do not lower HWM; refill at or below it uses its marginal rate, and a crossing mint splits refill from above-peak integral before the single rounding. Event history retains each mint even though the displayed ratio is current active MAX divided by active AIT debt. |
| Burn and redeem | Controller burns held, unstaked AIT against only their own debt. Partial burn moves `floor(b × M / D)` MAX wei from active to pending; final burn moves all remaining active MAX. Each burn resets the **entire still-pending** balance's withdrawal time to that burn plus seven days. Withdrawal before the deadline fails; at/after it, pending MAX transfers once. Earlier withdrawn MAX is unaffected. |
| Pauses and custody | Separate Mint, Burn, Withdraw and position Pause All scopes act as defined; independent global MAX bridge and directed-route pauses affect only the bridge. Restricted genesis allocations cannot escape their approved custody/vesting controls. |

Reconcile `sum(active AIT debt) = outstanding AIT = Ethereum AIT totalSupply`, `HWM >= outstanding`, and `sum(active MAX + pending MAX) = MAX owed to position controllers` after every state transition. Test partial burn → remint, full burn dust, refill, HWM crossing, cap boundary, repeated burn, and pause/unpause transitions with the shared reference vectors. AIT bought in the market remains circulating inventory until it is actually burned against debt; a buyback alone does not reduce debt. Contract audit and security review remain production release gates.

## 2. Wallet attribution and staking proof

One Gateway account links at most one verified Ethereum staking wallet, and one wallet cannot link to two accounts. Linking requires wallet proof; merely connecting a browser wallet, owning an AIT balance, or using the existing Vault wallet-only exit does not create account attribution. Changing or unlinking is unavailable in this release. The connected position controller signs token operations; Gateway login does not substitute for the wallet's on-chain authority. Direct on-chain unstaking remains possible if the Gateway UI is down.

| Case | Required live result |
| --- | --- |
| Link and duplicate | Verified signature links the wallet once. A second wallet for that account or the same wallet for another account is rejected; Portfolio and Credit attribution follow only the verified link. |
| Stake/unstake and finality | Confirmed Ethereum stake begins time-weighted accrual immediately, without warm-up. Partial or full confirmed unstake ends only the removed amount's new accrual immediately, without cooldown. Previously accrued but ungranted entitlement remains for the next shared grant. Staked AIT must be unstaked before position burn. |
| Index/replay | Finalized stake/unstake events drive account accrual once. Reprocessing, delayed finality or a chain reorganization does not duplicate or misattribute eligible AIT-wei-seconds. The on-chain stake, indexed balance and account display reconcile. |

## 3. Off-chain AIT Earned Credit proof

AIT Earned Credit is a Gateway ledger allowance, not an ERC-20 or on-chain claim. One funded term locks a versioned rational Credits-per-USD rate and approved model-catalog set. All accounts share consecutive seven-day grant boundaries from program start, with a final short boundary. After Ethereum finality, the backend posts each grant automatically; no user claim action is required. Grants expire seven days after issue.

Use the [TD-40 cumulative integer formula and illustrative vectors](./MAXSHOT_Decision_Gaps_and_Handoff_Addendum.md#35-staking-and-credit-ledger-behavior) as shared backend tests. Floor **cumulative** term entitlement to whole Credits and grant only its increase over prior grants. Fractional entitlement carries across epochs and unstaking, then ends with the term. Splitting a stake, replaying an epoch, or delaying a posting cannot increase issuance; spent or expired earlier grants are not recalculated.

| Case | Required live result |
| --- | --- |
| Program boundary | Accrual occurs only during the approved funded term and for eligible linked staking time. The final short interval grants once. An unstaked wallet receives its already accrued amount at the next common boundary, then no new accrual. |
| Grant ledger | For each account/term/boundary, exactly one automatic grant, amount, issue time, seven-day expiry and source program can be reconstructed from finalized chain events. A zero entitlement creates no spendable grant. Grant, spend and expiry reconcile to the Credit balance. |
| Eligibility and spend | Each model has one current catalog; a program permits a set. New authorization checks the current assignment, while an accepted in-flight request retains its earlier decision. UI and scoped external-agent calls spend the same account balance. Earliest-expiring eligible AIT grants fund a request before subscription allowance, Free/Referral Credits and Dollar balance under B2. |
| Reservation and refund | Unused hold returns to its original grant and original expiry; expiry is not extended or revived. A settled provider-fault/overcharge refund restores the AIT-funded portion as a **new seven-day grant**, with one idempotent reversal linked to the original charge. Dollar-funded portions return to Dollar balance. |

The numeric conversion rate, funded term, catalog set, provider-cost exposure and reserve must be supplied and approved before a live Earned Credit promise. They are program inputs; the arithmetic, attribution, grant and spend behavior above is ready for development. B2 owns request-level funding and provider-charge reconciliation.

## Current evidence and limit

The Tokenomics prototype illustrates a merged position, HWM refill, stake/unstake, burn and seven-day pending withdrawal in browser sample state. Its mint calculation uses floating-point numbers and is **not** the integer contract reference. It does not sign transactions, bridge MAX, index finalized events, link wallets or post real Credits. B5 closes only when the live contract, index, account and ledger proofs above pass; screenshots alone cannot close it.
