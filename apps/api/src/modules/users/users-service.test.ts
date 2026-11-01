import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { Database } from "@/infrastructure/database/index.js";
import { createUsersService } from "@/modules/users/users-service.js";
import { createTestDatabase, deleteTestUser } from "@/shared/testing/test-db.js";

describe("createUsersService", () => {
  let db: Database;
  let userId = "";
  const clerkUserId = `clerk_${crypto.randomUUID()}`;

  beforeAll(async () => {
    db = await createTestDatabase();
  });

  afterAll(async () => {
    if (userId) {
      await deleteTestUser(db, userId);
    }
  });

  it("upserts and loads users by clerk id", async () => {
    const service = createUsersService(db);
    const created = await service.upsertFromClerk({
      clerkUserId,
      email: "a@example.com",
      phone: null,
      displayName: "Ada",
      avatarUrl: null,
    });
    userId = created.id;

    const again = await service.upsertFromClerk({
      clerkUserId,
      email: "b@example.com",
      phone: "+98912",
      displayName: "Ada Lovelace",
      avatarUrl: "https://example.com/a.png",
    });

    expect(again.id).toBe(created.id);
    expect(again.email).toBe("b@example.com");
    expect(again.displayName).toBe("Ada Lovelace");

    const loaded = await service.getByClerkUserId(clerkUserId);
    expect(loaded?.id).toBe(userId);
    expect(await service.getByClerkUserId("missing")).toBeNull();
  });
});
