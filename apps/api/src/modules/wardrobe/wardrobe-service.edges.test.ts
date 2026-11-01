import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createMockAiProviders } from "../../infrastructure/ai/index.js";
import type { AiProviders } from "../../infrastructure/ai/index.js";
import type { Database } from "../../infrastructure/database/index.js";
import { createInProcessJobQueue } from "../../infrastructure/queue/index.js";
import { createLocalObjectStorage } from "../../infrastructure/storage/index.js";
import { HttpError } from "../../shared/errors/http-error.js";
import {
  createTestDatabase,
  createTestUser,
  deleteTestUser,
} from "../../shared/testing/test-db.js";
import { createWardrobeService } from "./wardrobe-service.js";

function failingVisionProviders(): AiProviders {
  const base = createMockAiProviders();
  return {
    ...base,
    vision: {
      ...base.vision,
      async analyzeClothing() {
        throw new Error("vision boom");
      },
    },
  };
}

describe("wardrobe service edge paths", () => {
  let db: Database;
  let userId = "";
  let storageDir = "";

  beforeAll(async () => {
    db = await createTestDatabase();
    userId = (await createTestUser(db)).id;
    storageDir = await mkdtemp(path.join(tmpdir(), "closet-wardrobe-edges-"));
  });

  afterAll(async () => {
    if (userId) {
      await deleteTestUser(db, userId);
    }
    if (storageDir) {
      await rm(storageDir, { recursive: true, force: true });
    }
  });

  it("filters by season and style, creates items, and rejects invalid lookups", async () => {
    const service = createWardrobeService({
      db,
      storage: createLocalObjectStorage(storageDir),
      queue: createInProcessJobQueue(),
      ai: createMockAiProviders(),
    });

    const seeded = await service.seedSampleCatalog(userId);
    expect(seeded.length).toBeGreaterThan(0);
    const seededAgain = await service.seedSampleCatalog(userId);
    expect(seededAgain.length).toBe(seeded.length);

    const winter = await service.listItems(userId, { season: "winter" });
    expect(winter.length).toBeGreaterThan(0);

    const casual = await service.listItems(userId, { style: "casual" });
    expect(casual.length).toBeGreaterThan(0);

    const first = seeded[0];
    expect(first).toBeTruthy();
    if (!first) {
      return;
    }
    const item = await service.getItem(userId, first.id);
    expect(item.id).toBe(first.id);

    await expect(service.getItem(userId, crypto.randomUUID())).rejects.toBeInstanceOf(HttpError);
    await expect(service.getMedia(userId, crypto.randomUUID())).rejects.toBeInstanceOf(HttpError);
    await expect(service.getMediaContent(userId, crypto.randomUUID())).rejects.toBeInstanceOf(
      HttpError,
    );

    const categories = await service.listCategories();
    const bottom = categories.find((category) => category.slot === "bottom");
    expect(bottom).toBeTruthy();
    if (!bottom) {
      return;
    }

    const created = await service.createItem(userId, {
      categoryId: bottom.id,
      name: "Manual chinos",
      primaryColor: "beige",
      colors: ["beige", "tan"],
      styleTags: ["casual"],
      seasons: ["spring", "autumn"],
    });
    expect(created.name).toBe("Manual chinos");

    await expect(
      service.createItem(userId, {
        categoryId: crypto.randomUUID(),
        name: "Bad",
        primaryColor: "red",
      }),
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("handles vision failure, rejected garments, and empty worker payloads", async () => {
    const queue = createInProcessJobQueue();
    const service = createWardrobeService({
      db,
      storage: createLocalObjectStorage(storageDir),
      queue,
      ai: failingVisionProviders(),
    });
    service.registerVisionWorker();
    await queue.enqueue("clothing_vision", {});

    const media = await service.uploadMedia(userId, {
      bytes: new Uint8Array([1, 2, 3]),
      mimeType: "image/png",
      filename: "fail.png",
    });
    const analyzed = await service.analyzeMedia(userId, media.id);
    expect(analyzed.processingStatus).toBe("failed");

    await expect(
      service.confirmMedia(userId, media.id, {
        garments: [],
      }),
    ).rejects.toMatchObject({ code: "media_processing_failed" });

    const pendingQueue = createInProcessJobQueue();
    pendingQueue.register("clothing_vision", async () => {
      // Intentionally leave media pending
    });
    const pendingService = createWardrobeService({
      db,
      storage: createLocalObjectStorage(storageDir),
      queue: pendingQueue,
      ai: createMockAiProviders(),
    });
    const pending = await pendingService.uploadMedia(userId, {
      bytes: new Uint8Array([4, 5]),
      mimeType: "image/webp",
      filename: "pending.webp",
    });
    expect(pending.processingStatus).toBe("pending");
    await expect(
      pendingService.confirmMedia(userId, pending.id, { garments: [] }),
    ).rejects.toMatchObject({ code: "media_not_ready" });

    const okQueue = createInProcessJobQueue();
    const okService = createWardrobeService({
      db,
      storage: createLocalObjectStorage(storageDir),
      queue: okQueue,
      ai: createMockAiProviders(),
    });
    okService.registerVisionWorker();
    const okMedia = await okService.uploadMedia(userId, {
      bytes: new Uint8Array([7, 8, 9]),
      mimeType: "image/jpeg",
      filename: "ok.jpg",
    });
    const ready = await okService.analyzeMedia(userId, okMedia.id);
    expect(ready.processingStatus).toBe("ready");
    const rejected = await okService.confirmMedia(userId, okMedia.id, {
      garments: ready.detections.map((garment) => ({ ...garment, accepted: false })),
    });
    expect(rejected).toEqual([]);
  });
});
