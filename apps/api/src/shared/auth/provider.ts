import type { Env } from "@/shared/config/index.js";

export function usesMockAuth(env: Env): boolean {
  if (env.NODE_ENV === "production") {
    return false;
  }
  return (
    env.AUTH_PROVIDER === "mock" ||
    (!env.AUTH_PROVIDER &&
      (!env.CLERK_PUBLISHABLE_KEY.startsWith("pk_") ||
        !env.CLERK_SECRET_KEY.startsWith("sk_") ||
        env.CLERK_PUBLISHABLE_KEY.includes("replace_me") ||
        env.CLERK_SECRET_KEY.includes("replace_me")))
  );
}
