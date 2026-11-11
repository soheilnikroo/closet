import type { ClothingItem, StyleProfile, WeatherSnapshot } from "@closet/shared";

export type OutfitCandidate = {
  top: ClothingItem;
  bottom: ClothingItem;
  shoes: ClothingItem;
  outerwear?: ClothingItem;
  accessory?: ClothingItem;
  score: number;
  breakdown: Record<string, number>;
};

export type GeneratorInput = {
  items: ClothingItem[];
  styleProfile: StyleProfile;
  weather: WeatherSnapshot | null;
  occasionFormality: number;
  preferredStyles: ClothingItem["styleTags"][number][] | string[];
  excludeItemIds: Set<string>;
  requiredItemIds?: Set<string>;
  recentOutfitSignatures: Set<string>;
  dislikedItemIds: Set<string>;
};

export const SCORE_WEIGHTS = {
  style: 0.2,
  color: 0.2,
  occasion: 0.2,
  weather: 0.15,
  fit: 0.1,
  variety: 0.1,
  feedback: 0.05,
} as const;
