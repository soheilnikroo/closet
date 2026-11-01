import type { DetectedGarment, Recommendation, StyleTag } from "@closet/shared";

export type SharedStepProps = {
  busy: boolean;
  t: (key: string) => string;
};

export type WelcomeStepProps = SharedStepProps & {
  onContinue: () => void;
};

export type StylesStepProps = SharedStepProps & {
  styles: StyleTag[];
  onToggle: (style: StyleTag) => void;
  onContinue: () => void;
  onSkip: () => void;
};

export type CityStepProps = SharedStepProps & {
  language: string;
  cities: Array<{ id: string; name: string; nameFa: string }>;
  cityId: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
  onSkip: () => void;
};

export type ClothingStepProps = SharedStepProps & {
  onUpload: (files: FileList | null) => void;
  onSample: () => void;
};

export type ReviewStepProps = SharedStepProps & {
  detections: DetectedGarment[];
  onConfirm: () => void;
};

export type FirstOutfitStepProps = SharedStepProps & {
  recommendation: Recommendation;
  onFeedback: (action: "like" | "dislike" | "regenerate") => void;
};
