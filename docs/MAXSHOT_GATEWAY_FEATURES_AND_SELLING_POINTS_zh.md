# Maxshot Gateway 特性与卖点手册（运营推广版）

- **版本：** 1.0
- **数据快照日期：** 2026 年 11 月 4 日
- **产品入口：** [gateway.maxshot.ai](https://gateway.maxshot.ai)
- **事实依据：** ① 线上环境 gateway.maxshot.ai（页面与前端词条）；② 线上公开接口 `/config`（充值与 API 配置）、`/model-catalog`（Chat 模型清单）、`/model-pricing`（价格目录）；③ 《Maxshot Gateway Product Document》Release 2.0
- **适用对象：** 运营、增长、社区、内容与市场团队
- **使用原则：** 对外统一把 Maxshot Gateway 作为**一个整体产品**来讲。Chat、Studio（创作）、Pricing、API、Credits 是同一个产品里的功能，不要把 Studio 说成"另一个产品"或"新旧版本"。

---

## 0. 怎么用这份手册

| 你要做什么 | 直接看 |
|---|---|
| 写官网首屏、海报、介绍页 | §1 定位、§3 核心卖点、§8.2 落地页结构 |
| 写推文、社群公告、口播 | §8 渠道文案包 |
| 回答用户"这个能不能 / 多少钱" | §4 特性清单、§5 数字速查、§8.8 FAQ |
| 审稿、避免说错话 | §9 宣传红线 |
| 发布前补齐未决事项 | §10 待确认清单 |

**数据标记说明**

| 标记 | 含义 |
|---|---|
| ✅ | 线上已核实，且相对稳定（功能、流程、规则） |
| ⚠️ | **动态数据**（模型数量、价格、推荐模型等），每次对外发布前请到线上复核 |
| ❓ | 线上无法核实，需产品或运营确认后才能对外使用（见 §10） |

---

## 1. 产品定位

### 1.1 一句话定位（推荐）

> **中文：** Maxshot Gateway —— 一个账号、一份余额，聊天、创作、开发全部打通的 AI 入口。
>
> **English:** Maxshot Gateway — one account, one balance, to chat with leading AI models, create images and videos, and build with an OpenAI-compatible API.

### 1.2 三个关键词

| 关键词 | 含义 | 对应的产品事实 |
|---|---|---|
| **一站式** All-in-one | 想用 AI 的几件事，在同一个地方完成 | Chat、Studio、API 共用一个账号和一份 Credits 余额 |
| **透明** Transparent | 价格、用量、扣费看得见 | 覆盖全部模型的价格页、Chat 选择器直接显示价格、发送前预估、生成前确认价格、完整用量明细 |
| **可控** In control | 花多少、给谁用、保留多久，由你决定 | 单个 Key 的日/月限额与有效期、历史保留期限、高成本消息二次确认 |

### 1.3 电梯话术

**30 字版**

> 一个账号，聊天、画图、做视频、接 API，用同一份余额，价格全程可见。

**100 字版**

> Maxshot Gateway 把主流大模型的对话、图像与视频创作、OpenAI 兼容 API 放进同一个控制台。一个账号、一份 Credits 余额通用于所有功能；每个模型的价格都有列出，发送消息或生成作品之前就能看到费用；开发者只需替换 Base URL 和 Key，就能把现有代码接进来，并为每个 Key 设置日/月限额。

**300 字版**

> 想同时用到好几家的大模型、做图、做视频，通常意味着多个账号、多种计费、多套工具。Maxshot Gateway 把这些放进一个控制台：
>
> **聊天**：按档位（旗舰、推理、均衡、经济、代码、免费）挑选模型，支持上传文件、图片、音频，支持联网搜索和深度思考，同一个问题可以保留多个回复版本做对比。
> **创作**：Studio 提供文生图、图生图、文生视频、图生视频四种方式，生成前就显示这一次的确切价格，作品自动保存在"我的作品"，还可以在 Discover 里浏览社区作品并一键复用提示词。
> **开发**：OpenAI 兼容 API，换个 Base URL 和 Key 即可接入，每个 Key 可以设日/月额度和有效期，调用记录逐条可查。
> **付款**：用钱包登录，以 Base 链上的 USDC 或 AIT 充值（也支持跨链充值），所有费用在确认前就展示清楚。
>
> 一个账号，一份余额，一个价格表。

### 1.4 官网现有文案诊断 ✅

| 位置 | 现状（线上） | 问题 | 建议 |
|---|---|---|---|
| 页面 `<meta description>` | "Precise AI access for chat and API developers" | 只提到聊天和 API 开发者，没有创作能力，也不能体现"一站式" | 改为：*"One account to chat with leading AI models, create images and videos, and build with an OpenAI-compatible API."* |
| 登录页副标题 | "Continue with an account or a wallet." | 准确，可保留 | — |
| Chat 欢迎页 | "Maxshot AI Gateway · What's on your mind?" | 偏聊天场景 | 可在欢迎页下方增加 Studio 与 API 入口提示 |
| API 页标题 | "One endpoint. Key-based access." | 准确且有力 | 可直接复用为 API 板块的 slogan |

> 以上是对线上现有词条的文案建议，修改需要产品与前端配合，本手册不直接生效。

### 1.5 叙事原则

1. **整体 > 模块。** 首屏讲"一个入口、一份余额"，再展开 Chat / Studio / API。
2. **具体 > 形容词。** 用"25 个创作模型、生成前显示确切价格、Key 级别日/月限额"，不要用"强大""极致"。
3. **证据在前。** 每个卖点后面都跟一个用户能自己验证的事实（打开 Pricing 页就能看到）。
4. **不比较、不贬低。** 不点名竞品，不说"最便宜 / 最快 / 最全"（见 §9）。

---

## 2. 目标用户与场景

| 用户画像 | 典型痛点 | Gateway 的回答 | 主推卖点 | 推荐触达 |
|---|---|---|---|---|
| **开发者 / AI 应用团队** | 要接多个模型，Key、计费、SDK 各一套；担心 Key 泄露后账单失控 | OpenAI 兼容接口，换 Base URL 即可；每个 Key 单独设日/月限额与有效期；逐条请求日志 | SP5、SP3、SP8 | GitHub、Dev 社区、X 技术圈、文档站 |
| **内容创作者 / 设计 / 短视频运营** | 工具分散，生成前不知道要花多少；视频等待久，不敢离开页面 | Studio 四种创作方式、25 个模型、生成前确切报价、后台生成可离开、作品自动归档 | SP4、SP3、SP9 | X、YouTube、小红书/即刻、设计社群 |
| **AI 重度用户 / 效率人群** | 想横向比较不同模型；资料文件多；想保留多个回答 | 模型分档与搜索、附件与联网搜索、多版本回复、历史搜索与保留期设置 | SP2、SP7 | Telegram、X、AI 工具测评博主 |
| **Web3 原生用户 / 社区成员** | 习惯用钱包，不想为用 AI 单独绑银行卡 | 钱包登录；USDC/AIT（Base）充值，支持跨链；专属充值地址 | SP6、SP11 | Telegram、X、链上社区、Base 生态 |
| **尝鲜用户 / 新手** | 不想先付费，不知道选哪个模型 | 免费档模型可直接试用；Auto model 自动选择；价格页对比 | SP11、SP2 | 所有渠道的"免费开始"类内容 |

---

## 3. 核心卖点（六大 + 六项支撑）

> 每个卖点的结构：**主张** → **证据**（可验证的事实）→ **文案** → **提醒**。
> 英文文案面向 X / Telegram 国际社区，中文文案面向国内社群与内容平台。

### SP1　一个账号，一份余额，聊天、创作、开发全部打通

| | |
|---|---|
| **主张** | 不用再为聊天、做图、做视频、API 分别开账号、分别充值 |
| **EN** | One account. One balance. Chat, create, build. |
| **适用人群** | 所有人；官网首屏的第一句 |

**证据 ✅**

- 用 Google、GitHub 或钱包登录一次，Chat、Studio、API、Pricing、Usage、Referral 全部可用。
- Chat、Studio、API 花的是**同一份 Credits**（1 USD = 1,000,000 Credits）。
- 充值、免费 Credits、推荐奖励都进入同一个余额，Usage 页把余额拆成 Free / Referral / Paid 三类显示。
- 一个侧边栏导航：New Chat、Studio、Usage、API、Credits、Pricing、Referral、Profile。

**文案**

- 标题：**一个账号，一份余额，聊天、创作、开发全搞定**
- 副标题：登录一次，Chat、Studio、API 通用同一份 Credits。充值一次，随时在三个场景之间切换。
- EN headline: **Chat it. Create it. Build on it. One balance.**
- EN sub: Log in once. The same Credits power chat, image and video creation, and the API.

**提醒：** 说"通用同一份余额"，不要说"免费"；Credits 只能在 Maxshot 内消费，**不支持提现和退款**（见 §9）。

---

### SP2　主流大模型一站对比，按档位挑，每张卡片都带价格

| | |
|---|---|
| **主张** | Chat 提供精选的主流模型阵容，按档位分组、卡片上直接标价；价格页把范围扩展到更大的模型目录 |
| **EN** | Every tier, one picker. |
| **适用人群** | AI 重度用户、开发者、尝鲜用户 |

**证据**

- ✅ **Chat 无需登录即可打开。** 任何人都能打开模型选择器，看到每个模型的输入 / 输出价格；发送消息需要登录。
- ⚠️ **Chat 的模型阵容是精选的：6 个档位共 22 个模型**（快照 2026-11-04）：**Flagship 旗舰**（6）、**Reasoning 推理**（3）、**Balanced 均衡**（6）、**Economy 经济**（3）、**Code 代码**（3）、**Free 免费**（2）。包括 Claude Haiku / Sonnet / Opus 5.5、GPT-6、GPT-6.1 Sol、GPT-5.6 Luna、Gemini 3.8 Flash、DeepSeek V4 与 V4.1、Kimi K3、GLM 5.2 与 5.3、小米 MiMo 等。界面里还有一个 **Other 其他** 档位，有模型归入时才会出现。
- ✅ 选择器可搜索，并显示能力标签（Text、Files、Images、Audio、Think）。**Auto model** 一键使用平台默认模型，新手不用选。
- ⚠️ **价格页列出更大的目录**（需登录）：**340+ 个文本模型**（不含批处理版本）、**60+ 个图像模型**、**30+ 个视频模型**；文本模型来自 **50+ 个厂商**，其中包括 xAI、Qwen、Mistral、Meta、MiniMax 等。目录里的模型并不都能在 Chat 里选择；是否都能通过 API 调用，仍待确认 ❓（见 §10）。
- ⚠️ 在这 340+ 个文本模型中，**123 个上下文窗口 ≥ 100 万 token**，**238 个支持推理参数**，**284 个支持工具调用**（不含批处理版本，2026-11-04 快照）。

**文案**

- 标题：**主流大模型，一个入口，按需挑选**
- 副标题：旗舰、推理、均衡、经济、代码、免费——按档位筛，卡片上直接看价格，选好就聊。
- EN headline: **Every tier, one picker.**
- EN sub: Flagship, reasoning, balanced, economy, code, free. See each model's price on its card, then just start typing.

**提醒：** 不要说"Chat 里有上百个模型"。Chat 是精选阵容（目前 22 个），340+ 属于价格页目录。具体模型名、数量、价格都是动态的，必须带"截至某日"或让用户去价格页查看；**不要承诺某个模型永远可用**。点名模型时只做描述性使用，并在页脚注明"模型名称及商标归各自权利人所有"。

---

### SP3　价格透明：先看价格，再花钱

| | |
|---|---|
| **主张** | 每一次消费，在你按下"发送"或"生成"之前就能知道大概 / 确切花多少 |
| **EN** | See the price before you spend. |
| **适用人群** | 所有人，尤其是创作者和企业型开发者 |

**证据 ✅**

- **每个模型都有价格**：价格页（登录后）列出所有模型的费率，Chat 选择器甚至在未登录时就显示每个模型的输入 / 输出价格；文本按每 100 万 token 的输入 / 输出 / 缓存读取计价；图像按张、按百万像素或按分辨率；视频按秒或按分辨率。
- **按分辨率、音频、模式分别列价**：同一个视频模型，480p / 720p / 1080p、有无声音，各有各的价。
- **Chat 发送前预估**：输入时显示约多少 token、约多少 Credits。
- **高成本消息二次确认**：预计费用异常高时弹出"High-cost message"，让你确认 Send anyway 或取消。
- **Studio 生成前报价**：生成按钮旁显示你当前"模型 + 路径 + 参数"的确切价格；这个价格就是成功生成的扣费价。余额不足时直接拦截，不会扣费。
- **Chat 回复后明细**：Output details 展示 token（深度思考、文本输出、未缓存输入、缓存输入、合计）与 Credits（token 费用、联网搜索费用、合计）。
- **充值费用提前展示**：You pay / Network fee / Platform fee（5%）/ Credits added 在确认交易前全部列出。
- ⚠️ 价格每 5 分钟自动刷新。

**价格实例（价格页，快照 2026-11-04）⚠️** 这些模型出现在价格目录里，用来说明计价方式，不一定在 Studio 的 25 个模型之列。

| 例子 | 价格 |
|---|---|
| FLUX 3 Image Klein（图像） | 768 分辨率 $0.008 → 4K $0.036 / 张，分辨率不同价格不同 |
| Wan 3.0 Prime（视频） | 480p $0.068 / 秒；720p 5 秒 = **$0.70**（700,000 Credits） |
| Veo 3.1 Lite（Studio，4 秒 720p，带模型音频） | **$0.20**（200,000 Credits） |

**文案**

- 标题：**先看价，再下单。每一分钱，事前可见，事后可查。**
- 副标题：价格页列出所有模型的费率；聊天有预估，生成有确切报价，用量有逐条明细。
- EN headline: **No surprise bills.**
- EN sub: Every model's price on one page. An estimate before you chat. A firm quote before you generate. A line-by-line log after.

**提醒：** 不要说"最便宜"，没有数据支持。充值有 5% 平台费和链上网络费，这些**也要主动讲清楚**，这正是"透明"的一部分。

---

### SP4　Studio：四种方式创作图像与视频，细节可控

| | |
|---|---|
| **主张** | 文生图、图生图、文生视频、图生视频，在同一个页面完成；25 个模型可选，关键参数你说了算 |
| **EN** | Four ways to create. Twenty-five models. Your settings, your price. |
| **适用人群** | 创作者、设计师、短视频运营、营销团队 |

**证据 ✅**

- **四种路径**：Text to Image、Image to Image、Text to Video、Image to Video。
- **25 个创作模型**：15 个图像（Seedream 5.0 / 4.5、FLUX 3 Image、Qwen Image 3、Riverflow V2.5、Recraft V4.1 / V4、Grok Imagine Image 等）+ 10 个视频（Veo 3.1、Seedance 2.5 / 2.0 / 1.5、Wan 3.0 / 2.7、Kling v3.0 Pro 等）。⚠️ 模型清单会变化。
- **参考图**：最多 9 张（JPEG、PNG、WebP，每张 32 MB 以内）；个别模型更多，如 Seedream 最多 14 张。
- **首帧 + 尾帧**：视频可以指定开头和结尾画面。
- **自带配乐**：Seedance 2.5 / 2.0 系列与 Wan 3.0 支持上传 WAV / MP3 作为配乐；10 个视频模型均可生成声音。
- **控制项齐全**：比例与分辨率（图像最高 4K，视频最高 4K）、时长（最长 30 秒，视模型而定）、一次出多张图（最多 10 张，视模型而定）、Seed 复现、负向提示词、水印开关等。
- **提示词优化**：一键 ✨ 改写提示词。
- **后台生成**：提交后可以离开页面，作品在"我的作品"里从 Pending 自动变为 Generated。
- **作品管理**：筛选、下载、Try this 复用设置、图生视频一键转换。

**文案**

- 标题：**从一句话到一段视频，都在 Studio**
- 副标题：文生图、图生图、文生视频、图生视频，25 个模型任选。首尾帧、参考图、自带配乐，细节你来定；生成前先看价格。
- EN headline: **From a sentence to a finished clip.**
- EN sub: Text to image, image to image, text to video, image to video. 25 models, first/last frame, reference images, your own soundtrack — and the price before you press Generate.

**提醒：** Studio 目前**不提供**原地编辑（局部重绘、抠图、放大）与视频续写；同时最多 3 个视频处于 Pending；"通常数秒出图"只适用图像，视频可能需要几分钟。

---

### SP5　OpenAI 兼容 API：改 Base URL 就能接入，用量可控可查

| | |
|---|---|
| **主张** | 现有 OpenAI 兼容代码几乎不用改；每个 Key 都有预算护栏；每次调用都有记录 |
| **EN** | One endpoint. Key-based access. Per-key limits. Full request log. |
| **适用人群** | 开发者、AI 应用与 Agent 团队 |

**证据 ✅**

- **两处改动**：把 SDK 的 Base URL 换成 `https://api.maxshot.ai/v1`，把 Key 换成 `sk-ms-` 开头的 Maxshot Key。
- **接口覆盖**：`GET /models`、`POST /chat/completions`、`POST /responses`、`POST /completions`、`POST /messages`（Anthropic Messages 格式，支持 Bearer 或 `x-api-key`），均支持 JSON，其中对话类支持 SSE 流式。
- **Key 级护栏**：每个 Key 独立设置**日限额、月限额**（以 Credits 计）与**有效期**；日限额不能超过月限额；随时可 Revoke，立即生效。
- **Key 只显示一次**：创建时提示"立即复制，之后无法再次查看"。
- **请求日志**：时间、Key、请求模型、输入输出 token、延迟、费用、成功 / 失败，可按 Key 与状态筛选。
- **五种复制即用代码**：cURL、Python SDK、Python HTTP、JavaScript SDK、JavaScript HTTP。
- **模型 ID 一键复制**：价格页每个模型都有 Copy。

**文案**

- 标题：**换一个 Base URL，现有代码继续跑**
- 副标题：OpenAI 兼容。每个 Key 可设日/月额度与有效期，每一次调用都有记录。
- EN headline: **Swap the base URL. Keep your code.**
- EN sub: OpenAI-compatible. Daily and monthly limits per key. A request log for every call.

**代码示例（可直接用于文案配图）**

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

**提醒：** API **不支持**图像 / 视频生成、Embeddings、音频、Realtime、Gemini 原生接口。图像与视频创作只能在 Studio 里使用。不要暗示"API 可以生成视频"。

---

### SP6　Web3 原生：钱包登录，USDC / AIT 充值，跨链也能进

| | |
|---|---|
| **主张** | 习惯用钱包的人，可以直接用链上资产使用 AI |
| **EN** | Sign in with your wallet. Top up with USDC or AIT on Base. |
| **适用人群** | Web3 用户、Base 生态社区 |

**证据 ✅**

- **三种登录**：Google、GitHub、钱包（钱包登录仅签名验证所有权，不发起链上交易、不授权支付、不暴露私钥）。
- **充值方式**：Crypto（USDC / AIT，Base 网络，chain ID 8453）。
- **跨链充值**：通过 LI.FI 路由，控制台只展示当前支持的链和代币。
- **专属充值地址**：持有 Base 上的 USDC 或 AIT 的用户可以直接转入专属地址，链上确认后自动到账。
- **订单可追踪**：Top-up history 展示日期、方式、金额、费用、Credits、状态和链上交易链接。
- 最小充值 $1。

**文案**

- 标题：**用钱包登录，用 USDC 充值，直接用 AI**
- 副标题：Base 链上的 USDC 与 AIT 直充，也支持跨链；订单状态与链上交易全程可查。
- EN headline: **Your wallet is your account.**
- EN sub: Sign in with a wallet. Top up with USDC or AIT on Base, or bridge in from other chains.

**提醒：** 银行卡支付界面上显示为 "Card payments coming soon"，**目前不可用**，不要宣传"支持信用卡"。AIT 相关内容只描述为"支持的充值代币"，**不得出现价格预期、收益或投资暗示**。Credits **不可提现、不可退款**。

---

### 支撑卖点

| # | 卖点 | 证据 | 一句话文案（中 / EN） |
|---|---|---|---|
| **SP7** | **高阶对话体验** | 附件最多 5 个文件、每个 10 MB、合计 50 MB（PDF、TXT、MD、CSV、JSON、DOCX、XLS、XLSX；PNG、JPEG、WEBP、GIF；MP3、WAV）；联网搜索；Think 深度思考；同一条消息最多 10 个回复版本可左右切换对比；Edit 后另存分支；历史会话可搜索、重命名、删除；开发者模式可调 System prompt（≤3,000 字符）、Temperature、Top P、Max tokens、两个 Penalty | 把文件、图片、音频丢给它，还能保留多个版本的回答来对比。 / *Drop in files, images, audio — and keep every version of the answer.* |
| **SP8** | **用量与花费看得见** | Usage 页：余额（Free / Referral / Paid）、本月已用、7 天 / 30 天 / 全部趋势图、Credits / Token 切换、Chat 与 API 分系列、逐条明细（时间、类型、模型、token、Credits、联网搜索费用、耗时）；API 页另有请求日志 | 每一次调用花了多少，都有据可查。 / *Every token, every credit, accounted for.* |
| **SP9** | **Discover 灵感社区 + Try this** | 每个成功生成的作品自动出现在 Discover，附提示词与创作者名；浏览 All / Image / Video；一键 Try this 把提示词载入自己的输入框；视频显示时长与是否有声音 | 看别人怎么写提示词，一键拿来改成自己的。 / *Learn from what others made. Try it in one click.* |
| **SP10** | **推荐奖励** | 专属邀请链接 / 邀请码（格式 `ms-xxxxx-xxxxx-xxxxx`）；被邀请用户**完成并确认充值**后，邀请人获得推广 Credits；页面显示奖励比例、单人上限、待确认与已入账明细，可分享到 X / Telegram | 邀请朋友，确认充值后你也有奖励。 / *Invite friends. Earn credits when they top up.* |
| **SP11** | **免费上手** | Chat 无需账号即可打开浏览；Chat 阵容里有 **Free** 档（⚠️ 快照时 2 个模型）；更大的目录里共约 14 个免费文本模型，价格页中免费模型显示 Free；另有 Welcome 类免费 Credits 来源 ❓（金额待确认） | 先用免费模型试试手感，再决定要不要充值。 / *Start free. Top up when you need more.* |
| **SP12** | **顺手的细节** | 中英文界面、深色 / 浅色 / 跟随系统主题、移动端导航抽屉、聊天历史保留期可选永久 / 90 天 / 30 天、站内与邮件通知开关 | 中文英文都有，深浅色随你。 / *English and 中文. Dark, light, or system.* |

---

## 4. 功能特性全清单

> 按控制台导航顺序整理。"用户价值"是写文案时的翻译方向，"关键细节"是可以引用的事实。

### 4.1 Chat 对话

| 特性 | 用户价值 | 关键细节 |
|---|---|---|
| 模型分档选择与搜索 | 不知道选谁时，按场景挑 | 最多 7 个档位分组（目前显示 6 个）；每个模型显示输入 / 输出价格与能力标签；无需登录即可浏览 ✅ |
| Auto model | 新手免选择 | 开启后锁定为平台默认模型 ✅ |
| 附件上传 | 让模型读文档、看图、听音频 | 5 个 / 10 MB / 合计 50 MB；支持拖拽；模型不支持时有明确提示 ✅ |
| 联网搜索（Web search） | 回答带上实时信息 | 仅对支持的模型生效；计入联网搜索费用 ✅ |
| 深度思考（Think） | 复杂问题先想后答 | 部分模型可选，部分模型始终思考 ✅ |
| 发送前预估 | 事前知道大概费用 | 显示约 token 数与 Credits ✅ |
| 高成本消息确认 | 防止误发超长内容烧余额 | 弹窗 Send anyway / 取消 ✅ |
| 多版本回复 | 同一问题对比多个答案 | 单条消息最多 10 个版本；Regenerate 保留原答案 ✅ |
| 编辑并分支 | 改问题不丢上下文 | Edit → Save & send 生成新分支 ✅ |
| 历史会话 | 随时找回 | 搜索、重命名、删除；跨设备同步 ✅ |
| 历史保留期 | 隐私可控 | Profile 中选择 Permanent / 90 天 / 30 天 ✅ |
| 回复明细 Output details | 看清每条回答的成本构成 | token 分项 + Credits 分项 ✅ |
| 开发者模式 | 精细调参 | System prompt ≤ 3,000 字符；Temperature 0–2；Top P 0–1；Max tokens 1–8,192；Frequency / Presence penalty −2 到 2 ✅ |
| 停止生成 | 不需要的回复可随时中止，节省 Credits | 流式回复中可点击 Stop 提前结束 ✅ |
| 余额不足引导 | 不中断体验 | 提示并直达 Top up ✅ |

### 4.2 Studio 创作

| 特性 | 用户价值 | 关键细节 |
|---|---|---|
| 四种创作路径 | 覆盖从想法到成片 | T2I / I2I / T2V / I2V ✅ |
| 25 个创作模型 | 按风格、预算、能力选 | 15 图像 + 10 视频 ⚠️ |
| 提示词 5,000 字符 | 写得足够详细 | 实时字数计数 ✅ |
| ✨ 提示词优化 | 把一句话扩成好提示词 | 可能消耗 Credits，余额不足会提示 ✅ |
| 参考图 | 风格、角色、构图一致 | 最多 9 张，JPEG / PNG / WebP，单张 ≤ 32 MB；可从"我的作品"直接选 ✅ |
| 首帧 / 尾帧 | 控制视频开头与结尾 | 开关 First & last frame ✅ |
| 自带配乐 | 画面配上自己的声音 | WAV / MP3 ≤ 32 MB；部分模型支持 ✅ |
| 比例与分辨率 | 适配各平台尺寸 | 图像 6–18 种比例、最高 4K；视频 2–7 种比例、480p–4K ✅ |
| 视频时长 | 短片到长片段 | 如 Veo 4 / 6 / 8 秒，Wan 3.0 与 Seedance 2.5 最长 30 秒 ✅ |
| 多图输出 | 一次多个候选 | 视模型而定（最多 10 张）✅ |
| Seed | 复现或微调 | 整数，≤ 2,147,483,647 ✅ |
| 生成前确切报价 | 心里有数 | 报价即扣费价；过期自动刷新；报价失败不会提交 ✅ |
| 后台生成 | 不被页面绑住 | 可离开页面；最多 3 个视频同时排队 ✅ |
| 状态追踪 | 知道进度 | Pending / Generated / Failed；失败可显示 Blocked（安全审核）等具体原因 ✅ |
| 安全审核 | 合规边界清晰 | 被拦截的提示词或图片显示 Blocked，可修改后重试 ✅ |

### 4.3 我的作品与 Discover

| 特性 | 用户价值 | 关键细节 |
|---|---|---|
| My Creations | 作品自动归档 | 按类型（All / Image / Video）与状态筛选；Load more ✅ |
| 作品详情 | 复盘每次生成 | 媒体、日期、尺寸与分辨率（视频含时长）、使用过的参考图、提示词 ✅ |
| 下载 | 拿走成品 | Generated 的作品可下载 ✅ |
| Try this | 一键复用设置 | 载入提示词与参数到输入框（参考图需重新上传）✅ |
| Image to Video | 图片一步转视频 | 把图片作为参考图送进 Image to Video ✅ |
| Edit → Animate | 在编辑页把图片做成视频 | 仅图片可用 ✅ |
| 删除 | 自主清理 | 二次确认，永久删除 ✅ |
| Discover | 找灵感、学提示词 | 成功生成的作品自动出现，带提示词与创作者名；All / Image / Video 筛选 ✅ |

### 4.4 Pricing 价格页

| 特性 | 用户价值 | 关键细节 |
|---|---|---|
| 价格目录（需登录） | 发送前先比价 | Text / Image / Video 三个标签页；⚠️ 各标签页旁显示数量，会随目录变化（快照：Image 61 / Video 30） |
| 搜索与分组 | 快速定位 | 按模型 ID / 名称搜索，按厂商分组 ✅ |
| 多维度计价 | 精确到你的使用方式 | 每百万 token、每张、每百万像素、每秒；分辨率、音频、模式、长提示词、时段计价 ✅ |
| 模型详情 | 选型依据 | 上下文窗口、最大输出、发布日期；图像 / 视频的分辨率、比例、时长、首尾帧、音频、Seed；厂商、稳定性（5 分钟 / 30 分钟 / 1 天）、隐式缓存、支持参数 ✅ |
| USD 与 Credits 双显示 | 一眼换算 | 1 USD = 1,000,000 Credits ✅ |
| 一键复制模型 ID | 直接用于 API | Copy / Copy ID ✅ |
| 批处理版本 | 文本模型的批处理版本不占列表空间 | 批处理版本折叠在对应模型下 ✅ |
| 每 5 分钟刷新 | 价格新鲜 | 数据过期或不完整时页面会提示 ✅ |

### 4.5 API

| 特性 | 用户价值 | 关键细节 |
|---|---|---|
| OpenAI 兼容 | 迁移成本低 | Chat Completions、Responses、Completions ✅ |
| Anthropic Messages 格式 | 兼容 Anthropic 风格客户端 | `POST /messages`，Bearer 或 `x-api-key` ✅ |
| 流式输出 | 实时体验 | SSE ✅ |
| 多 Key 管理 | 按项目、按环境分开 | 名称 2–50 字符且唯一；状态 Active / Revoked / Expired ✅ |
| 日 / 月限额 | 预算护栏 | 以 Credits 计；日 ≤ 月；不得超过当前可用余额 ✅ |
| 有效期 | 临时 Key | 7 / 30 / 90 天 / 1 年或自定义日期 ✅ |
| 一键 Revoke | 泄露即止损 | 立即生效、不可撤销 ✅ |
| 请求日志 | 排障与对账 | 时间、Key、模型、token、延迟、费用、状态 ✅ |
| Quick Start 代码 | 5 分钟跑通 | cURL / Python SDK / Python HTTP / JS SDK / JS HTTP ✅ |

### 4.6 Credits 与充值

| 特性 | 用户价值 | 关键细节 |
|---|---|---|
| 统一余额 | 一份钱，所有场景 | Chat / Studio / API 共用 ✅ |
| 预设金额与自定义 | 灵活充值 | 最低 $1（所选代币可能有更高下限）✅ |
| Crypto 充值 | 链上资产直接用 | 先选链与代币，再看报价，再在钱包确认 ✅ |
| 费用透明 | 到账多少事先知道 | You pay / Network fee（LI.FI）/ Platform fee 5% / Credits added ✅ |
| 专属充值地址 | 直接转账 | 仅限 Base 上的 USDC / AIT；链上确认后自动入账 ✅ |
| 充值历史 | 对账 | 订单状态：detected、submitted、bridging、confirming、confirmed 等 ✅ |
| 余额分类 | 清楚来源 | Paid / Free / Referral ✅ |

### 4.7 Usage、Referral、Profile

| 模块 | 特性 | 关键细节 |
|---|---|---|
| Usage | 余额与趋势 | 7 天 / 30 天 / 全部；Credits / Token 切换；Chat 与 API 分开显示 ✅ |
| Usage | 逐条明细 | 时间、类型、模型、token、Credits、联网搜索费用、耗时；按 Chat / API / All 筛选 ✅ |
| Referral | 邀请链接与邀请码 | 复制链接 / 复制邀请码 / 分享到 X / Telegram ✅ |
| Referral | 奖励透明 | Earned、Confirmed top-up、Reward rate、Reward cap、Pending、Referred accounts；奖励状态 Confirmed / Pending / Withheld / Under review / Revoked ✅ |
| Profile | 登录方式管理 | 绑定 / 解绑 Google、GitHub、钱包；不可解绑最后一种 ✅ |
| Profile | 个性化 | 语言（English / 中文）、主题（Dark / Light / System）、历史保留期、通知、开发者模式 ✅ |

---

## 5. 数字速查表（对外引用前请对照"稳定性"列）

| 项目 | 数值 | 来源 | 稳定性 |
|---|---|---|---|
| 文本模型（价格页，不含批处理） | 345 个，来自 57 个厂商标识 | `/model-pricing`，2026-11-04 | ⚠️ 对外建议写"340+""50+" |
| 图像模型（价格页） | 61 个 | 同上 | ⚠️ 对外写"60+" |
| **Chat 选择器里的模型** | **22 个，6 个档位**（Flagship 6、Reasoning 3、Balanced 6、Economy 3、Code 3、Free 2） | `/model-catalog`、线上 Chat 选择器 | ⚠️ Chat 是精选阵容 |
| Chat 与价格页背后的模型目录条目 | 417 条（含批处理版本） | `/model-catalog` | ⚠️ 不要称为"Chat 里的模型" |
| 无需登录即可打开的页面 | 仅 Chat。Studio、Usage、API、Credits、Pricing、Referral、Profile 都需要登录 | 前端路由表 | ✅ |
| 视频模型（价格页） | 31 个 | 同上 | ⚠️ 对外写"30+" |
| Studio 创作模型 | 25 个（15 图像 + 10 视频） | 产品文档 Release 2.0（登录后的 Studio，未登录无法复核） | ⚠️ |
| 上下文窗口 ≥ 100 万 token 的文本模型 | 123 个 | `/model-pricing` | ⚠️ |
| 支持推理参数 / 工具调用 / 结构化输出的文本模型 | 238 / 284 / 275 个 | 同上 | ⚠️ |
| 当前免费文本模型 | 目录中约 14 个（带 :free 标识）；Chat 选择器中 2 个 | 同上、`/model-catalog` | ⚠️ |
| 单条消息附件 | 5 个文件，单个 10 MB，合计 50 MB | 线上词条 | ✅ |
| 回复版本上限 | 10 个 / 消息 | 线上词条 | ✅ |
| 开发者模式参数范围 | Temperature 0–2；Max tokens 1–8,192；System prompt ≤ 3,000 字符 | 线上词条 | ✅ |
| 历史保留期 | Permanent / 90 天 / 30 天 | 线上词条 | ✅ |
| 提示词上限（Studio） | 5,000 字符 | 产品文档 | ✅ |
| 参考图 | ≤ 9 张，单张 ≤ 32 MB（JPEG / PNG / WebP） | 产品文档 | ✅ |
| 视频并发 | 同时最多 3 个 Pending | 产品文档 | ✅ |
| Credits 换算 | 1 USD = 1,000,000 Credits | 线上词条 / 价格页 | ✅ |
| 最低充值 | $1 | `/config` | ✅ |
| 平台充值费率 | 5% | `/config` | ✅（运营如有调整以线上为准） |
| 充值网络 | Base（chain ID 8453），代币 USDC、AIT | `/config` | ✅ |
| API Base URL | `https://api.maxshot.ai/v1` | `/config` | ✅ |
| API Key 前缀 | `sk-ms-` | 产品文档 | ✅ |
| 价格刷新 | 每 5 分钟 | `/model-pricing` | ✅ |

**文本模型价格锚点（Chat 选择器，每 100 万 token，输入 / 输出，美元；快照 2026-11-04）⚠️**

| 模型 | 输入 / 输出 | 用途示意 |
|---|---|---|
| DeepSeek V4.1 Flash | $0.045 / $0.50 | 低成本批量任务 |
| Claude Haiku 5.5 | $0.10 / $0.50 | 轻量快速 |
| GPT-5.6 Luna | $0.20 / $1.20 | 通用 |
| Gemini 3.8 Flash | $0.825 / $4.13 | 均衡 |
| Claude Sonnet 5.5 | $2 / $10 | 均衡到高能力 |
| Claude Opus 5.5 | $4 / $20 | 高能力 |

> 说明：从免费模型到每百万 token 数美元的高能力模型（目录中个别模型更高），价格跨度很大，这正是需要"价格页 + 预估"的原因。这些数字只用于**解释价差**，不要在宣传里写成"某模型比别处便宜"。

---

## 6. 与"常见做法"的对比叙事

> 不点名竞品。只对比"用户今天通常怎么做"。

| 维度 | 常见做法 | 用 Maxshot Gateway |
|---|---|---|
| 账号与余额 | 聊天、画图、视频、API 各开一个账号、各充一份 | 一个账号、一份 Credits 余额 |
| 比较模型 | 逐个官网查价格、查能力 | 一个价格页看 Text / Image / Video 全部，能力标签与价格并列 |
| 创作前的价格 | 生成完才知道花了多少 | 生成按钮旁就是确切价格，余额不足会提前拦截 |
| 接入多个模型 | 为每家写一套 SDK 与 Key | 一个 Base URL、一个 Key，OpenAI 兼容 |
| 防止 Key 失控 | 全局额度，出问题整体停 | 每个 Key 单独日 / 月限额与有效期，一键 Revoke |
| 对账 | 不同平台账单格式各异 | Usage 与请求日志统一展示，可按 Chat / API 区分 |
| 链上用户付款 | 需要绑定银行卡 | 钱包登录，USDC / AIT 直接充值，也可跨链 |

---

## 7. 场景故事

### 场景 A：独立开发者 5 分钟接入

1. 用 GitHub 登录，充 $5。
2. 进入 API 页，创建 Key，设置日限额与 30 天有效期。
3. 复制 Python SDK 示例，把 Base URL 和 Key 填进去。
4. 运行，收到回复；回到请求日志看到刚才那条的 token、延迟和费用。
5. **亮点：** 改动只有 Base URL 和 Key；Key 有预算护栏。

### 场景 B：短视频运营做一条产品短片

1. 进入 Studio → Video → Image to Video。
2. 上传产品图作为首帧，再上传另一张作为尾帧。
3. 选模型、选 9:16 与 720p、选 6 秒，开启模型音频。
4. 看到按钮旁的确切价格，点击 Generate，然后离开页面去开会。
5. 回来在"我的作品"里已变为 Generated，下载。
6. **亮点：** 首尾帧、确切报价、后台生成。

### 场景 C：设计师找灵感

1. 打开 Discover，筛选 Image。
2. 看到喜欢的作品，打开查看提示词。
3. Try this，把提示词载入输入框，换上自己的主题。
4. 生成，满意后下载。
5. **亮点：** 社区作品与提示词、一键复用。

### 场景 D：研究人员比较模型

1. 在 Pricing 页搜索几个候选模型，看上下文窗口、价格、稳定性。
2. 回到 Chat，上传一份 PDF，分别用不同模型提问。
3. 在同一条消息下 Regenerate，切换不同回复版本对比。
4. 打开 Output details，看每次回答花了多少。
5. **亮点：** 比价、多版本回复、成本明细。

### 场景 E：链上用户直接用 USDC

1. 用钱包登录（只签名，不交易）。
2. Credits → Crypto → 选择链和代币，查看报价（含网络费与 5% 平台费）。
3. 在钱包里确认，等待链上确认。
4. Top-up history 里订单变为 confirmed，Credits 到账。
5. **亮点：** 钱包即账号，费用事前展示。

### 场景 F：社区运营者做推荐

1. 进入 Referral，复制邀请链接。
2. 分享到 X / Telegram。
3. 被邀请的用户完成并确认充值后，奖励入账。
4. 在 Referral 页看奖励状态（Pending / Confirmed）。
5. **亮点：** 奖励状态公开透明。

---

## 8. 渠道文案包

### 8.1 Slogan 候选

| 编号 | 中文 | English | 适用 |
|---|---|---|---|
| S1（推荐主 slogan） | **一个账号，聊天、创作、开发。** | **Chat it. Create it. Build on it.** | 品牌主视觉、首屏 |
| S2 | 看得见价格的 AI 入口。 | **See the price before you spend.** | 价格透明主题 |
| S3 | 换个 Base URL，现有代码继续跑。 | **Swap the base URL. Keep your code.** | 开发者 |
| S4 | 从一句话到一段视频。 | **From a sentence to a finished clip.** | Studio |
| S5 | 钱包即账号。 | **Your wallet is your account.** | Web3 受众 |
| S6 | 一份余额，所有场景。 | **One balance. Everything.** | 余额与充值 |

### 8.2 官网 / 落地页结构建议

1. **Hero：** S1 + 副标题（一个账号、一份余额，聊天、创作、开发全部打通）+ 主按钮 **Start free / 免费开始**，次按钮 **View pricing / 查看价格**。
2. **三栏概览：** Chat｜Studio｜API，每栏一句话 + 一张截图。
3. **"价格透明"板块：** 价格页截图 + Studio 报价截图 + 充值费用拆分截图。
4. **"为开发者"板块：** 代码示例 + Key 限额截图 + 请求日志截图。
5. **"为创作者"板块：** Studio 四种路径图标 + Discover 作品墙。
6. **"链上友好"板块：** 钱包登录、USDC / AIT、跨链示意。
7. **数字条：** Chat 22 个模型｜价格目录 340+ 个模型｜25 个创作模型｜5 种代码示例（⚠️ 发布时核对）。
8. **FAQ：** 取 §8.8 的前 6 个问题。
9. **页脚：** Telegram、X、GitHub、Docs；"模型名称及商标归各自权利人所有"。

### 8.3 X（Twitter）英文文案

**单条推文**

> **T1 · 定位**
> One account. One balance.
> Chat with leading AI models, create images and videos, and build with an OpenAI-compatible API.
> That's Maxshot Gateway. → gateway.maxshot.ai

> **T2 · 价格透明**
> You shouldn't need a spreadsheet to know what an AI request costs.
> Maxshot Gateway: every model's price on one page, an estimate before you chat, a firm quote before you generate.
> No surprise bills.

> **T3 · Studio**
> Text to image. Image to image. Text to video. Image to video.
> 25 models in one place, with first/last frame, reference images and your own soundtrack — and the price shown before you hit Generate.
> Studio, inside Maxshot Gateway.

> **T4 · 开发者**
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

> **T7 · 用量可见**
> Every message has a receipt.
> Open "Output details" to see tokens and credits for each reply — thinking, output, cached input, web search.
> Usage and request logs keep the whole picture.

> **T8 · 免费上手**
> Not sure where to start? Pick a free-tier model and just chat.
> When you need more power, compare every model's price on one page and top up whenever you're ready.

**Thread（6 条）：Why we built Maxshot Gateway**

1. Using AI today often means: one app for chat, another for images, another for video, plus separate API accounts. Each with its own balance. 🧵
2. Maxshot Gateway puts it all behind one login and one Credits balance — chat, image and video creation (Studio), and an API.
3. Pricing is transparent. Every model's rate is on one page. In chat you see an estimate; in Studio you see a firm price before you generate.
4. Developers: it's OpenAI-compatible. Swap the base URL and key. Each key gets its own daily/monthly limit and expiry, plus a request log.
5. Creators: four ways to make images and videos, 25 models, first/last frame, reference images, your own soundtrack. Results live in My Creations; Discover shows what the community made.
6. Sign in with Google, GitHub or a wallet. Top up with USDC or AIT on Base. Try it → gateway.maxshot.ai

### 8.4 Telegram / 社群公告

**中文**

> 📣 **Maxshot Gateway：聊天、创作、开发，一个入口**
>
> 现在，你可以用同一个账号、同一份余额：
> 💬 **Chat**：按档位选模型，上传文件 / 图片 / 音频，联网搜索，多版本回复对比
> 🎨 **Studio**：文生图、图生图、文生视频、图生视频，25 个模型，生成前显示确切价格
> 🔌 **API**：OpenAI 兼容，Key 级日 / 月限额，调用日志可查
> 💰 **Pricing**：所有模型价格一页列出，随时比价
>
> 钱包、Google、GitHub 均可登录；支持 Base 链 USDC / AIT 充值，也支持跨链。
> 👉 gateway.maxshot.ai
> 使用问题请到这里反馈。

**English**

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

### 8.5 口播脚本

**30 秒版（短视频 / 直播开场）**

> 想用 AI 聊天、画图、做视频，还要接 API，是不是要开一堆账号？
> Maxshot Gateway 把它们放在一起：一个账号，一份余额。
> 聊天按档位选模型；Studio 有四种创作方式、25 个模型，点生成之前就告诉你这次多少钱；开发者换个 Base URL 就能接入。
> 价格全部列出，用量全部可查。
> 打开 gateway.maxshot.ai，先用免费模型试试。

**60 秒演示版（对应屏幕动作）**

| 时间 | 口播 | 画面 |
|---|---|---|
| 0–8 秒 | "一个账号搞定聊天、创作和 API。" | 登录页 → 控制台 |
| 8–20 秒 | "聊天里挑模型、传文件，输入时就能看到预估费用。" | Chat 选择器 → 附件 → 预估 |
| 20–38 秒 | "Studio 里写提示词，选模型和比例，按钮旁边就是这次的确切价格，点击生成就可以离开。" | Studio 报价 → Generate → My Creations |
| 38–50 秒 | "开发者：复制代码，换 Base URL 和 Key，每个 Key 都能设日 / 月额度。" | API 页 → Quick Start → 限额 |
| 50–60 秒 | "价格页列出所有模型的价格。现在就来试试。" | Pricing 页 → CTA |

### 8.6 开发者社区帖（Dev / Reddit 风格，英文）

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

### 8.7 Referral 话术

- **产品自带的分享文案（Referral 页内置）：** *"Access frontier AI models with Web3 payments on Maxshot Gateway. Join with my invite:"* 建议以这句为基准撰写邀请文案，保持与产品一致。
- **邀请文案（中）：** 我在用 Maxshot Gateway，一个账号就能聊天、做图、做视频、接 API，价格全部列出。用我的链接注册：`你的邀请链接`
- **邀请文案（EN）:** I use Maxshot Gateway for chat, image/video creation and the API — one account, one balance, every price listed. Join with my link: `your referral link`
- **注意：** 奖励的前提是被邀请用户**完成并确认充值**，而不是注册。奖励比例与上限以 Referral 页面显示为准 ❓。**不要写"躺赚""稳定收益""被动收入"。**

### 8.8 FAQ 话术

| 问题 | 标准回答 |
|---|---|
| Maxshot Gateway 是什么？ | 一个把 AI 对话、图像与视频创作、OpenAI 兼容 API 放在一起的控制台。一个账号、一份 Credits 余额通用于所有功能。 |
| 怎么登录？ | 支持 Google、GitHub 和钱包。钱包登录只需签名一条消息，不会发起链上交易，也不会授权支付。 |
| 怎么付款？ | 目前支持 Crypto：Base 链上的 USDC 与 AIT，也可从其他链跨链充值。银行卡支付显示 "coming soon"，暂未开放。 |
| 费用怎么算？ | 1 美元 = 1,000,000 Credits。充值时会展示 Network fee 与 5% Platform fee；使用时各模型按价格页的费率扣除。 |
| 怎么提前知道会花多少？ | Chat 输入时显示预估；Studio 生成按钮旁显示确切价格；Pricing 页可以逐个模型查看费率。 |
| 能退款或提现吗？ | 不能。Credits 只能在 Maxshot 内消费，不支持提现和退款。 |
| 有哪些模型？ | Chat 提供精选的模型阵容，未登录也能浏览；价格页列出文本、图像、视频模型的更大目录。数量与价格会随时更新，请以线上页面为准。 |
| 有免费模型吗？ | 有。Chat 模型选择器里有 Free 档位，价格页中无费用的模型显示 Free。 |
| 不注册能先看看吗？ | 可以打开 Chat，浏览模型选择器和每个模型的价格；发送消息以及其他所有页面（Studio、Usage、API、Credits、Pricing、Referral、Profile）都需要登录。 |
| API 怎么用？ | 在 API 页创建 Key，复制示例代码，把 Base URL 换成 `https://api.maxshot.ai/v1` 并填入 Key 即可。 |
| API 能生成图片或视频吗？ | 不能。图像与视频创作在 Studio 里使用。API 支持文本对话类接口。 |
| 我的作品会公开吗？ | 会。成功生成的作品会自动出现在 Discover，并显示提示词，请不要在提示词里放隐私或敏感信息。 |
| 视频要等多久？ | 视频通常需要几分钟，可以离开页面，完成后在"我的作品"里查看。同时最多 3 个视频排队。 |
| 对话记录会保留多久？ | 在 Profile 中选择 Permanent / 90 天 / 30 天。删除对话不可恢复。 |
| 遇到问题怎么办？ | 到 Telegram 群 t.me/maxshotai 反馈；充值问题请附上交易哈希。**永远不要发送助记词或私钥。** |

---

## 9. 宣传红线与合规用语

### 9.1 不能说

| 不要这样说 | 原因 | 可以这样说 |
|---|---|---|
| "最便宜 / 最快 / 最全 / 全球第一" | 没有可核验的对比数据 | "每个模型的价格都有列出""模型目录持续更新" |
| "Chat 里有上百个模型" | Chat 是精选阵容（目前 22 个），340+ 是价格页目录 | "Chat 精选阵容 + 340+ 个模型的价格目录" |
| "不用注册就能看全部价格"或"不注册就能试 Studio / API" | 只有 Chat 无需登录；Pricing、Studio、API 需要登录（Chat 选择器会显示价格） | "无需账号即可浏览 Chat 和模型价格" |
| "支持所有主流模型" / "任意模型" | 目录是动态的，不是所有模型都支持所有能力 | "覆盖众多主流厂商（以价格页为准）" |
| "支持信用卡 / Apple Pay" | Card 目前显示 coming soon | "支持 Crypto 充值，银行卡即将推出"（仅在产品确认后才可提） |
| "API 可以生成图片和视频" | API 不支持图像、视频、音频、Embeddings、Realtime、Gemini 原生 | "图像与视频创作在 Studio" |
| "作品完全私密" | 成功生成的作品自动出现在 Discover | "成功生成的作品会展示在 Discover" |
| "可以退款 / 提现" | 不支持 | "Credits 仅可在 Maxshot 内使用" |
| "零费用充值" | 有网络费和 5% 平台费 | "费用在确认前全部展示" |
| "秒出视频" | 视频通常需要几分钟 | "后台生成，完成后在我的作品里查看" |
| "稳赚""被动收入""AIT 会涨" | 构成收益承诺或投资暗示 | 只描述功能：支持的充值代币 |
| "官方合作 / 官方授权"（对任何模型厂商） | 无授权证明 | "可使用 XX 模型" 并注明商标归权利人所有 |
| "无审核、无限制" | Studio 设有安全审核，违规提示词或图片会显示 Blocked | "遇到 Blocked 可修改提示词后重试" |
| "新版 Studio""旧版 Gateway" | 产品是一个整体 | "Maxshot Gateway 的创作能力（Studio）" |

### 9.2 必须带的声明（按场景）

- 提到具体模型名或价格：*"模型与价格动态变化，以 gateway.maxshot.ai 价格页为准。截至 YYYY-MM-DD。"*
- 提到模型品牌：*"模型名称及商标归各自权利人所有。"*
- 提到充值：*"Credits 仅可在 Maxshot 内消费，不支持提现与退款。"*
- 提到 Studio 作品：*"成功生成的作品会展示在 Discover，请勿在提示词中包含隐私信息。"*
- 提到推荐奖励：*"奖励以页面显示的规则为准，被邀请用户需完成并确认充值。"*

### 9.3 安全提醒（客服与运营话术）

- 任何人（包括客服）都不会索要助记词、私钥或 API Key 明文。
- 截图和视频里的 API Key 必须**打码**（可参考 User Guide v2 的处理方式）。
- 示例代码中的 Key 一律使用占位符，如 `YOUR_MAXSHOT_KEY`。

---

## 10. 待确认清单（发布前请产品 / 运营补齐）

| # | 事项 | 为什么需要 | 影响的内容 |
|---|---|---|---|
| 1 | **新用户免费 Credits 的金额与领取条件** | 线上有 Welcome 来源，但金额无法从公开页面核实 | SP11、"免费开始"类文案 |
| 2 | **Referral 的奖励比例与单人上限** | 页面使用变量展示，不登录无法看到当前值 | SP10、§8.7 |
| 3 | **API 能否调用目录里的全部模型** | Chat 只提供 22 个模型，而价格页与 `/model-catalog` 背后的目录有 417 条。`/v1/models` 需要 Key，未能核实 API Key 实际能调用什么 | SP2、SP5、"340+"的说法 |
| 4 | **哪些头部模型可以在宣传中点名** | 点名的模型应当是 Chat 阵容里真实存在的模型（见 SP2） | SP2、§5 价格锚点 |
| 5 | **银行卡支付的上线时间** | 上线后可更新 §8.8、§9.1 | 付款相关文案 |
| 6 | **失败生成的计费规则** | 文档只写"成功生成按报价扣费"，失败是否扣费需明确 | Studio 的 FAQ |
| 7 | **官网 meta description 是否同步更新** | 当前仍是"chat and API developers" | §1.4 |
| 8 | **品牌素材**：Logo 规范、品牌色、字体 | 做海报与视频需要统一 | §11 |
| 9 | **是否允许点名模型厂商做宣传** | 涉及商标使用与合作口径 | §3 SP2、§8 |
| 10 | **Memory 功能**：线上存在页面但未出现在侧边栏 | 未开放，本手册不宣传 | — |
| 11 | **Studio 的各项数字**（25 个模型、最多 9 张参考图、5,000 字符提示词、32 MB、3 个视频并发）来自产品文档和登录后的 Studio，未登录无法复核 | 发布前请在登录后的 Studio 里抽查 | SP4、§4.2、§5 |
| 12 | **Discover 发布是否经过扫描或审核** | 前端有发布状态 Private、Scanning、Under review、Published、Rejected。产品已确认成功生成会自动进入 Discover，请确认是否可能延迟或被拒绝 | SP9、§8.8 FAQ |
| 13 | **不同环境的 API Base URL 不一致** | 线上站点的配置返回 `https://api.maxshot.ai/v1`；较早的环境返回过 `https://api-gateway.888646.xyz/v1`。文档必须使用生产环境的值 | 代码示例、FAQ、User Guide v2 文件、产品文档 |

---

## 11. 素材建议

| 用途 | 建议素材 | 来源 |
|---|---|---|
| 首屏 / 概览 | 控制台总览、侧边栏导航（突出 8 个入口） | 线上截图 |
| 模型选择 | Chat 模型选择器（分档、价格、能力标签） | 线上截图；参考 User Guide v2 |
| 价格透明 | Pricing 页列表 + 详情面板；Studio 生成按钮旁的报价；充值报价（You pay / Network fee / Platform fee / Credits added） | 线上截图 |
| Studio | 四种创作路径 Tab；首尾帧上传框；My Creations 网格；Discover 作品墙 | 线上截图；参考 User Guide v2 第 10–19 节 |
| API | Key 创建对话框（日 / 月限额、有效期）；请求日志；Quick Start 代码 | 线上截图；**Key 必须打码** |
| 用量 | Usage 趋势图与明细表；Output details 面板 | 线上截图 |
| 充值 | 钱包登录；Credits 页的 Crypto 流程；Top-up history | 线上截图 |
| 短视频 | §8.5 的 60 秒演示脚本，建议用真实操作录屏 | 录制 |

> 参考：`Maxshot_Gateway_User_Guide_v2.html`（英文）与 `Maxshot_Gateway_使用教程_v2.html`（中文）已包含 42 张已处理（Key 已模糊）的界面截图，可直接挑选。
> 注意：旧版 Chat 截图可能与线上现状略有出入，使用前请重拍。

---

*本手册基于 2026-11-04 的线上环境整理。动态数据请在每次发布前复核；如发现与线上不一致，以线上为准。*
