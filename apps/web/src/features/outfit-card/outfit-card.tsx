import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { useOutfitSwipe } from "@/features/outfit-card/model/use-outfit-swipe.js";
import type { OutfitCardProps } from "@/features/outfit-card/outfit-card.types.js";
import { OutfitActions } from "@/features/outfit-card/ui/outfit-actions.js";
import { OutfitItemsGrid } from "@/features/outfit-card/ui/outfit-items-grid.js";
import { SwipeBadges } from "@/features/outfit-card/ui/swipe-badges.js";
import { softSpring } from "@/shared/lib";
import { Card, Chip } from "@/shared/ui";

export function OutfitCard({
  recommendation,
  onLike,
  onDislike,
  onSave,
  onRegenerate,
  busy,
  swipeable = true,
}: OutfitCardProps) {
  const { t } = useTranslation();
  const swipe = useOutfitSwipe({
    enabled: swipeable && !busy,
    onLike,
    onDislike,
  });

  return (
    <motion.div
      className="relative touch-pan-y"
      style={swipe.canSwipe ? { x: swipe.x, rotate: swipe.rotate } : undefined}
      drag={swipe.canSwipe ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.92}
      onDragEnd={swipe.handleDragEnd}
      transition={softSpring}
      whileTap={swipe.canSwipe ? { cursor: "grabbing" } : undefined}
    >
      <div className="empty:hidden">
        {swipe.canSwipe ? (
          <SwipeBadges
            likeLabel={t("today.like")}
            dislikeLabel={t("today.dislike")}
            likeOpacity={swipe.likeOpacity}
            dislikeOpacity={swipe.dislikeOpacity}
          />
        ) : null}
      </div>

      <Card elevated className="space-y-4 select-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-on-surface-variant uppercase">
              {t("today.outfitLabel")}
            </p>
            <h2 className="mt-1 font-display text-2xl leading-tight text-on-surface">
              {recommendation.outfit.name ?? t("today.outfitLabel")}
            </h2>
          </div>
          <div className="empty:hidden">
            {recommendation.outfit.style ? (
              <Chip selected>{recommendation.outfit.style.replaceAll("_", " ")}</Chip>
            ) : null}
          </div>
        </div>

        <p className="md-label-small rounded-full bg-secondary-container px-3 py-1.5 text-center text-on-secondary-container empty:hidden">
          {swipe.canSwipe ? t("today.swipeHint") : null}
        </p>

        <OutfitItemsGrid items={recommendation.outfit.items} />

        <p className="text-sm leading-relaxed text-on-surface-variant">
          {recommendation.explanation}
        </p>

        <OutfitActions
          busy={busy}
          likeLabel={t("today.like")}
          dislikeLabel={t("today.dislike")}
          saveLabel={t("today.save")}
          regenerateLabel={t("today.regenerate")}
          onLike={onLike}
          onDislike={onDislike}
          onSave={onSave}
          onRegenerate={onRegenerate}
        />
      </Card>
    </motion.div>
  );
}
