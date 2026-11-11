import { motion } from "motion/react";

import type { OutfitItemsGridProps } from "@/features/outfit-card/ui/outfit-items-grid.types.js";
import { softSpring, staggerContainer, staggerItem } from "@/shared/lib";
import { GarmentArt } from "@/shared/ui/garment-art.js";

export function OutfitItemsGrid({ items }: OutfitItemsGridProps) {
  return (
    <motion.ul className="outfit-flatlay grid grid-cols-2 gap-3" {...staggerContainer}>
      {items.map((entry) => (
        <motion.li
          key={`${entry.clothingItemId}-${entry.role}`}
          className="outfit-piece min-w-0"
          variants={staggerItem.variants}
          whileHover={{ y: -1 }}
          transition={softSpring}
        >
          <GarmentArt
            slot={entry.role}
            color={entry.item?.primaryColor}
            imageUrl={entry.item?.imageUrl}
            className="garment-drawing max-h-28"
          />
          <p className="mt-1 line-clamp-1 text-center text-[11px] leading-4 text-on-surface-variant">
            {entry.item?.name ?? entry.clothingItemId.slice(0, 8)}
          </p>
        </motion.li>
      ))}
    </motion.ul>
  );
}
