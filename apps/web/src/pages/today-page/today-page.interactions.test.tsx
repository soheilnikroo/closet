import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TodayPage } from "@/pages/today-page/today-page.js";
import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

const recommendation = {
  id: "00000000-0000-4000-8000-000000000030",
  outfit: {
    id: "00000000-0000-4000-8000-000000000031",
    name: "Smart casual",
    description: null,
    style: "casual" as const,
    createdAt: "2026-11-01T10:00:00.000Z",
    items: [
      {
        clothingItemId: "00000000-0000-4000-8000-000000000032",
        role: "top" as const,
        position: 0,
        item: {
          id: "00000000-0000-4000-8000-000000000032",
          wardrobeId: "00000000-0000-4000-8000-000000000033",
          categoryId: "00000000-0000-4000-8000-000000000034",
          categorySlug: "shirt",
          slot: "top" as const,
          name: "White shirt",
          primaryColor: "white",
          colors: ["white"],
          pattern: "solid",
          styleTags: ["casual" as const],
          seasons: ["all_season" as const],
          material: null,
          formality: "casual" as const,
          fit: "regular" as const,
          cut: null,
          length: null,
          warmthLevel: 2,
          size: null,
          brand: null,
          sourceType: "sample_catalog" as const,
          status: "active" as const,
          imageUrl: null,
          createdAt: "2026-11-01T10:00:00.000Z",
          updatedAt: "2026-11-01T10:00:00.000Z",
          lastWornAt: null,
        },
      },
    ],
  },
  recommendationType: "daily" as const,
  occasionId: null,
  occasionName: null,
  score: 0.8,
  explanation: "A clean everyday combination.",
  weather: null,
  generatedAt: "2026-11-01T10:00:00.000Z",
};

const altRecommendation = {
  ...recommendation,
  id: "00000000-0000-4000-8000-000000000039",
};

const mockApi = createMockApiClient({
  getToday: vi.fn().mockResolvedValue({
    primary: recommendation,
    alternatives: [altRecommendation],
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
      forecastAt: "2026-11-01T10:00:00.000Z",
      fetchedAt: "2026-11-01T10:00:00.000Z",
    },
    wardrobeItemCount: 5,
    message: null,
  }),
  createRecommendations: vi.fn().mockResolvedValue({
    primary: recommendation,
    alternatives: [altRecommendation],
  }),
});

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

vi.mock("@/features/user-auth-controls", () => ({
  UserAuthControls: () => null,
}));

describe("TodayPage interactions", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
    vi.clearAllMocks();
  });

  it("shows weather, outfit actions, and occasion chips", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <TodayPage />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/tehran/i)).toBeInTheDocument();
    expect(screen.getAllByText(/a clean everyday combination/i).length).toBeGreaterThan(0);

    const details = screen.getAllByText("Details & more options")[0];
    expect(details).toBeDefined();
    if (details) {
      await user.click(details);
    }
    const primaryLike = screen.getAllByRole("button", { name: /^like$/i })[0];
    await waitFor(() => expect(primaryLike).toBeEnabled());
    if (primaryLike) {
      await user.click(primaryLike);
    }
    expect(await screen.findByRole("dialog", { name: /save this look/i })).toBeInTheDocument();
    expect(mockApi.submitFeedback).not.toHaveBeenCalled();
    await user.keyboard("{Escape}");

    await user.click(screen.getByRole("button", { name: /^everyday$/i }));
    expect(mockApi.createRecommendations).toHaveBeenCalled();
  });
});
