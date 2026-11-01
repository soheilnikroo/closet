import type { Occasion } from "@closet/shared";

export type OccasionChipsProps = {
  occasions: Occasion[];
  selectedOccasion: string | null;
  language: string;
  onSelect: (slug: string) => void;
};
