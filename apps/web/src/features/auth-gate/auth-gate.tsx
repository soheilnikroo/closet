import type { AuthGateProps } from "@/features/auth-gate/auth-gate.types.js";
import { ClerkAuthGate } from "@/features/auth-gate/clerk-auth-gate.js";
import { getOptionalClerkPublishableKey } from "@/shared/config";

/**
 * Protects a route subtree when Clerk is configured.
 * When Clerk keys are missing (local foundation / e2e), children render for guest exploration.
 */
export function AuthGate({ children }: AuthGateProps) {
  const publishableKey = getOptionalClerkPublishableKey();
  const clerkEnabled = Boolean(publishableKey) && !publishableKey?.includes("replace_me");

  if (!clerkEnabled) {
    return children;
  }

  return <ClerkAuthGate>{children}</ClerkAuthGate>;
}
