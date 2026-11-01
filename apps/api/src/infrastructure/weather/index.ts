import type { Env } from "../../shared/config/index.js";
import { createMockWeatherClient } from "./mock-weather.js";
import { createOpenMeteoWeatherClient } from "./open-meteo.js";
import type { WeatherClient } from "./types.js";

export type { WeatherClient, WeatherFetchInput, WeatherFetchResult } from "./types.js";
export { createMockWeatherClient } from "./mock-weather.js";
export { createOpenMeteoWeatherClient } from "./open-meteo.js";

export function createWeatherClient(env: Env): WeatherClient {
  if (env.WEATHER_PROVIDER === "mock" || env.NODE_ENV === "test") {
    return createMockWeatherClient();
  }

  return createOpenMeteoWeatherClient();
}
