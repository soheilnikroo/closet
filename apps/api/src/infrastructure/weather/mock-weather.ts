import type { WeatherClient } from "./types.js";

export function createMockWeatherClient(): WeatherClient {
  return {
    name: "mock",
    async fetchCurrent() {
      return {
        temperature: 22,
        feelsLike: 21,
        minTemperature: 16,
        maxTemperature: 26,
        precipitationProbability: 10,
        windSpeed: 8,
        humidity: 45,
        condition: "partly_cloudy",
        forecastAt: new Date(),
      };
    },
  };
}
