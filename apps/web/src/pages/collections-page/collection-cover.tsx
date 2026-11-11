import { collectionDetailSchema, type OutfitCollection, type OutfitItem } from "@closet/shared";
import { useEffect, useState } from "react";

import { useApiClient } from "@/shared/hooks";
import { GarmentArt } from "@/shared/ui/garment-art.js";

export function CollectionCover({ collection }: { collection: OutfitCollection }) {
  const api = useApiClient();
  const [pieces, setPieces] = useState<OutfitItem[]>(
    () =>
      api
        .cached(`/v1/collections/${collection.id}`, (data) => collectionDetailSchema.parse(data))
        ?.outfits[0]?.outfit.items.slice(0, 3) ?? [],
  );
  useEffect(() => {
    if (!collection.count) {
      return undefined;
    }
    let active = true;
    void api
      .getCollection(collection.id)
      .then((result) => {
        if (active) {
          setPieces(result.outfits[0]?.outfit.items.slice(0, 3) ?? []);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [api, collection.id, collection.count]);
  return (
    <span aria-hidden="true" className={`collection-cover collection-${collection.color}`}>
      {pieces.length ? (
        pieces.map((piece) => (
          <GarmentArt
            key={piece.clothingItemId}
            slot={piece.role}
            color={piece.item?.primaryColor}
            imageUrl={piece.item?.imageUrl}
            className="garment-drawing"
          />
        ))
      ) : (
        <span className="font-display text-4xl opacity-50">{collection.name.slice(0, 1)}</span>
      )}
    </span>
  );
}
