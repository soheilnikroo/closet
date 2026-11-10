import type { ClothingItem } from "@closet/shared";

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
  onClose: () => void;
  onSave: (name: string) => void;
  onDelete: () => void;
};
