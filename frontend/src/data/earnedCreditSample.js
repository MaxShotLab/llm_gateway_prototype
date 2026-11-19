import { launchConfig } from "./launchConfig";

const day = 24 * 60 * 60 * 1000;
export const sampleStakedAit = 80;
export const sampleWeeklyEarnedCredits = (ait) => Math.floor(ait * launchConfig.aitUsdPerYear * 7 / 365 * launchConfig.creditsPerUsd);
const latestIssueDate = new Date(Date.now() - 2 * day);
latestIssueDate.setUTCHours(12, 0, 0, 0);
const latestIssue = latestIssueDate.getTime();

export const sampleEarnedGrants = Array.from({ length: 12 }, (_, week) => {
  const issuedAt = new Date(latestIssue - week * 7 * day);
  return { amount: sampleWeeklyEarnedCredits(sampleStakedAit), issuedAt, expiresAt: new Date(issuedAt.getTime() + 7 * day) };
});

export const sampleGrantDate = (date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
