export const starterConversations = [
  {
    id: "routing-review",
    title: "Gateway routing review",
    model: "MiniMax-M3",
    updated: "12 min",
    messages: [
      {
        role: "user",
        content:
          "Summarize the main requirements for a reliable multi-provider routing layer.",
      },
      {
        role: "assistant",
        content:
          "A reliable routing layer needs deterministic provider selection, bounded retries, model-compatible failover, cost and latency telemetry, and explicit privacy constraints. The gateway should record the requested model, serving provider, token usage, latency, cost, and failover events for every request.",
        citations: [
          {
            title: "Routing and fallbacks",
            source: "Maxshot product baseline",
            url: "#routing",
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
          "Update the base URL and API key, map the requested model to the Maxshot catalog, verify streaming behavior, set a spending limit, and test timeout and failover handling before moving production traffic.",
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
          "The prototype validates Maxshot's Phase 1 structure: configured multi-model chat, API access, top-up, free and paid credits, usage totals, referral rewards, and spending controls. Phase 2 surfaces such as prompts, agents, skills, and memory remain separated from the launch scope.",
      },
    ],
  },
  {
    id: "privacy-notes",
    title: "Privacy mode notes",
    model: "Gemini 3.1 Pro",
    updated: "Jun 9",
    messages: [
      {
        role: "user",
        content: "Explain temporary chat versus zero-retention mode.",
      },
      {
        role: "assistant",
        content:
          "Temporary chat prevents Maxshot from adding the conversation to persistent history. Zero-retention mode also requires an eligible provider route that does not retain prompt or response content.",
      },
    ],
  },
];

export const chatModels = [
  {
    name: "MiniMax-M3",
    provider: "MiniMax",
    zeroRetention: true,
    webSearch: true,
  },
  {
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    zeroRetention: true,
    webSearch: true,
  },
  {
    name: "Gemini 3.1 Pro",
    provider: "Google",
    zeroRetention: false,
    webSearch: true,
  },
  {
    name: "GPT-5 mini",
    provider: "OpenAI",
    zeroRetention: false,
    webSearch: false,
  },
];

export const mockAttachments = [
  {
    id: "gateway-spec",
    name: "gateway-spec.pdf",
    type: "document",
    size: "842 KB",
  },
  {
    id: "routing-chart",
    name: "routing-chart.png",
    type: "image",
    size: "1.4 MB",
  },
];
