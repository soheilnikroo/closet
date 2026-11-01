import {
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { usersTable } from "@/infrastructure/database/schema/users.js";
import { clothingItemsTable } from "@/infrastructure/database/schema/wardrobe.js";
import { weatherSnapshotsTable } from "@/infrastructure/database/schema/weather.js";

export const outfitItemRoleEnum = pgEnum("outfit_item_role", [
  "top",
  "bottom",
  "shoes",
  "outerwear",
  "accessory",
]);

export const recommendationTypeEnum = pgEnum("recommendation_type", [
  "daily",
  "occasion",
  "chat",
  "alternative",
  "first_outfit",
]);

export const feedbackActionEnum = pgEnum("feedback_action", [
  "like",
  "dislike",
  "save",
  "worn",
  "regenerate",
]);

export const occasionsTable = pgTable("occasions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  nameFa: varchar("name_fa", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  category: varchar("category", { length: 64 }).notNull(),
  formalityLevel: integer("formality_level").notNull().default(2),
  description: text("description"),
});

export const outfitsTable = pgTable("outfits", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 160 }),
  description: text("description"),
  style: varchar("style", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const outfitItemsTable = pgTable("outfit_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  outfitId: uuid("outfit_id")
    .notNull()
    .references(() => outfitsTable.id, { onDelete: "cascade" }),
  clothingItemId: uuid("clothing_item_id")
    .notNull()
    .references(() => clothingItemsTable.id, { onDelete: "cascade" }),
  role: outfitItemRoleEnum("role").notNull(),
  position: integer("position").notNull().default(0),
});

export const outfitRecommendationsTable = pgTable("outfit_recommendations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  outfitId: uuid("outfit_id")
    .notNull()
    .references(() => outfitsTable.id, { onDelete: "cascade" }),
  recommendationType: recommendationTypeEnum("recommendation_type").notNull(),
  occasionId: uuid("occasion_id").references(() => occasionsTable.id, { onDelete: "set null" }),
  weatherSnapshotId: uuid("weather_snapshot_id").references(() => weatherSnapshotsTable.id, {
    onDelete: "set null",
  }),
  score: doublePrecision("score").notNull(),
  explanation: text("explanation").notNull(),
  algorithmVersion: varchar("algorithm_version", { length: 32 }).notNull().default("1.0"),
  generatedAt: timestamp("generated_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export const outfitFeedbackTable = pgTable("outfit_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  recommendationId: uuid("recommendation_id")
    .notNull()
    .references(() => outfitRecommendationsTable.id, { onDelete: "cascade" }),
  action: feedbackActionEnum("action").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type OccasionRow = typeof occasionsTable.$inferSelect;
export type OutfitRow = typeof outfitsTable.$inferSelect;
export type OutfitRecommendationRow = typeof outfitRecommendationsTable.$inferSelect;
