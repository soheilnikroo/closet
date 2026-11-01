import type { ChatRecommendationsProps } from "@/features/stylist-chat-sheet/ui/chat-recommendations.types.js";

export function ChatRecommendations({ recommendations }: ChatRecommendationsProps) {
  return (
    <div className="space-y-2 empty:hidden">
      {recommendations.map((rec) => (
        <div key={rec.id} className="rounded-2xl border border-outline-variant/40 px-3 py-3">
          <p className="text-sm font-medium">{rec.outfit.name}</p>
          <p className="mt-1 text-xs text-on-surface-variant">{rec.explanation}</p>
        </div>
      ))}
    </div>
  );
}
