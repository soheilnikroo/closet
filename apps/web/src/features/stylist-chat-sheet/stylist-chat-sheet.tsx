import { useTranslation } from "react-i18next";

import { useStylistChat } from "@/features/stylist-chat-sheet/model/use-stylist-chat.js";
import type { StylistChatSheetProps } from "@/features/stylist-chat-sheet/stylist-chat-sheet.types.js";
import { BottomSheet, Button, TextField } from "@/shared/ui";

export function StylistChatSheet({ open, onClose }: StylistChatSheetProps) {
  const { t } = useTranslation();
  const chat = useStylistChat();

  return (
    <BottomSheet open={open} title={t("stylist.title")} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-on-surface-variant">{t("stylist.hint")}</p>
        <TextField
          label={t("stylist.placeholder")}
          value={chat.message}
          onChange={(event) => chat.setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              chat.send();
            }
          }}
        />
        <Button fullWidth disabled={!chat.canSend} onClick={chat.send}>
          {t("stylist.send")}
        </Button>
        <p className="text-sm text-error empty:hidden">{chat.error}</p>
        <div className="rounded-2xl bg-surface-container px-3 py-3 text-sm leading-relaxed empty:hidden">
          {chat.reply}
        </div>
        <div className="space-y-2 empty:hidden">
          {chat.recommendations.map((rec) => (
            <div key={rec.id} className="rounded-2xl border border-outline-variant/40 px-3 py-3">
              <p className="text-sm font-medium">{rec.outfit.name}</p>
              <p className="mt-1 text-xs text-on-surface-variant">{rec.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
