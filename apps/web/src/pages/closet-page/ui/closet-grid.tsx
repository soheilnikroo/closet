import { motion } from "motion/react";

import type { ClosetGridProps } from "@/pages/closet-page/ui/closet-grid.types.js";
import { pressableCard, staggerContainer, staggerItem } from "@/shared/lib";
import { Button, Card } from "@/shared/ui";

export function ClosetGrid({ items, busy, deleteLabel, onRemove }: ClosetGridProps) {
  return (
    <motion.div className="grid grid-cols-2 gap-3" {...staggerContainer}>
      {items.map((item) => (
        <motion.div key={item.id} variants={staggerItem.variants} {...pressableCard}>
          <Card className="h-full space-y-2">
            <p className="text-xs font-medium text-on-surface-variant capitalize">{item.slot}</p>
            <p className="text-sm font-semibold text-on-surface">{item.name}</p>
            <p className="text-xs text-on-surface-variant">
              {item.primaryColor}
              {item.styleTags[0] ? ` · ${item.styleTags[0]}` : ""}
            </p>
            <Button size="sm" variant="text" disabled={busy} onClick={() => onRemove(item.id)}>
              {deleteLabel}
            </Button>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
