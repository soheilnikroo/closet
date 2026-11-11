import { collectionInputSchema, type CollectionInput } from "@closet/shared";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, TextField } from "@/shared/ui";

export function CollectionForm({
  initial,
  busy,
  submitLabel,
  onSubmit,
}: {
  initial?: CollectionInput;
  busy: boolean;
  submitLabel: string;
  onSubmit: (value: CollectionInput) => void;
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState<CollectionInput>(
    initial ?? { name: "", color: "forest", season: "any" },
  );
  const [error, setError] = useState("");
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        const result = collectionInputSchema.safeParse(value);
        if (!result.success) {
          setError(t("collections.nameRequired"));
          return;
        }
        setError("");
        onSubmit(result.data);
      }}
    >
      <TextField
        label={t("collections.name")}
        autoComplete="off"
        maxLength={80}
        required
        value={value.name}
        onChange={(event) => setValue({ ...value, name: event.target.value })}
        errorText={error || undefined}
      />
      <p className="md-body-medium text-on-surface-variant">{t("collections.onlyName")}</p>
      <details className="rounded-xl bg-surface-container-low px-4">
        <summary className="md-state-layer md-label-large min-h-12 cursor-pointer py-3 text-primary">
          {t("collections.customize")}
        </summary>
        <div className="space-y-4 pb-4">
          <label className="md-body-medium block text-on-surface-variant">
            {t("collections.description")}
            <textarea
              className="mt-2 min-h-24 w-full rounded-md border border-outline bg-surface p-3 text-on-surface"
              maxLength={500}
              value={value.description ?? ""}
              onChange={(event) => setValue({ ...value, description: event.target.value })}
            />
          </label>
          <TextField
            label={t("collections.occasion")}
            maxLength={80}
            value={value.occasion ?? ""}
            onChange={(event) => setValue({ ...value, occasion: event.target.value })}
          />
          <label className="md-body-medium block">
            {t("collections.season")}
            <select
              className="mt-2 min-h-12 w-full rounded-md border border-outline bg-surface px-3"
              value={value.season ?? "any"}
              onChange={(event) =>
                setValue({
                  ...value,
                  season: collectionInputSchema.shape.season.parse(event.target.value),
                })
              }
            >
              {["any", "spring", "summer", "autumn", "winter"].map((season) => (
                <option key={season} value={season}>
                  {t(`collections.seasons.${season}`)}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="md-body-medium mb-2">{t("collections.color")}</legend>
            <div className="flex flex-wrap gap-2">
              {(["forest", "sage", "sand", "sky", "rose"] as const).map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-pressed={value.color === color}
                  onClick={() => setValue({ ...value, color })}
                  className={`md-state-layer collection-${color} md-label-large min-h-12 rounded-full border px-4 ${value.color === color ? "border-primary ring-2 ring-primary" : "border-transparent"}`}
                >
                  {t(`collections.colors.${color}`)}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </details>
      <Button fullWidth size="lg" type="submit" disabled={busy || !value.name.trim()}>
        {busy ? t("experience.loading") : submitLabel}
      </Button>
    </form>
  );
}
