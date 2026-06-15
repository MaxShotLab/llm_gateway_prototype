# Maxshot UI Specification

Extracted from `https://app.maxshot.ai/` on June 12, 2026 and applied to the
local gateway prototype.

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

- Family: Onest variable, with system sans-serif fallbacks.
- Page title: 30-40px, weight 600, tight negative tracking.
- Section title: 20-24px, weight 600.
- Primary navigation/action: 14-16px, weight 600-700.
- Body: 14px, weight 400.
- Supporting labels: 11-12px, uppercase where used for section context.
- Code and API values: monospace, 12-13px.

The local source font is stored at:
`frontend/public/maxshot-assets/onest-variable.ttf`.

## Shape And Borders

- Primary buttons: 4-7px radius.
- Cards and dashboard panels: 8-12px radius.
- Inputs and composers: 8-12px radius.
- Active navigation: solid lime surface with black foreground.
- Standard panels: charcoal background with a one-pixel white-alpha border.
- Selected cards: lime-alpha border, optionally with a subtle lime-tinted fill.
- Shadows are minimal; separation comes from borders and tonal surfaces.

## Components

### Primary Action

- Background: `#AAF430`
- Foreground: `#000000`
- Weight: 700
- Height: approximately 40-48px

### Secondary Action

- Background: `rgba(170, 244, 48, 0.08)`
- Border: `1px solid rgba(170, 244, 48, 0.30)`
- Foreground: `#AAF430`

### Dashboard Panel

- Background: `#131313`
- Border: `1px solid rgba(255, 255, 255, 0.15)`
- Radius: 12px
- Internal spacing: 20-24px desktop, 16-18px mobile

### Navigation

- Inactive: transparent, white/gray foreground.
- Hover: white-alpha fill.
- Active: lime background with black text and icon.
- Desktop logo dimensions: 122x30px.

## Layout

- Desktop content maximum: approximately 1040px.
- Desktop outer content padding: 28-40px.
- Dense grids use 12-16px gaps.
- Desktop top controls are 40px high.
- Mobile breakpoint: below approximately 900px.
- Mobile content padding: 16px.
- Mobile type and cards retain desktop density rather than becoming oversized.
- Tables become horizontally scrollable when columns cannot fit.

## Local Assets

- `frontend/public/maxshot-assets/logo.svg`
- `frontend/public/maxshot-assets/menu.svg`
- `frontend/public/maxshot-assets/onest-variable.ttf`

The source stylesheet is preserved for reference at:
`reference/maxshot-app/source.css`.
