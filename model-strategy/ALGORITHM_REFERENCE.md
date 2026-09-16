# Model Selection Algorithm

## Output

```text
Total 30
Flagship 8
Reasoning 4
Balanced 6
Economy 4
Code 3
Free 5
```

## Data

```text
Candidate universe: /models?sort=top-weekly
Ranks: weekly, newest, intelligence, throughput, latency
Monthly: sum total_tokens by model_permaslug over previous 30 complete UTC days
Health: /models/:author/:slug/endpoints
```

## Hard gates

```text
Valid provider/model ID
Text input and output
Input/output prices known and >= 0
Context >= 32,000
Expiration >= now + 14 days
top_provider exists
Model ID exists in the new-api supported-model set
At least one endpoint:
  status in {missing, null, 0}
  uptime_last_1d >= 95 or missing
Exclude:
  openrouter/*
  stealth/*
  alpha/beta
  :nitro/:floor/:thinking/:extended
```

## Prices

```text
inputPrice = promptPrice * 1,000,000
outputPrice = completionPrice * 1,000,000
weightedPrice = 0.4 * inputPrice + 0.6 * outputPrice
pricePercentile = priceIndex / max(1, pricedModelCount - 1)
```

## Categories

```text
Free:
  inputPrice = 0 AND outputPrice = 0

Code:
  paid AND (
    ID/name matches /code|coder|codestral|devstral|programming/i
    OR coding_index >= 55
  )

Flagship:
  paid
  AND provider in {
    anthropic, deepseek, google, minimax, mistralai,
    moonshotai, openai, qwen, x-ai, z-ai
  }
  AND (
    intelligence_index >= 40
    OR weeklyRank <= 25
    OR monthlyRank <= 25
    OR ageDays <= 30
  )

Reasoning:
  paid
  AND supported_parameters contains
    reasoning | include_reasoning | reasoning_effort
  AND (
    intelligence_index >= 25
    OR weeklyRank <= 75
    OR monthlyRank <= 75
  )

Economy:
  paid AND pricePercentile <= 0.40

Balanced:
  any paid model passing hard gates
```

## Score

```text
rankScore(rank, count) =
  rank missing or count < 2 ? 0
  : max(0, 1 - (rank - 1) / (count - 1))

weekly = rankScore(weeklyRank)
monthly = rankScore(monthlyRank)
newModel = exp(-ageDays / 30)
quality = normalized intelligence_index or rankScore(intelligenceRank)
reliability = clamp(endpointUptime / 100, 0, 1)
performance = (rankScore(throughputRank) + rankScore(latencyRank)) / 2
value = 1 - pricePercentile

score =
  25 * weekly +
  20 * monthly +
  15 * newModel +
  15 * quality +
  10 * reliability +
  10 * performance +
   5 * value
```

## Free inference gate

```text
Invocation: manual "Check Free" only; never in the 5-minute data update
Each new data round starts with Free inference unverified and can still publish 30 models
Show the timestamp and outcome of the previous manual execution

Probe top 10 scored Free candidates
Concurrency: 2
Timeout: 30 seconds
Retry: once after 1 second
Streaming: true
max_tokens: 256
temperature: 0
reasoning.effort: medium, only when supported

Pass:
  HTTP 2xx
  AND non-empty assistant content
  AND no stream error
  AND finish_reason = stop

When a manual check has at least 5 passing Free candidates:
  unprobed/failed Free candidate => rejected in the checked selection
Passing Free candidates < 5 => keep the current selection and report the shortage
>= 50% probe pool receives 429 twice => ignore Free inference results for this round;
  select from otherwise eligible Free models, mark them unverified, and display
  "No availability probes on free models in previous round"
  (pricing and endpoint hard gates still apply)
```

## Allocation

```text
Sort eligible candidates:
  score DESC, model ID ASC

Fill without duplicates:
  Free -> Code -> Flagship -> Reasoning -> Economy -> Balanced

Any quota shortage => reject snapshot
```

## Display

```text
Category order:
  Flagship -> Reasoning -> Balanced -> Economy -> Code -> Free

Within category:
  model ID ASC
  no rank
```

## Refresh fingerprint

```text
sort by model ID:
  [model ID, category, inputPrice, outputPrice]

Refresh required:
  model added/removed
  category changed
  input/output price changed

Ignored:
  score, ranks, age, health metrics, probe latency, category ordering
```

Reference implementation: [`reference-implementation.js`](./reference-implementation.js)
