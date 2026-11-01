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

describe("styling service empty wardrobe", () => {
  let db: Database;
  let userId = "";
  let storageDir = "";

  beforeAll(async () => {
    db = await createTestDatabase();
    userId = (await createTestUser(db)).id;
    storageDir = await mkdtemp(path.join(tmpdir(), "closet-empty-"));
  });

  afterAll(async () => {
    if (userId) {
      await deleteTestUser(db, userId);
    }
    if (storageDir) {
      await rm(storageDir, { recursive: true, force: true });
    }
  });

  it("explains when wardrobe is empty or incomplete", async () => {
    const wardrobeService = createWardrobeService({
      db,
      storage: createLocalObjectStorage(storageDir),
      queue: createInProcessJobQueue(),
      ai: createMockAiProviders(),
    });
    const stylingService = createStylingService({
      db,
      wardrobeService,
      profileService: createProfileService(db),
      weatherService: createWeatherService({
        db,
        weatherClient: createMockWeatherClient(),
      }),
      ai: createMockAiProviders(),
    });

    const empty = await stylingService.getToday(userId);
    expect(empty.primary).toBeNull();
    expect(empty.message).toMatch(/Add a few clothing items/i);

    const categories = await wardrobeService.listCategories();
    const top = categories.find((category) => category.slot === "top");
    expect(top).toBeTruthy();
    if (!top) {
      return;
    }
    await wardrobeService.createItem(userId, {
      categoryId: top.id,
      name: "Only top",
      primaryColor: "black",
    });

    const incomplete = await stylingService.getToday(userId);
    expect(incomplete.primary).toBeNull();
    expect(incomplete.message).toMatch(/top, one bottom, and one pair of shoes/i);

    const chat = await stylingService.chat(userId, {
      message: "formal party look",
      locale: "fa-IR",
    });
    expect(chat.reply).toMatch(/لباس کافی|limited/i);
  });
});
