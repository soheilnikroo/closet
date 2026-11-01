export type AnimatedSceneVariant = "closetEmpty" | "welcome" | "balanced" | "stylist";

export type AnimatedSceneProps = {
  variant: AnimatedSceneVariant;
  className?: string;
  label?: string;
};
