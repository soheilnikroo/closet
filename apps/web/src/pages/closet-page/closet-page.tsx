import type { ClothingItem } from "@closet/shared";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { StylistChatSheet } from "@/features";
import { useApiClient } from "@/shared/hooks/use-api-client.js";
import { fadeUp, pressableCard, softSpring, staggerContainer, staggerItem } from "@/shared/lib";
import { BottomSheet, Button, Card, Chip, EmptyState, Fab } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

export function ClosetPage() {
  const { t } = useTranslation();
  const api = useApiClient();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [slotFilter, setSlotFilter] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await api.listItems();
      setItems(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }, [api, t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) {
      return;
    }
    setBusy(true);
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
      setAddOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function seedSamples() {
    setBusy(true);
    try {
      await api.seedSampleCatalog();
      setAddOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(id: string) {
    setBusy(true);
    try {
      await api.deleteItem(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setBusy(false);
    }
  }

  const filtered = slotFilter ? items.filter((item) => item.slot === slotFilter) : items;
  const slots = ["top", "bottom", "shoes", "outerwear", "accessory"] as const;

  return (
    <AppShell title={t("closet.title")}>
      <motion.div className="space-y-4" {...fadeUp}>
        <div className="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
          <Chip selected={!slotFilter} onClick={() => setSlotFilter(null)}>
            {t("closet.all")}
          </Chip>
          {slots.map((slot) => (
            <Chip key={slot} selected={slotFilter === slot} onClick={() => setSlotFilter(slot)}>
              {t(`closet.slots.${slot}`)}
            </Chip>
          ))}
        </div>

        {error ? <Card className="text-sm text-error">{error}</Card> : null}

        {filtered.length === 0 ? (
          <EmptyState
            variant="wardrobeEmpty"
            title={t("closet.emptyTitle")}
            description={t("closet.emptyBody")}
            action={
              <Button fullWidth onClick={() => setAddOpen(true)}>
                {t("closet.add")}
              </Button>
            }
          />
        ) : (
          <motion.div className="grid grid-cols-2 gap-3" {...staggerContainer}>
            {filtered.map((item) => (
              <motion.div key={item.id} variants={staggerItem.variants} {...pressableCard}>
                <Card className="h-full space-y-2">
                  <p className="text-xs font-medium text-on-surface-variant capitalize">
                    {item.slot}
                  </p>
                  <p className="text-sm font-semibold text-on-surface">{item.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {item.primaryColor}
                    {item.styleTags[0] ? ` · ${item.styleTags[0]}` : ""}
                  </p>
                  <Button
                    size="sm"
                    variant="text"
                    disabled={busy}
                    onClick={() => void removeItem(item.id)}
                  >
                    {t("closet.delete")}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <Fab
          label={t("closet.add")}
          className="fixed end-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-20"
          onClick={() => setAddOpen(true)}
        >
          +
        </Fab>
      </motion.div>

      <BottomSheet open={addOpen} title={t("closet.add")} onClose={() => setAddOpen(false)}>
        <div className="space-y-3">
          <motion.label
            className="block rounded-2xl border border-dashed border-outline-variant/80 bg-surface-container-low px-4 py-6 text-center text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
            whileTap={{ scale: 0.99 }}
            transition={softSpring}
          >
            <span className="font-medium text-on-surface-variant">{t("closet.uploadHint")}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="mt-3 block w-full text-sm"
              onChange={(event) => void onUpload(event.target.files)}
            />
          </motion.label>
          <Button fullWidth variant="tonal" disabled={busy} onClick={() => void seedSamples()}>
            {t("closet.useSample")}
          </Button>
          <Button fullWidth variant="text" onClick={() => setChatOpen(true)}>
            {t("stylist.title")}
          </Button>
        </div>
      </BottomSheet>

      <StylistChatSheet open={chatOpen} onClose={() => setChatOpen(false)} />
    </AppShell>
  );
}
