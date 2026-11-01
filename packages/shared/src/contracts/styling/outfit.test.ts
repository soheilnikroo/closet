import { describe, expect, it } from "vitest";

import {
  createRecommendationRequestSchema,
  feedbackRequestSchema,
  todayResponseSchema,
} from "@/contracts/styling/outfit.js";

describe("styling contracts", () => {
  it("accepts recommendation and feedback payloads", () => {
    expect(
      createRecommendationRequestSchema.safeParse({
        occasionSlug: "work",
        regenerate: true,
      }).success,
    ).toBe(true);

    expect(feedbackRequestSchema.safeParse({ action: "like" }).success).toBe(true);
    expect(feedbackRequestSchema.safeParse({ action: "throw" }).success).toBe(false);
  });

  it("accepts an empty today payload", () => {
    expect(
      todayResponseSchema.safeParse({
        primary: null,
        alternatives: [],
        weather: null,
        wardrobeItemCount: 0,
        message: "Add clothes",
      }).success,
    ).toBe(true);
  });
});
