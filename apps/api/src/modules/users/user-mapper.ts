import type { User } from "@closet/shared";

import type { UserRow } from "../../infrastructure/database/index.js";

export function mapUserRowToUser(row: UserRow): User {
  return {
    id: row.id,
    clerkUserId: row.clerkUserId,
    email: row.email,
    phone: row.phone,
    displayName: row.displayName,
    avatarUrl: row.avatarUrl,
    locale: row.locale,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
