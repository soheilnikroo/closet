import { z } from "zod";

import {
  fitPreferenceSchema,
  formalitySchema,
  mediaProcessingStatusSchema,
  patternSchema,
  seasonSchema,
  styleTagSchema,
} from "@/contracts/common/enums.js";

export const detectedGarmentSchema = z.object({
  tempId: z.string().min(1),
  categorySlug: z.string().min(1),
  name: z.string().min(1),
  primaryColor: z.string().min(1),
  colors: z.array(z.string()),
  pattern: patternSchema.nullable(),
  styleTags: z.array(styleTagSchema),
  seasons: z.array(seasonSchema),
  material: z.string().nullable(),
  formality: formalitySchema.nullable(),
  fit: fitPreferenceSchema.nullable(),
  warmthLevel: z.number().int().min(1).max(5).nullable(),
  confidence: z.number().min(0).max(1),
});

export const mediaAssetSchema = z.object({
  id: z.string().uuid(),
  processingStatus: mediaProcessingStatusSchema,
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  contentUrl: z.string().nullable(),
  detections: z.array(detectedGarmentSchema),
  error: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const mediaAssetResponseSchema = z.object({
  media: mediaAssetSchema,
});

export const confirmMediaRequestSchema = z.object({
  garments: z.array(
    detectedGarmentSchema.extend({
      accepted: z.boolean(),
      categoryId: z.string().uuid().optional(),
    }),
  ),
});

export const confirmMediaResponseSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
    }),
  ),
});

export const sampleCatalogResponseSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
    }),
  ),
  count: z.number().int(),
});

export type DetectedGarment = z.infer<typeof detectedGarmentSchema>;
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type MediaAssetResponse = z.infer<typeof mediaAssetResponseSchema>;
export type ConfirmMediaRequest = z.infer<typeof confirmMediaRequestSchema>;
export type ConfirmMediaResponse = z.infer<typeof confirmMediaResponseSchema>;
export type SampleCatalogResponse = z.infer<typeof sampleCatalogResponseSchema>;
