import type { FastifyRequest } from "fastify";

export type AuthGetter = (request: FastifyRequest) => { userId: string | null };

function readUserId(value: unknown): { userId: string | null } | null {
  if (
    typeof value === "object" &&
    value !== null &&
    "userId" in value &&
    (typeof value.userId === "string" || value.userId === null)
  ) {
    return { userId: value.userId };
  }
  return null;
}

/**
 * Clerk's Fastify plugin sets `request.auth` to an object (`toAuth()`).
 * Older call sites used a function. Both shapes carry `userId`.
 */
export function getAuthFromRequest(request: FastifyRequest): { userId: string | null } {
  const authValue = Reflect.get(request, "auth");

  if (typeof authValue === "function") {
    return readUserId(authValue.call(request)) ?? { userId: null };
  }

  return readUserId(authValue) ?? { userId: null };
}
