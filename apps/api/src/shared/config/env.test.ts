import { describe, expect, it } from "vitest";

import { loadEnv } from "./env.js";

describe("loadEnv", () => {
  it("parses a valid environment", () => {
    const env = loadEnv({
      DATABASE_URL: "postgresql://closet:closet@localhost:5432/closet",
      WEB_ORIGIN: "http://localhost:5173",
      CLERK_PUBLISHABLE_KEY: "pk_test_x",
      CLERK_SECRET_KEY: "sk_test_x",
      API_PORT: "9090",
    });

    expect(env.API_PORT).toBe(9090);
    expect(env.API_HOST).toBe("0.0.0.0");
  });

  it("throws when required values are missing", () => {
    expect(() => loadEnv({})).toThrow(/Invalid environment configuration/);
  });
});
