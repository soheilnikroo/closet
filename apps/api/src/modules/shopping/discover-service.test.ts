import { describe, expect, it, vi } from "vitest";

import { createDiscoverService } from "@/modules/shopping/discover-service.js";
import type { WardrobeService } from "@/modules/wardrobe/wardrobe-service.js";

function clothing(partial: {
  id: string;
  slot: "top" | "bottom" | "shoes" | "outerwear" | "accessory";
  categorySlug: string;
  name: string;
}) {
  return {
    id: partial.id,
    wardrobeId: "w",
    categoryId: "c",
    categorySlug: partial.categorySlug,
    slot: partial.slot,
    name: partial.name,
    primaryColor: "black",
    colors: ["black"],
    pattern: "solid" as const,
    styleTags: ["casual" as const],
    seasons: ["all_season" as const],
    material: null,
    formality: "casual" as const,
    fit: "regular" as const,
    cut: null,
    length: null,
    warmthLevel: 2,
    size: null,
    brand: null,
    sourceType: "manual" as const,
    status: "active" as const,
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastWornAt: null,
  };
}

describe("createDiscoverService", () => {
  it("suggests basics when wardrobe is small", async () => {
    const wardrobeService = {
      listItems: vi.fn().mockResolvedValue([
        clothing({
          id: "1",
          slot: "top",
          categorySlug: "t-shirt",
          name: "Tee",
        }),
      ]),
    } as unknown as WardrobeService;

    const service = createDiscoverService(wardrobeService);
    const result = await service.getGaps("user");

    expect(result.itemCount).toBe(1);
    expect(result.gaps[0]?.categorySlug).toBe("basics");
  });

  it("suggests outerwear when missing", async () => {
    const wardrobeService = {
      listItems: vi
        .fn()
        .mockResolvedValue([
          clothing({ id: "1", slot: "top", categorySlug: "shirt", name: "Shirt" }),
          clothing({ id: "2", slot: "bottom", categorySlug: "trousers", name: "Trousers" }),
          clothing({ id: "3", slot: "shoes", categorySlug: "sneakers", name: "Sneakers" }),
          clothing({ id: "4", slot: "top", categorySlug: "t-shirt", name: "Tee" }),
          clothing({ id: "5", slot: "bottom", categorySlug: "jeans", name: "Jeans" }),
        ]),
    } as unknown as WardrobeService;

    const result = await createDiscoverService(wardrobeService).getGaps("user");
    expect(result.gaps.some((gap) => gap.categorySlug === "jacket")).toBe(true);
  });
});
