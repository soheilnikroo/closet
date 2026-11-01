import type { ClothingItem } from "@closet/shared";

import { outfitSignature, scoreOutfit } from "@/modules/styling/outfit-generator/score.js";
import type { GeneratorInput, OutfitCandidate } from "@/modules/styling/outfit-generator/types.js";

function bySlot(items: ClothingItem[], slot: ClothingItem["slot"]): ClothingItem[] {
  return items.filter((item) => item.slot === slot && item.status === "active");
}

export function generateOutfitCandidates(input: GeneratorInput): OutfitCandidate[] {
  const available = input.items.filter((item) => !input.excludeItemIds.has(item.id));
  const tops = bySlot(available, "top");
  const bottoms = bySlot(available, "bottom");
  const shoes = bySlot(available, "shoes");
  const outerwear = bySlot(available, "outerwear");
  const accessories = bySlot(available, "accessory");

  if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
    return [];
  }

  const needsOuterwear = Boolean(input.weather && input.weather.feelsLike <= 14);
  const candidates: OutfitCandidate[] = [];

  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        const outerOptions: Array<ClothingItem | undefined> = needsOuterwear
          ? outerwear.length > 0
            ? outerwear
            : [undefined]
          : [undefined, ...outerwear.slice(0, 2)];

        for (const outer of outerOptions) {
          if (needsOuterwear && !outer) {
            continue;
          }

          const accessoryOptions: Array<ClothingItem | undefined> = [
            undefined,
            ...accessories.slice(0, 2),
          ];

          for (const accessory of accessoryOptions) {
            const ids = [top.id, bottom.id, shoe.id, outer?.id, accessory?.id].filter(
              (id): id is string => Boolean(id),
            );
            const signature = outfitSignature(ids);
            candidates.push(
              scoreOutfit({
                top,
                bottom,
                shoes: shoe,
                outerwear: outer,
                accessory,
                styleProfile: input.styleProfile,
                weather: input.weather,
                occasionFormality: input.occasionFormality,
                preferredStyles: input.preferredStyles,
                signature,
                recentOutfitSignatures: input.recentOutfitSignatures,
                dislikedItemIds: input.dislikedItemIds,
              }),
            );
          }
        }
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  const unique: OutfitCandidate[] = [];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    const key = outfitSignature(
      [
        candidate.top.id,
        candidate.bottom.id,
        candidate.shoes.id,
        candidate.outerwear?.id,
        candidate.accessory?.id,
      ].filter((id): id is string => Boolean(id)),
    );
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(candidate);
    if (unique.length >= 12) {
      break;
    }
  }

  return unique;
}
