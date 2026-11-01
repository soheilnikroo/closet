import { z } from "zod";

import {
  feedbackActionSchema,
  outfitItemRoleSchema,
  recommendationTypeSchema,
  styleTagSchema,
} from "@/contracts/common/enums.js";
import { clothingItemSchema } from "@/contracts/wardrobe/clothing-item.js";
import { weatherSnapshotSchema } from "@/contracts/weather/weather-snapshot.js";

export const outfitItemSchema = z.object({
  clothingItemId: z.string().uuid(),
  role: outfitItemRoleSchema,
  position: z.number().int().nonnegative(),
  item: clothingItemSchema.optional(),
});

export const outfitSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  style: styleTagSchema.nullable(),
  items: z.array(outfitItemSchema),
  createdAt: z.string().datetime(),
});

export const recommendationSchema = z.object({
  id: z.string().uuid(),
  outfit: outfitSchema,
  recommendationType: recommendationTypeSchema,
  occasionId: z.string().uuid().nullable(),
  occasionName: z.string().nullable(),
  score: z.number(),
  explanation: z.string().min(1),
  weather: weatherSnapshotSchema.nullable().optional(),
  generatedAt: z.string().datetime(),
});

export const todayResponseSchema = z.object({
  primary: recommendationSchema.nullable(),
  alternatives: z.array(recommendationSchema),
  weather: weatherSnapshotSchema.nullable(),
  wardrobeItemCount: z.number().int().nonnegative(),
  message: z.string().nullable(),
});

export const createRecommendationRequestSchema = z.object({
  occasionId: z.string().uuid().optional(),
  occasionSlug: z.string().optional(),
  excludeItemIds: z.array(z.string().uuid()).optional(),
  requiredItemIds: z.array(z.string().uuid()).optional(),
  notes: z.string().max(500).optional(),
  regenerate: z.boolean().optional(),
});

export const recommendationsResponseSchema = z.object({
  primary: recommendationSchema,
  alternatives: z.array(recommendationSchema),
});

export const feedbackRequestSchema = z.object({
  action: feedbackActionSchema,
  reason: z.string().max(500).nullable().optional(),
});

export const feedbackResponseSchema = z.object({
  ok: z.literal(true),
});

export const replaceItemRequestSchema = z.object({
  clothingItemId: z.string().uuid(),
  role: outfitItemRoleSchema,
});

export const replaceItemResponseSchema = z.object({
  recommendation: recommendationSchema,
});

export const occasionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  nameFa: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  formalityLevel: z.number().int().min(1).max(5),
  description: z.string().nullable(),
});

export const occasionsResponseSchema = z.object({
  occasions: z.array(occasionSchema),
});

export type OutfitItem = z.infer<typeof outfitItemSchema>;
export type Outfit = z.infer<typeof outfitSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type TodayResponse = z.infer<typeof todayResponseSchema>;
export type CreateRecommendationRequest = z.infer<typeof createRecommendationRequestSchema>;
export type RecommendationsResponse = z.infer<typeof recommendationsResponseSchema>;
export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>;
export type FeedbackResponse = z.infer<typeof feedbackResponseSchema>;
export type ReplaceItemRequest = z.infer<typeof replaceItemRequestSchema>;
export type ReplaceItemResponse = z.infer<typeof replaceItemResponseSchema>;
export type Occasion = z.infer<typeof occasionSchema>;
export type OccasionsResponse = z.infer<typeof occasionsResponseSchema>;
