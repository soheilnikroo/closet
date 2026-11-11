import type { Recommendation } from "@closet/shared";

export type OutfitCardProps = {
  recommendation: Recommendation;
  onReplace?: (entry: Recommendation["outfit"]["items"][number]) => void;
  onTryOn?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onSave?: () => void;
  onRegenerate?: () => void;
  busy?: boolean;
  /** Enable horizontal swipe gestures for like / dislike. Defaults to true. */
  swipeable?: boolean;
};
