import type { ClothingItem, StyleProfile, WeatherSnapshot } from "@closet/shared";

import { SCORE_WEIGHTS, type OutfitCandidate } from "./types.js";

const NEUTRALS = new Set([
  "black",
  "white",
  "grey",
  "gray",
  "beige",
  "navy",
  "cream",
  "charcoal",
  "brown",
]);

function formalityScore(items: ClothingItem[], occasionFormality: number): number {
  const values = items
    .map((item) => {
      switch (item.formality) {
        case "casual":
          return 1;
        case "smart_casual":
          return 3;
        case "business":
          return 4;
        case "formal":
          return 5;
        default:
          return 2;
      }
    })
    .filter((v) => v > 0);

  if (values.length === 0) {
    return 0.6;
  }
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const distance = Math.abs(avg - occasionFormality);
  return Math.max(0, 1 - distance / 4);
}

function styleScore(items: ClothingItem[], preferredStyles: string[]): number {
  if (preferredStyles.length === 0) {
    return 0.7;
  }
  const tags = new Set<string>(items.flatMap((item) => item.styleTags));
  const hits = preferredStyles.filter((style) => tags.has(style));
  return hits.length > 0 ? Math.min(1, 0.5 + hits.length * 0.25) : 0.35;
}

function colorScore(items: ClothingItem[], styleProfile: StyleProfile): number {
  const colors = items
    .flatMap((item) => [item.primaryColor, ...item.colors])
    .map((c) => c.toLowerCase());
  if (styleProfile.dislikedColors.some((c) => colors.includes(c.toLowerCase()))) {
    return 0.1;
  }

  const preferredHits = styleProfile.preferredColors.filter((c) =>
    colors.includes(c.toLowerCase()),
  ).length;

  const unique = new Set(colors);
  const nonNeutral = [...unique].filter((c) => !NEUTRALS.has(c));
  const harmony = nonNeutral.length <= 2 ? 0.85 : 0.55;
  const preferenceBoost = preferredHits > 0 ? 0.15 : 0;
  return Math.min(1, harmony + preferenceBoost);
}

function weatherScore(items: ClothingItem[], weather: WeatherSnapshot | null): number {
  if (!weather) {
    return 0.7;
  }
  const temp = weather.feelsLike;
  const warmth =
    items.reduce((sum, item) => sum + (item.warmthLevel ?? 2), 0) / Math.max(items.length, 1);
  const hasOuterwear = items.some((item) => item.slot === "outerwear");
  const raining = weather.precipitationProbability >= 50;

  if (temp <= 10) {
    return warmth >= 3 || hasOuterwear ? 0.95 : 0.35;
  }
  if (temp >= 28) {
    return warmth <= 2 && !hasOuterwear ? 0.95 : 0.4;
  }
  if (raining && !hasOuterwear) {
    return 0.55;
  }
  return 0.8;
}

function fitScore(items: ClothingItem[], styleProfile: StyleProfile): number {
  if (styleProfile.preferredFits.length === 0 && styleProfile.dislikedFits.length === 0) {
    return 0.7;
  }

  let score = 0.7;
  for (const item of items) {
    if (!item.fit) {
      continue;
    }
    if (styleProfile.dislikedFits.includes(item.fit)) {
      score -= 0.25;
    }
    if (styleProfile.preferredFits.includes(item.fit)) {
      score += 0.15;
    }
  }
  return Math.max(0, Math.min(1, score));
}

export function scoreOutfit(input: {
  top: ClothingItem;
  bottom: ClothingItem;
  shoes: ClothingItem;
  outerwear?: ClothingItem;
  accessory?: ClothingItem;
  styleProfile: StyleProfile;
  weather: WeatherSnapshot | null;
  occasionFormality: number;
  preferredStyles: string[];
  signature: string;
  recentOutfitSignatures: Set<string>;
  dislikedItemIds: Set<string>;
}): OutfitCandidate {
  const items = [input.top, input.bottom, input.shoes, input.outerwear, input.accessory].filter(
    (item): item is ClothingItem => Boolean(item),
  );

  const breakdown = {
    style: styleScore(items, input.preferredStyles),
    color: colorScore(items, input.styleProfile),
    occasion: formalityScore(items, input.occasionFormality),
    weather: weatherScore(items, input.weather),
    fit: fitScore(items, input.styleProfile),
    variety: input.recentOutfitSignatures.has(input.signature) ? 0.2 : 0.9,
    feedback: items.some((item) => input.dislikedItemIds.has(item.id)) ? 0.15 : 0.85,
  };

  const score =
    breakdown.style * SCORE_WEIGHTS.style +
    breakdown.color * SCORE_WEIGHTS.color +
    breakdown.occasion * SCORE_WEIGHTS.occasion +
    breakdown.weather * SCORE_WEIGHTS.weather +
    breakdown.fit * SCORE_WEIGHTS.fit +
    breakdown.variety * SCORE_WEIGHTS.variety +
    breakdown.feedback * SCORE_WEIGHTS.feedback;

  return {
    top: input.top,
    bottom: input.bottom,
    shoes: input.shoes,
    outerwear: input.outerwear,
    accessory: input.accessory,
    score,
    breakdown,
  };
}

export function outfitSignature(itemIds: string[]): string {
  const copy = [...itemIds];
  copy.sort((a, b) => a.localeCompare(b));
  return copy.join("|");
}
