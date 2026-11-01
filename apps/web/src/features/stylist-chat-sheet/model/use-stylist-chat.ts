import type { Recommendation } from "@closet/shared";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { toChatLocale } from "@/features/stylist-chat-sheet/stylist-chat-sheet.utils.js";
import { useApiClient } from "@/shared/hooks/use-api-client.js";

export function useStylistChat() {
  const { t, i18n } = useTranslation();
  const api = useApiClient();
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSend = message.trim().length > 0 && !isPending;

  function send() {
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        const result = await api.chat({
          message: trimmed,
          locale: toChatLocale(i18n.language),
        });
        setReply(result.reply);
        setRecommendations(result.recommendations);
        setMessage("");
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }

  return {
    message,
    setMessage,
    reply,
    recommendations,
    error,
    busy: isPending,
    canSend,
    send,
  };
}
