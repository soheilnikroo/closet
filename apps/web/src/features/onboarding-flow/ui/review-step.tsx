import { motion } from "motion/react";

import type { ReviewStepProps } from "@/features/onboarding-flow/ui/onboarding-step.types.js";
import { fadeUp } from "@/shared/lib";
import { Button, Card } from "@/shared/ui";

export function ReviewStep({ busy, t, detections, onConfirm }: ReviewStepProps) {
  return (
    <motion.div key="review" {...fadeUp}>
      <Card elevated className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">{t("onboarding.reviewTitle")}</h2>
        <p className="text-sm text-on-surface-variant">{t("onboarding.reviewHint")}</p>
        <ul className="space-y-2">
          {detections.map((garment) => (
            <li
              key={garment.tempId}
              className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-sm"
            >
              <div className="font-semibold text-on-surface">{garment.name}</div>
              <div className="text-on-surface-variant">
                {garment.primaryColor} · {garment.categorySlug} ·{" "}
                {Math.round(garment.confidence * 100)}%
              </div>
            </li>
          ))}
        </ul>
        <Button fullWidth disabled={busy || detections.length === 0} onClick={onConfirm}>
          {t("onboarding.confirmItems")}
        </Button>
      </Card>
    </motion.div>
  );
}
