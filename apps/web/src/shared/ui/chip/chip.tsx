import { motion } from "motion/react";

import { cn, scaleTap } from "@/shared/lib";

import type { ChipProps } from "./chip.types.js";

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
        "inline-flex min-h-11 touch-manipulation select-none items-center rounded-lg border px-3 text-sm font-medium transition-colors",
        selected
          ? "border-transparent bg-secondary-container text-on-secondary-container"
          : "border-outline-variant bg-surface text-on-surface-variant",
        className,
      )}
      whileTap={scaleTap.whileTap}
      transition={scaleTap.transition}
      {...props}
    >
      {children}
    </motion.button>
  );
}
