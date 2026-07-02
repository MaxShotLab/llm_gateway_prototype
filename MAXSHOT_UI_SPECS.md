# Maxshot UI Specification

Reference styling was extracted from [app.maxshot.ai](https://app.maxshot.ai/)
on June 12, 2026. This implementation baseline was verified against the
frontend on June 15, 2026. When this document and the source differ, the current
frontend is authoritative until both are intentionally updated together.

## Design Intent

Maxshot should feel like a precise technical workspace rather than a marketing
site. The interface is compact, dark, and model-centric: users should always be
able to see where they are, which model or key they are using, what it costs,
and what privacy or spending limits apply before a billable action happens.

The visual model is simple:

- Black workspace, charcoal product surfaces, lime for primary action and
  selected state, purple only for secondary API or usage accents.
- Dense but readable controls; no oversized cards, decorative gradients, or
  explanatory hero sections inside the app.
- One primary task per screen, with supporting records, limits, and audit
  details close to the task.
- Product copy is short and operational. It names the object, state, cost,
  limit, provider, route, or consequence instead of selling the feature.

## Product Surface Model

Phase 1 production navigation:

1. Chat
2. Usage
3. API
4. Top-up
5. Settings

Phase 2 adds:

6. Prompts
7. Agents
8. Skills
9. Memory

The prototype may expose Phase 2 screens during development, but production
release framing must keep Phase 1 and Phase 2 scope visually distinct. Do not
present Prompts, Agents, Skills, or Memory as required Phase 1 completion
criteria.

Each product page follows the same high-level composition:

- App shell: fixed sidebar plus sticky top bar.
- Page heading: one clear title and one page-level action only when needed.
- Task surface: the form, chat, key list, top-up selector, or settings group.
- Evidence surface: usage records, request logs, funding history, receipts, or
  state details.
- Confirmation surface: modal or inline result for irreversible, secret, or
  payment-related actions.

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
| Success | `#AAF430` with black text for strong states |
| Warning | `#F6C85F` used sparingly for pending or risk states |
| Danger | `#FF5F57` used only for destructive actions and failed states |

### Theme Rules

- Use true black for the app canvas. Do not substitute navy, slate, cream, or
  warm off-white.
- Use charcoal panels for product surfaces. Subtle tonal shifts separate nested
  data only when borders are not enough.
- Lime indicates the primary command, selected navigation, active toggles, and
  successful usable state. Avoid lime as decorative fill.
- Purple is secondary. Use it for API or route differentiation, not primary
  completion.
- Borders carry most separation. Shadows should be absent or nearly invisible.
- Gradients are allowed only as low-contrast technical surface treatments and
  must not compete with user data.

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
[frontend/public/maxshot-assets/onest-variable.ttf](./frontend/public/maxshot-assets/onest-variable.ttf).

### Type Behavior

- Use Onest for all app chrome, headings, controls, labels, and data cards.
- Use monospace only for API keys, endpoint URLs, request IDs, code examples,
  model IDs, route IDs, and token-like values.
- Keep heading letter spacing tight but not decorative. Body, labels, buttons,
  and table text use normal letter spacing except uppercase metadata labels.
- Prefer 600 weight for headings and selected controls, 700 for primary action
  labels, and 400-500 for body and table content.
- Never rely on browser-default button, select, input, or table typography.
- On mobile, reduce layout density before shrinking text below 9px.

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

Shell UX:

- Sidebar navigation names destinations, not feature descriptions.
- Active navigation uses lime fill with black foreground.
- The top bar should expose the currently selected model, account identity,
  available credits, and login/account action when relevant.
- Collapsed sidebar keeps destination icons aligned to the expanded rail.
- Mobile uses a drawer-style navigation entry and must preserve access to model
  selection, account balance, and login/account state.

### Product Actions

- Standard product-page action: 36px high, 11px label.
- Compact product-page action: 34px high.
- Primary action: lime background, black foreground, weight 700.
- Secondary action: lime-alpha background and border, lime foreground.

Action hierarchy:

- One primary action per task region.
- Secondary actions should not look like disabled primary actions.
- Destructive actions use danger styling and require a confirmation modal when
  the effect cannot be undone.
- Copy actions show a temporary copied state without moving layout.
- Secret-display flows must clearly state that the secret cannot be revealed
  again.

### Product Panels

- Background: `#131313`.
- Border: `1px solid rgba(255, 255, 255, 0.15)`.
- Radius: 10px.
- Padding: 18px desktop and 15px mobile.
- Adjacent major sections: 12px vertical separation.
- Typical grid gap: 8-12px.

Panel rules:

- Use panels for task surfaces, records, tables, settings groups, and modals.
- Do not put full page sections inside decorative card wrappers.
- Avoid nested cards. If a panel needs internal separation, use rows, dividers,
  compact metric cells, or slightly raised sub-surfaces.
- Repeated cards should contain one object each: key, prompt, agent, skill,
  memory, plan, payment method, transaction, or receipt.

### Feature Builders

- Drawer width: no more than 600px.
- Drawer heading: 20px.
- Form controls: 36px high with 11px labels and values.
- Capability controls: 39px high.

Builder UX:

- Builders use drawers or modals for create/edit, not page-level detours.
- Required fields appear first: name, model or type, instructions or body.
- Capabilities and tools use toggles or checkbox rows with concise labels.
- Save, cancel, and destructive actions stay visible at the bottom of the
  builder region.
- Builders must not expose custom tools or user-managed MCP servers.

### Gateway Controls

Model, provider, route, limit, privacy, and balance controls are core gateway
UI, not secondary settings.

- Model selector: show display name, model ID where useful, price, and
  capability flags such as web search, reasoning, files, or zero retention.
- Provider disclosure: show serving provider in request logs and route details,
  but keep the chat composer focused on the user-selected model.
- Failover detail: disclose when failover happened, primary provider, fallback
  provider, reason, latency, status, and final cost.
- API key rows: show key name, prefix, created date, last used state, spend
  progress, limit, and revoke action.
- Spending limits: support unset, daily, monthly, and account-level states where
  product scope requires them.
- Privacy controls: temporary chat and zero-retention must communicate storage
  effect, route eligibility, and memory/history interaction before submission.

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

### Page-Specific UX

#### Chat

- The chat screen is the primary product surface, not a landing page.
- Empty state centers the prompt task and keeps the composer immediately
  available.
- Composer controls expose attachments, web search, reasoning, temporary chat,
  zero retention, stop, retry, and send only when applicable.
- The selected model and price must be visible before a message can create
  billable usage.
- Saved history can be searched, reopened, renamed, and hidden on small screens.
- Temporary and zero-retention conversations must not appear in persistent
  history after completion.

#### Usage

- Usage combines chat and API records.
- Summary metrics show current-period requests, input tokens, output tokens,
  credit cost, and available credit impact.
- Records must not show prompt or response content.
- Provide filters and export without making the table unreadable.

#### API

- API page starts with the OpenAI-compatible base URL and documentation entry.
- API key creation displays the secret exactly once and requires the user to
  acknowledge saving it.
- Key details show request count, token totals, spend, remaining limit, and last
  use.
- Request logs are table-first on desktop and horizontally scroll rather than
  collapsing into cards.
- Expanded rows show route, failover, request ID, content logging, status, and
  provider detail.

#### Top-Up

- Top-up shows one usable spend balance while preserving free, paid, and
  referral credit distinctions where they affect expiry or ledger behavior.
- Funding amount, method, fees, exchange rate, final credits, and status must be
  visible before confirmation.
- Payment methods should be compact selectable rows or tiles, not marketing
  cards.
- Receipts and failed states stay in the same operational visual system.

#### Settings

- Settings owns profile, monthly account spending limit, usage alerts, and
  session actions.
- Account deletion is out of scope and must not appear.
- Settings should use compact grouped panels, not a broad profile landing page.

#### Phase 2 Builders

- Prompts, Agents, Skills, and Memory inherit the same shell, density, and
  panel rules.
- Search and filters remain above result grids or lists.
- Agent and skill builders must restrict tools to the fixed Maxshot catalog:
  web search, file search, and code interpreter.
- Per-agent usage appears as operational data, not promotional proof.

## Content Rules

- Product pages lead with one clear title; subtitles and eyebrow labels are
  omitted unless they add decision-critical context.
- Cards do not repeat information already visible in headings, labels, or
  controls.
- Preserve privacy, billing, expiry, retention, and destructive-action
  explanations where they affect a user decision.
- Mock data must be visibly plausible without adding explanatory marketing copy.
- Do not use homepage language such as "unlock", "supercharge", "seamless", or
  "all-in-one" inside the app.
- Prefer exact object labels: `API key`, `Request log`, `Monthly limit`,
  `Available credits`, `Serving provider`, `Failover`, `Temporary chat`,
  `Zero retention`.
- Use absolute monetary and credit values when showing spend, limits, fees, or
  funding results.
- Error states should say what failed, whether usage was charged, and what the
  user can do next.

## Interaction States

Every reusable component needs visible states:

- Default
- Hover
- Focus-visible
- Selected or active
- Disabled
- Loading or pending
- Success
- Warning
- Error

Required interaction confirmations:

- API key copied
- API key secret saved
- API key revoked
- Monthly limit saved
- Top-up started, pending, completed, or failed
- Referral reward pending, granted, withheld, or revoked
- Prompt inserted into chat
- Agent or skill saved
- Memory added, edited, disabled, or deleted

## Accessibility

- Maintain high contrast on black and charcoal backgrounds.
- Focus rings use lime and must remain visible inside panels and modals.
- Tables need semantic headers, row labels where useful, and horizontal scroll
  on mobile.
- Icon-only actions require accessible labels and hover titles where the
  meaning is not obvious.
- Dialogs must use `role="dialog"`, `aria-modal="true"`, and a labeled heading.
- Motion should be short and functional, with reduced-motion support for
  animated streaming, drawers, and modals.

## Simple Technical Model

The production UI should remain easy to reason about:

- React and TypeScript own the app shell, routing, product pages, stateful
  forms, and shared design-system components.
- assistant-ui owns chat thread, message, composer, attachment, action, and
  streaming presentation primitives.
- Maxshot services own identity, balances, conversations, usage records,
  funding transactions, prompts, agents, skills, memory, referrals, and
  product authorization.
- New API owns provider configuration, customer API-key enforcement, route
  execution, metering events, and failover metadata.

Frontend component boundaries:

- `Shell`: sidebar, top bar, account state, model entry point, responsive app
  frame.
- `Chat`: assistant-ui composition, model selection, privacy controls, history,
  composer, streaming state, and citations.
- `Usage`: summary metrics, filters, records, export, empty/error states.
- `API`: key list, create-secret flow, key limits, request logs, route detail,
  docs link.
- `TopUp`: balances, amount selection, payment method, fee disclosure,
  checkout state, receipts, history.
- `Settings`: profile, account spending limit, alerts, session actions.
- `Builders`: prompts, agents, skills, and memory after Phase 1 acceptance.

Shared primitives should include buttons, icon buttons, panels, table wrappers,
metric cells, status pills, filters, form rows, modals, drawers, empty states,
and toast-like copied/saved states. Avoid creating one-off visual components
when a primitive already exists.

## Local References

- [frontend/public/maxshot-assets/logo.svg](./frontend/public/maxshot-assets/logo.svg)
- [frontend/public/maxshot-assets/menu.svg](./frontend/public/maxshot-assets/menu.svg)
- [frontend/public/maxshot-assets/onest-variable.ttf](./frontend/public/maxshot-assets/onest-variable.ttf)
- [reference/maxshot-app/source.css](./reference/maxshot-app/source.css)
- [frontend/src/styles.css](./frontend/src/styles.css)
