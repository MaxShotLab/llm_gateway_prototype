**Maxshot UI Visual QA**

- Source visual truth:
  - `reference/maxshot-app/source-desktop.jpg`
  - `reference/maxshot-app/source-mobile.jpg`
  - `reference/maxshot-app/source.css`
- Implementation screenshots:
  - `reference/maxshot-app/implementation/chat-desktop.jpg`
  - `reference/maxshot-app/implementation/chat-mobile.jpg`
  - `reference/maxshot-app/implementation/login.jpg`
  - `reference/maxshot-app/implementation/usage.jpg`
  - `reference/maxshot-app/implementation/api.jpg`
  - `reference/maxshot-app/implementation/api-gateway-desktop.jpg`
  - `reference/maxshot-app/implementation/api-gateway-mobile.png`
  - `reference/maxshot-app/implementation/top-up.jpg`
  - `reference/maxshot-app/implementation/subscription.jpg`
  - `reference/maxshot-app/implementation/memory.jpg`
- Comparison surface: `http://127.0.0.1:5173/qa-maxshot/compare.html`
- API comparison surface:
  `http://127.0.0.1:5173/qa-maxshot/api-compare.html`
- Viewports: 1280 x 720 desktop and 390 x 844 mobile.
- State: public/logged-out Maxshot source compared with the gateway prototype's
  equivalent logged-out shell. The source and implementation have different
  information architectures, so this QA evaluates design-system fidelity rather
  than identical page composition.

**Findings**

- No actionable P0, P1, or P2 design-system mismatches remain.
- The implementation consistently uses Maxshot's pure black canvas, Onest type,
  acid-lime primary actions, charcoal panels, white-alpha borders, dense
  spacing, and compact radii.
- Desktop navigation, feature cards, tables, selected states, code blocks,
  billing controls, and account actions all follow the extracted hierarchy.
- Mobile uses the source hamburger asset and preserves the Maxshot compact
  header/control dimensions while retaining the clone's rail navigation.
- Login, chat, Usage, API, Top Up, Subscription, and Memory have adequate
  foreground/background contrast and consistent interactive states.
- Prompts, Agents, and Skills preserve the same shell, surface, typography,
  control, and responsive rules.

**Agentic Feature Reference**

- LibreChat's public demo is authentication-gated, so authenticated behavior was
  derived from the official Agents and Skills documentation and official UI
  screenshots.
- Agent Builder parity: model, description, instructions, capabilities, skills,
  knowledge upload, edit, and create states are represented.
- Skills parity: reusable named bundles, active catalog state, allowed tools,
  and manual/model/always-on invocation modes are represented.
- Prompt library parity: search, categories, reusable variables, create/edit,
  ownership, and prompt-to-chat insertion are represented.
- A side-by-side visual review of LibreChat's documented Agent Builder and the
  Maxshot implementation confirmed that the same builder hierarchy is retained
  while the established Maxshot visual system remains intact.

**Required Fidelity Surfaces**

- Fonts and typography: passed. The exact Onest variable font from the source is
  bundled locally and applied throughout.
- Spacing and layout rhythm: passed. Dashboard screens use 12-16px grid gaps,
  compact controls, and 20-24px panel padding in line with the source.
- Colors and visual tokens: passed. Primary and alpha token values are recorded
  in `MAXSHOT_UI_SPECS.md`.
- Image quality and asset fidelity: passed. The exact Maxshot logo and menu
  assets are bundled locally; generic interface actions continue to use the
  existing Phosphor icon set.
- Copy and content: passed for the prototype scope. Existing mocked feature copy
  remains unchanged apart from replacing B.AI branding with Maxshot.

**Patches Made**

- Replaced the B.AI logo and typography with Maxshot assets and Onest.
- Rebuilt the global color and surface tokens around `#000`, `#131313`,
  `#1F1F22`, and `#AAF430`.
- Updated buttons, navigation, cards, charts, tables, inputs, dialogs, billing
  selectors, plan states, and memory controls.
- Added the source mobile menu asset for the compact navigation state.
- Added a durable UI specification and preserved the source stylesheet.
- Added functional mock Prompts, Agents, and Skills screens.
- Added prompt-to-chat transfer, agent creation/editing, capability selection,
  skill activation, invocation modes, tool permissions, and responsive builder
  drawers.
- Fixed the builder drawer edge alignment and compact skill-card layout found
  during browser QA.
- Rebuilt Chat as an interactive core workflow with searchable history, model
  routing, temporary conversations, attachments, streaming, web search,
  citations, memory controls, and route-gated zero-retention mode.
- Added responsive conversation history behavior: collapsible on desktop,
  drawer-based on mobile, and automatically dismissed after a mobile
  conversation selection.
- Kept temporary and zero-retention conversations out of persistent mock
  history, with zero retention forcing memory off and temporary processing.
- Expanded API Gateway management with key-level monthly limits, selected-key
  request/token/cost visibility, content-free request logs, serving-provider
  disclosure, and failover details.
- Added one-time secret display for newly created keys, copy feedback, key
  selection, request filters, expandable routing details, and confirmed key
  revocation.
- Corrected the narrow-screen request filters and verified horizontal request
  log access without compressing gateway metadata into unreadable columns.
- Replaced Top Up with the authoritative Fund account model: purchased and
  subscription credit balances, cards, Alipay, USDC, other cryptocurrency
  methods, fee and exchange-rate disclosure, transaction status, receipts, and
  account spending limits.
- Removed the prototype's unsupported annual billing and deposit-match concepts.
- Added monthly subscription renewal, recurring-credit grants, end-of-period
  expiry disclosure, and confirmed plan changes without introducing team
  features.
- Applied a shared compact-density system to every non-chat product page:
  wider usable content, smaller page headings, reduced panel/card padding,
  shorter controls, tighter tables, and denser builder drawers.
- Removed redundant page subtitles, panel explanations, repeated card copy,
  duplicate ownership labels, and nonessential callouts. Preserved only
  decision-critical privacy, billing, expiry, and destructive-action text.
- Verified that headings, buttons, and inputs inherit the same Onest font and
  that the reduced copy remains legible without changing the Maxshot theme.

**Follow-up Polish**

- P3: the chat clone retains its left navigation because the requested product
  information architecture differs from the source's horizontal DeFi header.
- P3: model/provider icons remain prototype glyphs rather than Maxshot-owned
  provider artwork.

**Verification**

- `npm run build` passes.
- All ten navigation destinations render successfully.
- Login modal, account controls, selectors, switches, and mocked actions remain
  functional.
- Prompt insertion, agent creation, capability selection, skill toggles, search,
  filters, editors, and narrow-screen layouts were exercised in the browser.
- Chat history search and collapse, conversation selection, model eligibility,
  temporary mode, zero-retention constraints, mock attachments, response
  streaming/stop, search citations, and desktop/mobile layouts were exercised
  in the browser.
- API key creation and one-time reveal, key selection, spending-limit updates,
  revoke confirmation, request filtering controls, failover expansion, and
  desktop/mobile layouts were exercised in the browser.
- Funding method selection, fee calculation, USDC exchange details, mock
  checkout, transaction insertion, account spending limits, receipts, and
  subscription plan changes were exercised through browser DOM checks at
  desktop and mobile breakpoints.
- Usage, API, Fund account, Subscription, Memory, Prompts, Agents, and Skills
  were checked at desktop density. Titles now render at approximately 25-28px,
  shared panels at 18px padding, and all four prompt cards fit in the initial
  desktop viewport.
- Mobile sub-pages were checked at 390px: content remains within the viewport,
  shared body copy renders at 11px, and no horizontal page overflow is present.
- No browser console warnings or errors were observed.

- Fresh desktop API and mobile Fund account captures were compared alongside
  the Maxshot source at
  `http://127.0.0.1:5173/qa-maxshot/clean-copy-compare.html`.

final result: passed
