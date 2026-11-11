/** Original Closet mark: an open wardrobe framing a hanger. */
export function ClosetMark({ animated = false }: { animated?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={animated ? "closet-mark closet-mark-animated" : "closet-mark"}
    >
      <rect x="9" y="7" width="46" height="50" rx="12" stroke="currentColor" strokeWidth="3" />
      <path
        className="closet-hanger"
        d="M28 25a4 4 0 1 1 7 3l-3 3v3m0 0L18 43h28L32 34Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="closet-door"
        d="M13 11h18v42H13"
        fill="var(--md-sys-color-surface, #fafbf7)"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        className="closet-handle"
        d="M25 30v6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function ClosetBrand({ label = "Closet" }: { label?: string }) {
  return (
    <span className="closet-brand">
      <ClosetMark />
      <span>{label}</span>
    </span>
  );
}
