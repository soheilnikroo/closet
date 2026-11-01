import { describe, expect, it } from "vitest";

import { buildApp } from "../../app.js";
import { loadEnv } from "../../shared/config/index.js";

describe("health routes", () => {
  it("returns ok from /health", async () => {
    const env = loadEnv({
      ...process.env,
      NODE_ENV: "test",
      CLERK_PUBLISHABLE_KEY: "pk_test_replace_me",
      CLERK_SECRET_KEY: "sk_test_replace_me",
      WEATHER_PROVIDER: "mock",
    });
    const app = await buildApp({ env });
    const response = await app.inject({ method: "GET", url: "/health" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: "ok", service: "closet-api" });
    await app.close();
  });
});
