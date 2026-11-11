import { discoverGapsResponseSchema } from "@closet/shared";
import type { DiscoverGapsResponse } from "@closet/shared";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { useApiClient } from "@/shared/hooks";

export type DiscoverViewMode = "empty" | "gaps" | "loading";

export function useDiscoverPage() {
  const { t, i18n } = useTranslation();
  const api = useApiClient();
  const [data, setData] = useState<DiscoverGapsResponse | null>(
    () =>
      api.cached("/v1/discover/gaps", (payload) => discoverGapsResponseSchema.parse(payload)) ??
      null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      setError(null);
      try {
        const gaps = await api.getDiscoverGaps();
        if (!cancelled) {
          setData(gaps);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("common.error"));
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [api, t]);

  async function reload() {
    setError(null);
    try {
      setData(await api.fresh().getDiscoverGaps());
    } catch (err) {
      setError(t("common.error"));
      throw err;
    }
  }

  const gaps = data?.gaps ?? [];

  const viewMode: DiscoverViewMode =
    !data && !error ? "loading" : data && gaps.length === 0 ? "empty" : "gaps";

  return {
    t,
    i18n,
    reload,
    busy: isPending,
    error,
    gaps,
    products: data?.products ?? [],
    viewMode,
  };
}
