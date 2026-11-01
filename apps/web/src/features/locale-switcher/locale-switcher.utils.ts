import { isSupportedLocale, type SupportedLocale } from "@closet/shared";

export function resolveCurrentLocale(language: string): SupportedLocale {
  return isSupportedLocale(language) ? language : "en-GB";
}
