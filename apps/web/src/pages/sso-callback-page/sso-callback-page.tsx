import { useSearchParams } from "react-router";

import { SsoCallbackPanel } from "@/features/auth-gate";
import { isClerkEnabled, resolvePostAuthRedirect } from "@/shared/config";
import { Card } from "@/shared/ui";

export function SsoCallbackPage() {
  const [params] = useSearchParams();
  const fallbackRedirectUrl = resolvePostAuthRedirect(params.get("redirect_url"));

  if (!isClerkEnabled()) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg items-center px-4">
        <Card elevated>
          <p className="text-sm text-on-surface-variant">
            Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in `.env` to enable Clerk sign-in.
          </p>
        </Card>
      </div>
    );
  }

  return <SsoCallbackPanel fallbackRedirectUrl={fallbackRedirectUrl} />;
}
