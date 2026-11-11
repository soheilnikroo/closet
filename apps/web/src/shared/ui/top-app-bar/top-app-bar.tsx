import { cn } from "@/shared/lib";
import { ClosetBrand } from "@/shared/ui/closet-brand.js";
import type { TopAppBarProps } from "@/shared/ui/top-app-bar/top-app-bar.types.js";

/**
 * Material 3 small top app bar — 64dp + safe-area, surface, title-large, no elevation.
 */
export function TopAppBar({ title, leading, trailing, className }: TopAppBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 bg-surface px-5",
        "pt-[env(safe-area-inset-top,0px)]",
        className,
      )}
      style={{ height: "calc(var(--md-comp-top-app-bar-height) + env(safe-area-inset-top, 0px))" }}
    >
      {leading ? <div className="flex w-12 shrink-0 justify-start ps-1">{leading}</div> : null}
      <h1 className="flex-1 truncate font-display text-xl font-semibold tracking-tight text-primary">
        <ClosetBrand label={title} />
      </h1>
      <div className="flex w-auto shrink-0 items-center justify-end gap-3">{trailing}</div>
    </header>
  );
}
