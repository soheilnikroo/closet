import { describe, expect, it } from "vitest";

import { weatherResponseSchema, weatherSnapshotSchema } from "./weather-snapshot.js";

describe("weather contracts", () => {
  it("accepts weather snapshots", () => {
    const weather = {
      id: "00000000-0000-4000-8000-000000000001",
      cityId: "00000000-0000-4000-8000-000000000002",
      cityName: "Tehran",
      temperature: 22,
      feelsLike: 21,
      minTemperature: 16,
      maxTemperature: 26,
      precipitationProbability: 10,
      windSpeed: 8,
      humidity: 40,
      condition: "clear",
      forecastAt: "2026-11-01T10:00:00.000Z",
      fetchedAt: "2026-11-01T10:00:00.000Z",
    };

    expect(weatherSnapshotSchema.safeParse(weather).success).toBe(true);
    expect(weatherResponseSchema.safeParse({ weather }).success).toBe(true);
    expect(weatherResponseSchema.safeParse({ weather: null }).success).toBe(true);
  });
});
