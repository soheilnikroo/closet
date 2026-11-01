import { motion } from "motion/react";

import { cn, scaleTap } from "@/shared/lib";

import type { FabProps } from "./fab.types.js";

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
        "inline-flex touch-manipulation select-none items-center justify-center gap-2 bg-primary-container text-on-primary-container shadow-elevation-3 transition-[filter] duration-150 hover:brightness-105",
        extended ? "h-14 rounded-2xl px-5" : "size-14 rounded-2xl",
        className,
      )}
      whileTap={scaleTap.whileTap}
      transition={scaleTap.transition}
      {...props}
    >
      {children}
      {extended ? <span className="font-medium">{label}</span> : null}
    </motion.button>
  );
}
