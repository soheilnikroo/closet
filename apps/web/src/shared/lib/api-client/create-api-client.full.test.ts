import { describe, expect, it, vi } from "vitest";

import { createApiClient } from "@/shared/lib/api-client/create-api-client.js";

const profile = {
  userId: "00000000-0000-4000-8000-000000000001",
  cityId: null,
  currency: "IRR",
  temperaturePreference: "celsius",
  preferredLanguage: "en-GB",
  onboardingCompleted: false,
  onboardingStep: "welcome",
  createdAt: "2026-11-01T10:00:00.000Z",
  updatedAt: "2026-11-01T10:00:00.000Z",
};

const styleProfile = {
  userId: "00000000-0000-4000-8000-000000000001",
  preferredStyles: ["casual"],
  preferredFits: [],
  dislikedFits: [],
  preferredColors: [],
  dislikedColors: [],
  comfortPriority: null,
  lifestylePreferences: [],
  updatedAt: "2026-11-01T10:00:00.000Z",
};

const clothingItem = {
  id: "00000000-0000-4000-8000-000000000032",
  wardrobeId: "00000000-0000-4000-8000-000000000033",
  categoryId: "00000000-0000-4000-8000-000000000034",
  categorySlug: "shirt",
  slot: "top",
  name: "White shirt",
  primaryColor: "white",
  colors: ["white"],
  pattern: "solid",
  styleTags: ["casual"],
  seasons: ["all_season"],
  material: null,
  formality: "casual",
  fit: "regular",
  cut: null,
  length: null,
  warmthLevel: 2,
  size: null,
  brand: null,
  sourceType: "sample_catalog",
  status: "active",
  imageUrl: null,
  createdAt: "2026-11-01T10:00:00.000Z",
  updatedAt: "2026-11-01T10:00:00.000Z",
  lastWornAt: null,
};

const recommendation = {
  id: "00000000-0000-4000-8000-000000000030",
  outfit: {
    id: "00000000-0000-4000-8000-000000000031",
    name: "Smart casual",
    description: null,
    style: "casual",
    createdAt: "2026-11-01T10:00:00.000Z",
    items: [
      {
        clothingItemId: clothingItem.id,
        role: "top",
        position: 0,
        item: clothingItem,
      },
    ],
  },
  recommendationType: "daily",
  occasionId: null,
  occasionName: null,
  score: 0.8,
  explanation: "A clean everyday combination.",
  weather: null,
  generatedAt: "2026-11-01T10:00:00.000Z",
};

function ok(json: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => json,
  };
}

describe("createApiClient full surface", () => {
  it("covers authenticated product endpoints and auth failures", async () => {
    const fetchImpl = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      if (url.includes("/users/me") && !url.includes("profile") && init?.method === "GET") {
        return ok({
          user: {
            id: profile.userId,
            clerkUserId: "clerk_1",
            email: "a@b.com",
            phone: null,
            displayName: "Ada",
            avatarUrl: null,
            locale: "en-GB",
            status: "active",
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
          },
        });
      }
      if (url.includes("/users/me") && init?.method === "PATCH" && !url.includes("profile")) {
        return ok({
          user: {
            id: profile.userId,
            clerkUserId: "clerk_1",
            email: "a@b.com",
            phone: null,
            displayName: "Ada Lovelace",
            avatarUrl: null,
            locale: "en-GB",
            status: "active",
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
          },
        });
      }
      if (url.includes("/style-profile") && init?.method === "GET") {
        return ok({ styleProfile });
      }
      if (url.includes("/style-profile")) {
        return ok({ styleProfile });
      }
      if (url.includes("/profile")) {
        return ok({ profile });
      }
      if (url.includes("/cities")) {
        return ok({
          cities: [
            {
              id: "00000000-0000-4000-8000-000000000010",
              name: "Tehran",
              nameFa: "تهران",
              province: "Tehran",
              latitude: 35.6,
              longitude: 51.4,
              timezone: "Asia/Tehran",
            },
          ],
        });
      }
      if (url.includes("/categories")) {
        return ok({
          categories: [
            {
              id: "00000000-0000-4000-8000-000000000034",
              parentId: null,
              name: "Shirt",
              nameFa: "پیراهن",
              slug: "shirt",
              slot: "top",
            },
          ],
        });
      }
      if (url.includes("/wardrobe/items") && init?.method === "POST") {
        return ok({ item: clothingItem });
      }
      if (url.includes("/wardrobe/items")) {
        return ok({ items: [clothingItem] });
      }
      if (url.includes("/wardrobe/media") && url.includes("/confirm")) {
        return ok({ items: [{ id: clothingItem.id, name: clothingItem.name }] });
      }
      if (url.includes("/wardrobe/media")) {
        return ok({
          media: {
            id: "00000000-0000-4000-8000-000000000050",
            processingStatus: "ready",
            mimeType: "image/jpeg",
            sizeBytes: 3,
            contentUrl: "/v1/wardrobe/media/x/content",
            detections: [],
            error: null,
            createdAt: profile.createdAt,
          },
        });
      }
      if (url.includes("/sample-catalog")) {
        return ok({ items: [{ id: clothingItem.id, name: clothingItem.name }], count: 1 });
      }
      if (url.includes("/styling/today")) {
        return ok({
          primary: recommendation,
          alternatives: [],
          weather: null,
          wardrobeItemCount: 1,
          message: null,
        });
      }
      if (url.includes("/recommendations") && url.includes("feedback")) {
        return ok({ ok: true });
      }
      if (url.includes("/replace-item")) {
        return ok({ recommendation });
      }
      if (url.includes("/recommendations")) {
        return ok({ primary: recommendation, alternatives: [] });
      }
      if (url.includes("/styling/chat")) {
        return ok({
          reply: "Hello",
          constraints: {
            occasionSlug: null,
            excludeItemIds: [],
            preferredStyles: [],
            notes: "hi",
          },
          recommendations: [],
        });
      }
      if (url.includes("/occasions")) {
        return ok({
          occasions: [
            {
              id: "00000000-0000-4000-8000-000000000040",
              name: "Everyday",
              nameFa: "روزمره",
              slug: "everyday",
              category: "daily",
              formalityLevel: 2,
              description: null,
            },
          ],
        });
      }
      if (url.includes("/weather")) {
        return ok({
          weather: {
            id: "00000000-0000-4000-8000-000000000060",
            cityId: "00000000-0000-4000-8000-000000000010",
            cityName: "Tehran",
            date: "2026-11-01",
            condition: "clear",
            temperature: 22,
            feelsLike: 21,
            minTemperature: 16,
            maxTemperature: 24,
            precipitationProbability: 5,
            humidity: 30,
            windSpeed: 10,
            fetchedAt: profile.createdAt,
            forecastAt: profile.createdAt,
          },
        });
      }
      if (url.includes("/discover/gaps")) {
        return ok({ gaps: [], itemCount: 0 });
      }
      return { ok: true, status: 204, json: async () => null };
    });

    const client = createApiClient({
      baseUrl: "http://localhost:8080",
      getToken: async () => "tok",
      fetchImpl,
    });

    await expect(client.getMe()).resolves.toMatchObject({ user: { displayName: "Ada" } });
    await expect(client.updateMe({ displayName: "Ada Lovelace" })).resolves.toMatchObject({
      user: { displayName: "Ada Lovelace" },
    });
    await expect(client.updateProfile({ onboardingStep: "styles" })).resolves.toMatchObject({
      profile,
    });
    await expect(client.getStyleProfile()).resolves.toMatchObject({ styleProfile });
    await expect(client.updateStyleProfile({ preferredStyles: ["casual"] })).resolves.toMatchObject(
      {
        styleProfile,
      },
    );
    await expect(client.listCities()).resolves.toHaveLength(1);
    await expect(client.listCategories()).resolves.toMatchObject({
      categories: [{ slug: "shirt" }],
    });
    await expect(
      client.listItems({ category: "shirt", color: "white", season: "summer", style: "casual" }),
    ).resolves.toMatchObject({ items: [clothingItem] });
    await expect(
      client.createItem({
        categoryId: clothingItem.categoryId,
        name: "White shirt",
        primaryColor: "white",
      }),
    ).resolves.toMatchObject({ item: clothingItem });
    await expect(
      client.uploadMedia(new File([new Uint8Array([1, 2, 3])], "a.jpg", { type: "image/jpeg" })),
    ).resolves.toMatchObject({ media: { processingStatus: "ready" } });
    await expect(
      client.confirmMedia("00000000-0000-4000-8000-000000000050", { garments: [] }),
    ).resolves.toMatchObject({
      items: [{ id: clothingItem.id }],
    });
    await expect(client.seedSampleCatalog()).resolves.toMatchObject({ count: 1 });
    await expect(client.createRecommendations({ regenerate: true })).resolves.toMatchObject({
      primary: { id: recommendation.id },
    });
    await expect(client.submitFeedback(recommendation.id, { action: "like" })).resolves.toEqual({
      ok: true,
    });
    await expect(
      client.replaceItem(recommendation.id, {
        clothingItemId: clothingItem.id,
        role: "top",
      }),
    ).resolves.toMatchObject({ recommendation: { id: recommendation.id } });
    await expect(client.chat({ message: "hi", locale: "en-GB" })).resolves.toMatchObject({
      reply: "Hello",
    });
    await expect(client.listOccasions()).resolves.toMatchObject({
      occasions: [{ slug: "everyday" }],
    });
    await expect(client.getWeather("00000000-0000-4000-8000-000000000010")).resolves.toMatchObject({
      weather: { cityName: "Tehran" },
    });
    await expect(client.getDiscoverGaps()).resolves.toEqual({ gaps: [], itemCount: 0 });

    const unauth = createApiClient({
      baseUrl: "http://localhost:8080",
      getToken: async () => null,
      fetchImpl,
    });
    await expect(unauth.getMe()).rejects.toThrow(/Authentication token is required/);
    await expect(unauth.deleteItem(clothingItem.id)).rejects.toThrow(
      /Authentication token is required/,
    );
    await expect(
      unauth.uploadMedia(new File([new Uint8Array([1])], "a.jpg", { type: "image/jpeg" })),
    ).rejects.toThrow(/Authentication token is required/);
  });

  it("throws generic errors when payload is not an API error", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ weird: true }),
    });
    const client = createApiClient({
      baseUrl: "http://localhost:8080",
      getToken: async () => "tok",
      fetchImpl,
    });
    await expect(client.getToday()).rejects.toThrow(/status 500/);
    await expect(client.deleteItem(clothingItem.id)).rejects.toThrow(/status 500/);
  });
});
