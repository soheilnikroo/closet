import { createClerkClient } from "@clerk/fastify";
import { meResponseSchema } from "@closet/shared";
import type { FastifyInstance } from "fastify";

import type { UsersService } from "@/modules/users/users-service.js";
import { getAuthFromRequest, type AuthGetter } from "@/shared/auth/index.js";
import type { Env } from "@/shared/config/index.js";
import { unauthorized } from "@/shared/errors/index.js";

export type UsersRoutesDeps = {
  usersService: UsersService;
  env: Env;
  getAuth?: AuthGetter;
};

export async function registerUsersRoutes(
  app: FastifyInstance,
  deps: UsersRoutesDeps,
): Promise<void> {
  const getAuth = deps.getAuth ?? getAuthFromRequest;
  const clerkClient = createClerkClient({
    secretKey: deps.env.CLERK_SECRET_KEY,
    publishableKey: deps.env.CLERK_PUBLISHABLE_KEY,
  });

  app.get("/v1/users/me", async (request, reply) => {
    const { userId } = getAuth(request);

    if (!userId) {
      throw unauthorized();
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const primaryEmail =
      clerkUser.emailAddresses.find((entry) => entry.id === clerkUser.primaryEmailAddressId)
        ?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress ??
      null;
    const primaryPhone =
      clerkUser.phoneNumbers.find((entry) => entry.id === clerkUser.primaryPhoneNumberId)
        ?.phoneNumber ??
      clerkUser.phoneNumbers[0]?.phoneNumber ??
      null;

    const user = await deps.usersService.upsertFromClerk({
      clerkUserId: userId,
      email: primaryEmail,
      phone: primaryPhone,
      displayName:
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        clerkUser.username ||
        null,
      avatarUrl: clerkUser.imageUrl || null,
    });

    const payload = meResponseSchema.parse({ user });
    return reply.send(payload);
  });
}
