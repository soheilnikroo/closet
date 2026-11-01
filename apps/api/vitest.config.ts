import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["./src/shared/testing/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/index.ts",
        "src/server.ts",
        "src/app.ts",
        "src/**/*-routes.ts",
        "src/infrastructure/database/migrate.ts",
        "src/infrastructure/database/seeds/**",
        "src/infrastructure/database/schema/**",
        "src/infrastructure/database/client.ts",
        "src/modules/wardrobe/sample-catalog.ts",
        "src/shared/testing/**",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 70,
        statements: 90,
      },
    },
  },
});
