import {
  collectionsResponseSchema,
  collectionDetailSchema,
  collectionResponseSchema,
  recommendationsResponseSchema,
} from "@closet/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildApp } from "@/app.js";
import { loadEnv } from "@/shared/config/index.js";
import { createTestDatabase, deleteTestUser } from "@/shared/testing/test-db.js";

const env = loadEnv({
  ...process.env,
  NODE_ENV: "test",
  AUTH_PROVIDER: "mock",
  AI_PROVIDER: "mock",
  WEATHER_PROVIDER: "mock",
});
const db = await createTestDatabase();
const app = await buildApp({ env, db });
const headers = { authorization: `Bearer mock:collections-${crypto.randomUUID()}` };
const stranger = { authorization: `Bearer mock:collections-${crypto.randomUUID()}` };
const users: string[] = [];
let recommendationId: string;
beforeAll(async () => {
  for (const auth of [headers, stranger]) {
    const me = await app.inject({ method: "GET", url: "/v1/users/me", headers: auth });
    users.push(me.json<{ user: { id: string } }>().user.id);
  }
  await app.inject({ method: "POST", url: "/v1/demo/seed", headers });
  const result = await app.inject({
    method: "POST",
    url: "/v1/styling/recommendations",
    headers,
    payload: {},
  });
  recommendationId = recommendationsResponseSchema.parse(result.json()).primary.id;
});
afterAll(async () => {
  await Promise.all(users.map((id) => deleteTestUser(db, id)));
  await app.close();
  await db.$client.end();
});
describe("private outfit collections", () => {
  it("creates and saves atomically, preserves details, and deduplicates repeated saves", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/v1/collections",
      headers,
      payload: {
        name: "Weekend",
        description: "Easy favourites",
        season: "summer",
        color: "sage",
        recommendationId,
        action: "like",
      },
    });
    expect(created.statusCode).toBe(200);
    const { collection } = collectionResponseSchema.parse(created.json());
    expect(collection.count).toBe(1);
    await Promise.all(
      [1, 2].map(() =>
        app.inject({
          method: "PUT",
          url: `/v1/collections/${collection.id}/outfits`,
          headers,
          payload: { recommendationId },
        }),
      ),
    );
    const detail = collectionDetailSchema.parse(
      (
        await app.inject({ method: "GET", url: `/v1/collections/${collection.id}`, headers })
      ).json(),
    );
    expect(detail.outfits).toHaveLength(1);
    expect(detail.outfits[0]?.outfit.items[0]?.item?.name).toBeTruthy();
    expect(detail.collection.description).toBe("Easy favourites");
    expect(
      (
        await app.inject({
          method: "PATCH",
          url: `/v1/collections/${collection.id}`,
          headers,
          payload: { name: "Slow Sundays", color: "forest" },
        })
      ).statusCode,
    ).toBe(200);
    const list = collectionsResponseSchema.parse(
      (await app.inject({ method: "GET", url: "/v1/collections", headers })).json(),
    );
    expect(list.collections.find((item) => item.id === collection.id)?.name).toBe("Slow Sundays");
    for (const method of ["GET", "PATCH", "PUT"] as const) {
      const result = await app.inject({
        method,
        url: `/v1/collections/${collection.id}${method === "PUT" ? "/outfits" : ""}`,
        headers: stranger,
        ...(method === "GET"
          ? {}
          : { payload: method === "PUT" ? { recommendationId } : { name: "Not mine" } }),
      });
      expect(result.statusCode).toBe(404);
    }
  });
  it("rejects foreign outfits and invalid names without leaving an empty collection", async () => {
    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/collections",
          headers: stranger,
          payload: { name: "Forbidden", recommendationId },
        })
      ).statusCode,
    ).toBe(404);
    expect(
      (
        await app.inject({
          method: "POST",
          url: "/v1/collections",
          headers: stranger,
          payload: { name: "  " },
        })
      ).statusCode,
    ).toBe(400);
    const list = collectionsResponseSchema.parse(
      (await app.inject({ method: "GET", url: "/v1/collections", headers: stranger })).json(),
    );
    expect(list.collections).toHaveLength(0);
    expect((await app.inject({ method: "GET", url: "/v1/collections" })).statusCode).toBe(401);
  });
});
