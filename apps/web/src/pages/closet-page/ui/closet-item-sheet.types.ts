import type { ClothingItem, UpdateClothingItemRequest } from "@closet/shared";

export type ClosetItemSheetProps = {
  item: ClothingItem | null;
  title: string;
  nameLabel: string;
  saveLabel: string;
  deleteLabel: string;
  slotLabel: string;
  seasonLine: string;
  labelLine: string;
  busy: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (name: string, details?: UpdateClothingItemRequest) => void;
  onDelete: () => void;
};
