import type { ClothingItem, StyleProfile, WeatherSnapshot } from "@closet/shared";
import { describe, expect, it } from "vitest";

import { outfitSignature, scoreOutfit } from "./score.js";

function item(
  partial: Pick<ClothingItem, "id" | "slot" | "name" | "primaryColor"> & Partial<ClothingItem>,
): ClothingItem {
  return {
    wardrobeId: "00000000-0000-4000-8000-000000000099",
    categoryId: "00000000-0000-4000-8000-000000000098",
    categorySlug: partial.slot,
    colors: [partial.primaryColor],
    pattern: "solid",
    styleTags: ["casual"],
    seasons: ["all_season"],
    material: "cotton",
    formality: "casual",
    fit: "regular",
    cut: null,
    length: null,
    warmthLevel: 2,
    size: null,
    brand: null,
    sourceType: "manual",
    status: "active",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastWornAt: null,
    ...partial,
  };
}

const styleProfile: StyleProfile = {
  userId: "00000000-0000-4000-8000-000000000001",
  preferredStyles: ["casual"],
  preferredFits: ["regular"],
  dislikedFits: ["oversized"],
  preferredColors: ["white"],
  dislikedColors: ["neon"],
  comfortPriority: true,
  lifestylePreferences: [],
  updatedAt: new Date().toISOString(),
};

const weather = (feelsLike: number, rain = 0): WeatherSnapshot => ({
  id: "00000000-0000-4000-8000-000000000050",
  cityId: "00000000-0000-4000-8000-000000000051",
  cityName: "Tehran",
  temperature: feelsLike,
  feelsLike,
  minTemperature: feelsLike - 2,
  maxTemperature: feelsLike + 2,
  precipitationProbability: rain,
  windSpeed: 5,
  humidity: 40,
  condition: "clear",
  forecastAt: new Date().toISOString(),
  fetchedAt: new Date().toISOString(),
});

describe("scoreOutfit", () => {
  const top = item({
    id: "00000000-0000-4000-8000-000000000011",
    slot: "top",
    name: "Tee",
    primaryColor: "white",
  });
  const bottom = item({
    id: "00000000-0000-4000-8000-000000000012",
    slot: "bottom",
    name: "Jeans",
    primaryColor: "blue",
  });
  const shoes = item({
    id: "00000000-0000-4000-8000-000000000013",
    slot: "shoes",
    name: "Sneakers",
    primaryColor: "white",
  });

  it("scores a basic outfit", () => {
    const result = scoreOutfit({
      top,
      bottom,
      shoes,
      styleProfile,
      weather: null,
      occasionFormality: 2,
      preferredStyles: ["casual"],
      signature: "a",
      recentOutfitSignatures: new Set(),
      dislikedItemIds: new Set(),
    });

    expect(result.score).toBeGreaterThan(0.4);
    expect(result.breakdown.style).toBeGreaterThan(0.5);
  });

  it("penalizes disliked colors", () => {
    const neonTop = item({
      id: "00000000-0000-4000-8000-000000000014",
      slot: "top",
      name: "Neon",
      primaryColor: "neon",
    });
    const result = scoreOutfit({
      top: neonTop,
      bottom,
      shoes,
      styleProfile,
      weather: null,
      occasionFormality: 2,
      preferredStyles: [],
      signature: "b",
      recentOutfitSignatures: new Set(),
      dislikedItemIds: new Set(),
    });

    expect(result.breakdown.color).toBeLessThan(0.2);
  });

  it("prefers outerwear in cold weather", () => {
    const outerwear = item({
      id: "00000000-0000-4000-8000-000000000015",
      slot: "outerwear",
      name: "Coat",
      primaryColor: "black",
      warmthLevel: 4,
    });
    const withOuter = scoreOutfit({
      top,
      bottom,
      shoes,
      outerwear,
      styleProfile,
      weather: weather(5),
      occasionFormality: 2,
      preferredStyles: [],
      signature: "c",
      recentOutfitSignatures: new Set(),
      dislikedItemIds: new Set(),
    });
    const withoutOuter = scoreOutfit({
      top,
      bottom,
      shoes,
      styleProfile,
      weather: weather(5),
      occasionFormality: 2,
      preferredStyles: [],
      signature: "d",
      recentOutfitSignatures: new Set(),
      dislikedItemIds: new Set(),
    });

    expect(withOuter.breakdown.weather ?? 0).toBeGreaterThan(withoutOuter.breakdown.weather ?? 0);
  });

  it("penalizes heavy layers in hot weather", () => {
    const heavy = item({
      id: "00000000-0000-4000-8000-000000000016",
      slot: "outerwear",
      name: "Coat",
      primaryColor: "black",
      warmthLevel: 5,
    });
    const result = scoreOutfit({
      top,
      bottom,
      shoes,
      outerwear: heavy,
      styleProfile,
      weather: weather(32),
      occasionFormality: 2,
      preferredStyles: [],
      signature: "e",
      recentOutfitSignatures: new Set(),
      dislikedItemIds: new Set(),
    });

    expect(result.breakdown.weather).toBeLessThan(0.5);
  });

  it("reduces score for recently repeated outfits and disliked items", () => {
    const signature = outfitSignature([top.id, bottom.id, shoes.id]);
    const result = scoreOutfit({
      top,
      bottom,
      shoes,
      styleProfile,
      weather: weather(20, 60),
      occasionFormality: 2,
      preferredStyles: ["formal"],
      signature,
      recentOutfitSignatures: new Set([signature]),
      dislikedItemIds: new Set([top.id]),
    });

    expect(result.breakdown.variety).toBe(0.2);
    expect(result.breakdown.feedback).toBe(0.15);
  });

  it("applies fit preferences", () => {
    const oversized = item({
      id: "00000000-0000-4000-8000-000000000017",
      slot: "top",
      name: "Baggy",
      primaryColor: "white",
      fit: "oversized",
    });
    const result = scoreOutfit({
      top: oversized,
      bottom,
      shoes,
      styleProfile,
      weather: null,
      occasionFormality: 2,
      preferredStyles: [],
      signature: "f",
      recentOutfitSignatures: new Set(),
      dislikedItemIds: new Set(),
    });

    expect(result.breakdown.fit).toBeLessThan(0.8);
  });
});

describe("outfitSignature", () => {
  it("sorts ids", () => {
    expect(outfitSignature(["b", "a"])).toBe("a|b");
  });
});
