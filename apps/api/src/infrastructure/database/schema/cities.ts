import { doublePrecision, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const citiesTable = pgTable("cities", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  nameFa: varchar("name_fa", { length: 120 }).notNull(),
  province: varchar("province", { length: 120 }).notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  timezone: varchar("timezone", { length: 64 }).notNull().default("Asia/Tehran"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CityRow = typeof citiesTable.$inferSelect;
