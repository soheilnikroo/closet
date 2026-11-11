import { motion } from "motion/react";

import { useClosetPage } from "@/pages/closet-page/model/use-closet-page.js";
import { ClosetAddSheet } from "@/pages/closet-page/ui/closet-add-sheet.js";
import { ClosetGrid } from "@/pages/closet-page/ui/closet-grid.js";
import { ClosetItemSheet } from "@/pages/closet-page/ui/closet-item-sheet.js";
import { ClosetReviewSheet } from "@/pages/closet-page/ui/closet-review-sheet.js";
import { SlotFilters } from "@/pages/closet-page/ui/slot-filters.js";
import { fadeUp, Match } from "@/shared/lib";
import { Button, Card, TextField, EmptyState } from "@/shared/ui";
import { PageSkeleton } from "@/shared/ui/skeleton.js";
import { AppShell } from "@/widgets/app-shell";

export function ClosetPage() {
  const page = useClosetPage();

  return (
    <AppShell onRefresh={page.busy ? undefined : page.reload} title={page.t("closet.title")}>
      <motion.div className="space-y-4" {...fadeUp}>
        <section className="page-intro flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{page.t("refine.wardrobeEyebrow")}</p>
            <h2>{page.t("closet.title")}</h2>
            <p className="intro-description">{page.t("closet.count", { count: page.itemCount })}</p>
          </div>
          <Button size="sm" onClick={page.addSheet.onOpen}>
            {page.t("closet.add")}
          </Button>
        </section>

        <TextField
          type="search"
          label={page.t("experience.searchCloset")}
          value={page.query}
          onChange={(event) => page.setQuery(event.target.value)}
        />

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
            loading: <PageSkeleton variant="grid" label={page.t("experience.loading")} />,
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
                <Button
                  variant="text"
                  onClick={() => {
                    page.setQuery("");
                    page.setSlotFilter(null);
                  }}
                >
                  {page.t("experience.clearFilters")}
                </Button>
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
        stepLabel={(step) => page.t("closet.step", { step, total: 2 })}
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
        error={page.error}
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
