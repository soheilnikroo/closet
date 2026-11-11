import { motion } from "motion/react";

import type { ClosetItemCardProps } from "@/pages/closet-page/ui/closet-item-card.types.js";
import { pressableCard } from "@/shared/lib";
import { GarmentArt } from "@/shared/ui/garment-art.js";

export function ClosetItemCard({ item, slotLabel, onOpen }: ClosetItemCardProps) {
  return (
    <motion.button
      type="button"
      className="md-state-layer flex h-full w-full flex-col overflow-hidden rounded-md border border-outline-variant/60 bg-surface-container-lowest text-start"
      onClick={onOpen}
      {...pressableCard}
    >
      <span className="block w-full bg-surface-container">
        <GarmentArt
          slot={item.slot}
          color={item.primaryColor}
          imageUrl={item.imageUrl}
          className="aspect-square max-h-40 p-3"
        />
        <span className="block bg-surface-container-lowest px-3 py-3">
          <span className="block text-[0.7rem] font-medium tracking-wide text-on-surface-variant uppercase">
            {slotLabel}
          </span>
          <span className="line-clamp-2 block text-sm font-semibold text-on-surface">
            {item.name}
          </span>
          <span className="block text-xs text-on-surface-variant capitalize">
            {item.primaryColor}
          </span>
          {item.labels && item.labels.length > 0 ? (
            <span className="block truncate text-xs text-on-surface-variant">
              {item.labels.join(" · ")}
            </span>
          ) : null}
        </span>
      </span>
    </motion.button>
  );
}
