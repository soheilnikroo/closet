import { AnimatePresence, motion } from "motion/react";

import { softSpring } from "@/shared/lib";
import type { BottomSheetProps } from "@/shared/ui/bottom-sheet/bottom-sheet.types.js";

/**
 * Material 3 modal bottom sheet — scrim + surface-container-low, extra-large top corners.
 */
export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-lg items-end">
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-scrim/32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative z-10 max-h-[90dvh] w-full overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-surface-container-low px-4 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-elevation-3"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 380 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 96 || info.velocity.y > 600) {
                onClose();
              }
            }}
          >
            <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-on-surface-variant/40" />
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="md-title-large text-on-surface">{title}</h2>
              <motion.button
                type="button"
                className="md-state-layer md-label-large rounded-full px-3 py-2 text-primary"
                onClick={onClose}
                whileTap={{ scale: 0.96 }}
                transition={softSpring}
              >
                <span className="relative z-10">Close</span>
              </motion.button>
            </div>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
