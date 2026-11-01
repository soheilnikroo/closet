import type { SkipLinkProps } from "@/shared/ui/skip-link/skip-link.types.js";

export function SkipLink({ href = "#main-content", label }: SkipLinkProps) {
  return (
    <a className="skip-to-content" href={href}>
      {label}
    </a>
  );
}
