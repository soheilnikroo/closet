import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/fastify", () => ({
  createClerkClient: () => ({
    users: {
      getUser: async () => ({
        emailAddresses: [{ id: "e1", emailAddress: "new@example.com" }],
        primaryEmailAddressId: "e1",
        phoneNumbers: [{ id: "p1", phoneNumber: "+98912" }],
        primaryPhoneNumberId: "p1",
        firstName: "New",
        lastName: "User",
        username: null,
        imageUrl: "",
      }),
    },
  }),
}));

import type { Env } from "../../shared/config/index.js";
import { ensureUserFromClerkId } from "./ensure-user.js";

describe("ensureUserFromClerkId", () => {
  it("throws when unauthenticated", async () => {
    await expect(
      ensureUserFromClerkId(
        null,
        { getByClerkUserId: vi.fn(), upsertFromClerk: vi.fn() },
        {} as Env,
      ),
    ).rejects.toThrow(/Authentication required/);
  });

  it("returns an existing user", async () => {
    const existing = { id: "u1", clerkUserId: "c1" };
    const result = await ensureUserFromClerkId(
      "c1",
      {
        getByClerkUserId: vi.fn().mockResolvedValue(existing),
        upsertFromClerk: vi.fn(),
      },
      {} as Env,
    );
    expect(result).toBe(existing);
  });

  it("upserts from clerk when missing locally", async () => {
    const upsertFromClerk = vi.fn().mockResolvedValue({ id: "u2", clerkUserId: "c2" });
    const result = await ensureUserFromClerkId(
      "c2",
      {
        getByClerkUserId: vi.fn().mockResolvedValue(null),
        upsertFromClerk,
      },
      {
        CLERK_SECRET_KEY: "sk_test_x",
        CLERK_PUBLISHABLE_KEY: "pk_test_x",
      } as Env,
    );
    expect(result.id).toBe("u2");
    expect(upsertFromClerk).toHaveBeenCalledOnce();
  });
});
