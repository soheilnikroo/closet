import { describe, expect, it } from "vitest";

import { apiErrorSchema } from "@/contracts/errors/api-error.js";

describe("apiErrorSchema", () => {
  it("accepts domain error codes", () => {
    expect(
      apiErrorSchema.safeParse({
        error: {
          code: "wardrobe_too_limited",
          message: "Need more clothes",
        },
      }).success,
    ).toBe(true);
  });

  it("rejects unknown codes", () => {
    expect(
      apiErrorSchema.safeParse({
        error: {
          code: "nope",
          message: "x",
        },
      }).success,
    ).toBe(false);
  });
});
