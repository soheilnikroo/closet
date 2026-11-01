import { z } from "zod";

export const wardrobeGapSchema = z.object({
  categorySlug: z.string().min(1),
  categoryName: z.string().min(1),
  categoryNameFa: z.string().min(1),
  reason: z.string().min(1),
  reasonFa: z.string().min(1),
  priority: z.number().int().min(1).max(5),
});

export const discoverGapsResponseSchema = z.object({
  gaps: z.array(wardrobeGapSchema),
  itemCount: z.number().int().nonnegative(),
});

export type WardrobeGap = z.infer<typeof wardrobeGapSchema>;
export type DiscoverGapsResponse = z.infer<typeof discoverGapsResponseSchema>;
