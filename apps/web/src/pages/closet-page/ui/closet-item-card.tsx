import { motion } from "motion/react";

import type { ClosetItemCardProps } from "@/pages/closet-page/ui/closet-item-card.types.js";
import { pressableCard } from "@/shared/lib";
import { GarmentArt } from "@/shared/ui/garment-art.js";

export function ClosetItemCard({ item, slotLabel, onOpen }: ClosetItemCardProps) {
  return (
    <motion.button
      type="button"
      className="md-state-layer wardrobe-piece flex h-full w-full flex-col overflow-hidden rounded-[22px] text-start"
      onClick={onOpen}
      {...pressableCard}
    >
      <span className="block w-full">
        <GarmentArt
          slot={item.slot}
          color={item.primaryColor}
          imageUrl={item.imageUrl}
          className="garment-drawing aspect-square max-h-44 p-4"
        />
        <span className="block px-1 pt-3 pb-2">
          <span className="sr-only">{slotLabel}</span>
          <span className="line-clamp-2 block text-[14px] leading-5 font-semibold text-on-surface">
            {item.name}
          </span>
          <span className="mt-1 block text-xs text-on-surface-variant capitalize">
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
