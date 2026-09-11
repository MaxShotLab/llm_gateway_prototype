# Model Strategy prototype

A standalone dashboard that demonstrates the Maxshot model-selection strategy with live OpenRouter data.

## Local setup

```bash
cp .env.example .env.local
```

Set `OPENROUTER_API_KEY` in `.env.local`, then run:

```bash
npm install
npm run dev
```

The app listens on `http://127.0.0.1:4175` by default. Set `PORT` or `OPENROUTER_REFRESH_INTERVAL_MS` in `.env.local` to override the defaults.

```bash
npm run test
npm run build
npm run start
```

## Developer reference

- Source of facts: [`ALGORITHM_REFERENCE.md`](./ALGORITHM_REFERENCE.md)
- Executable reference: [`reference-implementation.js`](./reference-implementation.js)
- Conformance tests: [`test/reference-implementation.test.js`](./test/reference-implementation.test.js)
