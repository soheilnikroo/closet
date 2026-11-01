import { motion } from "motion/react";

import { cn, softSpring } from "@/shared/lib";
import type { FabProps } from "@/shared/ui/fab/fab.types.js";

/**
 * Material 3 FAB — 56dp, primary-container, large corner (16dp), elevation 3.
 */
export function Fab({
  children,
  className,
  label,
  extended = false,
  type = "button",
  ...props
}: FabProps) {
  return (
    <motion.button
      type={type}
      aria-label={label}
      className={cn(
        "md-state-layer inline-flex touch-manipulation select-none items-center justify-center gap-2 bg-primary-container text-on-primary-container shadow-elevation-3",
        extended ? "h-14 rounded-2xl px-5" : "size-14 rounded-2xl",
        className,
      )}
      whileTap={{ scale: 0.96 }}
      transition={softSpring}
      {...props}
    >
      <span className="relative z-10 text-base font-medium tracking-tight">{children}</span>
      {extended ? <span className="md-label-large relative z-10">{label}</span> : null}
    </motion.button>
  );
}
