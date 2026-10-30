# Maxshot Gateway and Studio Product Document

- **Release:** 2.0
- **Audience:** Console users, creators, API developers, advanced users, testers, and support teams
- **Last reviewed:** October 30, 2026
- **Console:** [gateway.maxshot.ai](https://gateway.maxshot.ai)
- **API base URL:** `https://api-gateway.888646.xyz/v1` (shown on the API page)
- **Related:** [Product Guide](./MAXSHOT_GATEWAY_PRODUCT_GUIDE.md) and [illustrated User Guide](./MAXSHOT_GATEWAY_USER_GUIDE.md)

## Who This Document Is For

- **Console users** who want to chat with AI models, add Credits, review usage, manage referrals, or update account settings.
- **Creators** who want to generate images and videos from text or reference images, follow their results, and reuse them.
- **API developers** who want to create and manage keys, integrate an OpenAI-compatible client, select models, and monitor usage.
- **Advanced users and testers** who need guidance on attachments, reasoning, web search, reply versions, developer mode, and every generation path, status, limit, and error.
- **Customer-support and implementation teams** who need a practical reference for helping users complete common workflows.

After reading this document, you will be able to:

- Log in and complete a first Chat, a first image, and a first video.
- Choose a model and use its options and capability-aware controls.
- Add Credits and understand balances, fees, settlement, and top-up status.
- Read the Pricing page and estimate what a request or generation will cost.
- Create, secure, update, and revoke API keys, and call the API with cURL, Python, or JavaScript.
- Follow generations through Pending, Generated, and Failed, and reuse results with Try this and Discover.
- Use referrals and profile settings safely.
- Diagnose common Chat, API, Studio, balance, and top-up problems.

| Part | Sections | Content |
|---|---|---|
| I. Gateway | 1–8 | Login, navigation, Chat, Usage, Credits, API, Referral, Profile |
| II. Studio | 9–13 | Image and video generation, results, My Creations, Discover, model catalog |
| III. Pricing | 14–15 | The Pricing page and how Studio is priced |
| IV. Help | 16–17 | Troubleshooting, support, and safety |

---

# Part I. Gateway

## 1. Quick Start

### Step 1: Log in

Open [gateway.maxshot.ai](https://gateway.maxshot.ai). Anyone can browse Chat, but sending a message or opening any other page requires login. Select **Log in**, then choose an account provider (Google or GitHub) or **Sign in with wallet**.

For wallet login:

1. Select **Connect wallet**.
2. Choose a supported wallet.
3. Approve the sign-in message in your wallet.
4. Return to Maxshot after authentication completes.

Signing a login message proves ownership of the address. It does not submit an on-chain transaction, authorize a payment, or expose your private key.

If you received a referral code, select **I have a referral code** before logging in and enter it. Codes use the format `ms-xxxxx-xxxxx-xxxxx`. A valid code is also filled automatically when you open a Maxshot referral link.

A short verification step may appear during login. If it fails, select **Retry verification**.

### Step 2: Confirm or add Credits

Your balance appears at the top right of every page. If you need more Credits, open **Credits** and follow [Section 5](#5-add-credits).

### Step 3: Start a Chat, or create in Studio

- **Chat:** open **New Chat**, select a model or enable **Auto model**, type a message, and press **Enter** or select **Send**. The reply streams into the conversation. Select **Stop** to end it early.
- **Studio:** open **Studio**, choose **Image** or **Video**, pick a model, describe what you want, and select the round **Generate** button. See [Section 9](#9-quick-start-for-studio).

## 2. Navigate the Console

| Page | Use it to |
|---|---|
| New Chat | Talk to models and manage conversations |
| Studio | Create images and videos, and browse your results and the community gallery |
| Usage | Review balance, trends, tokens, Credits, and request details |
| API | Create keys, set limits, copy code samples, and read the request log |
| Credits | Add Credits and review top-up history |
| Pricing | Compare the price and capabilities of every model |
| Referral | Copy your invite link and review rewards |
| Profile | Update identity, login methods, language, theme, retention, notifications, and developer mode |

The sidebar also shows your conversation **History** and links to Telegram, X, Docs, and GitHub. On small screens, open the navigation drawer to reach the same pages. Chat can be browsed without an account. Every other page asks you to log in first.

## 3. Use Chat

### Choose a model

Select the model name at the top of Chat. You can search the catalog. Models are grouped by tier: **Flagship**, **Reasoning**, **Balanced**, **Economy**, **Code**, **Free**, and **Other**. Each entry shows its current input and output price and capability tags: **Text**, **Files**, **Images**, **Audio**, and **Think**.

Enable **Auto model** to use Maxshot's configured default. While it is on, manual model selection is locked.

Model availability and pricing are dynamic. The values shown in the selector are the source of truth, and the [Pricing page](#14-the-pricing-page) lists every model.

### Chat controls

The message toolbar has four controls. Controls are capability-aware: if one is missing or disabled, choose a model that supports it.

| Control | What it does |
|---|---|
| **Add attachment** (+) | Adds a file, image, or audio input |
| **Auto model** | Uses the configured default model and locks model selection |
| **Web search** | Lets a supported model use live web results for this Maxshot Chat message only. API clients supply their own request parameters |
| **Think** | Thinks before answering on models that support an optional reasoning mode. Some models always think, and the control shows "This model always thinks" |

On narrow screens, some controls move under **More**.

### Add attachments

Select **Add attachment**, choose **Files**, **Images**, or **Audio**, and wait for the upload to finish before sending. The menu shows the limits: **up to 5 files, 10 MB each, 50 MB in total** per message.

| Type | Formats |
|---|---|
| Documents and data | PDF, TXT, MD, CSV, JSON, DOCX, XLS, XLSX |
| Images | PNG, JPEG, WEBP, GIF |
| Audio | MP3, WAV |

You can also drop files anywhere in the chat. The selected model must support the attachment's type, or you see "Current model does not support files / images / audio." Images can be opened in a preview after upload. If an upload fails, the message names the file and the reason (connection blocked, timed out, session expired, too large, unsupported type, or a server error). Remove failed files before sending.

### Estimates and high-cost messages

While you type, the composer shows an estimate for the selected model: the approximate input tokens and the Credits they will use. If a message is expected to be unusually expensive, a **High-cost message** dialog states the approximate tokens and Credits and asks you to **Send anyway** or cancel.

### Manage messages and reply versions

Hover over a message to reveal its actions:

- **Copy** copies an assistant response.
- **Edit** revises the latest user message. **Save & send** creates an edited branch.
- **Regenerate** keeps the original answer and creates another reply version.
- **Delete and regenerate** replaces the current answer.
- **Delete version** removes only the selected reply version.
- **Delete** permanently removes a message with all its versions. The confirmation names what else will be removed: later messages, or the whole conversation if it is the first message.

When several replies exist, use the version arrows under the reply to compare them. A message supports up to **10** reply versions. Delete an older version before regenerating once the limit is reached. Editing, regenerating, and switching versions are available at the end of a branch.

### Manage conversation history

The sidebar **History** lets you reopen, **Search conversations**, **Rename**, and **Delete** your conversations. Saved conversations are available after reload and on another device signed in to the same account. Deleting a conversation is permanent. If you are not logged in, History reads "Log in to see your conversations."

How long history is kept depends on **Chat history retention** in [Profile](#8-manage-your-profile).

### Review response usage

Open an assistant message's **Output details** to see its tokens (deep thinking, text output, input uncached, input cached, total) and its Credits (token cost, web search, total). The exact breakdown depends on the model and the upstream response.

### Developer mode

Developer mode is off by default.

1. Open **Profile**.
2. Under **Advanced**, turn on **Developer mode** and confirm.
3. Return to Chat and open **Chat Settings** (the settings button).

| Parameter | Range or behavior |
|---|---|
| System prompt | Up to 3,000 characters; blank means no custom system prompt |
| Temperature | 0–2 in 0.1 steps |
| Top P | 0–1; optional |
| Max tokens | 1–8,192; optional; caps the final answer, not reasoning tokens |
| Frequency penalty | -2 to 2; optional |
| Presence penalty | -2 to 2; optional |

Optional parameters are sent only when enabled. These settings are stored in the current browser for the current account and do not synchronize across devices. Turning developer mode off resets the custom values.

### Insufficient Credits

If your balance cannot cover a message, Chat shows "Insufficient credits. Please top up and try again." with a **Top up** button.

## 4. Review Usage

Open **Usage** to see:

- Your **Credit balance**, split into Free, Referral, and Paid, with a **Top up** shortcut.
- **Used This Month**.
- A **Credit usage** chart for **7 days**, **30 days**, or **All**.
- A **Credits** or **Token** metric toggle.
- Separate **Chat** and **API** series, which can be shown or hidden.
- A **Usage detail** table with time, type, model, token consumption (input and output), Credits, web-search cost, and duration.

Filter the table by **Chat**, **API**, or **All**, page through it, and use **Refresh Data** to reload.

## 5. Add Credits

Crypto top-up is available. **Card** is shown but disabled with the note "Card payments coming soon."

1. Open **Credits**.
2. Choose a preset amount or **Custom**. Enter at least **$1**. The selected token may have a higher minimum, which the console shows.
3. Keep **Crypto** selected under **Payment method**, and select **Continue**.
4. Connect a wallet if needed. If you logged in with Google or GitHub, this is the first time a wallet is required. A wallet login reuses the connected wallet.
5. Select a **blockchain** and a **token** from the options the console offers.
6. Review the quote: **You pay**, the **Network fee** (charged by the bridge provider, LI.FI), the **Platform fee** (5%), and the estimated **Credits added**. Select **Refresh quote** if the quote expires.
7. Approve the transaction in your wallet.
8. Wait for the transaction to settle and for Maxshot to process the confirmed on-chain payment.

Cross-chain payments are quoted and routed through LI.FI. The console shows only the chains and tokens it currently supports.

### Send directly to your deposit address

If you already hold Base USDC or Base AIT, choose **Use deposit address instead**. You get a dedicated Base address, generated with a wallet signature and linked to your account permanently. Only send **USDC or AIT on the Base network** to it. Other chains and tokens are not supported. Credits are added automatically after on-chain confirmation.

### Understand balances

- **Usable balance:** the total available for Chat, Studio, and API requests.
- **Paid credits:** Credits received from completed top-ups.
- **Free credits:** promotional or account-grant Credits.
- **Referral rewards:** confirmed referral Credits.

1 USD ≈ 1,000,000 Credits (1 Credit = $0.000001).

### Track a top-up

Use **Top-up history** to check each order's date, method, amount paid, fees, Credits, status, and a link to the transaction. Order statuses include **detected**, **submitted**, **bridging**, **confirming**, **confirmed**, **needs review**, **manual review**, **failed**, **expired**, and **ignored**. Cross-chain processing and confirmations can take several minutes. The final **confirmed** entry, not an earlier estimate, is authoritative for the Credits received.

Credits can only be spent in Maxshot. **Withdrawals and refunds are not supported.**

## 6. Create and Manage API Keys, and Call the API

The **API** page has four parts, from top to bottom: a **Base URL** bar with a **Copy** button, the **Keys** list, **Quick Start** code samples, and the **Request log**.

### 6.1 Create a key

1. Open **API** and select **Create API key** (top right).
2. Enter a **Name** of 2–50 characters. Use letters, numbers, spaces, hyphens, underscores, or periods. The name must be unique among your keys.
3. Optionally set a **Daily limit** and a **Monthly limit** in Credits. Leave a limit blank for unlimited. The daily limit cannot exceed the monthly limit, a limit cannot be below current usage, and a limit cannot exceed your available balance.
4. Optionally set an **Expiry** date, using a quick choice (such as 7, 30, or 90 days, or 1 year) or a date from the calendar. Leave it blank for no expiry.
5. Select **Create API key**.
6. In the **Key Created** dialog, select **Copy** and store the key securely. The dialog warns: "Copy your key now. You won't be able to see it again." Tick **Saved.** and select **Done**.

The secret is shown only once. Keys begin with `sk-ms-`. If it is lost, revoke the key and create a replacement.

### 6.2 Manage and revoke keys

The **Keys** list shows each key's name, the beginning of the key, this period's usage, last used, and status (**Active**, **Revoked**, or **Expired**). Use the status filter, or **Show revoked**, to see other keys. Select a key to open its details:

- **Requests**, **Input tokens**, and **Output tokens**.
- **Daily remaining** and **Monthly remaining**, with a bar for each limit, and the **Expiry**.
- **Edit limits** to change the daily limit, monthly limit, or expiry. You can also rename a key.
- **Revoke key** to stop it permanently.

Revoking takes effect immediately and cannot be undone. Applications using the key fail until they receive a replacement, but usage history remains available. When a limit is used up, the page warns that the daily or monthly limit is exhausted and asks you to raise it.

### Review API requests

The **Request log** lists the time, key, requested model, tokens in and out, latency, cost, and status (**Succeeded** or **Failed**). Filter by **All keys** and by status, and use **Refresh Data** to reload. Before the first call it reads "No request logs yet."

### 6.3 Call the API

The API is **OpenAI-compatible**. Most clients that work with OpenAI work with Maxshot after you change the Base URL and key.

```text
https://api-gateway.888646.xyz/v1
```

Send the key as a Bearer token:

```http
Authorization: Bearer YOUR_API_KEY
```

The `/messages` route also accepts the key in an `x-api-key` header, together with an `anthropic-version` header.

Keep the key in an environment variable or secret manager. Do not place it in browser code, mobile application bundles, logs, screenshots, or source control.

#### Quick Start

The **Quick Start** panel shows your Base URL and a recommended model (currently `openai/gpt-5.6-luna`) and gives copy-ready code in five formats: **cURL**, **Python SDK**, **Python HTTP**, **JavaScript SDK**, and **JavaScript HTTP**.

```bash
curl https://api-gateway.888646.xyz/v1/chat/completions \
  -H "Authorization: Bearer $MAXSHOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Summarize my product in three bullets."}
    ]
  }'
```

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api-gateway.888646.xyz/v1",
    api_key=os.environ["MAXSHOT_API_KEY"],
)

response = client.chat.completions.create(
    model="openai/gpt-5.6-luna",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Write a launch plan for my product."},
    ],
)
print(response.choices[0].message.content)
```

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api-gateway.888646.xyz/v1",
  apiKey: process.env.MAXSHOT_API_KEY,
});

const response = await client.chat.completions.create({
  model: "openai/gpt-5.6-luna",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Write a launch plan for my product." },
  ],
});
console.log(response.choices[0]?.message?.content);
```

#### Stream a response

Set `stream` to `true`. The response uses Server-Sent Events (SSE):

```json
{
  "model": "openai/gpt-5.6-luna",
  "stream": true,
  "messages": [{"role": "user", "content": "Write a short launch note."}]
}
```

#### Discover models

Open the **Pricing** page, search for a model, and select **Copy** to copy its ID. Programmatically:

```bash
curl https://api-gateway.888646.xyz/v1/models \
  -H "Authorization: Bearer $MAXSHOT_API_KEY"
```

Do not assume a model remains available or keeps the same price. Read the live catalog before pinning a model in production.

#### Supported API surfaces

| Route | Format |
|---|---|
| `GET /models` | Model list JSON |
| `POST /chat/completions` | OpenAI-compatible JSON or SSE |
| `POST /responses` | OpenAI Responses JSON or SSE |
| `POST /completions` | Legacy text completions JSON |
| `POST /messages` | Anthropic Messages JSON or SSE. Bearer or `x-api-key`, with `anthropic-version` |

Embeddings, image generation and editing, audio, realtime, and Gemini-native routes are not supported. Image and video generation is done in Studio ([Section 9](#9-quick-start-for-studio)), not through this API.

## 7. Use Referrals

1. Open **Referral**.
2. Select **Copy link** (or **Copy code**, or share on X or Telegram).
3. Share it with a new user.
4. Review confirmed rewards and referred top-ups on the same page.

Any registered user can invite others. Registration alone does not create a reward: the referred user must complete a top-up, and it must be confirmed. The page shows the current **reward rate** and the **reward cap** per referred user. These values are set by Maxshot and may change.

The page tracks **Earned rewards**, **Confirmed top-up**, **Reward rate**, **Reward cap**, **Pending rewards**, and **Referred accounts**. The **Referred top-ups** table lists each top-up with its date, referee, amount, reward, and status:

| Status | Meaning |
|---|---|
| **Confirmed** | The reward is confirmed and credited |
| **Pending** | Waiting for the top-up to settle |
| **Withheld** | Held for risk review |
| **Under review** | A manual review is required |
| **Revoked** | The reward was revoked |

Filter the table by **All**, **Pending**, **Credited**, or **Needs attention**.

## 8. Manage Your Profile

Open **Profile** to:

- Edit your display name and email, and **Save profile**.
- Under **Login methods**, **Bind** or **Unbind** Google, GitHub, or a wallet. You cannot remove your last login method, so confirm another method works before unbinding one.
- Choose the **Interface language** (English or 中文) and **Theme** (Dark, Light, or System).
- Set **Chat history retention** to **Permanent**, **90 days**, or **30 days**. A change applies to existing and future chats, and older history may expire sooner.
- Turn **Notifications** on or off, in-app and email.
- Turn **Developer mode** on or off ([Section 3](#developer-mode)).
- Under **Session & Security**, **Log out** to end the session on this device.

---

# Part II. Studio

## 9. Quick Start for Studio

### Step 1: Open Studio and log in

Open **Studio** from the sidebar. If you are not logged in, choose Google, GitHub, or **Sign in with wallet**, and enter a referral code first if you have one.

### Step 2: Choose what to create

Two switches at the top choose what you make. First **Image** or **Video**, then the generation tab:

| Kind | Tabs |
|---|---|
| Image | **Text to Image**, **Image to Image** |
| Video | **Text to Video**, **Image to Video** |

### Step 3: Pick a model and describe it

1. Select a model in the toolbar. Each kind has its own list (see [Section 13](#13-the-studio-model-catalog)).
2. Write a prompt of up to 5,000 characters.
3. For Image to Image or Image to Video, add a reference image.
4. Adjust the options the model offers (see [Section 10](#10-generate-images-and-videos)).

### Step 4: Generate

Studio shows the price for your exact selection next to the round **Generate** button, which stays grey until the prompt is filled in. Select it. The result appears right away as **Pending** and finishes in the background (see [Section 11](#11-follow-a-generation)).

### Step 5: Find the result

Your result appears in **My Creations**, just below the composer. It shows as **Pending**, then becomes **Generated** (or **Failed**) on its own. Every successful result is also shown in **Discover** ([Section 12.2](#122-discover)).

### The Studio page

From top to bottom: the **composer** (reference images, prompt, and a toolbar with the model, aspect ratio and resolution, duration and audio for video, the sparkle **Optimize prompt** button, the price, and **Generate**), then **My Creations**, then **Discover**.

Studio uses the same account and Credit balance as Chat and the API.

## 10. Generate Images and Videos

### Generation paths

| Path | You provide | Result |
|---|---|---|
| Text to Image | A prompt | An image |
| Image to Image | A prompt and reference images | An image guided by your references |
| Text to Video | A prompt | A video |
| Image to Video | A prompt and reference images, or a first and last frame | A video that starts from your image |

Not every model supports every path. For example, Recraft V4.1 Flash does not take reference images, so it supports text to image only, while Recraft V4 Styles requires at least one reference image.

### Options

Options come from the selected model, so the choices change when you change models.

| Option | Applies to | Behavior |
|---|---|---|
| Model | All | Separate lists for image and video. Names carry the provider, for example "Google: Veo 3.1 Lite" |
| Aspect ratio and resolution | All | One chip such as `1:1 · 2K` or `16:9 · 720p`. Image models offer 6 to 18 ratios (many include **auto**) and 768, 1K, 1.5K, 2K, or 4K. Video models offer 2 to 7 ratios and 480p, 720p, 1080p, or 4K. Some Recraft models are automatic |
| Duration | Video | The durations the model supports, for example 4, 6, or 8 seconds for Veo and 2 to 30 seconds for Wan 3.0 |
| Audio | Video | **Model audio** (the model creates sound) or **No audio**. On supported models you can also upload your own soundtrack |
| Images per request | Image | Models that allow it can produce several images in one request |
| Seed | Most models | A number that lets you reproduce or vary a result |
| Model settings | Some models | Quality (Grok Imagine Image 2.0), output format and background (Riverflow), negative prompt (Veo, Kling, Wan 2.7), watermark (Seedance), and similar |
| Optimize prompt | All | The sparkle button rewrites your prompt. It can use Credits, and you see "Not enough Chat credits to optimize this prompt" if your balance is too low |

### Write a prompt

The prompt field holds up to **5,000 characters**, with a live counter.

### Use reference images

For Image to Image and Image to Video:

- Add up to **9** reference images. Supported formats are **JPEG, PNG, and WebP**, up to **32 MB** each.
- Use the **Upload** tile, or pick an image from My Creations. A counter beside it (such as `1 / 3`) shows how many you have added and how many the model accepts.
- Preview or remove references before you generate.
- Each model has its own limit. Seedream accepts up to 14, FLUX 3 Image and Riverflow V2.5 Pro up to 10, Riverflow V2.5 Fast up to 4, Qwen Image and Grok Imagine up to 3, and Recraft V4 and V4.1 up to 1. Some models accept only a single starting frame.
- If an upload fails or times out, select the image to retry it, or remove it and add another.

### First and last frame

Video models accept a **first frame** and a **last frame**, so you can fix how the clip opens and closes. Turn on **First & last frame** (the small **i** beside it explains it), and the upload area becomes two boxes, **First frame** and **Last frame**. Both images must be JPEG, PNG, or WebP under 32 MB. Some combinations are not accepted by a given model, and Studio tells you when a combination is unsupported.

### Soundtrack

Video models that accept reference audio, currently Seedance 2.5, Seedance 2.0, Seedance 2.0 Fast, Seedance 2.0 Mini, and Wan 3.0, let you upload your own **WAV or MP3** file, up to 32 MB, as the soundtrack. All ten video models can generate sound.

### Seed

Enter a whole number (up to 2,147,483,647) to repeat or vary a result. An invalid seed is rejected with a message.

## 11. Follow a Generation

### What happens when you select Generate

1. Studio gets a firm quote for your selection. If the quote fails ("Could not price this generation"), nothing is submitted. If a quote expires ("This price expired. Refreshing…"), Studio refreshes it.
2. Your generation is created as **Pending** and appears in My Creations.
3. You can stay on its page or leave. It keeps generating in the background.

Images usually finish in seconds. Videos can take several minutes, and you can leave the page: the video stays in My Creations, marked **Pending**, until it is ready.

### Status

| Status | Meaning |
|---|---|
| **Pending** | Submitted, no result yet |
| **Generated** | The result is ready |
| **Failed** | No result could be produced |

A failed generation can show a more specific reason: **Rejected**, **Blocked** (the prompt or an image was stopped by safety review; adjust the prompt and try again), **Delivery failed**, **Canceled**, or **Expired**. A result you deleted, or one that has expired, is shown as no longer available.

### Limits while generating

- Up to **3 videos** can be Pending at once. Wait for one to finish before starting another. Images are not subject to this limit.
- If your balance is below the quote, Studio blocks the generation ("Not enough credits for this generation") and offers a top-up.
- If an earlier Studio charge is still settling, spending is paused and Studio does not submit until it finishes. A finished result can briefly say "Credits are still settling."
- If Studio or a model is temporarily unavailable, Studio says so and asks you to try again or choose another model.

## 12. My Creations and Discover

### 12.1 Manage My Creations

My Creations lists your own results, below the composer. Before you have created anything it reads "Generations you keep will show up here."

**Filter**

- **Type:** the **All**, **Image**, and **Video** tabs.
- **Status:** the **All status** drop-down (Generated, Pending, Failed).

Select **Load more** to see older results.

**Open, download, and delete**

- Select a result to open its page: the media, the date, the size and resolution (and duration for videos), the **Reference used**, and the prompt.
- Hover over a card, or use the buttons at the top right of its page. The buttons are **Try this**, **Edit**, **Download**, **Image to Video**, and **Delete**.
- **Download** saves a Generated result.
- **Delete** asks you to confirm first and is permanent. Results made from it are not affected.

**Build on a result**

- **Try this** reloads a result's prompt and settings into the composer so you can adjust and generate again. References have to be uploaded again. If the model used is no longer offered, Studio tells you and selects a current model.
- **Edit** (images only) opens an edit page where you write a prompt and use **Animate** to turn the image into a video. It is greyed out on videos.
- **Image to Video** (images only) sends the image to the **Image to Video** tab as a reference image.

Editing a result in place, such as inpainting, background removal, or upscaling, and extending a video are not part of Studio today.

### 12.2 Discover

**Discover** sits below My Creations. It is a gallery of **everyone's work**: every image or video that is generated successfully is automatically added to Discover, with its prompt and its creator's name ("by name"). Discover is the community's showcase, and a quick way to learn good prompts.

- Browse with the **All**, **Image**, and **Video** tabs. Videos show a play button, their length, and a speaker icon if they have sound.
- Open an item to see its result and its prompt.
- Use **Try this** to load its prompt into your composer, then change it and generate your own. Reference files belong to the original creator, so you upload your own. If the model is no longer available, Studio selects a current model.
- You must be logged in to try an item.

Because successful results appear in Discover, do not put private or sensitive information in prompts. See [Section 17](#17-support-and-safety).

## 13. The Studio Model Catalog

Studio offers **25 models**: 15 image and 10 video. Model availability and pricing are dynamic. The live model picker and Pricing page are the source of truth.

**Image models**

| Model | Resolutions | Aspect ratios | Reference images | Images per request | Extra settings |
|---|---|---|---|---|---|
| Seedream 5.0 Flash | 1K, 2K | 18, with auto | Up to 14 | 1 | Seed |
| Seedream 4.5 | 1K, 2K, 4K | 18, with auto | Up to 14 | 10 | Seed |
| Seedream 5.0 Pro | 1K, 2K | 18, with auto | Up to 14 | 1 | Seed |
| Seedream 5.0 Lite | 2K, 4K | 18, with auto | Up to 14 | 4 | Seed |
| Grok Imagine Image 2.0 | 1K, 2K | 14, with auto | Up to 3 | 1 | Quality |
| Grok Imagine Image Quality | 1K, 2K | 14, with auto | Up to 3 | 1 | None |
| FLUX 3 Image | 768, 1K, 1.5K, 2K, 4K | 16, with auto | Up to 10 | 1 | None |
| Qwen Image 3 | 1K, 2K | 13 | Up to 3 | 6 | Seed |
| Qwen Image 3 Pro | 1K, 2K | 13 | Up to 3 | 6 | Seed |
| Riverflow V2.5 Pro | 1K, 2K, 4K | 9, with auto | Up to 10 | 1 | Output format, background |
| Riverflow V2.5 Fast | 1K, 2K | 9, with auto | Up to 4 | 1 | Output format, background |
| Recraft V4.1 Flash | Auto | 6, with auto | None (text only) | 6 | None |
| Recraft V4.1 | Auto | 6, with auto | Up to 1 | 6 | None |
| Recraft V4 | Auto | 6, with auto | Up to 1 | 6 | None |
| Recraft V4 Styles | Auto | 12, with auto | 1 to 10, required | 6 | None |

**Video models**

| Model | Resolutions | Aspect ratios | Durations | Soundtrack upload | Extra settings |
|---|---|---|---|---|---|
| Veo 3.1 Lite | 720p, 1080p | 16:9, 9:16 | 4, 6, 8 s | No | Negative prompt, seed, prompt enhancement, person generation, conditioning scale |
| Veo 3.1 Fast | 720p, 1080p, 4K | 16:9, 9:16 | 4, 6, 8 s | No | Same as Veo 3.1 Lite |
| Seedance 2.5 | 480p, 720p | 16:9, 9:16 | 4–30 s | Yes | Watermark, output format, seed |
| Seedance 2.0 | 480p, 720p, 1080p, 4K | 1:1, 3:4, 9:16, 4:3, 16:9, 21:9 | 4–15 s | Yes | Watermark, seed |
| Seedance 2.0 Fast | 480p, 720p | 1:1, 3:4, 9:16, 4:3, 16:9, 21:9 | 4–15 s | Yes | Watermark, seed |
| Seedance 2.0 Mini | 480p, 720p | 1:1, 3:4, 9:16, 4:3, 16:9, 21:9 | 4–15 s | Yes | Watermark, return last frame, seed |
| Seedance 1.5 Pro | 480p, 720p, 1080p | 1:1, 3:4, 9:16, 9:21, 4:3, 16:9, 21:9 | 4–12 s | No | Watermark, seed |
| Wan 3.0 | 480p, 720p, 1080p | 16:9, 4:3, 1:1, 3:4, 9:16 | 2–30 s | Yes | Seed |
| Wan 2.7 | 720p, 1080p | 16:9, 9:16, 1:1, 4:3, 3:4 | 2–10 s | No | Negative prompt, prompt extension, seed |
| Kling v3.0 Pro | 720p | 16:9, 9:16, 1:1 | 3–15 s | No | Negative prompt, CFG scale |

---

# Part III. Pricing

## 14. The Pricing Page

Open **Pricing** in the sidebar. It is a public price list for the models Maxshot offers. Use it to compare models before you chat, generate, or integrate, and to copy a model ID.

The page has a model list on the left (a **Search models** box, three tabs, and models grouped under their provider) and a **Model details** panel on the right.

| Tab | What it lists | Count at last review |
|---|---|---|
| **Text** | Chat and API language models. Columns: input, output, and cache read, per 1M tokens | 430 |
| **Image** | Image-generation models, with ability tags `T2I` (text to image) and `I2I` (image to image) | 61 |
| **Video** | Video-generation models, with ability tags `T2V` (text to video) and `I2V` (image to video) | 30 |

The count next to each tab name changes as models are added or removed. The Image and Video tabs list a wider catalog than the 15 image and 10 video models you can pick in Studio, so a model on this page is not necessarily available in Studio.

- **Refresh.** Prices refresh every 5 minutes. If the data is out of date or incomplete, the page says so.
- **Search** filters the active tab by model ID or name.
- **Batch models.** On the Text tab, a model's batch version is folded under the model itself.
- **"1 provider" / "2 providers"** under a model name expands the providers behind it.
- **Copy** (on a row) and **Copy ID** (in the panel) copy the model ID for API requests.
- Select a model to open its details.

### Read a price

The list shows prices in USD, and the detail panel shows both USD and Credits. The conversion is fixed: **1 USD = 1,000,000 Credits**. Models with no charge show **Free**.

| Unit | Typical for | Example |
|---|---|---|
| per 1M tokens | Text models, and Seedance 2.0 and 2.5 video | Aion 3.5 Mini: input $0.70, output $1.40, cache read $0.18 |
| per image | Most image models | FLUX 3 Image Klein: from $0.008 / image |
| per megapixel | Some image models | FLUX.2 [max]: $0.07 / megapixel |
| per second | Most video models | Wan 3.0 Prime: from $0.068 / second |

A model often has several rates. The list shows the cheapest as **from**, and the panel lists every rate. For images and videos there is normally one rate per resolution. Depending on the model, rates are also grouped by:

- **Mode:** text to video, image to video, video to video, or reference. Rates the source does not tie to a mode appear as **Mode unspecified**.
- **Audio:** with audio and without audio.
- **Other charges:** input images, a minimum charge, a charge per generation, cache reads and writes, and similar.
- **Long-prompt rates:** a different rate once a prompt reaches a stated token count.
- **Scheduled rates:** a rate that applies only on listed days and hours, shown in UTC.

**Worked examples**

- FLUX 3 Image Klein costs 8,000 Credits ($0.008) at 768, 9,000 at 1K, 11,000 at 1.5K, 14,000 at 2K, and 36,000 ($0.036) at 4K. **Resolution changes the price.**
- Wan 3.0 Prime costs 68,000 Credits per second at 480p, 140,000 at 720p, and 280,000 at 1080p. A 5-second clip at 720p costs **700,000 Credits ($0.70)**.
- A 4-second Veo 3.1 Lite clip at 720p with model audio shows **200,000 Credits ($0.20)** in Studio.
- Seedance 2.0 and 2.5 are priced per video token. The cost of one clip depends on how many tokens it uses, so use the price shown before you generate.

### Model details

Selecting a model opens, from top to bottom:

| Section | Contents |
|---|---|
| Header | Model name, ID with **Copy ID**, a short description, and ability tags |
| **Overview** | **Text:** context window, max output, release date, and the input, output, and cache-read prices with Credits and USD per token. **Image:** resolutions, aspect ratios, images per request, reference images, release date. **Video:** resolutions, durations, aspect ratios, frame images (first and last frame), audio, seed, release date |
| **Pricing** | For images and videos, one row per resolution with the USD price and the Credits |
| **Providers** | Each provider and its price, with streaming support, context, max output, status, uptime (5 minutes, 30 minutes, 1 day), implicit caching, and supported parameters |
| **Model fields** | The canonical slug (the full catalog name) and catalog notes |

### Choose a model by cost

- **Resolution and duration drive the price.** Check the rate for the resolution you plan to use, not only the "from" price.
- **Audio can cost more.** For some video models, with-audio rates are higher.
- **References can add a charge.** Some image models charge for each reference image. Look for input-image rates.
- **"from" is a floor.** It is the cheapest listed rate. Video-to-video, scheduled windows, and long prompts can differ.
- Check the limits in **Overview** (durations, aspect ratios, reference images, first and last frame) before you build a prompt around a setting.

## 15. How Studio Is Priced

- **Credits.** Studio spends from the same Credit balance as Chat and the API. 1,000,000 Credits equal $1.00.
- **A firm quote.** Before submitting, Studio asks for the price of your exact model, path, and settings, and shows it beside the **Generate** button. That quote is what a successful generation costs.
- **Charged when the result is made.** A generation settles at its quoted price once it completes. A finished result can briefly say "Credits are still settling."
- **Same ledger.** Studio uses the balances in [Section 5](#5-add-credits).
- **The Pricing page shows list prices.** It is for comparing models. If it differs from your quote, the quote governs.
- If your balance is lower than the quote, Generate is blocked and nothing is deducted. Credits can only be spent in Maxshot. Withdrawals and refunds are not supported.

### Programmatic access to Studio

Studio has its own service for models, quotes, uploads, and generations. It is used by the Studio page and is not part of the public `/v1` API. Do not assume a Studio feature is available through the API.

---

# Part IV. Help

## 16. Troubleshooting

### Chat cannot send

- Confirm you are logged in ("Log in to send").
- Confirm the message is not empty and attachments have finished uploading.
- Check your Credit balance.
- If a capability control is disabled, select a compatible model.
- If a reply is already generating, stop it or wait for it to finish.

### An attachment is rejected

Check its format and size (5 files, 10 MB each, 50 MB total), then confirm the selected model supports that attachment type. Remove failed uploads before sending.

### An API request returns 401

Use the full secret shown when the key was created, not its name or the short beginning shown in the list. Confirm the header uses `Authorization: Bearer ...`, and verify the key is not revoked or expired.

### An API request is blocked by quota or limits

Check the account balance and the key's daily and monthly Credit limits. Add Credits or use **Edit limits**, then retry. A monthly limit must be at least as large as the daily limit.

### An API request returns 429

Reduce concurrency and retry with exponential backoff and jitter. Do not retry in a tight loop.

### A model or feature is unavailable

Open the live model selector or the Pricing page. Models and capabilities change, and not every model supports files, images, audio, reasoning, web search, or every API route.

### A top-up is not credited yet

Check **Top-up history** and the linked on-chain transaction. Cross-chain transfer, settlement confirmation, and indexing are separate steps. If the transaction is confirmed but remains unresolved for an extended period, contact Telegram support with the transaction hash. Never send a private key or seed phrase.

### A conversation disappeared

Saved chats expire according to the retention setting in Profile. If you deleted a conversation or a branch, it cannot be restored from the console.

### Generate does nothing, or the button is grey

- Confirm you are logged in and the prompt is not empty. The round Generate button stays grey until it is filled in.
- For Image to Image or Image to Video, confirm you added a reference image. Some models, such as Recraft V4 Styles, require one.
- With a first and last frame, confirm both images are added.
- Check your Credit balance against the price shown.

### Up to 3 videos can generate at once

Wait for a Pending video to finish, or look in My Creations to see which are still running. A slot frees as soon as one finishes.

### The quote failed

Studio could not price your selection, so nothing was submitted. Try again. If it persists, change a setting or the model, or contact support.

### A reference image or soundtrack is rejected

Use a JPEG, PNG, or WebP image under 32 MB, or a WAV or MP3 soundtrack under 32 MB. A soundtrack needs a model that accepts one (see [Section 13](#13-the-studio-model-catalog)). If an upload times out or fails, retry it or add another file. If you added more images than the model accepts, the extra images are ignored.

### A result is Pending for a long time

Videos can take several minutes, and you can leave the page. If a result stays Pending far longer than expected, note its model, prompt, and time, and contact support.

### A result is Failed or Blocked

Open it to read the reason. If it was **Blocked**, change the prompt or the reference image. For other reasons, try again, using **Try this** to reload the prompt and references.

### A setting I chose isn't accepted

The model may not support it, for example a duration, aspect ratio, or number of reference images. Check [Section 13](#13-the-studio-model-catalog) or the model's details on the Pricing page.

### I can't find a result

Set the My Creations tabs to **All** and the status drop-down to **All status**, and use **Load more** for older results.

### Try this says the model is unavailable

The model used for that result is no longer offered. Choose a different model and generate again.

### The price on the Pricing page differs from my quote

The Pricing page shows list prices for comparison. The price shown beside **Generate** is what is charged.

### A result I deleted is gone

Deleting a result is permanent and cannot be undone from the console.

## 17. Support and Safety

- Telegram: [t.me/maxshotai](https://t.me/maxshotai)
- X: [x.com/MaxshotAI](https://x.com/MaxshotAI)
- GitHub: [github.com/MaxShotLab](https://github.com/MaxShotLab)
- Documentation: [docs.maxshot.ai](https://docs.maxshot.ai)

Maxshot support will never need your wallet seed phrase, private key, or API-key secret. Share only non-secret diagnostic details such as a request timestamp, model ID, the displayed error message, or a transaction hash for a top-up.

Do not include private or sensitive information in prompts, reference images, or soundtracks. Prompts of successful generations are shown in Discover.
