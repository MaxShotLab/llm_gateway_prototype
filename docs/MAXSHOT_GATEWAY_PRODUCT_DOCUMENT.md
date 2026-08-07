# Maxshot Gateway Product Document

- **Release:** 1.0
- **Audience:** Console users, API developers, advanced users, testers, and support teams
- **Last reviewed:** August 7, 2026
- **Console:** [gateway.maxshot.ai](https://gateway.maxshot.ai)
- **API base URL:** `https://api.maxshot.ai/v1`
- **Product overview:** [Maxshot Gateway Product Guide](./MAXSHOT_GATEWAY_PRODUCT_GUIDE.md)
- **Illustrated operating manual:** [Maxshot Gateway User Guide](./MAXSHOT_GATEWAY_USER_GUIDE.md)

## Who This Document Is For

This document is intended for:

- **Console users** who want to chat with AI models, add Credits, review usage, manage referrals, or update their account settings.
- **API developers** who want to create and manage credentials, integrate an OpenAI-compatible client, select models, and monitor request usage.
- **Advanced users and testers** who need guidance on attachments, reasoning, web search, temporary chat, reply versions, developer mode, and troubleshooting.
- **Customer-support and implementation teams** who need a practical reference for helping users complete common workflows.

After reading this document, you will be able to:

- Log in and complete the first Chat workflow.
- Select a suitable model and use capability-aware Chat controls.
- Add Credits and understand balances, fees, settlement, and top-up status.
- Review Chat and API consumption in the Usage page.
- Create, secure, update, and revoke API keys.
- Call the Maxshot API with cURL, Python, or JavaScript and discover available models.
- Use referrals and profile settings safely.
- Diagnose common Chat, attachment, API, balance, and top-up problems.

## 1. Quick Start

### Step 1: Log in

Open [gateway.maxshot.ai](https://gateway.maxshot.ai). Select an enabled OAuth provider or connect a wallet.

For wallet login:

1. Select **Connect Wallet**.
2. Choose a supported wallet.
3. Approve the sign-in message in your wallet.
4. Return to Maxshot Gateway after authentication completes.

Signing a login message proves ownership of the address; it does not submit an on-chain transaction or expose your private key.

If you received a referral code, expand the referral-code field before login and enter it there. A valid code is also filled automatically when you open a Maxshot referral link.

### Step 2: Confirm or add Credits

Your balance appears in the application header. If you need more Credits, open **Credits** and follow the crypto top-up instructions in [Section 5](#5-add-credits).

### Step 3: Start a Chat

1. Open **New Chat**.
2. Select a model, or enable **Auto model**.
3. Enter a message.
4. Press **Enter** or select **Send**.

The reply streams into the conversation. Use **Stop** if you want to end generation early.

## 2. Navigate the Console

| Page | Use it to |
|---|---|
| New Chat | Talk to models and manage conversations |
| Usage | Review balance, trends, tokens, Credits, and request details |
| API | Create keys, set limits, inspect API usage, and view integration examples |
| Credits | Add Credits and review top-up history |
| Referral | Copy your invite link and review rewards |
| Profile | Update identity, login methods, theme, retention, and developer mode |

On small screens, open the navigation drawer to reach the same pages.

## 3. Use Chat

### Choose a model

Select the model name at the top of Chat. You can search the catalog and compare models grouped by intended use. Each entry shows its current input/output price and capability tags, such as files, images, audio, or reasoning.

Enable **Auto model** to use Maxshot's configured default. While it is enabled, manual model selection is locked.

Model availability and pricing are dynamic. The values displayed in the selector are the current source of truth.

### Use Chat controls

- **Temporary chat:** the conversation is not saved to history. Starting a new chat turns temporary mode off.
- **Web search:** allows a supported model to use live web results for Maxshot Chat. API clients must supply their own request parameters.
- **Think:** enables deeper reasoning on models that support an optional reasoning mode. Some models always reason, and unsupported controls are disabled.
- **Add attachment:** adds a supported file, image, or audio input.

Controls are capability-aware. If a control is missing or disabled, choose a model that supports that capability.

### Add attachments

Select **Add attachment**, choose a supported type, and wait until upload completes before sending.

Supported console formats include:

| Type | Formats |
|---|---|
| Documents and data | PDF, TXT, MD, CSV, JSON, DOCX, XLS, XLSX |
| Images | PNG, JPEG, WEBP, GIF |
| Audio | MP3, WAV |

Limits per message:

- Up to 5 attachments.
- Up to 10 MB per attachment.
- Up to 50 MB total.

The selected model must support the attachment's type. Images can be opened in a preview after upload.

### Manage messages and reply versions

Hover over a message to reveal the available actions:

- **Copy** copies an assistant response.
- **Edit** revises the latest user message and sends the edited branch.
- **Regenerate** keeps the original answer and creates another reply version.
- **Delete version** removes only the selected reply branch when another version exists.
- **Delete** permanently removes the selected round and any downstream branch identified by the confirmation dialog.

When multiple answers exist, use the version arrows below the reply to compare them. A message supports up to 10 reply versions. Delete an older version before regenerating after the limit is reached.

### Manage conversation history

The history panel lets you reopen, search, rename, and delete cloud-saved conversations. Saved conversations are available after reload and on another device signed in to the same account.

Deletion is permanent. Temporary conversations do not appear in history.

### Review response usage

Open an assistant message's output details to see available input, output, cache, reasoning, web-search, and Credit information. The exact breakdown depends on the model and upstream response.

### Enable developer mode

Developer mode is off by default.

1. Open **Profile**.
2. Under **Advanced**, enable **Developer mode** and confirm.
3. Return to Chat and select the gear button.

Available controls include:

| Parameter | Range or behavior |
|---|---|
| System prompt | Up to 3,000 characters; blank means no custom system prompt |
| Temperature | 0–2 in 0.1 steps |
| Top P | 0–1 in 0.05 steps; optional |
| Max tokens | 1–8,192; optional; caps the final answer, not reasoning tokens |
| Frequency penalty | -2 to 2 in 0.1 steps; optional |
| Presence penalty | -2 to 2 in 0.1 steps; optional |

Optional parameters are sent only when enabled. These settings are stored in the current browser for the current account and do not synchronize across devices. Disabling developer mode resets the custom values.

## 4. Review Usage

Open **Usage** to see:

- Current Credit balance.
- Credits used in the current month.
- A 7-day, 30-day, or all-time chart.
- Credits or token metrics.
- Separate Chat and API series, which can be shown or hidden.
- Request details including time, source, model, input/output tokens, Credits, web-search requests, and duration.

Filter the request table by **Chat**, **API**, or **All**, and choose 10, 20, or 50 records per page.

## 5. Add Credits

Release 1.0 supports crypto top-up. Card payment is marked **Coming soon**.

1. Open **Credits**.
2. Choose a preset amount or **Custom**. Enter at least $1 equivalent; the selected source token may have a higher minimum, which the console will display.
3. Keep **Crypto** selected.
4. Select **Continue**.
5. Connect a wallet if needed.
6. Select one of the source chains and tokens offered by the console.
7. Review the LI.FI quote, network fee, 5% platform fee, and estimated Credits.
8. Approve the transaction in your wallet.
9. Wait for the transaction to settle and for Maxshot to process the confirmed on-chain payment.

The account has a dedicated Base settlement address. Same-chain transfers can settle directly; supported cross-chain payments use LI.FI. Only use the source and destination details presented by the console.

### Understand balances

- **Usable balance:** the total available for Chat and API requests.
- **Paid Credits:** Credits received from completed top-ups.
- **Free Credits:** promotional or account-grant Credits.
- **Referral rewards:** confirmed referral Credits.

Consumption order is **free → referral → paid**.

### Track a top-up

Use **Top-up history** to check its status and transaction link. Cross-chain processing and on-chain confirmations can take several minutes. The final confirmed entry—not an earlier estimate—is authoritative for Credits received.

Credits can only be spent in Maxshot. Withdrawals and refunds are not supported.

## 6. Create and Manage API Keys

### Create a key

1. Open **API** and stay on the **Keys** tab.
2. Select **Create API key**.
3. Enter a unique name containing 2–50 characters. Use letters, numbers, spaces, hyphens, underscores, or periods.
4. Optionally set daily and monthly Credit limits. Leave a limit blank for unlimited; if both are set, the daily limit cannot exceed the monthly limit.
5. Optionally set an expiry date.
6. Select **Create API key**.
7. Copy the secret immediately and store it securely.

The secret is shown only once. If it is lost, revoke the key and create a replacement.

### Update or revoke a key

Select a key to:

- Rename it.
- Change daily or monthly Credit limits.
- Change its expiry date.
- Review request count, input/output tokens, Credits used, remaining limits, creation time, and last use.
- Revoke it.

Revocation is permanent and takes effect immediately. Applications using that key will begin failing until they receive a replacement.

### Review API requests

The request log shows the key, requested model, input/output token use, Credits, web-search count, and duration. Filter it by API key and paginate through older records.

## 7. Call the API

### Base URL and authentication

```text
https://api.maxshot.ai/v1
```

Send the key as a Bearer token:

```http
Authorization: Bearer YOUR_API_KEY
```

Use Bearer authentication for every public route, including `/messages`. An `x-api-key` header by itself is not accepted by the current Maxshot gateway.

Keep the key in an environment variable or secret manager. Do not place it in browser code, mobile application bundles, logs, or source control.

### cURL quick start

```bash
curl https://api.maxshot.ai/v1/chat/completions \
  -H "Authorization: Bearer $MAXSHOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openrouter/free",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Summarize Maxshot Gateway in three bullets."}
    ]
  }'
```

### Python with the OpenAI SDK

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["MAXSHOT_API_KEY"],
    base_url="https://api.maxshot.ai/v1",
)

response = client.chat.completions.create(
    model="openrouter/free",
    messages=[
        {"role": "user", "content": "Explain this API in one sentence."}
    ],
)

print(response.choices[0].message.content)
```

### JavaScript with the OpenAI SDK

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.MAXSHOT_API_KEY,
  baseURL: "https://api.maxshot.ai/v1",
});

const response = await client.chat.completions.create({
  model: "openrouter/free",
  messages: [
    { role: "user", content: "Explain this API in one sentence." },
  ],
});

console.log(response.choices[0].message.content);
```

### Stream a response

Set `stream` to `true`. The response uses Server-Sent Events (SSE):

```json
{
  "model": "openrouter/free",
  "stream": true,
  "messages": [{"role": "user", "content": "Write a short launch note."}]
}
```

### Discover models

Use **API → Docs** in the console to search model IDs, inspect price and capability tags, and copy an ID. Programmatically:

```bash
curl https://api.maxshot.ai/v1/models \
  -H "Authorization: Bearer $MAXSHOT_API_KEY"
```

Do not assume a model remains available or keeps the same price. Read the live catalog before pinning a model in production.

### Supported API surfaces

Availability also depends on the selected model.

| Route | Format |
|---|---|
| `/chat/completions` | OpenAI-compatible JSON or SSE |
| `/responses` | OpenAI Responses JSON or SSE |
| `/completions` | Legacy text completions JSON |
| `/embeddings` | Embeddings JSON |
| `/models` | Model list JSON |
| `/messages` | Anthropic Messages JSON or SSE; Bearer authentication with `anthropic-version` |
| `/images/generations` | Image generation JSON |
| `/images/edits` | Multipart image editing |
| `/audio/transcriptions` | Multipart transcription |
| `/audio/translations` | Multipart translation |
| `/audio/speech` | Binary audio response |

A route is usable only when it is enabled in the deployment and a compatible model is available. `/realtime` is not supported and returns `501`; use HTTP streaming instead. Gemini-native `/v1beta` routes are outside the public `/v1` surface.

## 8. Use Referrals

1. Open **Referral**.
2. Select **Copy link**.
3. Share the link with a new user.
4. Review confirmed rewards and referred top-ups on the same page.

Registration alone does not create a reward. The referred user must complete an eligible top-up, and the top-up must be confirmed. The current reward rate and per-user cap are displayed on the Referral page and may be changed by Maxshot.

## 9. Manage Your Profile

Open **Profile** to:

- Edit and save your display name or email.
- Connect or disconnect supported OAuth and wallet login methods.
- Choose light, dark, or system theme.
- Set conversation retention to permanent, 90 days, or 30 days.
- Enable or disable developer mode.
- Log out.

You cannot remove your last login method. Confirm that another method works before disconnecting one.

## 10. Troubleshooting

### Chat cannot send

- Confirm you are logged in.
- Confirm the message is not empty and attachments have finished uploading.
- Check your Credit balance.
- If a capability control is disabled, select a compatible model.
- If generation is already running, stop or wait for it to finish.

### An attachment is rejected

Check its format and size, then confirm the selected model supports that attachment type. Remove failed uploads before sending.

### An API request returns 401

Use the secret shown when the key was created—not its name or displayed prefix. Confirm the header uses `Authorization: Bearer ...`, and verify that the key is not revoked or expired.

### An API request is blocked by quota or limits

Check the account balance and the key's daily and monthly Credit limits. Add Credits or update the limit, then retry. A monthly limit must be at least as large as the daily limit.

### An API request returns 429

Reduce concurrency and retry with exponential backoff and jitter. Do not immediately retry in a tight loop.

### A model or feature is unavailable

Open the live model selector or **API → Docs**. Models and capabilities can change, and not every model supports files, images, audio, reasoning, web search, or every API route.

### A top-up is not credited yet

Check **Top-up history** and the linked on-chain transaction. Cross-chain transfer, settlement confirmation, and indexing are separate steps. If the transaction is confirmed but remains unresolved for an extended period, contact Telegram support with the transaction hash. Never send a private key or seed phrase.

### A conversation disappeared

Temporary chats are not saved. Saved chats can also expire according to the retention setting in Profile. If you intentionally deleted a conversation or branch, it cannot be restored from the console.

## 11. Support and Safety

- Documentation: [docs.maxshot.ai](https://docs.maxshot.ai)
- Telegram: [t.me/maxshotai](https://t.me/maxshotai)
- X: [x.com/MaxshotAI](https://x.com/MaxshotAI)

Maxshot support will never need your wallet seed phrase, private key, or API-key secret. Share only non-secret diagnostic details such as a transaction hash, request timestamp, model ID, or displayed error message.
