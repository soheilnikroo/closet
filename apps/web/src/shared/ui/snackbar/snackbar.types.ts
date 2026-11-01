import type { ReactNode } from "react";

export type SnackbarProps = {
  message: string;
  action?: ReactNode;
  className?: string;
};
