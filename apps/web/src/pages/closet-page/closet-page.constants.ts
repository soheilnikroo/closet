import type { ClosetSlot } from "@/pages/closet-page/closet-page.types.js";

export const CLOSET_SLOTS: readonly ClosetSlot[] = [
  "top",
  "bottom",
  "shoes",
  "outerwear",
  "accessory",
];

export const MANUAL_SEASONS = ["all_season", "spring", "summer", "autumn", "winter"] as const;

export const MANUAL_COLORS = [
  "white",
  "black",
  "blue",
  "navy",
  "red",
  "green",
  "beige",
  "brown",
  "grey",
  "pink",
  "yellow",
  "orange",
  "cream",
  "olive",
] as const;
