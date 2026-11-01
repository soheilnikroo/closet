import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { useOutfitSwipe } from "@/features/outfit-card/model/use-outfit-swipe.js";
import type { OutfitCardProps } from "@/features/outfit-card/outfit-card.types.js";
import { softSpring, staggerContainer, staggerItem } from "@/shared/lib";
import { Button, Card, Chip } from "@/shared/ui";

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
          <>
            <motion.div
              className="pointer-events-none absolute inset-x-4 top-5 z-20 flex justify-start"
              style={{ opacity: swipe.likeOpacity }}
            >
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-on-primary uppercase shadow-elevation-2">
                {t("today.like")}
              </span>
            </motion.div>
            <motion.div
              className="pointer-events-none absolute inset-x-4 top-5 z-20 flex justify-end"
              style={{ opacity: swipe.dislikeOpacity }}
            >
              <span className="rounded-full bg-inverse-surface px-3 py-1 text-xs font-bold tracking-wide text-inverse-on-surface uppercase shadow-elevation-2">
                {t("today.dislike")}
              </span>
            </motion.div>
          </>
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

        <motion.ul className="grid grid-cols-2 gap-2" {...staggerContainer}>
          {recommendation.outfit.items.map((entry) => (
            <motion.li
              key={`${entry.clothingItemId}-${entry.role}`}
              className="rounded-lg bg-surface-container px-3 py-3"
              variants={staggerItem.variants}
              whileHover={{ y: -1 }}
              transition={softSpring}
            >
              <p className="text-xs font-medium text-on-surface-variant capitalize">{entry.role}</p>
              <p className="mt-0.5 text-sm font-semibold text-on-surface">
                {entry.item?.name ?? entry.clothingItemId.slice(0, 8)}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant empty:hidden">
                {entry.item?.primaryColor}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        <p className="text-sm leading-relaxed text-on-surface-variant">
          {recommendation.explanation}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button size="sm" disabled={busy} onClick={onLike}>
            {t("today.like")}
          </Button>
          <Button size="sm" variant="tonal" disabled={busy} onClick={onDislike}>
            {t("today.dislike")}
          </Button>
          <Button size="sm" variant="outlined" disabled={busy} onClick={onSave}>
            {t("today.save")}
          </Button>
          <Button size="sm" variant="text" disabled={busy} onClick={onRegenerate}>
            {t("today.regenerate")}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
