import {
  fitPreferenceSchema,
  formalitySchema,
  type UpdateClothingItemRequest,
} from "@closet/shared";
import { useTranslation } from "react-i18next";

import { TextField } from "@/shared/ui";

type Details = Pick<
  UpdateClothingItemRequest,
  "fit" | "formality" | "warmthLevel" | "material" | "brand" | "size"
>;
export function ClothingDetails({
  value,
  onChange,
}: {
  value: Details;
  onChange: (value: Details) => void;
}) {
  const { t } = useTranslation();
  const selectClass =
    "mt-2 min-h-12 w-full rounded-2xl border border-outline-variant bg-surface px-3 text-base";
  return (
    <details className="rounded-2xl bg-surface-container p-3">
      <summary className="md-state-layer min-h-12 cursor-pointer py-3 text-sm font-semibold text-primary">
        {t("experience.moreDetails")}
      </summary>
      <div className="space-y-4 pt-3">
        <p className="text-sm text-on-surface-variant">{t("experience.detailsHint")}</p>
        <label className="block text-sm">
          {t("experience.fit")}
          <select
            className={selectClass}
            value={value.fit ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                fit: e.target.value ? fitPreferenceSchema.parse(e.target.value) : null,
              })
            }
          >
            <option value="">{t("experience.unspecified")}</option>
            {fitPreferenceSchema.options.map((fit) => (
              <option key={fit} value={fit}>
                {t(`experience.${fit}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          {t("experience.formality")}
          <select
            className={selectClass}
            value={value.formality ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                formality: e.target.value ? formalitySchema.parse(e.target.value) : null,
              })
            }
          >
            <option value="">{t("experience.unspecified")}</option>
            {formalitySchema.options.map((level) => (
              <option key={level} value={level}>
                {t(`experience.${level}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          {t("experience.warmth")}
          <select
            className={selectClass}
            value={value.warmthLevel ?? ""}
            onChange={(e) =>
              onChange({ ...value, warmthLevel: e.target.value ? Number(e.target.value) : null })
            }
          >
            <option value="">{t("experience.unspecified")}</option>
            <option value="1">{t("experience.light")}</option>
            <option value="3">{t("experience.medium")}</option>
            <option value="5">{t("experience.warm")}</option>
          </select>
        </label>
        <TextField
          label={t("experience.material")}
          value={value.material ?? ""}
          onChange={(e) => onChange({ ...value, material: e.target.value || null })}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label={t("experience.brand")}
            value={value.brand ?? ""}
            onChange={(e) => onChange({ ...value, brand: e.target.value || null })}
          />
          <TextField
            label={t("experience.size")}
            value={value.size ?? ""}
            onChange={(e) => onChange({ ...value, size: e.target.value || null })}
          />
        </div>
      </div>
    </details>
  );
}
