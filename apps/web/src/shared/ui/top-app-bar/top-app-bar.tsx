import { cn } from "@/shared/lib";

import type { TopAppBarProps } from "./top-app-bar.types.js";

export function TopAppBar({ title, leading, trailing, className }: TopAppBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex min-h-16 items-center gap-2 bg-surface/90 px-2 backdrop-blur-md",
        "pt-[env(safe-area-inset-top,0px)]",
        className,
      )}
    >
      <div className="flex w-14 shrink-0 justify-start">{leading}</div>
      <h1 className="flex-1 truncate font-display text-xl font-semibold tracking-tight text-on-surface">
        {title}
      </h1>
      <div className="flex w-auto shrink-0 items-center justify-end gap-1">{trailing}</div>
    </header>
  );
}
