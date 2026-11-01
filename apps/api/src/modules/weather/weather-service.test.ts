import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { Database } from "@/infrastructure/database/index.js";
import { createMockWeatherClient } from "@/infrastructure/weather/index.js";
import { createProfileService } from "@/modules/users/profile-service.js";
import { createWeatherService } from "@/modules/weather/weather-service.js";
import { createTestDatabase } from "@/shared/testing/test-db.js";

describe("createWeatherService", () => {
  let db: Database;

  beforeAll(async () => {
    db = await createTestDatabase();
  });

  afterAll(async () => {
    // no-op: shared postgres container
  });

  it("caches weather snapshots for a city", async () => {
    const cities = await createProfileService(db).listCities();
    const city = cities[0];
    expect(city).toBeTruthy();
    if (!city) {
      return;
    }

    const service = createWeatherService({
      db,
      weatherClient: createMockWeatherClient(),
    });

    const first = await service.getForCity(city.id);
    const second = await service.getForCity(city.id);
    expect(first.id).toBe(second.id);
    expect(first.cityName).toBe(city.name);

    const missing = await service.getForUserCity(null);
    expect(missing).toBeNull();
  });
});
