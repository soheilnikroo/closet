import { clothingItemSchema, type ClothingItem } from "@closet/shared";

import type { ClothingCategoryRow, ClothingItemRow } from "@/infrastructure/database/index.js";

export function mapClothingItem(
  item: ClothingItemRow,
  category: ClothingCategoryRow,
  imageUrl: string | null,
): ClothingItem {
  return clothingItemSchema.parse({
    id: item.id,
    wardrobeId: item.wardrobeId,
    categoryId: item.categoryId,
    categorySlug: category.slug,
    slot: category.slot,
    name: item.name,
    primaryColor: item.primaryColor,
    colors: item.colors,
    pattern: item.pattern,
    styleTags: item.styleTags,
    seasons: item.seasons,
    material: item.material,
    formality: item.formality,
    fit: item.fit,
    cut: item.cut,
    length: item.length,
    warmthLevel: item.warmthLevel,
    size: item.size,
    brand: item.brand,
    sourceType: item.sourceType,
    status: item.status,
    imageUrl,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    lastWornAt: item.lastWornAt?.toISOString() ?? null,
  });
}
