# Model Strategy design specification

The implementation reference is [`design/concept.png`](./design/concept.png), generated specifically for this prototype.

## Visual system

- True white page and panels; cool gray separators; near-black primary text.
- Green is reserved for live, healthy, selected, and valid states.
- System sans for interface copy; system monospace for model IDs and numeric data.
- Six-pixel control radius, one-pixel borders, almost no shadow.
- Dense table-first layout: configuration rail, model table, model detail panel.
- Desktop target: 1536 × 1024. On narrow screens the rail and detail panel become stacked regions and the table scrolls horizontally.

## Visible-copy lock

- Model Strategy
- Live OpenRouter selection
- Strategy
- Category seats
- Scoring weights
- Hard filters
- Selected 30
- Rejected
- Refresh
- Export JSON
- Search models
- Score breakdown
- Why selected
- Availability checks
- Pricing
- Source ranks

## Components

- `AppHeader`: source status, refresh, and timestamp.
- `StrategyPanel`: category quotas, scoring weights, hard filters, validation.
- `SummaryStrip`: selected/category/provider/gate counts.
- `ModelTable`: selected and rejected views with search and row selection.
- `ModelDetail`: score components, selection reasons, health, pricing, ranks.
- `SetupError`: explicit missing-key or upstream failure state.

## Intentional data-spec adjustment

The concept included a Maxshot usage weight. This prototype has no Maxshot telemetry source and must not mock data, so the implementation replaces it with OpenRouter live performance. The weights remain 100 in total.
