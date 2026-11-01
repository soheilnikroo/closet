import type { StyleTag } from "@closet/shared";

export const STYLE_OPTIONS: Array<{ id: StyleTag; labelKey: string }> = [
  { id: "casual", labelKey: "onboarding.styles.casual" },
  { id: "minimal", labelKey: "onboarding.styles.minimal" },
  { id: "classic", labelKey: "onboarding.styles.classic" },
  { id: "smart_casual", labelKey: "onboarding.styles.smartCasual" },
  { id: "streetwear", labelKey: "onboarding.styles.streetwear" },
  { id: "sporty", labelKey: "onboarding.styles.sporty" },
  { id: "formal", labelKey: "onboarding.styles.formal" },
];

export type OnboardingStep =
  | "welcome"
  | "styles"
  | "city"
  | "clothing"
  | "review"
  | "first_outfit"
  | "feedback";
