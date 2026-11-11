import { motion } from "motion/react";

import type { OutfitItemsGridProps } from "@/features/outfit-card/ui/outfit-items-grid.types.js";
import { softSpring, staggerContainer, staggerItem } from "@/shared/lib";
import { GarmentArt } from "@/shared/ui/garment-art.js";

export function OutfitItemsGrid({ items }: OutfitItemsGridProps) {
  return (
    <motion.ul className="grid grid-cols-3 gap-2" {...staggerContainer}>
      {items.map((entry) => (
        <motion.li
          key={`${entry.clothingItemId}-${entry.role}`}
          className="rounded-lg bg-surface-container px-2 py-2"
          variants={staggerItem.variants}
          whileHover={{ y: -1 }}
          transition={softSpring}
        >
          <GarmentArt
            slot={entry.role}
            color={entry.item?.primaryColor}
            imageUrl={entry.item?.imageUrl}
            className="max-h-16"
          />
          <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-on-surface">
            {entry.item?.name ?? entry.clothingItemId.slice(0, 8)}
          </p>
        </motion.li>
      ))}
    </motion.ul>
  );
}
