/**
 * Jalali calendar helper stub.
 * Keep date-conversion logic centralized here; expand in a later milestone.
 */
export type JalaliDateParts = {
  year: number;
  month: number;
  day: number;
};

export function formatJalaliPlaceholder(date: Date): string {
  // Placeholder until a dedicated Jalali library is wired.
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
