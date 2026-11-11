import { InteractiveOutfitCard } from "@/features/outfit-card/interactive-outfit-card.js";
import type { ChatRecommendationsProps } from "@/features/stylist-chat-sheet/ui/chat-recommendations.types.js";

export function ChatRecommendations({ recommendations }: ChatRecommendationsProps) {
  return (
    <div className="space-y-4 empty:hidden">
      {recommendations.map((rec) => (
        <InteractiveOutfitCard key={rec.id} recommendation={rec} swipeable={false} />
      ))}
    </div>
  );
}
