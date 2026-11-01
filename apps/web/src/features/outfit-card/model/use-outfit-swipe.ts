import { useMotionValue, useReducedMotion, useTransform, type PanInfo } from "motion/react";

import { SWIPE_THRESHOLD } from "@/features/outfit-card/outfit-card.constants.js";

type UseOutfitSwipeOptions = {
  enabled: boolean;
  onLike?: () => void;
  onDislike?: () => void;
};

export function useOutfitSwipe({ enabled, onLike, onDislike }: UseOutfitSwipeOptions) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-10, 0, 10]);
  const likeOpacity = useTransform(x, [40, SWIPE_THRESHOLD], [0, 1]);
  const dislikeOpacity = useTransform(x, [-SWIPE_THRESHOLD, -40], [1, 0]);

  const canSwipe = Boolean(enabled && !reduceMotion && (onLike || onDislike));

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (!canSwipe) {
      return;
    }
    if (info.offset.x > SWIPE_THRESHOLD) {
      onLike?.();
      return;
    }
    if (info.offset.x < -SWIPE_THRESHOLD) {
      onDislike?.();
    }
  }

  return {
    canSwipe,
    x,
    rotate,
    likeOpacity,
    dislikeOpacity,
    handleDragEnd,
  };
}
