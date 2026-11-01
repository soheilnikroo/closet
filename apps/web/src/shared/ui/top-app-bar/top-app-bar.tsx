import { cn } from "@/shared/lib";
import type { TopAppBarProps } from "@/shared/ui/top-app-bar/top-app-bar.types.js";

/**
 * Material 3 small top app bar — 64dp + safe-area, surface, title-large, no elevation.
 */
export function TopAppBar({ title, leading, trailing, className }: TopAppBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 shrink-0 items-center gap-1 bg-surface px-1",
        "pt-[env(safe-area-inset-top,0px)]",
        className,
      )}
      style={{ height: "calc(var(--md-comp-top-app-bar-height) + env(safe-area-inset-top, 0px))" }}
    >
      <div className="flex w-12 shrink-0 justify-start ps-1">{leading}</div>
      <h1 className="md-title-large flex-1 truncate text-on-surface">{title}</h1>
      <div className="flex w-auto shrink-0 items-center justify-end gap-0.5 pe-1">{trailing}</div>
    </header>
  );
}
