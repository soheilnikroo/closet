import { describe, expect, it } from "vitest";

import { stylistChatRequestSchema, stylistChatResponseSchema } from "./chat.js";

describe("ai chat contracts", () => {
  it("validates chat request/response", () => {
    expect(
      stylistChatRequestSchema.safeParse({
        message: "What should I wear?",
        locale: "fa-IR",
      }).success,
    ).toBe(true);

    expect(
      stylistChatResponseSchema.safeParse({
        reply: "Try a white shirt.",
        recommendations: [],
      }).success,
    ).toBe(true);
  });
});
