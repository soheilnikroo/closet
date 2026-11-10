import { motion } from "motion/react";

import { useTodayPage } from "@/pages/today-page/model/use-today-page.js";
import { OccasionChips } from "@/pages/today-page/ui/occasion-chips.js";
import { OutfitList } from "@/pages/today-page/ui/outfit-list.js";
import { TodayMessageCard } from "@/pages/today-page/ui/today-message-card.js";
import { TodayWeatherCard } from "@/pages/today-page/ui/today-weather-card.js";
import { fadeUp, Match } from "@/shared/lib";
import { Button, Card, CelebrationBurst, EmptyState } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

export function TodayPage() {
  const page = useTodayPage();

  return (
    <AppShell title={page.t("today.title")}>
      <motion.div className="space-y-4" {...fadeUp}>
        <div className="empty:hidden">
          {page.weather ? <TodayWeatherCard weather={page.weather} /> : null}
        </div>

        <OccasionChips
          occasions={page.occasions}
          selectedOccasion={page.selectedOccasion}
          language={page.i18n.language}
          onSelect={page.selectOccasion}
        />

        <Card className="text-sm text-error empty:hidden">{page.error}</Card>

        <Match
          value={page.viewMode}
          cases={{
            message: page.message ? (
              <TodayMessageCard
                message={page.message}
                regenerateLabel={page.t("today.regenerate")}
                onRegenerate={() => page.regenerate(page.selectedOccasion)}
              />
            ) : null,
            empty: (
              <EmptyState
                variant="stylist"
                title={page.t("today.emptyTitle")}
                description={page.t("today.emptyBody")}
                action={
                  <Button fullWidth onClick={() => page.regenerate(page.selectedOccasion)}>
                    {page.t("today.regenerate")}
                  </Button>
                }
              />
            ),
            outfit: page.primary ? (
              <OutfitList
                primary={page.primary}
                alternatives={page.alternatives}
                busy={page.busy}
                onFeedback={page.submitFeedback}
                onRegenerate={() => page.regenerate(page.selectedOccasion)}
                alternativesTitle={page.t("today.alternatives")}
              />
            ) : null,
          }}
        />
      </motion.div>

      <CelebrationBurst
        open={page.celebration.open}
        kind={page.celebration.kind}
        label={page.celebration.label}
        onDone={page.dismissCelebration}
      />
    </AppShell>
  );
}
