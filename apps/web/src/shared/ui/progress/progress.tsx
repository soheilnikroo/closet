import { motion } from "motion/react";

import { cn, softSpring } from "@/shared/lib";

import type { ProgressProps } from "./progress.types.js";

/** Material 3 linear progress indicator — 4dp track. */
export function Progress({ value, label = "Loading", className }: ProgressProps) {
  const isIndeterminate = value === undefined;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={isIndeterminate ? undefined : value}
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-secondary-container",
        className,
      )}
    >
      {isIndeterminate ? (
        <span className="absolute inset-y-0 w-1/3 animate-pulse rounded-full bg-primary" />
      ) : (
        <motion.span
          className="absolute inset-y-0 start-0 rounded-full bg-primary"
          initial={false}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={softSpring}
        />
      )}
    </div>
  );
}
