import { useMemo } from "react";

import { getApiBaseUrl } from "@/shared/config";
import { useAuthToken } from "@/shared/hooks/auth-token-context.js";
import { createApiClient, type ApiClient } from "@/shared/lib";

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
