import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { LocaleSwitcher } from "@/features/locale-switcher";
import { UserAuthControls } from "@/features/user-auth-controls";
import { getOptionalClerkPublishableKey } from "@/shared/config";
import { useAppNavigate } from "@/shared/hooks";
import { fadeUp, softSpring } from "@/shared/lib";
import { AnimatedScene, Button, SkipLink } from "@/shared/ui";

/**
 * Landing composition: brand + story up top, one clear primary action in the
 * thumb zone. Header stays light — no duplicated Get started / Sign in.
 */
export function HomePage() {
  const { t } = useTranslation();
  const navigate = useAppNavigate();
  const publishableKey = getOptionalClerkPublishableKey();
  const clerkEnabled = Boolean(publishableKey) && !publishableKey?.includes("replace_me");

  return (
    <div className="mx-auto flex h-dvh w-full max-w-lg flex-col overflow-hidden bg-surface">
      <SkipLink label={t("a11y.skipToContent")} />

      <header className="flex shrink-0 items-center justify-between gap-3 px-5 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-2">
        <motion.p
          className="md-title-large text-primary"
          style={{ viewTransitionName: "app-brand" }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={softSpring}
        >
          {t("brand")}
        </motion.p>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          {clerkEnabled ? (
            <SignedIn>
              <UserAuthControls />
            </SignedIn>
          ) : null}
        </div>
      </header>

      <motion.main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-5 outline-none"
        {...fadeUp}
      >
        <div className="flex flex-1 flex-col justify-center py-4">
          <p className="md-label-medium tracking-[0.1em] text-on-surface-variant uppercase">
            {t("tagline")}
          </p>
          <h1 className="mt-3 max-w-[12ch] font-display text-[2.25rem] leading-[1.15] font-medium text-on-surface">
            {t("home.title")}
          </h1>
          <p className="md-body-medium mt-3 max-w-[36ch] text-on-surface-variant">
            {t("home.subtitle")}
          </p>

          <div className="mt-10 flex justify-center">
            <AnimatedScene variant="wardrobeEmpty" className="w-44" label={t("brand")} />
          </div>
        </div>
      </motion.main>

      <footer className="shrink-0 border-t border-outline-variant/35 bg-surface-container-low/80 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-lg flex-col items-stretch gap-1.5">
          <Button fullWidth size="lg" onClick={() => navigate("/onboarding")}>
            {t("home.ctaStart")}
          </Button>

          {clerkEnabled ? (
            <SignedOut>
              <Button fullWidth variant="text" onClick={() => navigate("/sign-in")}>
                {t("home.ctaSignIn")}
              </Button>
            </SignedOut>
          ) : (
            <Button fullWidth variant="text" onClick={() => navigate("/sign-in")}>
              {t("home.ctaSignIn")}
            </Button>
          )}

          <button
            type="button"
            className="md-label-large touch-manipulation py-2.5 text-center text-on-surface-variant underline-offset-4 hover:text-primary hover:underline"
            onClick={() => navigate("/today")}
          >
            {t("home.explore")}
          </button>
        </div>
      </footer>
    </div>
  );
}
