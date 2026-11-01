export type AnimatedSceneVariant = "wardrobeEmpty" | "welcome" | "balanced" | "stylist";

export type AnimatedSceneProps = {
  variant: AnimatedSceneVariant;
  className?: string;
  label?: string;
};
