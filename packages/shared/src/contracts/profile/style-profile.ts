import { z } from "zod";

import { fitPreferenceSchema, styleTagSchema } from "@/contracts/common/enums.js";

export const styleProfileSchema = z.object({
  userId: z.string().uuid(),
  preferredStyles: z.array(styleTagSchema),
  preferredFits: z.array(fitPreferenceSchema),
  dislikedFits: z.array(fitPreferenceSchema),
  preferredColors: z.array(z.string()),
  dislikedColors: z.array(z.string()),
  comfortPriority: z.boolean().nullable(),
  lifestylePreferences: z.array(z.string()),
  updatedAt: z.string().datetime(),
});

export const updateStyleProfileRequestSchema = z.object({
  preferredStyles: z.array(styleTagSchema).optional(),
  preferredFits: z.array(fitPreferenceSchema).optional(),
  dislikedFits: z.array(fitPreferenceSchema).optional(),
  preferredColors: z.array(z.string()).optional(),
  dislikedColors: z.array(z.string()).optional(),
  comfortPriority: z.boolean().nullable().optional(),
  lifestylePreferences: z.array(z.string()).optional(),
});

export const styleProfileResponseSchema = z.object({
  styleProfile: styleProfileSchema,
});

export type StyleProfile = z.infer<typeof styleProfileSchema>;
export type UpdateStyleProfileRequest = z.infer<typeof updateStyleProfileRequestSchema>;
export type StyleProfileResponse = z.infer<typeof styleProfileResponseSchema>;
