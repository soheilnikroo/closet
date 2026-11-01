import { discoverGapsResponseSchema } from "@closet/shared";
import type { FastifyInstance } from "fastify";

import { getAuthFromRequest, type AuthGetter } from "../../shared/auth/index.js";
import type { Env } from "../../shared/config/index.js";
import { ensureUserFromClerkId } from "../users/ensure-user.js";
import type { UsersService } from "../users/users-service.js";
import type { DiscoverService } from "./discover-service.js";

export type DiscoverRoutesDeps = {
  env: Env;
  usersService: UsersService;
  discoverService: DiscoverService;
  getAuth?: AuthGetter;
};

export async function registerDiscoverRoutes(
  app: FastifyInstance,
  deps: DiscoverRoutesDeps,
): Promise<void> {
  const getAuth = deps.getAuth ?? getAuthFromRequest;

  app.get("/v1/discover/gaps", async (request, reply) => {
    const { userId } = getAuth(request);
    const user = await ensureUserFromClerkId(userId, deps.usersService, deps.env);
    const payload = await deps.discoverService.getGaps(user.id);
    return reply.send(discoverGapsResponseSchema.parse(payload));
  });
}
