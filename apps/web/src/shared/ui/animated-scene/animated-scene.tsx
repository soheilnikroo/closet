import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

import { cn, softSpring } from "@/shared/lib";
import type { AnimatedSceneProps } from "@/shared/ui/animated-scene/animated-scene.types.js";
import { BalancedScene } from "@/shared/ui/animated-scene/balanced-scene.js";
import { ClosetEmptyScene } from "@/shared/ui/animated-scene/closet-empty-scene.js";
import { StylistScene } from "@/shared/ui/animated-scene/stylist-scene.js";
import { WelcomeScene } from "@/shared/ui/animated-scene/welcome-scene.js";

/**
 * Calm brand illustrations — soft green palette via CSS variables, gentle motion only.
 */
export function AnimatedScene({ variant, className, label }: AnimatedSceneProps) {
  const reduceMotion = useReducedMotion();
  const gradientId = useId();
  const motionProps = { reduceMotion: Boolean(reduceMotion) };

  return (
    <div
      className={cn("relative mx-auto aspect-square w-40 max-w-full", className)}
      role={label ? "img" : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      <svg viewBox="0 0 200 200" className="size-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--md-sys-color-primary-container)" />
            <stop offset="100%" stopColor="var(--md-sys-color-tertiary-container)" />
          </linearGradient>
        </defs>

        <motion.circle
          cx="100"
          cy="100"
          r="76"
          fill={`url(#${gradientId})`}
          initial={reduceMotion ? false : { opacity: 0.55, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={softSpring}
        />

        {variant === "closetEmpty" ? <ClosetEmptyScene {...motionProps} /> : null}
        {variant === "welcome" ? <WelcomeScene {...motionProps} /> : null}
        {variant === "balanced" ? <BalancedScene {...motionProps} /> : null}
        {variant === "stylist" ? <StylistScene {...motionProps} /> : null}
      </svg>
    </div>
  );
}
