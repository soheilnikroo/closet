import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";

import { AuthTokenContext, type GetAuthToken } from "@/shared/hooks";

import type { ClerkTokenBridgeProps } from "./clerk-token-bridge.types.js";

export function ClerkTokenBridge({ children }: ClerkTokenBridgeProps) {
  const { getToken } = useAuth();

  const value = useMemo<GetAuthToken>(() => {
    return async () => getToken();
  }, [getToken]);

  return <AuthTokenContext.Provider value={value}>{children}</AuthTokenContext.Provider>;
}
