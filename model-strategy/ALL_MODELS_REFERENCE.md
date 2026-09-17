# All Models: API and display reference

Scope: the **All Models** page only. It combines the live Maxshot Gateway catalog with cached OpenRouter metadata; not all displayed data comes from Maxshot.

## API flow

```text
Browser ── GET /api/gateway-models ──> local server
                                   ├─ GET https://api.maxshot.ai/v1/models (live)
                                   └─ GET https://openrouter.ai/api/v1/models?output_modalities=all
                                      only when its in-memory cache is empty or older than 5 minutes
```

- The browser calls `/api/gateway-models` on first opening the page and on manual **Refresh**. Switching tabs does not refetch.
- The server calls the Maxshot endpoint on **every** such request with `MAXSHOT_API_KEY` (Bearer). The browser never receives the key.
- All Models has its **own** OpenRouter cache. The server fetches one all-modalities model list on the first request, then reuses it until the cache is 5 minutes old by default (`OPENROUTER_REFRESH_INTERVAL_MS`, minimum 1 minute). A manual **Refresh** fetches OpenRouter only when that cache has expired. It uses `OPENROUTER_API_KEY` (Bearer); neither key is sent to the browser.
- OpenRouter's default `/models` request covers text-output models. `output_modalities=all` also covers non-text models in one request. No sorted lists or rankings dataset are needed for this page.
- If OpenRouter updating fails, the previous metadata remains visible with a warning. With no previous metadata, no rows appear and the page shows an unavailable message.
- All Models makes **no inference or availability-probe request**.

## Display algorithm

1. Read Gateway models from the API response's `data`, `items`, or `data.items` array.
2. Join each Gateway model to cached OpenRouter metadata by **exact model ID**. Hide Gateway models without an exact match; if metadata is unavailable, show no rows and explain why.
3. Search, filter, sort, and paginate the matched list in the browser. Search covers ID, names, description, Gateway tags, modalities, and supported parameters. Filters: Gateway `owned_by`, OpenRouter input modality, minimum context, maximum input price. Sorts: ID, input price, context, OpenRouter creation time.
4. Show Gateway ID/owner/created/object/endpoints and OpenRouter name/description/context/max output/modalities/parameters/pricing/created/expiration/canonical slug. Missing source values display as `—`; do not invent them.
5. Format for reading only: token counts as K/M (exact count on hover), UTC dates (raw source value on hover), and `USD per 1M tokens = OpenRouter USD per token × 1,000,000` (raw per-token price in details). These are **OpenRouter reference prices**, not Maxshot billing rates.

Implementation: `src/GatewayModelsPage.jsx`, `src/lib/gateway-models.js`, and the `/api/gateway-models` handler in `server.mjs`.
