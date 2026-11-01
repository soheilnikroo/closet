import { motion } from "motion/react";

import { cn, softSpring } from "@/shared/lib";
import type { ChipProps } from "@/shared/ui/chip/chip.types.js";

/**
 * Material 3 filter chip — 32dp height, outline / secondary-container selected.
 */
export function Chip({
  children,
  className,
  selected = false,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <motion.button
      type={type}
      aria-pressed={selected}
      className={cn(
        "md-state-layer inline-flex h-8 min-h-8 shrink-0 touch-manipulation select-none items-center rounded-full border px-4 md-label-large",
        selected
          ? "border-transparent bg-secondary-container text-on-secondary-container"
          : "border-outline-variant bg-surface text-on-surface-variant",
        className,
      )}
      whileTap={{ scale: 0.97 }}
      transition={softSpring}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
