import Fastify from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@clerk/fastify", () => ({
  createClerkClient: () => ({
    users: {
      getUser: async () => ({
        emailAddresses: [{ id: "e1", emailAddress: "ada@example.com" }],
        primaryEmailAddressId: "e1",
        phoneNumbers: [],
        primaryPhoneNumberId: null,
        firstName: "Ada",
        lastName: "Lovelace",
        username: null,
        imageUrl: "https://example.com/a.png",
      }),
    },
  }),
}));

import type { Env } from "../../shared/config/index.js";
import { registerUsersRoutes } from "./users-routes.js";

describe("users routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("upserts the current clerk user", async () => {
    const app = Fastify();
    const usersService = {
      upsertFromClerk: vi.fn().mockResolvedValue({
        id: "00000000-0000-4000-8000-000000000001",
        clerkUserId: "user_1",
        email: "ada@example.com",
        phone: null,
        displayName: "Ada Lovelace",
        avatarUrl: "https://example.com/a.png",
        locale: "en-GB",
        status: "active",
        createdAt: "2026-11-01T10:00:00.000Z",
        updatedAt: "2026-11-01T10:00:00.000Z",
      }),
      getByClerkUserId: vi.fn(),
    };

    await registerUsersRoutes(app, {
      usersService,
      env: {
        CLERK_SECRET_KEY: "sk_test_x",
        CLERK_PUBLISHABLE_KEY: "pk_test_x",
      } as Env,
      getAuth: () => ({ userId: "user_1" }),
    });

    const response = await app.inject({ method: "GET", url: "/v1/users/me" });
    expect(response.statusCode).toBe(200);
    expect(response.json().user.displayName).toBe("Ada Lovelace");
    await app.close();
  });
});
