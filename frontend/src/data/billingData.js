export const subscriptionPlans = [
  {
    id: "core",
    name: "Core",
    priceCents: 1_200,
    basicAllowance: 8_000_000,
    premiumAllowance: 7_000_000,
    policyVersion: "2026-09-v1",
    limits: { fiveHour: 3_000_000, weekly: 12_000_000 },
  },
  {
    id: "plus",
    name: "Plus",
    priceCents: 2_000,
    basicAllowance: 10_000_000,
    premiumAllowance: 20_000_000,
    policyVersion: "2026-09-v1",
    limits: { fiveHour: 5_000_000, weekly: 25_000_000 },
  },
];

export const billingScenarioOptions = [
  { id: "payg", label: "PAYG only" },
  { id: "checkout", label: "Plan selection" },
  { id: "active", label: "Active subscription" },
  { id: "low", label: "Allowance low" },
  { id: "basic_exhausted", label: "Basic Chat exhausted" },
  { id: "premium_exhausted", label: "Premium exhausted" },
  { id: "exhausted", label: "Allowance exhausted" },
  { id: "insufficient", label: "No usable funding" },
  { id: "cancelled", label: "Cancelled at period end" },
  { id: "past_due", label: "Failed renewal + PAYG" },
];

const defaultBalances = {
  free: 6_800_000,
  referral: 500_000,
  dollarCents: 4_820,
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
      balances: { free: 0, referral: 0, dollarCents: 0 },
      subscription: {
        ...plan,
        status: "active",
        basicUsed: plan.basicAllowance,
        premiumUsed: plan.premiumAllowance,
        premiumReserved: 0,
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
      status: scenario === "past_due"
        ? "past_due"
        : scenario === "cancelled" ? "cancel_at_period_end" : "active",
      basicUsed: scenario === "active" || scenario === "cancelled" || scenario === "premium_exhausted"
        ? 2_200_000
        : scenario === "low" ? 9_200_000 : plan.basicAllowance,
      premiumUsed: scenario === "active" || scenario === "cancelled" || scenario === "basic_exhausted"
        ? 10_000_000
        : scenario === "low" ? 18_400_000 : plan.premiumAllowance,
      premiumReserved: ["active", "cancelled", "basic_exhausted", "low"].includes(scenario) ? 800_000 : 0,
      windowUsage: scenario === "low"
        ? { fiveHour: 4_600_000, weekly: 22_800_000 }
        : scenario === "exhausted"
          ? { fiveHour: plan.limits.fiveHour, weekly: plan.limits.weekly }
          : { fiveHour: 2_800_000, weekly: 12_200_000 },
      renewsAt: "Oct 12, 2026",
    },
  };
}

export function getBillingTotals(billing) {
  const active = ["active", "cancel_at_period_end"].includes(billing.subscription?.status);
  const basicRemaining = active
    ? Math.max(billing.subscription.basicAllowance - billing.subscription.basicUsed, 0)
    : 0;
  const premiumRemaining = active
    ? Math.max(billing.subscription.premiumAllowance - billing.subscription.premiumUsed - (billing.subscription.premiumReserved || 0), 0)
    : 0;
  const basicPercent = active
    ? Math.min(Math.floor((billing.subscription.basicUsed / billing.subscription.basicAllowance) * 100), 100)
    : 0;
  const premiumPercent = active
    ? Math.min(Math.floor(((billing.subscription.premiumUsed + (billing.subscription.premiumReserved || 0)) / billing.subscription.premiumAllowance) * 100), 100)
    : 0;
  const windowRemaining = getSubscriptionWindows(billing.subscription)
    .map((window) => Math.max(window.limit - window.used, 0));
  const textWindowRemaining = windowRemaining.length ? Math.min(...windowRemaining) : 0;
  const promotionalCredits = billing.balances.free + billing.balances.referral;
  const dollarBalanceCents = billing.balances.dollarCents;

  return {
    basicRemaining,
    premiumRemaining,
    basicPercent,
    premiumPercent,
    textWindowRemaining,
    promotionalCredits,
    dollarBalanceCents,
  };
}

export function getSubscriptionWindows(subscription) {
  if (!subscription || !["active", "cancel_at_period_end"].includes(subscription.status)) return [];
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
    fixedFeeCents: 0,
    networkFeeCents: 0,
    settlement: "On-chain settlement",
  },
  {
    id: "card",
    name: "Card",
    detail: "Visa, Mastercard · provider checkout",
    feeRate: 0,
    fixedFeeCents: 0,
    providerCalculatedFee: true,
    settlement: "Provider card checkout",
  },
];

export const preferredPaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expires: "08/29",
};

export const starterSubscriptionInvoices = [
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
    balanceAdded: "$23.75",
    status: "Completed",
    receipt: "RCPT-1048",
  },
];
