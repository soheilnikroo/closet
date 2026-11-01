import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

import { DiscoverPage } from "./discover-page.js";

const mockApi = createMockApiClient({
  getDiscoverGaps: vi.fn().mockResolvedValue({ gaps: [], itemCount: 0 }),
});

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

vi.mock("@/features/user-auth-controls", () => ({
  UserAuthControls: () => null,
}));

describe("DiscoverPage edges", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
    vi.clearAllMocks();
  });

  it("shows empty gaps and opens stylist chat", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <DiscoverPage />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/looking balanced/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /stylist|ai/i }));
    expect(await screen.findByRole("textbox")).toBeInTheDocument();
  });
});
