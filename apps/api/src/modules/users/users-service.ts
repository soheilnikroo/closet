import type { User } from "@closet/shared";
import { eq } from "drizzle-orm";

import { usersTable, type Database } from "@/infrastructure/database/index.js";
import { mapUserRowToUser } from "@/modules/users/user-mapper.js";

export type UpsertUserInput = {
  clerkUserId: string;
  email: string | null;
  phone: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};

export type UsersService = {
  upsertFromClerk: (input: UpsertUserInput) => Promise<User>;
  getByClerkUserId: (clerkUserId: string) => Promise<User | null>;
};

export function createUsersService(db: Database): UsersService {
  return {
    async getByClerkUserId(clerkUserId) {
      const rows = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.clerkUserId, clerkUserId))
        .limit(1);

      const row = rows[0];
      return row ? mapUserRowToUser(row) : null;
    },

    async upsertFromClerk(input) {
      const existing = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.clerkUserId, input.clerkUserId))
        .limit(1);

      const existingRow = existing[0];

      if (existingRow) {
        const updated = await db
          .update(usersTable)
          .set({
            email: input.email,
            phone: input.phone,
            displayName: input.displayName,
            avatarUrl: input.avatarUrl,
            updatedAt: new Date(),
          })
          .where(eq(usersTable.id, existingRow.id))
          .returning();

        const row = updated[0];
        if (!row) {
          throw new Error("Failed to update user");
        }

        return mapUserRowToUser(row);
      }

      const inserted = await db
        .insert(usersTable)
        .values({
          clerkUserId: input.clerkUserId,
          email: input.email,
          phone: input.phone,
          displayName: input.displayName,
          avatarUrl: input.avatarUrl,
        })
        .returning();

      const row = inserted[0];
      if (!row) {
        throw new Error("Failed to create user");
      }

      return mapUserRowToUser(row);
    },
  };
}
