import { z } from "zod";

export const weatherSnapshotSchema = z.object({
  id: z.string().uuid(),
  cityId: z.string().uuid(),
  cityName: z.string().min(1),
  temperature: z.number(),
  feelsLike: z.number(),
  minTemperature: z.number(),
  maxTemperature: z.number(),
  precipitationProbability: z.number().min(0).max(100),
  windSpeed: z.number(),
  humidity: z.number().min(0).max(100),
  condition: z.string().min(1),
  forecastAt: z.string().datetime(),
  fetchedAt: z.string().datetime(),
});

export const weatherResponseSchema = z.object({
  weather: weatherSnapshotSchema.nullable(),
});

export type WeatherSnapshot = z.infer<typeof weatherSnapshotSchema>;
export type WeatherResponse = z.infer<typeof weatherResponseSchema>;
