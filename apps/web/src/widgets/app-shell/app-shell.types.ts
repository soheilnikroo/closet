import type { ReactNode } from "react";

export type AppShellProps = {
  title: string;
  onRefresh?: () => Promise<void>;
  children: ReactNode;
};
