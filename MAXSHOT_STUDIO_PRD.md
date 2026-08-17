# Maxshot Studio Product Requirements Document

**Status:** Proposed — not yet part of the approved product baseline
**Related:** [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md), [llm-gateway-product-baselines.md](./llm-gateway-product-baselines.md)
**Prototype:** [studio-prototype/index.html](./studio-prototype/index.html)
**Updated:** August 17, 2026

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
- The Discover feed and the Assets surface (My Creations and Liked).
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
  tied to a single result, most commonly image-to-video.
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

1. Browse Discover, or open Assets (My Creations or Liked).
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
session, same credit balance display, same navigation frame. It adds two
routed surfaces — Studio (which also hosts the Discover feed embedded below
the composer, rather than as its own route, once Phase 2 ships) and Assets
(a single My Creations tab in Phase 1; a Liked tab is added once P1.6 ships)
— and does not introduce a second design system or a second credit balance.

The current prototype ([studio-prototype/index.html](./studio-prototype/index.html))
is a single static HTML/CSS/JS file with mocked generation (results are
placeholder gradients, not real model output) and an in-memory asset store. It
validates composer layout, inline editing, and the Discover/Assets
information architecture. It is not the production frontend foundation, in
the same sense [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §12
describes for the Gateway prototype.

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
  enlarged preview of that reference.
- Reference-strength control — Image-to-Image only (see §11); Image-to-Video
  uses the reference as-is, with no strength control, since it is not a
  blend-toward-prompt operation.
- Video-only duration and audio (on/off, with optional audio description)
  controls.
- Prompt-enhance action.
- Visible credit cost before generating, matching the amount actually
  deducted.

Acceptance:

- A user can complete the full Creator (generate) path for all four modes.
- Generating with insufficient credits is blocked with a clear message and no
  deduction.
- The upload limit appears for both Image-to-\* tabs; the reference-strength
  control and the style picker appear only where §11 defines them (strength:
  Image-to-Image only; style: image modes only).

### P0.2 My Creations

- A private, filterable-by-type (all/image/video) gallery of the current
  user's own generations.
- Opening an item shows a read-only preview: the media, its prompt, its
  reference image(s) if any, and its metadata (P0.4).
- Per-item actions, both as a direct shortcut on the gallery card and inside
  the preview: download, delete.
- Phase 1 is view, download, and delete only. Editing, Animate, asset
  lineage, and Try this are Phase 2 (P1.1, P1.2, P1.4) — a Phase 1 result is
  a finished thing to keep or discard, not yet something to remix.

Acceptance:

- A user can find any of their own past generations by type filter.
- Opening an item shows the read-only preview; there is no edit, Animate, or
  Try this control anywhere in Phase 1.
- Deletion only affects the deleted asset and its own gallery entry.

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
  popularity signal to show yet.

Acceptance:

- A freshly generated asset's preview shows today's date and its
  resolution/aspect.

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
- Image tools: remove background, upscale, inpaint (brush-selected mask),
  text-guided edit.
- Animate (image assets only): a one-click shortcut, available from the
  gallery card or the editing view, that jumps into a new Image-to-Video
  generation with this image pre-filled as the reference. Animate does not
  transform the source image — it starts a new generation from it, the way
  Try this reuses a video's own reference — so it is not metered as an edit
  action; it is billed as a normal video generation (P0.3).
- Video tool: extend — pick a bounded window of the existing clip, choose
  original or newly generated audio, describe how it continues. This is the
  full extent of video "editing" (see §3); it is not a general trim tool.
- Each edit action shows its own configured credit cost before applying.
- An edit produces a new asset; it never overwrites the source.
- Exiting editing returns the composer to its prior generation state.

Acceptance:

- A user can complete the full Creator (edit) path for both image and video
  results.
- The source asset is unchanged and still present after an edit.
- Inpaint requires a painted mask and a description before it can be applied.

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

- Embedded below the Studio composer, on the same page, rather than as its
  own routed surface — a user scrolls from composing straight into Discover
  without leaving Studio or losing composer state.
- A single feed combining the current user's own generations with community-
  and Maxshot-published examples — no "mine vs. theirs" filter, only a type
  filter (all/image/video).
- Every generation is included automatically the moment it's created — there
  is no publish step, review queue, or opt-out (see §3, §9). This is what
  gives view count (P0.4) something to do: once Discover ships, it becomes
  the feed's ranking signal.
- Ranked by view count, most-viewed first. View count is a simple popularity
  signal recorded per asset; it is not the same as Liked (P1.6), which is
  private and does not affect ranking.
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
  with Discover still visible below the composer; the sidebar highlight
  stays on Studio throughout, since Discover has no separate route.
- The feed re-sorts correctly as view counts change (highest first).
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

Acceptance:

- A result made from two reference images shows two reference thumbnails and
  reloads both via Try this.

### P1.6 Liked

- A user can save any Discover item (their own or someone else's) to a
  personal Liked list with a single toggle, from the gallery card or the
  preview.
- Liked is the second tab on the Assets surface, alongside My Creations
  (P0.2). It is a flat, filterable-by-type (all/image/video) gallery of
  everything the current user has saved.
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
navigation:

1. Studio
2. Assets (single tab: My Creations)

Phase 2 does not add a new top-level nav item — inline editing, lineage, and
Try this live inside the existing Studio/Assets routes, and Discover (P1.3)
ships embedded below the Studio composer rather than as its own page. Phase
2 only adds:

3. A Liked tab on Assets, alongside My Creations (currently built but
   disabled by default — see P1.6)

Placement within the overall Maxshot navigation (relative to Chat, Dashboard,
API, Credits, Referral, Profile) is a baseline decision, not this PRD's to
make.

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
- **Animate:** A one-click shortcut on an image asset that jumps into a new
  Image-to-Video generation with that image pre-filled as the reference. Not
  an edit — it starts a new generation, billed as a normal video generation.
- **My Creations:** The current user's private gallery of their own assets;
  one of the two tabs on Assets, and the only one available in Phase 1.
- **Assets:** The private surface for a user's own saved and created content,
  split into two tabs: My Creations (own generations and edits, editable) and
  Liked (saved Discover items, read-only). Introduced in Phase 1 as My
  Creations only; the Liked tab is a Phase 2 addition.
- **Discover:** The public feed combining every user's published generations
  with community- and Maxshot-published examples, ranked by view count.
  Read-only — no edit, delete, or "mine vs. theirs" filter. Lives embedded
  below the Studio composer rather than as its own routed page.
- **Liked:** A user's private, per-item save list, toggled from a Discover
  card or preview. Shown as a tab on Assets. Not visible to other users and
  does not affect Discover's ranking.
- **View count:** A simple popularity signal recorded per asset, used to
  order the Discover feed (highest first). Distinct from Liked, which is
  private and does not factor into ranking.
- **Creator attribution:** The name or label shown on a published,
  non-owned Discover item identifying who made it.

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
7. Launch Discover — automatically published, ranked by view count — plus
   Try this and multi-image reference against real accounts (Phase 2).
8. Enable Liked once prioritized; it ships code-complete alongside Discover
   but flagged off, so this step needs no engineering lead time (Phase 2).

The [live-demo/](../live-demo) proof of concept may inform step 1 and 2's
request shape but its API-key handling and lack of persistence must not carry
into production.

## 13. Version History

| Date | Version | Changes |
|---|---|---|
| 2026-08-13 | Initial PRD | Defined Studio's four generation paths, inline editing, asset lineage, credit integration, and the Assets community library, based on the HTML prototype and its live-demo proof of concept. |
| 2026-08-14 | Assets scope refinement | Scoped Assets to reuse-only: opening any item — including the current user's own published work — shows a read-only preview (media, references, plain-text prompt) with Try this/download only; edit and delete are exclusive to My Creations (P0.4), and returning from either surface's detail view stays on that surface. |
| 2026-08-17 | Discover, Liked, and scope corrections | Split the former Assets library into a public Discover feed (P1.1, ranked by view count) and a private Assets surface with My Creations and a new Liked tab (P1.5) for personal saves — Liked is explicitly not a public/social feature (§3, §9). Documented Animate as a Phase 1 image-asset shortcut into Image-to-Video (P0.2, P0.4, §11). Scoped the reference-strength control and style picker to the modes they actually apply to (Image-to-Image only, and image generation only — P0.1, §11). Reworded the video-editing non-goal so it no longer contradicts the clip-window "extend" requirement it was meant to bound (§3, P0.2). |
| 2026-08-17 | Discover placement, view-first My Creations, result metadata | Moved Discover from its own routed page to embedded placement below the Studio composer (§5.1, P1.1, §10, §11) — a product-layout decision, not a phase change; it remains a P1/Phase 2 requirement. Changed My Creations so opening an item shows a read-only preview first, with Edit/Animate/delete as explicit owner-only actions rather than the default click behavior (§4 Creator (edit), P0.2, P0.4). Added P0.6 Result Metadata Display, requiring creation date, view count, resolution+aspect, and (video) duration on every detail view; view count is now a Phase 1 asset field that defaults to zero, while Discover's ranking behavior built on it stays Phase 2. Documented that reference thumbnails in the composer open an enlarged preview on click (P0.1). Noted that Liked (P1.5) is fully built in the prototype but disabled by default behind a flag pending a product decision. |
| 2026-08-17 | Phase re-scoping, decided auto-publish, Liked framed as ship-dark | Re-scoped Phase 1 down to the minimum that ships fast: generate (P0.1), a view/download/delete-only My Creations (P0.2), credit metering (P0.3), and basic result metadata without view count (P0.4). Moved inline editing, asset lineage, Discover, Try this, and multi-image reference into Phase 2 as P1.1–P1.5, renumbering all cross-references accordingly. Replaced the former P1.4 "Community Publishing (design pending)" with a decided behavior: every result is automatically public in Discover once Phase 2 ships, with no publish step, opt-out, or per-item privacy state (§3, §5.2, §9, P1.3) — a future privacy control is no longer framed as an open design question, just an unscheduled possibility. Reframed Liked (now P1.6) as intentionally shippable dark: fully built, disabled by default, independent of the rest of Phase 2, and re-enabled with a single flag whenever it's prioritized — noted in P1.6, §10, and the Phase 2 migration steps (§12). |
