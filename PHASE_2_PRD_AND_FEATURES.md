# Maxshot Gateway Phase 2 PRD And Features

**Status:** Draft feature extraction for team discussion
**Scope:** Phase 2 advanced LLM Gateway features
**Updated:** September 21, 2026

## 1. Source And Consistency Check

This file extracts Phase 2 scope from:

- [MAXSHOT_GATEWAY_PRD.md](./MAXSHOT_GATEWAY_PRD.md)
- [PHASE_1_PRD_AND_FEATURES.md](./PHASE_1_PRD_AND_FEATURES.md)

Consistency notes:

- `MAXSHOT_GATEWAY_PRD.md` defines explicit Phase 2 requirements.
- `PHASE_1_PRD_AND_FEATURES.md` does not define Phase 2 details, but clearly
  marks Agents and Toolkits as deferred from Phase 1.
- Phase 2 must extend the Phase 1 framework, account model, usage model, and
  prepaid credit model. It must not replace them.

## 2. Phase 2 Goal

Phase 2 adds advanced chat privacy, memory, reusable builder workflows,
subscription plans, and gateway transparency after Phase 1 acceptance.

The release goal is:

```text
Phase 1 foundation -> advanced chat controls -> memory/prompts/agents/skills -> subscription plans -> gateway transparency
```

## 3. Phase 2 Surfaces

| Surface | Phase 2 Scope |
|---|---|
| Chat | Advanced search UX, search citations, memory controls, zero-retention mode |
| Memory | User-managed saved memories and conversation-level memory control |
| Prompts | Personal prompt library with variables and insertion into chat |
| Agents | Personal agents with model, instructions, knowledge, skills, tools, and usage |
| Toolkits | Skills, fixed tool catalog, and knowledge/tool configuration |
| Subscription | Optional recurring plans alongside pay-as-you-go credits |
| Gateway logs | Content-free request logs, provider visibility, failover details, privacy-route eligibility |

## 4. Phase 2 Feature Extraction

### 4.1 Advanced Chat And Privacy

- Search citations and advanced search UX.
- Conversation memory controls.
- Provider-eligible zero-retention mode.
- Do not save temporary or zero-retention conversations to persistent history.
- Disable memory automatically in zero-retention mode.
- Store only required non-content billing, abuse-prevention, and security
  metadata for zero-retention conversations.
- Data export.

### 4.2 Memory

- View saved memories.
- Add saved memories.
- Edit saved memories.
- Delete saved memories.
- Enable or disable memory for a conversation.
- Show memory use at conversation level.
- Exclude memory from temporary and zero-retention conversations.

### 4.3 Prompts

- Create personal prompts.
- Edit personal prompts.
- Delete personal prompts.
- Search personal prompts.
- Categorize personal prompts.
- Insert prompts into chat.
- Resolve editable variables before submission.

### 4.4 Agents

- Create personal agents.
- Edit personal agents.
- Delete personal agents.
- Search personal agents.
- Configure model, instructions, knowledge files, skills, and allowed tools.
- Start an agent conversation.
- Show per-agent usage.

### 4.5 Skills And Tools

- Create personal skills.
- Edit personal skills.
- Delete personal skills.
- Search personal skills.
- Enable and disable personal skills.
- Store skill name, description, instructions, invocation mode, and allowed
  tools.
- Support manual invocation from chat.
- Support agent-assigned invocation.
- Use a fixed Maxshot-managed tool catalog:
  - Web search.
  - File search.
  - Code interpreter.

Users cannot add custom tools or user-managed MCP servers in Phase 2.

### 4.6 Gateway Transparency

- Content-free request logs.
- Filters by API key, model, status, and date.
- Serving-provider disclosure.
- Failover disclosure.
- Expandable routing details.
- Privacy-route eligibility visibility.

### 4.7 Subscription

Detailed requirements are maintained in
[Subscription Feature Requirements](./SUBSCRIPTION_FEATURE_REQUIREMENTS.md).

Phase 2 adds a second pay-to-use method:

```text
Pay-as-you-go credits + optional subscription plan
```

Pay-as-you-go remains the default usage model. Subscription is an optional
account entitlement that grants a configured monthly Credit allowance. It does
not change per-request pricing.

Must-do features:

- View available plans.
- Subscribe to a plan.
- Change plan.
- Cancel renewal.
- Show current plan, renewal date, allowance, used amount, and remaining
  amount.
- Apply subscription allowance before paid pay-as-you-go credits.
- Fall back to pay-as-you-go credits when subscription allowance is exhausted,
  if the user has usable credits.
- Block usage when both subscription allowance and usable credits are
  insufficient.
- Keep subscription allowance, free credits, paid credits, and referral rewards
  as separate ledger buckets.
- Show usage split by subscription allowance and pay-as-you-go credits.
- Show configurable 5-hour and weekly subscription limits, remaining amounts,
  and reset times in Chat and Usage.
- Warn in-app at 90% consumption for each subscription window.
- Separate subscription usage, payments, and invoices from pay-as-you-go usage,
  top-ups, and receipts.
- Support a tokenized preferred card for recurring billing before subscription
  launch.
- Send renewal, failed-payment, allowance-low, and allowance-exhausted states
  to the UI.

Recommended implementation algorithm:

1. Resolve account entitlement before each billable request.
2. Estimate the maximum required cost from selected model, route, and request
   limits.
3. Check active subscription status and remaining allowance for the current
   billing period.
4. Reserve estimated cost from subscription allowance first.
5. If subscription allowance is insufficient, reserve the remainder from usable
   pay-as-you-go credits.
6. Reject the request before provider execution if neither source can cover the
   estimated cost.
7. Execute the request through the gateway.
8. Convert the gateway metering event into final user-facing cost.
9. Reconcile the reservation:
   - deduct actual cost from subscription allowance first;
   - deduct overflow from pay-as-you-go credits;
   - release unused reservation;
   - create exactly one usage record.
10. On renewal, create a new subscription-period ledger bucket and do not merge
    it with existing pay-as-you-go credit buckets.
11. On cancellation, keep the current period active until period end and stop
    the next renewal.
12. Apply plan changes at the next renewal without prorated Credit refunds.
13. On failed renewal payment, do not create a new allowance bucket. Existing
    pay-as-you-go Credits remain usable immediately.
14. Count gross Credit cost against API-key limits regardless of funding source.
15. Gate subscription usage by the lowest remaining amount across the 5-hour,
    weekly, and billing-period windows.
16. At 100% of a subscription window, use pay-as-you-go Credits when available
    until the window resets.
17. Version plan limits so future protocol changes do not rewrite active or
    historical subscription periods.

Minimum ledger buckets:

| Bucket | Source | Expiry | Consumption order |
|---|---|---|---|
| Subscription allowance | Active plan period | End of billing period | First |
| Free credits | Registered-user grant | Configured policy | Second |
| Referral rewards | Confirmed referral reward | Configured policy | Third |
| Paid credits | User top-up | No expiry | Last |

Subscription allowance is not withdrawable, refundable as credits, or
redeemable back to fiat or crypto.

Automatic monthly renewal requires card billing. Crypto remains a one-time
pay-as-you-go top-up method. Subscription payments do not generate referral
rewards.

There are no trials or refunds. Cancellation disables the next billing cycle
only; the current paid period remains active. Payment execution details follow
the provider interface, notifications are in-app only, and administrative
billing operations are deferred.

## 5. Phase 2 Acceptance Criteria

Phase 2 is acceptable when:

1. Advanced chat, memory, prompts, agents, skills, and gateway logs use
   persistent data and production authorization.
2. Temporary and zero-retention conversations are not saved to persistent
   history.
3. Memory is disabled automatically for zero-retention conversations.
4. Zero-retention controls cannot select an ineligible provider route.
5. Builders cannot select tools outside the fixed Maxshot-managed catalog.
6. Advanced screens reuse Phase 1 account, usage, and credit records.
7. Gateway logs expose routing and failover details without storing prompt or
   response content.
8. A user can subscribe, use allowance, exhaust allowance, fall back to
   pay-as-you-go credits, and see the ledger split correctly.
9. Subscription renewal, cancellation, and failed-payment states are reflected
   without corrupting pay-as-you-go balances.
10. Subscription usage windows, invoices, and payment history are visible and
    separate from pay-as-you-go usage and receipts.

## 6. Explicitly Not Phase 2

The following remain out of scope:

- Organizations, members, roles, and permissions.
- Conversation sharing, branching, collaboration, and generated artifacts.
- Public prompt, agent, or skill marketplaces.
- Agent publishing, revenue sharing, schedules, subaccounts, or budgets.
- User-supplied provider credentials.
- User-managed MCP servers and custom tools.
- Automatic routing by benchmark or quality score.
- Semantic caching, batch inference, and shared capacity pools.
- Anthropic- and Gemini-compatible customer endpoints.
- Promotional rebates.
- Unlimited plans without enforceable usage allowance or abuse controls.
- Trading, deposit, token, or reserve products.

## 7. Initial Priority Order

1. Advanced chat privacy and zero-retention mode.
2. Memory controls.
3. Prompt library.
4. Agents.
5. Skills, tools, and knowledge configuration.
6. Subscription plans and allowance ledger.
7. Gateway transparency and request logs.
8. Data export.

## 8. Open Definition Items

These need product discussion before Phase 2 requirements are finalized:

- Whether Memory, Prompts, Agents, and Toolkits should be separate pages or one
  consolidated Toolkits surface.
- Exact zero-retention provider eligibility rules.
- Whether data export is account-wide, chat-only, memory-only, or all of the
  above.
- Knowledge-file limits, supported file types, and retention policy.
- Code interpreter execution limits and safety boundaries.
- Per-agent usage detail level and billing presentation.
- Subscription plan price and monthly allowance.
- Recurring card billing provider.
- Exact versioned 5-hour and weekly Credit limits.

## 9. Version History

| Date | Version | Changes |
|---|---|---|
| 2026-09-21 | Subscription limits and billing surfaces | Added card prerequisites, preferred payment, invoices, separate PAYG/subscription usage, versioned 5-hour and weekly windows, and in-app 90% warnings. |
| 2026-09-21 | Subscription contract revision | Locked the monthly allowance-only model, immediate PAYG fallback, payment and cancellation rules, and Credit-based API-limit accounting. |
| 2026-07-15 | Subscription scope revision | Added Phase 2 subscription as a second pay-to-use method alongside pay-as-you-go, with feature details and a recommended ledger/reservation algorithm. |
| 2026-07-15 | Initial extraction | Extracted Phase 2 feature scope from the main PRD and Phase 1 deferred surfaces for further definition. |
