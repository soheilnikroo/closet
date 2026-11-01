import {
  defaultLocale,
  getTextDirection,
  isSupportedLocale,
  type SupportedLocale,
} from "@closet/shared";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { resources } from "@/shared/i18n/resources.js";

const STORAGE_KEY = "closet.locale";

export function readStoredLocale(): SupportedLocale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && isSupportedLocale(stored)) {
    return stored;
  }

  return defaultLocale;
}

export function persistLocale(locale: SupportedLocale): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, locale);
}

export function applyDocumentLocale(locale: SupportedLocale): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = locale;
  document.documentElement.dir = getTextDirection(locale);
}

export async function initI18n(locale: SupportedLocale = readStoredLocale()): Promise<typeof i18n> {
  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: defaultLocale,
      interpolation: {
        escapeValue: false,
      },
    });
  } else {
    await i18n.changeLanguage(locale);
  }

  applyDocumentLocale(locale);
  return i18n;
}

export async function changeLocale(locale: SupportedLocale): Promise<void> {
  persistLocale(locale);
  applyDocumentLocale(locale);
  await i18n.changeLanguage(locale);
}

export { i18n };
