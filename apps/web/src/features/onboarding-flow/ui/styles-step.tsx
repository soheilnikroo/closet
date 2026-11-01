import { motion } from "motion/react";

import { STYLE_OPTIONS } from "@/features/onboarding-flow/onboarding-flow.constants.js";
import type { StylesStepProps } from "@/features/onboarding-flow/ui/onboarding-step.types.js";
import { fadeUp } from "@/shared/lib";
import { Button, Card, Chip } from "@/shared/ui";

export function StylesStep({ busy, t, styles, onToggle, onContinue, onSkip }: StylesStepProps) {
  return (
    <motion.div key="styles" {...fadeUp}>
      <Card elevated className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">{t("onboarding.stylesTitle")}</h2>
        <p className="text-sm text-on-surface-variant">{t("onboarding.stylesHint")}</p>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((option) => (
            <Chip
              key={option.id}
              selected={styles.includes(option.id)}
              onClick={() => onToggle(option.id)}
            >
              {t(option.labelKey)}
            </Chip>
          ))}
        </div>
        <div className="flex gap-2">
          <Button fullWidth disabled={busy} onClick={onContinue}>
            {t("common.continue")}
          </Button>
          <Button fullWidth variant="text" disabled={busy} onClick={onSkip}>
            {t("common.skip")}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
