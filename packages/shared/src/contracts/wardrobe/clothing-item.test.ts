import { describe, expect, it } from "vitest";

import {
  clothingItemSchema,
  createClothingItemRequestSchema,
  updateClothingItemRequestSchema,
} from "./clothing-item.js";

const validItem = {
  id: "00000000-0000-4000-8000-000000000001",
  wardrobeId: "00000000-0000-4000-8000-000000000002",
  categoryId: "00000000-0000-4000-8000-000000000003",
  categorySlug: "shirt",
  slot: "top",
  name: "White shirt",
  primaryColor: "white",
  colors: ["white"],
  pattern: "solid",
  styleTags: ["minimal"],
  seasons: ["all_season"],
  material: "cotton",
  formality: "smart_casual",
  fit: "regular",
  cut: null,
  length: null,
  warmthLevel: 2,
  size: null,
  brand: null,
  sourceType: "manual",
  status: "active",
  imageUrl: null,
  createdAt: "2026-11-01T10:00:00.000Z",
  updatedAt: "2026-11-01T10:00:00.000Z",
  lastWornAt: null,
};

describe("clothing contracts", () => {
  it("accepts a valid clothing item", () => {
    expect(clothingItemSchema.safeParse(validItem).success).toBe(true);
  });

  it("validates create/update payloads", () => {
    expect(
      createClothingItemRequestSchema.safeParse({
        categoryId: validItem.categoryId,
        name: "Shirt",
        primaryColor: "white",
      }).success,
    ).toBe(true);

    expect(
      updateClothingItemRequestSchema.safeParse({
        status: "archived",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid slots", () => {
    expect(clothingItemSchema.safeParse({ ...validItem, slot: "hat" }).success).toBe(false);
  });
});
