import type { StyleTag } from "@closet/shared";

import type { OnboardingStep } from "@/features/onboarding-flow/onboarding-flow.types.js";

export const STYLE_OPTIONS: Array<{ id: StyleTag; labelKey: string }> = [
  { id: "casual", labelKey: "onboarding.styles.casual" },
  { id: "minimal", labelKey: "onboarding.styles.minimal" },
  { id: "classic", labelKey: "onboarding.styles.classic" },
  { id: "smart_casual", labelKey: "onboarding.styles.smartCasual" },
  { id: "streetwear", labelKey: "onboarding.styles.streetwear" },
  { id: "sporty", labelKey: "onboarding.styles.sporty" },
  { id: "formal", labelKey: "onboarding.styles.formal" },
];

export const STEP_PROGRESS: Record<OnboardingStep, number> = {
  welcome: 10,
  styles: 25,
  city: 40,
  clothing: 55,
  review: 70,
  first_outfit: 85,
};
