import { describe, expect, it } from "vitest";

import { updateStyleProfileRequestSchema, userProfileSchema } from "@/contracts/profile/index.js";

describe("profile contracts", () => {
  it("parses user profiles and style updates", () => {
    expect(
      userProfileSchema.safeParse({
        userId: "00000000-0000-4000-8000-000000000001",
        cityId: null,
        currency: "IRR",
        temperaturePreference: "celsius",
        preferredLanguage: "fa-IR",
        onboardingCompleted: false,
        onboardingStep: "welcome",
        createdAt: "2026-11-01T10:00:00.000Z",
        updatedAt: "2026-11-01T10:00:00.000Z",
      }).success,
    ).toBe(true);

    expect(
      updateStyleProfileRequestSchema.safeParse({
        preferredStyles: ["casual", "minimal"],
      }).success,
    ).toBe(true);
  });
});
