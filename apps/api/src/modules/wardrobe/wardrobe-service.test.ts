import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createMockAiProviders } from "../../infrastructure/ai/index.js";
import type { Database } from "../../infrastructure/database/index.js";
import { createInProcessJobQueue } from "../../infrastructure/queue/index.js";
import { createLocalObjectStorage } from "../../infrastructure/storage/index.js";
import {
  createTestDatabase,
  createTestUser,
  deleteTestUser,
} from "../../shared/testing/test-db.js";
import { createWardrobeService } from "./wardrobe-service.js";

describe("createWardrobeService", () => {
  let db: Database;
  let userId = "";
  let storageDir = "";

  beforeAll(async () => {
    db = await createTestDatabase();
    const user = await createTestUser(db);
    userId = user.id;
    storageDir = await mkdtemp(path.join(tmpdir(), "closet-wardrobe-"));
  });

  afterAll(async () => {
    if (userId) {
      await deleteTestUser(db, userId);
    }
    if (storageDir) {
      await rm(storageDir, { recursive: true, force: true });
    }
  });

  it("supports sample catalog, filters, update, and delete", async () => {
    const queue = createInProcessJobQueue();
    const service = createWardrobeService({
      db,
      storage: createLocalObjectStorage(storageDir),
      queue,
      ai: createMockAiProviders(),
    });
    service.registerVisionWorker();

    const seeded = await service.seedSampleCatalog(userId);
    expect(seeded.length).toBeGreaterThanOrEqual(5);

    const categories = await service.listCategories();
    expect(categories.some((category) => category.slug === "shirt")).toBe(true);

    const items = await service.listItems(userId);
    expect(items.length).toBeGreaterThanOrEqual(5);

    const tops = await service.listItems(userId, { categorySlug: "shirt" });
    expect(tops.every((item) => item.categorySlug === "shirt")).toBe(true);

    const white = await service.listItems(userId, { color: "white" });
    expect(white.length).toBeGreaterThan(0);

    const first = items[0];
    expect(first).toBeTruthy();
    if (!first) {
      return;
    }

    const updated = await service.updateItem(userId, first.id, { name: "Updated item" });
    expect(updated.name).toBe("Updated item");

    await service.deleteItem(userId, first.id);
    const afterDelete = await service.listItems(userId);
    expect(afterDelete.find((item) => item.id === first.id)).toBeUndefined();
  });

  it("uploads media, analyzes with mock vision, and confirms garments", async () => {
    const queue = createInProcessJobQueue();
    const service = createWardrobeService({
      db,
      storage: createLocalObjectStorage(storageDir),
      queue,
      ai: createMockAiProviders(),
    });
    service.registerVisionWorker();

    const media = await service.uploadMedia(userId, {
      bytes: new Uint8Array([9, 8, 7, 6]),
      mimeType: "image/jpeg",
      filename: "look.jpg",
    });

    const analyzed = await service.analyzeMedia(userId, media.id);
    expect(analyzed.processingStatus).toBe("ready");
    expect(analyzed.detections.length).toBeGreaterThan(0);

    const content = await service.getMediaContent(userId, media.id);
    expect(content.bytes.byteLength).toBe(4);

    const created = await service.confirmMedia(userId, media.id, {
      garments: analyzed.detections.map((garment) => ({
        ...garment,
        accepted: true,
      })),
    });
    expect(created.length).toBe(analyzed.detections.length);
  });
});
