import { describe, expect, it } from "vitest";

import { mapUserRowToUser } from "@/modules/users/user-mapper.js";

describe("mapUserRowToUser", () => {
  it("maps database timestamps to ISO strings", () => {
    const createdAt = new Date("2026-11-01T10:00:00.000Z");
    const updatedAt = new Date("2026-11-01T11:00:00.000Z");

    const user = mapUserRowToUser({
      id: "11111111-1111-1111-1111-111111111111",
      clerkUserId: "user_123",
      email: "style@example.com",
      phone: null,
      displayName: "Style User",
      avatarUrl: null,
      locale: "en-GB",
      status: "active",
      createdAt,
      updatedAt,
    });

    expect(user.createdAt).toBe(createdAt.toISOString());
    expect(user.updatedAt).toBe(updatedAt.toISOString());
    expect(user.clerkUserId).toBe("user_123");
  });
});
