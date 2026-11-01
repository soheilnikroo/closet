import type { CelebrationKind } from "@/shared/ui/celebration-burst/celebration-burst.types.js";

export const CELEBRATION_DURATION_MS = {
  reduced: 350,
  full: 1100,
} as const;

export const CELEBRATION_SPARK_COUNT = 6;

export const CELEBRATION_DEFAULT_LABELS: Record<CelebrationKind, string> = {
  like: "Nice pick!",
  save: "Saved to looks",
  success: "Looking good!",
};
