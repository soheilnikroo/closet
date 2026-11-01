import type { ClothingItem, StyleProfile } from "@closet/shared";
import { describe, expect, it } from "vitest";

import { generateOutfitCandidates } from "./generate.js";
import { outfitSignature } from "./score.js";

function item(
  partial: Pick<ClothingItem, "id" | "slot" | "name" | "primaryColor"> & Partial<ClothingItem>,
): ClothingItem {
  return {
    wardrobeId: "00000000-0000-4000-8000-000000000099",
    categoryId: "00000000-0000-4000-8000-000000000098",
    categorySlug: partial.slot,
    colors: [partial.primaryColor],
    pattern: "solid",
    styleTags: ["casual"],
    seasons: ["all_season"],
    material: "cotton",
    formality: "casual",
    fit: "regular",
    cut: null,
    length: null,
    warmthLevel: 2,
    size: null,
    brand: null,
    sourceType: "manual",
    status: "active",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastWornAt: null,
    ...partial,
  };
}

const styleProfile: StyleProfile = {
  userId: "00000000-0000-4000-8000-000000000001",
  preferredStyles: ["casual"],
  preferredFits: ["regular"],
  dislikedFits: [],
  preferredColors: [],
  dislikedColors: ["neon"],
  comfortPriority: true,
  lifestylePreferences: [],
  updatedAt: new Date().toISOString(),
};

describe("generateOutfitCandidates", () => {
  it("only uses owned wardrobe items", () => {
    const items = [
      item({
        id: "00000000-0000-4000-8000-000000000011",
        slot: "top",
        name: "Tee",
        primaryColor: "white",
      }),
      item({
        id: "00000000-0000-4000-8000-000000000012",
        slot: "bottom",
        name: "Jeans",
        primaryColor: "blue",
      }),
      item({
        id: "00000000-0000-4000-8000-000000000013",
        slot: "shoes",
        name: "Sneakers",
        primaryColor: "white",
      }),
    ];

    const result = generateOutfitCandidates({
      items,
      styleProfile,
      weather: null,
      occasionFormality: 2,
      preferredStyles: ["casual"],
      excludeItemIds: new Set(),
      recentOutfitSignatures: new Set(),
      dislikedItemIds: new Set(),
    });

    expect(result.length).toBeGreaterThan(0);
    for (const candidate of result) {
      expect(items.map((i) => i.id)).toContain(candidate.top.id);
      expect(items.map((i) => i.id)).toContain(candidate.bottom.id);
      expect(items.map((i) => i.id)).toContain(candidate.shoes.id);
    }
  });

  it("respects excluded items", () => {
    const excludedId = "00000000-0000-4000-8000-000000000011";
    const items = [
      item({ id: excludedId, slot: "top", name: "Tee", primaryColor: "white" }),
      item({
        id: "00000000-0000-4000-8000-000000000014",
        slot: "top",
        name: "Shirt",
        primaryColor: "black",
      }),
      item({
        id: "00000000-0000-4000-8000-000000000012",
        slot: "bottom",
        name: "Jeans",
        primaryColor: "blue",
      }),
      item({
        id: "00000000-0000-4000-8000-000000000013",
        slot: "shoes",
        name: "Sneakers",
        primaryColor: "white",
      }),
    ];

    const result = generateOutfitCandidates({
      items,
      styleProfile,
      weather: null,
      occasionFormality: 2,
      preferredStyles: [],
      excludeItemIds: new Set([excludedId]),
      recentOutfitSignatures: new Set(),
      dislikedItemIds: new Set(),
    });

    expect(result.every((c) => c.top.id !== excludedId)).toBe(true);
  });

  it("returns empty when wardrobe is incomplete", () => {
    const result = generateOutfitCandidates({
      items: [
        item({
          id: "00000000-0000-4000-8000-000000000011",
          slot: "top",
          name: "Tee",
          primaryColor: "white",
        }),
      ],
      styleProfile,
      weather: null,
      occasionFormality: 2,
      preferredStyles: [],
      excludeItemIds: new Set(),
      recentOutfitSignatures: new Set(),
      dislikedItemIds: new Set(),
    });

    expect(result).toEqual([]);
  });
});

describe("outfitSignature", () => {
  it("is order-independent", () => {
    expect(outfitSignature(["a", "b"])).toBe(outfitSignature(["b", "a"]));
  });
});
