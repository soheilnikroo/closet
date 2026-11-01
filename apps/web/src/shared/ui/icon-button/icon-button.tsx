import { motion } from "motion/react";

import { cn, scaleTap } from "@/shared/lib";

import type { IconButtonProps } from "./icon-button.types.js";

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
        "inline-flex size-11 touch-manipulation select-none items-center justify-center rounded-full text-on-surface-variant transition-colors duration-150",
        selected ? "bg-secondary-container text-on-secondary-container" : "hover:bg-on-surface/8",
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
