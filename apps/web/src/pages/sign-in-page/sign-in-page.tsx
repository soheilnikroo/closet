import { SignIn } from "@clerk/clerk-react";
import { useLocation, useSearchParams } from "react-router";

import { ClerkGuestOnly, SsoCallbackPanel } from "@/features/auth-gate";
import { authAppearance } from "@/features/auth-welcome/auth-appearance.js";
import { AuthWelcome, DemoWelcome } from "@/features/auth-welcome/auth-welcome.js";
import { buildSignUpHref, isClerkEnabled, resolvePostAuthRedirect } from "@/shared/config";

export function SignInPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const clerkEnabled = isClerkEnabled();
  const fallbackRedirectUrl = resolvePostAuthRedirect(params.get("redirect_url"));
  const isSsoCallback = location.pathname.includes("/sso-callback");

  if (!clerkEnabled) {
    return <DemoWelcome signup={false} redirectTo={fallbackRedirectUrl} />;
  }

  if (isSsoCallback) {
    return <SsoCallbackPanel fallbackRedirectUrl={fallbackRedirectUrl} />;
  }

  return (
    <ClerkGuestOnly redirectTo={fallbackRedirectUrl}>
      <AuthWelcome signup={false}>
        <SignIn
          appearance={authAppearance}
          routing="path"
          path="/sign-in"
          signUpUrl={buildSignUpHref(fallbackRedirectUrl)}
          fallbackRedirectUrl={fallbackRedirectUrl}
        />
      </AuthWelcome>
    </ClerkGuestOnly>
  );
}
