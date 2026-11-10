import { useEffect, useState } from "react";

import { clothingColor } from "@/pages/closet-page/closet-page.utils.js";
import type { ClosetItemSheetProps } from "@/pages/closet-page/ui/closet-item-sheet.types.js";
import { BottomSheet, Button, TextField } from "@/shared/ui";

export function ClosetItemSheet({
  item,
  title,
  nameLabel,
  saveLabel,
  deleteLabel,
  slotLabel,
  busy,
  onClose,
  onSave,
  onDelete,
}: ClosetItemSheetProps) {
  const [name, setName] = useState(item?.name ?? "");

  useEffect(() => {
    setName(item?.name ?? "");
  }, [item]);

  if (!item) {
    return null;
  }

  return (
    <BottomSheet open title={title} onClose={onClose}>
      <div className="space-y-4">
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-2xl"
          style={{ backgroundColor: clothingColor(item.primaryColor) }}
        >
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
          ) : null}
        </div>
        <p className="text-xs font-medium tracking-wide text-on-surface-variant uppercase">
          {slotLabel} · {item.primaryColor}
        </p>
        <TextField
          label={nameLabel}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button
          fullWidth
          size="lg"
          disabled={busy || name.trim().length === 0}
          onClick={() => onSave(name.trim())}
        >
          {saveLabel}
        </Button>
        <Button fullWidth size="lg" variant="text" disabled={busy} onClick={onDelete}>
          {deleteLabel}
        </Button>
      </div>
    </BottomSheet>
  );
}
