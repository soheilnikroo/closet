import { useMemo } from "react";

import { getApiBaseUrl } from "@/shared/config";
import { useAuthToken } from "@/shared/hooks/auth-token-context.js";
import { createApiClient, type ApiClient } from "@/shared/lib";
import { useOfflineAccount, useOfflineOnly } from "@/shared/lib/offline/offline-context.js";

export function useApiClient(): ApiClient {
  const getToken = useAuthToken();
  const offlineAccount = useOfflineAccount();
  const offlineOnly = useOfflineOnly();

  return useMemo(
    () =>
      createApiClient({
        baseUrl: getApiBaseUrl(),
        getToken,
        offlineAccount,
        offlineOnly,
      }),
    [getToken, offlineAccount, offlineOnly],
  );
}
