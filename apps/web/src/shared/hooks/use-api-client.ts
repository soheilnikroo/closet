import { useMemo } from "react";

import { getApiBaseUrl } from "@/shared/config";
import { createApiClient, type ApiClient } from "@/shared/lib";

import { useAuthToken } from "./auth-token-context.js";

export function useApiClient(): ApiClient {
  const getToken = useAuthToken();

  return useMemo(
    () =>
      createApiClient({
        baseUrl: getApiBaseUrl(),
        getToken,
      }),
    [getToken],
  );
}
