import { SignUp } from "@clerk/clerk-react";
import { useLocation, useSearchParams } from "react-router";

import { ClerkGuestOnly, SsoCallbackPanel } from "@/features/auth-gate";
import { SignUpContinueGuard } from "@/pages/sign-up-page/sign-up-continue-guard.js";
import { buildSignInHref, isClerkEnabled, resolvePostAuthRedirect } from "@/shared/config";
import { Card } from "@/shared/ui";

export function SignUpPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const clerkEnabled = isClerkEnabled();
  const fallbackRedirectUrl = resolvePostAuthRedirect(params.get("redirect_url"));
  const isSsoCallback = location.pathname.includes("/sso-callback");
  const isContinue = location.pathname.includes("/continue");

  if (!clerkEnabled) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg items-center px-4 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
        <Card elevated>
          <p className="text-sm text-on-surface-variant">
            Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in `.env` to enable Clerk sign-up.
          </p>
        </Card>
      </div>
    );
  }

  if (isSsoCallback) {
    return <SsoCallbackPanel fallbackRedirectUrl={fallbackRedirectUrl} />;
  }

  return (
    <ClerkGuestOnly redirectTo={fallbackRedirectUrl}>
      {isContinue ? (
        <SignUpContinueGuard fallbackRedirectUrl={fallbackRedirectUrl} />
      ) : (
        <div className="mx-auto flex min-h-dvh max-w-lg items-center justify-center px-4 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl={buildSignInHref(fallbackRedirectUrl)}
            fallbackRedirectUrl={fallbackRedirectUrl}
          />
        </div>
      )}
    </ClerkGuestOnly>
  );
}
