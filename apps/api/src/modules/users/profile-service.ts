import {
  citySchema,
  styleProfileSchema,
  userProfileSchema,
  type City,
  type StyleProfile,
  type UpdateStyleProfileRequest,
  type UpdateUserProfileRequest,
  type UserProfile,
} from "@closet/shared";
import { eq } from "drizzle-orm";

import {
  citiesTable,
  userProfilesTable,
  userStyleProfilesTable,
  type Database,
} from "@/infrastructure/database/index.js";
import { notFound } from "@/shared/errors/index.js";

export type ProfileService = {
  ensureDefaults: (userId: string) => Promise<void>;
  getProfile: (userId: string) => Promise<UserProfile>;
  updateProfile: (userId: string, input: UpdateUserProfileRequest) => Promise<UserProfile>;
  getStyleProfile: (userId: string) => Promise<StyleProfile>;
  updateStyleProfile: (userId: string, input: UpdateStyleProfileRequest) => Promise<StyleProfile>;
  listCities: () => Promise<City[]>;
};

export function createProfileService(db: Database): ProfileService {
  return {
    async ensureDefaults(userId) {
      const existingProfile = await db
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.userId, userId))
        .limit(1);

      if (existingProfile.length === 0) {
        await db.insert(userProfilesTable).values({ userId }).onConflictDoNothing();
      }

      const existingStyle = await db
        .select()
        .from(userStyleProfilesTable)
        .where(eq(userStyleProfilesTable.userId, userId))
        .limit(1);

      if (existingStyle.length === 0) {
        await db.insert(userStyleProfilesTable).values({ userId }).onConflictDoNothing();
      }
    },

    async getProfile(userId) {
      await this.ensureDefaults(userId);
      const rows = await db
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.userId, userId))
        .limit(1);
      const row = rows[0];
      if (!row) {
        throw notFound("Profile not found");
      }
      return userProfileSchema.parse({
        userId: row.userId,
        cityId: row.cityId,
        currency: row.currency,
        temperaturePreference: row.temperaturePreference,
        preferredLanguage: row.preferredLanguage,
        onboardingCompleted: row.onboardingCompleted,
        onboardingStep: row.onboardingStep,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      });
    },

    async updateProfile(userId, input) {
      await this.ensureDefaults(userId);
      const updated = await db
        .update(userProfilesTable)
        .set({
          ...(input.cityId !== undefined ? { cityId: input.cityId } : {}),
          ...(input.currency !== undefined ? { currency: input.currency } : {}),
          ...(input.temperaturePreference !== undefined
            ? { temperaturePreference: input.temperaturePreference }
            : {}),
          ...(input.preferredLanguage !== undefined
            ? { preferredLanguage: input.preferredLanguage }
            : {}),
          ...(input.onboardingCompleted !== undefined
            ? { onboardingCompleted: input.onboardingCompleted }
            : {}),
          ...(input.onboardingStep !== undefined ? { onboardingStep: input.onboardingStep } : {}),
          updatedAt: new Date(),
        })
        .where(eq(userProfilesTable.userId, userId))
        .returning();

      const row = updated[0];
      if (!row) {
        throw notFound("Profile not found");
      }
      return this.getProfile(userId);
    },

    async getStyleProfile(userId) {
      await this.ensureDefaults(userId);
      const rows = await db
        .select()
        .from(userStyleProfilesTable)
        .where(eq(userStyleProfilesTable.userId, userId))
        .limit(1);
      const row = rows[0];
      if (!row) {
        throw notFound("Style profile not found");
      }
      return styleProfileSchema.parse({
        userId: row.userId,
        preferredStyles: row.preferredStyles,
        preferredFits: row.preferredFits,
        dislikedFits: row.dislikedFits,
        preferredColors: row.preferredColors,
        dislikedColors: row.dislikedColors,
        comfortPriority: row.comfortPriority,
        lifestylePreferences: row.lifestylePreferences,
        updatedAt: row.updatedAt.toISOString(),
      });
    },

    async updateStyleProfile(userId, input) {
      await this.ensureDefaults(userId);
      await db
        .update(userStyleProfilesTable)
        .set({
          ...(input.preferredStyles !== undefined
            ? { preferredStyles: input.preferredStyles }
            : {}),
          ...(input.preferredFits !== undefined ? { preferredFits: input.preferredFits } : {}),
          ...(input.dislikedFits !== undefined ? { dislikedFits: input.dislikedFits } : {}),
          ...(input.preferredColors !== undefined
            ? { preferredColors: input.preferredColors }
            : {}),
          ...(input.dislikedColors !== undefined ? { dislikedColors: input.dislikedColors } : {}),
          ...(input.comfortPriority !== undefined
            ? { comfortPriority: input.comfortPriority }
            : {}),
          ...(input.lifestylePreferences !== undefined
            ? { lifestylePreferences: input.lifestylePreferences }
            : {}),
          updatedAt: new Date(),
        })
        .where(eq(userStyleProfilesTable.userId, userId));

      return this.getStyleProfile(userId);
    },

    async listCities() {
      const rows = await db.select().from(citiesTable);
      return rows.map((row) =>
        citySchema.parse({
          id: row.id,
          name: row.name,
          nameFa: row.nameFa,
          province: row.province,
          latitude: row.latitude,
          longitude: row.longitude,
          timezone: row.timezone,
        }),
      );
    },
  };
}
