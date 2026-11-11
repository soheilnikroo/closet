/* oxlint-disable jsx-a11y/anchor-is-valid -- Router Link supplies its href from to. */
import type { OutfitItem, Recommendation } from "@closet/shared";
import { useEffect, useState, useTransition, ViewTransition } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { CollectionPicker } from "@/features/collection-picker/collection-picker.js";
import { OutfitCard } from "@/features/outfit-card/outfit-card.js";
import type { OutfitCardProps } from "@/features/outfit-card/outfit-card.types.js";
import { useApiClient } from "@/shared/hooks";
import { BottomSheet, Button } from "@/shared/ui";

export function InteractiveOutfitCard(props: OutfitCardProps) {
  const api = useApiClient();
  const { t } = useTranslation();
  const [collect, setCollect] = useState<"like" | "save" | null>(null);
  const [updated, setUpdated] = useState<Recommendation | null>(null);
  const [pending, startTransition] = useTransition();
  const [savedId, setSavedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    if (!message) {
      return undefined;
    }
    const timer = setTimeout(() => setMessage(""), 7000);
    return () => clearTimeout(timer);
  }, [message]);
  const recommendation = updated ?? props.recommendation;
  function run(action: () => Promise<void>) {
    startTransition(async () => {
      setError("");
      setMessage("");
      setSavedId(null);
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
      if (action === "dislike") {
        const result = await api.createRecommendations({ regenerate: true });
        setUpdated(result.primary);
      }
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
      <ViewTransition name={`look-${recommendation.outfit.id}`}>
        <OutfitCard
          {...props}
          recommendation={recommendation}
          busy={pending || props.busy}
          onLike={() => setCollect("like")}
          onDislike={() => feedback("dislike", props.onDislike)}
          onSave={() => setCollect("save")}
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
      </ViewTransition>
      {message ? (
        <div
          role="status"
          className="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-xl bg-inverse-surface px-4 py-3 text-inverse-on-surface shadow-elevation-3"
        >
          <span className="md-body-medium">{message}</span>
          {savedId ? (
            <Link
              to={`/collections/${savedId}`}
              className="md-label-large min-h-12 shrink-0 content-center px-2 text-inverse-primary"
            >
              {t("collections.view")}
            </Link>
          ) : null}
          <button
            type="button"
            aria-label={t("common.close")}
            className="md-state-layer min-h-12 min-w-12 rounded-full"
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      ) : null}
      {!previewOpen ? (
        <p role="alert" className="text-sm text-error empty:hidden">
          {error}
        </p>
      ) : null}
      {collect ? (
        <CollectionPicker
          recommendation={recommendation}
          action={collect}
          onClose={() => setCollect(null)}
          onSaved={(name, id) => {
            setSavedId(id);
            setCollect(null);
            setMessage(t("collections.saved", { name }));
          }}
        />
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
