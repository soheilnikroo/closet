import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClosetPage } from "@/pages/closet-page/closet-page.js";
import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

const item = {
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
};

const mockApi = createMockApiClient({
  listItems: vi.fn().mockResolvedValue({ items: [item] }),
  deleteItem: vi.fn().mockResolvedValue(undefined),
  seedSampleCatalog: vi.fn().mockResolvedValue({
    items: [{ id: item.id, name: item.name }],
    count: 1,
  }),
});

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

vi.mock("@/features/user-auth-controls", () => ({
  UserAuthControls: () => null,
}));

describe("ClosetPage interactions", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
    vi.clearAllMocks();
  });

  it("lists items, filters by slot, deletes, and seeds samples", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ClosetPage />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/white shirt/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^tops$/i }));
    expect(screen.getByText(/white shirt/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^delete$/i }));
    expect(mockApi.deleteItem).toHaveBeenCalledWith(item.id);

    await user.click(screen.getByRole("button", { name: /^add clothing$/i }));
    await user.click(screen.getByRole("button", { name: /use sample/i }));
    expect(mockApi.seedSampleCatalog).toHaveBeenCalled();
  });
});
