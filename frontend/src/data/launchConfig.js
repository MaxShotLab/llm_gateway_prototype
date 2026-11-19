// Mirrors spec/LAUNCH_CONFIG_V0.md. Consult each row's status before using a value as a launch parameter.
export const launchConfig = {
  version: "v0.2",
  creditsPerUsd: 1_000_000,
  aitUsdPerYear: 12,
  catalogs: [
    { id: "catalog_text", label: "Text" },
    { id: "catalog_image", label: "Image" },
    { id: "catalog_video", label: "Video" },
  ],
  aitEarnedCreditCatalogs: ["catalog_text"],
  keyDefaults: { dailyBudgetCents: 2_000, monthlyBudgetCents: 20_000, perRequestCeilingCents: 0, allowedCatalogs: [], dollarSpend: false },
  holdAutoReleaseHours: 24,
  uncertainJobGraceMinutes: 15,
};

export const newRequestId = () => `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
