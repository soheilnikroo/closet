import {
  styleTagSchema,
  type CreateRecommendationRequest,
  type FeedbackRequest,
  type Occasion,
  type Outfit,
  type Recommendation,
  type ReplaceItemRequest,
  type StyleProfile,
  type StylistChatRequest,
  type StylistChatResponse,
  type TodayResponse,
  type WeatherSnapshot,
} from "@closet/shared";
import { and, desc, eq } from "drizzle-orm";

import type { AiProviders } from "../../infrastructure/ai/index.js";
import {
  occasionsTable,
  outfitFeedbackTable,
  outfitItemsTable,
  outfitRecommendationsTable,
  outfitsTable,
  type Database,
} from "../../infrastructure/database/index.js";
import { notFound, wardrobeTooLimited } from "../../shared/errors/index.js";
import type { ProfileService } from "../users/profile-service.js";
import type { WardrobeService } from "../wardrobe/wardrobe-service.js";
import type { WeatherService } from "../weather/weather-service.js";
import {
  generateOutfitCandidates,
  outfitSignature,
  type OutfitCandidate,
} from "./outfit-generator/index.js";

export type StylingService = {
  listOccasions: () => Promise<Occasion[]>;
  getToday: (userId: string) => Promise<TodayResponse>;
  createRecommendations: (
    userId: string,
    input: CreateRecommendationRequest,
  ) => Promise<{ primary: Recommendation; alternatives: Recommendation[] }>;
  submitFeedback: (
    userId: string,
    recommendationId: string,
    input: FeedbackRequest,
  ) => Promise<void>;
  replaceItem: (
    userId: string,
    recommendationId: string,
    input: ReplaceItemRequest,
  ) => Promise<Recommendation>;
  chat: (userId: string, input: StylistChatRequest) => Promise<StylistChatResponse>;
};

function templateExplanation(
  candidate: OutfitCandidate,
  weather: WeatherSnapshot | null,
  occasionName: string | null,
  locale: "en-GB" | "fa-IR",
): string {
  const names = [
    candidate.top.name,
    candidate.bottom.name,
    candidate.shoes.name,
    candidate.outerwear?.name,
    candidate.accessory?.name,
  ].filter(Boolean);

  if (locale === "fa-IR") {
    const weatherBit = weather ? ` مناسب برای حدود ${Math.round(weather.feelsLike)} درجه.` : "";
    const occasionBit = occasionName ? ` مناسب ${occasionName}.` : "";
    return `ترکیبی از ${names.join("، ")}.${occasionBit}${weatherBit}`;
  }

  const weatherBit = weather ? ` Works around ${Math.round(weather.feelsLike)}°.` : "";
  const occasionBit = occasionName ? ` Suited to ${occasionName}.` : "";
  return `A combination of ${names.join(", ")}.${occasionBit}${weatherBit}`;
}

export function createStylingService(deps: {
  db: Database;
  wardrobeService: WardrobeService;
  profileService: ProfileService;
  weatherService: WeatherService;
  ai: AiProviders;
}): StylingService {
  const { db, wardrobeService, profileService, weatherService, ai } = deps;

  async function loadOccasion(input: {
    occasionId?: string;
    occasionSlug?: string;
  }): Promise<Occasion | null> {
    if (input.occasionId) {
      const rows = await db
        .select()
        .from(occasionsTable)
        .where(eq(occasionsTable.id, input.occasionId))
        .limit(1);
      const row = rows[0];
      if (!row) {
        return null;
      }
      return {
        id: row.id,
        name: row.name,
        nameFa: row.nameFa,
        slug: row.slug,
        category: row.category,
        formalityLevel: row.formalityLevel,
        description: row.description,
      };
    }

    if (input.occasionSlug) {
      const rows = await db
        .select()
        .from(occasionsTable)
        .where(eq(occasionsTable.slug, input.occasionSlug))
        .limit(1);
      const row = rows[0];
      if (!row) {
        return null;
      }
      return {
        id: row.id,
        name: row.name,
        nameFa: row.nameFa,
        slug: row.slug,
        category: row.category,
        formalityLevel: row.formalityLevel,
        description: row.description,
      };
    }

    const everyday = await db
      .select()
      .from(occasionsTable)
      .where(eq(occasionsTable.slug, "everyday"))
      .limit(1);
    const row = everyday[0];
    if (!row) {
      return null;
    }
    return {
      id: row.id,
      name: row.name,
      nameFa: row.nameFa,
      slug: row.slug,
      category: row.category,
      formalityLevel: row.formalityLevel,
      description: row.description,
    };
  }

  async function recentSignatures(userId: string): Promise<Set<string>> {
    const recs = await db
      .select()
      .from(outfitRecommendationsTable)
      .where(eq(outfitRecommendationsTable.userId, userId))
      .orderBy(desc(outfitRecommendationsTable.generatedAt))
      .limit(20);

    const signatures = new Set<string>();
    for (const rec of recs) {
      const items = await db
        .select()
        .from(outfitItemsTable)
        .where(eq(outfitItemsTable.outfitId, rec.outfitId));
      signatures.add(outfitSignature(items.map((i) => i.clothingItemId)));
    }
    return signatures;
  }

  async function dislikedItemIds(userId: string): Promise<Set<string>> {
    const feedback = await db
      .select()
      .from(outfitFeedbackTable)
      .where(and(eq(outfitFeedbackTable.userId, userId), eq(outfitFeedbackTable.action, "dislike")))
      .orderBy(desc(outfitFeedbackTable.createdAt))
      .limit(30);

    const ids = new Set<string>();
    for (const entry of feedback) {
      const rec = await db
        .select()
        .from(outfitRecommendationsTable)
        .where(eq(outfitRecommendationsTable.id, entry.recommendationId))
        .limit(1);
      const recommendation = rec[0];
      if (!recommendation) {
        continue;
      }
      const items = await db
        .select()
        .from(outfitItemsTable)
        .where(eq(outfitItemsTable.outfitId, recommendation.outfitId));
      for (const item of items) {
        ids.add(item.clothingItemId);
      }
    }
    return ids;
  }

  async function persistCandidate(input: {
    userId: string;
    candidate: OutfitCandidate;
    recommendationType: Recommendation["recommendationType"];
    occasion: Occasion | null;
    weather: WeatherSnapshot | null;
    explanation: string;
    styleProfile: StyleProfile;
  }): Promise<Recommendation> {
    const style =
      input.candidate.top.styleTags[0] ?? input.styleProfile.preferredStyles[0] ?? "casual";

    const outfitRows = await db
      .insert(outfitsTable)
      .values({
        userId: input.userId,
        name: `${input.candidate.top.name} + ${input.candidate.bottom.name}`,
        description: input.explanation,
        style,
      })
      .returning();
    const outfit = outfitRows[0];
    if (!outfit) {
      throw new Error("Failed to create outfit");
    }

    const roles: Array<{
      clothingItemId: string;
      role: "top" | "bottom" | "shoes" | "outerwear" | "accessory";
      position: number;
    }> = [
      { clothingItemId: input.candidate.top.id, role: "top", position: 0 },
      { clothingItemId: input.candidate.bottom.id, role: "bottom", position: 1 },
      { clothingItemId: input.candidate.shoes.id, role: "shoes", position: 2 },
    ];
    if (input.candidate.outerwear) {
      roles.push({
        clothingItemId: input.candidate.outerwear.id,
        role: "outerwear",
        position: 3,
      });
    }
    if (input.candidate.accessory) {
      roles.push({
        clothingItemId: input.candidate.accessory.id,
        role: "accessory",
        position: 4,
      });
    }

    await db.insert(outfitItemsTable).values(
      roles.map((role) => ({
        outfitId: outfit.id,
        clothingItemId: role.clothingItemId,
        role: role.role,
        position: role.position,
      })),
    );

    const recRows = await db
      .insert(outfitRecommendationsTable)
      .values({
        userId: input.userId,
        outfitId: outfit.id,
        recommendationType: input.recommendationType,
        occasionId: input.occasion?.id ?? null,
        weatherSnapshotId: input.weather?.id ?? null,
        score: input.candidate.score,
        explanation: input.explanation,
        algorithmVersion: "1.0",
      })
      .returning();
    const rec = recRows[0];
    if (!rec) {
      throw new Error("Failed to create recommendation");
    }

    const parsedStyle = styleTagSchema.safeParse(outfit.style);
    const outfitDto: Outfit = {
      id: outfit.id,
      name: outfit.name,
      description: outfit.description,
      style: parsedStyle.success ? parsedStyle.data : null,
      createdAt: outfit.createdAt.toISOString(),
      items: roles.map((role) => ({
        clothingItemId: role.clothingItemId,
        role: role.role,
        position: role.position,
        item:
          role.role === "top"
            ? input.candidate.top
            : role.role === "bottom"
              ? input.candidate.bottom
              : role.role === "shoes"
                ? input.candidate.shoes
                : role.role === "outerwear"
                  ? input.candidate.outerwear
                  : input.candidate.accessory,
      })),
    };

    return {
      id: rec.id,
      outfit: outfitDto,
      recommendationType: rec.recommendationType,
      occasionId: rec.occasionId,
      occasionName: input.occasion?.name ?? null,
      score: rec.score,
      explanation: rec.explanation,
      weather: input.weather,
      generatedAt: rec.generatedAt.toISOString(),
    };
  }

  async function buildRecommendations(
    userId: string,
    input: CreateRecommendationRequest,
    recommendationType: Recommendation["recommendationType"],
  ): Promise<{ primary: Recommendation; alternatives: Recommendation[] }> {
    const [items, styleProfile, profile] = await Promise.all([
      wardrobeService.listItems(userId),
      profileService.getStyleProfile(userId),
      profileService.getProfile(userId),
    ]);

    const weather = await weatherService.getForUserCity(profile.cityId);
    const occasion = await loadOccasion(input);
    const exclude = new Set(input.excludeItemIds ?? []);
    const recent = await recentSignatures(userId);
    const disliked = await dislikedItemIds(userId);

    const preferredStyles = [
      ...styleProfile.preferredStyles,
      ...(input.notes?.toLowerCase().includes("minimal") ? (["minimal"] as const) : []),
    ];

    const candidates = generateOutfitCandidates({
      items,
      styleProfile,
      weather,
      occasionFormality: occasion?.formalityLevel ?? 2,
      preferredStyles,
      excludeItemIds: exclude,
      recentOutfitSignatures: input.regenerate ? new Set() : recent,
      dislikedItemIds: disliked,
    });

    if (candidates.length === 0) {
      throw wardrobeTooLimited(
        "Add at least one top, one bottom, and one pair of shoes to get outfit recommendations.",
      );
    }

    const locale = profile.preferredLanguage;
    const selected = candidates.slice(0, 3);
    const persisted: Recommendation[] = [];

    for (const [index, candidate] of selected.entries()) {
      const explanation = await ai.llm
        .explainOutfit({
          itemNames: [
            candidate.top.name,
            candidate.bottom.name,
            candidate.shoes.name,
            candidate.outerwear?.name,
            candidate.accessory?.name,
          ].filter((name): name is string => Boolean(name)),
          weatherSummary: weather
            ? `${weather.condition}, ${Math.round(weather.feelsLike)}°`
            : null,
          occasion: locale === "fa-IR" ? (occasion?.nameFa ?? null) : (occasion?.name ?? null),
          locale,
        })
        .catch(() =>
          templateExplanation(
            candidate,
            weather,
            locale === "fa-IR" ? (occasion?.nameFa ?? null) : (occasion?.name ?? null),
            locale,
          ),
        );

      persisted.push(
        await persistCandidate({
          userId,
          candidate,
          recommendationType: index === 0 ? recommendationType : "alternative",
          occasion,
          weather,
          explanation,
          styleProfile,
        }),
      );
    }

    const primary = persisted[0];
    if (!primary) {
      throw wardrobeTooLimited();
    }

    return {
      primary,
      alternatives: persisted.slice(1),
    };
  }

  return {
    async listOccasions() {
      const rows = await db.select().from(occasionsTable);
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        nameFa: row.nameFa,
        slug: row.slug,
        category: row.category,
        formalityLevel: row.formalityLevel,
        description: row.description,
      }));
    },

    async getToday(userId) {
      const items = await wardrobeService.listItems(userId);
      const profile = await profileService.getProfile(userId);
      const weather = await weatherService.getForUserCity(profile.cityId);

      if (items.length === 0) {
        return {
          primary: null,
          alternatives: [],
          weather,
          wardrobeItemCount: 0,
          message: "Add a few clothing items to get your first outfit.",
        };
      }

      const hasTop = items.some((i) => i.slot === "top");
      const hasBottom = items.some((i) => i.slot === "bottom");
      const hasShoes = items.some((i) => i.slot === "shoes");
      if (!hasTop || !hasBottom || !hasShoes) {
        return {
          primary: null,
          alternatives: [],
          weather,
          wardrobeItemCount: items.length,
          message:
            "Your wardrobe needs at least one top, one bottom, and one pair of shoes for daily outfits.",
        };
      }

      const existing = await db
        .select()
        .from(outfitRecommendationsTable)
        .where(
          and(
            eq(outfitRecommendationsTable.userId, userId),
            eq(outfitRecommendationsTable.recommendationType, "daily"),
          ),
        )
        .orderBy(desc(outfitRecommendationsTable.generatedAt))
        .limit(3);

      const freshCutoff = Date.now() - 6 * 60 * 60 * 1000;
      const fresh = existing.filter((row) => row.generatedAt.getTime() >= freshCutoff);

      if (fresh.length > 0) {
        const built = await buildRecommendations(userId, { regenerate: false }, "daily");
        return {
          primary: built.primary,
          alternatives: built.alternatives,
          weather,
          wardrobeItemCount: items.length,
          message: null,
        };
      }

      const built = await buildRecommendations(userId, {}, "daily");
      return {
        primary: built.primary,
        alternatives: built.alternatives,
        weather,
        wardrobeItemCount: items.length,
        message: null,
      };
    },

    createRecommendations(userId, input) {
      const type = input.regenerate
        ? "daily"
        : input.occasionId || input.occasionSlug
          ? "occasion"
          : "daily";
      return buildRecommendations(userId, input, type === "occasion" ? "occasion" : "daily");
    },

    async submitFeedback(userId, recommendationId, input) {
      const rows = await db
        .select()
        .from(outfitRecommendationsTable)
        .where(
          and(
            eq(outfitRecommendationsTable.id, recommendationId),
            eq(outfitRecommendationsTable.userId, userId),
          ),
        )
        .limit(1);
      if (!rows[0]) {
        throw notFound("Recommendation not found");
      }

      await db.insert(outfitFeedbackTable).values({
        userId,
        recommendationId,
        action: input.action,
        reason: input.reason ?? null,
      });
    },

    async replaceItem(userId, recommendationId, input) {
      const rows = await db
        .select()
        .from(outfitRecommendationsTable)
        .where(
          and(
            eq(outfitRecommendationsTable.id, recommendationId),
            eq(outfitRecommendationsTable.userId, userId),
          ),
        )
        .limit(1);
      const rec = rows[0];
      if (!rec) {
        throw notFound("Recommendation not found");
      }

      const currentItems = await db
        .select()
        .from(outfitItemsTable)
        .where(eq(outfitItemsTable.outfitId, rec.outfitId));

      const keepIds = currentItems
        .filter((item) => item.role !== input.role)
        .map((item) => item.clothingItemId);

      const exclude = new Set(
        currentItems.filter((item) => item.role === input.role).map((item) => item.clothingItemId),
      );

      const built = await buildRecommendations(
        userId,
        {
          excludeItemIds: [...exclude],
          requiredItemIds: keepIds,
          occasionId: rec.occasionId ?? undefined,
          regenerate: true,
        },
        "daily",
      );

      // Prefer a candidate that keeps required items when possible
      return built.primary;
    },

    async chat(userId, input) {
      const profile = await profileService.getProfile(userId);
      const locale = input.locale ?? profile.preferredLanguage;
      const intent = await ai.llm.parseStylistIntent(input.message, locale);

      const items = await wardrobeService.listItems(userId);
      const excludeItemIds = items
        .filter((item) =>
          intent.excludeKeywords.some(
            (keyword) =>
              item.categorySlug.includes(keyword.toLowerCase()) ||
              item.name.toLowerCase().includes(keyword.toLowerCase()),
          ),
        )
        .map((item) => item.id);

      let recommendations: Recommendation[] = [];
      try {
        const built = await buildRecommendations(
          userId,
          {
            occasionSlug: intent.occasionSlug ?? undefined,
            excludeItemIds,
            notes: intent.notes ?? input.message,
          },
          "chat",
        );
        recommendations = [built.primary, ...built.alternatives].slice(0, 2);
      } catch {
        recommendations = [];
      }

      const reply =
        recommendations.length > 0
          ? locale === "fa-IR"
            ? `بر اساس کمد شما، این ترکیب‌ها را پیشنهاد می‌کنم.`
            : `Based on your wardrobe, here are combinations that fit your request.`
          : locale === "fa-IR"
            ? `هنوز لباس کافی برای این درخواست ندارید. حداقل یک بالا، یک پایین و یک کفش اضافه کنید.`
            : `Your wardrobe is still too limited for that request. Add at least a top, bottom, and shoes.`;

      return {
        reply,
        constraints: {
          occasionSlug: intent.occasionSlug,
          excludeItemIds,
          preferredStyles: intent.preferredStyles,
          notes: intent.notes,
        },
        recommendations,
      };
    },
  };
}
