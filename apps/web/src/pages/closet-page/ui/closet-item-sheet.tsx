import type { UpdateClothingItemRequest } from "@closet/shared";
import { useEffect, useState } from "react";

import type { ClosetItemSheetProps } from "@/pages/closet-page/ui/closet-item-sheet.types.js";
import { ClothingDetails } from "@/pages/closet-page/ui/clothing-details.js";
import { BottomSheet, Button, TextField } from "@/shared/ui";
import { GarmentArt } from "@/shared/ui/garment-art.js";

export function ClosetItemSheet({
  item,
  title,
  nameLabel,
  saveLabel,
  deleteLabel,
  slotLabel,
  seasonLine,
  labelLine,
  busy,
  error,
  onClose,
  onSave,
  onDelete,
}: ClosetItemSheetProps) {
  const [details, setDetails] = useState<UpdateClothingItemRequest>({});
  const [name, setName] = useState(item?.name ?? "");

  useEffect(() => {
    setName(item?.name ?? "");
    setDetails({
      fit: item?.fit,
      formality: item?.formality,
      warmthLevel: item?.warmthLevel,
      material: item?.material,
      brand: item?.brand,
      size: item?.size,
    });
  }, [item]);

  if (!item) {
    return null;
  }

  return (
    <BottomSheet open title={title} onClose={onClose}>
      <div className="space-y-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-container">
          <GarmentArt
            slot={item.slot}
            color={item.primaryColor}
            imageUrl={item.imageUrl}
            className="max-h-56"
          />
        </div>
        <p className="text-xs font-medium tracking-wide text-on-surface-variant uppercase">
          {slotLabel} · {item.primaryColor}
        </p>
        {seasonLine ? <p className="text-sm text-on-surface">{seasonLine}</p> : null}
        {labelLine ? <p className="text-sm text-on-surface-variant">{labelLine}</p> : null}
        <TextField
          label={nameLabel}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <p role="alert" className="text-sm text-error empty:hidden">
          {error}
        </p>
        <ClothingDetails value={details} onChange={setDetails} />
        <Button
          fullWidth
          size="lg"
          disabled={busy || name.trim().length === 0}
          onClick={() => onSave(name.trim(), details)}
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
