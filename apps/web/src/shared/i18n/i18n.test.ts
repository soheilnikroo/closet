import { getTextDirection } from "@closet/shared";
import { describe, expect, it } from "vitest";

import { applyDocumentLocale } from "@/shared/i18n/i18n.js";

describe("applyDocumentLocale", () => {
  it("sets lang and dir on the document element", () => {
    applyDocumentLocale("fa-IR");
    expect(document.documentElement.lang).toBe("fa-IR");
    expect(document.documentElement.dir).toBe(getTextDirection("fa-IR"));

    applyDocumentLocale("en-GB");
    expect(document.documentElement.lang).toBe("en-GB");
    expect(document.documentElement.dir).toBe("ltr");
  });
});
