# Model Strategy prototype

A standalone dashboard that demonstrates the Maxshot model-selection strategy with live OpenRouter data.

## Local setup

```bash
cp .env.example .env.local
```

Set `OPENROUTER_API_KEY` in `.env.local`. Then run:

```bash
npm install
npm run dev
```

The app listens on `http://127.0.0.1:4175` by default. Set `PORT` or `OPENROUTER_REFRESH_INTERVAL_MS` in `.env.local` to override the defaults.

The All Models page stores its last successful OpenRouter catalog and fetched image prices in ignored `all-models-data.json`. It loads this file on startup; use **Refresh** on the page to fetch and save current data.

The Venice Models page likewise loads its last successful catalog from ignored `venice-models-data.json` at startup. **Refresh** fetches and saves a new catalog; a failed refresh keeps the saved data.

```bash
npm run test
npm run build
npm run start
```

## Developer reference

- Media Strategy page: [`MEDIA_STRATEGY_REFERENCE.md`](./MEDIA_STRATEGY_REFERENCE.md)
- All Models page: [`ALL_MODELS_REFERENCE.md`](./ALL_MODELS_REFERENCE.md)
- Source of facts: [`ALGORITHM_REFERENCE.md`](./ALGORITHM_REFERENCE.md)
- Executable reference: [`reference-implementation.js`](./reference-implementation.js)
- Conformance tests: [`test/reference-implementation.test.js`](./test/reference-implementation.test.js)
