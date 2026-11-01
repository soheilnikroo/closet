import type { DetectedGarment, Recommendation, StyleTag } from "@closet/shared";
import { motion } from "motion/react";

import { fadeUp, localeLabel } from "@/shared/lib";
import { AnimatedScene, Button, Card, Chip, TextField } from "@/shared/ui";

import { STYLE_OPTIONS } from "../onboarding-flow.constants.js";

type SharedStepProps = {
  busy: boolean;
  t: (key: string) => string;
};

export function WelcomeStep({ busy, t, onContinue }: SharedStepProps & { onContinue: () => void }) {
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

export function StylesStep({
  busy,
  t,
  styles,
  onToggle,
  onContinue,
  onSkip,
}: SharedStepProps & {
  styles: StyleTag[];
  onToggle: (style: StyleTag) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
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

export function CityStep({
  busy,
  t,
  language,
  cities,
  cityId,
  onSelect,
  onContinue,
  onSkip,
}: SharedStepProps & {
  language: string;
  cities: Array<{ id: string; name: string; nameFa: string }>;
  cityId: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
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

export function ClothingStep({
  busy,
  t,
  onUpload,
  onSample,
}: SharedStepProps & {
  onUpload: (files: FileList | null) => void;
  onSample: () => void;
}) {
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

export function ReviewStep({
  busy,
  t,
  detections,
  onConfirm,
}: SharedStepProps & {
  detections: DetectedGarment[];
  onConfirm: () => void;
}) {
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

export function FirstOutfitStep({
  busy,
  t,
  recommendation,
  onFeedback,
}: SharedStepProps & {
  recommendation: Recommendation;
  onFeedback: (action: "like" | "dislike" | "regenerate") => void;
}) {
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
