import type { FastifyRequest } from "fastify";

export type AuthGetter = (request: FastifyRequest) => { userId: string | null };

export function getAuthFromRequest(request: FastifyRequest): { userId: string | null } {
  const authValue = Reflect.get(request, "auth");

  if (typeof authValue === "function") {
    const result: unknown = authValue.call(request);
    if (
      typeof result === "object" &&
      result !== null &&
      "userId" in result &&
      (typeof result.userId === "string" || result.userId === null)
    ) {
      return { userId: result.userId };
    }
  }

  return { userId: null };
}
