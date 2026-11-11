import { useEffect, useState } from "react";

import type { ClosetAddSheetProps } from "@/pages/closet-page/ui/closet-add-sheet.types.js";
import { ClosetManualWizard } from "@/pages/closet-page/ui/closet-manual-wizard.js";
import { BottomSheet } from "@/shared/ui";

type AddStep = "method" | "photo" | "manual";

export function ClosetAddSheet({
  open,
  busy,
  error,
  language,
  categories,
  presetCategory,
  openManual,
  title,
  how,
  manualLabel,
  manualHint,
  photoLabel,
  photoHint,
  uploadHint,
  sampleLabel,
  sampleHint,
  typeQuestion,
  colorQuestion,
  nameQuestion,
  seasonQuestion,
  labelQuestion,
  labelHint,
  labelPlaceholder,
  addLabel,
  nextLabel,
  nameLabel,
  seasonLabel,
  saveLabel,
  backLabel,
  stepLabel,
  colorLabel,
  slotLabel,
  onClose,
  onUpload,
  onSample,
  onCreate,
}: ClosetAddSheetProps) {
  const [step, setStep] = useState<AddStep>("method");

  useEffect(() => {
    if (!open) {
      setStep("method");
      return;
    }
    if (openManual) {
      setStep("manual");
    }
  }, [open, openManual]);

  return (
    <BottomSheet open={open} title={title} onClose={onClose}>
      {error ? <p className="mb-3 text-sm text-error">{error}</p> : null}
      {step === "method" ? (
        <div className="space-y-3">
          <h3 className="font-display text-xl font-semibold text-on-surface">{how}</h3>
          <button
            type="button"
            className="md-state-layer flex min-h-14 w-full flex-col items-start justify-center rounded-2xl bg-primary px-4 py-3 text-start text-on-primary"
            onClick={() => setStep("manual")}
          >
            <span className="text-sm font-semibold">{manualLabel}</span>
            <span className="text-xs opacity-80">{manualHint}</span>
          </button>
          <button
            type="button"
            className="md-state-layer flex min-h-14 w-full flex-col items-start justify-center rounded-2xl border border-outline-variant/60 bg-surface px-4 py-3 text-start"
            onClick={() => setStep("photo")}
          >
            <span className="text-sm font-semibold text-on-surface">{photoLabel}</span>
            <span className="text-xs text-on-surface-variant">{photoHint}</span>
          </button>
          <button
            type="button"
            className="md-state-layer flex min-h-14 w-full flex-col items-start justify-center rounded-2xl border border-outline-variant/60 bg-surface px-4 py-3 text-start"
            disabled={busy}
            onClick={onSample}
          >
            <span className="text-sm font-semibold text-on-surface">{sampleLabel}</span>
            <span className="text-xs text-on-surface-variant">{sampleHint}</span>
          </button>
        </div>
      ) : null}

      {step === "photo" ? (
        <div className="space-y-4">
          <button
            type="button"
            className="md-state-layer min-h-12 text-sm font-medium text-primary"
            onClick={() => setStep("method")}
          >
            {backLabel}
          </button>
          <label className="block rounded-2xl border border-dashed border-outline-variant/80 bg-surface-container-low px-4 py-6 text-center text-sm">
            <span className="font-medium text-on-surface-variant">{uploadHint}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="mt-3 block w-full text-base"
              onChange={(event) => onUpload(event.target.files)}
            />
          </label>
        </div>
      ) : null}

      {step === "manual" ? (
        <ClosetManualWizard
          key={presetCategory?.id ?? "manual"}
          categories={categories}
          language={language}
          busy={busy}
          initialCategory={presetCategory}
          typeQuestion={typeQuestion}
          colorQuestion={colorQuestion}
          seasonQuestion={seasonQuestion}
          nameQuestion={nameQuestion}
          labelQuestion={labelQuestion}
          labelHint={labelHint}
          labelPlaceholder={labelPlaceholder}
          addLabel={addLabel}
          nextLabel={nextLabel}
          nameLabel={nameLabel}
          seasonLabel={seasonLabel}
          saveLabel={saveLabel}
          backLabel={backLabel}
          stepLabel={stepLabel}
          colorLabel={colorLabel}
          slotLabel={slotLabel}
          onBack={() => setStep("method")}
          onCreate={onCreate}
        />
      ) : null}
    </BottomSheet>
  );
}
