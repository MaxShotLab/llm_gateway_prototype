# Frontend prototype agent instructions

This file covers the React/Vite **prototype**. Read [spec/00_README.md](../spec/00_README.md) and [spec/DECISIONS.md](../spec/DECISIONS.md) for product context, document authority and current decisions. The prototype is simulated; it does not prove a live Gateway, provider call, wallet transaction or Credit ledger.

## Working on the UI

- Run the local server and open the preview yourself when possible. Verify affected screens in the browser and run `npm run build` before handing off changes.
- Before substantial visual changes, use the Product Design plugin's context workflow **if available** when the visual source is unclear. When implementing a selected mock, follow its layout, spacing, typography, content and hierarchy.
- Keep the shared mobile header inside the viewport. Record durable prototype-specific design decisions here; keep product rules in their owning `spec/` documents.

## Current application layout

- The unified sidebar is **Portfolio, Chat, Studio, Credits, Tokens, Providers, Vaults, Referrals**. Tokens opens MAX & AIT. Profile → Developer settings owns API keys; Credits owns Usage. Starters and Playground remain hidden.
- Portfolio summarizes Vault deposits, MAX/AIT and Gateway balances. Keep mint, stake, burn and withdrawal interactions in Tokens; keep the existing Vault transaction flow in Vaults. A logged-out existing depositor can enter a wallet-only Vault withdrawal without linking a Gateway account. Prototype wallet connection and transaction entry are illustrative only.
- Referrals has **Maxshot Referrals Program** and **Partner Referral Program** views. Keep Community Referral Program and Community Rewards hidden. The Gateway example measures confirmed Dollar-balance top-ups in USD and displays promotional Credit rewards separately; its rate and conversion are illustrative.

## Providers, model choice and pricing

- Use `src/data/providerCatalog.js` as the single simulated `providerSnapshot` for Providers, Models & Pricing, Chat and Studio. Derive model identity, display name, Chat eligibility and usable picker membership from it. A new-request picker shows only admitted, available, policy-eligible models; keep at least five distinct usable sample models each for text, image and video. Historical records may retain unavailable model names, but retrying an old creation must switch to a usable model with notice.
- Providers owns profiles, offering admission and availability, per-offering capabilities/limits/data policy, and only the agreed customer-facing observed measures: delivered success and p50/p95 latency with window and sample count. Show **Insufficient data** when the sample is too small. Keep provider cost, metering completeness and invoice reconciliation internal. Do not add a duplicate request-routing simulator or public ranking.
- TD-54 prototype changes (done 16 November 2026): Chat and Studio have a **Provider** selector (Auto default; a pin shows "Pinned · no fallback" in the quote and Usage, TD-48); Developer settings keys carry allowed catalogs, per-request ceiling, daily/monthly budget, Dollar-spend toggle and expiry (TD-44); Usage and the API request log show request IDs, Usage filters by request ID and API key, Pending rows show the held amount (TD-46/49). `src/data/launchConfig.js` mirrors [LAUNCH_CONFIG_V0](../spec/LAUNCH_CONFIG_V0.md); read values from it rather than hard-coding. `PricingPage.jsx` renders Providers → Models & Pricing; Playground and Starters stay unreachable from navigation.
- Providers → Models & Pricing compares each admitted provider-model offering's **own complete customer rate card** for an exact model/version. Do not assume equivalent providers have equal rates or combine components from different offerings into a model price. Credits may link to this view; it is not a separate sidebar page.

## Credits and request examples

- Use **Dollar balance** for funded USD and **AIT Earned Credit** for the staking-derived off-chain allowance. Subscription Basic-chat/Premium allowances, Free Credits and Referral Credits are separate buckets. Follow the [SPEC_BILLING](../spec/SPEC_BILLING.md) for authorization, funding and settlement behavior.
- Keep the quote walkthrough explicitly simulated. Chat and Studio show selected offering/rate, estimate, hard maximum and illustrative hold before submission. The mock Claude Chat completion creates a matching Credits → Usage example with one same-model fallback, verified units, one final charge and released hold. Credits use the live unit `1,000,000 Credits = $1` from `src/data/launchConfig.js` (TD-53). Rates, units and the AIT/Premium hold split in `src/data/sampleRequest.js` are illustrative; they do not debit balances or define a funded term.
- MAX/AIT actions in `src/pages/TokenomicsPage.jsx` mutate browser sample state. Do not use its floating-point mint quote as contract arithmetic; use the [integer quote vectors](../spec/SPEC_TOKEN.md#3-confirmed-integer-mint-quote) for production work.
