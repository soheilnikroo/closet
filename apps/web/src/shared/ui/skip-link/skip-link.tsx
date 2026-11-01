import type { SkipLinkProps } from "./skip-link.types.js";

export function SkipLink({ href = "#main-content", label }: SkipLinkProps) {
  return (
    <a className="skip-to-content" href={href}>
      {label}
    </a>
  );
}
