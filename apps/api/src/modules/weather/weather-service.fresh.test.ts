import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  citiesTable,
  weatherSnapshotsTable,
  type Database,
} from "@/infrastructure/database/index.js";
import { createMockWeatherClient } from "@/infrastructure/weather/index.js";
import { createWeatherService } from "@/modules/weather/weather-service.js";
import { createTestDatabase } from "@/shared/testing/test-db.js";

describe("weather service fresh fetch", () => {
  let db: Database;
  let cityId = "";

  beforeAll(async () => {
    db = await createTestDatabase();
    const inserted = await db
      .insert(citiesTable)
      .values({
        name: `TestCity_${Date.now()}`,
        nameFa: "شهر تست",
        province: "Test",
        latitude: 30,
        longitude: 50,
        timezone: "Asia/Tehran",
      })
      .returning();
    cityId = inserted[0]?.id ?? "";
  });

  afterAll(async () => {
    if (cityId) {
      await db.delete(weatherSnapshotsTable).where(eq(weatherSnapshotsTable.cityId, cityId));
      await db.delete(citiesTable).where(eq(citiesTable.id, cityId));
    }
  });

  it("fetches and stores a new snapshot", async () => {
    const service = createWeatherService({
      db,
      weatherClient: createMockWeatherClient(),
    });
    const weather = await service.getForCity(cityId);
    expect(weather.cityId).toBe(cityId);
    expect(weather.temperature).toBe(22);

    await expect(service.getForCity("00000000-0000-4000-8000-000000000099")).rejects.toThrow(
      /City not found/,
    );
  });
});
