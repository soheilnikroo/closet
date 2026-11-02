import { useAuth } from "@clerk/clerk-react";

import type { HomeFooterCtaProps } from "@/pages/home-page/ui/home-footer-cta.types.js";
import { HomeGuestActions } from "@/pages/home-page/ui/home-guest-actions.js";
import { Button } from "@/shared/ui";

function ClerkHomeFooterActions({
  ctaStart,
  ctaSignIn,
  ctaOpenApp,
  explore,
  onStart,
  onSignIn,
  onOpenApp,
  onExploreSignedOut,
}: Omit<HomeFooterCtaProps, "clerkEnabled" | "onExplore">) {
  const { isLoaded, isSignedIn } = useAuth();

  // SignedIn/SignedOut render nothing until Clerk loads — keep guest CTAs visible.
  if (!isLoaded || !isSignedIn) {
    return (
      <HomeGuestActions
        ctaStart={ctaStart}
        ctaSignIn={ctaSignIn}
        explore={explore}
        onStart={onStart}
        onSignIn={onSignIn}
        onExplore={onExploreSignedOut}
      />
    );
  }

  return (
    <Button fullWidth size="lg" onClick={onOpenApp}>
      {ctaOpenApp}
    </Button>
  );
}

export function HomeFooterCta({
  clerkEnabled,
  ctaStart,
  ctaSignIn,
  ctaOpenApp,
  explore,
  onStart,
  onSignIn,
  onOpenApp,
  onExplore,
  onExploreSignedOut,
}: HomeFooterCtaProps) {
  return (
    <footer className="shrink-0 border-t border-outline-variant/35 bg-surface-container-low/80 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-lg flex-col items-stretch gap-1.5">
        {clerkEnabled ? (
          <ClerkHomeFooterActions
            ctaStart={ctaStart}
            ctaSignIn={ctaSignIn}
            ctaOpenApp={ctaOpenApp}
            explore={explore}
            onStart={onStart}
            onSignIn={onSignIn}
            onOpenApp={onOpenApp}
            onExploreSignedOut={onExploreSignedOut}
          />
        ) : (
          <HomeGuestActions
            ctaStart={ctaStart}
            ctaSignIn={ctaSignIn}
            explore={explore}
            onStart={onStart}
            onSignIn={onSignIn}
            onExplore={onExplore}
          />
        )}
      </div>
    </footer>
  );
}
