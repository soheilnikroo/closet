import type { HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export type IconButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  label: string;
  selected?: boolean;
};
