import { afterEach, describe, expect, it, vi } from "vitest";

import { createWeatherClient } from "@/infrastructure/weather/index.js";
import { createMockWeatherClient } from "@/infrastructure/weather/mock-weather.js";
import { createOpenMeteoWeatherClient } from "@/infrastructure/weather/open-meteo.js";
import type { Env } from "@/shared/config/index.js";

describe("weather clients", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a deterministic seasonal mock snapshot", async () => {
    const client = createMockWeatherClient();
    const result = await client.fetchCurrent({
      cityId: "1",
      cityName: "Tehran",
      latitude: 35,
      longitude: 51,
    });

    const again = await client.fetchCurrent({
      cityId: "1",
      cityName: "Tehran",
      latitude: 35,
      longitude: 51,
    });
    expect(result.temperature).toBe(again.temperature);
    expect(result.minTemperature).toBeLessThan(result.temperature);
    expect(result.maxTemperature).toBeGreaterThan(result.temperature);
    const isfahan = await client.fetchCurrent({
      cityId: "2",
      cityName: "Isfahan",
      latitude: 35,
      longitude: 51,
    });
    expect(isfahan.temperature).not.toBe(result.temperature);
    expect(result.condition).toBe("partly_cloudy");
  });

  it("parses open-meteo responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 18,
            apparent_temperature: 17,
            relative_humidity_2m: 55,
            precipitation_probability: 20,
            wind_speed_10m: 12,
            weather_code: 61,
          },
          daily: {
            temperature_2m_min: [14],
            temperature_2m_max: [21],
          },
        }),
      }),
    );

    const client = createOpenMeteoWeatherClient();
    const result = await client.fetchCurrent({
      cityId: "1",
      cityName: "Tehran",
      latitude: 35.6,
      longitude: 51.4,
    });

    expect(result.temperature).toBe(18);
    expect(result.condition).toBe("rain");
    expect(result.minTemperature).toBe(14);
  });

  it("fails when open-meteo returns an error status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(
      createOpenMeteoWeatherClient().fetchCurrent({
        cityId: "1",
        cityName: "Tehran",
        latitude: 35,
        longitude: 51,
      }),
    ).rejects.toThrow(/Open-Meteo failed/);
  });

  it("selects mock provider from env", () => {
    const env = {
      WEATHER_PROVIDER: "mock",
      NODE_ENV: "development",
    } as Env;
    expect(createWeatherClient(env).name).toBe("mock");
  });
});
