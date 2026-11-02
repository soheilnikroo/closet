import { SignUp, useClerk, useSignUp } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { AuthConfigBlocked } from "@/features/auth-gate/auth-config-blocked.js";
import { AuthLoading } from "@/features/auth-gate/auth-loading.js";
import { completeStuckSignUp } from "@/features/auth-gate/complete-stuck-signup.js";
import { isStuckOAuthSignUp } from "@/features/auth-gate/is-empty-signup-continue.js";
import { isSatisfiedIncompleteSignUp } from "@/features/auth-gate/is-satisfied-incomplete-signup.js";
import { resetClerkAuthAttempts } from "@/features/auth-gate/reset-clerk-auth-attempts.js";
import { SignUpContinueRecovery } from "@/features/auth-gate/signup-continue-recovery.js";
import { SIGN_UP_PATH } from "@/features/auth-gate/sso-callback-panel.constants.js";
import { buildSignInHref } from "@/shared/config";

type SignUpContinueGuardProps = {
  fallbackRedirectUrl: string;
};

/**
 * Handles Clerk `/sign-up/continue` dead-ends:
 * - stuck Google OAuth → reset to clean sign-up
 * - email+password satisfied but status still incomplete → try legal finalize
 * - still stuck → recovery card (sign in / restart)
 */
export function SignUpContinueGuard({ fallbackRedirectUrl }: SignUpContinueGuardProps) {
  const { isLoaded, signUp } = useSignUp();
  const clerk = useClerk();
  const navigate = useNavigate();
  const attemptedComplete = useRef(false);
  const [recovering, setRecovering] = useState(false);
  const [showOAuthBlocked, setShowOAuthBlocked] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    if (!isLoaded || recovering || showOAuthBlocked || showRecovery) {
      return undefined;
    }

    if (isStuckOAuthSignUp(signUp)) {
      let cancelled = false;
      setRecovering(true);
      void (async () => {
        try {
          await resetClerkAuthAttempts(clerk);
          if (!cancelled) {
            await navigate(SIGN_UP_PATH, { replace: true });
          }
        } catch {
          if (!cancelled) {
            setShowOAuthBlocked(true);
          }
        } finally {
          if (!cancelled) {
            setRecovering(false);
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    if (!signUp || !isSatisfiedIncompleteSignUp(signUp) || attemptedComplete.current) {
      return undefined;
    }

    attemptedComplete.current = true;
    let cancelled = false;
    setRecovering(true);

    void (async () => {
      const result = await completeStuckSignUp(clerk, signUp);
      if (cancelled) {
        return;
      }
      if (result.ok) {
        await navigate(fallbackRedirectUrl, { replace: true });
        return;
      }
      setRecovering(false);
      setShowRecovery(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    clerk,
    fallbackRedirectUrl,
    isLoaded,
    navigate,
    recovering,
    showOAuthBlocked,
    showRecovery,
    signUp,
  ]);

  if (!isLoaded || recovering) {
    return <AuthLoading />;
  }

  if (showOAuthBlocked || isStuckOAuthSignUp(signUp)) {
    return <AuthConfigBlocked />;
  }

  if (showRecovery) {
    return <SignUpContinueRecovery />;
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
      {/* Required when legacy bot protection is enabled in Clerk. */}
      <div id="clerk-captcha" />
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl={buildSignInHref(fallbackRedirectUrl)}
        fallbackRedirectUrl={fallbackRedirectUrl}
      />
    </div>
  );
}
