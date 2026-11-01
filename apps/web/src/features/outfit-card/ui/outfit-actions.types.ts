export type OutfitActionsProps = {
  busy?: boolean;
  likeLabel: string;
  dislikeLabel: string;
  saveLabel: string;
  regenerateLabel: string;
  onLike?: () => void;
  onDislike?: () => void;
  onSave?: () => void;
  onRegenerate?: () => void;
};
