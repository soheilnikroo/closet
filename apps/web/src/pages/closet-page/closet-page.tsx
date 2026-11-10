import { motion } from "motion/react";

import { useClosetPage } from "@/pages/closet-page/model/use-closet-page.js";
import { ClosetAddSheet } from "@/pages/closet-page/ui/closet-add-sheet.js";
import { ClosetGrid } from "@/pages/closet-page/ui/closet-grid.js";
import { ClosetItemSheet } from "@/pages/closet-page/ui/closet-item-sheet.js";
import { ClosetReviewSheet } from "@/pages/closet-page/ui/closet-review-sheet.js";
import { SlotFilters } from "@/pages/closet-page/ui/slot-filters.js";
import { fadeUp, Match } from "@/shared/lib";
import { Button, Card, EmptyState, Fab, FAB_ABOVE_NAV_CLASS } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

export function ClosetPage() {
  const page = useClosetPage();

  return (
    <AppShell title={page.t("closet.title")}>
      <motion.div className="space-y-4" {...fadeUp}>
        <p className="text-sm text-on-surface-variant">
          {page.itemCount === 1
            ? page.t("closet.countOne", { count: page.itemCount })
            : page.t("closet.count", { count: page.itemCount })}
        </p>

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
            filteredEmpty: (
              <Card>
                <p className="text-sm text-on-surface-variant">{page.t("closet.filteredEmpty")}</p>
              </Card>
            ),
            grid: (
              <ClosetGrid
                items={page.filtered}
                slotLabel={(slot) => page.t(`closet.slots.${slot}`)}
                onOpen={page.openItem}
              />
            ),
          }}
        />

        {page.viewMode === "empty" ? null : (
          <Fab
            label={page.t("closet.add")}
            className={FAB_ABOVE_NAV_CLASS}
            onClick={page.addSheet.onOpen}
          >
            +
          </Fab>
        )}
      </motion.div>

      <ClosetAddSheet
        open={page.addSheet.open}
        busy={page.busy}
        error={page.error}
        language={page.language}
        categories={page.categories}
        presetCategory={page.presetCategory}
        openManual={page.openManual}
        title={page.t("closet.add")}
        how={page.t("closet.how")}
        manualLabel={page.t("closet.manual")}
        manualHint={page.t("closet.manualHint")}
        photoLabel={page.t("closet.photo")}
        photoHint={page.t("closet.photoHint")}
        uploadHint={page.t("closet.uploadHint")}
        sampleLabel={page.t("closet.useSample")}
        sampleHint={page.t("closet.sampleHint")}
        typeQuestion={page.t("closet.typeQuestion")}
        colorQuestion={page.t("closet.colorQuestion")}
        nameQuestion={page.t("closet.nameQuestion")}
        seasonQuestion={page.t("closet.seasonQuestion")}
        labelQuestion={page.t("closet.labelQuestion")}
        labelHint={page.t("closet.labelHint")}
        labelPlaceholder={page.t("closet.labelPlaceholder")}
        addLabel={page.t("closet.addLabel")}
        nextLabel={page.t("closet.next")}
        nameLabel={page.t("closet.name")}
        saveLabel={page.t("closet.confirm")}
        backLabel={page.t("closet.back")}
        stepLabel={(step) => page.t("closet.step", { step, total: 4 })}
        colorLabel={(color) => page.t(`closet.colors.${color}`)}
        seasonLabel={(season) => page.t(`closet.seasons.${season}`)}
        slotLabel={(slot) => page.t(`closet.slots.${slot}`)}
        onClose={() => {
          page.clearPreset();
          page.addSheet.onClose();
        }}
        onUpload={page.onUpload}
        onSample={page.seedSamples}
        onCreate={page.createManual}
      />

      <ClosetReviewSheet
        open={page.review !== null}
        title={page.t("closet.reviewTitle")}
        hint={page.t("closet.reviewHint")}
        confirmLabel={page.t("closet.confirm")}
        busy={page.busy}
        garments={page.review?.garments ?? []}
        onClose={page.closeReview}
        onToggle={page.toggleReviewGarment}
        onConfirm={page.confirmReview}
      />

      <ClosetItemSheet
        item={page.selected}
        title={page.t("closet.detailTitle")}
        nameLabel={page.t("closet.name")}
        saveLabel={page.t("closet.save")}
        deleteLabel={page.t("closet.delete")}
        slotLabel={page.selected ? page.t(`closet.slots.${page.selected.slot}`) : ""}
        seasonLine={
          page.selected
            ? page.selected.seasons.map((season) => page.t(`closet.seasons.${season}`)).join(" · ")
            : ""
        }
        labelLine={page.selected?.labels?.join(" · ") ?? ""}
        busy={page.busy}
        onClose={page.closeItem}
        onSave={page.saveSelected}
        onDelete={page.removeSelected}
      />
    </AppShell>
  );
}
