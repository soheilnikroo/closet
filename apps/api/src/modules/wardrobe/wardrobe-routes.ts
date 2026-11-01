import {
  clothingCategoriesResponseSchema,
  clothingItemResponseSchema,
  clothingItemsResponseSchema,
  confirmMediaRequestSchema,
  confirmMediaResponseSchema,
  createClothingItemRequestSchema,
  mediaAssetResponseSchema,
  sampleCatalogResponseSchema,
  updateClothingItemRequestSchema,
} from "@closet/shared";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { ensureUserFromClerkId } from "@/modules/users/ensure-user.js";
import type { UsersService } from "@/modules/users/users-service.js";
import type { WardrobeService } from "@/modules/wardrobe/wardrobe-service.js";
import { getAuthFromRequest, type AuthGetter } from "@/shared/auth/index.js";
import type { Env } from "@/shared/config/index.js";
import { validationError } from "@/shared/errors/index.js";
import { idParamSchema, parseParams, parseQuery } from "@/shared/http/index.js";

export type WardrobeRoutesDeps = {
  env: Env;
  usersService: UsersService;
  wardrobeService: WardrobeService;
  getAuth?: AuthGetter;
};

const itemsQuerySchema = z.object({
  category: z.string().optional(),
  color: z.string().optional(),
  season: z.string().optional(),
  style: z.string().optional(),
});

export async function registerWardrobeRoutes(
  app: FastifyInstance,
  deps: WardrobeRoutesDeps,
): Promise<void> {
  const getAuth = deps.getAuth ?? getAuthFromRequest;

  app.get("/v1/wardrobe/categories", async (request, reply) => {
    const { userId } = getAuth(request);
    await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const categories = await deps.wardrobeService.listCategories();
    return reply.send(clothingCategoriesResponseSchema.parse({ categories }));
  });

  app.get("/v1/wardrobe/items", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const query = parseQuery(itemsQuerySchema, request.query);
    const items = await deps.wardrobeService.listItems(user.id, {
      categorySlug: query.category,
      color: query.color,
      season: query.season,
      style: query.style,
    });
    return reply.send(clothingItemsResponseSchema.parse({ items }));
  });

  app.post("/v1/wardrobe/items", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const parsed = createClothingItemRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw validationError("Invalid clothing item", parsed.error.issues);
    }
    const item = await deps.wardrobeService.createItem(user.id, parsed.data);
    return reply.status(201).send(clothingItemResponseSchema.parse({ item }));
  });

  app.get("/v1/wardrobe/items/:id", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const { id } = parseParams(idParamSchema, request.params);
    const item = await deps.wardrobeService.getItem(user.id, id);
    return reply.send(clothingItemResponseSchema.parse({ item }));
  });

  app.patch("/v1/wardrobe/items/:id", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const { id } = parseParams(idParamSchema, request.params);
    const parsed = updateClothingItemRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw validationError("Invalid clothing update", parsed.error.issues);
    }
    const item = await deps.wardrobeService.updateItem(user.id, id, parsed.data);
    return reply.send(clothingItemResponseSchema.parse({ item }));
  });

  app.delete("/v1/wardrobe/items/:id", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const { id } = parseParams(idParamSchema, request.params);
    await deps.wardrobeService.deleteItem(user.id, id);
    return reply.status(204).send();
  });

  app.post("/v1/wardrobe/media", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const file = await request.file();
    if (!file) {
      throw validationError("Image file is required");
    }

    const chunks: Buffer[] = [];
    for await (const chunk of file.file) {
      chunks.push(chunk);
    }
    const bytes = new Uint8Array(Buffer.concat(chunks));
    if (bytes.byteLength === 0) {
      throw validationError("Empty file");
    }
    if (bytes.byteLength > 12 * 1024 * 1024) {
      throw validationError("File too large (max 12MB)");
    }

    const media = await deps.wardrobeService.uploadMedia(user.id, {
      bytes,
      mimeType: file.mimetype || "image/jpeg",
      filename: file.filename,
    });

    const analyzed = await deps.wardrobeService.analyzeMedia(user.id, media.id);
    return reply.status(201).send(mediaAssetResponseSchema.parse({ media: analyzed }));
  });

  app.get("/v1/wardrobe/media/:id", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const { id } = parseParams(idParamSchema, request.params);
    const media = await deps.wardrobeService.getMedia(user.id, id);
    return reply.send(mediaAssetResponseSchema.parse({ media }));
  });

  app.get("/v1/wardrobe/media/:id/content", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const { id } = parseParams(idParamSchema, request.params);
    const content = await deps.wardrobeService.getMediaContent(user.id, id);
    return reply
      .header("Content-Type", content.mimeType)
      .header("Cache-Control", "private, max-age=3600")
      .send(Buffer.from(content.bytes));
  });

  app.post("/v1/wardrobe/media/:id/analyze", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const { id } = parseParams(idParamSchema, request.params);
    const media = await deps.wardrobeService.analyzeMedia(user.id, id);
    return reply.send(mediaAssetResponseSchema.parse({ media }));
  });

  app.post("/v1/wardrobe/media/:id/confirm", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const { id } = parseParams(idParamSchema, request.params);
    const parsed = confirmMediaRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw validationError("Invalid confirmation payload", parsed.error.issues);
    }
    const items = await deps.wardrobeService.confirmMedia(user.id, id, parsed.data);
    return reply.send(confirmMediaResponseSchema.parse({ items }));
  });

  app.post("/v1/wardrobe/sample-catalog", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const items = await deps.wardrobeService.seedSampleCatalog(user.id);
    return reply.send(sampleCatalogResponseSchema.parse({ items, count: items.length }));
  });
}
