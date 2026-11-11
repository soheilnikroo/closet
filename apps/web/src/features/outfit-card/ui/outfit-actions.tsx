import type { OutfitActionsProps } from "@/features/outfit-card/ui/outfit-actions.types.js";
import { Button } from "@/shared/ui";

export function OutfitActions({
  busy,
  likeLabel,
  dislikeLabel,
  saveLabel,
  regenerateLabel,
  onLike,
  onDislike,
  onSave,
  onRegenerate,
}: OutfitActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Button size="sm" variant="filled" disabled={busy} onClick={onSave}>
        {saveLabel}
      </Button>
      <Button size="sm" variant="tonal" disabled={busy} onClick={onLike}>
        {likeLabel}
      </Button>
      <Button size="sm" variant="text" disabled={busy} onClick={onDislike}>
        {dislikeLabel}
      </Button>

      <Button size="sm" variant="text" disabled={busy} onClick={onRegenerate}>
        {regenerateLabel}
      </Button>
    </div>
  );
}
