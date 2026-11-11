import { SignUp } from "@clerk/clerk-react";
import { useLocation, useSearchParams } from "react-router";

import { ClerkGuestOnly, SsoCallbackPanel } from "@/features/auth-gate";
import { authAppearance } from "@/features/auth-welcome/auth-appearance.js";
import { AuthWelcome, DemoWelcome } from "@/features/auth-welcome/auth-welcome.js";
import { SignUpContinueGuard } from "@/pages/sign-up-page/sign-up-continue-guard.js";
import { buildSignInHref, isClerkEnabled, resolvePostAuthRedirect } from "@/shared/config";

export function SignUpPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const clerkEnabled = isClerkEnabled();
  const fallbackRedirectUrl = resolvePostAuthRedirect(params.get("redirect_url"));
  const isSsoCallback = location.pathname.includes("/sso-callback");
  const isContinue = location.pathname.includes("/continue");

  if (!clerkEnabled) {
    return <DemoWelcome signup={true} redirectTo={fallbackRedirectUrl} />;
  }

  if (isSsoCallback) {
    return <SsoCallbackPanel fallbackRedirectUrl={fallbackRedirectUrl} />;
  }

  return (
    <ClerkGuestOnly redirectTo={fallbackRedirectUrl}>
      {isContinue ? (
        <SignUpContinueGuard fallbackRedirectUrl={fallbackRedirectUrl} />
      ) : (
        <AuthWelcome signup={true}>
          <SignUp
            appearance={authAppearance}
            routing="path"
            path="/sign-up"
            signInUrl={buildSignInHref(fallbackRedirectUrl)}
            fallbackRedirectUrl={fallbackRedirectUrl}
          />
        </AuthWelcome>
      )}
    </ClerkGuestOnly>
  );
}
