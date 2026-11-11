import type { OutfitItem, Recommendation } from "@closet/shared";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { OutfitCard } from "@/features/outfit-card/outfit-card.js";
import type { OutfitCardProps } from "@/features/outfit-card/outfit-card.types.js";
import { useApiClient } from "@/shared/hooks";
import { BottomSheet, Button } from "@/shared/ui";

export function InteractiveOutfitCard(props: OutfitCardProps) {
  const api = useApiClient();
  const { t } = useTranslation();
  const [updated, setUpdated] = useState<Recommendation | null>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const recommendation = updated ?? props.recommendation;
  function run(action: () => Promise<void>) {
    startTransition(async () => {
      setError("");
      setMessage("");
      try {
        await action();
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }
  function feedback(action: "like" | "dislike" | "save", callback?: () => void) {
    if (!updated && callback) {
      callback();
      return;
    }
    run(async () => {
      await api.submitFeedback(recommendation.id, { action });
      setMessage(t("experience.feedbackSaved"));
    });
  }
  function replace(entry: OutfitItem) {
    run(async () => {
      const result = await api.replaceItem(recommendation.id, {
        clothingItemId: entry.clothingItemId,
        role: entry.role,
      });
      setUpdated(result.recommendation);
      setMessage(t("experience.swapped"));
    });
  }
  function preview(silhouette?: "straight" | "relaxed") {
    setPreviewOpen(true);
    setImage(null);
    run(async () => {
      const preset = silhouette ?? (await api.getPreferences()).preferences.silhouette;
      const result = await api.tryOn({ outfitId: recommendation.outfit.id, silhouette: preset });
      setImage(result.imageUrl);
    });
  }
  return (
    <div className="space-y-2">
      <OutfitCard
        {...props}
        recommendation={recommendation}
        busy={pending || props.busy}
        onLike={() => feedback("like", props.onLike)}
        onDislike={() => feedback("dislike", props.onDislike)}
        onSave={() => feedback("save", props.onSave)}
        onRegenerate={() =>
          props.onRegenerate
            ? props.onRegenerate()
            : run(async () => {
                const result = await api.createRecommendations({ regenerate: true });
                setUpdated(result.primary);
              })
        }
        onReplace={replace}
        onTryOn={() => preview()}
      />
      <p role="status" className="text-sm text-primary empty:hidden">
        {message}
      </p>
      {!previewOpen ? (
        <p role="alert" className="text-sm text-error empty:hidden">
          {error}
        </p>
      ) : null}
      <BottomSheet
        open={previewOpen}
        title={t("experience.preview")}
        onClose={() => setPreviewOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">{t("experience.previewHint")}</p>
          {image ? (
            <img
              src={image}
              alt={t("experience.previewAlt")}
              className="mx-auto max-h-[50dvh] w-full rounded-3xl"
            />
          ) : (
            <p role="status">{pending ? t("experience.loading") : null}</p>
          )}
          <p role="alert" className="text-sm text-error empty:hidden">
            {error}
          </p>
          <div className="flex gap-2">
            <Button variant="tonal" disabled={pending} onClick={() => preview("straight")}>
              {t("experience.straight")}
            </Button>
            <Button variant="tonal" disabled={pending} onClick={() => preview("relaxed")}>
              {t("experience.relaxed")}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
