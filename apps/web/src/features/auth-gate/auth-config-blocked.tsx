import { useClerk } from "@clerk/clerk-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { AuthRecoveryCard } from "@/features/auth-gate/auth-recovery-card.js";
import { resetClerkAuthAttempts } from "@/features/auth-gate/reset-clerk-auth-attempts.js";
import { SIGN_IN_PATH, SIGN_UP_PATH } from "@/features/auth-gate/sso-callback-panel.constants.js";

/**
 * Shown when a prior Google OAuth attempt is stuck. Offers email/password paths
 * after clearing the abandoned Clerk sign-up.
 */
export function AuthConfigBlocked() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const clerk = useClerk();
  const [busy, setBusy] = useState(false);

  async function goFresh(path: string) {
    setBusy(true);
    try {
      await resetClerkAuthAttempts(clerk);
      await navigate(path, { replace: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthRecoveryCard
      title={t("auth.configBlockedTitle")}
      body={t("auth.configBlockedBody")}
      primaryLabel={busy ? t("auth.loading") : t("auth.continueWithEmail")}
      secondaryLabel={t("auth.trySignInAgain")}
      onPrimary={() => {
        if (busy) {
          return;
        }
        void goFresh(SIGN_UP_PATH);
      }}
      onSecondary={() => {
        if (busy) {
          return;
        }
        void goFresh(SIGN_IN_PATH);
      }}
    />
  );
}
