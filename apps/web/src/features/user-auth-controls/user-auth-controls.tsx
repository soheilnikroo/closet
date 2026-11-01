import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

import { getOptionalClerkPublishableKey } from "@/shared/config";
import { Button } from "@/shared/ui";

export function UserAuthControls() {
  const { t } = useTranslation();
  const publishableKey = getOptionalClerkPublishableKey();
  const clerkEnabled = Boolean(publishableKey) && !publishableKey?.includes("replace_me");

  if (!clerkEnabled) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <SignInButton mode="modal">
          <Button size="sm" variant="text">
            {t("home.ctaSignIn")}
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button size="sm" variant="tonal">
            {t("home.ctaStart")}
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
