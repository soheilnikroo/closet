import type { DetectedGarment } from "@closet/shared";

export type VisionAnalyzeInput = {
  imageBytes: Uint8Array;
  mimeType: string;
};

export type VisionProvider = {
  name: string;
  model: string;
  analyzeClothing: (input: VisionAnalyzeInput) => Promise<DetectedGarment[]>;
};

export type StylistIntent = {
  occasionSlug: string | null;
  excludeKeywords: string[];
  preferredStyles: string[];
  notes: string | null;
};

export type LlmProvider = {
  name: string;
  model: string;
  parseStylistIntent: (message: string, locale: "en-GB" | "fa-IR") => Promise<StylistIntent>;
  explainOutfit: (input: {
    itemNames: string[];
    weatherSummary: string | null;
    occasion: string | null;
    locale: "en-GB" | "fa-IR";
  }) => Promise<string>;
};

export type AiProviders = {
  vision: VisionProvider;
  llm: LlmProvider;
};
