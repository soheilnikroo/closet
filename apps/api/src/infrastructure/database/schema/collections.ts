import type { Recommendation } from "@closet/shared";
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

import { outfitsTable } from "@/infrastructure/database/schema/styling.js";
import { usersTable } from "@/infrastructure/database/schema/users.js";

export const collectionsTable = pgTable(
  "outfit_collections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 80 }).notNull(),
    description: text("description").notNull().default(""),
    occasion: varchar("occasion", { length: 80 }).notNull().default(""),
    season: varchar("season", { length: 16 }).notNull().default("any"),
    color: varchar("color", { length: 16 }).notNull().default("forest"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("collections_user_idx").on(table.userId)],
);
export const collectionOutfitsTable = pgTable(
  "collection_outfits",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collectionsTable.id, { onDelete: "cascade" }),
    outfitId: uuid("outfit_id")
      .notNull()
      .references(() => outfitsTable.id, { onDelete: "cascade" }),
    snapshot: jsonb("snapshot").$type<Recommendation>().notNull(),
    savedAt: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.collectionId, table.outfitId] })],
);
