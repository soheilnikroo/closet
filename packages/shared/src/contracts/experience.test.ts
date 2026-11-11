import { describe, expect, it } from "vitest";

import {
  preferencesSchema,
  tryOnRequestSchema,
  updatePreferencesSchema,
} from "@/contracts/experience.js";

describe("experience contracts", () => {
  it("defaults optional preferences and validates changes", () => {
    expect(preferencesSchema.parse({}).savedDiscoverIds).toEqual([]);
    expect(updatePreferencesSchema.parse({ heightBand: "tall" })).toEqual({ heightBand: "tall" });
    expect(
      updatePreferencesSchema.safeParse({ savedDiscoverIds: Array(101).fill("x") }).success,
    ).toBe(false);
    expect(tryOnRequestSchema.safeParse({ outfitId: "foreign-or-invalid" }).success).toBe(false);
  });
});
