import type { ButtonSize, ButtonVariant } from "./button.types.js";

export const buttonVariantClass: Record<ButtonVariant, string> = {
  filled: "bg-primary text-on-primary shadow-elevation-1 hover:brightness-105",
  tonal: "bg-secondary-container text-on-secondary-container hover:brightness-95",
  outlined: "border border-outline text-primary bg-transparent hover:bg-primary/8",
  text: "text-primary bg-transparent hover:bg-primary/8",
};

export const buttonSizeClass: Record<ButtonSize, string> = {
  sm: "h-10 min-w-10 px-4 text-sm",
  md: "h-11 min-w-12 px-5 text-sm",
  lg: "h-12 min-w-14 px-6 text-base",
};
