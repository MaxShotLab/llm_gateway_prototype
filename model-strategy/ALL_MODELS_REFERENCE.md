# All Models: API and display reference

Scope: the **All Models** page only. It lists the OpenRouter catalog; it does not query or compare a Maxshot Gateway model list.

## API flow

```text
Browser ── GET /api/gateway-models ──> local server ──> all-models-data.json
Browser ── GET /api/gateway-models?refresh=1 ──> local server
                                             ├─ GET https://openrouter.ai/api/v1/models?output_modalities=all
                                             ├─ GET https://openrouter.ai/api/v1/images/models
                                             └─ GET https://openrouter.ai/api/v1/videos/models
                                                save the new snapshot to all-models-data.json
Browser ── GET /api/gateway-model-endpoints?model=ID ──> local server
                                                 └─ GET /api/v1/images/models/:author/:slug/endpoints
                                                    when the Image tab is opened after Refresh or no saved price exists
```

- The server loads ignored local `all-models-data.json` at startup. The first page opening reads that snapshot without external requests; if no file exists, it fetches live data and creates one. Switching tabs does not refetch the model lists.
- Manual **Refresh** calls `/api/gateway-models?refresh=1`, fetches the current OpenRouter catalog, image-model, and video-model lists regardless of the normal 5-minute cache, then atomically replaces the JSON snapshot. The server uses `OPENROUTER_API_KEY` (Bearer); the key is not saved or sent to the browser.
- If the OpenRouter catalog request fails, the saved model snapshot remains available with a warning.
- OpenRouter's default `/models` request covers text-output models. `output_modalities=all` also covers non-text models in one request. No sorted lists or rankings dataset are needed for this page.
- All Models makes **no inference or availability-probe request**.
- Endpoint prices are saved in the same JSON file; saved image prices display immediately on later starts, even when older than one hour. Opening the Image tab queues only missing prices; after **Refresh**, it rechecks all image prices when that tab is opened. At most three requests run concurrently, old prices remain visible during updating, and a 429 pauses the remaining queue until the tab is reopened or **Refresh** is pressed. Ordinary endpoint lookups reuse the server's one-hour cache; Refresh bypasses it. Video `pricing_skus` come from the video-models list.

## Display algorithm

1. Use every model ID in the cached OpenRouter catalog. The local response contains OpenRouter metadata and saved endpoint prices only.
2. Search, filter, sort, and paginate in the browser. The main filter has Text/Image/Video only (Text by default) and matches OpenRouter **output modalities**; models with multiple output modalities can appear in multiple filters. Image adds T2I/I2I and Video adds T2V/I2V/V2V ability filters based on input/output modalities; `input_references.min > 0` excludes T2I. A model appears once per main filter with all applicable ability badges. Batch variants remain nested under a matching standard-model row. Other filters: OpenRouter input modality, minimum context, and maximum input price for Text. Sorts: ID, input price for Text, context, OpenRouter creation time.
3. Show OpenRouter name/description/context/max output/modalities/parameters/pricing/created/expiration/canonical slug. Missing source values display as `—`; do not invent them.
4. Text rows show `USD per 1M tokens = OpenRouter USD per token × 1,000,000` (raw per-token price in details). Image/Video rows show abilities plus formats/prices. Image supported resolutions come from `/images/models`; per-provider prices and resolution variants come from image endpoint pricing. Video supported resolutions/durations and `pricing_skus` come from `/videos/models`. Group video rates under T2V/I2V/V2V only when the SKU identifies that mode; generic rates remain “Mode unspecified.” Display source units (for example `/image`, `/second`, or `/video token`); do not infer a fixed duration price or assume every supported resolution has a corresponding rate. Format token counts as K/M (exact count on hover) and UTC dates (raw source value on hover). These are **OpenRouter reference prices**, not Maxshot billing rates.

Implementation: `src/GatewayModelsPage.jsx`, `src/lib/gateway-models.js`, and the `/api/gateway-models` handler in `server.mjs`.
