# Maxshot Studio Product Requirements Document

**Status:** Developing product — four generation paths supported; later Studio features remain staged
**Related:** [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md), [archive/llm-gateway-product-baselines.md](./archive/llm-gateway-product-baselines.md) (superseded), [GROWTH_PLANS_PRD.md](../GROWTH_PLANS_PRD.md)
**Prototype:** [studio-prototype/index.html](../studio-prototype/index.html)
**Updated:** November 1, 2026

**Current handoff:** This PRD owns Studio generation behavior except where a later spec does. Subject ownership and precedence are in [00_README §3](./00_README.md#3-document-map-and-precedence); decisions in [DECISIONS.md](./DECISIONS.md). Sections marked **Override** below are superseded in the stated respect; retain their unrelated requirements.

## 1. Purpose

Studio is Maxshot's content-generation surface: a text/image-to-image/video
studio that lives inside the same account, credit balance, and navigation
shell as the LLM Gateway. A user describes or uploads a starting point,
generates an image or video, edits the result in place, and can draw on a
shared library of prompts and reference material — their own and the
community's — to start faster next time.

This PRD owns Studio product and engineering requirements within the
[00_README](./00_README.md). The live product has four generation paths, My Creations,
Discover, material details, and Try this; editing and new public-sharing
controls remain staged. It defines:

- The four generation paths and their required behavior.
- Inline editing and asset-lineage requirements.
- The private My Creations section and the existing Discover/material reuse
  path. New public sharing and curated Starters are specified in the Growth
  Plans PRD.
- Phase 1 and Phase 2 scope and priorities.
- Terminology and acceptance conditions.

The live product supports text-to-image, image-to-image, text-to-video,
and image-to-video generation. Studio's place in the product is
recorded in [llm-gateway-product-baselines.md](./archive/llm-gateway-product-baselines.md).
This PRD retains the staged requirements for editing, asset reuse, and social
features; it does not change the Gateway's original Phase 1 acceptance scope.
Product-design changes still start in the baseline, while this PRD carries
Studio requirements and acceptance details.
The later Growth Plans PRD governs new public sharing and campaigns. Today,
every completed generation enters Discover without creator consent. Sharing
will replace that inclusion rule with recorded per-work opt-in for Discover
and guest-viewable links; user-owned legacy works without opt-in remain only
in My Creations.

## 2. Goals

### Phase 1 Goals

Phase 1 is deliberately minimal — generate, see your own results, pay for
what you use — so it can ship fast. Everything that makes a result more
reusable or more social is Phase 2 (see below), added iteratively once
Phase 1 is live.

- Ship all four generation paths — text-to-image, image-to-image,
  text-to-video, image-to-video — against a configured multi-provider
  generation-model catalog.
- Give a user a private gallery (My Creations) to browse, open, download,
  and delete their own past generations.
- Meter every generation against the same credit balance the Gateway
  already manages.

### Phase 2 Goals

- Let a user edit a generated result in place (remove background, upscale,
  inpaint, text-guided edit, video extend, or jump into Image-to-Video via
  Animate) without leaving the generation surface or losing their place.
- Record what every result was made from — prompt, reference image(s), parent
  asset — so a user can reopen, compare, and remix it later, and reload that
  exact recipe with Try this.
- Reuse the live Discover feed, material detail, and Try this surfaces, while
  changing publication to opt-in in the later Sharing Plan. New public links,
  curated Starters, and creator campaigns follow that release. See
  [Growth Plans](../GROWTH_PLANS_PRD.md).
- A personal Liked list and popularity ranking remain deferred.
- Support multi-image reference generation — more than one reference image
  tied to a single result, most commonly image-to-video — including a
  dedicated First & last frame mode for the common case of anchoring exactly
  where a clip opens and closes.
- Add lightweight creator attribution for published community content.

## 3. Non-Goals

- General-purpose video editing (frame-by-frame cutting, multi-clip timelines,
  transitions, color grading). Video "editing" means text-guided continuation
  of an existing clip: the user picks a bounded window of the existing clip to
  continue from and describes what happens next — not a general trim/cut
  tool, and not usable to shorten or splice unrelated footage.
- Image "editing" beyond AI-driven transformation (background removal,
  upscale, inpaint, text-guided edit) — no manual crop, filters, or layers.
- A general-purpose asset manager (folders, tags, bulk organization). My
  Creations is a simple, filterable-by-type gallery.
- User-supplied generation-provider credentials or arbitrary custom models.
- Real-time collaborative editing of a single result.
- Team- or organization-owned generations. Ownership is per Maxshot account,
  consistent with [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §3.
- An open creator marketplace and social ranking; the existing Discover feed
  is not a license to expose private works through new public links.
- Public-facing like/save counts, comments, follows, or other social
  interaction. A private Liked list is deferred.
- Automatic publication as a requirement for new sharing. Every new public
  link requires the owner's explicit choice under the Growth Plans PRD.

## 4. Users And Key Paths

Creator (generate) and the existing My Creations/Discover reuse path are live.
Creator (edit) describes staged inline editing. Guest-facing share links
follow the later Growth Plans PRD.

### Creator (generate)

1. Choose Image or Video mode, then Text-to-\* or Image-to-\*.
2. Write a prompt, and for Image-to-\* attach one or more reference images.
3. Choose model, aspect ratio, resolution, and (image) style.
4. Review the credit cost and generate — this opens the new asset's Review
   page straight away, showing what's known and a generating state until the
   result exists.
5. Find the asset in My Creations, where it moves from Pending to Generated
   (or Failed).

### Creator (edit) — Phase 2

1. Open a result from My Creations — this shows a read-only preview first
   (media, prompt, and metadata),
   plus owner-only actions the read-only surfaces don't offer: Edit, delete,
   and (image assets) Animate.
2. Choose Edit — from the preview, or directly from the gallery card's edit
   shortcut — to enter the full editing view in place of the composer.
3. Apply an edit — remove background, upscale, inpaint a masked region,
   describe a text-guided change, or (image only) jump straight into
   Image-to-Video with this image as the reference ("Animate").
4. Review the credit cost and confirm; the edit produces a new result linked
   back to its source.
5. Compare the new result against the source, or jump back to the source.

### Creator (reuse) — live Studio and later growth releases

1. A signed-in user opens their own work in My Creations or another creator's
   published work in Discover. Existing material detail shows the result,
   creator, and prompt, with Download and Try this.
2. Try this loads the available prompt/model/settings into Studio. For a work
   made with uploaded references, Studio asks the visitor to upload their own
   files; it does not copy the original creator's files.
3. The later growth release adds guest-viewable, opt-in links. Result-only
   pages hide source inputs; method-sharing pages show only approved fields.
   A visitor's new generation is billed to that visitor.

## 5. Product Framework

### 5.1 Frontend

Studio extends the same Maxshot shell defined in
[MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §5.1 — same account
session, credit balance, and navigation frame. Live Studio contains the
generation composer, private My Creations section, and an embedded Discover
feed with material detail routes. A Liked tab and popularity ranking remain
deferred. Every generated asset, whatever its status (Pending, Generated,
Failed — P0.5), lives in My Creations. New public growth pages are separate,
permission-aware views defined by the Growth Plans PRD; they do not create a
second credit balance or expose the owner's private asset response.

The current prototype ([studio-prototype/index.html](../studio-prototype/index.html))
is a single static HTML/CSS/JS file with mocked generation (results are
placeholder gradients, not real model output) and an in-memory asset store. It
validates composer layout, inline editing, and the Discover/Assets
information architecture. It is not the production frontend foundation, in
the same sense [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §12
describes for the Gateway prototype.

The prototype also simulates the generation-failure behavior in P0.1/P1.1: a
prompt or edit description containing one of three keywords resolves to a
failed result instead of a successful one, so the inline error message and
its clearing behavior can be exercised without a real provider. This keyword
trigger is prototype-only scaffolding, not a production requirement — a real
provider integration reports its own failure reasons. The keyword is matched
as a case-insensitive substring anywhere in the prompt/description, so it can
sit alongside real prompt text (for example, "a sunset test-error-fail"); the
same three keywords drive a generation resolving to Failed instead of
Generated (P0.5), for images and videos alike, and a failed edit (P1.1):

| Keyword | Simulated failure |
|---|---|
| `test-error-policy` | Content-policy rejection — the prompt is treated as disallowed. |
| `test-error-image` | A reference image is treated as restricted/unusable. |
| `test-error-fail` | A generic provider failure — the model returns no result. |

The prototype resolves a Pending generation (P0.5) — to Generated or, via the
keywords above, Failed — after a simulated delay: 3–5 seconds for an image,
and a fixed 20 seconds for a video, compressed from the "up to several
minutes" a real video provider can take, so the Pending state is easy to see
and test without a long wait. To exercise each state: submit any ordinary
prompt for Generated; add a keyword above for Failed; leave the Review page
(or watch it) during the delay for Pending; and submit a fourth video while
three are Pending to hit the concurrency cap.

The prototype also includes the Pricing page (P0.6). Its prices are a static
snapshot of the public OpenRouter model catalog taken on October 19, 2026,
converted to Credits; they are reference rates for the page, not the quote P0.3
shows before a generation.

A separate proof-of-concept (`live-demo/`, not in this repository) wires text-to-image
and text-to-video composer actions to fal.ai for real generation, proving the
composer-to-provider request shape works end to end. It does not implement
editing, Assets, or credit metering, and its API key handling is
demo-only — see §12.

### 5.2 Product Services

Generation and editing requests, asset records, and lineage are Maxshot
product-service data, on the same footing as conversations and prompts in
[MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §5.2. Maxshot services own:

- Asset records: type, prompt, reference image(s), model, aspect ratio,
  resolution, style, duration/audio (video), parent-asset link, edit type,
  creation date, and view count.
- Current Discover auto-includes every completed generation without consent.
  The later Growth Plans PRD requires a recorded owner-controlled share mode
  for both Discover and guest links, revocation, and legacy-work migration.
- A personal Liked state is deferred; Discover itself already exists.
- Creator attribution shown on published assets.
- Credit deduction for every generation and edit action, using the same
  ledger as the Gateway.

### 5.3 Generation Routing

Moved to [SPEC_PROVIDERS](./SPEC_PROVIDERS.md) PRV-R11 on 16 November 2026: image and video generation use a provider routing layer under the same offering and admission rules, not the chat-completion endpoint.

### 5.4 Data Ownership

| Record | Authoritative owner |
|---|---|
| Asset (generated image/video, prompt, reference links, lineage) | Maxshot services |
| Creator attribution | Maxshot services |
| Generation/edit credit deduction | Maxshot services, same ledger as Gateway usage |
| Generation-provider job routing and raw provider response | Generation routing layer |
| User-facing generation cost and status | Maxshot services, derived from routing-layer events |

All cross-system writes require stable identifiers and idempotency keys, per
[MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §5.4. A billable
generation or edit must produce no more than one credit deduction regardless
of provider retries.

## 6. Scope And Priorities

Priority definitions match
[MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §6:

- **P0:** Required for Phase 1 release.
- **P1:** Required for Phase 2 completion.
- **P2:** Explicitly deferred and not scheduled by this PRD.

## 7. Phase 1 Requirements

Phase 1 is the minimum that lets a user generate and keep their own results.
Nothing here depends on anything in §8.

### P0.1 Generation Composer

> **Override (16 November 2026):** Model picker shows only usable models (TD-41) and carries a provider selector, default Auto (TD-48); pre-submit estimate and hard maximum per [SPEC_BILLING §4](./SPEC_BILLING.md) (TD-39).

- Image/Video mode switch; Text-to-\* / Image-to-\* tab per mode.
- Prompt field with an instructional placeholder per mode (not example-style
  copy).
- Model picker scoped to the active mode's configured model catalog.
- Aspect-ratio and resolution pickers (SD/HD/2K).
- Style picker — image generation only; hidden in Video mode.
- Reference-image upload for Image-to-\* — local file or picked from My
  Creations (P0.2) — up to 9 images. Clicking an uploaded thumbnail opens an
  enlarged preview of that reference. Uploaded thumbnails can be reordered by
  dragging — order matters for multi-image reference generation (P1.5), so
  fixing a mis-ordered upload doesn't mean starting over.
- The prompt field has a 5,000 character limit, shown as a live counter next
  to it. Exceeding the limit doesn't stop the user from typing, but flags it
  in place (the counter reads as a warning) and blocks Generate with a clear
  message until the prompt is back under the limit. The same field and limit
  are shared by every edit description (P1.1).
- Reference-strength control — Image-to-Image only (see §11); Image-to-Video
  uses the reference as-is, with no strength control, since it is not a
  blend-toward-prompt operation.
- Video-only duration and audio (on/off, with optional audio description)
  controls.
- Prompt-enhance action.
- Visible pre-submit estimate and required Credit hold; final settlement
  follows the current billing rules rather than promising an exact match.
- Generating never locks the composer. Clicking Generate creates the asset
  immediately in a Pending status (P0.5), clears the composer's prompt and
  reference image(s), and opens the new asset's Review page — the same
  read-only preview P0.2 defines — straight away. The Review page shows
  everything already known (prompt, model, aspect ratio, resolution, duration,
  reference image(s)); the only difference from a finished result's page is
  the media area, which shows a generating state (an indeterminate indicator
  and a line on what to expect) until the result exists, and no
  download/edit/Animate actions yet.
- The user may stay on the Review page or leave it: the asset remains in My
  Creations as Pending and resolves in the background. If they're still on
  its Review page when the result arrives, the page updates in place to the
  finished result; otherwise a brief notification tells them it's ready.
- A failed generation (for example, a prompt or reference image flagged by
  content policy, or a provider that simply fails to return a result) does
  not disappear: the asset becomes Failed and stays in My Creations. Its
  Review page (and its card, on hover) explains what went wrong and what to
  do next; no credit is deducted; and the user can retry by reloading the
  asset's prompt into the composer and supplying references again (the same
  flow Try this offers, P1.4) or delete it. If the user has already left the
  Review page, a brief notification tells them a generation failed.
- A submission can also be blocked before it starts — for example the
  concurrent-video limit (P0.5). That shows as an inline error message in the
  composer, near the prompt field, and leaves the prompt and reference
  image(s) untouched. The same inline message is used for a failed edit
  (P1.1). It reflects only the most recent attempt — it clears as soon as the
  user edits the prompt or moves to a different context (switching
  mode/tab, entering or leaving edit view, navigating elsewhere) — rather
  than persisting or following the user into an unrelated view.

Acceptance:

- A user can complete the full Creator (generate) path for all four modes.
- Generating with insufficient credits is blocked with a clear message and no
  deduction.
- The upload limit appears for both Image-to-\* tabs; the reference-strength
  control and the style picker appear only where §11 defines them (strength:
  Image-to-Image only; style: image modes only).
- Clicking Generate opens the new asset's Review page immediately, with the
  composer already empty; the page shows the known info plus a generating
  state in place of the media, and the composer is never locked.
- When the result arrives while the user is on the Review page, it updates in
  place to the finished result without any extra action.
- Dragging a reference thumbnail to a new position reorders it without
  re-uploading.
- Typing past 5,000 characters turns the counter into a warning; Generate is
  blocked with a message until the prompt is back under the limit.
- A failed generation becomes a Failed asset in My Creations, deducts no
  credit, and explains the failure on its Review page; its prompt and
  prompt can be reloaded into the composer to retry; reference files must be
  supplied again.
- An inline error message (a blocked submission or a failed edit) does not
  follow the user into an unrelated context — editing the prompt, switching
  mode or tab, entering or leaving edit view, or navigating elsewhere
  (sidebar, gallery card, a different item's preview) all clear it.

### P0.2 My Creations

- Embedded on the Studio page directly below the composer — not a separate
  route or nav item. Studio is the only entry point, from Phase 1 on; only
  the actions available here change in Phase 2 (below).
- A private, filterable-by-type (all/image/video) gallery of the current
  user's own generations, listed newest first by creation date.
- Every generation lives here from the moment it's submitted, whatever its
  status: Pending (still generating), Generated (has a result), or Failed
  (P0.5). A status filter — a dropdown alongside the type filter, so the two
  read as separate controls — narrows the gallery to All status, Generated,
  Pending, or Failed, and combines with the type filter. Pending and Failed
  cards carry a status marker and, on hover, a short explanation (that it's
  still generating; or why it failed).
- Opening an item shows a read-only preview: the media, its prompt, its
  reference image(s) if any, and its metadata (P0.4). A Pending or Failed
  item opens the same page in its own state (P0.1, P0.5) — no result-only
  actions (download, edit, Animate). Only Generated results are eligible for
  owner-requested public sharing or the reference-image picker.
- Per-item actions, both as a direct shortcut on the gallery card and inside
  the preview: download, delete.
- Delete asks for confirmation — a Cancel/Delete prompt — before removing
  anything; there is no one-click, no-confirm delete anywhere delete appears
  (My Creations card or preview, and the editing view's delete once P1.1
  ships). Canceling, or dismissing the prompt, leaves the asset untouched.
- Live Studio already supports Try this and Animate. Inline editing and asset
  lineage remain staged (P1.1, P1.2).

Acceptance:

- A user can find any of their own past generations by type filter and by
  status filter, and the two combine.
- Opening a Generated item shows the read-only preview and its available
  live actions, including Try this or Animate where applicable. A Failed
  item's retry requires supplying reference files again.
- Deletion only affects the deleted asset and its own gallery entry.
- Clicking delete shows a confirm/cancel prompt first; the asset is only
  removed after the user explicitly confirms.

### P0.3 Credit Integration

> **Override (16 November 2026):** Funding buckets, hold order, Premium coverage of media, key Dollar-spend opt-in and refunds are owned by [SPEC_BILLING §2–6](./SPEC_BILLING.md) (TD-44/47/56).

- Generation uses the same Gateway ledger and funding order defined in
  [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §5.4. Live Studio shows a
  pre-submit Credit estimate, hard maximum customer charge, and funding hold
  for the selected model, path, and settings. The Gateway reserves the maximum
  before dispatch. Settlement follows actual billable usage up to that maximum;
  any provider overrun is a platform/provider discrepancy, not a later customer debit.
  Later edit actions must use the same funding and settlement contract.
- Eligible generations may draw from the shared monthly premium subscription
  allowance, never the basic-chat allowance, under [Subscription Feature Requirements](./SUBSCRIPTION.md)
  §3.1 and §4.3; the remainder follows the existing promotional-Credit and
  Dollar-balance order. A Pending job holds the required funding until it
  becomes Generated or Failed.
- Studio adds no separate funding flow; it uses the Gateway's existing Credits
  page and account ledger ([MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md)
  §P0.6).

Acceptance:

- Studio and Gateway usage draw from one ledger with separate basic-chat,
  premium, promotional-Credit, and Dollar-balance buckets; Studio uses only
  eligible premium, promotional, or Dollar funding.
- A failed generation is not charged.

### P0.4 Result Metadata Display

- Every asset's detail view shows: creation date, resolution paired with
  aspect ratio (for example "HD · 16:9"), and, for video, duration.
- Resolution and aspect ratio are shown together as a compact, scannable
  summary, not as exact pixel dimensions.
- Public popularity ranking and view-count display are deferred.

Acceptance:

- A freshly generated asset's preview shows today's date and its
  resolution/aspect.

### P0.5 Generation Status

> **Override (16 November 2026):** Job states `accepted → dispatched → delivered | failed | uncertain → settled | released`, manual resolution of `uncertain`, 24-hour auto-release and the customer-facing Pending state with held amount are owned by [SPEC_BILLING §5](./SPEC_BILLING.md#5-media-job-lifecycle) (TD-49). Studio's Pending/Generated/Failed labels map onto those states.

- Every generation has a status, shown wherever it appears in My Creations
  (P0.2) and on its Review page (P0.1):
  - **Pending:** submitted, no result yet. Image usually resolves in seconds;
    a video can take several minutes, so the user is never held on the
    composer waiting.
  - **Generated:** the result exists and is charged (P0.3).
  - **Failed:** the request could not produce a result. Not charged; the
    reason is kept with the asset (P0.1).
- Pending and Failed assets sit in My Creations alongside Generated ones —
  there is no separate module for in-flight work. Only Generated assets are
  downloadable, editable, or eligible for owner-requested public sharing and
  the reference-image picker.
- Up to 3 videos may be Pending at once. Submitting a fourth while 3 are
  already Pending is blocked with the inline error message P0.1 defines, and
  the prompt is left untouched. Images have no such limit.
- Credit is deducted only when a generation becomes Generated, never for
  Pending or Failed (P0.3).

Acceptance:

- A submitted generation appears in My Creations as Pending immediately, then
  becomes Generated or Failed without the user doing anything.
- The status filter (P0.2) returns exactly the assets in the chosen status.
- A fourth concurrent video submission is blocked, with the inline error
  message, until fewer than 3 videos are Pending.
- A Generated asset deducts credit and gains its result-only actions; a
  Failed one deducts nothing and keeps its reason.
- Pending and Failed assets are never publicly shareable or available in the
  reference-image picker.

### P0.6 Model Pricing Page

> **Override (16 November 2026):** Models & Pricing lives under Providers and compares complete customer rate cards per offering ([SPEC_PROVIDERS §4](./SPEC_PROVIDERS.md#4-pricing-and-customer-display), TD-34). No standalone Pricing item.

The earlier standalone Pricing page text was moved to [archive/STUDIO_PRD_P0.6_pricing_page_superseded.md](./archive/STUDIO_PRD_P0.6_pricing_page_superseded.md). Studio model-detail ideas there are not requirements until reconciled with the live catalog.

## 8. Phase 2 Requirements

Discover, material details, Try this, and reference uploads already exist in
live Studio. The remaining Phase 2 work here is inline editing and lineage;
new public sharing and campaigns are staged after Studio and subscription
under the Growth Plans PRD. Liked and popularity ranking remain deferred.

### P1.1 Inline Editing

- Choosing to edit a result — from its read-only preview (P0.2), or directly
  via the gallery card's edit shortcut — switches the composer into an
  editing view in place — no modal — showing the result, its prompt, and its
  metadata. Merely opening/previewing a result does not enter editing.
- The image tools — remove background, upscale, and inpaint (brush-selected
  mask) — plus Animate are one mutually exclusive selection, alongside
  leaving none selected for a plain text-guided edit. Selecting a tool only
  arms it; it does not apply anything by itself. The user optionally adjusts
  the description, then Generate applies whichever tool is currently
  selected (or performs a plain text-guided edit if none is).
- Remove background and upscale apply with no description required — there's
  nothing for one to add. Inpaint requires a painted mask and a description;
  text-guided edit and video extend require a description.
- Animate (image assets only): jumps into a new Image-to-Video generation
  with this image pre-filled as the reference (and, if selected from inside
  the editing view, with whatever the user typed there carried over as the
  motion description). Triggered directly from the gallery card or the
  read-only preview, it's a one-click shortcut with no intermediate step;
  triggered from inside the editing view, it fires on Generate like the
  other tools. Either way, Animate does not transform the source image — it
  starts a new generation from it, the way Try this reuses a video's own
  reference — so it is not metered as an edit action; it is billed as a
  normal video generation (P0.3) once the user actually generates.
- Video tool: extend — pick a bounded window of the existing clip, choose
  original or newly generated audio, describe how it continues. This is the
  full extent of video "editing" (see §3); it is not a general trim tool.
- Each edit action shows its own configured credit cost before applying,
  reflected live as the user changes which tool is selected.
- An edit produces a new asset; it never overwrites the source.
- Entering the editing view hides My Creations below the composer; it
  reappears when editing exits.
- Applying an edit shows an in-progress state — the Generate control becomes
  indeterminate and its cost readout reads "Generating…" — and the editing
  view itself (the result, the tool selection, the mask, the typed
  description) stays exactly as the user left it, locked against further
  input, for the whole request. Nothing is reset, and the user is
  never shown a blank composer mid-request; the editing view only tears down
  once the result exists, in the same step as opening its preview.
- A completed edit opens directly into the new result's read-only preview. Returning ("Back") from that preview
  goes back to wherever the edit was opened from — My Creations if that's
  where the gallery card or preview's edit shortcut was — not always to the
  Studio composer.
- A failed edit shows the inline error message P0.1 defines, in the same
  location and with the same clearing behavior — no credit is deducted, and the editing view (image, tool selection, mask, typed
  description) is left exactly as it was for the user to retry.
- Deleting the currently-edited result (P0.2) asks for confirmation first,
  the same as everywhere else delete appears.
- Exiting editing without generating returns the composer to its prior
  generation state.

Acceptance:

- A user can complete the full Creator (edit) path for both image and video
  results.
- The source asset is unchanged and still present after an edit.
- Inpaint requires a painted mask and a description before it can be applied;
  remove background and upscale apply with no description required.
- My Creations is hidden while the editing view is open.
- The Generate control is disabled and shows its in-progress state for the
  duration of an edit request, while the rest of the editing view (image,
  tool chips, prompt) stays visible and unchanged until the result is ready.
- After a successful edit, the user lands on the new result's preview
  automatically, and its "Back" returns to the surface the edit was opened
  from.
- The same prompt character limit and Generate-blocking behavior (P0.1)
  applies to every edit description — text-guided edit, inpaint, and video
  extend.

### P1.2 Asset Lineage

- A result created by editing or extending another result stores a link to
  its source (parent asset).
- The editing view shows "edited from" with a link back to the source, and a
  compare-original toggle.
- A result created from reference image(s) stores those reference(s), shown
  as "reference used" in the editing view.

Acceptance:

- Following "edited from" opens the exact source asset.
- Compare-original swaps the preview between source and result without losing
  edit state.
- An asset generated from more than one reference image shows all of them,
  not just the first.

### P1.3 Discover Feed

Already present in live Studio, embedded below My Creations. It lists
published image/video works, links to material detail pages showing output,
creator attribution, prompt, Download, and Try this. Every completed generation
currently appears there without creator consent. This is the current behavior,
not the future sharing rule. At Sharing Plan launch, Discover and guest links
must enforce the same recorded opt-in and result-only/method disclosure mode;
user-owned legacy works without consent leave Discover but remain in My
Creations.

### P1.4 Try This

- Live material detail and Discover cards already offer Try this. It loads
  available prompt/model/settings into the Studio composer. Original uploaded
  reference files are not copied; the visitor must provide their own.
- The later result-only public page does not offer source-recipe Try this.
  Method sharing can expose only fields the owner approved.

Acceptance:

- For an existing work with uploaded references, Try this tells the visitor
  to upload their own files. New public method-sharing is initially limited
  to paths without uploaded inputs under the Growth Plans PRD.
- Try this never mutates the source asset.

### P1.5 Multi-Image Reference

- A single generation (most commonly image-to-video) may be made from more
  than one reference image.
- The resulting asset records every reference used, in order.
- The owner can inspect the references used; Try this may show their roles
  but requires the visitor to supply their own files.
- Image-to-Video offers a mode toggle, not a separate tab: Reference images
  (the general, order-sensitive list above) or First & last frame — a
  dedicated pair of upload slots for the frame the clip should open on and
  the frame it should close on, plus an optional description of what happens
  between them. An info affordance next to the toggle explains the mode
  before the user turns it on.
- Switching the toggle doesn't discard either side's uploads — Reference
  images and First & last frame each keep their own images independently, so
  flipping back and forth never loses work already done in the other mode.
- A First & last frame result records both references with their role
  (first vs. last), not as an unordered pair — "Reference used" and Try this
  both show which image opens the clip and which one closes it.

Acceptance:

- A result made from two reference images shows two reference thumbnails;
  Try this asks the visitor to provide replacement references.
- Generating in First & last frame mode requires both a first frame and a
  last frame; the description is optional.
- Toggling from First & last frame to Reference images and back preserves
  whatever was uploaded on both sides.
- A First & last frame result's reference thumbnails are visibly
  distinguished as first vs. last in the preview and editing view; Try this
  preserves the roles without copying the original files.

### P1.6 Liked

Deferred. A disabled prototype mock does not
constitute a production requirement or acceptance condition.

Phase 2 acceptance:

- Each feature works with persistent data and real account authorization, not
  the prototype's in-memory store.
- Owned-asset reuse does not expose private inputs to other accounts.

## 9. P2 Deferred And Out-Of-Scope Work

- A public popularity ranking and Liked list. Discover already exists;
  the later Growth Plans PRD requires opt-in sharing, revocation, and
  takedown for new public links and curated placements.
- Public like/save counts, comments, follows, or other social interaction.
- Per-item licensing or usage-rights declarations for community content.
- Team- or workspace-shared Discover feeds.
- Batch/variation generation (multiple results from one request).
- Seed control, negative prompts, and per-model camera-motion controls.
- Real download delivery (the prototype's download action is a placeholder).

P2 is not a third delivery phase. None of this work is scheduled by this PRD.
Adding it requires an approved product-baseline change before requirements or
implementation begin.

## 10. Navigation

> **Override (18 November 2026; TD-68/69):** Gateway sidebar is **Chat, Studio, Credits, Tokenomics, Models, Providers, Referrals**; Vaults and partner referrals stay in the standalone AIT Earn portal linked from Tokenomics ([00_README §1](./00_README.md#1-what-is-being-built)). The navigation below is the earlier baseline.

The standalone Pricing placement below is historical. The [SPEC_PROVIDERS §4](./SPEC_PROVIDERS.md#4-pricing-and-customer-display) governs current unified navigation.

Phase 1 adds to [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §10's
navigation exactly one item:

1. Studio

My Creations (P0.2) is not a nav item — it's a section embedded on the
Studio page, directly below the composer, from Phase 1 on; there is no
"Assets" route or nav entry at any point.

Phase 2 does not add a nav item either. Inline editing and lineage remain on
the Studio page. Discover is already embedded below My Creations, while
Liked is deferred. New public links and curated Starters are defined by the
later Growth Plans PRD.

The prototype also has a Pricing item (P0.6). It is a shell-level page shared
with the Gateway, not a Studio route; its Image and Video tabs are the part
this PRD owns.

Placement of Studio and Pricing within the overall Maxshot navigation
(relative to Chat, Dashboard, API, Credits, Referral, Profile) is a baseline
decision, not this PRD's to make.

## 11. Terminology

- **Studio:** The generation and editing surface covered by this PRD.
- **Generation:** A billable request that produces a new image or video
  asset from a prompt and, for Image-to-\*, one or more reference images.
- **Asset:** A generated image or video and its recorded metadata (prompt,
  reference image(s), model, aspect ratio, resolution, style, lineage,
  creation date, view count).
- **Reference image:** An image supplied to steer a generation — uploaded, or
  selected from My Creations.
- **Reference strength:** How closely an Image-to-Image result should follow
  its reference image versus its prompt.
- **Edit:** A billable action that produces a new asset from an existing one
  (remove background, upscale, inpaint, text-guided edit, video extend).
- **Parent asset / lineage:** The source asset an edited or extended result
  was derived from.
- **Try this:** Loading a published or owned asset's available prompt and
  settings into the composer; original uploaded reference files are not
  copied and must be supplied by the new user.
- **Animate:** A shortcut on an image asset that jumps into a new
  Image-to-Video generation with that image pre-filled as the reference —
  one click from the gallery card or read-only preview, or a Generate click
  if selected from inside the editing view (P1.1). Not an edit — it starts a
  new generation, billed as a normal video generation.
- **Pending / Generated / Failed:** The three statuses of a generation
  (P0.5). Pending — submitted, no result yet, and the composer stays free;
  Generated — the result exists and is charged; Failed — no result, not
  charged, with the reason kept on the asset. All three live in My Creations
  and can be filtered by status (P0.2).
- **My Creations:** The current user's private gallery of their own assets,
  embedded below the Studio composer.
- **Assets:** The private My Creations section, not a separate route. A Liked
  tab is deferred and is not part of current acceptance.
- **Discover:** The existing embedded feed of published image/video works,
  with material details and Try this. It currently auto-includes completed
  generations without consent; Sharing Plan changes this to per-work opt-in.
- **Liked:** A deferred private save list; not part of the Growth Plans launch.
- **View count:** A deferred public-popularity signal; Growth Plans instead
  track visitor-to-generation conversion without a public ranking.
- **Creator attribution:** The creator name or identifier shown on a live
  Discover item and, later, on an opted-in public work or Starter example.
- **First & last frame:** An Image-to-Video mode where the user supplies
  exactly two reference images — the frame the clip opens on and the frame
  it closes on — instead of the general, unordered reference-image list
  (P1.5). A toggle within Image-to-Video switches between the two modes;
  each keeps its own uploaded images independently.
- **Configured model catalog:** The per-mode set of generation models a user
  picks from (P0.1), and the set the Pricing page lists on its Image and
  Video tabs (P0.6). Matching the current prototype, not a commitment to these
  specific providers — Image (14): Seedream 5.0 Flash (default), Seedream 4.5,
  Seedream 5.0 Pro, Seedream 5.0 Lite, Grok Imagine Image 2.0, Recraft V4.1
  Flash, FLUX 3 Image, Grok Imagine Image Quality, Qwen Image 3, Qwen Image 3
  Pro, Recraft V4.1, Riverflow V2.5 Pro, Riverflow V2.5 Fast, Recraft V4.
  Video (7): Veo 3.1 Lite (default), Seedance 2.5, Seedance 2.0, Seedance 2.0
  Fast, Wan 3.0, Veo 3.1 Fast, Seedance 2.0 Mini.
- **Ability:** What a model can do with its inputs, shown as a tag on the
  Pricing page (P0.6): T2I (text to image), I2I (image to image), T2V (text to
  video), I2V (image to video), and V2V (video to video).
- **Reference rate:** A model's published price converted to Credits for the
  Pricing page (P0.6). It informs model choice; the composer shows a
  pre-submit estimate, hard maximum and required hold, with actual-cost
  settlement capped at that maximum (P0.3).

## 12. Prototype Migration

The current prototype validates composer layout, inline editing, and the
Discover/Assets information architecture with mocked generation and an
in-memory store. It is not the production frontend foundation, per the same
reasoning
[MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §12 applies to the Gateway
prototype.

Migration order:

1. Stand up a generation routing layer (§5.3) against at least one configured
   image and one configured video provider.
2. Connect the composer to real generation, replacing mocked gradient output.
3. Persist asset records, lineage, and reference image(s) through Maxshot
   services.
4. Connect credit deduction to the shared ledger
   ([MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §P0.5).
5. Ship the generation composer, My Creations, and result metadata against
   persisted data (Phase 1) — this alone is a releasable product.
6. Add inline editing and asset lineage against real accounts (Phase 2).
7. Retain the live Try this and multi-image reference behavior while adding
   any remaining owned-asset improvements (Phase 2).
8. After Studio and subscription, add opt-in public links and curated Starters
   under the Growth Plans PRD. Discover already exists; Liked remains deferred.

The `live-demo/` proof of concept (not in this repository) may inform step 1 and 2's
request shape but its API-key handling and lack of persistence must not carry
into production.

## 13. Version History

| Date | Version | Changes |
|---|---|---|
| 2026-11-01 | Discover consent decision | Confirmed automatic inclusion of every completed generation without consent today; required recorded opt-in and legacy migration for Sharing Plan. |
| 2026-11-01 | Live Studio alignment | Recorded existing Discover/material detail, Try this, reference re-upload, and 5,000-character prompt limit; kept new sharing permission-aware and Liked deferred. |
| 2026-11-01 | Growth-plan alignment | Superseded automatic Discover publication with private-by-default, opt-in sharing after Studio and subscription; deferred broad Discover/Liked and public input reuse. |
| 2026-10-13 | Developing-product status | Recorded all four generation paths as supported in the developing product; retained staged requirements for later Studio features. |
| 2026-10-13 | Subscription pool clarification | Studio uses the premium allowance, not restricted basic-chat Credits. |
| 2026-10-12 | Multimodal subscription alignment | Replaced one cost per media type with firm model-and-settings quotes; linked eligible Studio jobs to the shared subscription allowance and clarified two-unit ledger and Pending holds. |
| 2026-08-13 | Initial PRD | Defined the four generation paths, inline editing, lineage, credits, and the Assets library. |
| 2026-08-14 | Assets → reuse-only | Assets opens a read-only preview (Try this/download); edit and delete live only in My Creations. |
| 2026-08-17 | Discover + Liked split | Split Assets into a public Discover feed and a private Assets surface (My Creations + Liked). |
| 2026-08-17 | Discover embedded, metadata added | Moved Discover under the Studio composer; added result metadata (date, views, resolution+aspect, duration); My Creations opens a read-only preview first. |
| 2026-08-17 | Phase re-scope | Trimmed Phase 1 to generate + view-only My Creations + credits; moved editing/Discover/Try this/multi-ref to Phase 2; decided auto-publish; Liked ships disabled by default. |
| 2026-08-18 | Consistency pass | Added the configured model catalog (fixing a dangling §11 reference); defined view count as one increment per open; split Discover sort into Most recent (first) and Most viewed (fast-follow); documented that Discover hides while editing. |
| 2026-09-08 | In-progress state, direct-to-preview, confirm delete | Generating and editing now show an in-progress state (indeterminate Generate control, "Generating…") without resetting or leaving the composer/editing view until the result exists (P0.1, P1.1). A completed generation or edit opens straight into the result's preview, returning to wherever it was opened from; the composer clears on return instead of keeping the just-used input (P0.1, P1.1). Unified the four edit tools into one selection applied by Generate, rather than remove background/upscale/Animate firing immediately on click (P1.1, §11). Delete now requires an explicit confirm/cancel step everywhere it appears (P0.2, P1.1). |
| 2026-09-11 | First & last frame, draggable references, prompt limit | Added First & last frame as a mode toggle inside Image-to-Video (not a separate tab), with its own info affordance and role-tagged references ("first" vs. "last") in Reference used/Try this; toggling it preserves both modes' uploads independently (P1.5, §11). Reference-image thumbnails can now be reordered by dragging (P0.1). Added a shared 2,500-character prompt limit with a live counter that blocks Generate/Apply until the prompt is shortened, covering both generation and every edit description (P0.1, P1.1). |
| 2026-09-18 | Assets merged into Studio, no separate nav item | Assets (My Creations, and Liked once it ships) is no longer a routed surface or nav item — it's an embedded section on the Studio page, directly below the composer and above Discover (P0.2, P1.3, §5.1, §10, §11). Corrected every place that still described Assets as its own route: the navigation list (now just "Studio"), the frontend surfaces count, the Assets/My Creations/Liked/Discover terminology entries, the Creator (reuse) path, and the editing view's "hides Discover" behavior (now hides My Creations too, since both sit below the composer). |
| 2026-09-21 | Generation-failure error message | Defined the inline error message shown when a generation or edit fails (content policy, restricted reference image, or generic provider failure) — no credit deducted, input left untouched for retry, and the message clears on prompt edit or on leaving the current context rather than persisting into an unrelated view (P0.1, P1.1). Documented the prototype's keyword-based failure simulation (§5.1) used to exercise this without a real provider. |
| 2026-09-23 | Pending video generation | Added P0.5: video generation no longer locks the composer — a submission creates the asset as Pending immediately, the composer clears, and it resolves in the background (some video models can take several minutes). Pending videos show in their own module above My Creations, hidden entirely when empty; up to 3 may be Pending at once, and a fourth is blocked using the same inline error-message location/behavior as a failed generation (P0.1). Credit is only deducted on success; a failed Pending video is removed with no charge and shows the same inline error message. Documented the keyword table (§5.1) driving both ordinary and Pending failures, and the prototype's 20-second compressed Pending delay. |
| 2026-09-28 | Generation status replaces the Pending module | Superseded the 2026-09-23 design: there is no separate Pending module. Every generation is an asset with a status — Pending, Generated, or Failed — that lives in My Creations, filterable by a status dropdown beside the type filter (P0.2, P0.5). Clicking Generate now opens the new asset's Review page immediately (image and video alike) showing the known info plus a generating state in the media area, instead of locking the composer; the page updates in place when the result arrives (P0.1). A failed generation becomes a Failed asset with its reason (retry via reloading its prompt/references, or delete) rather than disappearing; the inline composer error message remains for blocked submissions (e.g. the 3-concurrent-video cap) and failed edits (P0.1, P1.1). Only Generated assets reach Discover, Liked, and the reference picker. §5.1 documents the prototype's per-state test recipe and delays (image 3–5s, video 20s). |
| 2026-10-19 | Pricing page and model catalog | Added P0.6, a shell-level Pricing page with Text, Image, and Video tabs: per-model prices in Credits with USD, an Abilities column for media, "from" prices with an expandable breakdown grouped by mode, provider lists, and a details panel. Image and Video list only the models the Studio picker offers. Replaced the illustrative model catalog (§11) with the picker's 14 image and 7 video models, and recorded the known gaps between the composer's options and each model's limits. |
