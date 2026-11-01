import type { ClothingItem } from "@closet/shared";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { useApiClient, useDisclosure } from "@/shared/hooks";

export const CLOSET_SLOTS = ["top", "bottom", "shoes", "outerwear", "accessory"] as const;

export type ClosetSlot = (typeof CLOSET_SLOTS)[number];
export type ClosetViewMode = "empty" | "grid";

export function useClosetPage() {
  const { t } = useTranslation();
  const api = useApiClient();
  const addSheet = useDisclosure();
  const chat = useDisclosure();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [slotFilter, setSlotFilter] = useState<ClosetSlot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
          setError(err instanceof Error ? err.message : t("common.error"));
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
        if (uploaded.media.detections.length > 0) {
          await api.confirmMedia(uploaded.media.id, {
            garments: uploaded.media.detections.map((garment) => ({
              tempId: garment.tempId,
              categorySlug: garment.categorySlug,
              name: garment.name,
              primaryColor: garment.primaryColor,
              colors: garment.colors,
              pattern: garment.pattern,
              styleTags: garment.styleTags,
              seasons: garment.seasons,
              material: garment.material,
              formality: garment.formality,
              fit: garment.fit,
              warmthLevel: garment.warmthLevel,
              confidence: garment.confidence,
              accepted: true,
            })),
          });
        }
        addSheet.onClose();
        const result = await api.listItems();
        setItems(result.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }

  function seedSamples() {
    startTransition(async () => {
      setError(null);
      try {
        await api.seedSampleCatalog();
        addSheet.onClose();
        const result = await api.listItems();
        setItems(result.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }

  function removeItem(id: string) {
    startTransition(async () => {
      setError(null);
      try {
        await api.deleteItem(id);
        const result = await api.listItems();
        setItems(result.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }

  const filtered = slotFilter ? items.filter((item) => item.slot === slotFilter) : items;
  const viewMode: ClosetViewMode = filtered.length === 0 ? "empty" : "grid";

  return {
    t,
    busy: isPending,
    error,
    slots: CLOSET_SLOTS,
    slotFilter,
    setSlotFilter,
    filtered,
    viewMode,
    onUpload,
    seedSamples,
    removeItem,
    addSheet,
    chat,
  };
}
