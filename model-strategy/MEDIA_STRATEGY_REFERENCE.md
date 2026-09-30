# Media model selection prototype

This strategy produces **15 image** and **10 video** OpenRouter model IDs, separately from `chat-models.json`. It does not claim the models are available through Maxshot Gateway.

## Sources and refresh

On first visit or after the five-minute server cache expires, the page requests `/api/media-strategy`. The server fetches four OpenRouter sources in parallel:

- `GET /api/v1/models?output_modalities=all`: model IDs, input/output modalities, creation dates, canonical slugs, and image-output token rates.
- `GET /api/v1/images/models`: models served by the dedicated Image API and their supported parameters.
- `GET /api/v1/videos/models`: models served by the dedicated Video API, `generate_audio`, durations, resolutions, and pricing SKUs.
- `GET /api/v1/datasets/rankings-daily?modality=image_output&start_date=…&end_date=…`: image-output token usage for the previous 30 complete UTC days.

The browser filters the cached selection without additional API calls. No image or video generation request is made.

## Eligibility and abilities

Candidates must appear in the general catalog, have the corresponding output modality, and not be expired. Video models must also appear in the dedicated Video API list. Image models outside the dedicated Image API list remain eligible and are marked accordingly. Abilities use the general catalog's input modalities:

| Output | Input | Indicator |
| --- | --- | --- |
| image | text | T2I |
| image | image | I2I |
| video | text | T2V |
| video | image | I2V |
| video | video | V2V |

For Image API models, `input_references.min > 0` means an image is required, so T2I is false even if the catalog lists text input.

Video audio input is shown when the general catalog lists `audio` in `input_modalities`. Video audio output uses the dedicated API's `generate_audio`: `true` = supported, `false` = unsupported, `null` = unreported. These are catalog indicators, not successful-request checks. A model appears once with all applicable indicators; the two selected lists never repeat an ID.

## Scores and selection

Image usage joins on `canonical_slug` (falling back to ID). Weekly usage sums the final seven complete days; monthly usage sums the returned 30-day window. Rank both totals among eligible image models; absent usage scores zero.

```text
rankScore = 1 - (rank - 1) / max(1, rankedCount - 1)
freshness = exp(-max(0, ageDays) / 180)
imageScore = round(100 × (0.45 weeklyRankScore + 0.25 monthlyRankScore
                         + 0.20 freshness + 0.10 (T2I + I2I)/2))
videoScore = round(100 × (0.60 freshness + 0.25 (T2V + I2V + V2V)/3
                         + 0.15 (hasDurations + hasResolutions + hasFrameControls)/3))
```

Sort each medium by score descending, then creation date descending, then ID. Select 15 image and 10 video IDs. Scores are only comparable within the same medium.

The documented model sort currently returns video models alphabetically for `top-weekly` and `most-popular`; the rankings dataset has no video-output filter. Video score therefore does **not** claim to measure popularity. Image output token rates and video pricing SKUs are displayed as source fields, not converted into a comparable per-image/per-video price or used in the score.
