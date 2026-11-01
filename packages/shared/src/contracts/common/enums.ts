import { z } from "zod";

export const styleTagSchema = z.enum([
  "casual",
  "minimal",
  "classic",
  "smart_casual",
  "streetwear",
  "sporty",
  "formal",
]);

export const fitPreferenceSchema = z.enum(["fitted", "regular", "oversized"]);

export const seasonSchema = z.enum(["spring", "summer", "autumn", "winter", "all_season"]);

export const patternSchema = z.enum(["solid", "striped", "checked", "floral", "graphic", "other"]);

export const formalitySchema = z.enum(["casual", "smart_casual", "business", "formal"]);

export const clothingStatusSchema = z.enum(["active", "archived", "deleted"]);

export const mediaProcessingStatusSchema = z.enum(["pending", "processing", "ready", "failed"]);

export const preferenceSourceSchema = z.enum(["user", "ai", "interaction"]);

export const outfitItemRoleSchema = z.enum(["top", "bottom", "shoes", "outerwear", "accessory"]);

export const feedbackActionSchema = z.enum(["like", "dislike", "save", "worn", "regenerate"]);

export const recommendationTypeSchema = z.enum([
  "daily",
  "occasion",
  "chat",
  "alternative",
  "first_outfit",
]);

export const aiJobTypeSchema = z.enum(["clothing_vision", "product_extract", "stylist_chat"]);

export const aiJobStatusSchema = z.enum(["queued", "running", "succeeded", "failed"]);

export type StyleTag = z.infer<typeof styleTagSchema>;
export type FitPreference = z.infer<typeof fitPreferenceSchema>;
export type Season = z.infer<typeof seasonSchema>;
export type Pattern = z.infer<typeof patternSchema>;
export type Formality = z.infer<typeof formalitySchema>;
export type ClothingStatus = z.infer<typeof clothingStatusSchema>;
export type MediaProcessingStatus = z.infer<typeof mediaProcessingStatusSchema>;
export type PreferenceSource = z.infer<typeof preferenceSourceSchema>;
export type OutfitItemRole = z.infer<typeof outfitItemRoleSchema>;
export type FeedbackAction = z.infer<typeof feedbackActionSchema>;
export type RecommendationType = z.infer<typeof recommendationTypeSchema>;
export type AiJobType = z.infer<typeof aiJobTypeSchema>;
export type AiJobStatus = z.infer<typeof aiJobStatusSchema>;
