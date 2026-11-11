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

      <Card elevated className="look-card space-y-4 shadow-none select-none">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">{t("refine.pickedForYou")}</p>
            <h2 className="look-title">{t("today.outfitLabel")}</h2>
          </div>
          {recommendation.outfit.style ? (
            <span className="look-style">
              {t(
                `onboarding.styles.${recommendation.outfit.style === "smart_casual" ? "smartCasual" : recommendation.outfit.style}`,
                { defaultValue: recommendation.outfit.style.replaceAll("_", " ") },
              )}
            </span>
          ) : null}
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

        <p className="text-center text-[11px] text-on-surface-variant empty:hidden">
          {swipe.canSwipe ? t("today.swipeHint") : null}
        </p>
        <details className="outfit-details">
          <summary>{t("refine.outfitDetails")}</summary>
          <div className="space-y-4 pt-2 pb-2">
            <h3 className="text-base font-semibold">{recommendation.outfit.name}</h3>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              {recommendation.explanation}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="tonal" disabled={busy} onClick={onLike}>
                {t("today.like")}
              </Button>
              <Button size="sm" variant="text" disabled={busy} onClick={onRegenerate}>
                {t("today.regenerate")}
              </Button>
              {onTryOn ? (
                <Button size="sm" variant="text" disabled={busy} onClick={onTryOn}>
                  {t("experience.preview")}
                </Button>
              ) : null}
            </div>
            {onReplace ? (
              <div>
                <p className="mb-2 text-sm font-semibold">{t("experience.swap")}</p>
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
              </div>
            ) : null}
          </div>
        </details>
      </Card>
    </motion.div>
  );
}
