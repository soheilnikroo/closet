import { motion } from "motion/react";

import { cn, scaleTap } from "@/shared/lib";

import { buttonSizeClass, buttonVariantClass } from "./button.constants.js";
import type { ButtonProps } from "./button.types.js";

export function Button({
  children,
  className,
  variant = "filled",
  size = "md",
  fullWidth = false,
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex touch-manipulation select-none items-center justify-center gap-2 rounded-full font-medium transition-[filter,background-color] duration-150 disabled:cursor-not-allowed disabled:opacity-40",
        buttonVariantClass[variant],
        buttonSizeClass[size],
        fullWidth && "w-full",
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
