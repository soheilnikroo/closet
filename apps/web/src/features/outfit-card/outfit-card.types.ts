import type { Recommendation } from "@closet/shared";

export type OutfitCardProps = {
  recommendation: Recommendation;
  onLike?: () => void;
  onDislike?: () => void;
  onSave?: () => void;
  onRegenerate?: () => void;
  busy?: boolean;
  /** Enable horizontal swipe gestures for like / dislike. Defaults to true. */
  swipeable?: boolean;
};
