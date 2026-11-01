import Fastify from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Env } from "../shared/config/index.js";
import { registerDiscoverRoutes } from "./shopping/discover-routes.js";
import { registerStylingRoutes } from "./styling/styling-routes.js";
import { registerProfileRoutes } from "./users/profile-routes.js";
import { registerWardrobeRoutes } from "./wardrobe/wardrobe-routes.js";
import { registerWeatherRoutes } from "./weather/weather-routes.js";

const user = {
  id: "00000000-0000-4000-8000-000000000001",
  clerkUserId: "user_1",
  email: "a@example.com",
  phone: null,
  displayName: "Test",
  avatarUrl: null,
  locale: "en-GB" as const,
  status: "active" as const,
  createdAt: "2026-11-01T10:00:00.000Z",
  updatedAt: "2026-11-01T10:00:00.000Z",
};

const usersService = {
  getByClerkUserId: vi.fn().mockResolvedValue(user),
  upsertFromClerk: vi.fn().mockResolvedValue(user),
};

const profileService = {
  ensureDefaults: vi.fn(),
  getProfile: vi.fn().mockResolvedValue({
    userId: user.id,
    cityId: "00000000-0000-4000-8000-000000000010",
    currency: "IRR",
    temperaturePreference: "celsius",
    preferredLanguage: "en-GB",
    onboardingCompleted: false,
    onboardingStep: "welcome",
    createdAt: "2026-11-01T10:00:00.000Z",
    updatedAt: "2026-11-01T10:00:00.000Z",
  }),
  updateProfile: vi.fn().mockResolvedValue({
    userId: user.id,
    cityId: null,
    currency: "IRR",
    temperaturePreference: "celsius",
    preferredLanguage: "fa-IR",
    onboardingCompleted: true,
    onboardingStep: "done",
    createdAt: "2026-11-01T10:00:00.000Z",
    updatedAt: "2026-11-01T10:00:00.000Z",
  }),
  getStyleProfile: vi.fn().mockResolvedValue({
    userId: user.id,
    preferredStyles: ["casual"],
    preferredFits: [],
    dislikedFits: [],
    preferredColors: [],
    dislikedColors: [],
    comfortPriority: null,
    lifestylePreferences: [],
    updatedAt: "2026-11-01T10:00:00.000Z",
  }),
  updateStyleProfile: vi.fn().mockResolvedValue({
    userId: user.id,
    preferredStyles: ["minimal"],
    preferredFits: [],
    dislikedFits: [],
    preferredColors: [],
    dislikedColors: [],
    comfortPriority: null,
    lifestylePreferences: [],
    updatedAt: "2026-11-01T10:00:00.000Z",
  }),
  listCities: vi.fn().mockResolvedValue([
    {
      id: "00000000-0000-4000-8000-000000000010",
      name: "Tehran",
      nameFa: "تهران",
      province: "Tehran",
      latitude: 35,
      longitude: 51,
      timezone: "Asia/Tehran",
    },
  ]),
};

const recommendation = {
  id: "00000000-0000-4000-8000-000000000030",
  outfit: {
    id: "00000000-0000-4000-8000-000000000031",
    name: "Look",
    description: null,
    style: "casual",
    createdAt: "2026-11-01T10:00:00.000Z",
    items: [
      {
        clothingItemId: "00000000-0000-4000-8000-000000000032",
        role: "top",
        position: 0,
      },
    ],
  },
  recommendationType: "daily",
  occasionId: null,
  occasionName: null,
  score: 0.8,
  explanation: "Nice",
  generatedAt: "2026-11-01T10:00:00.000Z",
};

const wardrobeService = {
  listCategories: vi.fn().mockResolvedValue([]),
  listItems: vi.fn().mockResolvedValue([]),
  createItem: vi.fn().mockResolvedValue({
    id: "00000000-0000-4000-8000-000000000032",
    wardrobeId: "00000000-0000-4000-8000-000000000033",
    categoryId: "00000000-0000-4000-8000-000000000034",
    categorySlug: "shirt",
    slot: "top",
    name: "Shirt",
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
    sourceType: "manual",
    status: "active",
    imageUrl: null,
    createdAt: "2026-11-01T10:00:00.000Z",
    updatedAt: "2026-11-01T10:00:00.000Z",
    lastWornAt: null,
  }),
  getItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn().mockResolvedValue(undefined),
  uploadMedia: vi.fn(),
  getMedia: vi.fn().mockResolvedValue({
    id: "00000000-0000-4000-8000-000000000040",
    processingStatus: "ready",
    mimeType: "image/jpeg",
    sizeBytes: 4,
    contentUrl: "/v1/wardrobe/media/x/content",
    detections: [],
    error: null,
    createdAt: "2026-11-01T10:00:00.000Z",
  }),
  getMediaContent: vi.fn().mockResolvedValue({
    bytes: new Uint8Array([1, 2, 3, 4]),
    mimeType: "image/jpeg",
  }),
  analyzeMedia: vi.fn(),
  confirmMedia: vi
    .fn()
    .mockResolvedValue([{ id: "00000000-0000-4000-8000-000000000032", name: "Shirt" }]),
  seedSampleCatalog: vi
    .fn()
    .mockResolvedValue([{ id: "00000000-0000-4000-8000-000000000032", name: "Shirt" }]),
  ensureWardrobe: vi.fn(),
  registerVisionWorker: vi.fn(),
};

const stylingService = {
  getToday: vi.fn().mockResolvedValue({
    primary: recommendation,
    alternatives: [],
    weather: null,
    wardrobeItemCount: 3,
    message: null,
  }),
  createRecommendations: vi.fn().mockResolvedValue({
    primary: recommendation,
    alternatives: [],
  }),
  submitFeedback: vi.fn().mockResolvedValue(undefined),
  replaceItem: vi.fn().mockResolvedValue(recommendation),
  chat: vi.fn().mockResolvedValue({
    reply: "Try this",
    recommendations: [recommendation],
  }),
  listOccasions: vi.fn().mockResolvedValue([]),
};

const weatherService = {
  getForCity: vi.fn().mockResolvedValue({
    id: "00000000-0000-4000-8000-000000000050",
    cityId: "00000000-0000-4000-8000-000000000010",
    cityName: "Tehran",
    temperature: 22,
    feelsLike: 21,
    minTemperature: 16,
    maxTemperature: 26,
    precipitationProbability: 10,
    windSpeed: 8,
    humidity: 40,
    condition: "clear",
    forecastAt: "2026-11-01T10:00:00.000Z",
    fetchedAt: "2026-11-01T10:00:00.000Z",
  }),
  getForUserCity: vi.fn(),
};

const discoverService = {
  getGaps: vi.fn().mockResolvedValue({ gaps: [], itemCount: 0 }),
};

const env = {} as Env;
const getAuth = () => ({ userId: "user_1" });

describe("protected route surface", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("covers profile, wardrobe, styling, weather, and discover endpoints", async () => {
    const app = Fastify();
    const db = {
      update: () => ({
        set: () => ({
          where: () => ({
            returning: async () => [
              {
                id: user.id,
                clerkUserId: user.clerkUserId,
                email: user.email,
                phone: user.phone,
                displayName: "Updated",
                avatarUrl: null,
                locale: "fa-IR",
                status: "active",
                createdAt: new Date("2026-11-01T10:00:00.000Z"),
                updatedAt: new Date("2026-11-01T10:00:00.000Z"),
              },
            ],
          }),
        }),
      }),
    };

    await registerProfileRoutes(app, {
      db: db as never,
      env,
      usersService,
      profileService,
      getAuth,
    });
    await registerWardrobeRoutes(app, {
      env,
      usersService,
      wardrobeService,
      getAuth,
    });
    await registerStylingRoutes(app, {
      env,
      usersService,
      stylingService,
      getAuth,
    });
    await registerWeatherRoutes(app, {
      env,
      usersService,
      profileService,
      weatherService,
      getAuth,
    });
    await registerDiscoverRoutes(app, {
      env,
      usersService,
      discoverService,
      getAuth,
    });

    const calls = [
      app.inject({ method: "GET", url: "/v1/users/me/profile" }),
      app.inject({
        method: "PATCH",
        url: "/v1/users/me/profile",
        payload: { onboardingStep: "done", onboardingCompleted: true },
      }),
      app.inject({ method: "GET", url: "/v1/users/me/style-profile" }),
      app.inject({
        method: "PATCH",
        url: "/v1/users/me/style-profile",
        payload: { preferredStyles: ["minimal"] },
      }),
      app.inject({ method: "GET", url: "/v1/cities" }),
      app.inject({
        method: "PATCH",
        url: "/v1/users/me",
        payload: { displayName: "Updated", locale: "fa-IR" },
      }),
      app.inject({ method: "GET", url: "/v1/wardrobe/categories" }),
      app.inject({
        method: "GET",
        url: "/v1/wardrobe/items?color=white&season=summer&style=casual",
      }),
      app.inject({
        method: "POST",
        url: "/v1/wardrobe/items",
        payload: {
          categoryId: "00000000-0000-4000-8000-000000000034",
          name: "Shirt",
          primaryColor: "white",
        },
      }),
      app.inject({
        method: "DELETE",
        url: "/v1/wardrobe/items/00000000-0000-4000-8000-000000000032",
      }),
      app.inject({ method: "GET", url: "/v1/wardrobe/media/00000000-0000-4000-8000-000000000040" }),
      app.inject({
        method: "GET",
        url: "/v1/wardrobe/media/00000000-0000-4000-8000-000000000040/content",
      }),
      app.inject({
        method: "POST",
        url: "/v1/wardrobe/media/00000000-0000-4000-8000-000000000040/confirm",
        payload: { garments: [] },
      }),
      app.inject({ method: "POST", url: "/v1/wardrobe/sample-catalog" }),
      app.inject({ method: "GET", url: "/v1/styling/today" }),
      app.inject({
        method: "POST",
        url: "/v1/styling/recommendations",
        payload: { regenerate: true },
      }),
      app.inject({
        method: "POST",
        url: "/v1/styling/recommendations/00000000-0000-4000-8000-000000000030/feedback",
        payload: { action: "like" },
      }),
      app.inject({
        method: "POST",
        url: "/v1/styling/recommendations/00000000-0000-4000-8000-000000000030/replace-item",
        payload: {
          clothingItemId: "00000000-0000-4000-8000-000000000032",
          role: "top",
        },
      }),
      app.inject({
        method: "POST",
        url: "/v1/styling/chat",
        payload: { message: "What should I wear?" },
      }),
      app.inject({ method: "GET", url: "/v1/occasions" }),
      app.inject({
        method: "GET",
        url: "/v1/weather?cityId=00000000-0000-4000-8000-000000000010",
      }),
      app.inject({ method: "GET", url: "/v1/discover/gaps" }),
    ];

    const responses = await Promise.all(calls);
    for (const response of responses) {
      expect(response.statusCode).toBeLessThan(500);
      expect([200, 201, 204]).toContain(response.statusCode);
    }

    await app.close();
  });
});
