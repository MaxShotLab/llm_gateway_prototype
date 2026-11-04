# Maxshot Gateway Features and Selling Points Playbook (Marketing Edition)

- **Version:** 1.0
- **Data snapshot:** November 4, 2026
- **Product:** [gateway.maxshot.ai](https://gateway.maxshot.ai)
- **Sources:** (1) the live console at gateway.maxshot.ai (pages and front-end strings); (2) the live public endpoints `/config` (top-up and API configuration), `/model-catalog` (the Chat lineup), and `/model-pricing` (the price catalog); (3) the *Maxshot Gateway Product Document*, Release 2.0
- **Audience:** marketing, growth, community, content, and partnerships teams
- **Core rule:** always present Maxshot Gateway as **one integrated product**. Chat, Studio (creation), Pricing, API, and Credits are features of the same product. Never describe Studio as "another product" or "the new version".
- **Chinese edition:** [MAXSHOT_GATEWAY_FEATURES_AND_SELLING_POINTS_zh.md](./MAXSHOT_GATEWAY_FEATURES_AND_SELLING_POINTS_zh.md)

---

## 0. How to Use This Playbook

| I need to… | Go to |
|---|---|
| Write a homepage hero, poster, or intro page | §1 Positioning, §3 Core selling points, §8.2 Landing-page structure |
| Write tweets, community announcements, or a voiceover | §8 Channel copy pack |
| Answer "can it do X?" or "how much is it?" | §4 Feature inventory, §5 Fact sheet, §8.8 FAQ |
| Review copy and avoid saying the wrong thing | §9 Messaging guardrails |
| Close open items before publishing | §10 Open questions |

**Data markers**

| Marker | Meaning |
|---|---|
| ✅ | Verified on the live product and relatively stable (features, flows, rules) |
| ⚠️ | **Dynamic data** (model counts, prices, featured models). Re-check the live site before every publication |
| ❓ | Cannot be verified from the live site. Product or operations must confirm before it is used externally (see §10) |

---

## 1. Positioning

### 1.1 One-line positioning (recommended)

> **Maxshot Gateway: one account, one balance, to chat with leading AI models, create images and videos, and build with an OpenAI-compatible API.**

### 1.2 Three brand pillars

| Pillar | Meaning | Product proof |
|---|---|---|
| **All-in-one** | Everything you want to do with AI, in one place | Chat, Studio, and the API share one account and one Credits balance |
| **Transparent** | You can see prices, usage, and charges | A price page covering every model, prices shown in the Chat picker, estimates before sending, firm quotes before generating, full usage detail |
| **In control** | You decide how much is spent, by whom, and for how long data is kept | Per-key daily and monthly limits and expiry, history retention, confirmation for high-cost messages |

### 1.3 Elevator pitches

**Short (about 25 words)**

> One account to chat, create images and videos, and call an API, on a single balance with prices you can see.

**Medium (about 85 words)**

> Maxshot Gateway puts chat with leading AI models, image and video creation, and an OpenAI-compatible API into one console. One account and one Credits balance power everything. Every model's price is listed, and you see the cost before you send a message or generate a result. Developers swap the base URL and key to bring existing code over, and set daily and monthly limits on every key.

**Long (about 200 words)**

> Using several AI models, an image generator, and a video generator usually means multiple accounts, billing systems, and tools. Maxshot Gateway brings them into one console.
>
> **Chat.** Pick models by tier (Flagship, Reasoning, Balanced, Economy, Code, Free). Attach files, images, and audio. Turn on web search and thinking. Keep several reply versions side by side to compare.
>
> **Create.** Studio offers text to image, image to image, text to video, and image to video. You see the exact price before you generate. Results are saved in My Creations, and you can browse community work in Discover and reuse any prompt in one click.
>
> **Build.** The API is OpenAI-compatible: swap the base URL and key. Every key has its own daily and monthly limit and expiry, and every request is logged.
>
> **Pay.** Sign in with a wallet and top up with USDC or AIT on Base, or bridge in from other chains. Every fee is shown before you confirm.
>
> One account. One balance. One price list.

### 1.4 Diagnosis of the live site's copy ✅

| Location | Live text | Issue | Recommendation |
|---|---|---|---|
| Page `<meta description>` | "Precise AI access for chat and API developers" | Mentions only chat and API developers. It omits creation and does not convey "all-in-one" | Replace with: *"One account to chat with leading AI models, create images and videos, and build with an OpenAI-compatible API."* |
| Login subtitle | "Continue with an account or a wallet." | Accurate | Keep |
| Chat welcome screen | "Maxshot AI Gateway · What's on your mind?" | Chat-centric | Consider adding Studio and API entry points below it |
| API page headline | "One endpoint. Key-based access." | Accurate and strong | Reuse as the slogan of the API section |

> These are copy suggestions for live strings. Changing them requires product and front-end work and does not take effect from this playbook.

### 1.5 Narrative principles

1. **Whole before parts.** Lead with "one entry point, one balance", then expand into Chat, Studio, and API.
2. **Specifics over adjectives.** Say "25 creation models, a firm price before you generate, daily and monthly limits per key", not "powerful" or "ultimate".
3. **Evidence first.** Follow every claim with a fact the reader can verify themselves, such as "open the Pricing page and see".
4. **No comparisons, no put-downs.** Do not name competitors. Do not say "cheapest", "fastest", or "most complete" (see §9).

---

## 2. Target Audiences

| Audience | Typical pain | Gateway's answer | Lead with | Where to reach them |
|---|---|---|---|---|
| **Developers and AI app teams** | Several providers means several keys, billing setups, and SDKs. A leaked key can run up the bill | OpenAI-compatible endpoint. Per-key daily and monthly limits and expiry. A request log | SP5, SP3, SP8 | GitHub, developer communities, tech X, docs site |
| **Creators, designers, short-video marketers** | Scattered tools. No idea what a generation costs. Long video waits tie them to the page | Four creation paths, 25 models, a firm quote up front, background generation, automatic archive | SP4, SP3, SP9 | X, YouTube, design communities |
| **Heavy AI users and power users** | Want to compare models, work with many files, and keep multiple answers | Tiers and search, attachments and web search, multi-version replies, searchable history with retention control | SP2, SP7 | Telegram, X, AI-tool reviewers |
| **Web3-native users and community members** | Prefer a wallet and do not want to link a bank card just to use AI | Wallet sign-in. USDC or AIT on Base, with cross-chain support. A dedicated deposit address | SP6, SP11 | Telegram, X, on-chain communities, the Base ecosystem |
| **Newcomers and explorers** | Do not want to pay before trying. Unsure which model to pick | Free-tier models, Auto model, side-by-side pricing | SP11, SP2 | Every channel, with "start free" content |

---

## 3. Core Selling Points (Six Core, Six Supporting)

> Each selling point follows the same order: **claim**, **proof** (facts anyone can verify), **copy**, **watch-outs**.

### SP1  One account, one balance, for chatting, creating, and building

| | |
|---|---|
| **Claim** | No more separate accounts and top-ups for chat, image, video, and the API |
| **Tagline** | One account. One balance. Chat, create, build. |
| **Best for** | Everyone. The first line of the homepage hero |

**Proof ✅**

- Log in once with Google, GitHub, or a wallet, and Chat, Studio, API, Pricing, Usage, and Referral are all available.
- Chat, Studio, and the API spend **the same Credits** (1 USD = 1,000,000 Credits).
- Top-ups, free Credits, and referral rewards all feed one balance. The Usage page splits the balance into Free, Referral, and Paid.
- One sidebar: New Chat, Studio, Usage, API, Credits, Pricing, Referral, Profile.

**Copy**

- Headline: **Chat it. Create it. Build on it. One balance.**
- Subhead: Log in once. The same Credits power chat, image and video creation, and the API.

**Watch-outs:** say "the same balance", never "free". Credits can only be spent inside Maxshot, and **withdrawals and refunds are not supported** (see §9).

---

### SP2  Leading models in one place, sorted by tier, with the price on every card

| | |
|---|---|
| **Claim** | Chat gives you a curated lineup of leading models, grouped by tier and priced on each card. The Pricing page extends that to a much wider catalog |
| **Tagline** | Every tier, one picker. |
| **Best for** | Heavy AI users, developers, newcomers |

**Proof**

- ✅ **Chat opens without an account.** Anyone can open the model picker and see every model's input and output price. Sending a message requires login.
- ⚠️ **The Chat lineup is curated: 22 models in 6 tiers** (snapshot 2026-11-04): **Flagship** (6), **Reasoning** (3), **Balanced** (6), **Economy** (3), **Code** (3), **Free** (2). It includes Claude Haiku / Sonnet / Opus 5.5, GPT-6, GPT-6.1 Sol and GPT-5.6 Luna, Gemini 3.8 Flash, DeepSeek V4 and V4.1, Kimi K3, GLM 5.2 and 5.3, and Xiaomi MiMo. A tier named **Other** exists in the interface and appears when models are assigned to it.
- ✅ The picker is searchable and shows capability tags (Text, Files, Images, Audio, Think). **Auto model** uses the platform default in one click, so newcomers do not have to choose.
- ⚠️ **The Pricing page lists a much wider catalog** (login required): **340+ text models** (excluding batch variants), **60+ image models**, and **30+ video models**. The text models come from **50+ providers**, including xAI, Qwen, Mistral, Meta, and MiniMax. Not every catalog model is selectable in Chat, and whether every one can be called through the API is still to be confirmed ❓ (see §10).
- ⚠️ Within the 340+ text models, **123 have a context window of 1M tokens or more**, **238 support reasoning parameters**, and **284 support tool calling** (excluding batch variants, snapshot 2026-11-04).

**Copy**

- Headline: **Every tier, one picker.**
- Subhead: Flagship, reasoning, balanced, economy, code, free. See each model's price on its card, then just start typing.

**Watch-outs:** do not say "hundreds of models in Chat". Chat is a curated lineup, and the 340+ figure belongs to the Pricing catalog. Model names, counts, and prices are dynamic, so always add "as of [date]" or point readers to the Pricing page. **Never promise a model will always be available.** Use model names descriptively only, and add "Model names and trademarks belong to their respective owners" in the footer.

---

### SP3  Transparent pricing: see the price before you spend

| | |
|---|---|
| **Claim** | Before you press Send or Generate, you know roughly (or exactly) what it will cost |
| **Tagline** | See the price before you spend. |
| **Best for** | Everyone, especially creators and cost-conscious developers |

**Proof ✅**

- **A price for every model:** the Pricing page (after login) lists every model's rates, and the Chat picker shows each model's input and output price even before you log in. Text is priced per 1M tokens (input, output, cache read). Images are priced per image, per megapixel, or per resolution. Videos are priced per second or per resolution.
- **Rates by resolution, audio, and mode:** the same video model has different rates at 480p, 720p, and 1080p, and with or without audio.
- **Estimate before sending in Chat:** while you type, the composer shows approximate tokens and Credits.
- **Confirmation for high-cost messages:** if a message is expected to be unusually expensive, a "High-cost message" dialog asks you to Send anyway or cancel.
- **Firm quote before generating in Studio:** the price for your exact model, path, and settings sits beside the Generate button, and that is the price charged for a successful generation. If your balance is lower, Generate is blocked and nothing is deducted.
- **Itemized receipt in Chat:** Output details show tokens (deep thinking, text output, uncached input, cached input, total) and Credits (token cost, web search, total).
- **Top-up fees shown up front:** You pay, Network fee, Platform fee (5%), and Credits added are all listed before you confirm the transaction.
- ⚠️ Prices refresh every 5 minutes.

**Price examples (Pricing page, snapshot 2026-11-04) ⚠️** These models appear in the price catalog. They are examples of how pricing works, and they are not necessarily in Studio's 25-model list.

| Example | Price |
|---|---|
| FLUX 3 Image Klein (image) | $0.008 at 768 up to $0.036 at 4K per image. Resolution changes the price |
| Wan 3.0 Prime (video) | $0.068 per second at 480p. A 5-second 720p clip is **$0.70** (700,000 Credits) |
| Veo 3.1 Lite (Studio, 4 seconds, 720p, with model audio) | **$0.20** (200,000 Credits) |

**Copy**

- Headline: **No surprise bills.**
- Subhead: Every model's price on one page. An estimate before you chat. A firm quote before you generate. A line-by-line log after.

**Watch-outs:** never say "cheapest". There is no data to support it. Top-ups carry a 5% platform fee and a network fee. **Mention them proactively**, since they are part of being transparent.

---

### SP4  Studio: four ways to create images and videos, with real control

| | |
|---|---|
| **Claim** | Text to image, image to image, text to video, and image to video on one page. 25 models, and the key settings are yours |
| **Tagline** | Four ways to create. Twenty-five models. Your settings, your price. |
| **Best for** | Creators, designers, short-video marketers, marketing teams |

**Proof ✅**

- **Four paths:** Text to Image, Image to Image, Text to Video, Image to Video.
- **25 creation models:** 15 image models (Seedream 5.0 / 4.5, FLUX 3 Image, Qwen Image 3, Riverflow V2.5, Recraft V4.1 / V4, Grok Imagine Image, and more) and 10 video models (Veo 3.1, Seedance 2.5 / 2.0 / 1.5, Wan 3.0 / 2.7, Kling v3.0 Pro, and more). ⚠️ The model list changes.
- **Reference images:** up to 9 (JPEG, PNG, WebP, up to 32 MB each). Some models take more, for example up to 14 for Seedream.
- **First and last frame:** fix how a video opens and closes.
- **Your own soundtrack:** Seedance 2.5 / 2.0 family and Wan 3.0 accept an uploaded WAV or MP3. All 10 video models can generate sound.
- **Full controls:** aspect ratio and resolution (up to 4K for both images and videos), duration (up to 30 seconds, depending on the model), several images per request (up to 10, depending on the model), seed, negative prompt, watermark toggle, and more.
- **Prompt optimizer:** one click on ✨ rewrites your prompt.
- **Background generation:** submit, then leave. The result moves from Pending to Generated in My Creations.
- **Result management:** filter, download, reuse settings with Try this, and turn an image into a video in one click.

**Copy**

- Headline: **From a sentence to a finished clip.**
- Subhead: Text to image, image to image, text to video, image to video. 25 models, first/last frame, reference images, your own soundtrack, and the price before you press Generate.

**Watch-outs:** Studio does **not** offer in-place editing (inpainting, background removal, upscaling) or video extension today. Up to 3 videos can be Pending at once. "Usually seconds" applies to images only. Videos can take several minutes.

---

### SP5  OpenAI-compatible API: swap the base URL, keep your code, and stay in control of usage

| | |
|---|---|
| **Claim** | Existing OpenAI-compatible code needs almost no changes. Every key has a budget guardrail. Every call is logged |
| **Tagline** | One endpoint. Key-based access. Per-key limits. Full request log. |
| **Best for** | Developers, AI application and agent teams |

**Proof ✅**

- **Two changes:** set the SDK's base URL to `https://api.maxshot.ai/v1` and use a Maxshot key that starts with `sk-ms-`.
- **Routes:** `GET /models`, `POST /chat/completions`, `POST /responses`, `POST /completions`, and `POST /messages` (Anthropic Messages format, with Bearer or `x-api-key`). All return JSON, and the chat-style routes also support SSE streaming.
- **Per-key guardrails:** every key has its own **daily limit**, **monthly limit** (in Credits), and **expiry**. The daily limit cannot exceed the monthly limit. A key can be revoked at any time, with immediate effect.
- **Key shown once:** creation warns "Copy your key now. You won't be able to see it again."
- **Request log:** time, key, requested model, tokens in and out, latency, cost, and status, filterable by key and status.
- **Five copy-ready code formats:** cURL, Python SDK, Python HTTP, JavaScript SDK, JavaScript HTTP.
- **One-click model ID copy:** every model on the Pricing page has a Copy button.

**Copy**

- Headline: **Swap the base URL. Keep your code.**
- Subhead: OpenAI-compatible. Daily and monthly limits per key. A request log for every call.

**Code sample (usable as a visual in copy)**

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.maxshot.ai/v1",
    api_key="YOUR_MAXSHOT_KEY",
)
reply = client.chat.completions.create(
    model="openai/gpt-5.6-luna",
    messages=[{"role": "user", "content": "Hello"}],
)
```

**Watch-outs:** the API does **not** support image or video generation, embeddings, audio, realtime, or Gemini-native routes. Image and video creation is available only in Studio. Never imply that the API can generate video.

---

### SP6  Web3-native: sign in with a wallet, top up with USDC or AIT, bridge in from other chains

| | |
|---|---|
| **Claim** | If you live in a wallet, you can use AI directly with on-chain assets |
| **Tagline** | Sign in with your wallet. Top up with USDC or AIT on Base. |
| **Best for** | Web3 users, the Base ecosystem community |

**Proof ✅**

- **Three sign-in options:** Google, GitHub, or a wallet. Wallet sign-in is a signature that proves address ownership. It does not submit an on-chain transaction, authorize a payment, or expose your private key.
- **Top-up method:** Crypto (USDC or AIT on Base, chain ID 8453).
- **Cross-chain top-up:** routed through LI.FI. The console shows only the chains and tokens it currently supports.
- **Dedicated deposit address:** if you hold USDC or AIT on Base, send directly to your own address and Credits are added automatically after on-chain confirmation.
- **Trackable orders:** Top-up history shows date, method, amount, fees, Credits, status, and a link to the transaction.
- Minimum top-up: $1.

**Copy**

- Headline: **Your wallet is your account.**
- Subhead: Sign in with a wallet. Top up with USDC or AIT on Base, or bridge in from other chains.

**Watch-outs:** the Card option shows "Card payments coming soon" and is **not available yet**. Never advertise card support. Describe AIT only as "a supported top-up token", with **no price expectations, returns, or investment implications**. Credits are **non-withdrawable and non-refundable**.

---

### Supporting selling points

| # | Selling point | Proof | One-line copy |
|---|---|---|---|
| **SP7** | **A richer chat experience** | Attachments: up to 5 files, 10 MB each, 50 MB total (PDF, TXT, MD, CSV, JSON, DOCX, XLS, XLSX; PNG, JPEG, WEBP, GIF; MP3, WAV). Web search. Think mode. Up to 10 reply versions per message, switchable and comparable. Edit creates a branch. Searchable, renamable history. Developer mode adjusts system prompt (up to 3,000 characters), temperature, top P, max tokens, and two penalties | *Drop in files, images, audio, and keep every version of the answer.* |
| **SP8** | **Usage and spend you can see** | Usage page: balance (Free, Referral, Paid), used this month, 7-day / 30-day / all-time trends, Credits or Token metric, separate Chat and API series, and a row-by-row detail table (time, type, model, tokens, Credits, web search cost, duration). The API page adds a request log | *Every token, every credit, accounted for.* |
| **SP9** | **Discover community and Try this** | Every successful generation appears automatically in Discover with its prompt and creator name. Browse All, Image, and Video. One click on Try this loads the prompt into your composer. Videos show length and whether they have sound | *Learn from what others made. Try it in one click.* |
| **SP10** | **Referral rewards** | A personal invite link and code (format `ms-xxxxx-xxxxx-xxxxx`). The inviter earns promotional Credits after the referred user **completes and confirms a top-up**. The page shows the reward rate, per-referee cap, and pending and credited rewards. Share to X or Telegram | *Invite friends. Earn credits when they top up.* |
| **SP11** | **Free to start** | Chat opens without an account, so you can look around before signing up. The Chat lineup has a **Free** tier (⚠️ 2 models at the snapshot). The wider catalog lists about 14 free text models in all, and free models show "Free" on the Pricing page. There is also a Welcome source of free Credits ❓ (amount to be confirmed) | *Start free. Top up when you need more.* |
| **SP12** | **Thoughtful details** | English and 中文 interface, Dark, Light, or System theme, a mobile navigation drawer, chat history retention of Permanent, 90 days, or 30 days, and in-app and email notification switches | *English and 中文. Dark, light, or system.* |

---

## 4. Feature Inventory

> Organized in console navigation order. "User value" is the direction for translating a feature into copy. "Key details" are facts you can cite.

### 4.1 Chat

| Feature | User value | Key details |
|---|---|---|
| Tiered model picker with search | Choose by scenario when unsure who to pick | Up to 7 tier groups (6 shown today). Each model shows input and output price and capability tags. Visible without login ✅ |
| Auto model | No choice needed for beginners | When on, locks the model to the platform default ✅ |
| Attachments | Let the model read documents, see images, hear audio | 5 files, 10 MB each, 50 MB total. Drag and drop. Clear message when the model does not support a type ✅ |
| Web search | Answers with live information | Only on supported models. Web search cost is counted ✅ |
| Think | Reason before answering on hard problems | Optional on some models. Always on for others ✅ |
| Estimate before sending | Know the rough cost beforehand | Shows approximate tokens and Credits ✅ |
| High-cost message confirmation | Avoid draining the balance with an oversized message by mistake | Dialog: Send anyway or cancel ✅ |
| Multiple reply versions | Compare several answers to one question | Up to 10 versions per message. Regenerate keeps the original ✅ |
| Edit and branch | Change a question without losing context | Edit, then Save & send, creates a new branch ✅ |
| Conversation history | Find anything later | Search, rename, delete. Syncs across devices ✅ |
| History retention | Privacy you control | Permanent, 90 days, or 30 days in Profile ✅ |
| Output details | See the cost breakdown of each answer | Token breakdown and Credits breakdown ✅ |
| Developer mode | Fine-grained tuning | System prompt up to 3,000 characters. Temperature 0 to 2. Top P 0 to 1. Max tokens 1 to 8,192. Frequency and presence penalty −2 to 2 ✅ |
| Stop generation | Cut off a reply you do not need, to save Credits | A Stop button ends a streaming reply early ✅ |
| Insufficient-balance prompt | Stay in flow | Message plus a direct Top up button ✅ |

### 4.2 Studio

| Feature | User value | Key details |
|---|---|---|
| Four creation paths | From idea to finished piece | T2I, I2I, T2V, I2V ✅ |
| 25 creation models | Choose by style, budget, capability | 15 image and 10 video ⚠️ |
| 5,000-character prompt | Describe things in detail | Live character counter ✅ |
| ✨ Optimize prompt | Turn a short idea into a strong prompt | May use Credits. Warns if the balance is too low ✅ |
| Reference images | Consistent style, characters, composition | Up to 9. JPEG, PNG, WebP, up to 32 MB each. Can pick from My Creations ✅ |
| First and last frame | Control how a video opens and closes | "First & last frame" toggle ✅ |
| Your own soundtrack | Put your own sound under the picture | WAV or MP3, up to 32 MB. Selected models ✅ |
| Aspect ratio and resolution | Fit each platform | Images: 6 to 18 ratios, up to 4K. Videos: 2 to 7 ratios, 480p to 4K ✅ |
| Video duration | From short clips to longer scenes | For example 4, 6, or 8 seconds on Veo. Up to 30 seconds on Wan 3.0 and Seedance 2.5 ✅ |
| Multi-image output | Several candidates at once | Depends on the model (up to 10) ✅ |
| Seed | Reproduce or vary a result | Whole number up to 2,147,483,647 ✅ |
| Firm quote before generating | No guessing | The quote is the charged price. Refreshes if it expires. A failed quote submits nothing ✅ |
| Background generation | Not tied to the page | You can leave. Up to 3 videos Pending at once ✅ |
| Status tracking | Know where things stand | Pending, Generated, Failed. A failure can show a specific reason such as Blocked (safety review) ✅ |
| Safety review | Clear boundaries | A stopped prompt or image shows Blocked. Adjust and try again ✅ |

### 4.3 My Creations and Discover

| Feature | User value | Key details |
|---|---|---|
| My Creations | Work archived automatically | Filter by type (All, Image, Video) and status. Load more ✅ |
| Result page | Review every generation | Media, date, size and resolution (and duration for video), reference used, prompt ✅ |
| Download | Take the finished piece | Available for Generated results ✅ |
| Try this | Reuse settings in one click | Loads prompt and settings into the composer (references must be uploaded again) ✅ |
| Image to Video | Image to clip in one step | Sends the image to Image to Video as a reference ✅ |
| Edit, then Animate | Turn an image into a video from the edit page | Images only ✅ |
| Delete | Clean up on your own | Confirmation required. Permanent ✅ |
| Discover | Find inspiration and learn prompts | Successful generations appear automatically with prompt and creator name. All, Image, Video filters ✅ |

### 4.4 Pricing

| Feature | User value | Key details |
|---|---|---|
| Price catalog (login required) | Compare before you spend | Text, Image, and Video tabs. ⚠️ The count beside each tab changes with the catalog (snapshot: Image 61, Video 30) |
| Search and grouping | Find things fast | Search by model ID or name. Grouped by provider ✅ |
| Multi-dimensional pricing | Matches how you actually use the model | Per 1M tokens, per image, per megapixel, per second. By resolution, audio, mode, long prompt, and time window ✅ |
| Model details | Everything for choosing | Context window, max output, release date. For image and video: resolutions, ratios, durations, first/last frame, audio, seed. Provider, uptime (5 minutes, 30 minutes, 1 day), implicit caching, supported parameters ✅ |
| USD and Credits side by side | Instant conversion | 1 USD = 1,000,000 Credits ✅ |
| One-click model ID copy | Straight into the API | Copy and Copy ID ✅ |
| Batch versions | See batch variants of a text model without clutter | A model's batch version is folded under the model itself ✅ |
| 5-minute refresh | Fresh prices | The page flags stale or incomplete data ✅ |

### 4.5 API

| Feature | User value | Key details |
|---|---|---|
| OpenAI compatibility | Low migration cost | Chat Completions, Responses, Completions ✅ |
| Anthropic Messages format | Works with Anthropic-style clients | `POST /messages`, Bearer or `x-api-key` ✅ |
| Streaming | Real-time experience | SSE ✅ |
| Multiple keys | One per project or environment | Name 2 to 50 characters, unique. Status Active, Revoked, or Expired ✅ |
| Daily and monthly limits | Budget guardrails | In Credits. Daily at most monthly. Cannot exceed available balance ✅ |
| Expiry | Temporary keys | 7, 30, 90 days, 1 year, or a custom date ✅ |
| One-click Revoke | Stop a leak immediately | Immediate and permanent ✅ |
| Request log | Debugging and reconciliation | Time, key, model, tokens, latency, cost, status ✅ |
| Quick Start code | Running in 5 minutes | cURL, Python SDK, Python HTTP, JS SDK, JS HTTP ✅ |

### 4.6 Credits and top-up

| Feature | User value | Key details |
|---|---|---|
| One balance | One pot of money for every scenario | Shared by Chat, Studio, and API ✅ |
| Preset and custom amounts | Flexible top-up | Minimum $1 (the selected token may have a higher minimum) ✅ |
| Crypto top-up | Use on-chain assets directly | Choose chain and token, review the quote, then confirm in your wallet ✅ |
| Transparent fees | Know what you will receive | You pay, Network fee (LI.FI), Platform fee 5%, Credits added ✅ |
| Dedicated deposit address | Send directly | Base USDC or AIT only. Added automatically after confirmation ✅ |
| Top-up history | Reconciliation | Order statuses include detected, submitted, bridging, confirming, confirmed ✅ |
| Balance categories | Clear sources | Paid, Free, Referral ✅ |

### 4.7 Usage, Referral, Profile

| Module | Feature | Key details |
|---|---|---|
| Usage | Balance and trends | 7 days, 30 days, or all. Credits or Token metric. Chat and API shown separately ✅ |
| Usage | Row-by-row detail | Time, type, model, tokens, Credits, web search cost, duration. Filter by Chat, API, or All ✅ |
| Referral | Invite link and code | Copy link, copy code, share to X or Telegram ✅ |
| Referral | Transparent rewards | Earned rewards, Confirmed top-up, Reward rate, Reward cap, Pending rewards, Referred accounts. Statuses: Confirmed, Pending, Withheld, Under review, Revoked ✅ |
| Profile | Login method management | Bind or unbind Google, GitHub, wallet. The last method cannot be removed ✅ |
| Profile | Personalization | Language (English, 中文), theme (Dark, Light, System), history retention, notifications, developer mode ✅ |

---

## 5. Fact Sheet (check the "Stability" column before quoting externally)

| Item | Value | Source | Stability |
|---|---|---|---|
| Text models on the price page (excluding batch variants) | 345, from 57 provider identifiers | `/model-pricing`, 2026-11-04 | ⚠️ Externally say "340+" and "50+" |
| Image models on the price page | 61 | Same | ⚠️ Say "60+" |
| **Models in the Chat picker** | **22 in 6 tiers** (Flagship 6, Reasoning 3, Balanced 6, Economy 3, Code 3, Free 2) | `/model-catalog`, live Chat picker | ⚠️ Chat is a curated lineup |
| Entries in the model catalog behind Chat and Pricing | 417 (including batch variants) | `/model-catalog` | ⚠️ Do not call these "models in Chat" |
| Pages open without login | Chat only. Studio, Usage, API, Credits, Pricing, Referral, and Profile require login | Front-end route table | ✅ |
| Video models on the price page | 31 | Same | ⚠️ Say "30+" |
| Studio creation models | 25 (15 image, 10 video) | Product Document Release 2.0 (logged-in Studio, not re-verifiable without login) | ⚠️ |
| Text models with a context window of 1M tokens or more | 123 | `/model-pricing` | ⚠️ |
| Text models supporting reasoning, tool calling, structured outputs | 238, 284, 275 | Same | ⚠️ |
| Free text models right now | Catalog: about 14 marked `:free`. Chat picker: 2 | Same, `/model-catalog` | ⚠️ |
| Attachments per message | 5 files, 10 MB each, 50 MB total | Live strings | ✅ |
| Reply version limit | 10 per message | Live strings | ✅ |
| Developer-mode ranges | Temperature 0 to 2. Max tokens 1 to 8,192. System prompt up to 3,000 characters | Live strings | ✅ |
| History retention | Permanent, 90 days, 30 days | Live strings | ✅ |
| Studio prompt limit | 5,000 characters | Product Document | ✅ |
| Reference images | Up to 9, up to 32 MB each (JPEG, PNG, WebP) | Product Document | ✅ |
| Video concurrency | Up to 3 Pending at a time | Product Document | ✅ |
| Credits conversion | 1 USD = 1,000,000 Credits | Live strings and price page | ✅ |
| Minimum top-up | $1 | `/config` | ✅ |
| Platform fee on top-ups | 5% | `/config` | ✅ (if operations change it, the live site wins) |
| Top-up network | Base (chain ID 8453), tokens USDC and AIT | `/config` | ✅ |
| API base URL | `https://api.maxshot.ai/v1` | `/config` | ✅ |
| API key prefix | `sk-ms-` | Product Document | ✅ |
| Price refresh | Every 5 minutes | `/model-pricing` | ✅ |

**Text-model price anchors (Chat picker, per 1M tokens, input / output, USD; snapshot 2026-11-04) ⚠️**

| Model | Input / Output | Typical role |
|---|---|---|
| DeepSeek V4.1 Flash | $0.045 / $0.50 | Low-cost bulk tasks |
| Claude Haiku 5.5 | $0.10 / $0.50 | Light and fast |
| GPT-5.6 Luna | $0.20 / $1.20 | General purpose |
| Gemini 3.8 Flash | $0.825 / $4.13 | Balanced |
| Claude Sonnet 5.5 | $2 / $10 | Balanced to high capability |
| Claude Opus 5.5 | $4 / $20 | High capability |

> Prices range from free models to flagship models at several dollars per million tokens, and higher for some catalog models. That spread is exactly why a price page and estimates matter. Use these numbers **only to explain the spread**. Never write "model X is cheaper than elsewhere".

---

## 6. Comparison Narrative: "How People Usually Do It"

> Never name competitors. Compare only against how users typically work today.

| Dimension | The usual way | With Maxshot Gateway |
|---|---|---|
| Accounts and balance | A separate account and top-up for chat, images, video, and API | One account, one Credits balance |
| Comparing models | Check each provider's site for prices and capabilities | One price page for Text, Image, and Video, with capability tags next to prices |
| Price before creating | You learn the cost after generating | The exact price is beside the Generate button, and a low balance is caught beforehand |
| Connecting several models | A different SDK and key for each provider | One base URL and one key, OpenAI-compatible |
| Containing a runaway key | One global cap, so everything stops at once | Daily and monthly limits and expiry per key, and instant Revoke |
| Reconciliation | Different bill formats on every platform | Usage and request logs in one place, split by Chat and API |
| Paying from a wallet | Needs a bank card | Wallet sign-in, direct USDC or AIT top-up, and cross-chain support |

---

## 7. Scenario Stories

### Scenario A: an indie developer integrates in 5 minutes

1. Log in with GitHub and top up $5.
2. Open the API page, create a key, and set a daily limit and a 30-day expiry.
3. Copy the Python SDK sample and fill in the base URL and key.
4. Run it, get a reply, then check the request log for that call's tokens, latency, and cost.
5. **Highlights:** only the base URL and key change, and the key has a budget guardrail.

### Scenario B: a short-video marketer makes a product clip

1. Open Studio, then Video, then Image to Video.
2. Upload the product photo as the first frame and another as the last frame.
3. Pick a model, 9:16 and 720p, 6 seconds, and turn on model audio.
4. See the exact price beside the button, click Generate, and leave for a meeting.
5. Come back to find it Generated in My Creations, and download it.
6. **Highlights:** first and last frame, a firm quote, background generation.

### Scenario C: a designer looks for inspiration

1. Open Discover and filter to Image.
2. Open a result you like and read its prompt.
3. Click Try this to load the prompt into your composer and swap in your own subject.
4. Generate, then download the result you like.
5. **Highlights:** community work with prompts, one-click reuse.

### Scenario D: a researcher compares models

1. Search a few candidates on the Pricing page and check context window, price, and uptime.
2. Back in Chat, upload a PDF and ask each model the same question.
3. Regenerate under one message and switch between reply versions to compare.
4. Open Output details to see what each answer cost.
5. **Highlights:** price comparison, multi-version replies, cost breakdown.

### Scenario E: an on-chain user pays with USDC

1. Sign in with a wallet (a signature only, no transaction).
2. Go to Credits, choose Crypto, pick a chain and token, and review the quote with network fee and the 5% platform fee.
3. Confirm in the wallet and wait for on-chain confirmation.
4. The order shows confirmed in Top-up history and the Credits arrive.
5. **Highlights:** the wallet is the account, and fees are shown beforehand.

### Scenario F: a community lead runs referrals

1. Open Referral and copy the invite link.
2. Share it on X or Telegram.
3. After the invited user completes and confirms a top-up, the reward is credited.
4. Track reward status (Pending, Confirmed) on the Referral page.
5. **Highlights:** reward status is visible end to end.

---

## 8. Channel Copy Pack

### 8.1 Slogan candidates

| ID | Slogan | Alternate | Use for |
|---|---|---|---|
| S1 (recommended master slogan) | **Chat it. Create it. Build on it.** | One account, three ways to use AI. | Brand visual, hero |
| S2 | **See the price before you spend.** | The AI gateway with the price tag showing. | Pricing transparency |
| S3 | **Swap the base URL. Keep your code.** | One endpoint. Key-based access. | Developers |
| S4 | **From a sentence to a finished clip.** | Four ways to create. | Studio |
| S5 | **Your wallet is your account.** | Sign in with a signature. | Web3 audiences |
| S6 | **One balance. Everything.** | One pot of Credits, every feature. | Credits and top-up |

### 8.2 Homepage and landing-page structure

1. **Hero:** S1, the subhead "One account, one balance, for chat, creation, and the API", a primary button **Start free**, and a secondary button **View pricing**.
2. **Three-column overview:** Chat | Studio | API, each with one sentence and one screenshot.
3. **"Transparent pricing" block:** Pricing page screenshot, Studio quote screenshot, top-up fee breakdown screenshot.
4. **"For developers" block:** code sample, key-limits screenshot, request-log screenshot.
5. **"For creators" block:** icons for the four Studio paths and a Discover wall.
6. **"On-chain friendly" block:** wallet sign-in, USDC and AIT, a cross-chain diagram.
7. **Number strip:** 22 models in Chat | 340+ models in the price catalog | 25 creation models | 5 code formats (⚠️ verify at publication).
8. **FAQ:** the first 6 questions of §8.8.
9. **Footer:** Telegram, X, GitHub, Docs, and "Model names and trademarks belong to their respective owners".

### 8.3 X (Twitter) copy

**Single posts**

> **T1 · Positioning**
> One account. One balance.
> Chat with leading AI models, create images and videos, and build with an OpenAI-compatible API.
> That's Maxshot Gateway. → gateway.maxshot.ai

> **T2 · Transparent pricing**
> You shouldn't need a spreadsheet to know what an AI request costs.
> Maxshot Gateway: every model's price on one page, an estimate before you chat, a firm quote before you generate.
> No surprise bills.

> **T3 · Studio**
> Text to image. Image to image. Text to video. Image to video.
> 25 models in one place, with first/last frame, reference images and your own soundtrack — and the price shown before you hit Generate.
> Studio, inside Maxshot Gateway.

> **T4 · Developers**
> Swap the base URL. Keep your code.
> OpenAI-compatible API, daily and monthly limits per key, and a request log for every call.
> Your keys, your budget.

> **T5 · Web3**
> Your wallet is your account.
> Sign in with a wallet (a signature, not a transaction). Top up with USDC or AIT on Base, or bridge in from other chains.
> Network fee and platform fee shown before you confirm.

> **T6 · Discover**
> Great prompts are learned, not guessed.
> Browse what the community made in Discover, open any result to see its prompt, and hit "Try this" to make it your own.

> **T7 · Usage visibility**
> Every message has a receipt.
> Open "Output details" to see tokens and credits for each reply — thinking, output, cached input, web search.
> Usage and request logs keep the whole picture.

> **T8 · Free to start**
> Not sure where to start? Pick a free-tier model and just chat.
> When you need more power, compare every model's price on one page and top up whenever you're ready.

**Thread (6 posts): Why we built Maxshot Gateway**

1. Using AI today often means: one app for chat, another for images, another for video, plus separate API accounts. Each with its own balance. 🧵
2. Maxshot Gateway puts it all behind one login and one Credits balance — chat, image and video creation (Studio), and an API.
3. Pricing is transparent. Every model's rate is on one page. In chat you see an estimate; in Studio you see a firm price before you generate.
4. Developers: it's OpenAI-compatible. Swap the base URL and key. Each key gets its own daily/monthly limit and expiry, plus a request log.
5. Creators: four ways to make images and videos, 25 models, first/last frame, reference images, your own soundtrack. Results live in My Creations; Discover shows what the community made.
6. Sign in with Google, GitHub or a wallet. Top up with USDC or AIT on Base. Try it → gateway.maxshot.ai

### 8.4 Telegram and community announcement

> 📣 **Maxshot Gateway — chat, create, build. One place.**
>
> One account, one Credits balance:
> 💬 **Chat** — pick models by tier, attach files/images/audio, web search, compare reply versions
> 🎨 **Studio** — text/image to image and video, 25 models, firm price before you generate
> 🔌 **API** — OpenAI-compatible, per-key daily/monthly limits, request log
> 💰 **Pricing** — every model's price in one place
>
> Log in with a wallet, Google or GitHub. Top up with USDC or AIT on Base, or bridge in from other chains.
> 👉 gateway.maxshot.ai
> Questions or feedback? Drop them in this group.

### 8.5 Voiceover scripts

**30-second version (short video or livestream opener)**

> Want AI for chat, images, video, and an API, and tired of juggling accounts?
> Maxshot Gateway puts them together: one account, one balance.
> In chat, pick a model by tier. In Studio, choose from four creation paths and 25 models, and see the exact price before you generate. Developers just swap the base URL.
> Every model's price is listed and every request is logged.
> Open gateway.maxshot.ai and try a free model first.

**60-second walkthrough (with on-screen actions)**

| Time | Voiceover | On screen |
|---|---|---|
| 0–8 s | "One account for chat, creation, and the API." | Login page, then the console |
| 8–20 s | "Pick a model, attach a file, and see the estimated cost as you type." | Chat picker, attachment, estimate |
| 20–38 s | "In Studio, write a prompt, choose a model and ratio, and the exact price is right beside the button. Hit generate and you can leave." | Studio quote, Generate, My Creations |
| 38–50 s | "Developers: copy the code, swap the base URL and key, and set daily and monthly limits per key." | API page, Quick Start, limits |
| 50–60 s | "Every model's price is listed. Try it now." | Pricing page, call to action |

### 8.6 Developer-community post (Dev.to or Reddit style)

> **Title:** An OpenAI-compatible gateway with per-key budget limits and a request log
>
> I've been using Maxshot Gateway to route requests to models from several providers through one OpenAI-compatible endpoint. What I care about as a developer:
> - Change `base_url` and `api_key`, nothing else.
> - Each key has its own daily and monthly credit limit plus an expiry date, and can be revoked instantly.
> - The request log shows model, tokens in/out, latency, cost and status per call.
> - `/chat/completions`, `/responses`, `/completions`, and an Anthropic-style `/messages` route, with SSE streaming.
> - The pricing page lists every model's rates and has a one-click "Copy ID" for each model.
>
> Not supported (so you don't waste time): embeddings, image/audio/realtime APIs, Gemini-native routes. Image and video generation are in the web Studio only.

### 8.7 Referral copy

- **Product's own share text (built into the Referral page):** *"Access frontier AI models with Web3 payments on Maxshot Gateway. Join with my invite:"* Use this line as the baseline for referral copy so it matches the product.
- **Invite message:** I use Maxshot Gateway for chat, image/video creation and the API — one account, one balance, every price listed. Join with my link: `your referral link`
- **Note:** the reward requires the invited user to **complete and confirm a top-up**, not just sign up. The reward rate and cap follow what the Referral page shows ❓. **Never write "passive income", "easy money", or "guaranteed returns".**

### 8.8 FAQ answers

| Question | Standard answer |
|---|---|
| What is Maxshot Gateway? | A console that brings AI chat, image and video creation, and an OpenAI-compatible API together. One account and one Credits balance work across every feature. |
| How do I log in? | With Google, GitHub, or a wallet. Wallet sign-in is just a signed message. It does not submit an on-chain transaction or authorize a payment. |
| How do I pay? | With Crypto: USDC or AIT on Base, or bridged in from other chains. Card payments show "coming soon" and are not available yet. |
| How is it priced? | 1 USD = 1,000,000 Credits. Top-ups show the network fee and a 5% platform fee. Usage is charged at each model's rate on the Pricing page. |
| How do I know the cost in advance? | Chat shows an estimate while you type. Studio shows the exact price beside the Generate button. The Pricing page lists every model's rates. |
| Can I get a refund or withdraw? | No. Credits can only be spent inside Maxshot. Withdrawals and refunds are not supported. |
| Which models are available? | Chat offers a curated lineup, which you can browse without logging in. The Pricing page lists the wider catalog of text, image, and video models. Counts and prices change, so the live pages are the source of truth. |
| Are there free models? | Yes. The Chat model picker has a Free tier, and models with no charge show "Free" on the Pricing page. |
| Do I need an account to look around? | You can open Chat and browse the model picker and its prices without an account. Sending a message and every other page (Studio, Usage, API, Credits, Pricing, Referral, Profile) require login. |
| How do I use the API? | Create a key on the API page, copy a sample, set the base URL to `https://api.maxshot.ai/v1`, and add your key. |
| Can the API generate images or video? | No. Image and video creation is in Studio. The API supports text and chat-style routes. |
| Are my creations public? | Yes. Every successful generation appears in Discover with its prompt, so do not put private or sensitive information in prompts. |
| How long do videos take? | Usually a few minutes. You can leave the page and find the result in My Creations. Up to 3 videos can be in progress at once. |
| How long is chat history kept? | You choose Permanent, 90 days, or 30 days in Profile. Deleted conversations cannot be restored. |
| Where do I get help? | Telegram at t.me/maxshotai. For top-up issues, include the transaction hash. **Never share a seed phrase or private key.** |

---

## 9. Messaging Guardrails

### 9.1 What not to say

| Do not say | Why | Say instead |
|---|---|---|
| "Cheapest / fastest / most complete / world's first" | No verifiable comparison data | "Every model's price is listed" and "a continuously updated catalog" |
| "Hundreds of models in Chat" | Chat is a curated lineup (22 today). The 340+ figure is the Pricing catalog | "A curated Chat lineup, plus a 340+ model price catalog" |
| "See all prices without signing up" or "try Studio / the API without an account" | Only Chat is open without login. Pricing, Studio, and API require login (the Chat picker does show prices) | "Browse Chat and its model prices without an account" |
| "Supports every major model" or "any model" | The catalog is dynamic, and not every model supports every capability | "Covers many leading providers (see the Pricing page)" |
| "Supports credit cards / Apple Pay" | Card currently shows "coming soon" | "Crypto top-ups today, card payments coming" (only after product confirms) |
| "The API can generate images and video" | The API does not support image, video, audio, embeddings, realtime, or Gemini-native routes | "Image and video creation lives in Studio" |
| "Your creations are fully private" | Successful generations appear in Discover automatically | "Successful generations are shown in Discover" |
| "Refundable" or "withdrawable" | Not supported | "Credits can only be used inside Maxshot" |
| "Zero-fee top-ups" | There is a network fee and a 5% platform fee | "Every fee is shown before you confirm" |
| "Instant video" | Videos usually take several minutes | "Generates in the background. Find it in My Creations when ready" |
| "Passive income", "guaranteed", "AIT will rise" | Implies returns or investment advice | Describe only the function: a supported top-up token |
| "Officially partnered / authorized" (for any model provider) | No proof of authorization | "Use [model]" with the trademark notice |
| "No moderation, no limits" | Studio has safety review, and some prompts or images show Blocked | "If a result shows Blocked, adjust the prompt and try again" |
| "New Studio" or "old Gateway" | The product is one whole | "Maxshot Gateway's creation features (Studio)" |

### 9.2 Required notices (by context)

- Naming a specific model or price: *"Models and prices change. See the Pricing page at gateway.maxshot.ai for current rates. As of YYYY-MM-DD."*
- Naming model brands: *"Model names and trademarks belong to their respective owners."*
- Mentioning top-ups: *"Credits can only be spent inside Maxshot. Withdrawals and refunds are not supported."*
- Mentioning Studio creations: *"Successful generations are shown in Discover. Do not include private information in prompts."*
- Mentioning referral rewards: *"Rewards follow the rules shown on the Referral page. The invited user must complete and confirm a top-up."*

### 9.3 Security reminders (for support and community teams)

- No one, including support staff, will ever ask for a seed phrase, private key, or API key in plain text.
- API keys in screenshots and videos must be **masked** (see how the User Guide v2 handles this).
- Use placeholders in code samples, such as `YOUR_MAXSHOT_KEY`.

---

## 10. Open Questions (for product and operations to close before publishing)

| # | Item | Why it matters | Affects |
|---|---|---|---|
| 1 | **Amount and conditions of free Credits for new users** | The live product has a Welcome source, but the amount cannot be verified from public pages | SP11, "start free" copy |
| 2 | **Referral reward rate and per-referee cap** | The page shows them as variables, so the current values are not visible without logging in | SP10, §8.7 |
| 3 | **Can the API call every model in the catalog?** | Chat offers 22 models, while the catalog behind Pricing and `/model-catalog` lists 417 entries. `/v1/models` needs a key, so we could not verify what an API key can actually call | SP2, SP5, the "340+" wording |
| 4 | **Which headline models may be named in promotion** | Copy that names models should use models that are truly in the Chat lineup (see SP2) | SP2, §5 price anchors |
| 5 | **Card payment launch date** | Once live, §8.8 and §9.1 should be updated | Payment copy |
| 6 | **Billing rules for failed generations** | The documentation only says a successful generation is charged at the quote. Whether failures are charged needs to be stated | Studio FAQ |
| 7 | **Whether the site's meta description will be updated** | It still says "chat and API developers" | §1.4 |
| 8 | **Brand assets:** logo rules, brand colors, fonts | Posters and videos need consistency | §11 |
| 9 | **Whether model providers may be named in promotion** | Involves trademark use and partnership wording | §3 SP2, §8 |
| 10 | **Memory feature:** the page exists on the live site but is not in the sidebar | Not released, so this playbook does not promote it | — |
| 11 | **Studio figures** (25 models, up to 9 reference images, 5,000-character prompt, 32 MB, 3 concurrent videos) come from the Product Document and a logged-in Studio. They could not be re-verified logged out | Please spot-check in a logged-in Studio before publishing | SP4, §4.2, §5 |
| 12 | **Does Discover publication involve a scan or review step?** | The front end has publication states Private, Scanning, Under review, Published, and Rejected. Product has said successful generations go to Discover automatically. Please confirm whether there can be a delay or a rejection | SP9, §8.8 FAQ |
| 13 | **API base URL differences between environments** | The live site's config returns `https://api.maxshot.ai/v1`. An older environment returned `https://api-gateway.888646.xyz/v1`. Docs must use the production value | Code samples, FAQ, the User Guide v2 files, the Product Document |

---

## 11. Suggested Assets

| Use | Suggested asset | Source |
|---|---|---|
| Hero and overview | Console overview and sidebar (highlight the 8 entries) | Live screenshot |
| Model choice | Chat model picker (tiers, prices, capability tags) | Live screenshot, see User Guide v2 |
| Pricing transparency | Pricing list plus detail panel. Studio quote beside Generate. Top-up quote (You pay, Network fee, Platform fee, Credits added) | Live screenshot |
| Studio | The four path tabs. First/last frame upload boxes. My Creations grid. Discover wall | Live screenshot, see User Guide v2 sections 10 to 19 |
| API | Key creation dialog (daily and monthly limits, expiry). Request log. Quick Start code | Live screenshot, **mask the key** |
| Usage | Usage trend chart and detail table. Output details panel | Live screenshot |
| Top-up | Wallet sign-in. The Crypto flow on Credits. Top-up history | Live screenshot |
| Short video | The 60-second walkthrough in §8.5, ideally a real screen recording | Record |

> Reference: `Maxshot_Gateway_User_Guide_v2.html` (English) and `Maxshot_Gateway_使用教程_v2.html` (Chinese) contain 42 processed screenshots (keys already blurred) that can be reused directly.
> Note: older Chat screenshots may differ slightly from the live product, so re-shoot them before use.

---

*Prepared from the live environment as of November 4, 2026. Re-check dynamic data before every publication. If anything differs from the live site, the live site wins.*
