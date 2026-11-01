import { describe, expect, it } from "vitest";

import { createMockAiProviders } from "@/infrastructure/ai/mock-providers.js";

describe("createMockAiProviders", () => {
  const providers = createMockAiProviders();

  it("detects multiple garments", async () => {
    const detections = await providers.vision.analyzeClothing({
      imageBytes: new Uint8Array([1, 2, 3]),
      mimeType: "image/jpeg",
    });

    expect(detections.length).toBeGreaterThanOrEqual(3);
    expect(detections[0]?.categorySlug).toBeTruthy();
  });

  it("parses stylist intent in English and Persian", async () => {
    const en = await providers.llm.parseStylistIntent(
      "I need a minimal outfit for university without jeans",
      "en-GB",
    );
    expect(en.occasionSlug).toBe("university");
    expect(en.preferredStyles).toContain("minimal");
    expect(en.excludeKeywords).toContain("jeans");

    const fa = await providers.llm.parseStylistIntent("لباس رسمی برای کار", "fa-IR");
    expect(fa.occasionSlug).toBe("work");
  });

  it("explains outfits in both locales", async () => {
    const en = await providers.llm.explainOutfit({
      itemNames: ["Shirt", "Trousers"],
      weatherSummary: "22°",
      occasion: "Work",
      locale: "en-GB",
    });
    expect(en.toLowerCase()).toContain("shirt");

    const fa = await providers.llm.explainOutfit({
      itemNames: ["پیراهن", "شلوار"],
      weatherSummary: "۲۲ درجه",
      occasion: "کار",
      locale: "fa-IR",
    });
    expect(fa).toContain("پیراهن");
  });
});
