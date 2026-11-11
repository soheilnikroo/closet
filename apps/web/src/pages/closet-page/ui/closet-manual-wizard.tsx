import type { UpdateClothingItemRequest } from "@closet/shared";
import type { ClothingCategory, Season } from "@closet/shared";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  CLOSET_SLOTS,
  MANUAL_COLORS,
  MANUAL_SEASONS,
} from "@/pages/closet-page/closet-page.constants.js";
import { clothingColor } from "@/pages/closet-page/closet-page.utils.js";
import type { ClosetManualWizardProps } from "@/pages/closet-page/ui/closet-manual-wizard.types.js";
import { ClothingDetails } from "@/pages/closet-page/ui/clothing-details.js";
import { Button, TextField } from "@/shared/ui";

type ManualStep = "type" | "details";

function categoryName(category: ClothingCategory, language: string) {
  return language.toLowerCase().startsWith("fa") ? category.nameFa : category.name;
}

export function ClosetManualWizard({
  categories,
  language,
  busy,
  initialCategory,
  typeQuestion,
  colorQuestion,
  seasonQuestion,
  labelQuestion,
  labelHint,
  labelPlaceholder,
  addLabel,
  nameLabel,
  saveLabel,
  backLabel,
  stepLabel,
  colorLabel,
  seasonLabel,
  slotLabel,
  onBack,
  onCreate,
}: ClosetManualWizardProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<ManualStep>(initialCategory ? "details" : "type");
  const [category, setCategory] = useState<ClothingCategory | null>(initialCategory);
  const [color, setColor] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<Season[]>(["all_season"]);
  const [name, setName] = useState(initialCategory ? categoryName(initialCategory, language) : "");
  const [details, setDetails] = useState<UpdateClothingItemRequest>({});
  const [labelDraft, setLabelDraft] = useState("");
  const [labels, setLabels] = useState<string[]>([]);

  function chooseCategory(next: ClothingCategory) {
    setCategory(next);
    setName(categoryName(next, language));
    setStep("details");
  }

  function toggleSeason(next: Season) {
    setSeasons((current) => {
      if (next === "all_season") {
        return current.includes("all_season") ? [] : ["all_season"];
      }
      const withoutAll = current.filter((season) => season !== "all_season");
      return withoutAll.includes(next)
        ? withoutAll.filter((season) => season !== next)
        : [...withoutAll, next];
    });
  }

  function addCustomLabel() {
    const next = labelDraft.trim();
    if (next.length === 0 || labels.length >= 6) {
      return;
    }
    if (labels.some((label) => label.toLowerCase() === next.toLowerCase())) {
      setLabelDraft("");
      return;
    }
    setLabels((current) => [...current, next]);
    setLabelDraft("");
  }

  const stepIndex = step === "type" ? 1 : 2;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="md-state-layer min-h-12 text-sm font-medium text-primary"
          onClick={() => {
            if (step === "type") {
              onBack();
              return;
            }
            setStep("type");
          }}
        >
          {backLabel}
        </button>
        <p className="text-xs text-on-surface-variant">{stepLabel(stepIndex)}</p>
      </div>

      {step === "type" ? (
        <div className="space-y-4">
          <h3 className="font-display text-xl font-semibold text-on-surface">{typeQuestion}</h3>
          {CLOSET_SLOTS.map((slot) => {
            const group = categories.filter((item) => item.slot === slot);
            if (group.length === 0) {
              return null;
            }
            return (
              <section key={slot} className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-on-surface-variant uppercase">
                  {slotLabel(slot)}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {group.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="md-state-layer min-h-12 rounded-2xl border border-outline-variant/50 bg-surface px-3 py-2 text-start text-sm font-medium text-on-surface"
                      onClick={() => chooseCategory(item)}
                    >
                      {categoryName(item, language)}
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : null}

      {step === "details" && category ? (
        <div className="space-y-4">
          <TextField
            label={nameLabel}
            value={name}
            className="text-base"
            onChange={(event) => setName(event.target.value)}
          />
          <h3 className="font-display text-xl font-semibold text-on-surface">{colorQuestion}</h3>
          <div className="grid grid-cols-3 gap-2">
            {MANUAL_COLORS.map((swatch) => (
              <button
                key={swatch}
                aria-pressed={color === swatch}
                type="button"
                className="md-state-layer flex min-h-12 items-center gap-3 rounded-2xl border border-outline-variant/50 bg-surface px-3 text-start text-xs font-medium text-on-surface aria-pressed:border-primary aria-pressed:bg-secondary-container"
                onClick={() => {
                  setColor(swatch);
                }}
              >
                <span
                  className="size-6 shrink-0 rounded-full border border-outline-variant/60"
                  style={{ backgroundColor: clothingColor(swatch) }}
                  aria-hidden
                />
                {colorLabel(swatch)}
              </button>
            ))}
          </div>

          <details className="settings-group compact-details">
            <summary>{t("refine.optionalDetails")}</summary>
            <div className="space-y-4 pt-4">
              <h3 className="font-display text-xl font-semibold text-on-surface">
                {seasonQuestion}
              </h3>
              <div className="flex flex-wrap gap-2">
                {MANUAL_SEASONS.map((season) => {
                  const selected = seasons.includes(season);
                  return (
                    <button
                      key={season}
                      type="button"
                      aria-pressed={selected}
                      className={
                        selected
                          ? "md-state-layer min-h-12 rounded-full bg-secondary-container px-4 text-sm font-medium text-on-secondary-container"
                          : "md-state-layer min-h-12 rounded-full border border-outline-variant bg-surface px-4 text-sm font-medium text-on-surface"
                      }
                      onClick={() => toggleSeason(season)}
                    >
                      {seasonLabel(season)}
                    </button>
                  );
                })}
              </div>
              <ClothingDetails value={details} onChange={setDetails} />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-on-surface">{labelQuestion}</h4>
                <p className="text-sm text-on-surface-variant">{labelHint}</p>
                <div className="flex items-end gap-2">
                  <TextField
                    label={labelPlaceholder}
                    value={labelDraft}
                    className="text-base"
                    onChange={(event) => setLabelDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCustomLabel();
                      }
                    }}
                  />
                  <Button
                    size="lg"
                    variant="tonal"
                    disabled={labelDraft.trim().length === 0}
                    onClick={addCustomLabel}
                  >
                    {addLabel}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 empty:hidden">
                  {labels.map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="md-state-layer min-h-12 rounded-full bg-surface-container px-4 text-sm text-on-surface"
                      onClick={() =>
                        setLabels((current) => current.filter((item) => item !== label))
                      }
                    >
                      {label} ×
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </details>
          <Button
            fullWidth
            size="lg"
            disabled={busy || !color || name.trim().length === 0}
            onClick={() => {
              if (!color) {
                return;
              }
              onCreate({
                ...details,
                categoryId: category.id,
                name: name.trim(),
                primaryColor: color,
                seasons,
                labels,
              });
            }}
          >
            {saveLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
