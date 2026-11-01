import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router";

import { AuthLoading } from "@/features/auth-gate/auth-loading.js";

import type { ClerkGuestOnlyProps } from "./clerk-guest-only.types.js";

/**
 * For `/sign-in` and `/sign-up`: wait for Clerk, send already-authenticated users
 * to their post-auth destination (refresh-safe), otherwise render the auth UI.
 */
export function ClerkGuestOnly({ children, redirectTo }: ClerkGuestOnlyProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (isSignedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
