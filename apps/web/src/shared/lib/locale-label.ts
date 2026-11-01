export function localeLabel(language: string, en: string, fa: string): string {
  return language === "fa-IR" ? fa : en;
}
