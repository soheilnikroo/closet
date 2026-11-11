import {
  preferencesResponseSchema,
  recommendationsResponseSchema,
  tryOnResultSchema,
} from "@closet/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildApp } from "@/app.js";
import { usesMockAuth } from "@/shared/auth/provider.js";
import { loadEnv } from "@/shared/config/index.js";
import { createTestDatabase, deleteTestUser } from "@/shared/testing/test-db.js";

const env = loadEnv({
  ...process.env,
  NODE_ENV: "test",
  AUTH_PROVIDER: "mock",
  AI_PROVIDER: "mock",
  WEATHER_PROVIDER: "mock",
});
const headers = { authorization: `Bearer mock:test-${crypto.randomUUID()}` };
const db = await createTestDatabase();
const app = await buildApp({ env, db });
let userId: string;
beforeAll(async () => {
  const me = await app.inject({ method: "GET", url: "/v1/users/me", headers });
  if (me.statusCode !== 200) {
    throw new Error(me.body);
  }
  userId = me.json<{ user: { id: string } }>().user.id;
});
afterAll(async () => {
  if (userId) {
    await deleteTestUser(db, userId);
  }
  await app.close();
  await db.$client.end();
});

describe("mock-first experience", () => {
  it("requires a valid mock bearer and refuses production mock authentication", async () => {
    expect((await app.inject({ method: "GET", url: "/v1/users/me" })).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/v1/users/me",
          headers: { authorization: "Bearer guest" },
        })
      ).statusCode,
    ).toBe(401);
    expect(usesMockAuth({ ...env, NODE_ENV: "production" })).toBe(false);
    await expect(buildApp({ env: { ...env, NODE_ENV: "production" }, db })).rejects.toThrow(
      "production requires",
    );
  });
  it("seeds idempotently, saves preferences and protects outfit ownership", async () => {
    const seed = () => app.inject({ method: "POST", url: "/v1/demo/seed", headers });
    expect((await seed()).json()).toEqual({ count: 12 });
    expect((await seed()).json()).toEqual({ count: 12 });
    const items = await app.inject({ method: "GET", url: "/v1/wardrobe/items", headers });
    expect(items.json<{ items: unknown[] }>().items).toHaveLength(12);
    const patch = await app.inject({
      method: "PATCH",
      url: "/v1/users/me/preferences",
      headers,
      payload: { savedDiscoverIds: ["idea-1"], silhouette: "relaxed", heightBand: "tall" },
    });
    expect(patch.statusCode).toBe(200);
    const preferences = await app.inject({
      method: "GET",
      url: "/v1/users/me/preferences",
      headers,
    });
    expect(
      preferencesResponseSchema.parse(preferences.json()).preferences.savedDiscoverIds,
    ).toEqual(["idea-1"]);
    expect(
      (
        await app.inject({
          method: "PATCH",
          url: "/v1/users/me/preferences",
          headers,
          payload: { silhouette: "invalid" },
        })
      ).statusCode,
    ).toBe(400);
    const recResponse = await app.inject({
      method: "POST",
      url: "/v1/styling/recommendations",
      headers,
      payload: {},
    });
    const { primary } = recommendationsResponseSchema.parse(recResponse.json());
    const top = primary.outfit.items.find((entry) => entry.role === "top");
    if (!top) {
      throw new Error("Seeded wardrobe must generate a top");
    }
    const swap = await app.inject({
      method: "POST",
      url: `/v1/styling/recommendations/${primary.id}/replace-item`,
      headers,
      payload: { clothingItemId: top.clothingItemId, role: top.role },
    });
    expect(swap.statusCode).toBe(200);
    const swapped = swap.json<{ recommendation: typeof primary }>().recommendation;
    expect(swapped.outfit.items.find((entry) => entry.role === "top")?.clothingItemId).not.toBe(
      top.clothingItemId,
    );
    for (const entry of primary.outfit.items.filter((entry) => entry.role !== "top")) {
      expect(
        swapped.outfit.items.some((piece) => piece.clothingItemId === entry.clothingItemId),
      ).toBe(true);
    }
    const preview = await app.inject({
      method: "POST",
      url: "/v1/try-on",
      headers,
      payload: { outfitId: primary.outfit.id },
    });
    expect(tryOnResultSchema.parse(preview.json()).imageUrl).toMatch(
      /^data:image\/svg\+xml;base64,/,
    );
    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/try-on",
          headers,
          payload: { outfitId: crypto.randomUUID() },
        })
      ).statusCode,
    ).toBe(404);
  });
});
