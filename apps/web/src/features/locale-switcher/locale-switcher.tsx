import type { SupportedLocale } from "@closet/shared";
import { useTranslation } from "react-i18next";

import { resolveCurrentLocale } from "@/features/locale-switcher/locale-switcher.utils.js";
import { changeLocale } from "@/shared/i18n";
import { Chip } from "@/shared/ui";

export function LocaleSwitcher() {
  const { i18n, t } = useTranslation();
  const current = resolveCurrentLocale(i18n.language);
  const nextLocale: SupportedLocale = current === "fa-IR" ? "en-GB" : "fa-IR";
  const label = nextLocale === "fa-IR" ? t("locale.switchToFa") : t("locale.switchToEn");

  return (
    <Chip
      onClick={() => {
        void changeLocale(nextLocale);
      }}
    >
      {label}
    </Chip>
  );
}
