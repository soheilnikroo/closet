import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router";

import { AuthLoading } from "@/features/auth-gate/auth-loading.js";
import { buildSignInHref, resolvePostAuthRedirect } from "@/shared/config";

import type { AuthGateProps } from "./auth-gate.types.js";

export function ClerkAuthGate({ children }: AuthGateProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (!isSignedIn) {
    const returnTo = resolvePostAuthRedirect(`${location.pathname}${location.search}`);
    return <Navigate to={buildSignInHref(returnTo)} replace />;
  }

  return children;
}
