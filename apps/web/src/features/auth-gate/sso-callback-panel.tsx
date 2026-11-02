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

/**
 * OAuth one-time tokens can only be consumed once. React Strict Mode (and some
 * remounts) used to call handleRedirectCallback twice → second
 * `sign_ups?transfer=true` returns 400 and the UI hangs.
 */
const handledRedirectKeys = new Set<string>();

/**
 * Completes OAuth/SSO exactly once per callback URL.
 * Routes to `/sign-up/continue` only when Clerk reports real missing fields.
 */
export function SsoCallbackPanel({ fallbackRedirectUrl }: SsoCallbackPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const clerk = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const [failed, setFailed] = useState(false);
  const [configBlocked, setConfigBlocked] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!isLoaded || isSignedIn || failed || configBlocked) {
      return undefined;
    }

    const redirectKey = window.location.href;
    if (handledRedirectKeys.has(redirectKey)) {
      return undefined;
    }
    handledRedirectKeys.add(redirectKey);

    void clerk
      .handleRedirectCallback({
        signInUrl: SIGN_IN_PATH,
        signUpUrl: SIGN_UP_PATH,
        continueSignUpUrl: SIGN_UP_CONTINUE_PATH,
        signInFallbackRedirectUrl: fallbackRedirectUrl,
        signUpFallbackRedirectUrl: fallbackRedirectUrl,
      })
      .then(() => {
        if (clerk.user) {
          return;
        }

        const pendingSignUp = clerk.client?.signUp;
        if (!pendingSignUp || pendingSignUp.status !== "missing_requirements") {
          return;
        }

        if (isStuckOAuthSignUp(pendingSignUp)) {
          setConfigBlocked(true);
          return;
        }

        void navigate(SIGN_UP_CONTINUE_PATH, { replace: true });
      })
      .catch(() => {
        setFailed(true);
      });

    return undefined;
  }, [clerk, configBlocked, failed, fallbackRedirectUrl, isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    if (isSignedIn || failed || configBlocked) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setTimedOut(true), SSO_CALLBACK_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [configBlocked, failed, isSignedIn]);

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (isSignedIn) {
    return <Navigate to={fallbackRedirectUrl} replace />;
  }

  if (configBlocked) {
    return <AuthConfigBlocked />;
  }

  if (failed || timedOut) {
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
