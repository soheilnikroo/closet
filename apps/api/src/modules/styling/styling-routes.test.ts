import Fastify from "fastify";
import { describe, expect, it, vi } from "vitest";

import type { Env } from "../../shared/config/index.js";
import type { UsersService } from "../users/users-service.js";
import { registerStylingRoutes } from "./styling-routes.js";
import type { StylingService } from "./styling-service.js";

describe("styling routes", () => {
  it("returns today payload", async () => {
    const app = Fastify();
    const stylingService = {
      getToday: vi.fn().mockResolvedValue({
        primary: null,
        alternatives: [],
        weather: null,
        wardrobeItemCount: 0,
        message: "Add clothes",
      }),
      listOccasions: vi.fn().mockResolvedValue([]),
    } as unknown as StylingService;
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

    await registerStylingRoutes(app, {
      env: {} as Env,
      usersService,
      stylingService,
      getAuth: () => ({ userId: "user_1" }),
    });

    const response = await app.inject({ method: "GET", url: "/v1/styling/today" });
    expect(response.statusCode).toBe(200);
    expect(response.json().message).toContain("Add clothes");
    await app.close();
  });
});
