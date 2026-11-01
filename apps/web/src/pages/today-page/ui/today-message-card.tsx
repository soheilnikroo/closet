import type { TodayMessageCardProps } from "@/pages/today-page/ui/today-message-card.types.js";
import { Button, Card } from "@/shared/ui";

export function TodayMessageCard({
  message,
  regenerateLabel,
  onRegenerate,
}: TodayMessageCardProps) {
  return (
    <Card elevated className="space-y-3">
      <p className="text-sm leading-relaxed text-on-surface-variant">{message}</p>
      <Button fullWidth onClick={onRegenerate}>
        {regenerateLabel}
      </Button>
    </Card>
  );
}
