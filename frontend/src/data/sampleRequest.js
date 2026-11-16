import { providerSnapshot } from "./providerCatalog";
import { launchConfig, newRequestId } from "./launchConfig";

// Live Gateway Credit unit (TD-53). Rates and units below are still illustrative.
export const sampleCreditsPerUsd = launchConfig.creditsPerUsd;
export const sampleOfferingLabel = (offering) => `${providerSnapshot.providers.find((item) => item.providerId === offering.providerId).name} · ${offering.offeringId}`;

export const availableOfferings = (modelId) => providerSnapshot.offerings.filter((item) => item.modelId === modelId && item.admissionStatus === "passed" && item.availability === "available" && item.policyEligible === true);

// TD-48: no pin = Auto (first qualified offering, one same-model backup allowed);
// a pin uses only that offering, never falls back, and is rejected if ineligible.
function route(modelId, pinnedOfferingId) {
  const offerings = availableOfferings(modelId);
  if (pinnedOfferingId) {
    const pinned = offerings.find((item) => item.offeringId === pinnedOfferingId);
    return pinned ? { selected: pinned, backup: null, pinned: true } : null;
  }
  const [selected, backup] = offerings;
  return selected ? { selected, backup, pinned: false } : null;
}
const creditCharge = (offering, units) => Math.round(offering.customerRateCard.components.reduce((total, component) => {
  if (component.kind === "input_tokens") return total + Number(component.amount) * units.input / 1_000_000;
  if (component.kind === "output_tokens") return total + Number(component.amount) * units.output / 1_000_000;
  return total;
}, 0) * sampleCreditsPerUsd);
// Hypothetical split: 40% of the maximum from AIT Earned Credit, remainder from Premium.
const holdSplit = (maximum) => { const earned = Math.round(maximum * 0.4); return { earned, subscription: maximum - earned }; };

export function sampleChatQuote(modelId, pinnedOfferingId = "") {
  const routed = route(modelId, pinnedOfferingId);
  if (!routed) return null;
  const { selected, backup, pinned } = routed;
  const maximum = Math.max(...[selected, backup].filter(Boolean).map((item) => creditCharge(item, { input: 1000, output: 800 })));
  return {
    modelId, selected, backup, pinned, estimate: creditCharge(selected, { input: 1000, output: 600 }), maximum,
    reserved: holdSplit(maximum), units: { input: 1000, output: 700 },
  };
}

export function sampleChatSettlement(quote) {
  const serving = quote.backup || quote.selected;
  const charge = creditCharge(serving, quote.units);
  const used = { earned: Math.min(quote.reserved.earned, charge), subscription: charge - Math.min(quote.reserved.earned, charge) };
  return {
    ...quote, requestId: newRequestId(), serving, charge, used,
    released: { earned: quote.reserved.earned - used.earned, subscription: quote.reserved.subscription - used.subscription },
    fallback: Boolean(quote.backup),
    fallbackReason: quote.backup ? "Simulated pre-output connection failure" : null,
  };
}

export function sampleImageQuote(modelId, resolution, pinnedOfferingId = "") {
  const routed = route(modelId, pinnedOfferingId);
  if (!routed) return null;
  const { selected, backup, pinned } = routed;
  const condition = resolution === "2K" ? "2048 px" : "1024 px";
  const imageCost = (offering) => {
    const component = offering.customerRateCard.components.find((item) => item.kind === "output_image" && item.condition === condition) || offering.customerRateCard.components.find((item) => item.kind === "output_image" && !item.condition);
    const quantity = component?.unit === "per_megapixel" ? (resolution === "2K" ? 2048 ** 2 : 1024 ** 2) / 1_000_000 : 1;
    return Math.round(Number(component?.amount || 0) * quantity * sampleCreditsPerUsd);
  };
  const maximum = Math.max(...[selected, backup].filter(Boolean).map(imageCost));
  return { selected, backup, pinned, estimate: imageCost(selected), maximum, reserved: holdSplit(maximum) };
}

export function sampleVideoQuote(modelId, resolution, duration, pinnedOfferingId = "") {
  const routed = route(modelId, pinnedOfferingId);
  if (!routed) return null;
  const { selected, backup, pinned } = routed;
  const condition = resolution === "1080p" ? "1080p" : "720p";
  const videoCost = (offering) => Math.round(Number(offering.customerRateCard.components.find((item) => item.kind === "output_video" && item.condition === condition)?.amount || offering.customerRateCard.components.find((item) => item.kind === "output_video" && !item.condition)?.amount || 0) * duration * sampleCreditsPerUsd);
  const maximum = Math.max(...[selected, backup].filter(Boolean).map(videoCost));
  return { selected, backup, pinned, estimate: videoCost(selected), maximum, reserved: holdSplit(maximum) };
}
