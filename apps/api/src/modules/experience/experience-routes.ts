/* oxlint-disable oxc/no-async-endpoint-handlers -- Fastify awaits async route handlers. */
import { preferencesSchema, updatePreferencesSchema, tryOnRequestSchema } from "@closet/shared";
import { and, eq, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import {
  userPreferencesTable,
  userProfilesTable,
  outfitsTable,
  outfitItemsTable,
  clothingItemsTable,
  type Database,
} from "@/infrastructure/database/index.js";
import { renderTryOn } from "@/modules/experience/render-try-on.js";
import { ensureUserFromClerkId } from "@/modules/users/ensure-user.js";
import { type ProfileService } from "@/modules/users/profile-service.js";
import type { UsersService } from "@/modules/users/users-service.js";
import type { WardrobeService } from "@/modules/wardrobe/wardrobe-service.js";
import { getAuthFromRequest } from "@/shared/auth/index.js";
import { usesMockAuth } from "@/shared/auth/provider.js";
import type { Env } from "@/shared/config/index.js";
import { notFound, validationError } from "@/shared/errors/index.js";

type Deps = {
  db: Database;
  env: Env;
  usersService: UsersService;
  profileService: ProfileService;
  wardrobeService: WardrobeService;
};
export async function registerExperienceRoutes(app: FastifyInstance, deps: Deps) {
  const { db, env, usersService, profileService, wardrobeService } = deps;
  async function readPreferences(userId: string) {
    const rows = await db
      .select()
      .from(userPreferencesTable)
      .where(
        and(
          eq(userPreferencesTable.userId, userId),
          eq(userPreferencesTable.preferenceType, "app"),
        ),
      )
      .limit(1);
    return preferencesSchema.parse(
      rows[0]?.preferenceValue ?? {
        locale: (await profileService.getProfile(userId)).preferredLanguage,
      },
    );
  }
  app.get("/v1/users/me/preferences", async (request) => {
    const user = await ensureUserFromClerkId(getAuthFromRequest(request).userId, usersService, env);
    return { preferences: await readPreferences(user.id) };
  });
  app.patch("/v1/users/me/preferences", async (request) => {
    const user = await ensureUserFromClerkId(getAuthFromRequest(request).userId, usersService, env);
    const input = updatePreferencesSchema.safeParse(request.body);
    if (!input.success) {
      throw validationError("Invalid preferences", input.error.issues);
    }
    await profileService.ensureDefaults(user.id);
    return db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${user.id}))`);
      const condition = and(
        eq(userPreferencesTable.userId, user.id),
        eq(userPreferencesTable.preferenceType, "app"),
      );
      const rows = await tx.select().from(userPreferencesTable).where(condition).limit(1);
      const preferences = preferencesSchema.parse({
        ...preferencesSchema.parse(rows[0]?.preferenceValue ?? {}),
        ...input.data,
      });
      if (rows[0]) {
        await tx
          .update(userPreferencesTable)
          .set({ preferenceValue: preferences, updatedAt: new Date() })
          .where(condition);
      } else {
        await tx
          .insert(userPreferencesTable)
          .values({ userId: user.id, preferenceType: "app", preferenceValue: preferences });
      }
      if (input.data.locale) {
        await tx
          .update(userProfilesTable)
          .set({ preferredLanguage: input.data.locale, updatedAt: new Date() })
          .where(eq(userProfilesTable.userId, user.id));
      }
      return { preferences };
    });
  });
  app.post("/v1/demo/seed", async (request) => {
    if (!usesMockAuth(env)) {
      throw notFound("Demo is only available with local mock authentication");
    }
    const user = await ensureUserFromClerkId(getAuthFromRequest(request).userId, usersService, env);
    const profile = await profileService.getProfile(user.id);
    const cities = await profileService.listCities();
    await profileService.updateProfile(user.id, {
      cityId: profile.cityId ?? cities.find((city) => city.name === "Tehran")?.id,
      onboardingCompleted: true,
      onboardingStep: "done",
    });
    const style = await profileService.getStyleProfile(user.id);
    if (!style.preferredStyles.length) {
      await profileService.updateStyleProfile(user.id, { preferredStyles: ["casual", "minimal"] });
    }
    const items = await wardrobeService.seedSampleCatalog(user.id);
    return { count: items.length };
  });
  app.post("/v1/try-on", async (request) => {
    const user = await ensureUserFromClerkId(getAuthFromRequest(request).userId, usersService, env);
    const parsed = tryOnRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw validationError("Invalid outfit preview", parsed.error.issues);
    }
    const outfit = await db
      .select()
      .from(outfitsTable)
      .where(and(eq(outfitsTable.id, parsed.data.outfitId), eq(outfitsTable.userId, user.id)))
      .limit(1);
    if (!outfit[0]) {
      throw notFound("Outfit not found");
    }
    const entries = await db
      .select({ item: clothingItemsTable, role: outfitItemsTable.role })
      .from(outfitItemsTable)
      .innerJoin(clothingItemsTable, eq(outfitItemsTable.clothingItemId, clothingItemsTable.id))
      .where(eq(outfitItemsTable.outfitId, parsed.data.outfitId));
    const svg = renderTryOn(entries, parsed.data.silhouette);
    return {
      provider: "mock",
      outfitId: parsed.data.outfitId,
      imageUrl: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
    };
  });
}
