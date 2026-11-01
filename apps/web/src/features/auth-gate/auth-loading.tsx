import { useTranslation } from "react-i18next";

import { Progress } from "@/shared/ui";

/** Full-viewport session / SSO wait state shared by AuthGate and auth pages. */
export function AuthLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6">
      <Progress label={t("auth.loading")} className="max-w-xs" />
      <p className="text-sm text-on-surface-variant">{t("auth.loading")}</p>
    </div>
  );
}
