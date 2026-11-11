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
        "md-state-layer inline-flex h-12 min-h-12 shrink-0 touch-manipulation select-none items-center rounded-full border px-5 md-label-large",
        selected
          ? "border-transparent bg-primary text-on-primary"
          : "border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant",
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
