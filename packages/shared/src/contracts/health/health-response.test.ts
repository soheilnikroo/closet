import { describe, expect, it } from "vitest";

import { healthResponseSchema } from "@/contracts/health/health-response.js";

describe("healthResponseSchema", () => {
  it("accepts a valid health payload", () => {
    const result = healthResponseSchema.safeParse({
      status: "ok",
      service: "closet-api",
      timestamp: "2026-11-01T16:00:00.000Z",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid service name", () => {
    const result = healthResponseSchema.safeParse({
      status: "ok",
      service: "other",
      timestamp: "2026-11-01T16:00:00.000Z",
    });

    expect(result.success).toBe(false);
  });
});
