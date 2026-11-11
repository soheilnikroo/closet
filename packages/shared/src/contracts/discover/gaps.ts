import { z } from "zod";

export const wardrobeGapSchema = z.object({
  categorySlug: z.string().min(1),
  categoryName: z.string().min(1),
  categoryNameFa: z.string().min(1),
  reason: z.string().min(1),
  reasonFa: z.string().min(1),
  priority: z.number().int().min(1).max(5),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameFa: z.string(),
  categorySlug: z.string(),
  color: z.string(),
  imageUrl: z.string(),
  styleTags: z.array(z.string()),
});
export type Product = z.infer<typeof productSchema>;

export const discoverGapsResponseSchema = z.object({
  gaps: z.array(wardrobeGapSchema),
  products: z.array(productSchema).optional(),
  itemCount: z.number().int().nonnegative(),
});

export type WardrobeGap = z.infer<typeof wardrobeGapSchema>;
export type DiscoverGapsResponse = z.infer<typeof discoverGapsResponseSchema>;
