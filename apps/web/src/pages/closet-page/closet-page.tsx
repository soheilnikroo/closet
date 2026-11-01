import { motion } from "motion/react";

import { StylistChatSheet } from "@/features";
import { useClosetPage } from "@/pages/closet-page/model/use-closet-page.js";
import { ClosetAddSheet } from "@/pages/closet-page/ui/closet-add-sheet.js";
import { ClosetGrid } from "@/pages/closet-page/ui/closet-grid.js";
import { SlotFilters } from "@/pages/closet-page/ui/slot-filters.js";
import { fadeUp, Match } from "@/shared/lib";
import { Button, Card, EmptyState, Fab, FAB_ABOVE_NAV_CLASS } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

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

        <Card className="text-sm text-error empty:hidden">{page.error}</Card>

        <Match
          value={page.viewMode}
          cases={{
            empty: (
              <EmptyState
                variant="closetEmpty"
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
          className={FAB_ABOVE_NAV_CLASS}
          onClick={page.addSheet.onOpen}
        >
          +
        </Fab>
      </motion.div>

      <ClosetAddSheet
        open={page.addSheet.open}
        title={page.t("closet.add")}
        uploadHint={page.t("closet.uploadHint")}
        sampleLabel={page.t("closet.useSample")}
        stylistLabel={page.t("stylist.title")}
        busy={page.busy}
        onClose={page.addSheet.onClose}
        onUpload={page.onUpload}
        onSample={page.seedSamples}
        onOpenStylist={page.chat.onOpen}
      />

      <StylistChatSheet open={page.chat.open} onClose={page.chat.onClose} />
    </AppShell>
  );
}
