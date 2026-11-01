import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { LocaleSwitcher } from "@/features/locale-switcher";
import { UserAuthControls } from "@/features/user-auth-controls";
import { fadeUp } from "@/shared/lib";
import { Button, Card, SkipLink } from "@/shared/ui";

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto flex min-h-svh w-full max-w-lg flex-col overflow-hidden px-5 pt-[max(1.5rem,env(safe-area-inset-top,0px))] pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]">
      <SkipLink label={t("a11y.skipToContent")} />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgb(182_242_184/0.55),transparent_45%),radial-gradient(circle_at_90%_20%,rgb(188_235_242/0.4),transparent_40%),linear-gradient(180deg,var(--md-sys-color-surface),var(--md-sys-color-surface-container-low))]"
        aria-hidden
      />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <p className="font-display text-2xl font-semibold tracking-tight text-primary">
          {t("brand")}
        </p>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <UserAuthControls />
        </div>
      </div>

      <motion.div
        id="main-content"
        tabIndex={-1}
        className="relative z-10 mt-16 flex flex-1 flex-col outline-none"
        {...fadeUp}
      >
        <p className="text-sm font-medium tracking-[0.18em] text-on-surface-variant uppercase">
          {t("tagline")}
        </p>
        <h1 className="mt-3 max-w-[14ch] font-display text-4xl leading-tight font-semibold text-on-surface">
          {t("home.title")}
        </h1>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-on-surface-variant">
          {t("home.subtitle")}
        </p>

        <Card elevated className="mt-10 space-y-4">
          <Button fullWidth onClick={() => void navigate("/onboarding")}>
            {t("home.ctaStart")}
          </Button>
          <Button variant="outlined" fullWidth onClick={() => void navigate("/sign-in")}>
            {t("home.ctaSignIn")}
          </Button>
          <Button variant="text" fullWidth onClick={() => void navigate("/today")}>
            {t("home.explore")}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
