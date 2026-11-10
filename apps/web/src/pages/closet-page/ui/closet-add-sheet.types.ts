import type { ClothingCategory, Season } from "@closet/shared";

import type { ClosetSlot } from "@/pages/closet-page/closet-page.types.js";

export type ManualClothingDraft = {
  categoryId: string;
  name: string;
  primaryColor: string;
  seasons: Season[];
  labels: string[];
};

export type ClosetAddSheetProps = {
  open: boolean;
  busy: boolean;
  error: string | null;
  language: string;
  categories: ClothingCategory[];
  presetCategory: ClothingCategory | null;
  openManual: boolean;
  title: string;
  how: string;
  manualLabel: string;
  manualHint: string;
  photoLabel: string;
  photoHint: string;
  uploadHint: string;
  sampleLabel: string;
  sampleHint: string;
  typeQuestion: string;
  colorQuestion: string;
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
  onClose: () => void;
  onUpload: (files: FileList | null) => void;
  onSample: () => void;
  onCreate: (draft: ManualClothingDraft) => void;
};
