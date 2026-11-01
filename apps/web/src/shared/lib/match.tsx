import type { ReactNode } from "react";

/**
 * Renders one of a keyed case map instead of stacking ternaries.
 */
export function Match<T extends string>({
  value,
  cases,
  fallback = null,
}: {
  value: T;
  cases: Partial<Record<T, ReactNode>>;
  fallback?: ReactNode;
}) {
  return <>{cases[value] ?? fallback}</>;
}
