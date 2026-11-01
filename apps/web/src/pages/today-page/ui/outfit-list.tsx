import { motion } from "motion/react";

import { OutfitCard } from "@/features";
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
