import type { DetectedGarment } from "@closet/shared";

export type ReviewGarment = DetectedGarment & {
  accepted: boolean;
};

export type ClosetReviewSheetProps = {
  open: boolean;
  title: string;
  hint: string;
  confirmLabel: string;
  busy: boolean;
  garments: ReviewGarment[];
  onClose: () => void;
  onToggle: (tempId: string) => void;
  onConfirm: () => void;
};
