import type { DetectedGarment } from "@closet/shared";

import type { AiProviders, LlmProvider, VisionProvider } from "@/infrastructure/ai/types.js";

const MOCK_DETECTIONS: DetectedGarment[] = [
  {
    tempId: "mock-top-1",
    categorySlug: "shirt",
    name: "White oversized shirt",
    primaryColor: "white",
    colors: ["white"],
    pattern: "solid",
    styleTags: ["smart_casual", "minimal"],
    seasons: ["spring", "summer", "autumn"],
    material: "cotton",
    formality: "smart_casual",
    fit: "oversized",
    warmthLevel: 2,
    confidence: 0.82,
  },
  {
    tempId: "mock-bottom-1",
    categorySlug: "trousers",
    name: "Black straight-leg trousers",
    primaryColor: "black",
    colors: ["black"],
    pattern: "solid",
    styleTags: ["classic", "smart_casual"],
    seasons: ["all_season"],
    material: "cotton",
    formality: "smart_casual",
    fit: "regular",
    warmthLevel: 2,
    confidence: 0.79,
  },
  {
    tempId: "mock-shoes-1",
    categorySlug: "sneakers",
    name: "White sneakers",
    primaryColor: "white",
    colors: ["white"],
    pattern: "solid",
    styleTags: ["casual", "sporty"],
    seasons: ["all_season"],
    material: "leather",
    formality: "casual",
    fit: "regular",
    warmthLevel: 1,
    confidence: 0.88,
  },
];

export function createMockVisionProvider(): VisionProvider {
  return {
    name: "mock",
    model: "mock-vision-v1",
    async analyzeClothing() {
      return MOCK_DETECTIONS.map((item, index) => ({
        ...item,
        tempId: `mock-${Date.now()}-${index}`,
      }));
    },
  };
}

export function createMockLlmProvider(): LlmProvider {
  return {
    name: "mock",
    model: "mock-llm-v1",
    async parseStylistIntent(message, _locale) {
      const lower = message.toLowerCase();
      const occasionSlug =
        lower.includes("university") || lower.includes("دانشگاه")
          ? "university"
          : lower.includes("work") || lower.includes("کار")
            ? "work"
            : lower.includes("party") || lower.includes("مهمانی")
              ? "party"
              : lower.includes("formal") || lower.includes("رسمی")
                ? "formal_event"
                : null;

      const preferredStyles: string[] = [];
      if (lower.includes("minimal") || lower.includes("مینیمال")) {
        preferredStyles.push("minimal");
      }
      if (lower.includes("casual") || lower.includes("کژوال")) {
        preferredStyles.push("casual");
      }
      if (lower.includes("formal") || lower.includes("رسمی")) {
        preferredStyles.push("formal");
      }

      const excludeKeywords: string[] = [];
      if (lower.includes("jeans") || lower.includes("جین")) {
        excludeKeywords.push("jeans");
      }

      return {
        occasionSlug,
        excludeKeywords,
        preferredStyles,
        notes: message.slice(0, 200),
      };
    },

    async explainOutfit({ itemNames, weatherSummary, occasion, locale }) {
      const items = itemNames.join(locale === "fa-IR" ? "، " : ", ");
      if (locale === "fa-IR") {
        const weather = weatherSummary ? ` مناسب برای ${weatherSummary}.` : "";
        const occ = occasion ? ` برای ${occasion}.` : "";
        return `ترکیب متعادلی از ${items}.${occ}${weather} رنگ‌ها و استایل‌ها با هم هماهنگ هستند.`;
      }

      const weather = weatherSummary ? ` Works for ${weatherSummary}.` : "";
      const occ = occasion ? ` Suited to ${occasion}.` : "";
      return `A balanced combination of ${items}.${occ}${weather} The colours and styles work well together.`;
    },
  };
}

export function createMockAiProviders(): AiProviders {
  return {
    vision: createMockVisionProvider(),
    llm: createMockLlmProvider(),
  };
}
