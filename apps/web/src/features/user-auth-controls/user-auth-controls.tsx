import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

import { getOptionalClerkPublishableKey } from "@/shared/config";
import { Button } from "@/shared/ui";

/** Compact header auth — sign-in when signed out, avatar when signed in. No Get started here. */
export function UserAuthControls() {
  const { t } = useTranslation();
  const publishableKey = getOptionalClerkPublishableKey();
  const clerkEnabled = Boolean(publishableKey) && !publishableKey?.includes("replace_me");

  if (!clerkEnabled) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <SignedOut>
        <SignInButton mode="modal">
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
