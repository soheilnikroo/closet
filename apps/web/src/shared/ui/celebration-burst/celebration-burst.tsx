import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { softSpring } from "@/shared/lib";
import { CELEBRATION_DEFAULT_LABELS } from "@/shared/ui/celebration-burst/celebration-burst.constants.js";
import { useCelebrationTimeout } from "@/shared/ui/celebration-burst/celebration-burst.hooks.js";
import type { CelebrationBurstProps } from "@/shared/ui/celebration-burst/celebration-burst.types.js";
import { CelebrationIcon } from "@/shared/ui/celebration-burst/celebration-icon.js";
import { CelebrationSparks } from "@/shared/ui/celebration-burst/celebration-sparks.js";

/**
 * Quiet brand celebration — SVG check / heart with a few soft green sparks.
 * No Lottie (kept light, on-brand, and readable on mobile).
 */
export function CelebrationBurst({ open, kind = "success", onDone, label }: CelebrationBurstProps) {
  const reduceMotion = useReducedMotion();

  useCelebrationTimeout({ open, reduceMotion, onDone });

  const message = label ?? CELEBRATION_DEFAULT_LABELS[kind];
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
            {!reduceMotion ? <CelebrationSparks /> : null}

            <motion.div
              className="flex size-20 items-center justify-center rounded-full bg-primary-container shadow-elevation-2"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={softSpring}
            >
              <CelebrationIcon isLike={isLike} />
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
