import { motion } from "motion/react";
import { useNavigate } from "react-router";

import { useDiscoverPage } from "@/pages/discover-page/model/use-discover-page.js";
import { GapList } from "@/pages/discover-page/ui/gap-list.js";
import { ProductIdeas } from "@/pages/discover-page/ui/product-ideas.js";
import { fadeUp, Match } from "@/shared/lib";
import { Card, EmptyState } from "@/shared/ui";
import { PageSkeleton } from "@/shared/ui/skeleton.js";
import { AppShell } from "@/widgets/app-shell";

export function DiscoverPage() {
  const page = useDiscoverPage();
  const navigate = useNavigate();

  return (
    <AppShell onRefresh={page.busy ? undefined : page.reload} title={page.t("discover.title")}>
      <motion.div className="space-y-4" {...fadeUp}>
        <section className="page-intro">
          <p className="eyebrow">{page.t("refine.discoverEyebrow")}</p>
          <h2>{page.t("refine.discoverTitle")}</h2>
          <p className="intro-description">{page.t("refine.discoverHint")}</p>
        </section>

        <Card className="text-sm text-error empty:hidden">{page.error}</Card>

        <Match
          value={page.viewMode}
          cases={{
            empty:
              page.products.length > 0 ? null : (
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
                addLabel={page.t("discover.addGap")}
                onAdd={(gap) => {
                  const slug = gap.categorySlug === "basics" ? "new" : gap.categorySlug;
                  void navigate(`/closet?add=${slug}`);
                }}
              />
            ),
            loading: <PageSkeleton variant="list" label={page.t("experience.loading")} />,
          }}
        />
        <ProductIdeas products={page.products} />
      </motion.div>
    </AppShell>
  );
}
