import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "~": path.resolve(import.meta.dirname),
      "virtual:pwa-register/react": path.resolve(
        import.meta.dirname,
        "src/shared/testing/pwa-register-stub.ts",
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/shared/testing/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "src/features/onboarding-flow/**/*.{ts,tsx}",
        "src/features/outfit-card/**/*.{ts,tsx}",
        "src/features/stylist-chat-sheet/**/*.{ts,tsx}",
        "src/features/locale-switcher/**/*.{ts,tsx}",
        "src/pages/closet-page/**/*.{ts,tsx}",
        "src/pages/today-page/**/*.{ts,tsx}",
        "src/pages/discover-page/**/*.{ts,tsx}",
        "src/shared/lib/**/*.{ts,tsx}",
        "src/shared/ui/**/*.{ts,tsx}",
        "src/widgets/app-shell/**/*.{ts,tsx}",
      ],
      exclude: [
        "src/**/index.ts",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.types.ts",
        "src/**/*.stories.tsx",
        "src/**/*.constants.ts",
        "src/shared/ui/icons/**",
        "src/shared/ui/celebration-burst/**",
        "src/shared/ui/bottom-sheet/**",
        "src/shared/ui/animated-scene/**",
        "src/shared/ui/empty-state/**",
        "src/shared/assets/**",
        "src/shared/testing/**",
        "src/features/locale-switcher/**",
      ],
      thresholds: {
        lines: 90,
        functions: 87,
        branches: 70,
        statements: 89,
      },
    },
  },
});
