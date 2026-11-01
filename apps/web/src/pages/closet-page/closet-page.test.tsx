import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClosetPage } from "@/pages/closet-page/closet-page.js";
import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

const mockApi = createMockApiClient();

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

vi.mock("@/features/user-auth-controls", () => ({
  UserAuthControls: () => null,
}));

describe("ClosetPage", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
    vi.clearAllMocks();
  });

  it("shows empty state and opens add sheet", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ClosetPage />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/your closet awaits/i)).toBeInTheDocument();
    const addButtons = screen.getAllByRole("button", { name: /^add clothing$/i });
    const emptyStateAdd = addButtons[0];
    expect(emptyStateAdd).toBeTruthy();
    if (emptyStateAdd) {
      await user.click(emptyStateAdd);
    }
    expect(await screen.findByText(/take a photo or choose/i)).toBeInTheDocument();
  });
});
