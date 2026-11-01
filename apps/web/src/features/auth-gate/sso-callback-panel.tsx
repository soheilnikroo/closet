import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router";

import { AuthLoading } from "@/features/auth-gate/auth-loading.js";

import type { SsoCallbackPanelProps } from "./sso-callback-panel.types.js";

/**
 * Completes OAuth/SSO. If the session is already active (e.g. user refreshed
 * after a successful callback), skip Clerk's spinner and go to the app.
 */
export function SsoCallbackPanel({ fallbackRedirectUrl }: SsoCallbackPanelProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (isSignedIn) {
    return <Navigate to={fallbackRedirectUrl} replace />;
  }

  return (
    <>
      <AuthLoading />
      <AuthenticateWithRedirectCallback
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        signInFallbackRedirectUrl={fallbackRedirectUrl}
        signUpFallbackRedirectUrl={fallbackRedirectUrl}
      />
    </>
  );
}
