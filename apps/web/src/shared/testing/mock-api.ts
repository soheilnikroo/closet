import { vi } from "vitest";

import type { ApiClient } from "@/shared/lib";

export function createMockApiClient(overrides: Partial<ApiClient> = {}): ApiClient {
  const client: ApiClient = {
    listCollections: vi.fn().mockResolvedValue({ collections: [] }),
    createCollection: vi.fn(),
    getCollection: vi.fn(),
    updateCollection: vi.fn().mockResolvedValue({ ok: true }),
    saveCollectionOutfit: vi.fn().mockResolvedValue({ ok: true }),
    getPreferences: vi.fn().mockResolvedValue({
      preferences: {
        locale: "en-GB",
        notifications: false,
        savedDiscoverIds: [],
        silhouette: "straight",
        heightBand: "unspecified",
      },
    }),
    updatePreferences: vi.fn().mockImplementation(async (input) => ({
      preferences: {
        locale: "en-GB",
        notifications: false,
        savedDiscoverIds: [],
        silhouette: "straight",
        heightBand: "unspecified",
        ...input,
      },
    })),
    seedDemo: vi.fn().mockResolvedValue({ count: 12 }),
    tryOn: vi.fn().mockResolvedValue({
      provider: "mock",
      outfitId: "00000000-0000-4000-8000-000000000031",
      imageUrl: "data:image/svg+xml,<svg/>",
    }),
    getHealth: vi.fn().mockResolvedValue({
      status: "ok",
      service: "closet-api",
      timestamp: "2026-11-01T10:00:00.000Z",
    }),
    getMe: vi.fn(),
    updateMe: vi.fn(),
    getProfile: vi.fn().mockResolvedValue({
      profile: {
        userId: "00000000-0000-4000-8000-000000000001",
        cityId: null,
        currency: "IRR",
        temperaturePreference: "celsius",
        preferredLanguage: "en-GB",
        onboardingCompleted: false,
        onboardingStep: "welcome",
        createdAt: "2026-11-01T10:00:00.000Z",
        updatedAt: "2026-11-01T10:00:00.000Z",
      },
    }),
    updateProfile: vi.fn().mockResolvedValue({
      profile: {
        userId: "00000000-0000-4000-8000-000000000001",
        cityId: null,
        currency: "IRR",
        temperaturePreference: "celsius",
        preferredLanguage: "en-GB",
        onboardingCompleted: false,
        onboardingStep: "styles",
        createdAt: "2026-11-01T10:00:00.000Z",
        updatedAt: "2026-11-01T10:00:00.000Z",
      },
    }),
    getStyleProfile: vi.fn(),
    updateStyleProfile: vi.fn().mockResolvedValue({
      styleProfile: {
        userId: "00000000-0000-4000-8000-000000000001",
        preferredStyles: ["casual"],
        preferredFits: [],
        dislikedFits: [],
        preferredColors: [],
        dislikedColors: [],
        comfortPriority: null,
        lifestylePreferences: [],
        updatedAt: "2026-11-01T10:00:00.000Z",
      },
    }),
    listCities: vi.fn().mockResolvedValue([
      {
        id: "00000000-0000-4000-8000-000000000010",
        name: "Tehran",
        nameFa: "تهران",
        province: "Tehran",
        latitude: 35.6,
        longitude: 51.4,
        timezone: "Asia/Tehran",
      },
    ]),
    listCategories: vi.fn().mockResolvedValue({ categories: [] }),
    listItems: vi.fn().mockResolvedValue({ items: [] }),
    createItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn(),
    uploadMedia: vi.fn(),
    confirmMedia: vi.fn(),
    seedSampleCatalog: vi.fn().mockResolvedValue({
      items: [{ id: "00000000-0000-4000-8000-000000000020", name: "Shirt" }],
      count: 1,
    }),
    getToday: vi.fn().mockResolvedValue({
      primary: null,
      alternatives: [],
      weather: null,
      wardrobeItemCount: 0,
      message: "Add a few clothing items to get your first outfit.",
    }),
    createRecommendations: vi.fn().mockResolvedValue({
      primary: {
        id: "00000000-0000-4000-8000-000000000030",
        outfit: {
          id: "00000000-0000-4000-8000-000000000031",
          name: "Smart casual",
          description: null,
          style: "casual",
          createdAt: "2026-11-01T10:00:00.000Z",
          items: [
            {
              clothingItemId: "00000000-0000-4000-8000-000000000032",
              role: "top",
              position: 0,
              item: {
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
              },
            },
          ],
        },
        recommendationType: "first_outfit",
        occasionId: null,
        occasionName: null,
        score: 0.8,
        explanation: "A clean everyday combination.",
        generatedAt: "2026-11-01T10:00:00.000Z",
      },
      alternatives: [],
    }),
    submitFeedback: vi.fn().mockResolvedValue({ ok: true }),
    replaceItem: vi.fn(),
    chat: vi.fn().mockResolvedValue({
      reply: "Here is an idea.",
      recommendations: [],
    }),
    listOccasions: vi.fn().mockResolvedValue({
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
    }),
    getWeather: vi.fn(),
    getDiscoverGaps: vi.fn().mockResolvedValue({
      gaps: [
        {
          categorySlug: "jacket",
          categoryName: "Versatile jacket",
          categoryNameFa: "کت همه‌کاره",
          reason: "More combinations",
          reasonFa: "ترکیب بیشتر",
          priority: 1,
        },
      ],
      itemCount: 3,
    }),
  };
  client.getMe = vi.fn().mockResolvedValue({
    user: {
      id: "00000000-0000-4000-8000-000000000001",
      clerkUserId: "mock:dev-user",
      email: null,
      phone: null,
      displayName: "My closet",
      avatarUrl: null,
      locale: "en-GB",
      status: "active",
      createdAt: "2026-11-01T10:00:00.000Z",
      updatedAt: "2026-11-01T10:00:00.000Z",
    },
  });
  client.updateMe = vi
    .fn()
    .mockImplementation(async (input) => ({ user: { ...(await client.getMe()).user, ...input } }));
  client.getStyleProfile = vi.fn().mockImplementation(() => client.updateStyleProfile({}));
  client.createItem = vi.fn().mockImplementation(async (input) => ({
    item: { ...(await client.createRecommendations()).primary.outfit.items[0]?.item, ...input },
  }));
  client.updateItem = vi.fn().mockImplementation(async (id, input) => ({
    item: {
      ...(await client.createRecommendations()).primary.outfit.items[0]?.item,
      ...input,
      id,
    },
  }));
  client.deleteItem = vi.fn().mockResolvedValue(undefined);
  client.uploadMedia = vi.fn().mockResolvedValue({
    media: {
      id: "00000000-0000-4000-8000-000000000050",
      processingStatus: "completed",
      mimeType: "image/jpeg",
      sizeBytes: 10,
      contentUrl: null,
      error: null,
      createdAt: "2026-11-01T10:00:00.000Z",
      detections: [],
    },
  });
  client.confirmMedia = vi.fn().mockResolvedValue({ items: [], count: 0 });
  client.replaceItem = vi.fn().mockImplementation(async () => ({
    recommendation: (await client.createRecommendations()).primary,
  }));
  client.getWeather = vi.fn().mockResolvedValue({ weather: null });
  return { ...client, ...overrides };
}
