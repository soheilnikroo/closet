import { defineConfig } from "drizzle-kit";

const databaseUrl =
  process.env["DATABASE_URL"] ?? "postgresql://closet:closet@localhost:5432/closet";

export default defineConfig({
  dbCredentials: {
    url: databaseUrl,
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/infrastructure/database/schema/index.ts",
  strict: true,
  verbose: true,
});
