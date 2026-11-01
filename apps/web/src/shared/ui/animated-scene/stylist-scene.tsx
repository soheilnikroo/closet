import { motion } from "motion/react";

import type { AnimatedSceneMotionProps } from "@/shared/ui/animated-scene/animated-scene-motion.types.js";

export function StylistScene({ reduceMotion }: AnimatedSceneMotionProps) {
  return (
    <g>
      <motion.circle
        cx="100"
        cy="96"
        r="32"
        fill="var(--md-sys-color-surface-container-lowest)"
        stroke="var(--md-sys-color-tertiary)"
        strokeWidth="3"
        animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M88 96h24M100 84v24"
        stroke="var(--md-sys-color-primary)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      />
      {!reduceMotion
        ? [0, 1, 2].map((index) => {
            const angle = -Math.PI / 2 + (index / 3) * Math.PI * 2;
            return (
              <motion.circle
                key={index}
                cx={100 + Math.cos(angle) * 48}
                cy={96 + Math.sin(angle) * 48}
                r="3.5"
                fill="var(--md-sys-color-primary)"
                animate={{ opacity: [0.25, 0.9, 0.25] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.25 }}
              />
            );
          })
        : null}
    </g>
  );
}
