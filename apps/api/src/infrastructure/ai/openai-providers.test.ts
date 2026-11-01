import { afterEach, describe, expect, it, vi } from "vitest";

import type { Env } from "../../shared/config/index.js";
import { createOpenAiProviders } from "./openai-providers.js";

describe("openai providers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("analyzes clothing and explains outfits", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    garments: [
                      {
                        tempId: "g1",
                        categorySlug: "shirt",
                        name: "Shirt",
                        primaryColor: "white",
                        colors: ["white"],
                        pattern: "solid",
                        styleTags: ["casual"],
                        seasons: ["all_season"],
                        material: null,
                        formality: "casual",
                        fit: "regular",
                        warmthLevel: 2,
                        confidence: 0.9,
                      },
                    ],
                  }),
                },
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    occasionSlug: "work",
                    excludeKeywords: [],
                    preferredStyles: ["minimal"],
                    notes: "office",
                  }),
                },
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({ explanation: "A sharp look." }),
                },
              },
            ],
          }),
        }),
    );

    const providers = createOpenAiProviders({
      OPENAI_API_KEY: "sk-test-12345678",
      OPENAI_VISION_MODEL: "gpt-4o-mini",
      OPENAI_CHAT_MODEL: "gpt-4o-mini",
    } as Env);

    const garments = await providers.vision.analyzeClothing({
      imageBytes: new Uint8Array([1, 2, 3]),
      mimeType: "image/jpeg",
    });
    expect(garments[0]?.name).toBe("Shirt");

    const intent = await providers.llm.parseStylistIntent("office look", "en-GB");
    expect(intent.occasionSlug).toBe("work");

    const explanation = await providers.llm.explainOutfit({
      itemNames: ["Shirt"],
      weatherSummary: null,
      occasion: "Work",
      locale: "en-GB",
    });
    expect(explanation).toContain("sharp");
  });
});
