# Maxshot UI Specification

Reference styling was extracted from `https://app.maxshot.ai/` on June 12, 2026.
This implementation baseline was verified against the frontend on June 15, 2026.
When this document and the source differ, the current frontend is authoritative
until both are intentionally updated together.

## Foundations

| Token | Value |
|---|---|
| Canvas | `#000000` |
| Primary surface | `#131313` |
| Raised surface | `#1F1F22` |
| Secondary raised surface | `#232324` |
| Primary text | `#FFFFFF` |
| Secondary text | `#989898` |
| Accent | `#AAF430` |
| Accent subtle | `rgba(170, 244, 48, 0.08)` |
| Accent border | `rgba(170, 244, 48, 0.30)` |
| Standard border | `rgba(255, 255, 255, 0.15)` |
| Divider | `rgba(255, 255, 255, 0.09)` |
| Secondary accent | `#7353FF` |

## Typography

- Family: Onest variable with system sans-serif fallbacks.
- Chat hero: 32-42px, weight 600.
- Product page title: 25-32px desktop and 27px mobile, weight 600.
- Primary section title: 16-22px; card titles: 14-19px.
- Sidebar navigation: 14px, weight 600.
- Product-page actions and inputs: 11px.
- Body, metadata, and supporting labels: 9-12px.
- Tables: 11px body and 9px headers.
- Code and API values: monospace, typically 10-11px.

The local font is stored at
`frontend/public/maxshot-assets/onest-variable.ttf`.

## Shape And Borders

- Primary and secondary buttons: 4-7px radius.
- Product panels and cards: 10px radius.
- Chat composer and large chat surfaces: 12px radius.
- Inputs: 7-10px radius.
- Active navigation: solid lime surface with black foreground.
- Standard surfaces: charcoal background with a one-pixel white-alpha border.
- Selected cards: lime-alpha border with an optional subtle lime fill.
- Shadows are minimal; borders and surface tones provide separation.

## Components

### Global Shell

- Expanded sidebar: 255px; collapsed sidebar: 64px.
- Sidebar navigation item: 44px high.
- Desktop top bar: 88px high with 40px model, account, and login controls.
- Desktop logo: 122x30px.

### Product Actions

- Standard product-page action: 36px high, 11px label.
- Compact product-page action: 34px high.
- Primary action: lime background, black foreground, weight 700.
- Secondary action: lime-alpha background and border, lime foreground.

### Product Panels

- Background: `#131313`.
- Border: `1px solid rgba(255, 255, 255, 0.15)`.
- Radius: 10px.
- Padding: 18px desktop and 15px mobile.
- Adjacent major sections: 12px vertical separation.
- Typical grid gap: 8-12px.

### Feature Builders

- Drawer width: no more than 600px.
- Drawer heading: 20px.
- Form controls: 36px high with 11px labels and values.
- Capability controls: 39px high.

## Layout

- Product content width: `min(1180px, calc(100% - 48px))`.
- Product content padding: 32px top and 56px bottom.
- Product page heading gap: 20px; bottom margin: 22px.
- Product grids use 8-12px gaps unless a component requires more separation.
- Tables scroll horizontally rather than compressing columns below readability.
- At 900px and below, chat history becomes a drawer and the shell compacts.
- At 720px and below, product content uses 14px side margins, 24px top
  padding, 15px panel padding, and stacked responsive layouts as required.
- At 620px and below, the global header and narrow chat controls compact.

## Content Rules

- Product pages lead with one clear title; subtitles and eyebrow labels are
  omitted unless they add decision-critical context.
- Cards do not repeat information already visible in headings, labels, or
  controls.
- Preserve privacy, billing, expiry, retention, and destructive-action
  explanations where they affect a user decision.
- Mock data must be visibly plausible without adding explanatory marketing copy.

## Local References

- `frontend/public/maxshot-assets/logo.svg`
- `frontend/public/maxshot-assets/menu.svg`
- `frontend/public/maxshot-assets/onest-variable.ttf`
- `reference/maxshot-app/source.css`
- `frontend/src/styles.css`
