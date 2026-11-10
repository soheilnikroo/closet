import { motion } from "motion/react";

import { clothingColor } from "@/pages/closet-page/closet-page.utils.js";
import type { ClosetItemCardProps } from "@/pages/closet-page/ui/closet-item-card.types.js";
import { pressableCard } from "@/shared/lib";

export function ClosetItemCard({ item, slotLabel, onOpen }: ClosetItemCardProps) {
  return (
    <motion.button
      type="button"
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-surface-container-lowest text-start shadow-elevation-1"
      onClick={onOpen}
      {...pressableCard}
    >
      <span
        className="relative block aspect-square w-full"
        style={{ backgroundColor: clothingColor(item.primaryColor) }}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
        ) : null}
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pt-8 pb-3">
          <span className="block text-[0.7rem] font-medium tracking-wide text-white/80 uppercase">
            {slotLabel}
          </span>
          <span className="block text-sm font-semibold text-white">{item.name}</span>
          <span className="block text-xs text-white/80 capitalize">{item.primaryColor}</span>
          {item.labels && item.labels.length > 0 ? (
            <span className="block truncate text-xs text-white/80">{item.labels.join(" · ")}</span>
          ) : null}
        </span>
      </span>
    </motion.button>
  );
}
