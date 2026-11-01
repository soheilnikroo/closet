import { motion } from "motion/react";

import { softSpring } from "@/shared/lib";
import type { CelebrationIconProps } from "@/shared/ui/celebration-burst/celebration-icon.types.js";

export function CelebrationIcon({ isLike }: CelebrationIconProps) {
  return (
    <svg viewBox="0 0 48 48" className="size-11" aria-hidden>
      {isLike ? (
        <motion.path
          d="M24 38s-12-7.5-12-16a7 7 0 0 1 12-4 7 7 0 0 1 12 4c0 8.5-12 16-12 16Z"
          fill="var(--md-sys-color-primary)"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={softSpring}
          style={{ transformOrigin: "24px 24px" }}
        />
      ) : (
        <motion.path
          d="M14 25.5 21 32.5 34 16.5"
          fill="none"
          stroke="var(--md-sys-color-primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.05, 0.7, 0.1, 1], delay: 0.05 }}
        />
      )}
    </svg>
  );
}
