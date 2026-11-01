import type { FastifyRequest } from "fastify";
import { describe, expect, it } from "vitest";

import { getAuthFromRequest } from "./get-auth.js";

describe("getAuthFromRequest", () => {
  it("reads userId from request.auth()", () => {
    const request = {
      auth: () => ({ userId: "user_1" }),
    } as unknown as FastifyRequest;
    expect(getAuthFromRequest(request)).toEqual({ userId: "user_1" });
  });

  it("returns null when auth is missing", () => {
    const request = {} as FastifyRequest;
    expect(getAuthFromRequest(request)).toEqual({ userId: null });
  });
});
