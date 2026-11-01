import type { DiscoverGap } from "@closet/shared";
import { motion } from "motion/react";

import { StylistChatSheet } from "@/features";
import {
  fadeUp,
  localeLabel,
  Match,
  pressableCard,
  staggerContainer,
  staggerItem,
} from "@/shared/lib";
import { Card, EmptyState, Fab } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

import { useDiscoverPage } from "./model/use-discover-page.js";

function GapList({
  gaps,
  language,
  gapLabel,
}: {
  gaps: DiscoverGap[];
  language: string;
  gapLabel: string;
}) {
  return (
    <motion.div className="space-y-3 empty:hidden" {...staggerContainer}>
      {gaps.map((gap) => (
        <motion.div
          key={`${gap.categorySlug}-${gap.priority}`}
          variants={staggerItem.variants}
          {...pressableCard}
        >
          <Card className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.14em] text-on-surface-variant uppercase">
              {gapLabel}
            </p>
            <h3 className="font-display text-xl font-semibold text-on-surface">
              {localeLabel(language, gap.categoryName, gap.categoryNameFa)}
            </h3>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              {localeLabel(language, gap.reason, gap.reasonFa)}
            </p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function DiscoverPage() {
  const page = useDiscoverPage();

  return (
    <AppShell title={page.t("discover.title")}>
      <motion.div className="space-y-4" {...fadeUp}>
        <Card elevated>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            {page.t("discover.intro")}
          </p>
        </Card>

        <Match
          value={page.viewMode}
          cases={{
            error: <Card className="text-sm text-error">{page.error}</Card>,
            empty: (
              <EmptyState
                variant="balanced"
                title={page.t("discover.noGapsTitle")}
                description={page.t("discover.noGapsBody")}
              />
            ),
            gaps: (
              <GapList
                gaps={page.gaps}
                language={page.i18n.language}
                gapLabel={page.t("discover.gapLabel")}
              />
            ),
            loading: null,
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

      <StylistChatSheet open={page.chat.open} onClose={page.chat.onClose} />
    </AppShell>
  );
}
