import { cn } from "@/shared/lib";

import type { TextFieldProps } from "./text-field.types.js";

export function TextField({
  label,
  supportingText,
  errorText,
  className,
  id,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const describedBy = errorText
    ? `${fieldId}-error`
    : supportingText
      ? `${fieldId}-support`
      : undefined;

  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-sm font-medium text-on-surface-variant">{label}</span>
      <input
        id={fieldId}
        aria-invalid={Boolean(errorText)}
        aria-describedby={describedBy}
        className={cn(
          "h-12 rounded-md border bg-surface-container-lowest px-3 text-on-surface outline-none transition-shadow",
          errorText
            ? "border-error focus:shadow-[0_0_0_2px_var(--md-sys-color-error)]"
            : "border-outline focus:border-primary focus:shadow-[0_0_0_2px_var(--md-sys-color-primary)]",
          className,
        )}
        {...props}
      />
      {errorText ? (
        <span id={`${fieldId}-error`} className="text-xs text-error">
          {errorText}
        </span>
      ) : supportingText ? (
        <span id={`${fieldId}-support`} className="text-xs text-on-surface-variant">
          {supportingText}
        </span>
      ) : null}
    </label>
  );
}
