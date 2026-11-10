import { motion } from "motion/react";

import type { ClosetGridProps } from "@/pages/closet-page/ui/closet-grid.types.js";
import { ClosetItemCard } from "@/pages/closet-page/ui/closet-item-card.js";
import { staggerContainer, staggerItem } from "@/shared/lib";

export function ClosetGrid({ items, slotLabel, onOpen }: ClosetGridProps) {
  return (
    <motion.div className="grid grid-cols-2 gap-3" {...staggerContainer}>
      {items.map((item) => (
        <motion.div key={item.id} variants={staggerItem.variants}>
          <ClosetItemCard
            item={item}
            slotLabel={slotLabel(item.slot)}
            onOpen={() => onOpen(item)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
