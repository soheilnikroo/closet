import { motion } from "motion/react";

import type { SwipeBadgesProps } from "@/features/outfit-card/ui/swipe-badges.types.js";

export function SwipeBadges({
  likeLabel,
  dislikeLabel,
  likeOpacity,
  dislikeOpacity,
}: SwipeBadgesProps) {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute inset-x-4 top-5 z-20 flex justify-start"
        style={{ opacity: likeOpacity }}
      >
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-on-primary uppercase shadow-elevation-2">
          {likeLabel}
        </span>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-x-4 top-5 z-20 flex justify-end"
        style={{ opacity: dislikeOpacity }}
      >
        <span className="rounded-full bg-inverse-surface px-3 py-1 text-xs font-bold tracking-wide text-inverse-on-surface uppercase shadow-elevation-2">
          {dislikeLabel}
        </span>
      </motion.div>
    </>
  );
}
