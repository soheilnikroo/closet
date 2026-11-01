import type { DetectedGarment, Recommendation, StyleTag } from "@closet/shared";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { useApiClient } from "@/shared/hooks";

import { type OnboardingStep } from "../onboarding-flow.constants.js";
import type { OnboardingFlowProps } from "../onboarding-flow.types.js";

const STEP_PROGRESS: Record<OnboardingStep, number> = {
  welcome: 10,
  styles: 25,
  city: 40,
  clothing: 55,
  review: 70,
  first_outfit: 85,
  feedback: 95,
};

export function useOnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { t, i18n } = useTranslation();
  const api = useApiClient();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [styles, setStyles] = useState<StyleTag[]>([]);
  const [cities, setCities] = useState<Array<{ id: string; name: string; nameFa: string }>>([]);
  const [cityId, setCityId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaId, setMediaId] = useState<string | null>(null);
  const [detections, setDetections] = useState<DetectedGarment[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isPending, startTransition] = useTransition();

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

  function goStyles() {
    startTransition(async () => {
      setError(null);
      try {
        setStep("styles");
        await persistStep("styles");
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }

  function saveStyles(skip = false) {
    startTransition(async () => {
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
      }
    });
  }

  function saveCity(skip = false) {
    startTransition(async () => {
      setError(null);
      try {
        if (!skip && cityId) {
          await api.updateProfile({ cityId });
        }
        setStep("clothing");
        await persistStep("clothing");
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }

  function uploadPhotos(files: FileList | null) {
    const file = files?.item(0);
    if (!file) {
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        const uploaded = await api.uploadMedia(file);
        setMediaId(uploaded.media.id);
        setDetections(uploaded.media.detections);
        setStep("review");
        await persistStep("review");
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }

  async function generateFirstOutfit() {
    const result = await api.createRecommendations({ regenerate: true });
    setRecommendation(result.primary);
    setStep("first_outfit");
    await persistStep("first_outfit");
  }

  function loadSampleCatalog() {
    startTransition(async () => {
      setError(null);
      try {
        await api.seedSampleCatalog();
        await generateFirstOutfit();
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }

  function confirmDetections() {
    if (!mediaId) {
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        await api.confirmMedia(mediaId, {
          garments: detections.map((garment) => ({ ...garment, accepted: true })),
        });
        await generateFirstOutfit();
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }

  function sendFeedback(action: "like" | "dislike" | "regenerate") {
    if (!recommendation) {
      return;
    }

    startTransition(async () => {
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
      }
    });
  }

  return {
    t,
    i18n,
    step,
    progress: STEP_PROGRESS[step],
    busy: isPending,
    error,
    styles,
    toggleStyle,
    cities,
    cityId,
    setCityId,
    detections,
    recommendation,
    goStyles,
    saveStyles,
    saveCity,
    uploadPhotos,
    loadSampleCatalog,
    confirmDetections,
    sendFeedback,
  };
}
