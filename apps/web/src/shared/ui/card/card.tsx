import { cn } from "@/shared/lib";
import type { CardProps } from "@/shared/ui/card/card.types.js";

/**
 * Material 3 cards — filled (surface-container-highest) or elevated (surface + elevation 1).
 */
export function Card({ children, className, elevated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md p-4 text-on-surface",
        elevated ? "bg-surface-container-low shadow-elevation-1" : "bg-surface-container-highest",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
