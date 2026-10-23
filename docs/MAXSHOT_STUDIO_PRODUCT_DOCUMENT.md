# Maxshot Studio Product Document

- **Release:** Developing product (Studio with the Pricing page)
- **Audience:** Studio users, creators, testers, and support teams
- **Last reviewed:** October 23, 2026
- **Console:** [gateway.maxshot.ai](https://gateway.maxshot.ai)
- **Companion document:** [Maxshot Gateway Product Document](./MAXSHOT_GATEWAY_PRODUCT_DOCUMENT.md)

## Who This Document Is For

This document is intended for:

- **Creators** who want to generate images and videos from text or reference images, follow their results, and reuse them.
- **Testers** who need to exercise every generation path, status, limit, and error.
- **Customer-support and implementation teams** who need a practical reference for helping users create, understand costs, and recover from failed generations.
- **Anyone comparing models** who needs to read the Pricing page and know what each model supports.

After reading this document, you will be able to:

- Open Studio and complete a first image and a first video generation.
- Choose a model and use its options: aspect ratio, resolution, duration, audio, reference images, first and last frame, seed, and per-model settings.
- Follow a generation through Pending, Generated, and Failed, and know when you are charged.
- Find, filter, download, and delete results in My Creations, and reuse them with Try this or Animate.
- Read the Pricing page and estimate what a generation will cost.
- Diagnose common generation, limit, upload, and balance problems.

## What Is New in This Release

- **Pricing page.** A **Pricing** item in the sidebar lists the price of every model, in Credits with the USD equivalent, on three tabs: **Text**, **Image**, and **Video**. The data refreshes every 5 minutes.
- **A firm quote before you generate.** Studio asks the service for the price of your exact selection before it submits.
- **A wider model catalog.** Studio offers **25 models**: 15 image and 10 video.
- **Per-model options.** Resolution, aspect ratio, duration, reference-image limit, images per request, seed, and other settings now follow the selected model.
- **Bring your own soundtrack** for supported video models.

## 1. Quick Start

### Step 1: Open Studio and log in

Open **Studio** from the sidebar. If you are not logged in, choose Google, GitHub, or **Sign in with wallet**. If you received a referral code, enter it before logging in, as described in the Gateway document.

### Step 2: Choose what to create

Choose **Image** or **Video**, then the generation path:

| Kind | Paths |
|---|---|
| Image | Text to image, image to image |
| Video | Text to video, image to video |

### Step 3: Pick a model and describe it

1. Select a model. Each kind has its own list (see [Section 7.6](#76-the-studio-model-catalog)).
2. Write a prompt of up to 5,000 characters.
3. For image to image or image to video, add a reference image.
4. Adjust the options the model offers (see [Section 3](#3-generate-images-and-videos)).

### Step 4: Generate

Studio shows the price for your exact selection. Select **Generate**. The result appears right away as **Pending** and finishes in the background. See [Section 4](#4-follow-a-generation).

### Step 5: Find the result

Open **My Creations**. Your result shows as **Pending**, then becomes **Generated** (or **Failed**) on its own.

## 2. Navigate Studio

| Page | Use it to |
|---|---|
| Studio | Create images and videos, and browse your results |
| Pricing | Compare model prices and capabilities |
| Credits | Add Credits and review top-up history |
| Usage | Review balance and consumption |

Studio uses the same account and Credit balance as Chat and the API.

## 3. Generate Images and Videos

### Generation paths

| Path | You provide | Result |
|---|---|---|
| Text to image | A prompt | An image |
| Image to image | A prompt and reference images | An image guided by your references |
| Text to video | A prompt | A video |
| Image to video | A prompt and reference images, or a first and last frame | A video that starts from your image |

Not every model supports every path. For example, Recraft V4.1 Flash does not take reference images, so it supports text to image only, while Recraft V4 Styles requires at least one reference image.

### Options

Options come from the selected model, so the choices change when you change models.

| Option | Applies to | Behavior |
|---|---|---|
| Model | All | Separate lists for image and video |
| Aspect ratio | All | The ratios the model supports. Image models offer 6 to 18 choices, including **auto** on many. Video models offer 2 to 7 |
| Resolution | All | The tiers the model supports: 768, 1K, 1.5K, 2K, or 4K for images; 480p, 720p, 1080p, or 4K for video. Some Recraft models are automatic |
| Duration | Video | The durations the model supports, for example 4, 6, or 8 seconds for Veo and 2 to 30 seconds for Wan 3.0 |
| Audio | Video | Generate sound, or upload your own soundtrack |
| Images per request | Image | Models that allow it can produce several images in one request |
| Seed | Most models | A number that lets you reproduce or vary a result |
| Model settings | Some models | Quality (Grok Imagine Image 2.0), output format and background (Riverflow), negative prompt (Veo, Kling, Wan 2.7), watermark (Seedance), and similar |
| Optimize prompt | All | Rewrites your prompt. It can use Credits, and you will see a message if your balance is too low |

### Write a prompt

The prompt field holds up to **5,000 characters**, with a live counter.

### Use reference images

For image to image and image to video:

- Add up to **9** reference images. Supported formats are **JPEG, PNG, and WebP**, up to **32 MB** each.
- Upload from your device, or pick an image from My Creations.
- Preview, reorder, or remove references before you generate.
- Each model has its own limit. Seedream accepts up to 14, FLUX 3 Image and Riverflow V2.5 Pro up to 10, Riverflow V2.5 Fast up to 4, Qwen Image and Grok Imagine up to 3, and Recraft V4 and V4.1 up to 1. If you add more than a model accepts, the extra images are ignored.
- If an upload fails or times out, retry it, or remove it and add another.

### First and last frame

Video models accept a **first frame** and a **last frame**, so you can fix how the clip opens and closes. Both images must be JPEG, PNG, or WebP under 32 MB. Some combinations are not accepted by a given model, and Studio tells you when a combination is unsupported.

### Soundtrack

Video models that support reference audio, currently Seedance 2.5, Seedance 2.0, Seedance 2.0 Fast, Seedance 2.0 Mini, and Wan 3.0, let you upload your own **WAV or MP3** file, up to 32 MB, as the soundtrack. All ten video models can generate sound.

### Seed

Enter a whole number to repeat or vary a result. An invalid seed is rejected with a message.

## 4. Follow a Generation

### What happens when you select Generate

1. Studio gets a firm quote for your selection. If the quote fails, nothing is submitted and you see a message.
2. Your generation is created as **Pending**.
3. You can stay on the result's page or leave. The result keeps generating in the background.

Images usually finish in seconds. Videos can take several minutes, which is why Studio never holds you on the composer.

### Status

| Status | Meaning |
|---|---|
| **Pending** | Submitted, no result yet |
| **Generated** | The result is ready |
| **Failed** | No result could be produced |

A failed generation can show a more specific reason: **Rejected**, **Safety rejected** (the prompt or an image was blocked by a safety check), **Delivery failed**, **Canceled**, or **Expired**. A result you deleted, or one that has expired, is shown as no longer available.

### Limits while generating

- Up to **3 videos** can be Pending at once. Wait for one to finish before starting another. Images are not subject to this limit.
- If your balance is below the quote, Generate is blocked and you are offered a top-up.
- If spending is locked on your account, Studio tells you and does not submit.

## 5. Manage My Creations

My Creations lists your own results.

### Filter

- **Type:** All, Images, or Videos.
- **Status:** All, Generated, Pending, or Failed.

Select **Load more** to see older results.

### Open, download, and delete

- Select a result to open it: the media, the prompt, and the reference images it used.
- **Download** a Generated result.
- **Delete** asks you to confirm first. Deleting one result does not affect the others.

### Build on a result

- **Animate** turns an image into a video. It is available for images only.
- **Try this** reloads a result's prompt and references into the composer so you can adjust and generate again. References have to be uploaded again. If the model used is no longer offered, Studio tells you.

Editing a result in place, such as inpainting, background removal, upscaling, or extending a video, is not part of Studio today.

## 6. Materials

**Materials** shows results from other creators with the author's name. Open one to see its result and reuse it, with the same behavior as Try this: references are uploaded again, and reuse is unavailable if the model is no longer offered. You must be logged in to view it.

## 7. Pricing and Credits

### 7.1 How Studio is priced

- **Credits.** Studio spends from the same Credit balance as Chat and the API. 1,000,000 Credits equal $1.00 (1 Credit = $0.000001).
- **A firm quote.** Before submitting, Studio asks for the price of your exact model, path, and settings. That quote is what a successful generation costs.
- **Charged when the result is made.** A generation settles at its quoted price once it completes. A generation that is still Pending or that fails is not charged for a result it did not produce.
- **Same ledger.** Studio uses the funding order and balances in the Gateway document. To add Credits, see [Section 5 of the Gateway document](./MAXSHOT_GATEWAY_PRODUCT_DOCUMENT.md#5-add-credits).
- **The Pricing page shows list prices.** It is for comparing models. If it differs from your quote, the quote governs.

### 7.2 Use the Pricing page

Open **Pricing** in the sidebar.

| Tab | What it lists | Current count |
|---|---|---|
| Text | Chat models | 431 |
| Image | Image-generation models | 61 |
| Video | Video-generation models | 30 |

The counts change as models are added or removed. The Image and Video tabs list the full catalog, which is larger than the set Studio offers (15 image and 10 video models). A model on the Pricing page is not necessarily available in Studio.

- **Refresh.** Prices refresh every 5 minutes. If the data is out of date or incomplete, the page says so.
- **Search.** Filter the active tab by model ID or name.
- **Batch models.** On the Text tab, a model's batch version is folded under the model itself.
- **Copy ID.** Copies the model ID.
- **Select a model** to open its details.

**Prices.** Each price shows Credits with the USD equivalent. Where a model has several rates, the page shows the cheapest as **from** and lists every rate. Models with no charge show **Free**.

**Rate breakdown.** Depending on the model, rates are grouped by:

- **Mode:** text to video, image to video, video to video, or reference. Rates the source does not tie to a mode appear as **Mode unspecified**.
- **Audio:** with audio and without audio.
- **Resolution:** including high-resolution rates.
- **Other charges:** input images, a minimum charge, a charge per generation, cache reads and writes, and similar.
- **Long-prompt rates:** a higher or lower rate once a prompt passes a size threshold.
- **Scheduled rates:** a rate that applies during a stated UTC time window.

**Providers.** A model with more than one provider lists each provider and its price.

**Model details.** Selecting a model shows an overview and its fields. For text models these include context window, maximum output, maximum prompt, quantization, service tier, status, implicit caching, streaming, input and output modalities, request parameters, reasoning (mandatory or optional), knowledge cutoff, expiration date, and whether the model is moderated. For image and video models they include resolutions, aspect ratios, reference-image limit, images per request, supported settings (seed, quality, size, background, output format, output compression), first-frame and last-frame support, and durations.

### 7.3 Read a price

Every price shows its unit:

| Unit | Typical for | Example |
|---|---|---|
| per image | Image models | 18,000 Credits / image ($0.018) |
| per second | Most video models | 50,000 Credits / second ($0.05) |
| per 1M tokens | Text models and Seedance 2.0 and 2.5 video models | 7,000,000 Credits / 1M tokens ($7.00) |

**Worked examples:**

- A 4-second Veo 3.1 Lite clip at 720p with audio costs 50,000 Credits per second, so **200,000 Credits ($0.20)**.
- FLUX 3 Image costs 41,000 Credits ($0.041) at 768 and 607,000 Credits ($0.607) at 4K, so **resolution can change the price many times over**.
- Seedance 2.0 and 2.5 are priced per video token, for example 7,000,000 Credits per 1M tokens for Seedance 2.0. The cost of one clip depends on how many tokens it uses, so use the quote shown before you generate.

### 7.4 Choose a model by cost

- **Resolution and duration drive the price.** Check the rate for the resolution you plan to use, not only the "from" price.
- **Audio can cost more.** For some video models, with-audio rates are higher than without-audio rates.
- **References can add a charge.** Some image models charge for each reference image. Look for input-image rates.
- **"from" is a floor.** It is the cheapest rate listed. Rates that apply to video-to-video, scheduled windows, or long prompts can differ.

### 7.5 Check a model's limits

Select a model on the Pricing page, or read the tables in the next section, before you build a prompt around a setting.

| Detail | Why it matters |
|---|---|
| Resolutions | Not every model offers every tier, and the tier changes the price |
| Durations | Veo accepts only 4, 6, or 8 seconds; Seedance starts at 4 |
| Aspect ratios | Veo accepts only 16:9 and 9:16; many models offer far more |
| Reference images | The number a model accepts ranges from none to 14 |
| First and last frame | All video models accept both |
| Audio | All video models generate sound; some also accept your own soundtrack |

### 7.6 The Studio model catalog

Model availability and pricing are dynamic. The live model picker and Pricing page are the source of truth.

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

## 8. Add Credits and Understand Balances

Studio draws on the same account balance as the rest of Maxshot. To add Credits, review top-up history, or learn how free, referral, and paid Credits are consumed, see Section 5 of the [Gateway Product Document](./MAXSHOT_GATEWAY_PRODUCT_DOCUMENT.md#5-add-credits).

For Studio:

- You see the price of your exact selection before you submit.
- Credits can only be spent in Maxshot. Withdrawals and refunds are not supported.
- If your balance is lower than the quote, Generate is blocked and nothing is deducted.

## 9. Programmatic Access

Studio has its own service for models, quotes, uploads, and generations. It is used by the Studio page and is not part of the public `/v1` API. In the current configuration, the public Gateway API marks image generation (`/v1/images/generations`) and image editing (`/v1/images/edits`) as unsupported, and documents no video generation route. Do not assume a Studio feature is available through the API.

## 10. Troubleshooting

### Generate does nothing, or reports a missing input

- Confirm you are logged in and the prompt is not empty.
- For image to image or image to video, confirm you added a reference image. Some models, such as Recraft V4 Styles, require one.
- With a first and last frame, confirm both images are added.
- Check your Credit balance against the quote.

### Up to 3 videos can generate at once

Wait for a Pending video to finish, or filter My Creations by **Pending**. A slot frees as soon as one resolves.

### The quote failed

Studio could not price your selection, so nothing was submitted. Try again, and if it persists, change a setting or the model, or contact support.

### A reference image is rejected

Use a JPEG, PNG, or WebP file under 32 MB. If the upload times out or fails, retry it or add another image. If you added more images than the model accepts, the extra images are ignored.

### A soundtrack is rejected

Use a WAV or MP3 file under 32 MB, and a video model that accepts soundtracks (see [Section 7.6](#76-the-studio-model-catalog)).

### A result is Pending for a long time

Videos can take several minutes, and you can leave the page. If a result stays Pending far longer than expected, note its model, prompt, and time, and contact support.

### A result is Failed

Open it to read the reason. If it was **Safety rejected**, change the prompt or the reference image. For other reasons, try again, using **Try this** to reload the prompt and references.

### A setting I chose isn't accepted

The model may not support it, for example a duration, aspect ratio, or number of reference images. Check [Section 7.6](#76-the-studio-model-catalog) or the model's details on the Pricing page.

### I can't find a result

Check both filters in My Creations. A result hidden by the type or status filter doesn't appear. Reset both to **All**, and use **Load more** for older results.

### Try this says the model is unavailable

The model used for that result is no longer offered. Choose a different model and generate again.

### The price on the Pricing page differs from my quote

The Pricing page shows list prices for comparison. The quote shown before you generate is what is charged.

### A result I deleted is gone

Deleting a result is permanent and cannot be undone from the console.

## 11. Support and Safety

- Documentation: [docs.maxshot.ai](https://docs.maxshot.ai)
- Telegram: [t.me/maxshotai](https://t.me/maxshotai)
- X: [x.com/MaxshotAI](https://x.com/MaxshotAI)

Maxshot support will never need your wallet seed phrase, private key, or API-key secret. Share only non-secret diagnostic details such as a request timestamp, model ID, the displayed error message, or a transaction hash for a top-up.

Do not include private or sensitive information in prompts, reference images, or soundtracks.
