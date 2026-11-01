import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

import { softSpring } from "@/shared/lib";
import type { CelebrationBurstProps } from "@/shared/ui/celebration-burst/celebration-burst.types.js";

/**
 * Quiet brand celebration — SVG check / heart with a few soft green sparks.
 * No Lottie (kept light, on-brand, and readable on mobile).
 */
export function CelebrationBurst({ open, kind = "success", onDone, label }: CelebrationBurstProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const timeout = window.setTimeout(() => onDone?.(), reduceMotion ? 350 : 1100);
    return () => window.clearTimeout(timeout);
  }, [open, onDone, reduceMotion]);

  const message =
    label ??
    (kind === "like" ? "Nice pick!" : kind === "save" ? "Saved to looks" : "Looking good!");

  const isLike = kind === "like";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[60] mx-auto flex max-w-lg items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          aria-live="polite"
        >
          <div className="relative flex flex-col items-center gap-3">
            {!reduceMotion
              ? [0, 1, 2, 3, 4, 5].map((index) => {
                  const angle = (index / 6) * Math.PI * 2 - Math.PI / 2;
                  const distance = 54 + (index % 2) * 10;
                  return (
                    <motion.span
                      key={index}
                      className="absolute size-1.5 rounded-full bg-primary"
                      initial={{ x: 0, y: 0, opacity: 0.9, scale: 0.6 }}
                      animate={{
                        x: Math.cos(angle) * distance,
                        y: Math.sin(angle) * distance,
                        opacity: 0,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.7,
                        ease: [0.05, 0.7, 0.1, 1],
                        delay: 0.05 + index * 0.03,
                      }}
                    />
                  );
                })
              : null}

            <motion.div
              className="flex size-20 items-center justify-center rounded-full bg-primary-container shadow-elevation-2"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={softSpring}
            >
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
            </motion.div>

            <motion.p
              className="md-label-large rounded-full bg-inverse-surface px-4 py-1.5 text-inverse-on-surface shadow-elevation-2"
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -4, opacity: 0 }}
              transition={softSpring}
            >
              {message}
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
