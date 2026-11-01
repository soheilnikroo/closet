import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createMockAiProviders } from "@/infrastructure/ai/index.js";
import type { Database } from "@/infrastructure/database/index.js";
import { createInProcessJobQueue } from "@/infrastructure/queue/index.js";
import { createLocalObjectStorage } from "@/infrastructure/storage/index.js";
import { createMockWeatherClient } from "@/infrastructure/weather/index.js";
import { createStylingService } from "@/modules/styling/styling-service.js";
import { createProfileService } from "@/modules/users/profile-service.js";
import { createWardrobeService } from "@/modules/wardrobe/wardrobe-service.js";
import { createWeatherService } from "@/modules/weather/weather-service.js";
import { createTestDatabase, createTestUser, deleteTestUser } from "@/shared/testing/test-db.js";

describe("createStylingService", () => {
  let db: Database;
  let userId = "";
  let storageDir = "";

  beforeAll(async () => {
    db = await createTestDatabase();
    const user = await createTestUser(db);
    userId = user.id;
    storageDir = await mkdtemp(path.join(tmpdir(), "closet-styling-"));
  });

  afterAll(async () => {
    if (userId) {
      await deleteTestUser(db, userId);
    }
    if (storageDir) {
      await rm(storageDir, { recursive: true, force: true });
    }
  });

  it("generates today outfits, accepts feedback, and answers chat", async () => {
    const queue = createInProcessJobQueue();
    const wardrobeService = createWardrobeService({
      db,
      storage: createLocalObjectStorage(storageDir),
      queue,
      ai: createMockAiProviders(),
    });
    wardrobeService.registerVisionWorker();
    await wardrobeService.seedSampleCatalog(userId);

    const profileService = createProfileService(db);
    const cities = await profileService.listCities();
    const tehran = cities.find((city) => city.name === "Tehran");
    await profileService.updateProfile(userId, { cityId: tehran?.id ?? null });
    await profileService.updateStyleProfile(userId, { preferredStyles: ["casual", "minimal"] });

    const weatherService = createWeatherService({
      db,
      weatherClient: createMockWeatherClient(),
    });
    const stylingService = createStylingService({
      db,
      wardrobeService,
      profileService,
      weatherService,
      ai: createMockAiProviders(),
    });

    const occasions = await stylingService.listOccasions();
    expect(occasions.some((occasion) => occasion.slug === "everyday")).toBe(true);

    const today = await stylingService.getToday(userId);
    expect(today.primary).toBeTruthy();
    expect(today.alternatives.length).toBeGreaterThanOrEqual(1);
    expect(today.weather?.cityName).toBe("Tehran");

    const primary = today.primary;
    if (!primary) {
      throw new Error("expected primary recommendation");
    }

    await stylingService.submitFeedback(userId, primary.id, { action: "like" });

    const regenerated = await stylingService.createRecommendations(userId, {
      regenerate: true,
      occasionSlug: "university",
    });
    expect(regenerated.primary.explanation.length).toBeGreaterThan(0);

    const topItemId =
      regenerated.primary.outfit.items.find((entry) => entry.role === "top")?.clothingItemId ??
      primary.outfit.items.find((entry) => entry.role === "top")?.clothingItemId;
    expect(topItemId).toBeTruthy();
    if (!topItemId) {
      return;
    }

    const replaced = await stylingService.replaceItem(userId, regenerated.primary.id, {
      clothingItemId: topItemId,
      role: "top",
    });
    expect(replaced.id).toBeTruthy();

    const chat = await stylingService.chat(userId, {
      message: "What should I wear to university?",
      locale: "en-GB",
    });
    expect(chat.reply.length).toBeGreaterThan(0);
    expect(chat.recommendations.length).toBeGreaterThan(0);
  });
});
