import type { HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export type FabProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  label: string;
  extended?: boolean;
};
