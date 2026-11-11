import { z } from "zod";

export const preferencesSchema = z.object({
  locale: z.enum(["en-GB", "fa-IR"]).default("en-GB"),
  notifications: z.boolean().default(false),
  savedDiscoverIds: z.array(z.string().max(80)).max(100).default([]),
  silhouette: z.enum(["straight", "relaxed"]).default("straight"),
  heightBand: z.enum(["unspecified", "petite", "average", "tall"]).default("unspecified"),
});
export const updatePreferencesSchema = z.object({
  locale: preferencesSchema.shape.locale.removeDefault().optional(),
  notifications: preferencesSchema.shape.notifications.removeDefault().optional(),
  savedDiscoverIds: preferencesSchema.shape.savedDiscoverIds.removeDefault().optional(),
  silhouette: preferencesSchema.shape.silhouette.removeDefault().optional(),
  heightBand: preferencesSchema.shape.heightBand.removeDefault().optional(),
});
export const preferencesResponseSchema = z.object({ preferences: preferencesSchema });
export const tryOnRequestSchema = z.object({
  outfitId: z.string().uuid(),
  silhouette: z.enum(["straight", "relaxed"]).default("straight"),
});
export const tryOnResultSchema = z.object({
  imageUrl: z.string(),
  provider: z.literal("mock"),
  outfitId: z.string().uuid(),
});
export const demoSeedResponseSchema = z.object({ count: z.number().int().nonnegative() });
export type Preferences = z.infer<typeof preferencesSchema>;
export type TryOnRequest = z.input<typeof tryOnRequestSchema>;
export type TryOnResult = z.infer<typeof tryOnResultSchema>;
