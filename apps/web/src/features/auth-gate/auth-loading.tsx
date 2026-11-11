import { useTranslation } from "react-i18next";

import { PageSkeleton } from "@/shared/ui/skeleton.js";

/** Full-viewport session / SSO wait state shared by AuthGate and auth pages. */
export function AuthLoading() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg space-y-6 px-5 py-12">
      <PageSkeleton variant="auth" label={t("auth.loading")} />
    </div>
  );
}
