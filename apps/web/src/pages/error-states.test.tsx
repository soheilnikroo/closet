import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { StylistChatSheet } from "@/features/stylist-chat-sheet";
import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

import { ClosetPage } from "./closet-page/closet-page.js";
import { DiscoverPage } from "./discover-page/discover-page.js";
import { TodayPage } from "./today-page/today-page.js";

const mockApi = createMockApiClient({
  listItems: vi.fn().mockRejectedValue(new Error("closet failed")),
  getToday: vi.fn().mockRejectedValue(new Error("today failed")),
  getDiscoverGaps: vi.fn().mockRejectedValue(new Error("discover failed")),
  chat: vi.fn().mockRejectedValue(new Error("chat failed")),
  createRecommendations: vi.fn().mockRejectedValue(new Error("regen failed")),
});

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

vi.mock("@/features/user-auth-controls", () => ({
  UserAuthControls: () => null,
}));

describe("page error states", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
    vi.clearAllMocks();
  });

  it("surfaces closet, today, discover, and chat failures", async () => {
    const user = userEvent.setup();

    const { unmount: unmountCloset } = render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ClosetPage />
        </I18nextProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByText(/closet failed/i)).toBeInTheDocument();
    unmountCloset();

    const { unmount: unmountToday } = render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <TodayPage />
        </I18nextProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByText(/today failed/i)).toBeInTheDocument();
    unmountToday();

    // Message path regenerate failure
    mockApi.getToday = vi.fn().mockResolvedValue({
      primary: null,
      alternatives: [],
      weather: null,
      wardrobeItemCount: 0,
      message: "Add a few clothing items to get your first outfit.",
    });
    const { unmount: unmountTodayMessage } = render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <TodayPage />
        </I18nextProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByText(/add a few clothing items/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^regenerate$/i }));
    expect(await screen.findByText(/regen failed/i)).toBeInTheDocument();
    unmountTodayMessage();

    const { unmount: unmountDiscover } = render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <DiscoverPage />
        </I18nextProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByText(/discover failed/i)).toBeInTheDocument();
    unmountDiscover();

    render(
      <I18nextProvider i18n={i18n}>
        <StylistChatSheet open onClose={vi.fn()} />
      </I18nextProvider>,
    );
    await user.type(screen.getByRole("textbox"), "Hello stylist");
    await user.click(screen.getByRole("button", { name: /^ask$/i }));
    expect(await screen.findByText(/chat failed/i)).toBeInTheDocument();
  });
});
