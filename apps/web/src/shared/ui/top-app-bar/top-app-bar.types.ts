import type { ReactNode } from "react";

export type TopAppBarProps = {
  title: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
};
