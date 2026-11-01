import { detectedGarmentSchema } from "@closet/shared";
import { z } from "zod";

import type { Env } from "../../shared/config/index.js";
import type { AiProviders, LlmProvider, StylistIntent, VisionProvider } from "./types.js";

const detectionsSchema = z.object({
  garments: z.array(detectedGarmentSchema),
});

const intentSchema = z.object({
  occasionSlug: z.string().nullable(),
  excludeKeywords: z.array(z.string()),
  preferredStyles: z.array(z.string()),
  notes: z.string().nullable(),
});

const openAiChatResponseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z
          .object({
            content: z.string().optional(),
          })
          .optional(),
      }),
    )
    .optional(),
});

async function openAiJson<T>(
  env: Env,
  model: string,
  messages: Array<{ role: string; content: unknown }>,
  parse: (data: unknown) => T,
): Promise<T> {
  const baseUrl = env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${text}`);
  }

  const payload = openAiChatResponseSchema.parse(await response.json());
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response missing content");
  }

  return parse(JSON.parse(content) as unknown);
}

export function createOpenAiVisionProvider(env: Env): VisionProvider {
  const model = env.OPENAI_VISION_MODEL;
  return {
    name: "openai",
    model,
    async analyzeClothing(input) {
      const base64 = Buffer.from(input.imageBytes).toString("base64");
      const dataUrl = `data:${input.mimeType};base64,${base64}`;

      const parsed = await openAiJson(
        env,
        model,
        [
          {
            role: "system",
            content:
              "You detect clothing garments in photos. Return JSON { garments: DetectedGarment[] }. Each garment needs tempId, categorySlug (t-shirt|shirt|blouse|sweater|hoodie|jeans|trousers|skirt|shorts|sneakers|boots|loafers|sandals|jacket|coat|blazer|scarf|bag|hat|belt), name, primaryColor, colors, pattern, styleTags, seasons, material, formality, fit, warmthLevel 1-5, confidence 0-1. Detect multiple garments when present.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Detect all clothing items in this image." },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        (data) => detectionsSchema.parse(data),
      );

      return parsed.garments.map((garment, index) => {
        return {
          tempId: garment.tempId || `vision-${Date.now()}-${index}`,
          categorySlug: garment.categorySlug,
          name: garment.name,
          primaryColor: garment.primaryColor,
          colors: garment.colors,
          pattern: garment.pattern,
          styleTags: garment.styleTags,
          seasons: garment.seasons,
          material: garment.material,
          formality: garment.formality,
          fit: garment.fit,
          warmthLevel: garment.warmthLevel,
          confidence: garment.confidence,
        };
      });
    },
  };
}

export function createOpenAiLlmProvider(env: Env): LlmProvider {
  const model = env.OPENAI_CHAT_MODEL;
  return {
    name: "openai",
    model,
    async parseStylistIntent(message, locale): Promise<StylistIntent> {
      return openAiJson(
        env,
        model,
        [
          {
            role: "system",
            content: `Parse fashion requests into JSON: { occasionSlug: everyday|work|university|date|wedding|birthday|party|travel|exercise|formal_event|null, excludeKeywords: string[], preferredStyles: string[], notes: string|null }. Locale hint: ${locale}.`,
          },
          { role: "user", content: message },
        ],
        (data) => intentSchema.parse(data),
      );
    },

    async explainOutfit({ itemNames, weatherSummary, occasion, locale }) {
      const result = await openAiJson(
        env,
        model,
        [
          {
            role: "system",
            content: `Write a short outfit explanation (1-2 sentences) as JSON { explanation: string }. Language: ${locale === "fa-IR" ? "Persian" : "English"}.`,
          },
          {
            role: "user",
            content: JSON.stringify({ itemNames, weatherSummary, occasion }),
          },
        ],
        (data) => z.object({ explanation: z.string().min(1) }).parse(data),
      );
      return result.explanation;
    },
  };
}

export function createOpenAiProviders(env: Env): AiProviders {
  return {
    vision: createOpenAiVisionProvider(env),
    llm: createOpenAiLlmProvider(env),
  };
}
