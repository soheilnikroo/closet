import { getOptionalClerkPublishableKey } from "@/shared/config/env.js";

/** True when a real (non-placeholder) Clerk publishable key is configured. */
export function isClerkEnabled(): boolean {
  const publishableKey = getOptionalClerkPublishableKey();
  return typeof publishableKey === "string" && !publishableKey.includes("replace_me");
}

/**
 * Default after sign-in / sign-up when no safe `redirect_url` is present.
 * First-time users still reach onboarding via home "Get started" (AuthGate preserves that path).
 */
export const POST_AUTH_REDIRECT = "/today";

/** Path Clerk OAuth / SSO redirects land on (Dashboard + custom flows). */
export const SSO_CALLBACK_PATH = "/sso-callback";

const AUTH_ROUTE_PREFIXES = ["/sign-in", "/sign-up", "/sso-callback"] as const;

/** True for Clerk auth UI / callback routes (must not be used as post-auth return targets). */
export function isAuthRoutePath(pathname: string): boolean {
  const path = pathname.split("?")[0] ?? pathname;
  return AUTH_ROUTE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/**
 * Only same-origin relative app paths are accepted as post-auth redirects.
 * Rejects absolute URLs, protocol-relative URLs, and auth routes (loop prevention).
 */
export function resolvePostAuthRedirect(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return POST_AUTH_REDIRECT;
  }

  const pathname = raw.split("?")[0] ?? raw;
  if (isAuthRoutePath(pathname)) {
    return POST_AUTH_REDIRECT;
  }

  return raw;
}

export function buildSignInHref(redirectUrl?: string | null): string {
  const target = resolvePostAuthRedirect(redirectUrl);
  if (target === POST_AUTH_REDIRECT) {
    return "/sign-in";
  }
  return `/sign-in?redirect_url=${encodeURIComponent(target)}`;
}

export function buildSignUpHref(redirectUrl?: string | null): string {
  const target = resolvePostAuthRedirect(redirectUrl);
  if (target === POST_AUTH_REDIRECT) {
    return "/sign-up";
  }
  return `/sign-up?redirect_url=${encodeURIComponent(target)}`;
}
