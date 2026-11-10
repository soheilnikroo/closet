import type { FastifyRequest } from "fastify";
import { describe, expect, it } from "vitest";

import { getAuthFromRequest } from "@/shared/auth/get-auth.js";

describe("getAuthFromRequest", () => {
  it("reads userId from request.auth()", () => {
    const request = {
      auth: () => ({ userId: "user_1" }),
    } as unknown as FastifyRequest;
    expect(getAuthFromRequest(request)).toEqual({ userId: "user_1" });
  });

  it("reads userId from the auth object Clerk attaches", () => {
    const request = {
      auth: { userId: "user_2", sessionId: "sess_1" },
    } as unknown as FastifyRequest;
    expect(getAuthFromRequest(request)).toEqual({ userId: "user_2" });
  });

  it("returns null when auth is missing", () => {
    const request = {} as FastifyRequest;
    expect(getAuthFromRequest(request)).toEqual({ userId: null });
  });
});
