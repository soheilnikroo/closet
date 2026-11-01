import type { ButtonSize, ButtonVariant } from "./button.types.js";

export const buttonVariantClass: Record<ButtonVariant, string> = {
  filled: "bg-primary text-on-primary shadow-elevation-1",
  tonal: "bg-secondary-container text-on-secondary-container",
  outlined: "border border-outline text-primary bg-transparent",
  text: "text-primary bg-transparent",
};

export const buttonSizeClass: Record<ButtonSize, string> = {
  sm: "h-9 min-w-9 px-4 md-label-large",
  md: "h-10 min-w-12 px-6 md-label-large",
  lg: "h-12 min-w-14 px-7 text-base font-medium",
};
