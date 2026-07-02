# Maxshot UI Visual QA

Last verified against the frontend on June 15, 2026.

## Reference And Evidence

- Source visual truth:
  - [reference/maxshot-app/source-desktop.jpg](./reference/maxshot-app/source-desktop.jpg)
  - [reference/maxshot-app/source-mobile.jpg](./reference/maxshot-app/source-mobile.jpg)
  - [reference/maxshot-app/source.css](./reference/maxshot-app/source.css)
- Current post-density captures:
  - [reference/maxshot-app/implementation/api-clean.png](./reference/maxshot-app/implementation/api-clean.png)
  - [reference/maxshot-app/implementation/funding-clean-mobile.png](./reference/maxshot-app/implementation/funding-clean-mobile.png)
- Current comparison surface:
  - [clean-copy comparison](http://127.0.0.1:5173/qa-maxshot/clean-copy-compare.html)
- Historical regression captures remain in
  [reference/maxshot-app/implementation/](./reference/maxshot-app/implementation/) and
  [frontend/public/qa-maxshot/](./frontend/public/qa-maxshot/).
  They predate the latest density and copy pass and are not current pixel
  references.
- Verification viewports: 1280x720 desktop and 390x844 mobile.

The source and prototype use different information architectures. This QA
therefore evaluates Maxshot design-system fidelity, responsive behavior, and
internal consistency rather than identical page composition.

## Findings

- No actionable P0, P1, or P2 visual mismatches remain.
- The frontend consistently uses the black canvas, Onest type, lime primary
  actions, charcoal surfaces, white-alpha borders, compact radii, and dense
  layout recorded in [MAXSHOT_UI_SPECS.md](./MAXSHOT_UI_SPECS.md).
- Desktop navigation, cards, tables, code blocks, selected states, billing
  controls, and account actions follow the extracted hierarchy.
- Mobile uses the source menu asset and retains compact controls while adapting
  chat history and product grids for narrow screens.
- Login, Chat, Usage, API, Fund account, Subscription, Memory, Prompts, Agents,
  and Skills have consistent contrast and interaction states.

## Feature Coverage

- Login: email-based mock authentication modal.
- Chat: searchable history, model routing, temporary conversations,
  attachments, streaming, web search, citations, memory controls, and
  zero-retention constraints.
- Usage: summary metrics, chart, and usage records.
- API: key creation, one-time secret display, selected-key metrics, monthly
  limits, request logs, provider disclosure, failover details, and revocation.
- Fund account: purchased and subscription credits, cards, Alipay, USDC, other
  cryptocurrency methods, fee and exchange disclosure, transactions, receipts,
  and account limits.
- Subscription: monthly plans, renewal state, recurring credit grants, and
  end-of-period expiry disclosure.
- Memory: memory state, records, and mock management controls.
- Prompts: search, categories, variables, create/edit, and insertion into chat.
- Agents: model, description, instructions, capabilities, skills, knowledge
  upload, create, and edit states.
- Skills: reusable bundles, activation state, allowed tools, and invocation
  modes.

The current sidebar contains nine destinations: New Chat, Prompts, Agents,
Skills, Usage, API, Fund account, Subscription, and Memory. Settings is not
implemented in the current frontend.

## Fidelity Checks

- Typography: passed. The bundled Onest variable font is applied throughout.
- Spacing: passed. Product pages use an 1180px maximum content width, 18px
  desktop panel padding, 15px mobile panel padding, 8-12px grid gaps, and
  34-36px controls.
- Color: passed. Active tokens match [MAXSHOT_UI_SPECS.md](./MAXSHOT_UI_SPECS.md).
- Assets: passed. The Maxshot logo and menu assets are local; generic interface
  actions use Phosphor icons or existing navigation SVGs.
- Content density: passed. Redundant subtitles, panel explanations, repeated
  card copy, ownership labels, and nonessential callouts have been removed.
  Privacy, billing, expiry, retention, and destructive-action copy remains.
- Responsive behavior: passed. Product pages remain within the 390px viewport,
  tables preserve horizontal access, and chat history converts to a drawer.

## Known P3 Differences

- The prototype retains left-rail navigation because its product information
  architecture differs from Maxshot's source application.
- Model and provider marks use prototype glyphs rather than provider-owned
  artwork.
- Only API desktop and Fund account mobile have fresh post-density screenshots;
  other screens were browser-checked but their stored captures are historical.

## Verification

- `npm run build` passes.
- All nine current navigation destinations render.
- Login, account controls, selectors, switches, dialogs, and mock actions work.
- Prompt insertion, agent creation/editing, capability selection, skill
  toggles, search, filters, and responsive builder drawers were exercised.
- Chat history, model eligibility, temporary and zero-retention modes,
  attachments, response streaming, citations, and desktop/mobile layouts were
  exercised.
- API key creation, secret reveal, key selection, limit updates, revocation,
  request filtering, failover expansion, and responsive layouts were exercised.
- Funding methods, fee calculations, exchange details, checkout, transactions,
  limits, receipts, and subscription plan changes were exercised.
- No browser console warnings or errors were observed during the recorded QA.

Final result: passed.
