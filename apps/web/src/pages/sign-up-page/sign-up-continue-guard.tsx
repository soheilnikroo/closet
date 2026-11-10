import { SignUp, useClerk, useSignUp } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";

import { AuthLoading } from "@/features/auth-gate/auth-loading.js";
import { completeStuckSignUp } from "@/features/auth-gate/complete-stuck-signup.js";
import { isSatisfiedIncompleteSignUp } from "@/features/auth-gate/is-satisfied-incomplete-signup.js";
import { SignUpContinueRecovery } from "@/features/auth-gate/signup-continue-recovery.js";
import { buildSignInHref } from "@/shared/config";

type SignUpContinueGuardProps = {
  fallbackRedirectUrl: string;
};

/**
 * Clerk's continue step stays mounted. A background attempt may finish a
 * sign-up that already has email + password. It never covers the page with a
 * spinner — a previous version set `recovering` and then cancelled itself.
 */
export function SignUpContinueGuard({ fallbackRedirectUrl }: SignUpContinueGuardProps) {
  const { isLoaded, signUp } = useSignUp();
  const clerk = useClerk();
  const started = useRef(false);
  const mounted = useRef(true);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !signUp || started.current || showRecovery) {
      return undefined;
    }
    if (!isSatisfiedIncompleteSignUp(signUp)) {
      return undefined;
    }

    started.current = true;

    void completeStuckSignUp(clerk, signUp).then((result) => {
      if (!mounted.current) {
        return;
      }
      if (result.ok) {
        window.location.assign(fallbackRedirectUrl);
        return;
      }
      setShowRecovery(true);
    });

    return undefined;
  }, [clerk, fallbackRedirectUrl, isLoaded, showRecovery, signUp]);

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (showRecovery) {
    return <SignUpContinueRecovery />;
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
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
