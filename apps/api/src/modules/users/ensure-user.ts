import { createClerkClient } from "@clerk/fastify";
import type { User } from "@closet/shared";

import type { UsersService } from "@/modules/users/users-service.js";
import { usesMockAuth } from "@/shared/auth/provider.js";
import type { Env } from "@/shared/config/index.js";
import { unauthorized } from "@/shared/errors/index.js";

export async function ensureUserFromClerkId(
  clerkUserId: string | null,
  usersService: UsersService,
  env: Env,
): Promise<User> {
  if (!clerkUserId) {
    throw unauthorized();
  }

  const existing = await usersService.getByClerkUserId(clerkUserId);
  if (existing) {
    return existing;
  }

  if (usesMockAuth(env) && clerkUserId.startsWith("mock:")) {
    return usersService.upsertFromClerk({
      clerkUserId,
      email: null,
      phone: null,
      displayName: "My closet",
      avatarUrl: null,
    });
  }

  const clerkClient = createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
  });

  const clerkUser = await clerkClient.users.getUser(clerkUserId);
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

  return usersService.upsertFromClerk({
    clerkUserId,
    email: primaryEmail,
    phone: primaryPhone,
    displayName:
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      clerkUser.username ||
      null,
    avatarUrl: clerkUser.imageUrl || null,
  });
}
