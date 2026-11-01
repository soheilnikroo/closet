import { motion } from "motion/react";

import { softSpring } from "@/shared/lib";
import type { AnimatedSceneMotionProps } from "@/shared/ui/animated-scene/animated-scene-motion.types.js";

export function ClosetEmptyScene({ reduceMotion }: AnimatedSceneMotionProps) {
  return (
    <g>
      <motion.line
        x1="56"
        y1="58"
        x2="144"
        y2="58"
        stroke="var(--md-sys-color-outline)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: [0.05, 0.7, 0.1, 1] }}
      />
      {[0, 1, 2].map((index) => {
        const x = 70 + index * 30;
        return (
          <g key={index}>
            <motion.path
              d={`M${x} 58 v10`}
              stroke="var(--md-sys-color-outline-variant)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.06 }}
            />
            <motion.path
              d={`M${x - 12} 70 q12 -10 24 0`}
              fill="none"
              stroke="var(--md-sys-color-secondary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={reduceMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softSpring, delay: 0.12 + index * 0.06 }}
            />
            <motion.rect
              x={x - 14}
              y={74}
              width="28"
              height={36 + index * 4}
              rx="6"
              fill={
                index === 1
                  ? "var(--md-sys-color-primary)"
                  : "var(--md-sys-color-primary-container)"
              }
              initial={reduceMotion ? false : { y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...softSpring, delay: 0.16 + index * 0.07 }}
            />
          </g>
        );
      })}
      <motion.circle
        cx="100"
        cy="148"
        r="3"
        fill="var(--md-sys-color-tertiary)"
        animate={reduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </g>
  );
}
