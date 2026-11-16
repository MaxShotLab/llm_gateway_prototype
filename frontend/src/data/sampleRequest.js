import { providerSnapshot } from "./providerCatalog";

// Illustrative prototype conversion, not a funded-program term or live rate.
export const sampleCreditsPerUsd = 100_000;
export const sampleOfferingLabel = (offering) => `${providerSnapshot.providers.find((item) => item.providerId === offering.providerId).name} · ${offering.offeringId}`;

const availableOfferings = (modelId) => providerSnapshot.offerings.filter((item) => item.modelId === modelId && item.admissionStatus === "passed" && item.availability === "available" && item.policyEligible === true);
const creditCharge = (offering, units) => Math.round(offering.customerRateCard.components.reduce((total, component) => {
  if (component.kind === "input_tokens") return total + Number(component.amount) * units.input / 1_000_000;
  if (component.kind === "output_tokens") return total + Number(component.amount) * units.output / 1_000_000;
  return total;
}, 0) * sampleCreditsPerUsd);
const holdSplit = (maximum) => ({ earned: Math.min(500, maximum), subscription: Math.max(maximum - 500, 0) });

export function sampleChatQuote(modelId) {
  const [selected, backup] = availableOfferings(modelId);
  if (!selected) return null;
  const maximum = Math.max(...[selected, backup].filter(Boolean).map((item) => creditCharge(item, { input: 1000, output: 800 })));
  return {
    modelId, selected, backup, estimate: creditCharge(selected, { input: 1000, output: 600 }), maximum,
    reserved: holdSplit(maximum), units: { input: 1000, output: 700 },
  };
}

export function sampleChatSettlement(quote) {
  const serving = quote.backup || quote.selected;
  const charge = creditCharge(serving, quote.units);
  const used = { earned: Math.min(quote.reserved.earned, charge), subscription: charge - Math.min(quote.reserved.earned, charge) };
  return {
    ...quote, serving, charge, used,
    released: { earned: quote.reserved.earned - used.earned, subscription: quote.reserved.subscription - used.subscription },
    fallback: Boolean(quote.backup),
    fallbackReason: quote.backup ? "Simulated pre-output connection failure" : null,
  };
}

export function sampleImageQuote(modelId, resolution) {
  const [selected, backup] = availableOfferings(modelId);
  if (!selected) return null;
  const condition = resolution === "2K" ? "2048 px" : "1024 px";
  const imageCost = (offering) => {
    const component = offering.customerRateCard.components.find((item) => item.kind === "output_image" && item.condition === condition) || offering.customerRateCard.components.find((item) => item.kind === "output_image" && !item.condition);
    const quantity = component?.unit === "per_megapixel" ? (resolution === "2K" ? 2048 ** 2 : 1024 ** 2) / 1_000_000 : 1;
    return Math.round(Number(component?.amount || 0) * quantity * sampleCreditsPerUsd);
  };
  const maximum = Math.max(...[selected, backup].filter(Boolean).map(imageCost));
  return { selected, backup, estimate: imageCost(selected), maximum, reserved: holdSplit(maximum) };
}

export function sampleVideoQuote(modelId, resolution, duration) {
  const [selected, backup] = availableOfferings(modelId);
  if (!selected) return null;
  const condition = resolution === "1080p" ? "1080p" : "720p";
  const videoCost = (offering) => Math.round(Number(offering.customerRateCard.components.find((item) => item.kind === "output_video" && item.condition === condition)?.amount || offering.customerRateCard.components.find((item) => item.kind === "output_video" && !item.condition)?.amount || 0) * duration * sampleCreditsPerUsd);
  const maximum = Math.max(...[selected, backup].filter(Boolean).map(videoCost));
  return { selected, backup, estimate: videoCost(selected), maximum, reserved: holdSplit(maximum) };
}
