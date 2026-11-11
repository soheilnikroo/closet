import type { ButtonSize, ButtonVariant } from "@/shared/ui/button/button.types.js";

export const buttonVariantClass: Record<ButtonVariant, string> = {
  filled: "bg-primary text-on-primary",
  tonal: "bg-secondary-container text-on-secondary-container",
  outlined: "border border-outline text-primary bg-transparent",
  text: "text-primary bg-transparent",
};

export const buttonSizeClass: Record<ButtonSize, string> = {
  sm: "min-h-12 min-w-12 px-4 md-label-large",
  md: "min-h-12 min-w-12 px-6 md-label-large",
  lg: "h-12 min-w-14 px-7 text-base font-medium",
};
