# Maxshot Growth Plans | One-Pager

**Status:** Product direction agreed; incentive amounts and budgets pending approval

**Updated:** November 2, 2026

**Sequence:** After Studio and subscription

**Source:** [Growth Plans PRD](./GROWTH_PLANS_PRD.md)

## Objective

Turn Studio work, guides, and examples into a measurable acquisition loop:

**Shared work or guide -> editable example -> signup to run -> first completed generation -> repeat use or top-up -> more shareable work.**

Reuse Studio, Chat, API, and billing; do not build another generation service or wallet. Ship one complete path per 2-3 week release. Creator Campaigns remain separate operations.

## Product Releases

| Order | Plan | User path | Minimum delivery |
|---|---|---|---|
| 1 | **Sharing** | Creator publishes a completed work -> guest views -> tries the approved method -> signs in only to generate | Result-only and method-sharing pages, Copy link, direct Share to X action, social preview, revocation, source tracking |
| 2 | **Starter** | Visitor opens a task example or switching guide -> edits a Studio/API example -> signs in to run it | 5-10 image/video Starters, tested Venice/b.ai setup guides, copyable runnable cURL/SDK examples, current model availability and Pricing links |

Share to X opens an editable, prefilled post; Maxshot neither posts nor uploads media automatically. Copy link works on other channels; Farcaster/Facebook actions can follow. Switching is guided configuration, never import of competitor credentials or history. Guests can inspect and edit; generation requires login and normal billing.

Standalone Playground UI reuses Chat/Studio execution. It sends edited prompts there or previews a Maxshot request from Venice/b.ai text-only Chat Completions JSON. Users choose a Maxshot model; unsupported fields are flagged, and unavailable models block generation. Studio media settings are not public API parameters. **Prototype limits:** cURL/SDK samples remain on Starters, guides are illustrative, the API preview is not an exact Chat export, no live API call or cost quote occurs in Playground, and share links are browser-local. Production needs tested guides, public routes, live catalog checks, settlement, and attribution through first completed use.

## Publication Change

Today Discover auto-includes completed works and reveals prompts. Sharing changes this: new works stay private until the owner opts in per work. **Result only** exposes output and creator, not prompt or Try this. **Share method** exposes approved prompt/settings and editable Try this, initially only for text-only inputs.

The same decision governs Discover, public links, previews, and APIs. Unshare revokes access. Legacy user works without consent leave public surfaces but remain in My Creations; Maxshot examples need documented rights. Works with uploaded audio cannot be shared until rights handling is defined. Guests can view but must sign in and fund generation.

## Incentives And Controls

- Use the existing registered-user free Credits; any extra grant needs a separate cap and budget.
- Existing referral rule: 10% of confirmed top-ups, capped at $50 per referee. This is acquisition cost, not revenue from deposited funds; PAYG has no assumed margin.
- Launch Sharing/Starter without automatic creator-use rewards. Manual creator grants may draw from a capped marketing budget. A first-completed-use bonus is **proposed, not approved**, and cannot stack beyond the acquisition-cost cap.
- Later automatic creator rewards may use only a capped pool of **completed-period subscription surplus** after provider, routing, payment, other variable costs, and risk reserve. Require settled paid use, attribution, and abuse controls; unused allowances are not mid-period surplus.
- No withdrawable rewards, AIT/MAX issuance, royalties, marketplace, or campaign automation in these releases.

## Launch Gates And Success

Gate each release on rights/privacy, tested unshare and legacy migration, cost caps, attribution, and a distribution owner.

Measure **visitor -> preview/edit -> signup -> first completed run -> repeat use/top-up**, with provider and incentive cost by source. X composer opens are not confirmed posts. Approve exact grants, eligible models, rates, and budgets before promising rewards.

## Version History

| Date | Change |
|---|---|
| 2026-11-02 | Clarified Playground handoffs, unavailable-model behavior, prototype limits, and manual versus proposed automatic creator rewards. |
| 2026-11-02 | Added standalone Playground UI scope and bounded text-only migration translation; distinguished prototype preview from live execution. |
| 2026-11-02 | Added direct Share to X, guided switching and runnable examples under Sharing/Starter; separated campaign operations and deferred creator rewards to an approved subscription-surplus pool. |
