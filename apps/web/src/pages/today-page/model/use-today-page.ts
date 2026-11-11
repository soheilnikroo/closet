import type { Occasion, Recommendation, TodayResponse } from "@closet/shared";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import type { TodayViewMode } from "@/pages/today-page/today-page.types.js";
import { useApiClient } from "@/shared/hooks";
import type { CelebrationKind } from "@/shared/ui";

export function useTodayPage() {
  const { t, i18n } = useTranslation();
  const api = useApiClient();
  const [data, setData] = useState<TodayResponse | null>(null);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [celebration, setCelebration] = useState<{
    open: boolean;
    kind: CelebrationKind;
    label: string;
  }>({ open: false, kind: "success", label: "" });

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      setError(null);
      try {
        const [today, occasionList] = await Promise.all([api.getToday(), api.listOccasions()]);
        if (cancelled) {
          return;
        }
        setData(today);
        setOccasions(occasionList.occasions);
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

  function celebrate(kind: CelebrationKind, label: string) {
    setCelebration({ open: true, kind, label });
  }

  function dismissCelebration() {
    setCelebration((current) => ({ ...current, open: false }));
  }

  function submitFeedback(rec: Recommendation, action: "like" | "dislike" | "save") {
    startTransition(async () => {
      try {
        await api.submitFeedback(rec.id, { action });
        const celebrationByAction = {
          like: () => celebrate("like", t("today.celebrateLike")),
          save: () => celebrate("save", t("today.celebrateSave")),
          dislike: () => undefined,
        } as const;
        celebrationByAction[action]();
        if (action === "dislike") {
          regenerate(selectedOccasion);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }

  function regenerate(occasionSlug?: string | null) {
    startTransition(async () => {
      setError(null);
      try {
        const result = await api.createRecommendations({
          regenerate: true,
          occasionSlug: occasionSlug ?? undefined,
        });
        setData((current) => ({
          primary: result.primary,
          alternatives: result.alternatives,
          weather: current?.weather ?? result.primary.weather ?? null,
          wardrobeItemCount: current?.wardrobeItemCount ?? 0,
          message: null,
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }

  function selectOccasion(slug: string) {
    const next = selectedOccasion === slug ? null : slug;
    setSelectedOccasion(next);
    regenerate(next);
  }

  const primary = data?.primary ?? null;
  const weather = data?.weather ?? null;
  const alternatives = data?.alternatives ?? [];

  const viewMode: TodayViewMode =
    !data && !error
      ? "loading"
      : data?.message
        ? "message"
        : !isPending && !primary
          ? "empty"
          : "outfit";

  return {
    t,
    i18n,
    busy: isPending,
    error,
    weather,
    occasions: occasions.slice(0, 8),
    selectedOccasion,
    selectOccasion,
    viewMode,
    message: data?.message ?? null,
    primary,
    alternatives,
    regenerate,
    submitFeedback,
    celebration,
    dismissCelebration,
  };
}
