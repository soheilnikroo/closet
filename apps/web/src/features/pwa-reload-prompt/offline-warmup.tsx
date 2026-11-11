import { useEffect } from "react";

import { useApiClient } from "@/shared/hooks";
import { useOffline, useOfflineAccount } from "@/shared/lib/offline/offline-context.js";
const prepared = new Map<string, number>();

/** Prepare core read-only pages after the current screen has had time to settle. */
export function OfflineWarmup() {
  const api = useApiClient();
  const account = useOfflineAccount();
  const offline = useOffline();
  useEffect(() => {
    if (!account || offline || Date.now() - (prepared.get(account) ?? 0) < 300_000) {
      return undefined;
    }
    let active = true;
    const timer = window.setTimeout(() => {
      if (!active) {
        return;
      }
      prepared.set(account, Date.now());
      void Promise.allSettled([
        api.listItems(),
        api.listCategories(),
        api.getMe(),
        api.listOccasions(),
        api.getProfile(),
        api.getStyleProfile(),
        api.getPreferences(),
        api.listCities(),
        api.getDiscoverGaps(),
        api.listCollections().then(async ({ collections }) => {
          if (!active) {
            return;
          }
          await Promise.allSettled(
            collections.slice(0, 10).map((collection) => api.getCollection(collection.id)),
          );
        }),
      ]);
    }, 2000);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [account, api, offline]);
  return null;
}
