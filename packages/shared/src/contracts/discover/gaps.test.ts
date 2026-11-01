import { describe, expect, it } from "vitest";

import { discoverGapsResponseSchema } from "./gaps.js";

describe("discover gaps contract", () => {
  it("accepts gap payloads", () => {
    expect(
      discoverGapsResponseSchema.safeParse({
        gaps: [
          {
            categorySlug: "jacket",
            categoryName: "Jacket",
            categoryNameFa: "کت",
            reason: "Useful",
            reasonFa: "مفید",
            priority: 1,
          },
        ],
        itemCount: 4,
      }).success,
    ).toBe(true);
  });
});
