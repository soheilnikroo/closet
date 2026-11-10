import type { ClothingCategory } from "@closet/shared";

import type { ClosetSlot } from "@/pages/closet-page/closet-page.types.js";
import type { ManualClothingDraft } from "@/pages/closet-page/ui/closet-add-sheet.types.js";

export type ClosetManualWizardProps = {
  categories: ClothingCategory[];
  language: string;
  busy: boolean;
  typeQuestion: string;
  colorQuestion: string;
  initialCategory: ClothingCategory | null;
  nameQuestion: string;
  seasonQuestion: string;
  labelQuestion: string;
  labelHint: string;
  labelPlaceholder: string;
  addLabel: string;
  nextLabel: string;
  nameLabel: string;
  seasonLabel: (season: string) => string;
  saveLabel: string;
  backLabel: string;
  stepLabel: (step: number) => string;
  colorLabel: (color: string) => string;
  slotLabel: (slot: ClosetSlot) => string;
  onBack: () => void;
  onCreate: (draft: ManualClothingDraft) => void;
};
