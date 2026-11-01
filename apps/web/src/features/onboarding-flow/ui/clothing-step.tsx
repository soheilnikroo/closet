import { motion } from "motion/react";

import type { ClothingStepProps } from "@/features/onboarding-flow/ui/onboarding-step.types.js";
import { fadeUp } from "@/shared/lib";
import { Button, Card, TextField } from "@/shared/ui";

export function ClothingStep({ busy, t, onUpload, onSample }: ClothingStepProps) {
  return (
    <motion.div key="clothing" {...fadeUp}>
      <Card elevated className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">{t("onboarding.clothingTitle")}</h2>
        <p className="text-sm text-on-surface-variant">{t("onboarding.clothingHint")}</p>
        <TextField
          type="file"
          accept="image/*"
          multiple
          label={t("onboarding.uploadPhotos")}
          onChange={(event) => onUpload(event.target.files)}
        />
        <Button fullWidth variant="tonal" disabled={busy} onClick={onSample}>
          {t("onboarding.useSample")}
        </Button>
      </Card>
    </motion.div>
  );
}
