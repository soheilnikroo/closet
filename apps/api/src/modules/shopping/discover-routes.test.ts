import Fastify from "fastify";
import { describe, expect, it, vi } from "vitest";

import { registerDiscoverRoutes } from "@/modules/shopping/discover-routes.js";
import type { DiscoverService } from "@/modules/shopping/discover-service.js";
import type { UsersService } from "@/modules/users/users-service.js";
import type { Env } from "@/shared/config/index.js";

describe("discover routes", () => {
  it("returns gaps", async () => {
    const app = Fastify();
    const discoverService = {
      getGaps: vi.fn().mockResolvedValue({ gaps: [], itemCount: 0 }),
    } as unknown as DiscoverService;
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

    await registerDiscoverRoutes(app, {
      env: {} as Env,
      usersService,
      discoverService,
      getAuth: () => ({ userId: "user_1" }),
    });

    const response = await app.inject({ method: "GET", url: "/v1/discover/gaps" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ gaps: [], itemCount: 0 });
    await app.close();
  });
});
