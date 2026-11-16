import { getUsableModels, providerSnapshot } from "./providerCatalog";

export const starterConversations = [
  {
    id: "usage-review",
    title: "Gateway usage overview",
    model: "MiniMax-M3",
    updated: "12 min",
    messages: [
      {
        role: "user",
        content:
          "Summarize the main features of an AI gateway for chat and API access.",
      },
      {
        role: "assistant",
        content:
          "An AI gateway provides a consistent chat and API experience, supports streaming, applies API-key limits, and records token usage, Credit cost, latency, and request status.",
        citations: [
          {
            title: "Chat and API access",
            source: "Maxshot product baseline",
            url: "#access",
          },
          {
            title: "Gateway observability",
            source: "Internal architecture notes",
            url: "#observability",
          },
        ],
      },
    ],
  },
  {
    id: "api-migration",
    title: "API migration checklist",
    model: "Claude Sonnet 4.6",
    updated: "Yesterday",
    messages: [
      {
        role: "user",
        content: "Create a checklist for migrating an OpenAI SDK to Maxshot.",
      },
      {
        role: "assistant",
        content:
          "Update the base URL and API key, map the requested model to the Maxshot catalog, verify streaming behavior, configure API-key limits, and test request errors before moving production traffic.",
      },
    ],
  },
  {
    id: "launch-brief",
    title: "Launch brief draft",
    model: "GPT-5 mini",
    updated: "Jun 10",
    messages: [
      {
        role: "user",
        content: "Draft a concise internal launch brief for the gateway prototype.",
      },
      {
        role: "assistant",
        content:
          "The prototype validates Maxshot's existing product structure: multi-model chat, API access, top-up, free and paid Credits, usage records, referral rewards, and API-key limits. Proposed Phase 2 surfaces remain clearly separated from launched features.",
      },
    ],
  },
  {
    id: "attachment-notes",
    title: "Attachment support notes",
    model: "Gemini 3.1 Pro",
    updated: "Jun 9",
    messages: [
      {
        role: "user",
        content: "Explain how file attachments depend on the selected model.",
      },
      {
        role: "assistant",
        content:
          "Attachment controls are enabled only when the selected model supports the uploaded file type. Unsupported controls remain disabled until a compatible model is selected.",
      },
    ],
  },
];

const chatModelExamples = [
  {
    name: "MiniMax-M3",
    modelId: "minimax/minimax-m3",
    eligibilityIndex: "B",
    provider: "MiniMax",
    tier: "Flagship",
    price: "$0.24 / 1M tokens",
    context: "128K",
    zeroRetention: true,
    webSearch: true,
    reasoning: false,
    files: true,
    estimatedCost: "$0.002",
  },
  {
    name: "Claude Sonnet 4.6",
    modelId: "anthropic/claude-sonnet-4.6",
    eligibilityIndex: "P",
    provider: "Anthropic",
    tier: "Flagship",
    price: "$3.00 / 1M input",
    context: "200K",
    zeroRetention: true,
    webSearch: true,
    reasoning: true,
    files: true,
    estimatedCost: "$0.036",
  },
  {
    name: "Gemini 3.1 Pro",
    modelId: "google/gemini-3.1-pro",
    eligibilityIndex: "P",
    provider: "Google",
    tier: "Flagship",
    price: "$1.25 / 1M input",
    context: "1M",
    zeroRetention: false,
    webSearch: true,
    reasoning: true,
    files: true,
    estimatedCost: "$0.018",
  },
  {
    name: "GPT-5 mini",
    eligibilityIndex: "F",
    provider: "OpenAI",
    tier: "Free",
    price: "$0 during free quota",
    context: "128K",
    zeroRetention: false,
    webSearch: false,
    reasoning: false,
    files: false,
    estimatedCost: "$0.000",
  },
  {
    name: "Aion 3.5 Mini",
    modelId: "aion-labs/aion-3.5-mini",
    eligibilityIndex: "P",
    provider: "Aion Labs",
    tier: "Sample",
    context: "128K",
    webSearch: false,
    reasoning: false,
    files: false,
    estimatedCost: "$0.002",
  },
  {
    name: "DeepSeek V4 Flash",
    modelId: "deepseek/deepseek-v4-flash",
    eligibilityIndex: "P",
    provider: "DeepSeek",
    tier: "Sample",
    context: "128K",
    webSearch: false,
    reasoning: false,
    files: false,
    estimatedCost: "$0.001",
  },
];

const usableTextIds = new Set(getUsableModels(providerSnapshot, "text").map((model) => model.modelId));
const chatOrder = new Map(chatModelExamples.map((model, index) => [model.modelId, index]));
export const chatModels = [
  ...providerSnapshot.models.filter((model) => model.modality === "text").sort((a, b) => (chatOrder.get(a.modelId) ?? Infinity) - (chatOrder.get(b.modelId) ?? Infinity)).map((model) => {
    const example = chatModelExamples.find((item) => item.modelId === model.modelId);
    const offering = providerSnapshot.offerings.find((item) => item.modelId === model.modelId && item.admissionStatus === "passed" && item.availability === "available" && item.policyEligible === true);
    return { ...example, name: model.displayName, modelId: model.modelId, eligibilityIndex: model.chatEligibilityIndex,
      provider: offering ? providerSnapshot.providers.find((item) => item.providerId === offering.providerId).name : example?.provider || "Gateway",
      tier: example?.tier || "Catalog", webSearch: example?.webSearch || false, reasoning: example?.reasoning || false,
      files: example?.files || false, available: usableTextIds.has(model.modelId) };
  }),
  ...chatModelExamples.filter((model) => !providerSnapshot.models.some((item) => item.modelId === model.modelId)).map((model) => ({ ...model, available: false })),
];

export const mockUploadFiles = [
  {
    id: "gateway-spec",
    name: "gateway-spec.pdf",
    type: "PDF",
    size: "842 KB",
  },
  {
    id: "usage-export",
    name: "usage-export.csv",
    type: "CSV",
    size: "48 KB",
  },
];
