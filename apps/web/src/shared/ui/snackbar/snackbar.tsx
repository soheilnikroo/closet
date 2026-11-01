import { cn } from "@/shared/lib";

import type { SnackbarProps } from "./snackbar.types.js";

export function Snackbar({ message, action, className }: SnackbarProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-12 items-center justify-between gap-3 rounded-md bg-inverse-surface px-4 py-3 text-sm text-inverse-on-surface shadow-elevation-2",
        className,
      )}
    >
      <p>{message}</p>
      {action}
    </div>
  );
}
