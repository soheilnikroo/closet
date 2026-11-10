import type { ClosetReviewSheetProps } from "@/pages/closet-page/ui/closet-review-sheet.types.js";
import { BottomSheet, Button } from "@/shared/ui";

export function ClosetReviewSheet({
  open,
  title,
  hint,
  confirmLabel,
  busy,
  garments,
  onClose,
  onToggle,
  onConfirm,
}: ClosetReviewSheetProps) {
  const acceptedCount = garments.filter((garment) => garment.accepted).length;

  return (
    <BottomSheet open={open} title={title} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-sm text-on-surface-variant">{hint}</p>
        <ul className="space-y-2">
          {garments.map((garment) => (
            <li key={garment.tempId}>
              <button
                type="button"
                aria-label={garment.name}
                aria-pressed={garment.accepted}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-outline-variant/40 bg-surface px-3 py-3 text-start"
                onClick={() => onToggle(garment.tempId)}
              >
                <span>
                  <span className="block text-sm font-semibold text-on-surface">
                    {garment.name}
                  </span>
                  <span className="mt-1 block text-xs text-on-surface-variant">
                    {garment.primaryColor} · {garment.categorySlug} ·{" "}
                    {Math.round(garment.confidence * 100)}%
                  </span>
                </span>
                <span
                  className={
                    garment.accepted
                      ? "size-5 shrink-0 rounded-full bg-primary"
                      : "size-5 shrink-0 rounded-full border border-outline"
                  }
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ul>
        <Button fullWidth size="lg" disabled={busy || acceptedCount === 0} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </BottomSheet>
  );
}
