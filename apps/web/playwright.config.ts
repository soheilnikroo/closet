import { defineConfig, devices } from "@playwright/test";

const port = 5174;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: process.env["CI"] ? 2 : 0,
  timeout: 60_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    navigationTimeout: 45_000,
  },

  webServer: {
    // Dedicated port + guest Clerk key so e2e never attaches to a local `pnpm dev` with real auth.
    command: `pnpm exec react-router dev --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      // Force guest mode so shell routes are explorable without Clerk sign-in.
      VITE_CLERK_PUBLISHABLE_KEY: "pk_test_replace_me",
      VITE_API_BASE_URL: "",
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env["PLAYWRIGHT_CHANNEL"]
          ? { channel: process.env["PLAYWRIGHT_CHANNEL"] }
          : {}),
      },
    },
  ],
});
