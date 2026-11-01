import type { Occasion, Recommendation, TodayResponse } from "@closet/shared";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { OutfitCard, StylistChatSheet } from "@/features";
import { useApiClient } from "@/shared/hooks/use-api-client.js";
import { fadeUp, softSpring, staggerContainer, staggerItem } from "@/shared/lib";
import {
  Button,
  Card,
  CelebrationBurst,
  type CelebrationKind,
  Chip,
  EmptyState,
  Fab,
} from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

export function TodayPage() {
  const { t, i18n } = useTranslation();
  const api = useApiClient();
  const [data, setData] = useState<TodayResponse | null>(null);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{
    open: boolean;
    kind: CelebrationKind;
    label: string;
  }>({ open: false, kind: "success", label: "" });

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const [today, occasionList] = await Promise.all([api.getToday(), api.listOccasions()]);
      setData(today);
      setOccasions(occasionList.occasions);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }, [api, t]);

  useEffect(() => {
    void load();
  }, [load]);

  function celebrate(kind: CelebrationKind, label: string) {
    setCelebration({ open: true, kind, label });
  }

  async function feedback(rec: Recommendation, action: "like" | "dislike" | "save") {
    setBusy(true);
    try {
      await api.submitFeedback(rec.id, { action });
      if (action === "like") {
        celebrate("like", t("today.celebrateLike"));
      } else if (action === "save") {
        celebrate("save", t("today.celebrateSave"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function regenerate(occasionSlug?: string | null) {
    setBusy(true);
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
    } finally {
      setBusy(false);
    }
  }

  const weather = data?.weather;
  const primary = data?.primary;
  const showEmpty = !busy && !error && !primary && !data?.message;

  return (
    <AppShell title={t("today.title")}>
      <motion.div className="space-y-4" {...fadeUp}>
        {weather ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={softSpring}
          >
            <Card className="flex items-center justify-between gap-3 bg-tertiary-container text-on-tertiary-container">
              <div>
                <p className="md-label-medium tracking-[0.08em] text-on-tertiary-container/80 uppercase">
                  {t("today.weather")}
                </p>
                <p className="mt-1 font-display text-2xl leading-8 font-medium">
                  {Math.round(weather.feelsLike)}° · {weather.condition.replaceAll("_", " ")}
                </p>
                <p className="md-body-medium opacity-80">{weather.cityName}</p>
              </div>
              <div className="md-body-medium text-end opacity-85">
                <div>
                  {Math.round(weather.minTemperature)}° / {Math.round(weather.maxTemperature)}°
                </div>
                <div className="mt-1">
                  {t("today.rain")}: {weather.precipitationProbability}%
                </div>
              </div>
            </Card>
          </motion.div>
        ) : null}

        <div className="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
          {occasions.slice(0, 8).map((occasion) => (
            <Chip
              key={occasion.id}
              selected={selectedOccasion === occasion.slug}
              onClick={() => {
                const next = selectedOccasion === occasion.slug ? null : occasion.slug;
                setSelectedOccasion(next);
                void regenerate(next);
              }}
            >
              {i18n.language === "fa-IR" ? occasion.nameFa : occasion.name}
            </Chip>
          ))}
        </div>

        {error ? <Card className="text-sm text-error">{error}</Card> : null}

        {data?.message ? (
          <Card elevated className="space-y-3">
            <p className="text-sm leading-relaxed text-on-surface-variant">{data.message}</p>
            <Button fullWidth onClick={() => void regenerate(selectedOccasion)}>
              {t("today.regenerate")}
            </Button>
          </Card>
        ) : null}

        {showEmpty ? (
          <EmptyState
            variant="stylist"
            title={t("today.emptyTitle")}
            description={t("today.emptyBody")}
            action={
              <Button fullWidth onClick={() => void regenerate(selectedOccasion)}>
                {t("today.regenerate")}
              </Button>
            }
          />
        ) : null}

        {primary ? (
          <OutfitCard
            key={primary.id}
            recommendation={primary}
            busy={busy}
            onLike={() => void feedback(primary, "like")}
            onDislike={() => void feedback(primary, "dislike")}
            onSave={() => void feedback(primary, "save")}
            onRegenerate={() => void regenerate(selectedOccasion)}
          />
        ) : null}

        {data?.alternatives?.length ? (
          <motion.div className="space-y-3" {...staggerContainer}>
            <h3 className="font-display text-xl font-semibold">{t("today.alternatives")}</h3>
            {data.alternatives.map((alt) => (
              <motion.div key={alt.id} variants={staggerItem.variants}>
                <OutfitCard
                  recommendation={alt}
                  busy={busy}
                  swipeable={false}
                  onLike={() => void feedback(alt, "like")}
                  onDislike={() => void feedback(alt, "dislike")}
                  onSave={() => void feedback(alt, "save")}
                  onRegenerate={() => void regenerate(selectedOccasion)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : null}

        <Fab
          label={t("stylist.title")}
          className="fixed end-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-20"
          onClick={() => setChatOpen(true)}
        >
          AI
        </Fab>
      </motion.div>

      <CelebrationBurst
        open={celebration.open}
        kind={celebration.kind}
        label={celebration.label}
        onDone={() => setCelebration((current) => ({ ...current, open: false }))}
      />

      <StylistChatSheet open={chatOpen} onClose={() => setChatOpen(false)} />
    </AppShell>
  );
}
