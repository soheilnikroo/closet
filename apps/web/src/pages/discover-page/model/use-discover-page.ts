import type { DiscoverGapsResponse } from "@closet/shared";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { useApiClient, useDisclosure } from "@/shared/hooks";

export type DiscoverViewMode = "error" | "empty" | "gaps" | "loading";

export function useDiscoverPage() {
  const { t, i18n } = useTranslation();
  const api = useApiClient();
  const chat = useDisclosure();
  const [data, setData] = useState<DiscoverGapsResponse | null>(null);
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

  const gaps = data?.gaps ?? [];

  const viewMode: DiscoverViewMode = error
    ? "error"
    : isPending && !data
      ? "loading"
      : data && gaps.length === 0
        ? "empty"
        : "gaps";

  return {
    t,
    i18n,
    busy: isPending,
    error,
    gaps,
    viewMode,
    chat,
  };
}
