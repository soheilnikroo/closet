import type { ReactNode } from "react";

import type { AnimatedSceneVariant } from "@/shared/ui/animated-scene";

export type EmptyStateProps = {
  variant?: AnimatedSceneVariant;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};
