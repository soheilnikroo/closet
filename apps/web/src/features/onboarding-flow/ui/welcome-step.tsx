import { motion } from "motion/react";

import type { WelcomeStepProps } from "@/features/onboarding-flow/ui/onboarding-step.types.js";
import { fadeUp } from "@/shared/lib";
import { AnimatedScene, Button, Card } from "@/shared/ui";

export function WelcomeStep({ busy, t, onContinue }: WelcomeStepProps) {
  return (
    <motion.div key="welcome" {...fadeUp}>
      <Card elevated className="space-y-4">
        <AnimatedScene variant="welcome" className="w-40" label={t("onboarding.welcomeTitle")} />
        <h1 className="font-display text-3xl font-semibold text-on-surface">
          {t("onboarding.welcomeTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          {t("onboarding.welcomeBody")}
        </p>
        <Button fullWidth disabled={busy} onClick={onContinue}>
          {t("onboarding.getStarted")}
        </Button>
      </Card>
    </motion.div>
  );
}
