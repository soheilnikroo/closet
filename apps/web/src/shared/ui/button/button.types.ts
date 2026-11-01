import type { HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export type ButtonVariant = "filled" | "tonal" | "outlined" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};
