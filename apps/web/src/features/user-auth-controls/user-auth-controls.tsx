import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

import { isClerkEnabled, POST_AUTH_REDIRECT } from "@/shared/config";
import { useOfflineOnly } from "@/shared/lib/offline/offline-context.js";
import { Button } from "@/shared/ui";

/** Compact header auth — sign-in when signed out, avatar when signed in. No Get started here. */
export function UserAuthControls() {
  const { t } = useTranslation();
  const offlineOnly = useOfflineOnly();

  if (offlineOnly || !isClerkEnabled()) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <SignedOut>
        <SignInButton mode="redirect" fallbackRedirectUrl={POST_AUTH_REDIRECT}>
          <Button size="sm" variant="text">
            {t("home.ctaSignIn")}
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
