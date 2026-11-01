import type { SlotFiltersProps } from "@/pages/closet-page/ui/slot-filters.types.js";
import { Chip, CHIP_SCROLL_ROW_CLASS } from "@/shared/ui";

export function SlotFilters({
  slots,
  slotFilter,
  allLabel,
  slotLabel,
  onSelectAll,
  onSelectSlot,
}: SlotFiltersProps) {
  return (
    <div className={CHIP_SCROLL_ROW_CLASS}>
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
