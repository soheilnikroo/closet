import type { MotionValue } from "motion/react";

export type SwipeBadgesProps = {
  likeLabel: string;
  dislikeLabel: string;
  likeOpacity: MotionValue<number>;
  dislikeOpacity: MotionValue<number>;
};
