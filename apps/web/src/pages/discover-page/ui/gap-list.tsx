import { motion } from "motion/react";

import type { GapListProps } from "@/pages/discover-page/ui/gap-list.types.js";
import { localeLabel, pressableCard, staggerContainer, staggerItem } from "@/shared/lib";
import { Card } from "@/shared/ui";

export function GapList({ gaps, language, gapLabel }: GapListProps) {
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
