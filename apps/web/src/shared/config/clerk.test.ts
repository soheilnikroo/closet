import { describe, expect, it } from "vitest";

import {
  POST_AUTH_REDIRECT,
  buildSignInHref,
  buildSignUpHref,
  isAuthRoutePath,
  resolvePostAuthRedirect,
} from "@/shared/config/clerk.js";

describe("resolvePostAuthRedirect", () => {
  it("defaults when missing or unsafe", () => {
    expect(resolvePostAuthRedirect(null)).toBe(POST_AUTH_REDIRECT);
    expect(resolvePostAuthRedirect("")).toBe(POST_AUTH_REDIRECT);
    expect(resolvePostAuthRedirect("https://evil.example")).toBe(POST_AUTH_REDIRECT);
    expect(resolvePostAuthRedirect("//evil.example")).toBe(POST_AUTH_REDIRECT);
  });

  it("rejects auth routes to prevent redirect loops", () => {
    expect(resolvePostAuthRedirect("/sign-in")).toBe(POST_AUTH_REDIRECT);
    expect(resolvePostAuthRedirect("/sign-in/sso-callback")).toBe(POST_AUTH_REDIRECT);
    expect(resolvePostAuthRedirect("/sign-up")).toBe(POST_AUTH_REDIRECT);
    expect(resolvePostAuthRedirect("/sso-callback")).toBe(POST_AUTH_REDIRECT);
  });

  it("keeps same-origin relative app paths", () => {
    expect(resolvePostAuthRedirect("/today")).toBe("/today");
    expect(resolvePostAuthRedirect("/onboarding?x=1")).toBe("/onboarding?x=1");
  });
});

describe("isAuthRoutePath", () => {
  it("detects clerk auth paths", () => {
    expect(isAuthRoutePath("/sign-in")).toBe(true);
    expect(isAuthRoutePath("/sign-up/verify")).toBe(true);
    expect(isAuthRoutePath("/sso-callback")).toBe(true);
    expect(isAuthRoutePath("/today")).toBe(false);
  });
});

describe("buildSignInHref / buildSignUpHref", () => {
  it("omits redirect_url for the default destination", () => {
    expect(buildSignInHref("/today")).toBe("/sign-in");
    expect(buildSignUpHref(null)).toBe("/sign-up");
  });

  it("preserves non-default return paths", () => {
    expect(buildSignInHref("/onboarding")).toBe(
      `/sign-in?redirect_url=${encodeURIComponent("/onboarding")}`,
    );
    expect(buildSignUpHref("/closet")).toBe(
      `/sign-up?redirect_url=${encodeURIComponent("/closet")}`,
    );
  });
});
