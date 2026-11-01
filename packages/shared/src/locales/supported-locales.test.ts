import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  getTextDirection,
  isSupportedLocale,
  supportedLocales,
} from "@/locales/supported-locales.js";

describe("supported locales", () => {
  it("includes en-GB and fa-IR", () => {
    expect(supportedLocales).toEqual(["en-GB", "fa-IR"]);
    expect(defaultLocale).toBe("en-GB");
  });

  it("validates locale strings", () => {
    expect(isSupportedLocale("en-GB")).toBe(true);
    expect(isSupportedLocale("fa-IR")).toBe(true);
    expect(isSupportedLocale("en-US")).toBe(false);
  });

  it("returns rtl for fa-IR and ltr otherwise", () => {
    expect(getTextDirection("fa-IR")).toBe("rtl");
    expect(getTextDirection("en-GB")).toBe("ltr");
  });
});
