import type { WeatherClient } from "@/infrastructure/weather/types.js";

export function createMockWeatherClient(): WeatherClient {
  return {
    name: "mock",
    async fetchCurrent(input) {
      const now = new Date();
      const seasonal = 12 * Math.cos(((now.getUTCMonth() - 6) * Math.PI) / 6);
      const cityOffset = input.cityName === "Isfahan" ? 2 : input.cityName === "Rasht" ? -3 : 0;
      const temperature = Math.round(20 + seasonal + cityOffset - (input.latitude - 35) * 0.7);
      return {
        temperature,
        feelsLike: temperature - 1,
        minTemperature: temperature - 6,
        maxTemperature: temperature + 4,
        precipitationProbability: input.cityName === "Rasht" ? 65 : temperature < 15 ? 30 : 10,
        windSpeed: 8,
        humidity: 45,
        condition: "partly_cloudy",
        forecastAt: now,
      };
    },
  };
}
