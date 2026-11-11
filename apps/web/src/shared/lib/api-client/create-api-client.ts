import {
  preferencesResponseSchema,
  tryOnResultSchema,
  demoSeedResponseSchema,
  type Preferences,
  type TryOnRequest,
  type TryOnResult,
  apiErrorSchema,
  clothingCategoriesResponseSchema,
  clothingItemResponseSchema,
  clothingItemsResponseSchema,
  confirmMediaRequestSchema,
  confirmMediaResponseSchema,
  createClothingItemRequestSchema,
  createRecommendationRequestSchema,
  discoverGapsResponseSchema,
  feedbackRequestSchema,
  feedbackResponseSchema,
  healthResponseSchema,
  meResponseSchema,
  mediaAssetResponseSchema,
  occasionsResponseSchema,
  recommendationsResponseSchema,
  replaceItemRequestSchema,
  replaceItemResponseSchema,
  sampleCatalogResponseSchema,
  styleProfileResponseSchema,
  stylistChatRequestSchema,
  stylistChatResponseSchema,
  todayResponseSchema,
  updateClothingItemRequestSchema,
  updateMeRequestSchema,
  updateStyleProfileRequestSchema,
  updateUserProfileRequestSchema,
  userProfileResponseSchema,
  weatherResponseSchema,
  citySchema,
  type City,
  type ClothingCategoriesResponse,
  type ClothingItemResponse,
  type ClothingItemsResponse,
  type ConfirmMediaRequest,
  type ConfirmMediaResponse,
  type CreateClothingItemRequest,
  type UpdateClothingItemRequest,
  type CreateRecommendationRequest,
  type DiscoverGapsResponse,
  type FeedbackRequest,
  type FeedbackResponse,
  type HealthResponse,
  type MeResponse,
  type MediaAssetResponse,
  type OccasionsResponse,
  type RecommendationsResponse,
  type ReplaceItemRequest,
  type ReplaceItemResponse,
  type SampleCatalogResponse,
  type StyleProfileResponse,
  type StylistChatRequest,
  type StylistChatResponse,
  type TodayResponse,
  type UpdateMeRequest,
  type UpdateStyleProfileRequest,
  type UpdateUserProfileRequest,
  type UserProfileResponse,
  type WeatherResponse,
} from "@closet/shared";
import { z } from "zod";

export type ApiClientOptions = {
  baseUrl: string;
  getToken: () => Promise<string | null>;
  fetchImpl?: typeof fetch;
};

export type ApiClient = {
  getPreferences: () => Promise<{ preferences: Preferences }>;
  updatePreferences: (input: Partial<Preferences>) => Promise<{ preferences: Preferences }>;
  seedDemo: () => Promise<{ count: number }>;
  tryOn: (input: TryOnRequest) => Promise<TryOnResult>;
  getHealth: () => Promise<HealthResponse>;
  getMe: () => Promise<MeResponse>;
  updateMe: (input: UpdateMeRequest) => Promise<MeResponse>;
  getProfile: () => Promise<UserProfileResponse>;
  updateProfile: (input: UpdateUserProfileRequest) => Promise<UserProfileResponse>;
  getStyleProfile: () => Promise<StyleProfileResponse>;
  updateStyleProfile: (input: UpdateStyleProfileRequest) => Promise<StyleProfileResponse>;
  listCities: () => Promise<City[]>;
  listCategories: () => Promise<ClothingCategoriesResponse>;
  listItems: (filters?: {
    category?: string;
    color?: string;
    season?: string;
    style?: string;
  }) => Promise<ClothingItemsResponse>;
  createItem: (input: CreateClothingItemRequest) => Promise<ClothingItemResponse>;
  updateItem: (id: string, input: UpdateClothingItemRequest) => Promise<ClothingItemResponse>;
  deleteItem: (id: string) => Promise<void>;
  uploadMedia: (file: File) => Promise<MediaAssetResponse>;
  confirmMedia: (id: string, input: ConfirmMediaRequest) => Promise<ConfirmMediaResponse>;
  seedSampleCatalog: () => Promise<SampleCatalogResponse>;
  getToday: () => Promise<TodayResponse>;
  createRecommendations: (input?: CreateRecommendationRequest) => Promise<RecommendationsResponse>;
  submitFeedback: (id: string, input: FeedbackRequest) => Promise<FeedbackResponse>;
  replaceItem: (id: string, input: ReplaceItemRequest) => Promise<ReplaceItemResponse>;
  chat: (input: StylistChatRequest) => Promise<StylistChatResponse>;
  listOccasions: () => Promise<OccasionsResponse>;
  getWeather: (cityId?: string) => Promise<WeatherResponse>;
  getDiscoverGaps: () => Promise<DiscoverGapsResponse>;
};

export function createApiClient(options: ApiClientOptions): ApiClient {
  const fetchImpl = options.fetchImpl ?? fetch;

  async function requestJson<T>(
    path: string,
    init: RequestInit,
    parse: (data: unknown) => T,
    authenticated: boolean,
  ): Promise<T> {
    const headers = new Headers(init.headers);

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    if (authenticated) {
      const token = await options.getToken();
      if (!token) {
        throw new Error("Authentication token is required");
      }
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetchImpl(`${options.baseUrl}${path}`, {
      ...init,
      headers,
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const parsedError = apiErrorSchema.safeParse(payload);
      if (parsedError.success) {
        throw new Error(parsedError.data.error.message);
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    return parse(payload);
  }

  async function requestEmpty(
    path: string,
    init: RequestInit,
    authenticated: boolean,
  ): Promise<void> {
    const headers = new Headers(init.headers);
    if (authenticated) {
      const token = await options.getToken();
      if (!token) {
        throw new Error("Authentication token is required");
      }
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetchImpl(`${options.baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const payload: unknown = await response.json().catch(() => null);
      const parsedError = apiErrorSchema.safeParse(payload);
      if (parsedError.success) {
        throw new Error(parsedError.data.error.message);
      }
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  return {
    getPreferences() {
      return requestJson(
        "/v1/users/me/preferences",
        { method: "GET" },
        (data) => preferencesResponseSchema.parse(data),
        true,
      );
    },
    updatePreferences(input) {
      return requestJson(
        "/v1/users/me/preferences",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        },
        (data) => preferencesResponseSchema.parse(data),
        true,
      );
    },
    seedDemo() {
      return requestJson(
        "/v1/demo/seed",
        { method: "POST" },
        (data) => demoSeedResponseSchema.parse(data),
        true,
      );
    },
    tryOn(input) {
      return requestJson(
        "/v1/try-on",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        },
        (data) => tryOnResultSchema.parse(data),
        true,
      );
    },
    getHealth() {
      return requestJson(
        "/health",
        { method: "GET" },
        (data) => healthResponseSchema.parse(data),
        false,
      );
    },
    getMe() {
      return requestJson(
        "/v1/users/me",
        { method: "GET" },
        (data) => meResponseSchema.parse(data),
        true,
      );
    },
    updateMe(input) {
      const body = updateMeRequestSchema.parse(input);
      return requestJson(
        "/v1/users/me",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        (data) => meResponseSchema.parse(data),
        true,
      );
    },
    getProfile() {
      return requestJson(
        "/v1/users/me/profile",
        { method: "GET" },
        (data) => userProfileResponseSchema.parse(data),
        true,
      );
    },
    updateProfile(input) {
      const body = updateUserProfileRequestSchema.parse(input);
      return requestJson(
        "/v1/users/me/profile",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        (data) => userProfileResponseSchema.parse(data),
        true,
      );
    },
    getStyleProfile() {
      return requestJson(
        "/v1/users/me/style-profile",
        { method: "GET" },
        (data) => styleProfileResponseSchema.parse(data),
        true,
      );
    },
    updateStyleProfile(input) {
      const body = updateStyleProfileRequestSchema.parse(input);
      return requestJson(
        "/v1/users/me/style-profile",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        (data) => styleProfileResponseSchema.parse(data),
        true,
      );
    },
    listCities() {
      return requestJson(
        "/v1/cities",
        { method: "GET" },
        (data) => z.object({ cities: z.array(citySchema) }).parse(data).cities,
        true,
      );
    },
    listCategories() {
      return requestJson(
        "/v1/wardrobe/categories",
        { method: "GET" },
        (data) => clothingCategoriesResponseSchema.parse(data),
        true,
      );
    },
    listItems(filters) {
      const params = new URLSearchParams();
      if (filters?.category) {
        params.set("category", filters.category);
      }
      if (filters?.color) {
        params.set("color", filters.color);
      }
      if (filters?.season) {
        params.set("season", filters.season);
      }
      if (filters?.style) {
        params.set("style", filters.style);
      }
      const query = params.toString();
      return requestJson(
        `/v1/wardrobe/items${query ? `?${query}` : ""}`,
        { method: "GET" },
        (data) => clothingItemsResponseSchema.parse(data),
        true,
      );
    },
    createItem(input) {
      const body = createClothingItemRequestSchema.parse(input);
      return requestJson(
        "/v1/wardrobe/items",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        (data) => clothingItemResponseSchema.parse(data),
        true,
      );
    },
    updateItem(id, input) {
      const body = updateClothingItemRequestSchema.parse(input);
      return requestJson(
        `/v1/wardrobe/items/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        (data) => clothingItemResponseSchema.parse(data),
        true,
      );
    },
    async deleteItem(id) {
      await requestEmpty(`/v1/wardrobe/items/${id}`, { method: "DELETE" }, true);
    },
    async uploadMedia(file) {
      const token = await options.getToken();
      if (!token) {
        throw new Error("Authentication token is required");
      }
      const form = new FormData();
      form.append("file", file);
      const response = await fetchImpl(`${options.baseUrl}/v1/wardrobe/media`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: form,
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const parsedError = apiErrorSchema.safeParse(payload);
        throw new Error(parsedError.success ? parsedError.data.error.message : "Upload failed");
      }
      return mediaAssetResponseSchema.parse(payload);
    },
    confirmMedia(id, input) {
      const body = confirmMediaRequestSchema.parse(input);
      return requestJson(
        `/v1/wardrobe/media/${id}/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        (data) => confirmMediaResponseSchema.parse(data),
        true,
      );
    },
    seedSampleCatalog() {
      return requestJson(
        "/v1/wardrobe/sample-catalog",
        { method: "POST" },
        (data) => sampleCatalogResponseSchema.parse(data),
        true,
      );
    },
    getToday() {
      return requestJson(
        "/v1/styling/today",
        { method: "GET" },
        (data) => todayResponseSchema.parse(data),
        true,
      );
    },
    createRecommendations(input = {}) {
      const body = createRecommendationRequestSchema.parse(input);
      return requestJson(
        "/v1/styling/recommendations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        (data) => recommendationsResponseSchema.parse(data),
        true,
      );
    },
    submitFeedback(id, input) {
      const body = feedbackRequestSchema.parse(input);
      return requestJson(
        `/v1/styling/recommendations/${id}/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        (data) => feedbackResponseSchema.parse(data),
        true,
      );
    },
    replaceItem(id, input) {
      const body = replaceItemRequestSchema.parse(input);
      return requestJson(
        `/v1/styling/recommendations/${id}/replace-item`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        (data) => replaceItemResponseSchema.parse(data),
        true,
      );
    },
    chat(input) {
      const body = stylistChatRequestSchema.parse(input);
      return requestJson(
        "/v1/styling/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        (data) => stylistChatResponseSchema.parse(data),
        true,
      );
    },
    listOccasions() {
      return requestJson(
        "/v1/occasions",
        { method: "GET" },
        (data) => occasionsResponseSchema.parse(data),
        true,
      );
    },
    getWeather(cityId) {
      const query = cityId ? `?cityId=${encodeURIComponent(cityId)}` : "";
      return requestJson(
        `/v1/weather${query}`,
        { method: "GET" },
        (data) => weatherResponseSchema.parse(data),
        true,
      );
    },
    getDiscoverGaps() {
      return requestJson(
        "/v1/discover/gaps",
        { method: "GET" },
        (data) => discoverGapsResponseSchema.parse(data),
        true,
      );
    },
  };
}

export function buildAuthHeader(token: string | null): HeadersInit {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
