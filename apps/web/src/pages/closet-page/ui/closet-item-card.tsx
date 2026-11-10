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
        className="relative block aspect-[4/5] w-full"
        style={{ backgroundColor: clothingColor(item.primaryColor) }}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
        ) : null}
      </span>
      <span className="flex flex-col gap-1 px-3 py-3">
        <span className="text-xs font-medium tracking-wide text-on-surface-variant uppercase">
          {slotLabel}
        </span>
        <span className="text-sm font-semibold text-on-surface">{item.name}</span>
        <span className="text-xs text-on-surface-variant capitalize">{item.primaryColor}</span>
      </span>
    </motion.button>
  );
}
