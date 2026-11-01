import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  real,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { citiesTable } from "./cities.js";
import { usersTable } from "./users.js";

export const temperaturePreferenceEnum = pgEnum("temperature_preference", [
  "celsius",
  "fahrenheit",
]);

export const onboardingStepEnum = pgEnum("onboarding_step", [
  "welcome",
  "styles",
  "city",
  "clothing",
  "review",
  "first_outfit",
  "feedback",
  "done",
]);

export const preferenceSourceEnum = pgEnum("preference_source", ["user", "ai", "interaction"]);

export const userProfilesTable = pgTable("user_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  cityId: uuid("city_id").references(() => citiesTable.id, { onDelete: "set null" }),
  currency: varchar("currency", { length: 8 }).notNull().default("IRR"),
  temperaturePreference: temperaturePreferenceEnum("temperature_preference")
    .notNull()
    .default("celsius"),
  preferredLanguage: varchar("preferred_language", { length: 16 }).notNull().default("en-GB"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  onboardingStep: onboardingStepEnum("onboarding_step").notNull().default("welcome"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userStyleProfilesTable = pgTable("user_style_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  preferredStyles: jsonb("preferred_styles").$type<string[]>().notNull().default([]),
  preferredFits: jsonb("preferred_fits").$type<string[]>().notNull().default([]),
  dislikedFits: jsonb("disliked_fits").$type<string[]>().notNull().default([]),
  preferredColors: jsonb("preferred_colors").$type<string[]>().notNull().default([]),
  dislikedColors: jsonb("disliked_colors").$type<string[]>().notNull().default([]),
  comfortPriority: boolean("comfort_priority"),
  lifestylePreferences: jsonb("lifestyle_preferences").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userPreferencesTable = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  preferenceType: varchar("preference_type", { length: 64 }).notNull(),
  preferenceValue: jsonb("preference_value").notNull(),
  source: preferenceSourceEnum("source").notNull().default("user"),
  confidence: real("confidence").notNull().default(1),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserProfileRow = typeof userProfilesTable.$inferSelect;
export type UserStyleProfileRow = typeof userStyleProfilesTable.$inferSelect;
