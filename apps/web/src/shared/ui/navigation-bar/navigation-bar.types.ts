import type { ReactNode } from "react";

export type NavigationBarItem = {
  to: string;
  label: string;
  icon: ReactNode;
};

export type NavigationBarProps = {
  items: readonly NavigationBarItem[];
  className?: string;
};
