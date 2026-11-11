/* oxlint-disable oxc/no-async-endpoint-handlers -- Fastify awaits async route handlers. */
import {
  collectionSchema,
  collectionInputSchema,
  createCollectionSchema,
  saveCollectionOutfitSchema,
  recommendationSchema,
} from "@closet/shared";
import { and, eq, desc, count } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

import {
  collectionsTable,
  collectionOutfitsTable,
  outfitRecommendationsTable,
  outfitsTable,
  outfitItemsTable,
  outfitFeedbackTable,
  type Database,
} from "@/infrastructure/database/index.js";
import { ensureUserFromClerkId } from "@/modules/users/ensure-user.js";
import type { UsersService } from "@/modules/users/users-service.js";
import type { WardrobeService } from "@/modules/wardrobe/wardrobe-service.js";
import { getAuthFromRequest } from "@/shared/auth/index.js";
import type { Env } from "@/shared/config/index.js";
import { notFound, validationError } from "@/shared/errors/index.js";

function parse<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw validationError("Invalid collection", result.error.issues);
  }
  return result.data;
}
type Deps = {
  db: Database;
  env: Env;
  usersService: UsersService;
  wardrobeService: WardrobeService;
};
export async function registerCollectionsRoutes(
  app: FastifyInstance,
  { db, env, usersService, wardrobeService }: Deps,
) {
  const paramsSchema = z.object({ id: z.string().uuid() });
  async function owned(userId: string, id: string) {
    const [row] = await db
      .select()
      .from(collectionsTable)
      .where(and(eq(collectionsTable.id, id), eq(collectionsTable.userId, userId)));
    if (!row) {
      throw notFound("Collection not found");
    }
    return row;
  }
  async function snapshot(userId: string, recommendationId: string) {
    const [row] = await db
      .select({ rec: outfitRecommendationsTable, outfit: outfitsTable })
      .from(outfitRecommendationsTable)
      .innerJoin(outfitsTable, eq(outfitsTable.id, outfitRecommendationsTable.outfitId))
      .where(
        and(
          eq(outfitRecommendationsTable.id, recommendationId),
          eq(outfitRecommendationsTable.userId, userId),
          eq(outfitsTable.userId, userId),
        ),
      );
    if (!row) {
      throw notFound("Outfit not found");
    }
    const [entries, clothes] = await Promise.all([
      db.select().from(outfitItemsTable).where(eq(outfitItemsTable.outfitId, row.outfit.id)),
      wardrobeService.listItems(userId),
    ]);
    return recommendationSchema.parse({
      ...row.rec,
      occasionName: null,
      generatedAt: row.rec.generatedAt.toISOString(),
      outfit: {
        ...row.outfit,
        createdAt: row.outfit.createdAt.toISOString(),
        items: entries.map((entry) => ({
          clothingItemId: entry.clothingItemId,
          role: entry.role,
          position: entry.position,
          item: clothes.find((item) => item.id === entry.clothingItemId),
        })),
      },
    });
  }
  async function save(
    tx: Parameters<Parameters<Database["transaction"]>[0]>[0],
    userId: string,
    collectionId: string,
    rec: Awaited<ReturnType<typeof snapshot>>,
    action: "like" | "save",
  ) {
    const inserted = await tx
      .insert(collectionOutfitsTable)
      .values({ collectionId, outfitId: rec.outfit.id, snapshot: rec })
      .onConflictDoNothing()
      .returning();
    if (inserted.length) {
      await tx.insert(outfitFeedbackTable).values({ userId, recommendationId: rec.id, action });
    }
  }
  app.get("/v1/collections", async (request) => {
    const user = await ensureUserFromClerkId(getAuthFromRequest(request).userId, usersService, env);
    const rows = await db
      .select({ collection: collectionsTable, count: count(collectionOutfitsTable.outfitId) })
      .from(collectionsTable)
      .leftJoin(
        collectionOutfitsTable,
        eq(collectionOutfitsTable.collectionId, collectionsTable.id),
      )
      .where(eq(collectionsTable.userId, user.id))
      .groupBy(collectionsTable.id)
      .orderBy(desc(collectionsTable.createdAt));
    return {
      collections: rows.map(({ collection, count: total }) =>
        collectionSchema.parse({
          ...collection,
          createdAt: collection.createdAt.toISOString(),
          count: total,
        }),
      ),
    };
  });
  app.post("/v1/collections", async (request) => {
    const user = await ensureUserFromClerkId(getAuthFromRequest(request).userId, usersService, env);
    const input = parse(createCollectionSchema, request.body);
    const rec = input.recommendationId ? await snapshot(user.id, input.recommendationId) : null;
    return db.transaction(async (tx) => {
      const [row] = await tx
        .insert(collectionsTable)
        .values({ ...parse(collectionInputSchema, input), userId: user.id })
        .returning();
      if (!row) {
        throw new Error("Collection could not be created");
      }
      if (rec) {
        await save(tx, user.id, row.id, rec, input.action);
      }
      return {
        collection: collectionSchema.parse({
          ...row,
          createdAt: row.createdAt.toISOString(),
          count: rec ? 1 : 0,
        }),
      };
    });
  });
  app.get("/v1/collections/:id", async (request) => {
    const user = await ensureUserFromClerkId(getAuthFromRequest(request).userId, usersService, env);
    const row = await owned(user.id, parse(paramsSchema, request.params).id);
    const entries = await db
      .select()
      .from(collectionOutfitsTable)
      .where(eq(collectionOutfitsTable.collectionId, row.id))
      .orderBy(desc(collectionOutfitsTable.savedAt));
    return {
      collection: collectionSchema.parse({
        ...row,
        createdAt: row.createdAt.toISOString(),
        count: entries.length,
      }),
      outfits: entries.map((entry) => recommendationSchema.parse(entry.snapshot)),
    };
  });
  app.patch("/v1/collections/:id", async (request) => {
    const user = await ensureUserFromClerkId(getAuthFromRequest(request).userId, usersService, env);
    const row = await owned(user.id, parse(paramsSchema, request.params).id);
    const input = parse(collectionInputSchema, request.body);
    await db.update(collectionsTable).set(input).where(eq(collectionsTable.id, row.id));
    return { ok: true };
  });
  app.put("/v1/collections/:id/outfits", async (request) => {
    const user = await ensureUserFromClerkId(getAuthFromRequest(request).userId, usersService, env);
    const row = await owned(user.id, parse(paramsSchema, request.params).id);
    const input = parse(saveCollectionOutfitSchema, request.body);
    const rec = await snapshot(user.id, input.recommendationId);
    await db.transaction((tx) => save(tx, user.id, row.id, rec, input.action));
    return { ok: true };
  });
}
