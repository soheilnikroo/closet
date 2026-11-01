import type { ClothingItem } from "@closet/shared";

export type ClosetGridProps = {
  items: ClothingItem[];
  busy: boolean;
  deleteLabel: string;
  onRemove: (id: string) => void;
};
