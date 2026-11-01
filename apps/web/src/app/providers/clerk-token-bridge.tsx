import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";

import type { ClerkTokenBridgeProps } from "@/app/providers/clerk-token-bridge.types.js";
import { AuthTokenContext, type GetAuthToken } from "@/shared/hooks";

export function ClerkTokenBridge({ children }: ClerkTokenBridgeProps) {
  const { getToken } = useAuth();

  const value = useMemo<GetAuthToken>(() => {
    return async () => getToken();
  }, [getToken]);

  return <AuthTokenContext.Provider value={value}>{children}</AuthTokenContext.Provider>;
}
