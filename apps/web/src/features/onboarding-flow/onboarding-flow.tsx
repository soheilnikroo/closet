import type { DetectedGarment, Recommendation, StyleTag } from "@closet/shared";
import { motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useApiClient } from "@/shared/hooks/use-api-client.js";
import { fadeUp } from "@/shared/lib";
import { AnimatedScene, Button, Card, Chip, Progress, TextField } from "@/shared/ui";

import { STYLE_OPTIONS, type OnboardingStep } from "./onboarding-flow.constants.js";
import type { OnboardingFlowProps } from "./onboarding-flow.types.js";

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { t, i18n } = useTranslation();
  const api = useApiClient();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [styles, setStyles] = useState<StyleTag[]>([]);
  const [cities, setCities] = useState<Array<{ id: string; name: string; nameFa: string }>>([]);
  const [cityId, setCityId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaId, setMediaId] = useState<string | null>(null);
  const [detections, setDetections] = useState<DetectedGarment[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  async function persistStep(next: OnboardingStep | "done", completed = false) {
    await api.updateProfile({
      onboardingStep: completed ? "done" : next,
      onboardingCompleted: completed,
      ...(cityId ? { cityId } : {}),
    });
  }

  function toggleStyle(style: StyleTag) {
    setStyles((current) =>
      current.includes(style) ? current.filter((entry) => entry !== style) : [...current, style],
    );
  }

  async function goStyles() {
    setStep("styles");
    await persistStep("styles");
  }

  async function saveStyles(skip = false) {
    setBusy(true);
    setError(null);
    try {
      if (!skip) {
        await api.updateStyleProfile({ preferredStyles: styles });
      }
      const cityList = await api.listCities();
      setCities(cityList);
      setStep("city");
      await persistStep("city");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function saveCity(skip = false) {
    setBusy(true);
    setError(null);
    try {
      if (!skip && cityId) {
        await api.updateProfile({ cityId });
      }
      setStep("clothing");
      await persistStep("clothing");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhotos(files: FileList | null) {
    const file = files?.item(0);
    if (!file) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const uploaded = await api.uploadMedia(file);
      setMediaId(uploaded.media.id);
      setDetections(uploaded.media.detections);
      setStep("review");
      await persistStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function loadSampleCatalog() {
    setBusy(true);
    setError(null);
    try {
      await api.seedSampleCatalog();
      await generateFirstOutfit();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
      setBusy(false);
    }
  }

  async function confirmDetections() {
    if (!mediaId) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.confirmMedia(mediaId, {
        garments: detections.map((garment) => ({ ...garment, accepted: true })),
      });
      await generateFirstOutfit();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
      setBusy(false);
    }
  }

  async function generateFirstOutfit() {
    setBusy(true);
    setError(null);
    try {
      const result = await api.createRecommendations({ regenerate: true });
      setRecommendation(result.primary);
      setStep("first_outfit");
      await persistStep("first_outfit");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function sendFeedback(action: "like" | "dislike" | "regenerate") {
    if (!recommendation) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (action === "regenerate") {
        const result = await api.createRecommendations({ regenerate: true });
        setRecommendation(result.primary);
        return;
      }
      await api.submitFeedback(recommendation.id, { action });
      await persistStep("done", true);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Progress
        value={
          step === "welcome"
            ? 10
            : step === "styles"
              ? 25
              : step === "city"
                ? 40
                : step === "clothing"
                  ? 55
                  : step === "review"
                    ? 70
                    : step === "first_outfit"
                      ? 85
                      : 95
        }
      />

      {error ? (
        <Card className="border border-error/30 bg-error-container/20 text-sm text-error">
          {error}
        </Card>
      ) : null}

      {step === "welcome" ? (
        <motion.div key="welcome" {...fadeUp}>
          <Card elevated className="space-y-4">
            <AnimatedScene
              variant="welcome"
              className="w-40"
              label={t("onboarding.welcomeTitle")}
            />
            <h1 className="font-display text-3xl font-semibold text-on-surface">
              {t("onboarding.welcomeTitle")}
            </h1>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              {t("onboarding.welcomeBody")}
            </p>
            <Button fullWidth disabled={busy} onClick={() => void goStyles()}>
              {t("onboarding.getStarted")}
            </Button>
          </Card>
        </motion.div>
      ) : null}

      {step === "styles" ? (
        <motion.div key="styles" {...fadeUp}>
          <Card elevated className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">{t("onboarding.stylesTitle")}</h2>
            <p className="text-sm text-on-surface-variant">{t("onboarding.stylesHint")}</p>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((option) => (
                <Chip
                  key={option.id}
                  selected={styles.includes(option.id)}
                  onClick={() => toggleStyle(option.id)}
                >
                  {t(option.labelKey)}
                </Chip>
              ))}
            </div>
            <div className="flex gap-2">
              <Button fullWidth disabled={busy} onClick={() => void saveStyles(false)}>
                {t("common.continue")}
              </Button>
              <Button
                fullWidth
                variant="text"
                disabled={busy}
                onClick={() => void saveStyles(true)}
              >
                {t("common.skip")}
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : null}

      {step === "city" ? (
        <motion.div key="city" {...fadeUp}>
          <Card elevated className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">{t("onboarding.cityTitle")}</h2>
            <p className="text-sm text-on-surface-variant">{t("onboarding.cityHint")}</p>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <Chip
                  key={city.id}
                  selected={cityId === city.id}
                  onClick={() => setCityId(city.id)}
                >
                  {i18n.language === "fa-IR" ? city.nameFa : city.name}
                </Chip>
              ))}
            </div>
            <div className="flex gap-2">
              <Button fullWidth disabled={busy} onClick={() => void saveCity(false)}>
                {t("common.continue")}
              </Button>
              <Button fullWidth variant="text" disabled={busy} onClick={() => void saveCity(true)}>
                {t("common.skip")}
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : null}

      {step === "clothing" ? (
        <motion.div key="clothing" {...fadeUp}>
          <Card elevated className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">{t("onboarding.clothingTitle")}</h2>
            <p className="text-sm text-on-surface-variant">{t("onboarding.clothingHint")}</p>
            <TextField
              type="file"
              accept="image/*"
              multiple
              label={t("onboarding.uploadPhotos")}
              onChange={(event) => void uploadPhotos(event.target.files)}
            />
            <Button
              fullWidth
              variant="tonal"
              disabled={busy}
              onClick={() => void loadSampleCatalog()}
            >
              {t("onboarding.useSample")}
            </Button>
          </Card>
        </motion.div>
      ) : null}

      {step === "review" ? (
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
            <Button
              fullWidth
              disabled={busy || detections.length === 0}
              onClick={() => void confirmDetections()}
            >
              {t("onboarding.confirmItems")}
            </Button>
          </Card>
        </motion.div>
      ) : null}

      {step === "first_outfit" && recommendation ? (
        <motion.div key="first_outfit" {...fadeUp}>
          <Card elevated className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">
              {t("onboarding.firstOutfitTitle")}
            </h2>
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
              <Button disabled={busy} onClick={() => void sendFeedback("like")}>
                {t("today.like")}
              </Button>
              <Button variant="tonal" disabled={busy} onClick={() => void sendFeedback("dislike")}>
                {t("today.dislike")}
              </Button>
              <Button
                variant="text"
                disabled={busy}
                onClick={() => void sendFeedback("regenerate")}
              >
                {t("today.tryAnother")}
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : null}
    </div>
  );
}
