import { cn } from "@/shared/lib";
import type { CardProps } from "@/shared/ui/card/card.types.js";

/**
 * Material 3 cards — filled (surface-container-highest) or elevated (surface + elevation 1).
 */
export function Card({ children, className, elevated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] p-5 text-on-surface",
        elevated ? "bg-surface-container-low shadow-elevation-1" : "bg-surface-container-lowest",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
