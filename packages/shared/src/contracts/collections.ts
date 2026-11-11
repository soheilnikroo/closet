import { z } from "zod";

import { recommendationSchema } from "@/contracts/styling/outfit.js";

export const collectionInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).default(""),
  occasion: z.string().trim().max(80).default(""),
  season: z.enum(["any", "spring", "summer", "autumn", "winter"]).default("any"),
  color: z.enum(["forest", "sage", "sand", "sky", "rose"]).default("forest"),
});
export const saveCollectionOutfitSchema = z.object({
  recommendationId: z.string().uuid(),
  action: z.enum(["like", "save"]).default("save"),
});
export const createCollectionSchema = collectionInputSchema.extend({
  recommendationId: z.string().uuid().optional(),
  action: z.enum(["like", "save"]).default("save"),
});
export const collectionSchema = collectionInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  count: z.number().int().nonnegative(),
});
export const collectionsResponseSchema = z.object({ collections: z.array(collectionSchema) });
export const collectionResponseSchema = z.object({ collection: collectionSchema });
export const collectionDetailSchema = collectionResponseSchema.extend({
  outfits: z.array(recommendationSchema),
});
export type OutfitCollection = z.infer<typeof collectionSchema>;
export type CollectionInput = z.input<typeof collectionInputSchema>;
export type CreateCollection = z.input<typeof createCollectionSchema>;
export type SaveCollectionOutfit = z.input<typeof saveCollectionOutfitSchema>;
export type CollectionDetail = z.infer<typeof collectionDetailSchema>;
