import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  asString,
  idParamSchema,
  parseBody,
  parseParams,
  parseQuery,
} from "@/shared/http/parse-request.js";

describe("parse-request helpers", () => {
  it("parses body, params, and query", () => {
    expect(parseBody(z.object({ name: z.string() }), { name: "a" })).toEqual({ name: "a" });
    expect(parseParams(idParamSchema, { id: "00000000-0000-4000-8000-000000000001" }).id).toBe(
      "00000000-0000-4000-8000-000000000001",
    );
    expect(parseQuery(z.object({ q: z.string().optional() }), { q: "x" }).q).toBe("x");
  });

  it("throws validation errors", () => {
    expect(() => parseBody(z.object({ name: z.string() }), {})).toThrow(/Invalid request body/);
    expect(() => parseParams(idParamSchema, { id: "nope" })).toThrow(/Invalid path parameters/);
    expect(() => parseQuery(z.object({ n: z.coerce.number() }), { n: "x" })).toThrow(
      /Invalid query parameters/,
    );
  });

  it("coerces unknown values to strings safely", () => {
    expect(asString("hi")).toBe("hi");
    expect(asString(12)).toBe("");
  });
});
