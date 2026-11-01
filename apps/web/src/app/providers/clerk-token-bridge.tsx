import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";

import type { ClerkTokenBridgeProps } from "@/app/providers/clerk-token-bridge.types.js";
import { AuthTokenContext, type GetAuthToken } from "@/shared/hooks";

/**
 * Bridges Clerk `getToken` into the API client. While Clerk is still hydrating
 * after a refresh, returns null so callers do not send a stale/empty Bearer.
 */
export function ClerkTokenBridge({ children }: ClerkTokenBridgeProps) {
  const { isLoaded, getToken } = useAuth();

  const value = useMemo<GetAuthToken>(() => {
    return async () => {
      if (!isLoaded) {
        return null;
      }
      return getToken();
    };
  }, [getToken, isLoaded]);

  return <AuthTokenContext.Provider value={value}>{children}</AuthTokenContext.Provider>;
}
