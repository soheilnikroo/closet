import { describe, expect, it } from "vitest";

import type { ClothingCategoryRow, ClothingItemRow } from "@/infrastructure/database/index.js";
import { mapClothingItem } from "@/modules/wardrobe/clothing-mapper.js";

describe("mapClothingItem", () => {
  it("maps db rows into the shared clothing contract", () => {
    const now = new Date("2026-11-01T10:00:00.000Z");
    const item = {
      id: "00000000-0000-4000-8000-000000000001",
      wardrobeId: "00000000-0000-4000-8000-000000000002",
      categoryId: "00000000-0000-4000-8000-000000000003",
      name: "Shirt",
      primaryColor: "white",
      colors: ["white"],
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
      condition: null,
      sourceType: "manual",
      status: "active",
      createdAt: now,
      updatedAt: now,
      lastWornAt: null,
    } as ClothingItemRow;

    const category = {
      id: item.categoryId,
      parentId: null,
      name: "Shirt",
      nameFa: "پیراهن",
      slug: "shirt",
      slot: "top",
      isActive: true,
    } as ClothingCategoryRow;

    const mapped = mapClothingItem(item, category, "/v1/wardrobe/media/x/content");
    expect(mapped.slot).toBe("top");
    expect(mapped.imageUrl).toContain("/media/");
    expect(mapped.createdAt).toBe(now.toISOString());
  });
});
