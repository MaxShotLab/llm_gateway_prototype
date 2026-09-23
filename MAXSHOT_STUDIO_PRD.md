# Maxshot Studio Product Requirements Document

**Status:** Proposed — not yet part of the approved product baseline
**Related:** [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md), [llm-gateway-product-baselines.md](./llm-gateway-product-baselines.md)
**Prototype:** [studio-prototype/index.html](./studio-prototype/index.html)
**Updated:** September 23, 2026

## 1. Purpose

Studio is Maxshot's content-generation surface: a text/image-to-image/video
studio that lives inside the same account, credit balance, and navigation
shell as the LLM Gateway. A user describes or uploads a starting point,
generates an image or video, edits the result in place, and can draw on a
shared library of prompts and reference material — their own and the
community's — to start faster next time.

This PRD is the working source of truth for Studio product and engineering
collaboration while it is evaluated for the product baseline. It defines:

- The four generation paths and their required behavior.
- Inline editing and asset-lineage requirements.
- The Discover feed and the Assets section (My Creations and Liked), both
  embedded on the Studio page.
- Phase 1 and Phase 2 scope and priorities.
- Terminology and acceptance conditions.

Studio is not yet part of
[llm-gateway-product-baselines.md](./llm-gateway-product-baselines.md).
Nothing in this document authorizes navigation, credit-model, or account
changes beyond what the baseline already approves. Adding Studio to Phase 1 or
Phase 2 production scope requires a baseline update first, following the same
governance [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) already
establishes: product-design changes start in the baseline; this PRD carries
requirements, ownership, and acceptance.

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
- Open a Discover feed where every user's own generations sit alongside
  community- and Maxshot-published examples, all equally reusable, ranked by
  popularity — published automatically, with no separate publish step (see
  P1.3).
- Let a user save any Discover item to a personal Liked list for later reuse,
  without leaving a public trace on the item itself.
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
  Creations, Liked, and Discover are flat, filterable-by-type galleries.
- User-supplied generation-provider credentials or arbitrary custom models.
- Real-time collaborative editing of a single result.
- Team- or organization-owned generations. Ownership is per Maxshot account,
  consistent with [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §3.
- Moderation, reporting, and takedown tooling for community-published content.
  Required before Discover ships publishable community content in production;
  out of scope for this PRD (see §9).
- Public-facing like/save counts, comments, follows, or other social
  interaction on Discover items. Liked (P1.6) is a private, per-user save
  list — it is not shown to other users and does not factor into Discover's
  popularity ranking.
- A private or draft state for a generation. Every result a user generates is
  automatically visible in Discover once Phase 2 (P1.3) ships — there is no
  publish step, no opt-out, and no per-item privacy setting. A future privacy
  control isn't ruled out, but it isn't designed or scheduled — see §9.

## 4. Users And Key Paths

Creator (generate) is the Phase 1 experience in full. Creator (edit) and
Creator (reuse) describe the complete Phase 2 experience once inline editing,
lineage, Discover, and Try this ship — see §7 and §8 for what's required in
each phase.

### Creator (generate)

1. Choose Image or Video mode, then Text-to-\* or Image-to-\*.
2. Write a prompt, and for Image-to-\* attach one or more reference images.
3. Choose model, aspect ratio, resolution, and (image) style.
4. Review the credit cost and generate.
5. Find the result in My Creations.

### Creator (edit) — Phase 2

1. Open a result from My Creations — this shows a read-only preview first
   (media, prompt, and metadata), the same shape Discover and Liked use,
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

### Creator (reuse) — Phase 2

1. Browse Discover, or open My Creations (or Liked, once it ships) — all
   embedded on the same Studio page, not separate destinations.
2. Select a result made by themselves, another creator, or Maxshot.
3. In Discover or Liked, review a read-only preview — the media, its
   reference image(s), and its prompt as plain text — then choose Try this.
   In My Creations, Try this is also available directly from the gallery
   card or from inside the full editing view.
4. Use "Try this" to reload its exact reference image(s) and prompt into the
   composer.
5. Adjust the prompt or reference and generate a new result.

The Reuse path is what makes Discover valuable: every item is a working
recipe, not just a preview image. Discover and Liked are reuse-only —
opening an item there never enters the editing view, even for the current
user's own published work; editing an asset always happens from My
Creations.

## 5. Product Framework

### 5.1 Frontend

Studio extends the same Maxshot shell defined in
[MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §5.1 — same account
session, same credit balance display, same navigation frame. It adds a
single routed surface, Studio, which stacks sections on one scrollable page,
in this order: the generation composer, a Pending module (P0.5) directly
below it whenever a video is Pending — otherwise absent entirely — My
Creations below that (P0.2 — a Liked tab joins it once P1.6 ships), and the
Discover feed (P1.3) below that. The Pending module, My Creations, Liked, and
Discover are never their own route or nav item — Studio is the only entry
point — and none of this introduces a second design system or a second
credit balance.

The current prototype ([studio-prototype/index.html](./studio-prototype/index.html))
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
same three keywords drive both an ordinary (non-Pending) generation/edit
failure and a Pending video (P0.5) resolving to a failure instead of success:

| Keyword | Simulated failure |
|---|---|
| `test-error-policy` | Content-policy rejection — the prompt is treated as disallowed. |
| `test-error-image` | A reference image is treated as restricted/unusable. |
| `test-error-fail` | A generic provider failure — the model returns no result. |

For Pending video generation specifically (P0.5), the prototype resolves a
submission — success or, via the keywords above, failure — after a fixed
20-second delay, compressed from the "up to several minutes" a real video
provider can take, so the Pending state is easy to see and test without a
long wait.

A separate proof-of-concept ([live-demo/](../live-demo)) wires text-to-image
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
- Every asset is automatically visible in Discover once generated (Phase 2)
  — there is no publish-state field to own, since there's no publish step
  (see §3, §9).
- Per-user Liked state (which assets a given user has saved) — private to
  that user, never exposed on the asset itself.
- Creator attribution shown on published assets.
- Credit deduction for every generation and edit action, using the same
  ledger as the Gateway.

### 5.3 Generation Routing

Image and video generation need the same kind of provider abstraction the
Gateway PRD defines for chat in §5.3: a routing layer in front of
configured image/video providers (for example the models named in §11) that
accepts a generation request, returns a job result, and reports cost and
status back to Maxshot services for metering. This PRD assumes such a layer
exists or is built alongside Studio; it is not itself a chat-completion
route and should not be forced through the Gateway's OpenAI-compatible
endpoint.

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
- The prompt field has a 2,500 character limit, shown as a live counter next
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
- Visible credit cost before generating, matching the amount actually
  deducted.
- Generating shows an in-progress state for the whole request — the Generate
  control becomes indeterminate and its cost readout reads "Generating…" —
  without resetting or navigating away from the composer. A real model can
  take several seconds or more; the user always has visible confirmation that
  the request is running, not silence.
- A completed generation opens directly into the new result's read-only
  preview (P0.2) — the user isn't left looking at the composer they just
  generated from and required to go find the result themselves. Returning
  ("Back") from that preview clears the composer's prompt and any reference
  image(s), so it starts blank rather than showing the input that was just
  used.
- A failed generation (for example, a prompt or reference image flagged by
  content policy, or a provider that simply fails to return a result) shows
  an inline error message in the composer, near the prompt field, explaining
  what went wrong and what to do next — not a silent failure and not a
  disruptive modal. No credit is deducted, and the prompt and any uploaded
  reference images are left exactly as they were, so the user can adjust and
  retry without starting over. The message reflects only the most recent
  attempt — it clears as soon as the user edits the prompt, or moves on to a
  different context (switching mode/tab, entering or leaving edit view,
  navigating elsewhere) — rather than persisting indefinitely or following
  the user into an unrelated view. Edit actions (P1.1) show a failure the
  same way, in the same location, with the same clearing behavior.

Acceptance:

- A user can complete the full Creator (generate) path for all four modes.
- Generating with insufficient credits is blocked with a clear message and no
  deduction.
- The upload limit appears for both Image-to-\* tabs; the reference-strength
  control and the style picker appear only where §11 defines them (strength:
  Image-to-Image only; style: image modes only).
- The Generate control is disabled and shows its in-progress state for the
  entire duration of a request; nothing else on screen changes until the
  result is ready.
- After a successful generation, the user lands on the new result's preview
  without any extra action; the composer is empty — no prompt text, no
  reference images — when they return to it.
- Dragging a reference thumbnail to a new position reorders it without
  re-uploading.
- Typing past 2,500 characters turns the counter into a warning; Generate is
  blocked with a message until the prompt is back under the limit.
- A failed generation shows its error message in place, deducts no credit,
  and leaves the prompt and any uploaded reference images untouched for
  retry.
- An error message shown after a failed generation or edit does not follow
  the user into an unrelated context — editing the prompt, switching mode or
  tab, entering or leaving edit view, or navigating elsewhere (sidebar,
  gallery card, a different item's preview) all clear it.

### P0.2 My Creations

- Embedded on the Studio page directly below the composer — not a separate
  route or nav item. Studio is the only entry point, from Phase 1 on; only
  the actions available here change in Phase 2 (below).
- A private, filterable-by-type (all/image/video) gallery of the current
  user's own generations, listed newest first by creation date. There is no
  view-count signal to sort by yet — that arrives with Discover (P1.3).
- Opening an item shows a read-only preview: the media, its prompt, its
  reference image(s) if any, and its metadata (P0.4).
- Per-item actions, both as a direct shortcut on the gallery card and inside
  the preview: download, delete.
- Delete asks for confirmation — a Cancel/Delete prompt — before removing
  anything; there is no one-click, no-confirm delete anywhere delete appears
  (My Creations card or preview, and the editing view's delete once P1.1
  ships). Canceling, or dismissing the prompt, leaves the asset untouched.
- Phase 1 is view, download, and delete only. Editing, Animate, asset
  lineage, and Try this are Phase 2 (P1.1, P1.2, P1.4) — a Phase 1 result is
  a finished thing to keep or discard, not yet something to remix.

Acceptance:

- A user can find any of their own past generations by type filter.
- Opening an item shows the read-only preview; there is no edit, Animate, or
  Try this control anywhere in Phase 1.
- Deletion only affects the deleted asset and its own gallery entry.
- Clicking delete shows a confirm/cancel prompt first; the asset is only
  removed after the user explicitly confirms.

### P0.3 Credit Integration

- Generation deducts from the same usable-credit balance
  [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §5.4 defines, using one
  configured cost per generation type (image vs. video). Phase 2 edit actions
  each get their own configured cost when they ship (P1.1).
- The credits page's funding flow ([MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md)
  §P0.6) is unchanged by Studio; Studio only spends from the balance it funds.

Acceptance:

- Studio and Gateway usage draw from and report to one combined balance, not
  two.
- A failed generation is not charged.

### P0.4 Result Metadata Display

- Every asset's detail view shows: creation date, resolution paired with
  aspect ratio (for example "HD · 16:9"), and, for video, duration.
- Resolution and aspect ratio are shown together as a compact, scannable
  summary, not as exact pixel dimensions.
- View count joins this display once Discover ships (P1.3) — Phase 1 has no
  popularity signal to show yet. See P1.3 for its definition (incremented once
  per open) and how it's used.

Acceptance:

- A freshly generated asset's preview shows today's date and its
  resolution/aspect.

### P0.5 Pending Video Generation

- Unlike image generation, a video generation doesn't lock the composer for
  the whole request — some video models can take several minutes to return a
  result, far too long to hold the user in an indeterminate "Generating…"
  state (P0.1). Submitting a video instead creates the asset immediately in a
  Pending state, clears the composer, and lets the user keep working —
  submit another generation, navigate elsewhere — while it resolves in the
  background.
- Pending videos show in a dedicated Pending module on the Studio page,
  positioned above My Creations (P0.2) — not mixed into that gallery. The
  module is visible only while at least one video is Pending, and hidden
  entirely otherwise; it never sits there empty. A Pending card shows a
  generating status, not a result — it isn't downloadable, editable, or
  openable yet — and an info affordance explains that it will move into My
  Creations automatically once ready.
- Up to 3 videos may be Pending at once. Submitting a fourth while 3 are
  already Pending is blocked, using the same inline error-message location
  and clearing behavior P0.1 defines for a failed generation.
- Credit is deducted only once a Pending video actually succeeds, same as any
  other generation (P0.3). A Pending video that fails is removed with no
  charge, and the failure shows as the same inline error message (P0.1) any
  other generation failure uses — the fact that it resolved in the
  background, after the user may have moved on to something else, doesn't
  change where or how the failure is shown.
- A successful Pending video moves automatically into My Creations (P0.2);
  the Pending module then hides again once nothing remains Pending.

Acceptance:

- Submitting a video generation clears the composer and doesn't block further
  composer use while it's Pending.
- A Pending video appears only in the Pending module above My Creations,
  never inside My Creations itself, until it resolves.
- The Pending module is absent from the page whenever there are no Pending
  videos.
- A fourth concurrent video submission is blocked, with the same inline
  error-message treatment P0.1 uses, until fewer than 3 videos are Pending.
- A successful Pending video deducts credit and appears in My Creations; a
  failed one deducts nothing, is removed from the Pending module, and shows
  the same inline error message a failed non-Pending generation would.

## 8. Phase 2 Requirements

Phase 2 is everything that turns a Phase 1 result into something reusable,
editable, and discoverable. It ships iteratively after Phase 1 is live, in
whatever order the product prioritizes — no P1 item requires another to
ship first, with the sole exception that Liked (P1.6) surfaces items from
Discover (P1.3), so it needs Discover live first.

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
- Entering the editing view hides both My Creations (P0.2) and the Discover
  feed (P1.3) below the composer — a user editing a result isn't also
  scrolling past their own gallery or unrelated published work. Both
  reappear once editing exits.
- Applying an edit shows the same in-progress state as generating (P0.1) —
  but the editing view itself (the result, the tool selection, the mask, the
  typed description) stays exactly as the user left it, locked against
  further input, for the whole request. Nothing is reset, and the user is
  never shown a blank composer mid-request; the editing view only tears down
  once the result exists, in the same step as opening its preview.
- A completed edit opens directly into the new result's read-only preview,
  the same as a fresh generation (P0.1). Returning ("Back") from that preview
  goes back to wherever the edit was opened from — My Creations if that's
  where the gallery card or preview's edit shortcut was — not always to the
  Studio composer.
- A failed edit shows the same inline error message, in the same location and
  with the same clearing behavior, as a failed generation (P0.1) — no credit
  is deducted, and the editing view (image, tool selection, mask, typed
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
- Neither My Creations nor Discover is visible anywhere on screen while the
  editing view is open.
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

- Embedded on the Studio page below My Creations (P0.2), rather than as its
  own routed surface — a user scrolls from composing, past their own recent
  work, straight into Discover, without leaving Studio or losing composer
  state.
- A single feed combining the current user's own generations with community-
  and Maxshot-published examples — no "mine vs. theirs" filter, only a type
  filter (all/image/video).
- Every generation is included automatically the moment it's created — there
  is no publish step, review queue, or opt-out (see §3, §9).
- Two sort modes: Most recent (by creation date) and Most viewed (by view
  count). Most recent ships first — it needs nothing beyond the creation date
  Phase 1 already records. Most viewed follows as a fast-follow once view
  tracking is live; both then coexist as user-facing sort options. This
  staged rollout is sequencing within Phase 2, not a third phase (§6).
- View count is a simple popularity signal recorded per asset, incremented by
  exactly one each time a user opens that asset's detail view (My Creations,
  Discover, or Liked — any surface counts). It is not the same as Liked
  (P1.6), which is private and does not affect either sort mode.
- Opening any item — regardless of source, including the current user's own
  work — shows a read-only preview: the media, its reference image(s), and
  its prompt as plain text, not an editable field.
- Discover never offers edit or delete, for any item, regardless of
  ownership. Editing an owned asset happens only from My Creations (P0.2).
- Every item supports Try this and download, from both the gallery card and
  the preview; it also supports Like once P1.6 ships (Like stays hidden
  while P1.6 is flagged off).
- Non-owned items show a creator attribution badge (name, or a Maxshot-team
  label for official examples).

Acceptance:

- A user can open any Discover item and see the same read-only prompt/
  reference detail regardless of who made it, including their own.
- No edit or delete control is offered anywhere in Discover, including on
  the current user's own items.
- Opening a Discover item and returning ("Back") returns to the Studio page
  with My Creations and Discover both still in place below the composer; the
  sidebar highlight stays on Studio throughout, since Discover has no
  separate route.
- Most recent sorts correctly by creation date; once Most viewed ships, the
  feed re-sorts correctly as view counts change (highest first).
- Opening any asset's detail view increments its view count by exactly one,
  regardless of which surface it was opened from.
- Every result a user generates appears in Discover without any action from
  them.

### P1.4 Try This

- Available as a one-click action directly on any gallery card (My Creations,
  Liked, or Discover), inside the read-only preview, and inside the full
  editing view.
- Loads the asset's own reference image(s) — itself, for an image; its stored
  reference(s), for a video made from one or more images — and its prompt
  into the composer, in the matching mode/tab, ready to generate.

Acceptance:

- Try this on an image-to-video result restores every reference image it was
  made from, not only the first.
- Try this never mutates the source asset.

### P1.5 Multi-Image Reference

- A single generation (most commonly image-to-video) may be made from more
  than one reference image.
- The resulting asset records every reference used, in order.
- The editing view's "reference used" row and Try this both reproduce the
  full set.
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

- A result made from two reference images shows two reference thumbnails and
  reloads both via Try this.
- Generating in First & last frame mode requires both a first frame and a
  last frame; the description is optional.
- Toggling from First & last frame to Reference images and back preserves
  whatever was uploaded on both sides.
- A First & last frame result's reference thumbnails are visibly
  distinguished as first vs. last in the preview, the editing view, and
  after Try this.

### P1.6 Liked

- A user can save any Discover item (their own or someone else's) to a
  personal Liked list with a single toggle, from the gallery card or the
  preview.
- Liked is the second tab in the Assets section, alongside My Creations
  (P0.2) — both embedded on the Studio page, not a route of their own. It is
  a flat, filterable-by-type (all/image/video) gallery of everything the
  current user has saved.
- Liked items behave like Discover items, not My Creations items: opening one
  shows the same read-only preview, with Try this and download, and no edit
  or delete control — including for the current user's own published work.
- Unsaving an item (toggling Like off) removes it from Liked immediately.
- Liked state is private to the user: it is never shown to other users and
  does not affect Discover's view-count ranking (see P1.3, §3).
- The current prototype ships this feature fully built but disabled by
  default behind a flag — the heart toggle and the Liked tab are hidden —
  since the product need for a personal save list hasn't been validated yet.
  Turning it back on needs no further engineering, only a product decision,
  and can happen independently of any other P1 item.

Acceptance:

- A saved item appears in Liked and can be found there by type filter.
- Toggling Like off on a Liked-tab card removes it from that list without a
  page reload.
- Opening a Liked item and returning ("Back") returns to the Liked tab, not
  Discover or the Studio composer.
- No edit or delete control is offered on a Liked item, including one the
  current user made themselves.

Phase 2 acceptance:

- Each feature works with persistent data and real account authorization, not
  the prototype's in-memory store.
- Discover and Liked never expose a non-owned item's delete control.

## 9. P2 Deferred And Out-Of-Scope Work

- Moderation, reporting, and takedown tooling for community-published
  content.
- A user-facing publish/private control. Every result is automatically
  public in Discover by default (P1.3, §3); a future opt-out or draft state
  isn't ruled out, but it isn't designed or scheduled.
- Public like/save counts, comments, follows, or any other social interaction
  on Discover items. Liked (P1.6) is explicitly in scope but is a private
  per-user save list, not a social feature — see §3.
- Per-item licensing or usage-rights declarations for community content.
- Team- or workspace-shared Discover feeds.
- Batch/variation generation (multiple results from one request).
- Seed control, negative prompts, and per-model camera-motion controls.
- Real download delivery (the prototype's download action is a placeholder).

P2 is not a third delivery phase. None of this work is scheduled by this PRD.
Adding it requires an approved product-baseline change before requirements or
implementation begin.

## 10. Navigation

Phase 1 adds to [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §10's
navigation exactly one item:

1. Studio

My Creations (P0.2) is not a nav item — it's a section embedded on the
Studio page, directly below the composer, from Phase 1 on; there is no
"Assets" route or nav entry at any point.

Phase 2 does not add a nav item either. Inline editing, lineage, and Try
this all live on the same Studio page, and Discover (P1.3) embeds below My
Creations rather than shipping as its own page. Liked (P1.6) becomes a
second tab alongside My Creations, in that same embedded section — not a
new destination (currently built but disabled by default — see P1.6).

Placement of Studio within the overall Maxshot navigation (relative to
Chat, Dashboard, API, Credits, Referral, Profile) is a baseline decision,
not this PRD's to make.

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
- **Try this:** Reloading an asset's own reference image(s) and prompt into
  the composer to generate a new result from the same recipe.
- **Animate:** A shortcut on an image asset that jumps into a new
  Image-to-Video generation with that image pre-filled as the reference —
  one click from the gallery card or read-only preview, or a Generate click
  if selected from inside the editing view (P1.1). Not an edit — it starts a
  new generation, billed as a normal video generation.
- **Pending:** The state of a video generation that has been submitted but
  hasn't resolved yet (P0.5). Shown in its own module directly below the
  composer, above the Assets section — present only while at least one video
  is Pending. Distinct from the in-progress state P0.1 defines for image
  generation: a Pending video doesn't lock the composer, since it can take
  much longer to resolve.
- **My Creations:** The current user's private gallery of their own assets;
  one of the two tabs in the Assets section, and the only one available in
  Phase 1.
- **Assets:** The private, tab-switched section — My Creations and (once
  P1.6 ships) Liked — embedded on the Studio page below the composer
  (directly below it, or below the Pending module (P0.5) on the rare page
  load where a video is Pending). Not a route or nav item; Studio is the
  only entry point. Introduced in Phase 1 as My Creations only; the Liked
  tab is a Phase 2 addition.
- **Discover:** The public feed combining every user's published generations
  with community- and Maxshot-published examples, sortable by Most recent or
  Most viewed. Read-only — no edit, delete, or "mine vs. theirs" filter.
  Embedded on the Studio page below My Creations (P0.2) — not its own
  routed page.
- **Liked:** A user's private, per-item save list, toggled from a Discover
  card or preview. Shown as the second tab in the Assets section (P1.6),
  embedded on the Studio page — not a route of its own. Not visible to
  other users and does not affect either Discover sort mode.
- **View count:** A simple popularity signal recorded per asset, incremented
  by exactly one each time a user opens that asset's detail view, on any
  surface. Powers Discover's Most viewed sort (P1.3). Distinct from Liked,
  which is private and does not factor into either sort mode.
- **Creator attribution:** The name or label shown on a published,
  non-owned Discover item identifying who made it — an individual creator's
  name, or "Maxshot Team" for the platform's own examples. Both are shown
  with the same badge treatment; there is no separate "verified" or
  "official" visual style.
- **First & last frame:** An Image-to-Video mode where the user supplies
  exactly two reference images — the frame the clip opens on and the frame
  it closes on — instead of the general, unordered reference-image list
  (P1.5). A toggle within Image-to-Video switches between the two modes;
  each keeps its own uploaded images independently.
- **Configured model catalog:** The per-mode set of generation models a user
  picks from (P0.1). Illustrative example, matching the current prototype,
  not a commitment to these specific providers: Image — Seedream 4.0,
  FLUX.1.1 Pro, Midjourney v7, GPT Image 1, Ideogram 3.0, Qwen-Image. Video —
  Kling 2.1, Sora 2, Seedance 1.0 Pro, Wan 2.2, Runway Gen-4, Hailuo 2.3.

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
7. Launch Discover — automatically published, sorted Most recent — plus Try
   this and multi-image reference against real accounts (Phase 2); add
   Most viewed once per-open view tracking is live.
8. Enable Liked once prioritized; it ships code-complete alongside Discover
   but flagged off, so this step needs no engineering lead time (Phase 2).

The [live-demo/](../live-demo) proof of concept may inform step 1 and 2's
request shape but its API-key handling and lack of persistence must not carry
into production.

## 13. Version History

| Date | Version | Changes |
|---|---|---|
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
