import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

import { DiscoverPage } from "./discover-page.js";

const mockApi = createMockApiClient();

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

vi.mock("@/features/user-auth-controls", () => ({
  UserAuthControls: () => null,
}));

describe("DiscoverPage", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
  });

  it("renders wardrobe gaps", async () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <DiscoverPage />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/versatile jacket/i)).toBeInTheDocument();
    expect(screen.getByText(/shopping stays optional/i)).toBeInTheDocument();
  });
});
