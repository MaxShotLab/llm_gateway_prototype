# SPEC_AGENT_INTEGRATION — external-agent integration guide

**Status:** Product-owned specification, compacted 16 November 2026 (TD-24/45). Every rule has one ID (`AGT-Rnn`). Request, key and funding behavior is owned by [SPEC_BILLING](./SPEC_BILLING.md) and the catalog by [SPEC_PROVIDERS](./SPEC_PROVIDERS.md); this file defines what the published guide must say and cites those rules. Engineering supplies every value marked `[verify]`; nothing marked `[verify]` appears in public instructions until confirmed against the live Gateway.

**Release:** Foundation (build-order step 4). The same path gains AIT Earned Credit in the MAX/AIT release when a funded term is active.

## Overview

An external agent is a client that a developer or creator runs against the Gateway. It uses the owner's account and a scoped API key, and goes through exactly the same authorization, funding and Usage records as the web app. The product deliverable is a versioned guide, plus a machine-readable copy generated from it, that lets an agent authenticate, find an allowed model, make one funded call and find that call in Usage.

## 1. Boundary

- **AGT-R01 · Same account, same ledger.** An agent uses the owner's account, a scoped key (BIL-R12–R17) and the account's Credit ledger. It gets no separate balance, Agent object, Agent Wallet, template system or Tokenomics portal; those are later decisions (TD-24). An MCP surface is not required (TD-45).

## 2. Guide content

- **AGT-R02 · Credential.** How the owner creates a key in Profile → Developer settings and sets its policy (BIL-R12–R16), and how the agent presents it `[verify: header name]`.
- **AGT-R03 · Discovery (TD-45).** One read of the catalog snapshot filtered by the key's allowed catalogs and current availability, returning usable models with their offerings and rate-card versions (PRV-R16–R19). No separate discovery endpoint `[verify: URL and viewer-scoped filter]`.
- **AGT-R04 · Request.** The single-call API: model ID, bounded settings, optional caller ceiling and optional `offeringId` pin (BIL-R13, R20–R22). The response carries the selected and serving offering, rate version, verified units, final charge and the request ID in a header and the body (BIL-R18) `[verify: field names]`.
- **AGT-R05 · Rejection codes.** Each BIL-R24 condition has one stable code: `key_invalid`, `key_revoked`, `key_expired`, `catalog_not_allowed`, `model_unavailable`, `pinned_offering_ineligible`, `over_request_ceiling`, `over_daily_budget`, `over_monthly_budget`, `insufficient_funding` (including Dollar spend not enabled on the key), `job_limit_exceeded` `[verify: exact strings and HTTP status]`.
- **AGT-R06 · Usage lookup.** Fetch one request by ID and list requests by key, with the BIL-R31 fields and the Pending state for media (BIL-R38) `[verify: URLs]`.
- **AGT-R07 · Funding.** What the key can spend (BIL-R15) and that its calls may use the owner's subscription text windows (BIL-R09). From the MAX/AIT release, AIT Earned Credit applies when the model's catalog is in the funded term's set (BIL-R06).
- **AGT-R08 · Versioning.** The guide carries a version; a breaking change bumps it; acceptance runs against the version it names.
- **AGT-R09 · Machine-readable copy.** A `SKILL.md` (or equivalent agent-consumable file) is generated from the guide with verified values filled in and is never maintained by hand. It contains the credential steps, discovery read, a request example, rejection codes, Usage lookup and the version, and never names URLs, models, rates or actions that are not live.

- **AGT-R10 · Safe first use.** The guide makes a pay-as-you-go (or eligible trial) call the default first use, never a token purchase; describes MAX, AIT and Credit features only once deployed and verified; never asks for or displays private keys, seed phrases, full API keys or long-lived secrets in chat; and states which routes are supported (OpenAI-compatible endpoint, custom SDK), that a hosted agent's own reasoning model is not rerouted through Maxshot, and that auxiliary model paths must be verified separately.

## 3. Acceptance

A supported external agent following only the published guide at its named version (AGT-R08–R09):
1. authenticates with a scoped key (AGT-R02);
2. discovers an allowed model from the filtered catalog read (AGT-R03);
3. makes one funded call within the key's limits (AGT-R04, R07);
4. finds the same request by ID in Usage with one charge and one ledger entry (AGT-R06).

A review of the guide finds a PAYG first call, no undeployed token feature, and no request to share secrets (AGT-R10).

Negative cases (AGT-R05): a revoked key, a model outside the key's catalogs, a request over the key's per-request ceiling and a request over the daily budget each stop before provider dispatch with the documented code. In the MAX/AIT release, the same call spends eligible AIT Earned Credit first when a term is funded (AGT-R07).

## 4. Open items for engineering

Base URL, authentication header, catalog read path and viewer filter, request and response field names, rejection code strings and HTTP statuses, Usage lookup paths. These are `[verify]` inputs, not product decisions.
