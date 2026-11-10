import { motion } from "motion/react";

import type { ClosetAddSheetProps } from "@/pages/closet-page/ui/closet-add-sheet.types.js";
import { softSpring } from "@/shared/lib";
import { BottomSheet, Button } from "@/shared/ui";

export function ClosetAddSheet({
  open,
  title,
  uploadHint,
  sampleLabel,
  busy,
  onClose,
  onUpload,
  onSample,
}: ClosetAddSheetProps) {
  return (
    <BottomSheet open={open} title={title} onClose={onClose}>
      <div className="space-y-3">
        <motion.label
          className="block touch-manipulation rounded-2xl border border-dashed border-outline-variant/80 bg-surface-container-low px-4 py-6 text-center text-sm transition-colors select-none"
          whileTap={{ scale: 0.99 }}
          transition={softSpring}
        >
          <span className="font-medium text-on-surface-variant">{uploadHint}</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="mt-3 block w-full text-base"
            onChange={(event) => onUpload(event.target.files)}
          />
        </motion.label>
        <Button fullWidth size="lg" variant="tonal" disabled={busy} onClick={onSample}>
          {sampleLabel}
        </Button>
      </div>
    </BottomSheet>
  );
}
