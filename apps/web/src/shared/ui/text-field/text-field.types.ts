import type { InputHTMLAttributes } from "react";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  supportingText?: string;
  errorText?: string;
};
