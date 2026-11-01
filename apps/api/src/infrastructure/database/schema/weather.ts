import { doublePrecision, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { citiesTable } from "@/infrastructure/database/schema/cities.js";

export const weatherSnapshotsTable = pgTable("weather_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  cityId: uuid("city_id")
    .notNull()
    .references(() => citiesTable.id, { onDelete: "cascade" }),
  temperature: doublePrecision("temperature").notNull(),
  feelsLike: doublePrecision("feels_like").notNull(),
  minTemperature: doublePrecision("min_temperature").notNull(),
  maxTemperature: doublePrecision("max_temperature").notNull(),
  precipitationProbability: integer("precipitation_probability").notNull().default(0),
  windSpeed: doublePrecision("wind_speed").notNull().default(0),
  humidity: integer("humidity").notNull().default(50),
  condition: varchar("condition", { length: 64 }).notNull(),
  forecastAt: timestamp("forecast_at", { withTimezone: true }).notNull(),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WeatherSnapshotRow = typeof weatherSnapshotsTable.$inferSelect;
