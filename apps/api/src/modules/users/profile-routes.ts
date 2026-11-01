import {
  styleProfileResponseSchema,
  updateMeRequestSchema,
  updateStyleProfileRequestSchema,
  updateUserProfileRequestSchema,
  userProfileResponseSchema,
  meResponseSchema,
  citySchema,
} from "@closet/shared";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { usersTable, type Database } from "../../infrastructure/database/index.js";
import { getAuthFromRequest, type AuthGetter } from "../../shared/auth/index.js";
import type { Env } from "../../shared/config/index.js";
import { validationError } from "../../shared/errors/index.js";
import { ensureUserFromClerkId } from "./ensure-user.js";
import type { ProfileService } from "./profile-service.js";
import { mapUserRowToUser } from "./user-mapper.js";
import type { UsersService } from "./users-service.js";

export type ProfileRoutesDeps = {
  db: Database;
  env: Env;
  usersService: UsersService;
  profileService: ProfileService;
  getAuth?: AuthGetter;
};

export async function registerProfileRoutes(
  app: FastifyInstance,
  deps: ProfileRoutesDeps,
): Promise<void> {
  const getAuth = deps.getAuth ?? getAuthFromRequest;

  app.patch("/v1/users/me", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const parsed = updateMeRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw validationError("Invalid profile update", parsed.error.issues);
    }

    const updated = await deps.db
      .update(usersTable)
      .set({
        ...(parsed.data.displayName !== undefined ? { displayName: parsed.data.displayName } : {}),
        ...(parsed.data.locale !== undefined ? { locale: parsed.data.locale } : {}),
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, user.id))
      .returning();

    const row = updated[0];
    if (!row) {
      throw validationError("Unable to update user");
    }

    if (parsed.data.locale) {
      await deps.profileService.updateProfile(user.id, {
        preferredLanguage: parsed.data.locale,
      });
    }

    return reply.send(meResponseSchema.parse({ user: mapUserRowToUser(row) }));
  });

  app.get("/v1/users/me/profile", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const profile = await deps.profileService.getProfile(user.id);
    return reply.send(userProfileResponseSchema.parse({ profile }));
  });

  app.patch("/v1/users/me/profile", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const parsed = updateUserProfileRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw validationError("Invalid profile update", parsed.error.issues);
    }
    const profile = await deps.profileService.updateProfile(user.id, parsed.data);
    return reply.send(userProfileResponseSchema.parse({ profile }));
  });

  app.get("/v1/users/me/style-profile", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const styleProfile = await deps.profileService.getStyleProfile(user.id);
    return reply.send(styleProfileResponseSchema.parse({ styleProfile }));
  });

  app.patch("/v1/users/me/style-profile", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const parsed = updateStyleProfileRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw validationError("Invalid style profile", parsed.error.issues);
    }
    const styleProfile = await deps.profileService.updateStyleProfile(user.id, parsed.data);
    return reply.send(styleProfileResponseSchema.parse({ styleProfile }));
  });

  app.get("/v1/cities", async (_request, reply) => {
    const cities = await deps.profileService.listCities();
    return reply.send(z.object({ cities: z.array(citySchema) }).parse({ cities }));
  });
}
