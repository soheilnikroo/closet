import { eq } from "drizzle-orm";

import { createDatabase, usersTable, type Database } from "../../infrastructure/database/index.js";
import { runSeeds } from "../../infrastructure/database/seeds/run-seeds.js";

export async function createTestDatabase(): Promise<Database> {
  const db = createDatabase(
    process.env["DATABASE_URL"] ?? "postgresql://closet:closet@localhost:5432/closet",
  );
  await runSeeds(db);
  return db;
}

export async function createTestUser(
  db: Database,
  clerkUserId = `test_${crypto.randomUUID()}`,
): Promise<{ id: string; clerkUserId: string }> {
  const inserted = await db
    .insert(usersTable)
    .values({
      clerkUserId,
      email: `${clerkUserId}@example.com`,
      displayName: "Test User",
      locale: "en-GB",
    })
    .returning();

  const row = inserted[0];
  if (!row) {
    throw new Error("Failed to create test user");
  }

  return { id: row.id, clerkUserId: row.clerkUserId };
}

export async function deleteTestUser(db: Database, userId: string): Promise<void> {
  await db.delete(usersTable).where(eq(usersTable.id, userId));
}
