# Maxshot Studio Product Requirements Document

**Status:** Proposed — not yet part of the approved product baseline
**Related:** [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md), [llm-gateway-product-baselines.md](./llm-gateway-product-baselines.md)
**Prototype:** [studio-prototype/index.html](./studio-prototype/index.html)
**Updated:** August 13, 2026

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
- The Assets library and its relationship to My Creations.
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

- Ship all four generation paths — text-to-image, image-to-image,
  text-to-video, image-to-video — against a configured multi-provider
  generation-model catalog.
- Let a user edit a generated result in place (remove background, upscale,
  inpaint, text-guided edit, video extend) without leaving the generation
  surface or losing their place.
- Record what every result was made from — prompt, reference image(s), parent
  asset — so a user can reopen, compare, and remix it later.
- Meter every generation and edit against the same credit balance the Gateway
  already manages.

### Phase 2 Goals

- Open a shared Assets library where a user's own generations sit alongside
  community- and Maxshot-published examples, all equally reusable.
- Support multi-image reference generation — more than one reference image
  tied to a single result, most commonly image-to-video.
- Add lightweight creator attribution for published community content.

## 3. Non-Goals

- Traditional crop/trim tooling. Image "editing" means AI-driven
  transformation (background removal, upscale, inpaint, text-guided edit);
  video "editing" means text-guided continuation of an existing clip, not
  frame-accurate trimming.
- A general-purpose asset manager (folders, tags, bulk organization). Assets
  and My Creations are flat, filterable-by-type galleries.
- User-supplied generation-provider credentials or arbitrary custom models.
- Real-time collaborative editing of a single result.
- Team- or organization-owned generations. Ownership is per Maxshot account,
  consistent with [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §3.
- Moderation, reporting, and takedown tooling for community-published content.
  Required before Assets ships publishable community content in production;
  out of scope for this PRD (see §9).

## 4. Users And Key Paths

### Creator (generate)

1. Choose Image or Video mode, then Text-to-\* or Image-to-\*.
2. Write a prompt, and for Image-to-\* attach one or more reference images.
3. Choose model, aspect ratio, resolution, and (image) style.
4. Review the credit cost and generate.
5. Find the result in My Creations.

### Creator (edit)

1. Open a result from My Creations or Assets.
2. See its original prompt, reference image(s), and generation metadata.
3. Apply an edit — remove background, upscale, inpaint a masked region, or
   describe a text-guided change (video: describe how the clip continues).
4. Review the credit cost and confirm; the edit produces a new result linked
   back to its source.
5. Compare the new result against the source, or jump back to the source.

### Creator (reuse)

1. Browse Assets or My Creations.
2. Select a result made by themselves, another creator, or Maxshot.
3. Use "Try this" to reload its exact reference image(s) and prompt into the
   composer.
4. Adjust the prompt or reference and generate a new result.

The Reuse path is what makes Assets valuable: every item is a working
recipe, not just a preview image.

## 5. Product Framework

### 5.1 Frontend

Studio extends the same Maxshot shell defined in
[MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §5.1 — same account
session, same credit balance display, same navigation frame. It adds three
routed surfaces (Studio, My Creations, Assets) and does not introduce a
second design system or a second credit balance.

The current prototype ([studio-prototype/index.html](./studio-prototype/index.html))
is a single static HTML/CSS/JS file with mocked generation (results are
placeholder gradients, not real model output) and an in-memory asset store. It
validates composer layout, inline editing, and the Assets/My Creations
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
  resolution, style, duration/audio (video), parent-asset link, and edit type.
- Community-publish state for an asset (private vs. shown in Assets).
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
| Community-publish state and creator attribution | Maxshot services |
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

### P0.1 Generation Composer

- Image/Video mode switch; Text-to-\* / Image-to-\* tab per mode.
- Prompt field with an instructional placeholder per mode (not example-style
  copy).
- Model picker scoped to the active mode's configured model catalog.
- Aspect-ratio and resolution pickers (SD/HD/2K).
- Style picker for image generation.
- Reference-image upload for Image-to-\* — local file or picked from My
  Creations — up to 9 images, with a reference-strength control.
- Video-only duration and audio (on/off, with optional audio description)
  controls.
- Prompt-enhance action.
- Visible credit cost before generating, matching the amount actually
  deducted.

Acceptance:

- A user can complete the full Creator (generate) path for all four modes.
- Generating with insufficient credits is blocked with a clear message and no
  deduction.
- The upload limit and reference-strength control only appear for
  Image-to-\* tabs.

### P0.2 Inline Editing

- Opening a result switches the composer into an editing view in place — no
  modal — showing the result, its prompt, and its metadata.
- Image tools: remove background, upscale, inpaint (brush-selected mask),
  text-guided edit.
- Video tool: extend — pick a clip window, choose original or newly generated
  audio, describe how it continues.
- Each edit action shows its own credit cost before applying.
- An edit produces a new asset; it never overwrites the source.
- Exiting editing returns the composer to its prior generation state.

Acceptance:

- A user can complete the full Creator (edit) path for both image and video
  results.
- The source asset is unchanged and still present after an edit.
- Inpaint requires a painted mask and a description before it can be applied.

### P0.3 Asset Lineage

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

### P0.4 My Creations

- A private, filterable-by-type (all/image/video) gallery of the current
  user's own generations and edits.
- Per-item actions: open (edit), Try this, download, delete.
- Deleting a source asset does not delete results derived from it.

Acceptance:

- A user can find any of their own past generations by type filter.
- Deletion only affects the deleted asset and its own gallery entry.

### P0.5 Credit Integration

- Generation and every edit action deduct from the same usable-credit balance
  [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md) §5.4 defines, using one
  configured cost per action type (for example, image generation, video
  generation, text-guided edit, video extend, remove background, upscale each
  have their own configured cost).
- The credits page's funding flow ([MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md)
  §P0.6) is unchanged by Studio; Studio only spends from the balance it funds.

Acceptance:

- Studio and Gateway usage draw from and report to one combined balance, not
  two.
- A failed generation is not charged.

## 8. Phase 2 Requirements

### P1.1 Assets Library

- A single feed combining the current user's own generations with
  community- and Maxshot-published examples — no "mine vs. theirs" filter,
  only a type filter (all/image/video).
- Every item, regardless of source, shows its prompt and reference image(s)
  and supports Try this and (for the owner) edit.
- Published items not owned by the current user are not deletable by that
  user.
- Non-owned items show a creator attribution badge (name, or a Maxshot-team
  label for official examples).

Acceptance:

- A user can open any Assets item and see the same prompt/reference detail
  regardless of who made it.
- Attempting to delete a non-owned item has no effect and is not offered as a
  control.

### P1.2 Try This

- Available as a one-click action directly on any gallery card (My Creations
  or Assets) and inside the full editing view.
- Loads the asset's own reference image(s) — itself, for an image; its stored
  reference(s), for a video made from one or more images — and its prompt
  into the composer, in the matching mode/tab, ready to generate.

Acceptance:

- Try this on an image-to-video result restores every reference image it was
  made from, not only the first.
- Try this never mutates the source asset.

### P1.3 Multi-Image Reference

- A single generation (most commonly image-to-video) may be made from more
  than one reference image.
- The resulting asset records every reference used, in order.
- The editing view's "reference used" row and Try this both reproduce the
  full set.

Acceptance:

- A result made from two reference images shows two reference thumbnails and
  reloads both via Try this.

### P1.4 Community Publishing (design pending)

- A user's own generations must have an explicit, user-controlled decision
  about whether they appear in the shared Assets feed versus staying private
  to My Creations only.
- This PRD does not yet specify that control's default state, UI, or
  reversibility — see §9.

Phase 2 acceptance:

- Each feature works with persistent data and real account authorization, not
  the prototype's in-memory store.
- Assets never exposes a non-owned item's delete control.

## 9. P2 Deferred And Out-Of-Scope Work

- Moderation, reporting, and takedown tooling for community-published
  content.
- The publish/private decision's concrete UX (P1.4 names the gap; design is
  deferred).
- Comments, likes, follows, or any other social interaction on Assets items.
- Per-item licensing or usage-rights declarations for community content.
- Team- or workspace-shared Assets libraries.
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
2. My Creations

Phase 2 adds:

3. Assets

Placement within the overall Maxshot navigation (relative to Chat, Dashboard,
API, Credits, Referral, Profile) is a baseline decision, not this PRD's to
make.

## 11. Terminology

- **Studio:** The generation and editing surface covered by this PRD.
- **Generation:** A billable request that produces a new image or video
  asset from a prompt and, for Image-to-\*, one or more reference images.
- **Asset:** A generated image or video and its recorded metadata (prompt,
  reference image(s), model, aspect ratio, resolution, style, lineage).
- **Reference image:** An image supplied to steer a generation — uploaded, or
  selected from My Creations or Assets.
- **Reference strength:** How closely an Image-to-Image result should follow
  its reference image versus its prompt.
- **Edit:** A billable action that produces a new asset from an existing one
  (remove background, upscale, inpaint, text-guided edit, video extend).
- **Parent asset / lineage:** The source asset an edited or extended result
  was derived from.
- **Try this:** Reloading an asset's own reference image(s) and prompt into
  the composer to generate a new result from the same recipe.
- **My Creations:** The current user's private gallery of their own assets.
- **Assets:** The shared gallery combining the current user's assets with
  published community and Maxshot examples.
- **Creator attribution:** The name or label shown on a published,
  non-owned Assets item identifying who made it.

## 12. Prototype Migration

The current prototype validates composer layout, inline editing, and Assets
information architecture with mocked generation and an in-memory store. It is
not the production frontend foundation, per the same reasoning
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
5. Ship My Creations and inline editing against persisted data (Phase 1).
6. Design and ship the publish/private control, then Assets and Try this
   against real accounts (Phase 2).

The [live-demo/](../live-demo) proof of concept may inform step 1 and 2's
request shape but its API-key handling and lack of persistence must not carry
into production.

## 13. Version History

| Date | Version | Changes |
|---|---|---|
| 2026-08-13 | Initial PRD | Defined Studio's four generation paths, inline editing, asset lineage, credit integration, and the Assets community library, based on the HTML prototype and its live-demo proof of concept. |
