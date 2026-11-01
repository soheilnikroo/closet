import { z } from "zod";

import {
  clothingStatusSchema,
  fitPreferenceSchema,
  formalitySchema,
  patternSchema,
  seasonSchema,
  styleTagSchema,
} from "@/contracts/common/enums.js";

export const clothingCategorySchema = z.object({
  id: z.string().uuid(),
  parentId: z.string().uuid().nullable(),
  name: z.string().min(1),
  nameFa: z.string().min(1),
  slug: z.string().min(1),
  slot: z.enum(["top", "bottom", "shoes", "outerwear", "accessory"]),
});

export const clothingItemSchema = z.object({
  id: z.string().uuid(),
  wardrobeId: z.string().uuid(),
  categoryId: z.string().uuid(),
  categorySlug: z.string().min(1),
  slot: z.enum(["top", "bottom", "shoes", "outerwear", "accessory"]),
  name: z.string().min(1),
  primaryColor: z.string().min(1),
  colors: z.array(z.string()),
  pattern: patternSchema.nullable(),
  styleTags: z.array(styleTagSchema),
  seasons: z.array(seasonSchema),
  material: z.string().nullable(),
  formality: formalitySchema.nullable(),
  fit: fitPreferenceSchema.nullable(),
  cut: z.string().nullable(),
  length: z.string().nullable(),
  warmthLevel: z.number().int().min(1).max(5).nullable(),
  size: z.string().nullable(),
  brand: z.string().nullable(),
  sourceType: z.enum(["photo", "manual", "sample_catalog", "import"]),
  status: clothingStatusSchema,
  imageUrl: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastWornAt: z.string().datetime().nullable(),
});

export const createClothingItemRequestSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(160),
  primaryColor: z.string().min(1),
  colors: z.array(z.string()).optional(),
  pattern: patternSchema.nullable().optional(),
  styleTags: z.array(styleTagSchema).optional(),
  seasons: z.array(seasonSchema).optional(),
  material: z.string().nullable().optional(),
  formality: formalitySchema.nullable().optional(),
  fit: fitPreferenceSchema.nullable().optional(),
  warmthLevel: z.number().int().min(1).max(5).nullable().optional(),
  brand: z.string().nullable().optional(),
});

export const updateClothingItemRequestSchema = createClothingItemRequestSchema.partial().extend({
  status: clothingStatusSchema.optional(),
});

export const clothingItemsResponseSchema = z.object({
  items: z.array(clothingItemSchema),
});

export const clothingItemResponseSchema = z.object({
  item: clothingItemSchema,
});

export const clothingCategoriesResponseSchema = z.object({
  categories: z.array(clothingCategorySchema),
});

export type ClothingCategory = z.infer<typeof clothingCategorySchema>;
export type ClothingItem = z.infer<typeof clothingItemSchema>;
export type CreateClothingItemRequest = z.infer<typeof createClothingItemRequestSchema>;
export type UpdateClothingItemRequest = z.infer<typeof updateClothingItemRequestSchema>;
export type ClothingItemsResponse = z.infer<typeof clothingItemsResponseSchema>;
export type ClothingItemResponse = z.infer<typeof clothingItemResponseSchema>;
export type ClothingCategoriesResponse = z.infer<typeof clothingCategoriesResponseSchema>;
