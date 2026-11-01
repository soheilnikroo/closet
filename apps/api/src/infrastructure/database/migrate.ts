import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { loadEnv } from "../../shared/config/index.js";

async function runMigrations(): Promise<void> {
  const env = loadEnv();
  const client = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  await migrate(db, { migrationsFolder: new URL("../../../drizzle", import.meta.url).pathname });
  await client.end();
}

runMigrations().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
