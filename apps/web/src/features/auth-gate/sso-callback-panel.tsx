import { useAuth, useClerk } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router";

import { AuthConfigBlocked } from "@/features/auth-gate/auth-config-blocked.js";
import { AuthLoading } from "@/features/auth-gate/auth-loading.js";
import { AuthRecoveryCard } from "@/features/auth-gate/auth-recovery-card.js";
import { isStuckOAuthSignUp } from "@/features/auth-gate/is-empty-signup-continue.js";
import {
  SIGN_IN_PATH,
  SIGN_UP_CONTINUE_PATH,
  SIGN_UP_PATH,
  SSO_CALLBACK_TIMEOUT_MS,
} from "@/features/auth-gate/sso-callback-panel.constants.js";
import type { SsoCallbackPanelProps } from "@/features/auth-gate/sso-callback-panel.types.js";

type ClerkClient = ReturnType<typeof useClerk>;

type CallbackOutcome = "signed-in" | "config-blocked" | "continue" | "idle" | "failed";

/**
 * One in-flight callback per URL. Strict Mode remounts share this promise so
 * the second mount is not left on the spinner after the first call is dropped.
 */
const callbackByUrl = new Map<string, Promise<CallbackOutcome>>();

function runRedirectCallback(
  clerk: ClerkClient,
  fallbackRedirectUrl: string,
): Promise<CallbackOutcome> {
  const key = window.location.href;
  const existing = callbackByUrl.get(key);
  if (existing) {
    return existing;
  }

  const pending = clerk
    .handleRedirectCallback({
      signInUrl: SIGN_IN_PATH,
      signUpUrl: SIGN_UP_PATH,
      continueSignUpUrl: SIGN_UP_CONTINUE_PATH,
      signInFallbackRedirectUrl: fallbackRedirectUrl,
      signUpFallbackRedirectUrl: fallbackRedirectUrl,
    })
    .then((): CallbackOutcome => {
      if (clerk.user) {
        return "signed-in";
      }
      const signUp = clerk.client?.signUp;
      if (signUp?.status !== "missing_requirements") {
        return "idle";
      }
      if (isStuckOAuthSignUp(signUp)) {
        return "config-blocked";
      }
      return "continue";
    })
    .catch((): CallbackOutcome => "failed");

  callbackByUrl.set(key, pending);
  return pending;
}

/**
 * Completes OAuth/SSO once per callback URL, then always leaves the spinner.
 */
export function SsoCallbackPanel({ fallbackRedirectUrl }: SsoCallbackPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const clerk = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const [failed, setFailed] = useState(false);
  const [configBlocked, setConfigBlocked] = useState(false);

  useEffect(() => {
    if (!isLoaded || isSignedIn || failed || configBlocked) {
      return undefined;
    }

    let active = true;
    const timeout = window.setTimeout(() => {
      if (active) {
        setFailed(true);
      }
    }, SSO_CALLBACK_TIMEOUT_MS);

    void runRedirectCallback(clerk, fallbackRedirectUrl).then((outcome) => {
      if (!active) {
        return;
      }
      window.clearTimeout(timeout);
      if (outcome === "signed-in" || outcome === "idle") {
        return;
      }
      if (outcome === "config-blocked") {
        setConfigBlocked(true);
        return;
      }
      if (outcome === "continue") {
        void navigate(SIGN_UP_CONTINUE_PATH, { replace: true });
        return;
      }
      setFailed(true);
    });

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [clerk, configBlocked, failed, fallbackRedirectUrl, isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (isSignedIn) {
    return <Navigate to={fallbackRedirectUrl} replace />;
  }

  if (configBlocked) {
    return <AuthConfigBlocked />;
  }

  if (failed) {
    return (
      <AuthRecoveryCard
        title={t("auth.ssoFailedTitle")}
        body={t("auth.ssoFailedBody")}
        primaryLabel={t("auth.trySignInAgain")}
        secondaryLabel={t("auth.backHome")}
        onPrimary={() => {
          void navigate(SIGN_IN_PATH, { replace: true });
        }}
        onSecondary={() => {
          void navigate("/", { replace: true });
        }}
      />
    );
  }

  return <AuthLoading />;
}
