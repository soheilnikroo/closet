import { motion } from "motion/react";

import { InteractiveOutfitCard as OutfitCard } from "@/features/outfit-card/interactive-outfit-card.js";
import type { OutfitListProps } from "@/pages/today-page/ui/outfit-list.types.js";
import { staggerContainer, staggerItem } from "@/shared/lib";

export function OutfitList({
  primary,
  alternatives,
  busy,
  onFeedback,
  onRegenerate,
  alternativesTitle,
}: OutfitListProps) {
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
      {alternatives.length > 0 ? (
        <details className="rounded-md border border-outline-variant p-4">
          <summary className="md-state-layer md-title-medium min-h-12 cursor-pointer py-3">
            {alternativesTitle} · {alternatives.length}
          </summary>
          <motion.div className="space-y-3" {...staggerContainer}>
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
        </details>
      ) : null}
    </>
  );
}
