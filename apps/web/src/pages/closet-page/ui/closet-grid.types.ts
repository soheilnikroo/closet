import type { ClothingItem } from "@closet/shared";

import type { ClosetSlot } from "@/pages/closet-page/closet-page.types.js";

export type ClosetGridProps = {
  items: ClothingItem[];
  slotLabel: (slot: ClosetSlot) => string;
  onOpen: (item: ClothingItem) => void;
};
