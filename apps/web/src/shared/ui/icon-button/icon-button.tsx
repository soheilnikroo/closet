import { motion } from "motion/react";

import { cn, softSpring } from "@/shared/lib";
import type { IconButtonProps } from "@/shared/ui/icon-button/icon-button.types.js";

/**
 * Material 3 standard icon button — 40dp visual, 48dp touch target.
 */
export function IconButton({
  children,
  className,
  label,
  selected = false,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      type={type}
      aria-label={label}
      aria-pressed={selected}
      className={cn(
        "md-state-layer inline-flex size-12 touch-manipulation select-none items-center justify-center rounded-full text-on-surface-variant",
        selected && "bg-secondary-container text-on-secondary-container",
        className,
      )}
      whileTap={{ scale: 0.92 }}
      transition={softSpring}
      {...props}
    >
      <span className="relative z-10 inline-flex size-10 items-center justify-center">
        {children}
      </span>
    </motion.button>
  );
}
