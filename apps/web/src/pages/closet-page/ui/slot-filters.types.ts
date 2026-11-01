import type { ClosetSlot } from "@/pages/closet-page/closet-page.types.js";

export type SlotFiltersProps = {
  slots: readonly ClosetSlot[];
  slotFilter: ClosetSlot | null;
  allLabel: string;
  slotLabel: (slot: ClosetSlot) => string;
  onSelectAll: () => void;
  onSelectSlot: (slot: ClosetSlot) => void;
};
