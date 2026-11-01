import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { usersTable } from "@/infrastructure/database/schema/users.js";

export const clothingStatusEnum = pgEnum("clothing_status", ["active", "archived", "deleted"]);
export const mediaProcessingStatusEnum = pgEnum("media_processing_status", [
  "pending",
  "processing",
  "ready",
  "failed",
]);
export const clothingSourceTypeEnum = pgEnum("clothing_source_type", [
  "photo",
  "manual",
  "sample_catalog",
  "import",
]);
export const clothingSlotEnum = pgEnum("clothing_slot", [
  "top",
  "bottom",
  "shoes",
  "outerwear",
  "accessory",
]);
export const analysisStatusEnum = pgEnum("analysis_status", ["pending", "succeeded", "failed"]);

export const wardrobesTable = pgTable("wardrobes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }).notNull().default("My Closet"),
  isDefault: boolean("is_default").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clothingCategoriesTable = pgTable("clothing_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  parentId: uuid("parent_id"),
  name: varchar("name", { length: 120 }).notNull(),
  nameFa: varchar("name_fa", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  slot: clothingSlotEnum("slot").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const clothingItemsTable = pgTable("clothing_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardrobeId: uuid("wardrobe_id")
    .notNull()
    .references(() => wardrobesTable.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => clothingCategoriesTable.id),
  name: varchar("name", { length: 160 }).notNull(),
  primaryColor: varchar("primary_color", { length: 64 }).notNull(),
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  pattern: varchar("pattern", { length: 64 }),
  styleTags: jsonb("style_tags").$type<string[]>().notNull().default([]),
  seasons: jsonb("seasons").$type<string[]>().notNull().default(["all_season"]),
  material: varchar("material", { length: 120 }),
  formality: varchar("formality", { length: 64 }),
  fit: varchar("fit", { length: 64 }),
  cut: varchar("cut", { length: 64 }),
  length: varchar("length", { length: 64 }),
  warmthLevel: integer("warmth_level"),
  size: varchar("size", { length: 32 }),
  brand: varchar("brand", { length: 120 }),
  condition: varchar("condition", { length: 64 }),
  sourceType: clothingSourceTypeEnum("source_type").notNull().default("manual"),
  status: clothingStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  lastWornAt: timestamp("last_worn_at", { withTimezone: true }),
});

export const mediaAssetsTable = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  storageKey: text("storage_key").notNull(),
  mimeType: varchar("mime_type", { length: 120 }).notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  processingStatus: mediaProcessingStatusEnum("processing_status").notNull().default("pending"),
  detections: jsonb("detections").$type<unknown[]>().notNull().default([]),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clothingImagesTable = pgTable("clothing_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  clothingItemId: uuid("clothing_item_id")
    .notNull()
    .references(() => clothingItemsTable.id, { onDelete: "cascade" }),
  mediaAssetId: uuid("media_asset_id")
    .notNull()
    .references(() => mediaAssetsTable.id, { onDelete: "cascade" }),
  imageType: varchar("image_type", { length: 32 }).notNull().default("primary"),
  isPrimary: boolean("is_primary").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clothingItemAnalysesTable = pgTable("clothing_item_analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  clothingItemId: uuid("clothing_item_id")
    .notNull()
    .references(() => clothingItemsTable.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 64 }).notNull(),
  model: varchar("model", { length: 120 }).notNull(),
  analysisVersion: varchar("analysis_version", { length: 32 }).notNull().default("1"),
  result: jsonb("result").notNull(),
  confidence: real("confidence"),
  status: analysisStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WardrobeRow = typeof wardrobesTable.$inferSelect;
export type ClothingCategoryRow = typeof clothingCategoriesTable.$inferSelect;
export type ClothingItemRow = typeof clothingItemsTable.$inferSelect;
export type MediaAssetRow = typeof mediaAssetsTable.$inferSelect;
