import { AnimatePresence, motion, useDragControls } from "motion/react";
import { useEffect, useEffectEvent, useRef } from "react";
import { useTranslation } from "react-i18next";

import { softSpring } from "@/shared/lib";
import type { BottomSheetProps } from "@/shared/ui/bottom-sheet/bottom-sheet.types.js";

/**
 * Material 3 modal bottom sheet — scrim + surface-container-low, extra-large top corners.
 */
export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  const { t } = useTranslation();
  const dragControls = useDragControls();
  const close = useEffectEvent(onClose);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const inertSiblings: Array<[HTMLElement, boolean]> = [];
    let branch = dialog.current?.parentElement;
    while (branch && branch !== document.body) {
      for (const sibling of Array.from(branch.parentElement?.children ?? [])) {
        if (
          sibling !== branch &&
          sibling instanceof HTMLElement &&
          !["SCRIPT", "STYLE", "LINK"].includes(sibling.tagName)
        ) {
          inertSiblings.push([sibling, sibling.inert]);
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
    }
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => dialog.current?.focus());
    function handleKey(event: KeyboardEvent) {
      const panels = document.querySelectorAll('[role="dialog"]');
      if (panels[panels.length - 1] !== dialog.current) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key !== "Tab") {
        return;
      }
      const nodes = Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], summary, [tabindex="0"]',
        ) ?? [],
      ).filter((node) => node.getClientRects().length > 0);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) {
        event.preventDefault();
        dialog.current?.focus();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog.current)
      ) {
        event.preventDefault();
        last.focus();
      }
      if (
        !event.shiftKey &&
        (document.activeElement === last || !dialog.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKey);
      for (const [sibling, inert] of inertSiblings) {
        sibling.inert = inert;
      }
      previous?.focus();
    };
  }, [open]);
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-lg items-end">
          <motion.button
            type="button"
            aria-label={t("common.close")}
            className="absolute inset-0 bg-scrim/32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            ref={dialog}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative z-10 flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-surface-container-low px-4 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-elevation-3"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 380 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 96 || info.velocity.y > 600) {
                onClose();
              }
            }}
          >
            <div
              aria-hidden="true"
              className="flex h-5 shrink-0 touch-none items-start justify-center"
              onPointerDown={(event) => dragControls.start(event)}
            >
              <span className="h-1 w-8 rounded-full bg-on-surface-variant/40" />
            </div>
            <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
              <h2 className="md-title-large text-on-surface">{title}</h2>
              <motion.button
                type="button"
                className="md-state-layer md-label-large min-h-11 min-w-11 rounded-full px-3 py-2 text-primary"
                onClick={onClose}
                whileTap={{ scale: 0.96 }}
                transition={softSpring}
              >
                <span className="relative z-10">{t("common.close")}</span>
              </motion.button>
            </div>
            <div className="min-h-0 overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
