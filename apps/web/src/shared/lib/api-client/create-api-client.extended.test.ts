import { describe, expect, it, vi } from "vitest";

import { createApiClient } from "@/shared/lib/api-client/create-api-client.js";

describe("createApiClient product endpoints", () => {
  it("calls authenticated wardrobe and styling endpoints", async () => {
    const fetchImpl = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/wardrobe/items") && !url.includes("DELETE")) {
        return {
          ok: true,
          json: async () => ({ items: [] }),
        };
      }
      if (url.includes("/styling/today")) {
        return {
          ok: true,
          json: async () => ({
            primary: null,
            alternatives: [],
            weather: null,
            wardrobeItemCount: 0,
            message: null,
          }),
        };
      }
      if (url.includes("/discover/gaps")) {
        return {
          ok: true,
          json: async () => ({ gaps: [], itemCount: 0 }),
        };
      }
      if (url.includes("/users/me/profile")) {
        return {
          ok: true,
          json: async () => ({
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
        };
      }
      return {
        ok: true,
        status: 204,
        json: async () => null,
      };
    });

    const client = createApiClient({
      baseUrl: "http://localhost:8080",
      getToken: async () => "tok",
      fetchImpl,
    });

    await expect(client.listItems()).resolves.toEqual({ items: [] });
    await expect(client.getToday()).resolves.toMatchObject({ wardrobeItemCount: 0 });
    await expect(client.getDiscoverGaps()).resolves.toEqual({ gaps: [], itemCount: 0 });
    await expect(client.getProfile()).resolves.toMatchObject({
      profile: { preferredLanguage: "en-GB" },
    });
    await expect(
      client.deleteItem("00000000-0000-4000-8000-000000000099"),
    ).resolves.toBeUndefined();
  });

  it("surfaces API error messages", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({
        error: { code: "wardrobe_too_limited", message: "Need more clothes" },
      }),
    });

    const client = createApiClient({
      baseUrl: "http://localhost:8080",
      getToken: async () => "tok",
      fetchImpl,
    });

    await expect(client.getToday()).rejects.toThrow(/Need more clothes/);
  });
});
