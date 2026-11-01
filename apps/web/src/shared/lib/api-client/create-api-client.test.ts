import { describe, expect, it, vi } from "vitest";

import { buildAuthHeader, createApiClient } from "./create-api-client.js";

describe("buildAuthHeader", () => {
  it("returns an authorization header when a token exists", () => {
    expect(buildAuthHeader("tok_123")).toEqual({
      Authorization: "Bearer tok_123",
    });
  });

  it("returns an empty object when token is missing", () => {
    expect(buildAuthHeader(null)).toEqual({});
  });
});

describe("createApiClient", () => {
  it("parses a health response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "ok",
        service: "closet-api",
        timestamp: "2026-11-01T16:00:00.000Z",
      }),
    });

    const client = createApiClient({
      baseUrl: "http://localhost:8080",
      getToken: async () => null,
      fetchImpl,
    });

    const health = await client.getHealth();
    expect(health.status).toBe("ok");
    expect(fetchImpl).toHaveBeenCalledOnce();
  });
});
