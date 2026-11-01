import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { LocaleSwitcher } from "@/features/locale-switcher";
import { fadeUp } from "@/shared/lib";
import { Button, Card, TopAppBar } from "@/shared/ui";

export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-surface">
      <TopAppBar title={t("onboarding.title")} trailing={<LocaleSwitcher />} />
      <motion.main className="flex flex-1 flex-col px-4 pt-4 pb-10" {...fadeUp}>
        <Card elevated className="space-y-4">
          <p className="text-sm leading-relaxed text-on-surface-variant">{t("onboarding.body")}</p>
          <Button fullWidth onClick={() => void navigate("/today")}>
            {t("onboarding.continue")}
          </Button>
        </Card>
      </motion.main>
    </div>
  );
}
