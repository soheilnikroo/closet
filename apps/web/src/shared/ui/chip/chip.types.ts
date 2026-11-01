import type { HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export type ChipProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  selected?: boolean;
};
