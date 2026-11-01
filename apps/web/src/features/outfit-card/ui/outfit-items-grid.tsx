import { motion } from "motion/react";

import type { OutfitItemsGridProps } from "@/features/outfit-card/ui/outfit-items-grid.types.js";
import { softSpring, staggerContainer, staggerItem } from "@/shared/lib";

export function OutfitItemsGrid({ items }: OutfitItemsGridProps) {
  return (
    <motion.ul className="grid grid-cols-2 gap-2" {...staggerContainer}>
      {items.map((entry) => (
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
  );
}
