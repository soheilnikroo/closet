import { describe, expect, it } from "vitest";

import { confirmMediaRequestSchema, mediaAssetSchema } from "@/contracts/wardrobe/media.js";

describe("media contracts", () => {
  it("accepts media assets and confirm payloads", () => {
    expect(
      mediaAssetSchema.safeParse({
        id: "00000000-0000-4000-8000-000000000001",
        processingStatus: "ready",
        mimeType: "image/jpeg",
        sizeBytes: 12,
        contentUrl: "/v1/wardrobe/media/x/content",
        detections: [
          {
            tempId: "t1",
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
            confidence: 0.8,
          },
        ],
        error: null,
        createdAt: "2026-11-01T10:00:00.000Z",
      }).success,
    ).toBe(true);

    expect(
      confirmMediaRequestSchema.safeParse({
        garments: [
          {
            tempId: "t1",
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
            confidence: 0.8,
            accepted: true,
          },
        ],
      }).success,
    ).toBe(true);
  });
});
