import type { ClothingItem } from "@closet/shared";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { CLOSET_SLOTS } from "@/pages/closet-page/closet-page.constants.js";
import type { ClosetSlot, ClosetViewMode } from "@/pages/closet-page/closet-page.types.js";
import type { ReviewGarment } from "@/pages/closet-page/ui/closet-review-sheet.types.js";
import { useApiClient, useDisclosure } from "@/shared/hooks";

function errorMessage(err: unknown, fallback: string) {
  if (!(err instanceof Error)) {
    return fallback;
  }
  if (/status 5\d\d|failed to fetch|network|ECONNREFUSED/i.test(err.message)) {
    return fallback;
  }
  return err.message;
}

export function useClosetPage() {
  const { t } = useTranslation();
  const api = useApiClient();
  const addSheet = useDisclosure();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [slotFilter, setSlotFilter] = useState<ClosetSlot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<{ mediaId: string; garments: ReviewGarment[] } | null>(null);
  const [selected, setSelected] = useState<ClothingItem | null>(null);
  const [isPending, startTransition] = useTransition();

  function refresh() {
    return api.listItems().then((result) => {
      setItems(result.items);
    });
  }

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      setError(null);
      try {
        const result = await api.listItems();
        if (!cancelled) {
          setItems(result.items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(errorMessage(err, t("common.error")));
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [api, t]);

  function onUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) {
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        const uploaded = await api.uploadMedia(file);
        addSheet.onClose();
        if (uploaded.media.detections.length === 0) {
          setError(t("closet.noDetections"));
          return;
        }
        setReview({
          mediaId: uploaded.media.id,
          garments: uploaded.media.detections.map((garment) =>
            Object.assign({}, garment, { accepted: true }),
          ),
        });
      } catch (err) {
        setError(errorMessage(err, t("common.error")));
      }
    });
  }

  function toggleReviewGarment(tempId: string) {
    setReview((current) =>
      current
        ? {
            ...current,
            garments: current.garments.map((garment) =>
              garment.tempId === tempId
                ? Object.assign({}, garment, { accepted: !garment.accepted })
                : garment,
            ),
          }
        : current,
    );
  }

  function confirmReview() {
    if (!review) {
      return;
    }
    const accepted = review.garments.filter((garment) => garment.accepted);
    if (accepted.length === 0) {
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        await api.confirmMedia(review.mediaId, { garments: accepted });
        setReview(null);
        await refresh();
      } catch (err) {
        setError(errorMessage(err, t("common.error")));
      }
    });
  }

  function seedSamples() {
    startTransition(async () => {
      setError(null);
      try {
        await api.seedSampleCatalog();
        addSheet.onClose();
        await refresh();
      } catch (err) {
        setError(errorMessage(err, t("common.error")));
      }
    });
  }

  function saveSelected(name: string) {
    if (!selected) {
      return;
    }
    startTransition(async () => {
      setError(null);
      try {
        const updated = await api.updateItem(selected.id, { name });
        setItems((current) =>
          current.map((item) => (item.id === updated.item.id ? updated.item : item)),
        );
        setSelected(updated.item);
      } catch (err) {
        setError(errorMessage(err, t("common.error")));
      }
    });
  }

  function removeSelected() {
    if (!selected) {
      return;
    }
    startTransition(async () => {
      setError(null);
      try {
        await api.deleteItem(selected.id);
        setItems((current) => current.filter((item) => item.id !== selected.id));
        setSelected(null);
      } catch (err) {
        setError(errorMessage(err, t("common.error")));
      }
    });
  }

  const filtered = slotFilter ? items.filter((item) => item.slot === slotFilter) : items;
  const viewMode: ClosetViewMode =
    items.length === 0 ? "empty" : filtered.length === 0 ? "filteredEmpty" : "grid";

  return {
    t,
    busy: isPending,
    error,
    slots: CLOSET_SLOTS,
    slotFilter,
    setSlotFilter,
    filtered,
    itemCount: items.length,
    viewMode,
    onUpload,
    seedSamples,
    addSheet,
    review,
    closeReview: () => setReview(null),
    toggleReviewGarment,
    confirmReview,
    selected,
    openItem: setSelected,
    closeItem: () => setSelected(null),
    saveSelected,
    removeSelected,
  };
}
