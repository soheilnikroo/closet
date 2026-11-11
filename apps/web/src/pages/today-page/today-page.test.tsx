import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TodayPage } from "@/pages/today-page/today-page.js";
import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

const mockApi = createMockApiClient();

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

vi.mock("@/features/user-auth-controls", () => ({
  UserAuthControls: () => null,
}));

describe("TodayPage", () => {
  beforeEach(async () => {
    const response = await mockApi.getMe();
    vi.mocked(mockApi.getMe).mockResolvedValue({
      user: { ...response.user, displayName: "Alex Morgan" },
    });
    await initI18n();
    await i18n.changeLanguage("en-GB");
  });

  it("shows closet guidance when no outfit exists", async () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <TodayPage />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(/add a few clothing items to get your first outfit/i),
    ).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Hi, Alex" })).toBeInTheDocument();
  });
});
