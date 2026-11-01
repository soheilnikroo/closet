import { SignedIn, SignedOut } from "@clerk/clerk-react";

import type { HomeFooterCtaProps } from "@/pages/home-page/ui/home-footer-cta.types.js";
import { Button } from "@/shared/ui";

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
          <>
            <SignedOut>
              <Button fullWidth size="lg" onClick={onStart}>
                {ctaStart}
              </Button>
              <Button fullWidth variant="text" onClick={onSignIn}>
                {ctaSignIn}
              </Button>
            </SignedOut>
            <SignedIn>
              <Button fullWidth size="lg" onClick={onOpenApp}>
                {ctaOpenApp}
              </Button>
            </SignedIn>
          </>
        ) : (
          <>
            <Button fullWidth size="lg" onClick={onStart}>
              {ctaStart}
            </Button>
            <Button fullWidth variant="text" onClick={onSignIn}>
              {ctaSignIn}
            </Button>
          </>
        )}

        {!clerkEnabled ? (
          <button
            type="button"
            className="md-label-large touch-manipulation py-2.5 text-center text-on-surface-variant underline-offset-4 hover:text-primary hover:underline"
            onClick={onExplore}
          >
            {explore}
          </button>
        ) : (
          <SignedOut>
            <button
              type="button"
              className="md-label-large touch-manipulation py-2.5 text-center text-on-surface-variant underline-offset-4 hover:text-primary hover:underline"
              onClick={onExploreSignedOut}
            >
              {explore}
            </button>
          </SignedOut>
        )}
      </div>
    </footer>
  );
}
