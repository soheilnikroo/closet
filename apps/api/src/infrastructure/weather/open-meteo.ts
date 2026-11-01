import { z } from "zod";

import type { WeatherClient, WeatherFetchResult } from "./types.js";

const openMeteoResponseSchema = z.object({
  current: z
    .object({
      temperature_2m: z.number().optional(),
      apparent_temperature: z.number().optional(),
      relative_humidity_2m: z.number().optional(),
      precipitation_probability: z.number().optional(),
      wind_speed_10m: z.number().optional(),
      weather_code: z.number().optional(),
    })
    .optional(),
  daily: z
    .object({
      temperature_2m_max: z.array(z.number()).optional(),
      temperature_2m_min: z.array(z.number()).optional(),
    })
    .optional(),
});

function mapWeatherCode(code: number | undefined): string {
  if (code === undefined) {
    return "unknown";
  }
  if (code === 0) {
    return "clear";
  }
  if (code <= 3) {
    return "partly_cloudy";
  }
  if (code <= 48) {
    return "fog";
  }
  if (code <= 67) {
    return "rain";
  }
  if (code <= 77) {
    return "snow";
  }
  if (code <= 82) {
    return "showers";
  }
  if (code <= 99) {
    return "thunderstorm";
  }
  return "unknown";
}

export function createOpenMeteoWeatherClient(): WeatherClient {
  return {
    name: "open-meteo",
    async fetchCurrent(input): Promise<WeatherFetchResult> {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.set("latitude", String(input.latitude));
      url.searchParams.set("longitude", String(input.longitude));
      url.searchParams.set(
        "current",
        "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,wind_speed_10m,weather_code",
      );
      url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
      url.searchParams.set("timezone", "auto");
      url.searchParams.set("forecast_days", "1");

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo failed: ${response.status}`);
      }

      const data = openMeteoResponseSchema.parse(await response.json());
      const current = data.current ?? {};
      const temp = current.temperature_2m ?? 20;

      return {
        temperature: temp,
        feelsLike: current.apparent_temperature ?? temp,
        minTemperature: data.daily?.temperature_2m_min?.[0] ?? temp - 3,
        maxTemperature: data.daily?.temperature_2m_max?.[0] ?? temp + 3,
        precipitationProbability: current.precipitation_probability ?? 0,
        windSpeed: current.wind_speed_10m ?? 0,
        humidity: current.relative_humidity_2m ?? 50,
        condition: mapWeatherCode(current.weather_code),
        forecastAt: new Date(),
      };
    },
  };
}
