import { cn } from "@/shared/lib";
import type { SnackbarProps } from "@/shared/ui/snackbar/snackbar.types.js";

/** Material 3 snackbar — inverse-surface, 4dp corners, single-line body. */
export function Snackbar({ message, action, className }: SnackbarProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-12 max-w-lg items-center justify-between gap-3 rounded-xs bg-inverse-surface px-4 py-3 md-body-medium text-inverse-on-surface shadow-elevation-3",
        className,
      )}
    >
      <p className="min-w-0 flex-1">{message}</p>
      {action}
    </div>
  );
}
