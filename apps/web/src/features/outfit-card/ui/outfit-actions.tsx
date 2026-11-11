import type { OutfitActionsProps } from "@/features/outfit-card/ui/outfit-actions.types.js";
import { Button } from "@/shared/ui";

export function OutfitActions({
  busy,
  dislikeLabel,
  saveLabel,
  onDislike,
  onSave,
}: OutfitActionsProps) {
  return (
    <div className="grid grid-cols-[1fr_1.35fr] gap-3">
      <Button variant="outlined" disabled={busy} onClick={onDislike}>
        {dislikeLabel}
      </Button>
      <Button variant="filled" disabled={busy} onClick={onSave}>
        {saveLabel}
      </Button>
    </div>
  );
}
