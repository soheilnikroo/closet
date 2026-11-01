import type { Recommendation } from "@closet/shared";

export type OutfitListProps = {
  primary: Recommendation;
  alternatives: Recommendation[];
  busy: boolean;
  onFeedback: (rec: Recommendation, action: "like" | "dislike" | "save") => void;
  onRegenerate: () => void;
  alternativesTitle: string;
};
