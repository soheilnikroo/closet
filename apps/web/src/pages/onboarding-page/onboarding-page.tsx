import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { LocaleSwitcher, OnboardingFlow } from "@/features";
import { useAppNavigate } from "@/shared/hooks";
import { fadeUp } from "@/shared/lib";
import { TopAppBar } from "@/shared/ui";

export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useAppNavigate();

  return (
    <div className="mx-auto flex h-dvh w-full max-w-lg flex-col overflow-hidden bg-surface">
      <TopAppBar title={t("onboarding.title")} trailing={<LocaleSwitcher />} />
      <motion.main
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]"
        {...fadeUp}
      >
        <OnboardingFlow onComplete={() => navigate("/today")} />
      </motion.main>
    </div>
  );
}
