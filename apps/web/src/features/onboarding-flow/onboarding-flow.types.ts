export type OnboardingFlowProps = {
  onComplete: () => void;
};

export type OnboardingStep = "welcome" | "styles" | "city" | "clothing" | "review" | "first_outfit";
