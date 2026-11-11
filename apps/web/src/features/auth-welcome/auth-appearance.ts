import type { SignIn } from "@clerk/clerk-react";
import type { ComponentProps } from "react";

/** Clerk Core 2 appearance, shared by sign-in, signup and continuation steps. */
export const authAppearance = {
  layout: {
    socialButtonsVariant: "blockButton",
    socialButtonsPlacement: "top",
    showOptionalFields: false,
  },
  variables: {
    colorPrimary: "#20543b",
    colorText: "#19221c",
    colorTextSecondary: "#465248",
    colorBackground: "#ffffff",
    colorInputBackground: "#fafbf7",
    colorInputText: "#19221c",
    colorDanger: "#ba1a1a",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-body)",
    fontSize: "1rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "w-full gap-5 rounded-[28px] border border-outline-variant/50 p-5 shadow-none",
    headerTitle: "md-title-large text-on-surface",
    headerSubtitle: "md-body-medium text-on-surface-variant",
    formFieldInput: "min-h-14 rounded-md border-outline bg-surface text-base",
    formButtonPrimary:
      "md-state-layer min-h-12 rounded-full bg-primary text-on-primary shadow-none",
    socialButtonsBlockButton: "md-state-layer min-h-12 rounded-full border-outline-variant",
    footerActionLink: "min-h-12 content-center font-medium text-primary",
    footer: "rounded-b-[28px] bg-surface-container-low",
    formFieldLabel: "md-label-large text-on-surface",
    otpCodeFieldInput: "min-h-14 rounded-md border-outline text-on-surface",
  },
} satisfies NonNullable<ComponentProps<typeof SignIn>["appearance"]>;
