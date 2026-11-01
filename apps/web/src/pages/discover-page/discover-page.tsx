import type { DiscoverGapsResponse } from "@closet/shared";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { StylistChatSheet } from "@/features";
import { useApiClient } from "@/shared/hooks/use-api-client.js";
import { fadeUp, pressableCard, staggerContainer, staggerItem } from "@/shared/lib";
import { Card, EmptyState, Fab } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

export function DiscoverPage() {
  const { t, i18n } = useTranslation();
  const api = useApiClient();
  const [data, setData] = useState<DiscoverGapsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const gaps = await api.getDiscoverGaps();
      setData(gaps);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    }
  }, [api, t]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <AppShell title={t("discover.title")}>
      <motion.div className="space-y-4" {...fadeUp}>
        <Card elevated>
          <p className="text-sm leading-relaxed text-on-surface-variant">{t("discover.intro")}</p>
        </Card>

        {error ? <Card className="text-sm text-error">{error}</Card> : null}

        <motion.div className="space-y-3" {...staggerContainer}>
          {data?.gaps.map((gap) => (
            <motion.div
              key={`${gap.categorySlug}-${gap.priority}`}
              variants={staggerItem.variants}
              {...pressableCard}
            >
              <Card className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.14em] text-on-surface-variant uppercase">
                  {t("discover.gapLabel")}
                </p>
                <h3 className="font-display text-xl font-semibold text-on-surface">
                  {i18n.language === "fa-IR" ? gap.categoryNameFa : gap.categoryName}
                </h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {i18n.language === "fa-IR" ? gap.reasonFa : gap.reason}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {data && data.gaps.length === 0 ? (
          <EmptyState
            variant="balanced"
            title={t("discover.noGapsTitle")}
            description={t("discover.noGapsBody")}
          />
        ) : null}

        <Fab
          label={t("stylist.title")}
          className="fixed end-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-20"
          onClick={() => setChatOpen(true)}
        >
          AI
        </Fab>
      </motion.div>

      <StylistChatSheet open={chatOpen} onClose={() => setChatOpen(false)} />
    </AppShell>
  );
}
