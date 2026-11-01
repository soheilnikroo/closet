import { cn } from "@/shared/lib";

import type { CardProps } from "./card.types.js";

export function Card({ children, className, elevated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface-container-low p-4 text-on-surface",
        elevated && "bg-surface-container-lowest shadow-elevation-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
