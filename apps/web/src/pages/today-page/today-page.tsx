import type { Occasion, Recommendation } from "@closet/shared";
import { motion } from "motion/react";

import { OutfitCard, StylistChatSheet } from "@/features";
import { useTodayPage } from "@/pages/today-page/model/use-today-page.js";
import { TodayWeatherCard } from "@/pages/today-page/ui/today-weather-card.js";
import { fadeUp, localeLabel, Match, staggerContainer, staggerItem } from "@/shared/lib";
import { Button, Card, CelebrationBurst, Chip, EmptyState, Fab } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

function OccasionChips({
  occasions,
  selectedOccasion,
  language,
  onSelect,
}: {
  occasions: Occasion[];
  selectedOccasion: string | null;
  language: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
      {occasions.map((occasion) => (
        <Chip
          key={occasion.id}
          selected={selectedOccasion === occasion.slug}
          onClick={() => onSelect(occasion.slug)}
        >
          {localeLabel(language, occasion.name, occasion.nameFa)}
        </Chip>
      ))}
    </div>
  );
}

function OutfitList({
  primary,
  alternatives,
  busy,
  onFeedback,
  onRegenerate,
  alternativesTitle,
}: {
  primary: Recommendation;
  alternatives: Recommendation[];
  busy: boolean;
  onFeedback: (rec: Recommendation, action: "like" | "dislike" | "save") => void;
  onRegenerate: () => void;
  alternativesTitle: string;
}) {
  return (
    <>
      <OutfitCard
        key={primary.id}
        recommendation={primary}
        busy={busy}
        onLike={() => onFeedback(primary, "like")}
        onDislike={() => onFeedback(primary, "dislike")}
        onSave={() => onFeedback(primary, "save")}
        onRegenerate={onRegenerate}
      />
      <motion.div className="space-y-3 empty:hidden" {...staggerContainer}>
        <h3 className="font-display text-xl font-semibold empty:hidden">
          {alternatives.length > 0 ? alternativesTitle : null}
        </h3>
        {alternatives.map((alt) => (
          <motion.div key={alt.id} variants={staggerItem.variants}>
            <OutfitCard
              recommendation={alt}
              busy={busy}
              swipeable={false}
              onLike={() => onFeedback(alt, "like")}
              onDislike={() => onFeedback(alt, "dislike")}
              onSave={() => onFeedback(alt, "save")}
              onRegenerate={onRegenerate}
            />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

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
            message: (
              <Card elevated className="space-y-3">
                <p className="text-sm leading-relaxed text-on-surface-variant">{page.message}</p>
                <Button fullWidth onClick={() => page.regenerate(page.selectedOccasion)}>
                  {page.t("today.regenerate")}
                </Button>
              </Card>
            ),
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

        <Fab
          label={page.t("stylist.title")}
          className="fixed end-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-20"
          onClick={page.chat.onOpen}
        >
          AI
        </Fab>
      </motion.div>

      <CelebrationBurst
        open={page.celebration.open}
        kind={page.celebration.kind}
        label={page.celebration.label}
        onDone={page.dismissCelebration}
      />

      <StylistChatSheet open={page.chat.open} onClose={page.chat.onClose} />
    </AppShell>
  );
}
