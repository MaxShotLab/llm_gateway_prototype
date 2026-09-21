export const creditsPerUsd = 1_000_000;

export const subscriptionPlans = [
  {
    id: "core",
    name: "Core",
    priceUsd: 12,
    allowance: 15_000_000,
    policyVersion: "2026-09-v1",
    limits: { fiveHour: 3_000_000, weekly: 12_000_000 },
  },
  {
    id: "plus",
    name: "Plus",
    priceUsd: 20,
    allowance: 30_000_000,
    policyVersion: "2026-09-v1",
    limits: { fiveHour: 5_000_000, weekly: 25_000_000 },
  },
];

export const billingScenarioOptions = [
  { id: "payg", label: "PAYG only" },
  { id: "checkout", label: "Plan selection" },
  { id: "active", label: "Active subscription" },
  { id: "low", label: "Allowance low" },
  { id: "exhausted", label: "Allowance exhausted" },
  { id: "insufficient", label: "No usable Credits" },
  { id: "cancelled", label: "Cancelled at period end" },
  { id: "past_due", label: "Failed renewal + PAYG" },
];

const defaultBalances = {
  free: 6_800_000,
  referral: 500_000,
  paid: 48_200_000,
};

export function createBillingScenario(scenario = "active") {
  const plan = subscriptionPlans[1];
  const base = {
    scenario,
    balances: { ...defaultBalances },
    subscription: null,
  };

  if (scenario === "insufficient") {
    return {
      ...base,
      balances: { free: 0, referral: 0, paid: 0 },
      subscription: {
        ...plan,
        status: "active",
        used: plan.allowance,
        windowUsage: { fiveHour: plan.limits.fiveHour, weekly: plan.limits.weekly },
        renewsAt: "Oct 12, 2026",
      },
    };
  }

  if (scenario === "payg" || scenario === "checkout") return base;

  return {
    ...base,
    subscription: {
      ...plan,
      status: scenario === "past_due" ? "past_due" : "active",
      used: scenario === "active" || scenario === "cancelled"
        ? 12_200_000
        : scenario === "low" ? 28_000_000 : plan.allowance,
      windowUsage: scenario === "low"
        ? { fiveHour: 4_600_000, weekly: 22_800_000 }
        : scenario === "exhausted"
          ? { fiveHour: plan.limits.fiveHour, weekly: plan.limits.weekly }
          : { fiveHour: 2_800_000, weekly: 12_200_000 },
      renewsAt: "Oct 12, 2026",
      cancelAtPeriodEnd: scenario === "cancelled",
    },
  };
}

export function getBillingTotals(billing) {
  const subscriptionRemaining = billing.subscription?.status === "active"
    ? Math.max(billing.subscription.allowance - billing.subscription.used, 0)
    : 0;
  const windowRemaining = getSubscriptionWindows(billing.subscription)
    .map((window) => Math.max(window.limit - window.used, 0));
  const subscriptionAvailable = windowRemaining.length
    ? Math.min(subscriptionRemaining, ...windowRemaining)
    : 0;
  const payg = Object.values(billing.balances).reduce((sum, value) => sum + value, 0);

  return {
    subscriptionRemaining,
    subscriptionAvailable,
    payg,
    usable: subscriptionAvailable + payg,
  };
}

export function getSubscriptionWindows(subscription) {
  if (!subscription || subscription.status !== "active") return [];
  return [
    {
      id: "fiveHour",
      label: "5-hour limit",
      used: subscription.windowUsage?.fiveHour || 0,
      limit: subscription.limits?.fiveHour || 0,
      reset: "2h 14m",
    },
    {
      id: "weekly",
      label: "Weekly limit",
      used: subscription.windowUsage?.weekly || 0,
      limit: subscription.limits?.weekly || 0,
      reset: "Sep 28",
    },
  ].map((window) => ({
    ...window,
    percent: window.limit
      ? Math.min(Math.round((window.used / window.limit) * 100), 100)
      : 0,
  }));
}

export const paymentMethods = [
  {
    id: "crypto",
    name: "Crypto",
    detail: "LI.FI on-chain",
    feeRate: 0.05,
    fixedFee: 0,
    networkFee: 0,
    settlement: "On-chain settlement",
  },
  {
    id: "card",
    name: "Card",
    detail: "Visa, Mastercard · provider checkout",
    feeRate: 0,
    fixedFee: 0,
    providerCalculatedFee: true,
    settlement: "Provider card checkout",
  },
];

export const preferredPaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expires: "08/29",
};

export const subscriptionInvoices = [
  {
    id: "INV-2026-0612",
    date: "Jun 12, 2026",
    plan: "Plus",
    amount: "$20.00",
    method: "Visa •••• 4242",
    status: "Paid",
  },
  {
    id: "INV-2026-0512",
    date: "May 12, 2026",
    plan: "Plus",
    amount: "$20.00",
    method: "Visa •••• 4242",
    status: "Paid",
  },
];

export const starterFundingTransactions = [
  {
    id: "fund-1048",
    date: "Jun 8, 2026, 10:42",
    method: "Crypto · LI.FI",
    paid: "$25.00",
    fees: "$1.25",
    credits: "23,750,000",
    status: "Completed",
    receipt: "RCPT-1048",
  },
];
