import type { ClothingItem } from "@closet/shared";

export type ClosetItemCardProps = {
  item: ClothingItem;
  slotLabel: string;
  onOpen: () => void;
};
