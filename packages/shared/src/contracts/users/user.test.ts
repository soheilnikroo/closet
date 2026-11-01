import { describe, expect, it } from "vitest";

import { meResponseSchema, userSchema } from "@/contracts/users/index.js";

describe("user contracts", () => {
  it("accepts user and me payloads", () => {
    const user = {
      id: "00000000-0000-4000-8000-000000000001",
      clerkUserId: "user_123",
      email: "a@example.com",
      phone: null,
      displayName: "Ada",
      avatarUrl: null,
      locale: "en-GB",
      status: "active",
      createdAt: "2026-11-01T10:00:00.000Z",
      updatedAt: "2026-11-01T10:00:00.000Z",
    };

    expect(userSchema.safeParse(user).success).toBe(true);
    expect(meResponseSchema.safeParse({ user }).success).toBe(true);
  });
});
