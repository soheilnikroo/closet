import Fastify from "fastify";
import { describe, expect, it, vi } from "vitest";

import type { Env } from "../../shared/config/index.js";
import type { UsersService } from "../users/users-service.js";
import { registerWardrobeRoutes } from "./wardrobe-routes.js";
import type { WardrobeService } from "./wardrobe-service.js";

describe("wardrobe routes", () => {
  it("lists items for an authenticated user", async () => {
    const app = Fastify();
    const wardrobeService = {
      listItems: vi.fn().mockResolvedValue([]),
      listCategories: vi.fn().mockResolvedValue([]),
    } as unknown as WardrobeService;
    const usersService = {
      getByClerkUserId: vi.fn().mockResolvedValue({
        id: "00000000-0000-4000-8000-000000000001",
        clerkUserId: "user_1",
        email: null,
        phone: null,
        displayName: "Test",
        avatarUrl: null,
        locale: "en-GB",
        status: "active",
        createdAt: "2026-11-01T10:00:00.000Z",
        updatedAt: "2026-11-01T10:00:00.000Z",
      }),
    } as unknown as UsersService;

    await registerWardrobeRoutes(app, {
      env: {} as Env,
      usersService,
      wardrobeService,
      getAuth: () => ({ userId: "user_1" }),
    });

    const response = await app.inject({ method: "GET", url: "/v1/wardrobe/items" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ items: [] });
    await app.close();
  });
});
