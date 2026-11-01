import { useAuth } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router";

import type { AuthGateProps } from "@/features/auth-gate/auth-gate.types.js";
import { Progress } from "@/shared/ui";

export function ClerkAuthGate({ children }: AuthGateProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useTranslation();

  if (!isLoaded) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6">
        <Progress label={t("auth.loading")} className="max-w-xs" />
        <p className="text-sm text-on-surface-variant">{t("auth.loading")}</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}
