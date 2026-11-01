import { z } from "zod";

export const userProfileSchema = z.object({
  userId: z.string().uuid(),
  cityId: z.string().uuid().nullable(),
  currency: z.string().min(1),
  temperaturePreference: z.enum(["celsius", "fahrenheit"]),
  preferredLanguage: z.enum(["en-GB", "fa-IR"]),
  onboardingCompleted: z.boolean(),
  onboardingStep: z.enum([
    "welcome",
    "styles",
    "city",
    "clothing",
    "review",
    "first_outfit",
    "feedback",
    "done",
  ]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const updateUserProfileRequestSchema = z.object({
  cityId: z.string().uuid().nullable().optional(),
  currency: z.string().min(1).optional(),
  temperaturePreference: z.enum(["celsius", "fahrenheit"]).optional(),
  preferredLanguage: z.enum(["en-GB", "fa-IR"]).optional(),
  onboardingCompleted: z.boolean().optional(),
  onboardingStep: userProfileSchema.shape.onboardingStep.optional(),
});

export const userProfileResponseSchema = z.object({
  profile: userProfileSchema,
});

export const updateMeRequestSchema = z.object({
  displayName: z.string().min(1).max(120).nullable().optional(),
  locale: z.enum(["en-GB", "fa-IR"]).optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type UpdateUserProfileRequest = z.infer<typeof updateUserProfileRequestSchema>;
export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;
export type UpdateMeRequest = z.infer<typeof updateMeRequestSchema>;
