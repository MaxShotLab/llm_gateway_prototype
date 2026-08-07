# Maxshot Gateway Product Guide

- **Release:** 1.0
- **Audience:** Prospective and existing users, developers, partners, evaluators, and support teams
- **Last reviewed:** August 7, 2026
- **Console:** [gateway.maxshot.ai](https://gateway.maxshot.ai)
- **Developer documentation:** [docs.maxshot.ai](https://docs.maxshot.ai)

## What Maxshot Gateway Is

Maxshot Gateway gives individuals and developers one account for using multiple AI models. Users can work in a browser chat or connect applications through an OpenAI-compatible API, while funding and monitoring both kinds of usage with the same prepaid Credits balance.

The first release is built around six product areas:

| Area | What it provides |
|---|---|
| Chat | Multi-model conversations, streaming responses, attachments, reasoning, web search, temporary chat, and conversation history |
| Usage | Chat and API consumption trends, request-level token and Credit details, and current balance |
| API | API-key lifecycle management, usage limits, request logs, model catalog, and integration examples |
| Credits | Balance by source, crypto top-up through LI.FI, fee preview, and top-up history |
| Referral | A personal invite link and confirmed referral-reward records |
| Profile | Profile details, login methods, theme, chat retention, and developer mode |

## Who This Guide Is For

This guide is intended for:

- **Prospective users and customers** evaluating whether Maxshot Gateway fits their AI chat or application-integration needs.
- **Existing users** who want a clear overview of the product's capabilities and account model.
- **Developers and technical evaluators** assessing the available API, model access, billing approach, and operational controls.
- **Partners, customer-support teams, and go-to-market teams** who need a consistent description of the Release 1.0 product.

After reading this guide, you will understand:

- What Maxshot Gateway is and the problems it is designed to solve.
- How Chat, API access, Credits, usage reporting, top-up, referrals, and profile settings fit together.
- How Credits are funded, tracked, and consumed across Chat and API requests.
- Which privacy and security protections are visible to users.
- What is included in Release 1.0 and which capabilities are not currently available.

For detailed feature and API reference, use the [Maxshot Gateway Product Document](./MAXSHOT_GATEWAY_PRODUCT_DOCUMENT.md). For screenshot-based operating instructions, use the [Maxshot Gateway User Guide](./MAXSHOT_GATEWAY_USER_GUIDE.md).

## Core Concepts

### One account, multiple login methods

Your Maxshot account is the primary identity. Depending on the login methods currently enabled, you can sign in with a supported OAuth provider or an Ethereum-compatible wallet. Additional login methods can be connected from **Profile**. At least one login method must remain connected.

### Credits

Credits are Maxshot Gateway's prepaid billing unit:

> 1 USD is approximately 1,000,000 Credits.

Your usable balance can contain three separately tracked sources:

1. Free Credits
2. Referral rewards
3. Paid Credits

Credits are consumed in that order, so paid Credits are used last. The model selector and API model catalog show the current price and capabilities for each model; those live values are authoritative and may change as the catalog changes.

### One balance for Chat and API

Browser Chat and API requests draw from the same usable balance. The Usage page keeps the two sources separate in charts and request details.

## Product Capabilities

### Multi-model Chat

Chat includes:

- Searchable model selection with model price, context, and capability indicators.
- **Auto model**, which uses Maxshot's configured default model.
- Streaming responses with stop, copy, edit, regenerate, and delete actions.
- Persistent cloud conversation history with rename and delete controls.
- Reply versions, allowing regenerated answers to be retained and compared.
- Capability-aware file, image, and audio attachments.
- Web search and reasoning controls when supported by the selected model.
- Temporary chat, which is not saved to conversation history.
- Optional developer controls for the system prompt and generation parameters.

Chat uses a platform-managed credential. You do not need to create an API key before using Chat.

### OpenAI-compatible API

The public API base URL is:

```text
https://api.maxshot.ai/v1
```

Users can create multiple keys, name or rename them, set optional daily and monthly Credit limits, set an expiry date, inspect usage, and revoke access. A new secret is displayed only once when the key is created.

The gateway supports common OpenAI-compatible text, response, embedding, image, and audio routes, plus the Anthropic Messages format where a compatible model is available. WebSocket Realtime is not included in this release.

### Usage visibility

Usage combines Chat and API activity without placing prompt or response content in the usage tables. Users can review:

- Current usable balance and monthly Credits used.
- Seven-day, 30-day, and all-time trends.
- Credit or token metrics split between Chat and API.
- Per-request model, input/output token use, Credits, web-search use, and duration.
- Per-key API request history and remaining limits.

### Credits and top-up

The Credits page shows usable, paid, free, and referral balances. Release 1.0 supports crypto top-up through LI.FI using the source chains and tokens shown in the console. Before a transaction, the console presents the estimated payment, network fee, platform fee, and Credits to be received.

The current platform fee is 5%. Final Credit delivery occurs after the on-chain transaction is confirmed and processed. The top-up history is the source of truth for status and credited amount.

Card payment is visible as **Coming soon** and is not available in this release. Credits are for Maxshot usage only; withdrawals and refunds are not supported.

### Referral rewards

Every registered user can share a personal referral link. A reward is created only after the referred user's eligible top-up is confirmed. The **Referral** page shows the currently configured reward rate, per-user cap, earned Credits, confirmed referred volume, and reward status. Values displayed there are authoritative for the active program.

### Profile and preferences

Profile settings include:

- Display name and email.
- Connected OAuth and wallet login methods.
- Light, dark, or system theme.
- Permanent, 90-day, or 30-day conversation retention.
- Developer mode for advanced Chat parameters.
- Log out.

The release interface is English.

## Privacy and Security

- API secrets are shown once. Store them in a secret manager or environment variable, never in source control.
- Revoking a key immediately prevents future authentication with that key.
- Wallet login asks you to sign a message to prove control of the address; it never asks for a private key.
- Uploaded Chat files are account-scoped rather than public assets.
- Temporary chats are not written to persistent conversation history.
- Usage and billing records contain operational metadata, not prompt or response content.
- Destructive conversation, reply-version, login-method, and API-key actions require confirmation in the console.

## Release 1.0 Boundaries

The following are not part of this release:

- Card top-up.
- Credit withdrawal, cash-out, or refund.
- WebSocket Realtime API access.
- Organizations, teams, roles, or shared workspaces.
- Public prompt, agent, or skill marketplaces.
- User-managed model providers, tools, or MCP servers.
- Account deletion from the console.

Model availability, capability tags, context windows, and pricing are dynamic. Always confirm them in the model selector or **API → Docs** before relying on a model in production.

## Support

- Product console: [gateway.maxshot.ai](https://gateway.maxshot.ai)
- Documentation: [docs.maxshot.ai](https://docs.maxshot.ai)
- Telegram support: [t.me/maxshotai](https://t.me/maxshotai)
- X: [x.com/MaxshotAI](https://x.com/MaxshotAI)
- GitHub: [github.com/MaxShotLab](https://github.com/MaxShotLab)
