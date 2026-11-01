import type { WeatherSnapshot } from "@closet/shared";
import { desc, eq } from "drizzle-orm";

import {
  citiesTable,
  weatherSnapshotsTable,
  type Database,
} from "@/infrastructure/database/index.js";
import type { WeatherClient } from "@/infrastructure/weather/index.js";
import { notFound } from "@/shared/errors/index.js";

const CACHE_MS = 45 * 60 * 1000;

export type WeatherService = {
  getForCity: (cityId: string) => Promise<WeatherSnapshot>;
  getForUserCity: (cityId: string | null) => Promise<WeatherSnapshot | null>;
};

function mapSnapshot(
  row: typeof weatherSnapshotsTable.$inferSelect,
  cityName: string,
): WeatherSnapshot {
  return {
    id: row.id,
    cityId: row.cityId,
    cityName,
    temperature: row.temperature,
    feelsLike: row.feelsLike,
    minTemperature: row.minTemperature,
    maxTemperature: row.maxTemperature,
    precipitationProbability: row.precipitationProbability,
    windSpeed: row.windSpeed,
    humidity: row.humidity,
    condition: row.condition,
    forecastAt: row.forecastAt.toISOString(),
    fetchedAt: row.fetchedAt.toISOString(),
  };
}

export function createWeatherService(deps: {
  db: Database;
  weatherClient: WeatherClient;
}): WeatherService {
  const { db, weatherClient } = deps;

  return {
    async getForCity(cityId) {
      const cities = await db.select().from(citiesTable).where(eq(citiesTable.id, cityId)).limit(1);
      const city = cities[0];
      if (!city) {
        throw notFound("City not found");
      }

      const cached = await db
        .select()
        .from(weatherSnapshotsTable)
        .where(eq(weatherSnapshotsTable.cityId, cityId))
        .orderBy(desc(weatherSnapshotsTable.fetchedAt))
        .limit(1);

      const latest = cached[0];
      if (latest && Date.now() - latest.fetchedAt.getTime() < CACHE_MS) {
        return mapSnapshot(latest, city.name);
      }

      const fetched = await weatherClient.fetchCurrent({
        cityId: city.id,
        cityName: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
      });

      const inserted = await db
        .insert(weatherSnapshotsTable)
        .values({
          cityId: city.id,
          temperature: fetched.temperature,
          feelsLike: fetched.feelsLike,
          minTemperature: fetched.minTemperature,
          maxTemperature: fetched.maxTemperature,
          precipitationProbability: Math.round(fetched.precipitationProbability),
          windSpeed: fetched.windSpeed,
          humidity: Math.round(fetched.humidity),
          condition: fetched.condition,
          forecastAt: fetched.forecastAt,
          fetchedAt: new Date(),
        })
        .returning();

      const row = inserted[0];
      if (!row) {
        throw new Error("Failed to store weather snapshot");
      }
      return mapSnapshot(row, city.name);
    },

    async getForUserCity(cityId) {
      if (!cityId) {
        return null;
      }
      try {
        return await this.getForCity(cityId);
      } catch {
        return null;
      }
    },
  };
}
