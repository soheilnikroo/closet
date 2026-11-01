import { afterEach, describe, expect, it, vi } from "vitest";

import { createOpenMeteoWeatherClient } from "./open-meteo.js";

describe("open-meteo weather codes", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    [0, "clear"],
    [2, "partly_cloudy"],
    [45, "fog"],
    [71, "snow"],
    [80, "showers"],
    [95, "thunderstorm"],
    [120, "unknown"],
  ] as const)("maps weather code %s to %s", async (code, expected) => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 10,
            weather_code: code,
          },
        }),
      }),
    );

    const result = await createOpenMeteoWeatherClient().fetchCurrent({
      cityId: "1",
      cityName: "Tehran",
      latitude: 35,
      longitude: 51,
    });
    expect(result.condition).toBe(expected);
  });
});
