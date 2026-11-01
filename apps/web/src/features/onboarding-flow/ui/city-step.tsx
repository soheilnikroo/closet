import { motion } from "motion/react";

import type { CityStepProps } from "@/features/onboarding-flow/ui/onboarding-step.types.js";
import { fadeUp, localeLabel } from "@/shared/lib";
import { Button, Card, Chip } from "@/shared/ui";

export function CityStep({
  busy,
  t,
  language,
  cities,
  cityId,
  onSelect,
  onContinue,
  onSkip,
}: CityStepProps) {
  return (
    <motion.div key="city" {...fadeUp}>
      <Card elevated className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">{t("onboarding.cityTitle")}</h2>
        <p className="text-sm text-on-surface-variant">{t("onboarding.cityHint")}</p>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <Chip key={city.id} selected={cityId === city.id} onClick={() => onSelect(city.id)}>
              {localeLabel(language, city.name, city.nameFa)}
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
