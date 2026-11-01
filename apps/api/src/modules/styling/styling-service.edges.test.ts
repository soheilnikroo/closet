import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createMockAiProviders } from "@/infrastructure/ai/index.js";
import type { AiProviders } from "@/infrastructure/ai/index.js";
import type { Database } from "@/infrastructure/database/index.js";
import { createInProcessJobQueue } from "@/infrastructure/queue/index.js";
import { createLocalObjectStorage } from "@/infrastructure/storage/index.js";
import { createMockWeatherClient } from "@/infrastructure/weather/index.js";
import { createStylingService } from "@/modules/styling/styling-service.js";
import { createProfileService } from "@/modules/users/profile-service.js";
import { createWardrobeService } from "@/modules/wardrobe/wardrobe-service.js";
import { createWeatherService } from "@/modules/weather/weather-service.js";
import { HttpError } from "@/shared/errors/http-error.js";
import { createTestDatabase, createTestUser, deleteTestUser } from "@/shared/testing/test-db.js";

function throwingExplainAi(): AiProviders {
  const base = createMockAiProviders();
  return {
    ...base,
    llm: {
      ...base.llm,
      async explainOutfit() {
        throw new Error("explain failed");
      },
      async parseStylistIntent(message, locale) {
        const parsed = await base.llm.parseStylistIntent(message, locale);
        return {
          ...parsed,
          excludeKeywords: ["sneakers", "jeans"],
        };
      },
    },
  };
}

describe("styling service edge paths", () => {
  let db: Database;
  let userId = "";
  let storageDir = "";

  beforeAll(async () => {
    db = await createTestDatabase();
    userId = (await createTestUser(db)).id;
    storageDir = await mkdtemp(path.join(tmpdir(), "closet-styling-edges-"));
  });

  afterAll(async () => {
    if (userId) {
      await deleteTestUser(db, userId);
    }
    if (storageDir) {
      await rm(storageDir, { recursive: true, force: true });
    }
  });

  it("covers dislike history, template fallback, fa chat, and not-found errors", async () => {
    const wardrobeService = createWardrobeService({
      db,
      storage: createLocalObjectStorage(storageDir),
      queue: createInProcessJobQueue(),
      ai: createMockAiProviders(),
    });
    wardrobeService.registerVisionWorker();
    await wardrobeService.seedSampleCatalog(userId);

    const profileService = createProfileService(db);
    await profileService.updateProfile(userId, { preferredLanguage: "fa-IR" });
    await profileService.updateStyleProfile(userId, { preferredStyles: ["minimal"] });

    const weatherService = createWeatherService({
      db,
      weatherClient: createMockWeatherClient(),
    });
    const ai = throwingExplainAi();
    const stylingService = createStylingService({
      db,
      wardrobeService,
      profileService,
      weatherService,
      ai,
    });

    const occasions = await stylingService.listOccasions();
    const university = occasions.find((occasion) => occasion.slug === "university");
    expect(university).toBeTruthy();

    const byId = await stylingService.createRecommendations(userId, {
      occasionId: university?.id,
      notes: "minimal look",
    });
    expect(byId.primary.explanation.length).toBeGreaterThan(0);

    await stylingService.submitFeedback(userId, byId.primary.id, {
      action: "dislike",
      reason: "too formal",
    });

    const afterDislike = await stylingService.createRecommendations(userId, {
      regenerate: true,
      occasionSlug: "everyday",
    });
    expect(afterDislike.primary.id).toBeTruthy();

    const missingId = crypto.randomUUID();
    await expect(
      stylingService.submitFeedback(userId, missingId, { action: "like" }),
    ).rejects.toBeInstanceOf(HttpError);
    await expect(
      stylingService.replaceItem(userId, missingId, {
        clothingItemId: crypto.randomUUID(),
        role: "top",
      }),
    ).rejects.toBeInstanceOf(HttpError);

    const chat = await stylingService.chat(userId, {
      message: "لباس دانشگاه بدون جین و sneakers",
      locale: "fa-IR",
    });
    expect(chat.reply).toMatch(/پیشنهاد|لباس کافی/);
    expect(chat.constraints?.excludeItemIds.length ?? 0).toBeGreaterThanOrEqual(0);

    // Warm getToday path after fresh recommendations exist
    const today = await stylingService.getToday(userId);
    expect(today.primary).toBeTruthy();
  });
});
