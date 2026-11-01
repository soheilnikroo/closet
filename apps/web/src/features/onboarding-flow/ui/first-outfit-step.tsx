import { motion } from "motion/react";

import type { FirstOutfitStepProps } from "@/features/onboarding-flow/ui/onboarding-step.types.js";
import { fadeUp } from "@/shared/lib";
import { Button, Card } from "@/shared/ui";

export function FirstOutfitStep({ busy, t, recommendation, onFeedback }: FirstOutfitStepProps) {
  return (
    <motion.div key="first_outfit" {...fadeUp}>
      <Card elevated className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">{t("onboarding.firstOutfitTitle")}</h2>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          {recommendation.explanation}
        </p>
        <ul className="space-y-2">
          {recommendation.outfit.items.map((entry) => (
            <li
              key={entry.clothingItemId}
              className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-sm font-medium"
            >
              {entry.item?.name ?? entry.role}
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-3 gap-2">
          <Button disabled={busy} onClick={() => onFeedback("like")}>
            {t("today.like")}
          </Button>
          <Button variant="tonal" disabled={busy} onClick={() => onFeedback("dislike")}>
            {t("today.dislike")}
          </Button>
          <Button variant="text" disabled={busy} onClick={() => onFeedback("regenerate")}>
            {t("today.tryAnother")}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
