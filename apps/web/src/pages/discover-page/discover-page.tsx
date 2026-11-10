import { motion } from "motion/react";

import { useDiscoverPage } from "@/pages/discover-page/model/use-discover-page.js";
import { GapList } from "@/pages/discover-page/ui/gap-list.js";
import { fadeUp, Match } from "@/shared/lib";
import { Card, EmptyState } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

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

        <Card className="text-sm text-error empty:hidden">{page.error}</Card>

        <Match
          value={page.viewMode}
          cases={{
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
      </motion.div>
    </AppShell>
  );
}
