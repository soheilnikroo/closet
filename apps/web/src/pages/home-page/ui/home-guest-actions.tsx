import type { HomeGuestActionsProps } from "@/pages/home-page/ui/home-guest-actions.types.js";
import { Button } from "@/shared/ui";

/** Always-visible guest CTAs (also used while Clerk session is still loading). */
export function HomeGuestActions({
  ctaStart,
  ctaSignIn,
  explore,
  onStart,
  onSignIn,
  onExplore,
}: HomeGuestActionsProps) {
  return (
    <>
      <Button fullWidth size="lg" onClick={onStart}>
        {ctaStart}
      </Button>
      <Button fullWidth variant="text" onClick={onSignIn}>
        {ctaSignIn}
      </Button>
      <button
        type="button"
        className="md-label-large touch-manipulation py-2.5 text-center text-on-surface-variant underline-offset-4 hover:text-primary hover:underline"
        onClick={onExplore}
      >
        {explore}
      </button>
    </>
  );
}
