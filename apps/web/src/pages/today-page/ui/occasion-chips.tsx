import type { OccasionChipsProps } from "@/pages/today-page/ui/occasion-chips.types.js";
import { localeLabel } from "@/shared/lib";
import { Chip, CHIP_SCROLL_ROW_CLASS } from "@/shared/ui";

export function OccasionChips({
  occasions,
  selectedOccasion,
  language,
  onSelect,
}: OccasionChipsProps) {
  return (
    <div className={CHIP_SCROLL_ROW_CLASS}>
      {occasions.map((occasion) => (
        <Chip
          key={occasion.id}
          selected={(selectedOccasion ?? "everyday") === occasion.slug}
          onClick={() => onSelect(occasion.slug)}
        >
          {localeLabel(language, occasion.name, occasion.nameFa)}
        </Chip>
      ))}
    </div>
  );
}
