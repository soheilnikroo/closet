import { cn } from "@/shared/lib";
import type { TextFieldProps } from "@/shared/ui/text-field/text-field.types.js";

/**
 * Material 3 outlined text field — 56dp height, outline / primary focus.
 */
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
    <label className="flex w-full flex-col gap-1">
      <span className="md-body-medium px-1 text-on-surface-variant">{label}</span>
      <input
        id={fieldId}
        aria-invalid={Boolean(errorText)}
        aria-describedby={describedBy}
        className={cn(
          "h-14 rounded-sm border bg-surface px-4 text-on-surface outline-none transition-[border-color,box-shadow] duration-150",
          errorText
            ? "border-error focus:border-error focus:shadow-[inset_0_0_0_1px_var(--md-sys-color-error)]"
            : "border-outline focus:border-primary focus:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)]",
          className,
        )}
        {...props}
      />
      {errorText ? (
        <span id={`${fieldId}-error`} className="md-body-medium px-1 text-error">
          {errorText}
        </span>
      ) : supportingText ? (
        <span id={`${fieldId}-support`} className="md-body-medium px-1 text-on-surface-variant">
          {supportingText}
        </span>
      ) : null}
    </label>
  );
}
