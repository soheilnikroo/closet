import { ClerkAuthGate } from "@/features/auth-gate/clerk-auth-gate.js";
import { OfflineWarmup } from "@/features/pwa-reload-prompt/offline-warmup.js";
import { isClerkEnabled } from "@/shared/config";
/**
 * Protects a route subtree when Clerk is configured.
 * When Clerk keys are missing (local foundation / e2e), children render for guest exploration.
 */
import { useOfflineOnly } from "@/shared/lib/offline/offline-context.js";

import type { AuthGateProps } from "./auth-gate.types.js";

export function AuthGate({ children }: AuthGateProps) {
  const offlineOnly = useOfflineOnly();
  const content = (
    <>
      <OfflineWarmup />
      {children}
    </>
  );
  if (offlineOnly || !isClerkEnabled()) {
    return content;
  }

  return <ClerkAuthGate>{content}</ClerkAuthGate>;
}
