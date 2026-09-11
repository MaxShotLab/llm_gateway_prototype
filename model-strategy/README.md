# Model Strategy prototype

A standalone dashboard that uses live OpenRouter data to demonstrate how a catalog is filtered into exactly 30 web-chat models.

## Data sources

- OpenRouter Models API: weekly popularity, newest, intelligence, throughput, latency, metadata, and prices.
- OpenRouter Daily Rankings dataset: rolling 30-day model usage.
- OpenRouter model endpoint API: final-candidate availability and one-day uptime.
- OpenRouter chat completions API: real streamed inference checks for Free candidates.

There is no runtime mock or static model fallback. If the API key or upstream data is unavailable, the dashboard shows an explicit error.

## Local setup

```bash
cp .env.example .env.local
```

Set `OPENROUTER_API_KEY` in `.env.local`, then run:

```bash
npm install
npm run dev
```

The app listens on `http://127.0.0.1:4175` by default. The API key is used only by the local Node server and is never returned to the browser.

The server refreshes its OpenRouter snapshot in the background every five minutes by default. `Refresh` and `Run strategy` only recompute against the latest completed snapshot; they never call OpenRouter directly. The dashboard compares decision-relevant data and the resulting default Top 30 with the previous snapshot, then indicates when recalculation can be skipped. Set `OPENROUTER_REFRESH_INTERVAL_MS` to change the interval. A failed background update keeps the last successful snapshot available.

Each background update probes the top 10 Free candidates with a real streamed completion, concurrency 2, a 30-second timeout, and one retry after failure. A probe passes only when it returns HTTP 2xx, non-empty assistant content, and `finish_reason: stop`. Only passing candidates can fill the five Free seats. If fewer than five pass, or at least half of the probe pool is repeatedly rate-limited, the new snapshot is rejected and the previous snapshot remains active.

A refresh recommendation is emitted only when selected model membership, category, or input/output price changes. Score, source rank, age, and ordering changes alone do not require refresh. Selected models are displayed alphabetically within each category rather than ranked within the category.

## Strategy defaults

- Exactly 30 seats: Flagship 8, Reasoning 4, Balanced 6, Economy 4, Code 3, Free 5.
- Weights: Weekly 25, Monthly 20, New 15, Quality 15, Reliability 10, Performance 10, Value 5.
- Hard gates: priced, text output, at least 32K context, not near expiration, at least one healthy OpenRouter endpoint, and successful live inference for Free models.
- Dynamic aliases, stealth models, and alpha/beta models are excluded.

The dashboard can export the selected result in the current `chat-models.json` shape. It does not publish or overwrite production configuration.
