import { motion } from "motion/react";

import { cn, scaleTap } from "@/shared/lib";
import { buttonSizeClass, buttonVariantClass } from "@/shared/ui/button/button.constants.js";
import type { ButtonProps } from "@/shared/ui/button/button.types.js";

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
        "md-state-layer inline-flex touch-manipulation select-none items-center justify-center gap-2 rounded-full font-medium disabled:cursor-not-allowed disabled:opacity-38",
        buttonVariantClass[variant],
        buttonSizeClass[size],
        fullWidth && "w-full",
        className,
      )}
      whileTap={disabled ? undefined : scaleTap.whileTap}
      transition={scaleTap.transition}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
