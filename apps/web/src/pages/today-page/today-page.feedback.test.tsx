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
    items: [],
  },
  recommendationType: "daily" as const,
  occasionId: null,
  occasionName: null,
  score: 0.8,
  explanation: "A clean everyday combination.",
  weather: null,
  generatedAt: "2026-11-01T10:00:00.000Z",
};

const mockApi = createMockApiClient({
  getToday: vi.fn().mockResolvedValue({
    primary: recommendation,
    alternatives: [],
    weather: null,
    wardrobeItemCount: 5,
    message: null,
  }),
});

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

vi.mock("@/features/user-auth-controls", () => ({
  UserAuthControls: () => null,
}));

describe("TodayPage feedback", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
    vi.clearAllMocks();
  });

  it("supports dislike and save actions", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <TodayPage />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/a clean everyday combination/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("button", { name: /not for me/i })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: /not for me/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /^save$/i })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: /^save$/i }));
    expect(mockApi.submitFeedback).toHaveBeenCalledTimes(2);
    expect(await screen.findByText(/look saved/i)).toBeInTheDocument();
  });
});
