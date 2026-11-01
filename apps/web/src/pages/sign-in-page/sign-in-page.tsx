import { SignIn } from "@clerk/clerk-react";

import { getOptionalClerkPublishableKey } from "@/shared/config";
import { Card } from "@/shared/ui";

export function SignInPage() {
  const publishableKey = getOptionalClerkPublishableKey();

  if (!publishableKey || publishableKey.includes("replace_me")) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg items-center px-4 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
        <Card elevated>
          <p className="text-sm text-on-surface-variant">
            Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in `.env` to enable Clerk sign-in.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg items-center justify-center px-4 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
