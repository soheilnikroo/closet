export const supportedLocales = ["en-GB", "fa-IR"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const defaultLocale: SupportedLocale = "en-GB";

export type TextDirection = "ltr" | "rtl";

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (supportedLocales as readonly string[]).includes(value);
}

export function getTextDirection(locale: SupportedLocale): TextDirection {
  return locale === "fa-IR" ? "rtl" : "ltr";
}
