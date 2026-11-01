import { createMockWeatherClient } from "@/infrastructure/weather/mock-weather.js";
import { createOpenMeteoWeatherClient } from "@/infrastructure/weather/open-meteo.js";
import type { WeatherClient } from "@/infrastructure/weather/types.js";
import type { Env } from "@/shared/config/index.js";

export type {
  WeatherClient,
  WeatherFetchInput,
  WeatherFetchResult,
} from "@/infrastructure/weather/types.js";
export { createMockWeatherClient } from "@/infrastructure/weather/mock-weather.js";
export { createOpenMeteoWeatherClient } from "@/infrastructure/weather/open-meteo.js";

export function createWeatherClient(env: Env): WeatherClient {
  if (env.WEATHER_PROVIDER === "mock" || env.NODE_ENV === "test") {
    return createMockWeatherClient();
  }

  return createOpenMeteoWeatherClient();
}
