import { useEffect } from "react";

import { CELEBRATION_DURATION_MS } from "@/shared/ui/celebration-burst/celebration-burst.constants.js";

type UseCelebrationTimeoutOptions = {
  open: boolean;
  reduceMotion: boolean | null;
  onDone?: () => void;
};

export function useCelebrationTimeout({
  open,
  reduceMotion,
  onDone,
}: UseCelebrationTimeoutOptions) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const timeout = window.setTimeout(
      () => onDone?.(),
      reduceMotion ? CELEBRATION_DURATION_MS.reduced : CELEBRATION_DURATION_MS.full,
    );
    return () => window.clearTimeout(timeout);
  }, [open, onDone, reduceMotion]);
}
