import type { ClothingItem } from "@closet/shared";
import { motion } from "motion/react";

import { StylistChatSheet } from "@/features";
import {
  fadeUp,
  Match,
  pressableCard,
  softSpring,
  staggerContainer,
  staggerItem,
} from "@/shared/lib";
import { BottomSheet, Button, Card, Chip, EmptyState, Fab } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

import { type ClosetSlot, useClosetPage } from "./model/use-closet-page.js";

function SlotFilters({
  slots,
  slotFilter,
  allLabel,
  slotLabel,
  onSelectAll,
  onSelectSlot,
}: {
  slots: readonly ClosetSlot[];
  slotFilter: ClosetSlot | null;
  allLabel: string;
  slotLabel: (slot: ClosetSlot) => string;
  onSelectAll: () => void;
  onSelectSlot: (slot: ClosetSlot) => void;
}) {
  return (
    <div className="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
      <Chip selected={!slotFilter} onClick={onSelectAll}>
        {allLabel}
      </Chip>
      {slots.map((slot) => (
        <Chip key={slot} selected={slotFilter === slot} onClick={() => onSelectSlot(slot)}>
          {slotLabel(slot)}
        </Chip>
      ))}
    </div>
  );
}

function ClosetGrid({
  items,
  busy,
  deleteLabel,
  onRemove,
}: {
  items: ClothingItem[];
  busy: boolean;
  deleteLabel: string;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div className="grid grid-cols-2 gap-3" {...staggerContainer}>
      {items.map((item) => (
        <motion.div key={item.id} variants={staggerItem.variants} {...pressableCard}>
          <Card className="h-full space-y-2">
            <p className="text-xs font-medium text-on-surface-variant capitalize">{item.slot}</p>
            <p className="text-sm font-semibold text-on-surface">{item.name}</p>
            <p className="text-xs text-on-surface-variant">
              {item.primaryColor}
              {item.styleTags[0] ? ` · ${item.styleTags[0]}` : ""}
            </p>
            <Button size="sm" variant="text" disabled={busy} onClick={() => onRemove(item.id)}>
              {deleteLabel}
            </Button>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function ClosetPage() {
  const page = useClosetPage();

  return (
    <AppShell title={page.t("closet.title")}>
      <motion.div className="space-y-4" {...fadeUp}>
        <SlotFilters
          slots={page.slots}
          slotFilter={page.slotFilter}
          allLabel={page.t("closet.all")}
          slotLabel={(slot) => page.t(`closet.slots.${slot}`)}
          onSelectAll={() => page.setSlotFilter(null)}
          onSelectSlot={page.setSlotFilter}
        />

        <Match
          value={page.viewMode}
          cases={{
            error: <Card className="text-sm text-error">{page.error}</Card>,
            empty: (
              <EmptyState
                variant="wardrobeEmpty"
                title={page.t("closet.emptyTitle")}
                description={page.t("closet.emptyBody")}
                action={
                  <Button fullWidth onClick={page.addSheet.onOpen}>
                    {page.t("closet.add")}
                  </Button>
                }
              />
            ),
            grid: (
              <ClosetGrid
                items={page.filtered}
                busy={page.busy}
                deleteLabel={page.t("closet.delete")}
                onRemove={page.removeItem}
              />
            ),
          }}
        />

        <Fab
          label={page.t("closet.add")}
          className="fixed end-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-20"
          onClick={page.addSheet.onOpen}
        >
          +
        </Fab>
      </motion.div>

      <BottomSheet
        open={page.addSheet.open}
        title={page.t("closet.add")}
        onClose={page.addSheet.onClose}
      >
        <div className="space-y-3">
          <motion.label
            className="block touch-manipulation rounded-2xl border border-dashed border-outline-variant/80 bg-surface-container-low px-4 py-6 text-center text-sm transition-colors select-none hover:border-primary/40 hover:bg-primary/5"
            whileTap={{ scale: 0.99 }}
            transition={softSpring}
          >
            <span className="font-medium text-on-surface-variant">
              {page.t("closet.uploadHint")}
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="mt-3 block w-full text-base"
              onChange={(event) => page.onUpload(event.target.files)}
            />
          </motion.label>
          <Button fullWidth variant="tonal" disabled={page.busy} onClick={page.seedSamples}>
            {page.t("closet.useSample")}
          </Button>
          <Button fullWidth variant="text" onClick={page.chat.onOpen}>
            {page.t("stylist.title")}
          </Button>
        </div>
      </BottomSheet>

      <StylistChatSheet open={page.chat.open} onClose={page.chat.onClose} />
    </AppShell>
  );
}
