import {
  createRecommendationRequestSchema,
  feedbackRequestSchema,
  feedbackResponseSchema,
  occasionsResponseSchema,
  recommendationsResponseSchema,
  replaceItemRequestSchema,
  replaceItemResponseSchema,
  stylistChatRequestSchema,
  stylistChatResponseSchema,
  todayResponseSchema,
} from "@closet/shared";
import type { FastifyInstance } from "fastify";

import { getAuthFromRequest, type AuthGetter } from "../../shared/auth/index.js";
import type { Env } from "../../shared/config/index.js";
import { validationError } from "../../shared/errors/index.js";
import { idParamSchema, parseParams } from "../../shared/http/index.js";
import { ensureUserFromClerkId } from "../users/ensure-user.js";
import type { UsersService } from "../users/users-service.js";
import type { StylingService } from "./styling-service.js";

export type StylingRoutesDeps = {
  env: Env;
  usersService: UsersService;
  stylingService: StylingService;
  getAuth?: AuthGetter;
};

export async function registerStylingRoutes(
  app: FastifyInstance,
  deps: StylingRoutesDeps,
): Promise<void> {
  const getAuth = deps.getAuth ?? getAuthFromRequest;

  app.get("/v1/styling/today", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const payload = await deps.stylingService.getToday(user.id);
    return reply.send(todayResponseSchema.parse(payload));
  });

  app.post("/v1/styling/recommendations", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const parsed = createRecommendationRequestSchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      throw validationError("Invalid recommendation request", parsed.error.issues);
    }
    const payload = await deps.stylingService.createRecommendations(user.id, parsed.data);
    return reply.send(recommendationsResponseSchema.parse(payload));
  });

  app.post("/v1/styling/recommendations/:id/feedback", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const { id } = parseParams(idParamSchema, request.params);
    const parsed = feedbackRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw validationError("Invalid feedback", parsed.error.issues);
    }
    await deps.stylingService.submitFeedback(user.id, id, parsed.data);
    return reply.send(feedbackResponseSchema.parse({ ok: true }));
  });

  app.post("/v1/styling/recommendations/:id/replace-item", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const { id } = parseParams(idParamSchema, request.params);
    const parsed = replaceItemRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw validationError("Invalid replace request", parsed.error.issues);
    }
    const recommendation = await deps.stylingService.replaceItem(user.id, id, parsed.data);
    return reply.send(replaceItemResponseSchema.parse({ recommendation }));
  });

  app.post("/v1/styling/chat", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const parsed = stylistChatRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw validationError("Invalid chat request", parsed.error.issues);
    }
    const payload = await deps.stylingService.chat(user.id, parsed.data);
    return reply.send(stylistChatResponseSchema.parse(payload));
  });

  app.get("/v1/occasions", async (request, reply) => {
    const { userId } = getAuth(request);
    await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const occasions = await deps.stylingService.listOccasions();
    return reply.send(occasionsResponseSchema.parse({ occasions }));
  });
}
