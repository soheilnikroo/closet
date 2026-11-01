import { motion } from "motion/react";

import { cn, fadeUp } from "@/shared/lib";
import { AnimatedScene } from "@/shared/ui/animated-scene";
import { Card } from "@/shared/ui/card";
import type { EmptyStateProps } from "@/shared/ui/empty-state/empty-state.types.js";

export function EmptyState({
  variant = "closetEmpty",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div {...fadeUp}>
      <Card
        elevated
        className={cn("flex flex-col items-center gap-4 px-5 py-7 text-center", className)}
      >
        <AnimatedScene variant={variant} label={title} />
        <div className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-on-surface">{title}</h2>
          <p className="text-sm leading-relaxed text-on-surface-variant">{description}</p>
        </div>
        {action ? <div className="w-full pt-1">{action}</div> : null}
      </Card>
    </motion.div>
  );
}
