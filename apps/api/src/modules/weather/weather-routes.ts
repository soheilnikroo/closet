import { weatherResponseSchema } from "@closet/shared";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { ensureUserFromClerkId } from "@/modules/users/ensure-user.js";
import type { ProfileService } from "@/modules/users/profile-service.js";
import type { UsersService } from "@/modules/users/users-service.js";
import type { WeatherService } from "@/modules/weather/weather-service.js";
import { getAuthFromRequest, type AuthGetter } from "@/shared/auth/index.js";
import type { Env } from "@/shared/config/index.js";
import { validationError } from "@/shared/errors/index.js";
import { parseQuery } from "@/shared/http/index.js";

export type WeatherRoutesDeps = {
  env: Env;
  usersService: UsersService;
  profileService: ProfileService;
  weatherService: WeatherService;
  getAuth?: AuthGetter;
};

const weatherQuerySchema = z.object({
  cityId: z.string().uuid().optional(),
});

export async function registerWeatherRoutes(
  app: FastifyInstance,
  deps: WeatherRoutesDeps,
): Promise<void> {
  const getAuth = deps.getAuth ?? getAuthFromRequest;

  app.get("/v1/weather", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const query = parseQuery(weatherQuerySchema, request.query);
    const profile = await deps.profileService.getProfile(user.id);
    const cityId = query.cityId ?? profile.cityId;
    if (!cityId) {
      return reply.send(weatherResponseSchema.parse({ weather: null }));
    }

    try {
      const weather = await deps.weatherService.getForCity(cityId);
      return reply.send(weatherResponseSchema.parse({ weather }));
    } catch (error) {
      throw validationError(error instanceof Error ? error.message : "Unable to fetch weather");
    }
  });
}
