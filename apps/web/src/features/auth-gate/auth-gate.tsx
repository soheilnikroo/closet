import { ClerkAuthGate } from "@/features/auth-gate/clerk-auth-gate.js";
import { isClerkEnabled } from "@/shared/config";

import type { AuthGateProps } from "./auth-gate.types.js";

/**
 * Protects a route subtree when Clerk is configured.
 * When Clerk keys are missing (local foundation / e2e), children render for guest exploration.
 */
export function AuthGate({ children }: AuthGateProps) {
  if (!isClerkEnabled()) {
    return children;
  }

  return <ClerkAuthGate>{children}</ClerkAuthGate>;
}
