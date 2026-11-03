# Maxshot Growth Plans PRD

**Status:** Product draft; approved feature direction, commercial parameters pending
**Updated:** November 2, 2026
**Sequence:** After Studio generation and subscription foundations are ready
**Product baseline:** [llm-gateway-product-baselines.md](./llm-gateway-product-baselines.md)
**Studio behavior:** [MAXSHOT_STUDIO_PRD.md](./MAXSHOT_STUDIO_PRD.md)

## 1. Goal And Boundaries

Grow from discovery to a first completed creation, then to repeat use and paid
use. Sharing distributes opted-in work; Starters turn examples, switching
guides, and runnable demos into a first creation. These product paths extend
Studio and the existing API; they do not create a new generation engine,
wallet, or subscription benefit. Creator Campaigns are separate editorial and
distribution operations, not a dependency or part of this product baseline.
Existing referral attribution and payment rules remain authoritative.

The plans are sequenced after Studio and subscription, not bundled into their
release. A 2-3 week release should deliver one complete acquisition path, not
all three plans at once. All generation remains subject to model availability,
normal usage charging, safety checks, and account limits.

Success is measured as unique visitor -> signup -> first completed generation
-> repeat generation or top-up, with provider cost and incentive cost alongside
conversion. Page views and shares alone are not success measures.

### Product Adoption Baseline

The product-owned path is: public shared work, Starter, or switching guide ->
view a result and current model price -> edit a Studio configuration or API
example -> sign in only to execute -> complete a separately billed job ->
reuse or share the result. A visitor can inspect examples and prepare a request
without an account; execution uses the existing account, limits, and funding.
Attribution follows the source into signup and the first completed job, without
assuming a share click or X composer opening became a published post.

### Live Studio Integration Baseline (reviewed November 1, 2026)

The [live Studio](https://gateway.maxshot.ai/studio) already has four generation
paths, My Creations, an embedded Discover feed, and material detail pages with
creator attribution, prompt, Download, and Try this. Try this loads the source
prompt into the Studio composer; when the source used reference files, Studio
asks the visitor to upload their own. Studio exposes a pre-submit estimate and
required Credit hold, and uses the existing account balance. These are
existing surfaces, not deliverables to rebuild in this PRD.

Product confirmation: the current release places every completed generation
in Discover without asking the creator for publication consent. Its material
detail reveals the prompt. The Sharing Plan changes this default: Discover
and guest-viewable links must use the same per-work permission and disclosure
mode. Existing Discover presence is not evidence of consent.

## 2. Shared Rules

- Only a completed, owned Studio result can be shared or submitted to a
  campaign. Pending, Failed, deleted, or restricted results are ineligible.
- On Sharing Plan launch, new completed works stay in My Creations only until
  the owner explicitly publishes them. One per-work decision controls both
  Discover visibility and the guest-viewable link; generating a work never
  counts as consent.
- Before launch, ask owners of existing Discover works to opt in. User-owned
  works without a recorded opt-in leave Discover and are unavailable through
  any public material/share route, but remain in My Creations. Maxshot-owned
  examples may remain only with documented publication rights. Do not treat
  past automatic inclusion as user consent.
- Public pages can be viewed without login. Login is required before a visitor
  submits a new generation. The new job belongs to and is billed to that
  visitor, never to the source creator.
- The creator can stop sharing. Maxshot then blocks the public page and public
  media access; copies or previews cached by third parties may persist.
- Only moderated, permitted work can be public or featured. The owner confirms
  rights to publish the output and any embedded third-party material. A work
  with uploaded audio is not eligible for public sharing until rights handling
  is defined. Output-only sharing does not guarantee the output lacks private
  information.
- Public responses and social previews must be built from an explicit
  allowlist. Hidden prompts, reference files, first/last frames, audio inputs,
  seeds, and private settings must not appear in page data, metadata, or APIs.
- Store the owner, work ID, selected mode, approved public fields, and consent
  and revocation timestamps. Serve both Discover details and share links from
  the same permission-aware public projection, never the owner's full asset
  response. Platform-owned Starter examples need documented publication rights.
- Each public entry has an opaque identifier and source attribution. A source
  can be a Starter, a creator work, or a Campaign; attribution follows the
  visitor into signup and the first generation without granting a reward for
  a mere click or registration.
- Record one primary source per generation, with an optional campaign context
  and creator ID. The same generation cannot create two creator-use rewards.
- An existing accepted referral relationship is never overwritten by a share
  or campaign link. A new eligible signup through a creator link uses the
  existing referral rule. Self-referrals and duplicate rewards are excluded.
- Product sharing does not require a campaign, creator enrollment, or paid
  promotion. A single canonical public URL and permission-aware preview are
  used by Copy link and social share actions.

## 3. Starter Plan

### User Path And Features

1. Maxshot editors publish a small curated set of task-based Starters, initially
   5-10 across supported image and video paths. Each Starter has a title,
   example output, short use case, input fields, supported model/path/settings,
   and an owner/version. It is not a general workflow builder.
2. A visitor opens a public Starter page from search, social, a campaign, or
   Maxshot navigation. The page explains the expected output and uses Studio's
   current pre-submit pricing disclosure before generation.
3. The visitor changes the required inputs and chooses Create. Studio receives
   a versioned, editable configuration; authentication happens at submission.
   Uploaded input files must be supplied by the visitor and are never copied
   from a private example.
4. If the configured model or path is unavailable, disable submission with a
   clear explanation and allow manual model selection. Never silently change
   the model or promise the same output.
5. The resulting job uses normal Studio funding and settlement. Record the
   Starter ID/version on the job so its acquisition and cost can be measured.

### Switching Guides And Runnable Examples

- Provide short, maintained guides for users of major gateways, beginning
  with Venice and b.ai: where to find Maxshot's API endpoint, model ID, API
  key, pricing, and usage records; how to replace those settings in an
  OpenAI-compatible client; and how to verify the first request. Document only
  tested compatibility. Do not import competitor keys, balances, prompts, or
  chat history, or ask users to paste old credentials into Maxshot.
- Each guide links to a public task-based Starter and a small, editable API
  example for the same use case. Show current model availability and a link
  to live Pricing rather than promising a fixed model, output, or rate.
- The API playground shows a ready-to-edit request and copyable cURL and SDK
  examples with placeholder credentials. Guests may inspect and edit; running
  an example requires login and uses the visitor's own Maxshot account through
  the existing API/billing path. Never place a real API key in a public page,
  share URL, screenshot, or client-side example. Show the expected cost before
  execution and the actual request/result or error afterward.
- Place Playground in its own navigation surface, but reuse Chat, Studio, and
  API execution and billing rather than building another generation service.
  The initial migration helper accepts a JSON request body only and maps the
  common text-only Chat Completions subset. It requires the user to choose a
  current Maxshot model ID and explicitly lists fields it cannot translate.
  No competitor credentials, automatic model equivalence, or media/API-route
  compatibility are implied. The prototype only previews requests and hands
  prompts to Chat or Studio; live API execution and cost display remain an
  implementation requirement, not a claim about the prototype. The prototype
  currently leaves copyable cURL/SDK samples on Starters; their final placement
  within the Playground/Starter path remains open.
- Studio Starters reuse the existing composer and four supported generation
  paths. The playground does not become a second generation engine or grant
  free runs outside the registered-user free-Credit policy.

Editors can publish, unpublish, and replace a Starter version without changing
jobs already accepted under an older version. A creator-owned example can be
used only with explicit campaign/publication consent. Publishing a Starter
does not publish its example creator's private inputs.

### Acceptance

- A guest can reach a Starter, adjust inputs, and see the expected next step
  without logging in; generation requires login and normal funding.
- A completed job is attributable to exactly one Starter version and charged
  once under Studio rules. An unavailable model cannot create a job.
- A switching-guide visitor can configure a tested client and run the example
  without transferring a competitor credential. Guest examples contain no
  live secrets; a signed-in playground run follows normal funding and limits.

## 4. Sharing Plan

### Publication Modes

From My Creations, the owner may choose one of two public modes. Both provide
an accessible public page, a social preview, creator attribution, Copy link,
Share to X, and Stop sharing. Share to X opens X's prefilled post composer with
the canonical public URL and short editable text; the user reviews and
publishes on X. This is an in-product share action, not a clipboard-only step,
automatic post, Maxshot-held X credential, or direct media upload. The URL's
preview may show only media and fields allowed by the selected share mode.
Farcaster and Facebook-specific actions come later; Copy link still works on
any channel. The owner can switch modes only after reviewing what would become
public.

| Mode | Public data | Visitor action |
|---|---|---|
| Result only | Finished output and creator display name only | Create your own opens ordinary Studio without source inputs |
| Share creation method | Output, creator name, explicitly approved prompt and reusable settings | Try this opens an editable Studio configuration |

Share creation method is initially limited to text-only input paths with no
uploaded references, frames, or audio. Result-only can cover all supported
image/video paths, subject to safety and rights checks; it never reproduces
the original inputs. A result-only link must not expose the source recipe via
network responses or hidden page markup. A visitor may copy or download the
public output only if the owner explicitly permits that action; viewing alone
does not imply reuse rights.

Try this prefills Studio using the visitor's account and current model catalog;
only a later Generate submission creates a new job. The prompt/settings are
editable, not an exact-output guarantee.
If the source model is no longer available, show it as unavailable and require
the visitor to choose another model. Reuse must not mutate the source work or
reuse its original payment, reservation, reference files, or private asset ID.

Discover material details and public links must enforce the same selected
mode: a result-only work has no prompt, references, or Try this in either
surface, and Download appears only when the owner permitted it. An unpublished
or revoked work returns no work or hidden metadata from either public route
and cannot be restored by guessing asset IDs.
Campaign featuring does not change the share mode or prevent unsharing.

### Acceptance

- Unshared works are absent from Discover and have no accessible public share
  URL. Both modes are opt-in and revocable, with the decision recorded.
- A result-only page and its social preview disclose no prompt, uploaded
  inputs, seeds, or private settings, including in Discover and API responses.
- A method-sharing page discloses only the fields the owner approved. A guest
  can view it, then authenticate and create a separately billed job.
- Share to X opens a prefilled, editable X composer from the public URL;
  result-only previews contain no prompt. Opening or abandoning that composer
  does not count as a confirmed post or earn a reward.
- An unshared or ineligible work is not accessible via the public route.
- A user-owned legacy work without a new opt-in is removed from Discover/public
  routes without deleting it from My Creations; revocation removes it from
  both Discover and its share link.

## 5. Creator Campaign Plan (Separate Operation)

### Campaign And Creator Path

1. Maxshot runs a time-limited theme with a brief, eligible result types,
   submission cap, dates, review criteria, featured placements, and a fixed
   promotional-Credit budget. Initial campaigns use an invited creator cohort.
2. A creator joins, receives the published brief and any approved creation
   grant, and submits an eligible existing Maxshot work. Submission is explicit
   consent to review, not automatic publication.
3. Editors review ownership, safety, quality, and campaign fit. Approved work
   can be featured on Starter pages, campaign pages, and Maxshot channels only
   under the creator's chosen public share mode and usage permission.
4. The creator can see accepted works, share links, attributable completed
   generations, and confirmed rewards. Rejection provides a reason without
   paying a submission bounty. Ending a campaign stops new submissions but
   does not rewrite already settled rewards.

For the first campaign, invitation, editorial review, and placement can be
operated manually. Do not build public applications, automated rankings,
likes, a marketplace, or a complex campaign console before the funnel works.

### Incentive Rules

- Creator-seeding grants come from a fixed marketing budget and are capped per
  creator/campaign. They are promotional Credits, not Dollar balance.
- A marketing-funded bonus for bringing a new user to a first completed
  generation is a proposal for later discussion, not an approved launch rule.
  If adopted, it must fit the same acquisition-cost cap as referral rewards;
  no automatic stacking or payout for a click or signup.
- The visitor's first-creation incentive should first use the existing
  registered-user free-Credit policy. Any additional one-time bonus is limited
  to eligible low-cost models, one per new user, and a separately approved
  acquisition budget. It must not stack automatically with another signup
  grant for the same action.
- For a new referred user, keep the existing reward: default 10% of confirmed
  top-ups, capped at $50 per referred user, under the current referral policy.
  No second creator reward is paid for that same acquisition event.
- Sharing and Starters launch without an automatic creator-use reward. PAYG
  routed through OpenRouter has no assumed platform margin; neither paid
  requests nor top-up principal are treated as a self-funding reward source.
  The existing 10%-of-confirmed-top-up referral reward is an acquisition cost
  funded from an approved budget, even when a top-up later pays for a plan.
- A later creator reward may use promotional Credits from a capped pool funded
  only by measured subscription-period surplus: subscription payments minus
  provider, routing/credit-purchase, payment, other variable costs, and a risk
  reserve. Unused subscription allowances are not available surplus until the
  period closes. Do not promise a fixed per-copy amount or include
  subscription-funded jobs before a cohort allocation and reward policy is
  approved. Manual campaign grants use their own fixed marketing budget.
- Once enabled, a reward requires an attributable, successful, settled paid
  use and is recorded once regardless of retries or callback order. Exclude
  views, clicks, free use, self-use, failed jobs, duplicate users, and a
  second creator reward for the same acquisition event. Per-creator and
  global caps stop grants when reached; show confirmed rewards only.

Top-up principal is user funds, not earned revenue. These plans do not issue
AIT, MAX, or withdrawable value. If redeemable AIT is later chosen for rewards,
equivalent realized USDC must be placed in segregated reserves before minting.
Reward rates, grant sizes, caps, campaign budgets, and any AIT use require
separate commercial approval before being displayed as promises.

### Acceptance

- A creator can submit only their owned, eligible work; editorial rejection
  cannot make it public or grant an automatic reward.
- A featured work respects the creator's selected share mode and disappears
  from public surfaces when unshared or taken down.
- A qualifying paid use grants at most one reward within approved budget and
  pool once the optional creator reward is enabled; self-use, duplicate, free,
  failed, and unconfirmed events grant none.

## 6. Ownership, Measurement, And Rollout

Maxshot product services own Starter definitions, share permissions and public
views, guide/playground handoff, attribution, and any approved promotional
reward records. Campaign invitations, editorial review, placement, and
distribution are separate operations. Studio owns the generated asset and job
state; the existing identity, referral, and billing services remain
authoritative for accounts, referred top-ups, balances, and usage. Public
routes never read private Studio data by reusing an owner's authenticated
response.

Track unique public-page visits, Share to X composer opens, Create/Try this
clicks, guide-to-example starts, first playground runs, signup, first completed
generation, repeat generation, confirmed top-up, and provider/incentive cost by
source ID. Report conversion per Starter, guide, creator, and share mode; do
not count composer opens as published posts or raw shares as growth. Report
optional confirmed creator rewards separately from the existing referral cost.

Recommended release slices, each subject to engineering estimation:

1. Sharing Plan: opt-in migration of existing Discover, public pages, both
   modes, revocation, Copy link and Share to X, guest-to-generation path,
   existing referral attribution, safety, and funnel events.
2. Starter Plan: curated pages, editorial versioning, input-to-Studio path,
   switching guides, copyable and runnable API examples, availability
   handling, and source-level funnel reporting. Stage the playground behind
   the guide/examples if needed to keep one complete path per release.

Creator Campaign operations and any automatic creator reward are outside these
product release gates. They can follow when distribution ownership, cost data,
and approved budgets exist; they must not block Sharing or Starter launches.

The launch gate for each slice is a privacy review of both public links and
their interaction with existing Discover, a cost ceiling, successful
end-to-end attribution, and a tested stop/unpublish path. Promotion requires a
distribution owner and channels; product features alone do not create traffic.

## 7. Deferred And Open Commercial Decisions

Deferred: a new public gallery/marketplace beyond existing Discover, open
creator enrollment, following, likes, rankings, downloadable input assets,
cash royalties, token rewards, and multi-level referral rewards.

Before incentives launch, approve exact creator/copy reward amounts, eligible
models, per-user/campaign/global caps, budget owner, fraud review and appeal,
and creator publication terms. Until then the launch can use existing referral
rewards plus manually budgeted promotional Credits without advertising an
automatic creator royalty. A subscription-surplus reward pool also requires
completed-period cost data, reserve policy, attribution rules, and approval.

## Version History

| Date | Change |
|---|---|
| 2026-11-02 | Marked first-completed-use creator bonus as an unapproved proposal, separate from manual campaign grants. |
| 2026-11-02 | Clarified standalone Playground UI with shared execution, text-only request translation limits, and prototype versus live-run boundaries. |
| 2026-11-02 | Defined Sharing and Starter as the product adoption baseline; added in-product Share to X, guided switching and runnable API examples, and deferred automatic creator rewards to an approved subscription-surplus pool. |
| 2026-11-01 | Confirmed current Discover auto-includes completed works without consent; specified opt-in migration and one disclosure policy for Discover and share links. |
| 2026-11-01 | Aligned integration assumptions with live Studio's Discover, material detail, Try this, reference re-upload, and Credit hold; kept new public sharing permission-aware. |
| 2026-11-01 | Initial post-Studio, post-subscription growth PRD for Starter, Sharing, and Creator Campaign plans. |
