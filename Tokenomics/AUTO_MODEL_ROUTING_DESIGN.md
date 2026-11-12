# Maxshot Auto Model Routing Design

**Status:** Product design for text Chat; numeric limits and evaluation thresholds pending approval.
**Scope:** Auto model selection in web text Chat only. Image and video generation, API requests, and manual model selection are unchanged. Default web model-list generation is handled separately.

## Product contract

- Auto chooses a provider-model offering for a Chat request under [Multi-Provider Routing Design](./MULTI_PROVIDER_ROUTING_DESIGN.md). OpenRouter is one provider, not a distinct aggregator role.
- The user can always pin an offering manually. Auto shows the selected provider and model for each answer and never silently exceeds the displayed per-message cost ceiling.
- Auto starts with three task labels: **ordinary chat**, **coding**, and **complex reasoning**. A model may carry multiple labels. Existing catalog labels such as Flagship, Code, and Free are not Auto task labels.
- Files, image input, search, Think, context length, and tool support are capability requirements, not additional task labels. Explicit user controls take precedence over prompt inference.
- Auto is limited to an approved subset of the web Chat catalog. The full supported catalog remains searchable for manual selection.

## Approving the Auto pool

1. Screen candidate provider-model offerings for working routes, supported input/output and controls, known customer price and provider cost, bounded request parameters, plan eligibility, and the Auto cost ceiling.
2. Evaluate each candidate on the same representative ordinary-chat, coding, and reasoning tasks. Record task quality, failure rate, latency, and cost. Test attachments, search, and Think separately as capabilities. Provider descriptions and catalog categories alone do not establish task fitness.
3. Assign overlapping task labels only where an offering passes the agreed evaluation. Publish a versioned approval mapping with permitted capabilities, plans, and price range.
4. Aim for two qualified model choices per task, allowing overlap between tasks. Two providers offering the same underlying model do not count as two distinct model choices.

The first evaluation batch is **6-8 candidate offerings total**, not per task. A controlled rollout may approve **3-5 offerings total** if they provide sufficient coverage; that is not a permanent pool-size limit. Expand the pool when a tested offering fills a task, capability, price, or reliability gap, rather than selecting a fixed fraction of the roughly 400-model catalog. If a task has only one qualified model, do not claim resilient model choice for that task.

For pilot budgeting, cap output tokens and provider spend. A **$200-$300 hard cap** is a proposed pilot budget, not an approved recurring operating cost; estimate actual spend from selected models, prompt lengths, and provider prices before execution. Human review and evaluation-set maintenance are additional costs.

## Selection at request time

1. If the user pinned an offering manually, do not run Auto selection.
2. Determine hard requirements from the message, attachments, active controls, conversation context, and plan. Exclude Auto offerings that cannot satisfy them. Search or Think must not be enabled just because Auto infers that they might help.
3. Select a task label using explicit intent first, then lightweight prompt/context rules. When uncertain, use ordinary chat. Do not make an additional paid model call solely to classify the request in the first release.
4. Rank eligible approved offerings for that task using evaluated quality, latency, reliability, and customer cost, with any separately governed commercial preference applied only after hard gates and a performance floor. An existing conversation keeps its selected offering by default; reconsider when a new requirement cannot be met or the offering becomes unavailable.
5. Estimate the selected offering's maximum authorized charge under the agreed cost-control policy. Display the provider, model, and ceiling before submission. Require explicit confirmation before exceeding the displayed Auto ceiling; if the user declines, choose a qualifying lower-cost offering or do not send.
6. Dispatch to the selected offering. A retry must preserve that offering, required capabilities, privacy and plan eligibility, and the authorized charge. Do not silently switch to a different offering after a failed request.
7. Record mapping version, task decision, selected offering, serving provider, estimate, final charge, latency, and status without storing prompt content in routing telemetry.

The exact ceiling amount and cost-reservation algorithm belong in the separate cost-control design. Auto must use those controls, not bypass them. Subscription Basic/Premium eligibility and PAYG fallback continue to follow the subscription requirements; Auto selection does not grant a new allowance.

## Revision and rollout

- Do not relabel models during an individual request. Outcomes and user feedback are evidence for later evaluation, not immediate approval changes.
- Re-evaluate on a schedule and when offering capability, price, or quality changes materially. Publish a new mapping version after review. Disable an unhealthy offering promptly without silently replacing the chosen selection.
- First run in shadow mode beside today's configured-default Auto behavior. Compare proposed choices, capability failures, estimated cost, latency, and task quality without changing user requests. Then enable a limited web Chat rollout.
- Keep model-list publication, routing approval, and route-health changes separately auditable.

## Acceptance checks

- Manual selection never changes; Studio and API behavior are unchanged.
- Auto never submits to an offering lacking a required capability or plan entitlement.
- No request is submitted with an authorized maximum above the displayed Auto ceiling without confirmation, and the selected provider-model offering is visible afterward.
- A provider failure cannot silently change the selected offering or create a duplicate charge.
- Routing decisions can be reproduced from the published mapping and policy versions.

## Open parameters

- Numeric Auto per-message cost ceiling and confirmation presentation.
- Evaluation dataset, pass thresholds, review cadence, and rollout cohort.
- Whether conversation model stickiness should be user-configurable after the first release.

## Version history

| Date | Change |
|---|---|
| 2026-11-04 | Aligned Auto selection to unique provider-model offerings and the multi-provider routing policy. |
| 2026-11-04 | Documented the agreed text-Chat Auto scope, task mapping, small evaluated pool, cost ceiling, and staged rollout. |
