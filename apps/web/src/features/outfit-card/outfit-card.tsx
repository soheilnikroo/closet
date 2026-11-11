import { motion, useDragControls } from "motion/react";
import { useTranslation } from "react-i18next";

import { useOutfitSwipe } from "@/features/outfit-card/model/use-outfit-swipe.js";
import type { OutfitCardProps } from "@/features/outfit-card/outfit-card.types.js";
import { OutfitActions } from "@/features/outfit-card/ui/outfit-actions.js";
import { OutfitItemsGrid } from "@/features/outfit-card/ui/outfit-items-grid.js";
import { SwipeBadges } from "@/features/outfit-card/ui/swipe-badges.js";
import { softSpring } from "@/shared/lib";
import { Button, Card } from "@/shared/ui";

export function OutfitCard({
  recommendation,
  onReplace,
  onTryOn,
  onLike,
  onDislike,
  onSave,
  onRegenerate,
  busy,
  swipeable = true,
}: OutfitCardProps) {
  const { t } = useTranslation();
  const dragControls = useDragControls();
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
      dragListener={false}
      dragControls={dragControls}
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

      <Card
        elevated
        className="space-y-4 border border-outline-variant/60 bg-surface-container-lowest shadow-none select-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="md-label-medium text-primary">{t("today.outfitLabel")}</p>
            <h2 className="md-title-large mt-1 text-on-surface">
              {recommendation.outfit.name ?? t("today.outfitLabel")}
            </h2>
          </div>
          <div className="empty:hidden">
            {recommendation.outfit.style ? (
              <span className="inline-block rounded-full bg-secondary-container px-3 py-2 text-xs text-on-secondary-container">
                {recommendation.outfit.style.replaceAll("_", " ")}
              </span>
            ) : null}
          </div>
        </div>

        <div
          onPointerDown={(event) => {
            if (swipe.canSwipe && event.isPrimary) {
              dragControls.start(event);
            }
          }}
          className="touch-pan-y"
        >
          <OutfitItemsGrid items={recommendation.outfit.items} />
        </div>

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

        <details className="rounded-md bg-surface-container-low px-3">
          <summary className="md-state-layer md-label-large min-h-12 cursor-pointer py-3 text-primary">
            {t("experience.whyOutfit")}
          </summary>
          <p className="md-body-medium pb-3 text-on-surface-variant">
            {recommendation.explanation}
          </p>
        </details>

        <p className="md-body-small text-center text-on-surface-variant empty:hidden">
          {swipe.canSwipe ? t("today.swipeHint") : null}
        </p>

        {onReplace ? (
          <details className="rounded-2xl bg-surface-container p-3">
            <summary className="md-state-layer min-h-12 cursor-pointer py-3 text-sm font-semibold text-primary">
              {t("experience.swap")}
            </summary>
            <div className="flex flex-wrap gap-2">
              {recommendation.outfit.items.map((entry) => (
                <Button
                  key={entry.clothingItemId}
                  variant="tonal"
                  size="sm"
                  disabled={busy}
                  onClick={() => onReplace(entry)}
                >
                  {entry.item?.name ?? entry.role}
                </Button>
              ))}
            </div>
          </details>
        ) : null}
        {onTryOn ? (
          <Button variant="tonal" fullWidth disabled={busy} onClick={onTryOn}>
            {t("experience.preview")}
          </Button>
        ) : null}
      </Card>
    </motion.div>
  );
}
