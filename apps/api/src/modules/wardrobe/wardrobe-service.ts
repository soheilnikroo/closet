import {
  detectedGarmentSchema,
  mediaAssetSchema,
  seasonSchema,
  styleTagSchema,
  type ClothingCategory,
  type ClothingItem,
  type ConfirmMediaRequest,
  type CreateClothingItemRequest,
  type MediaAsset,
  type UpdateClothingItemRequest,
} from "@closet/shared";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";

import type { AiProviders } from "@/infrastructure/ai/index.js";
import {
  aiProcessingJobsTable,
  clothingCategoriesTable,
  clothingImagesTable,
  clothingItemsTable,
  mediaAssetsTable,
  wardrobesTable,
  type Database,
} from "@/infrastructure/database/index.js";
import type { InProcessJobQueue } from "@/infrastructure/queue/index.js";
import type { LocalObjectStorage } from "@/infrastructure/storage/index.js";
import { mapClothingItem } from "@/modules/wardrobe/clothing-mapper.js";
import { SAMPLE_CATALOG_ITEMS } from "@/modules/wardrobe/sample-catalog.js";
import {
  mediaNotReady,
  mediaProcessingFailed,
  notFound,
  validationError,
} from "@/shared/errors/index.js";

export type WardrobeService = {
  ensureWardrobe: (userId: string) => Promise<string>;
  listCategories: () => Promise<ClothingCategory[]>;
  listItems: (
    userId: string,
    filters?: {
      categorySlug?: string;
      color?: string;
      season?: string;
      style?: string;
    },
  ) => Promise<ClothingItem[]>;
  getItem: (userId: string, itemId: string) => Promise<ClothingItem>;
  createItem: (userId: string, input: CreateClothingItemRequest) => Promise<ClothingItem>;
  updateItem: (
    userId: string,
    itemId: string,
    input: UpdateClothingItemRequest,
  ) => Promise<ClothingItem>;
  deleteItem: (userId: string, itemId: string) => Promise<void>;
  uploadMedia: (
    userId: string,
    file: { bytes: Uint8Array; mimeType: string; filename: string },
  ) => Promise<MediaAsset>;
  getMedia: (userId: string, mediaId: string) => Promise<MediaAsset>;
  getMediaContent: (
    userId: string,
    mediaId: string,
  ) => Promise<{ bytes: Uint8Array; mimeType: string }>;
  analyzeMedia: (userId: string, mediaId: string) => Promise<MediaAsset>;
  confirmMedia: (
    userId: string,
    mediaId: string,
    input: ConfirmMediaRequest,
  ) => Promise<Array<{ id: string; name: string }>>;
  seedSampleCatalog: (userId: string) => Promise<Array<{ id: string; name: string }>>;
  registerVisionWorker: () => void;
};

function mapMedia(row: typeof mediaAssetsTable.$inferSelect): MediaAsset {
  const detections = z
    .array(detectedGarmentSchema)
    .catch([])
    .parse(row.detections ?? []);
  return mediaAssetSchema.parse({
    id: row.id,
    processingStatus: row.processingStatus,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    contentUrl: `/v1/wardrobe/media/${row.id}/content`,
    detections,
    error: row.error,
    createdAt: row.createdAt.toISOString(),
  });
}

export function createWardrobeService(deps: {
  db: Database;
  storage: LocalObjectStorage;
  queue: InProcessJobQueue;
  ai: AiProviders;
}): WardrobeService {
  const { db, storage, queue, ai } = deps;

  async function ensureWardrobe(userId: string): Promise<string> {
    const existing = await db
      .select()
      .from(wardrobesTable)
      .where(and(eq(wardrobesTable.userId, userId), eq(wardrobesTable.isDefault, true)))
      .limit(1);

    if (existing[0]) {
      return existing[0].id;
    }

    const inserted = await db
      .insert(wardrobesTable)
      .values({ userId, name: "My Closet", isDefault: true })
      .returning();
    const row = inserted[0];
    if (!row) {
      throw new Error("Failed to create wardrobe");
    }
    return row.id;
  }

  async function resolveItem(userId: string, itemId: string): Promise<ClothingItem> {
    const wardrobeId = await ensureWardrobe(userId);
    const rows = await db
      .select({
        item: clothingItemsTable,
        category: clothingCategoriesTable,
      })
      .from(clothingItemsTable)
      .innerJoin(
        clothingCategoriesTable,
        eq(clothingItemsTable.categoryId, clothingCategoriesTable.id),
      )
      .where(
        and(
          eq(clothingItemsTable.id, itemId),
          eq(clothingItemsTable.wardrobeId, wardrobeId),
          ne(clothingItemsTable.status, "deleted"),
        ),
      )
      .limit(1);

    const row = rows[0];
    if (!row) {
      throw notFound("Clothing item not found");
    }

    const images = await db
      .select()
      .from(clothingImagesTable)
      .where(eq(clothingImagesTable.clothingItemId, itemId))
      .limit(1);

    const imageUrl = images[0] ? `/v1/wardrobe/media/${images[0].mediaAssetId}/content` : null;

    return mapClothingItem(row.item, row.category, imageUrl);
  }

  async function runVisionJob(mediaId: string, userId: string): Promise<void> {
    const mediaRows = await db
      .select()
      .from(mediaAssetsTable)
      .where(and(eq(mediaAssetsTable.id, mediaId), eq(mediaAssetsTable.userId, userId)))
      .limit(1);
    const media = mediaRows[0];
    if (!media) {
      return;
    }

    await db
      .update(mediaAssetsTable)
      .set({ processingStatus: "processing", error: null })
      .where(eq(mediaAssetsTable.id, mediaId));

    const jobRows = await db
      .insert(aiProcessingJobsTable)
      .values({
        userId,
        jobType: "clothing_vision",
        inputAssetId: mediaId,
        provider: ai.vision.name,
        model: ai.vision.model,
        status: "running",
      })
      .returning();
    const job = jobRows[0];

    try {
      const bytes = await storage.getObject(media.storageKey);
      const detections = await ai.vision.analyzeClothing({
        imageBytes: bytes,
        mimeType: media.mimeType,
      });

      await db
        .update(mediaAssetsTable)
        .set({
          processingStatus: "ready",
          detections,
          error: null,
        })
        .where(eq(mediaAssetsTable.id, mediaId));

      if (job) {
        await db
          .update(aiProcessingJobsTable)
          .set({ status: "succeeded", completedAt: new Date() })
          .where(eq(aiProcessingJobsTable.id, job.id));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Vision analysis failed";
      await db
        .update(mediaAssetsTable)
        .set({ processingStatus: "failed", error: message })
        .where(eq(mediaAssetsTable.id, mediaId));

      if (job) {
        await db
          .update(aiProcessingJobsTable)
          .set({ status: "failed", error: message, completedAt: new Date() })
          .where(eq(aiProcessingJobsTable.id, job.id));
      }
    }
  }

  return {
    ensureWardrobe,

    registerVisionWorker() {
      queue.register("clothing_vision", async (payload) => {
        const mediaId = typeof payload["mediaId"] === "string" ? payload["mediaId"] : "";
        const userId = typeof payload["userId"] === "string" ? payload["userId"] : "";
        if (!mediaId || !userId) {
          return;
        }
        await runVisionJob(mediaId, userId);
      });
    },

    async listCategories() {
      const rows = await db
        .select()
        .from(clothingCategoriesTable)
        .where(eq(clothingCategoriesTable.isActive, true));

      return rows.map((row) => ({
        id: row.id,
        parentId: row.parentId,
        name: row.name,
        nameFa: row.nameFa,
        slug: row.slug,
        slot: row.slot,
      }));
    },

    async listItems(userId, filters) {
      const wardrobeId = await ensureWardrobe(userId);
      const rows = await db
        .select({
          item: clothingItemsTable,
          category: clothingCategoriesTable,
        })
        .from(clothingItemsTable)
        .innerJoin(
          clothingCategoriesTable,
          eq(clothingItemsTable.categoryId, clothingCategoriesTable.id),
        )
        .where(
          and(
            eq(clothingItemsTable.wardrobeId, wardrobeId),
            eq(clothingItemsTable.status, "active"),
          ),
        );

      const images = await db.select().from(clothingImagesTable);
      const imageByItem = new Map<string, string>(
        images.map((img) => [img.clothingItemId, img.mediaAssetId]),
      );

      let items = rows.map((row) => {
        const mediaId = imageByItem.get(row.item.id);
        return mapClothingItem(
          row.item,
          row.category,
          mediaId ? `/v1/wardrobe/media/${mediaId}/content` : null,
        );
      });

      if (filters?.categorySlug) {
        items = items.filter((item) => item.categorySlug === filters.categorySlug);
      }
      if (filters?.color) {
        const color = filters.color.toLowerCase();
        items = items.filter(
          (item) =>
            item.primaryColor.toLowerCase() === color ||
            item.colors.some((c) => c.toLowerCase() === color),
        );
      }
      if (filters?.season) {
        const season = seasonSchema.safeParse(filters.season);
        if (season.success) {
          items = items.filter(
            (item) => item.seasons.includes(season.data) || item.seasons.includes("all_season"),
          );
        }
      }
      if (filters?.style) {
        const style = styleTagSchema.safeParse(filters.style);
        if (style.success) {
          items = items.filter((item) => item.styleTags.includes(style.data));
        }
      }

      return items;
    },

    getItem: resolveItem,

    async createItem(userId, input) {
      const wardrobeId = await ensureWardrobe(userId);
      const categories = await db
        .select()
        .from(clothingCategoriesTable)
        .where(eq(clothingCategoriesTable.id, input.categoryId))
        .limit(1);
      if (!categories[0]) {
        throw validationError("Invalid category");
      }

      const inserted = await db
        .insert(clothingItemsTable)
        .values({
          wardrobeId,
          categoryId: input.categoryId,
          name: input.name,
          primaryColor: input.primaryColor,
          colors: input.colors ?? [input.primaryColor],
          pattern: input.pattern ?? null,
          styleTags: input.styleTags ?? [],
          seasons: input.seasons ?? ["all_season"],
          material: input.material ?? null,
          formality: input.formality ?? null,
          fit: input.fit ?? null,
          warmthLevel: input.warmthLevel ?? null,
          brand: input.brand ?? null,
          sourceType: "manual",
        })
        .returning();

      const row = inserted[0];
      if (!row) {
        throw new Error("Failed to create item");
      }
      return resolveItem(userId, row.id);
    },

    async updateItem(userId, itemId, input) {
      await resolveItem(userId, itemId);
      const updated = await db
        .update(clothingItemsTable)
        .set({
          ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.primaryColor !== undefined ? { primaryColor: input.primaryColor } : {}),
          ...(input.colors !== undefined ? { colors: input.colors } : {}),
          ...(input.pattern !== undefined ? { pattern: input.pattern } : {}),
          ...(input.styleTags !== undefined ? { styleTags: input.styleTags } : {}),
          ...(input.seasons !== undefined ? { seasons: input.seasons } : {}),
          ...(input.material !== undefined ? { material: input.material } : {}),
          ...(input.formality !== undefined ? { formality: input.formality } : {}),
          ...(input.fit !== undefined ? { fit: input.fit } : {}),
          ...(input.warmthLevel !== undefined ? { warmthLevel: input.warmthLevel } : {}),
          ...(input.brand !== undefined ? { brand: input.brand } : {}),
          ...(input.status !== undefined ? { status: input.status } : {}),
          updatedAt: new Date(),
        })
        .where(eq(clothingItemsTable.id, itemId))
        .returning();

      if (!updated[0]) {
        throw notFound("Clothing item not found");
      }
      return resolveItem(userId, itemId);
    },

    async deleteItem(userId, itemId) {
      await resolveItem(userId, itemId);
      await db
        .update(clothingItemsTable)
        .set({ status: "deleted", updatedAt: new Date() })
        .where(eq(clothingItemsTable.id, itemId));
    },

    async uploadMedia(userId, file) {
      const id = crypto.randomUUID();
      const extension = file.mimeType.includes("png")
        ? "png"
        : file.mimeType.includes("webp")
          ? "webp"
          : "jpg";
      const storageKey = `${userId}/${id}.${extension}`;
      await storage.putObject(storageKey, file.bytes, file.mimeType);

      const inserted = await db
        .insert(mediaAssetsTable)
        .values({
          id,
          userId,
          storageKey,
          mimeType: file.mimeType,
          sizeBytes: file.bytes.byteLength,
          processingStatus: "pending",
          detections: [],
        })
        .returning();

      const row = inserted[0];
      if (!row) {
        throw new Error("Failed to create media asset");
      }

      await queue.enqueue("clothing_vision", { mediaId: row.id, userId });
      return mapMedia(row);
    },

    async getMedia(userId, mediaId) {
      const rows = await db
        .select()
        .from(mediaAssetsTable)
        .where(and(eq(mediaAssetsTable.id, mediaId), eq(mediaAssetsTable.userId, userId)))
        .limit(1);
      const row = rows[0];
      if (!row) {
        throw notFound("Media not found");
      }
      return mapMedia(row);
    },

    async getMediaContent(userId, mediaId) {
      const rows = await db
        .select()
        .from(mediaAssetsTable)
        .where(and(eq(mediaAssetsTable.id, mediaId), eq(mediaAssetsTable.userId, userId)))
        .limit(1);
      const row = rows[0];
      if (!row) {
        throw notFound("Media not found");
      }
      const bytes = await storage.getObject(row.storageKey);
      return { bytes, mimeType: row.mimeType };
    },

    async analyzeMedia(userId, mediaId) {
      const media = await this.getMedia(userId, mediaId);
      await queue.enqueue("clothing_vision", { mediaId, userId });
      // Run immediately for responsiveness in R1
      await runVisionJob(mediaId, userId);
      return this.getMedia(userId, mediaId).catch(() => media);
    },

    async confirmMedia(userId, mediaId, input) {
      const media = await this.getMedia(userId, mediaId);
      if (media.processingStatus === "processing" || media.processingStatus === "pending") {
        throw mediaNotReady();
      }
      if (media.processingStatus === "failed") {
        throw mediaProcessingFailed(media.error ?? "Analysis failed");
      }

      const wardrobeId = await ensureWardrobe(userId);
      const categories = await db.select().from(clothingCategoriesTable);
      const bySlug = new Map(categories.map((c) => [c.slug, c]));
      const created: Array<{ id: string; name: string }> = [];

      for (const garment of input.garments) {
        if (!garment.accepted) {
          continue;
        }

        const category =
          (garment.categoryId ? categories.find((c) => c.id === garment.categoryId) : undefined) ??
          bySlug.get(garment.categorySlug);

        if (!category) {
          throw validationError(`Unknown category: ${garment.categorySlug}`);
        }

        const inserted = await db
          .insert(clothingItemsTable)
          .values({
            wardrobeId,
            categoryId: category.id,
            name: garment.name,
            primaryColor: garment.primaryColor,
            colors: garment.colors.length > 0 ? garment.colors : [garment.primaryColor],
            pattern: garment.pattern,
            styleTags: garment.styleTags,
            seasons: garment.seasons.length > 0 ? garment.seasons : ["all_season"],
            material: garment.material,
            formality: garment.formality,
            fit: garment.fit,
            warmthLevel: garment.warmthLevel,
            sourceType: "photo",
          })
          .returning();

        const item = inserted[0];
        if (!item) {
          continue;
        }

        await db.insert(clothingImagesTable).values({
          clothingItemId: item.id,
          mediaAssetId: mediaId,
          imageType: "primary",
          isPrimary: true,
        });

        created.push({ id: item.id, name: item.name });
      }

      return created;
    },

    async seedSampleCatalog(userId) {
      const wardrobeId = await ensureWardrobe(userId);
      const categories = await db.select().from(clothingCategoriesTable);
      const bySlug = new Map(categories.map((c) => [c.slug, c]));
      const created: Array<{ id: string; name: string }> = [];

      for (const sample of SAMPLE_CATALOG_ITEMS) {
        const category = bySlug.get(sample.categorySlug);
        if (!category) {
          continue;
        }

        const existing = await db
          .select()
          .from(clothingItemsTable)
          .where(
            and(
              eq(clothingItemsTable.wardrobeId, wardrobeId),
              eq(clothingItemsTable.name, sample.name),
              eq(clothingItemsTable.sourceType, "sample_catalog"),
              eq(clothingItemsTable.status, "active"),
            ),
          )
          .limit(1);

        if (existing[0]) {
          created.push({ id: existing[0].id, name: existing[0].name });
          continue;
        }

        const inserted = await db
          .insert(clothingItemsTable)
          .values({
            wardrobeId,
            categoryId: category.id,
            name: sample.name,
            primaryColor: sample.primaryColor,
            colors: sample.colors,
            pattern: sample.pattern,
            styleTags: sample.styleTags,
            seasons: sample.seasons,
            material: sample.material,
            formality: sample.formality,
            fit: sample.fit,
            warmthLevel: sample.warmthLevel,
            sourceType: "sample_catalog",
          })
          .returning();

        const item = inserted[0];
        if (item) {
          created.push({ id: item.id, name: item.name });
        }
      }

      return created;
    },
  };
}
