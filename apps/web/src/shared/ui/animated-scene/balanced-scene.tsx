import { motion } from "motion/react";

import { softSpring } from "@/shared/lib";
import type { AnimatedSceneMotionProps } from "@/shared/ui/animated-scene/animated-scene-motion.types.js";

export function BalancedScene({ reduceMotion }: AnimatedSceneMotionProps) {
  return (
    <g>
      {[0, 1, 2].map((index) => (
        <motion.rect
          key={index}
          x={58 + index * 28}
          y={68}
          width="20"
          height={52 + index * 4}
          rx="6"
          fill={
            index === 1 ? "var(--md-sys-color-primary)" : "var(--md-sys-color-primary-container)"
          }
          initial={reduceMotion ? false : { y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...softSpring, delay: index * 0.07 }}
        />
      ))}
      <path
        d="M56 140h88"
        stroke="var(--md-sys-color-outline-variant)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}
