# Studio HTML Interaction Prototype

A standalone, single-file HTML/CSS/JS mockup of the "Studio" + "My Creations"
AI content-generation module (text/image → image/video, plus inline editing),
shown embedded inside a lightweight stand-in for the Maxshot Gateway chat
shell.

This is **not** part of the [`frontend/`](../frontend) React application and
does not implement anything from
[`llm-gateway-product-baselines.md`](../llm-gateway-product-baselines.md) or
the PRD docs at the repo root. It exists purely to explore and pressure-test
the Studio interaction design (composer layout, inline editing instead of a
modal, credit-cost display, bilingual EN/中文 support) quickly, with mocked
generation results, before any of it is built against the real stack. Treat it
as a design reference, not a code source to port directly — it has no build
step, no state persistence, and no real model calls.

## Run it

```bash
python3 -m http.server 8743
```

Then open `http://localhost:8743/index.html` (from inside this folder), or
just open `index.html` directly in a browser — everything is inline, no
dependencies.

## What's covered

- **Text to Image** / **Image to Image** — prompt, model, aspect ratio +
  resolution (combined picker), style, reference image upload (local or from
  My Creations), prompt enhance.
- **Text to Video** / **Image to Video** — duration, audio on/off (+ audio
  description), same model/aspect/resolution/style controls.
- **Inline editing** — clicking a generated asset switches the composer
  itself into an editing view (no modal): remove background, upscale, inpaint
  (mask brush), text-guided image edit, and video "extend" (trim a clip +
  choose original/generated audio + describe the continuation).
- **My Creations** — filterable gallery (all / images / videos).
- **Shared credit economy** — every generate/edit action shows and deducts a
  credit cost from a wallet shared with the outer chat shell.
- **EN / 中文** toggle and light/dark/system theme toggle.

## Known gaps

- Style and reference-strength choices aren't persisted onto the generated
  asset's metadata.
- Remove background / Upscale / Inpaint are preview-only — they don't create
  a saved asset or deduct credits.
- Image-to-Video reuses the multi-image reference picker from
  Image-to-Image; a first/last-frame picker would be more accurate to how
  real video models work.
- No negative prompt, seed control, or per-model duration/resolution limits.
