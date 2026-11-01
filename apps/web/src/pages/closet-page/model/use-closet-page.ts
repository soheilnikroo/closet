import type { ClothingItem } from "@closet/shared";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { CLOSET_SLOTS } from "@/pages/closet-page/closet-page.constants.js";
import type { ClosetSlot, ClosetViewMode } from "@/pages/closet-page/closet-page.types.js";
import { useApiClient, useDisclosure } from "@/shared/hooks";
import { acceptDetectedGarments } from "@/shared/lib";

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
            garments: acceptDetectedGarments(uploaded.media.detections),
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
