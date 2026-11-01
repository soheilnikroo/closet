import { describe, expect, it } from "vitest";

import { formatJalaliPlaceholder } from "@/shared/lib/jalali/jalali.js";

describe("formatJalaliPlaceholder", () => {
  it("returns a non-empty localized string", () => {
    const formatted = formatJalaliPlaceholder(new Date("2026-03-21T00:00:00.000Z"));
    expect(formatted.length).toBeGreaterThan(0);
  });
});
