# Studio PRD §P0.6 Model Pricing Page — superseded text

Moved out of `spec/MAXSHOT_STUDIO_PRD.md` on 16 November 2026. Superseded by TD-34 and [SPEC_PROVIDERS §4](../SPEC_PROVIDERS.md#4-pricing-and-customer-display). Kept so model-detail ideas can be reconciled with the live catalog later; not authoritative.

**Superseded placement and pricing rules:** The standalone shell Pricing item
and model-level/source-catalog price requirements below describe the earlier
prototype. The current design places Models & Pricing under Providers and
compares customer rate cards by admitted provider-model offering; see the
[SPEC_PROVIDERS §4](../SPEC_PROVIDERS.md#4-pricing-and-customer-display). Retain unrelated
Studio model-detail requirements until reconciled with the live catalog.

- A Pricing entry in the shell navigation (in the prototype, between Credits
  and Referral) lists what each model costs, so a user can compare models
  before choosing one. It is a shell-level page shared with the Gateway: the
  Text tab is the Gateway's chat catalog, while the Image and Video tabs are
  Studio's. Where Pricing sits in the navigation is a baseline decision (§10).
- Three tabs — Text, Image, Video — each showing its model count. One search
  field filters the active tab by model ID or name.
- Image and Video show a broader model catalog than Studio's selectable
  subset. Being listed on Pricing does not make a model available in Studio.
- Columns follow the Text tab: Model ID, Input, Output, and a Copy action for
  the ID. Image and Video add an Abilities column — T2I and I2I for images,
  T2V, I2V, and V2V for videos. Text keeps Input / 1M tokens, Output / 1M
  tokens, and Cache read / 1M.
- Prices show in Credits with the USD equivalent beneath (1 Credit =
  $0.000001), and the billing unit appears with the price — per image, per
  second, per 1M tokens, or per megapixel. Token rates are always quoted per
  1M tokens. When a model has several rates, Output shows the cheapest as
  "from"; rates for turning an existing video into a new one (V2V) are not
  used for that headline.
- A model with more than one rate has an "All N rates" control that expands
  the row. It states the supported resolutions and durations, then lists the
  rates grouped by the mode the source names (T2V, I2V, V2V, Input charges);
  rates the source doesn't tie to a mode stay under "Mode unspecified". Each
  group is a small table of rate, Credits, and USD, ordered base rate first
  and then by resolution, with the unit stated once in the header.
- A model that has providers shows "N providers"; opening it lists each
  provider's name, tag, and prices. For Text this includes cache rates and any
  long-prompt tier.
- Selecting a model fills a details panel beside the list (below it on a
  narrow window): name, ID with a Copy ID action, description, an overview, the
  model's pricing, its providers, and its catalog fields. The overview shows
  context window, max output, and price per 1M tokens for Text; and abilities,
  resolutions, durations, aspect ratios, first/last-frame support, audio
  generation, and reference-image limit for Image and Video. Every model also
  shows its release date.
- A price here is a reference rate. The composer shows the server estimate,
  hard maximum and funding hold before submission; actual settlement follows P0.3.

Acceptance:

- Every model in the Studio picker has a row on the Image or Video Pricing
  tab; Pricing may also list models not selectable in Studio.
- Searching narrows only the active tab, and switching tabs keeps each tab's
  own selection.
- Selecting any model shows its details; opening "All N rates" or a provider
  list doesn't change the selection.
- Copy puts exactly the model ID on the clipboard and confirms it.
- A model whose source reports no price shows "-" rather than 0.

Known gaps — not yet specified, to be decided before this page is final:

- Studio's composer allows options some models don't support: 2–10 second
  durations (Veo accepts only 4, 6, or 8; Seedance starts at 4), 21:9 (several
  image models and Veo don't offer it), and up to 9 reference images (some
  models accept 0 to 4). The page should show these limits on the row, and the
  composer should keep an unsupported combination from being submitted.
- No estimate of a typical single generation (for example a 4-second 720p clip
  with audio), and no mapping from Studio's SD / HD / 2K to each model's
  resolution tiers. Models billed per video token can't be priced per clip
  without a tokens-per-second figure.
- The "from" price for models with audio variants is the no-audio rate, while
  Studio defaults audio on.
- Not shown, though the source has them: long-prompt tier prices and other
  charges (web search, image input) outside the provider list, mandatory
  reasoning, batch variants shown apart from their base model, retirement
  dates, knowledge cutoff, and per-provider context, quantization, and uptime.
- Latency, throughput, and usage popularity have no data source in the
  prototype; for video, expected generation time matters to the Pending
  behavior in P0.5.
- No sorting, filters, or paging beyond search, and no visible "updated at"
  or refresh.

