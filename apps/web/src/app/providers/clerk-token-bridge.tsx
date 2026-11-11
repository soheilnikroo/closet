import { useAuth } from "@clerk/clerk-react";
import { useMemo, useEffect } from "react";

import type { ClerkTokenBridgeProps } from "@/app/providers/clerk-token-bridge.types.js";
import { getApiBaseUrl } from "@/shared/config";
import { AuthTokenContext, type GetAuthToken } from "@/shared/hooks";
import {
  OfflineAccountContext,
  readOfflineAccount,
  rememberOfflineAccount,
} from "@/shared/lib/offline/offline-context.js";
import { clearSnapshots, snapshotScope } from "@/shared/lib/offline/snapshot-cache.js";

/**
 * Bridges Clerk `getToken` into the API client. While Clerk is still hydrating
 * after a refresh, returns null so callers do not send a stale/empty Bearer.
 */
export function ClerkTokenBridge({ children }: ClerkTokenBridgeProps) {
  const { isLoaded, getToken, userId } = useAuth();
  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const previous = readOfflineAccount();
    if (previous && previous !== userId) {
      void clearSnapshots(snapshotScope(getApiBaseUrl(), previous));
    }
    rememberOfflineAccount(userId ?? null);
  }, [isLoaded, userId]);

  const value = useMemo<GetAuthToken>(() => {
    return async () => {
      if (!isLoaded) {
        return null;
      }
      return getToken();
    };
  }, [getToken, isLoaded]);

  return (
    <OfflineAccountContext.Provider
      key={userId ?? "guest"}
      value={isLoaded ? (userId ?? null) : null}
    >
      <AuthTokenContext.Provider value={value}>{children}</AuthTokenContext.Provider>
    </OfflineAccountContext.Provider>
  );
}
