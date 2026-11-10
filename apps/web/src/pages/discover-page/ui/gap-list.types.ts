import type { WardrobeGap } from "@closet/shared";

export type GapListProps = {
  gaps: WardrobeGap[];
  language: string;
  gapLabel: string;
  addLabel: string;
  onAdd: (gap: WardrobeGap) => void;
};
