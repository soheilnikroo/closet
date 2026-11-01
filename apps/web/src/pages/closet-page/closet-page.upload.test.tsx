import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClosetPage } from "@/pages/closet-page/closet-page.js";
import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

const garment = {
  tempId: "temp-1",
  categorySlug: "shirt",
  name: "Detected shirt",
  primaryColor: "blue",
  colors: ["blue"],
  pattern: "solid",
  styleTags: ["casual" as const],
  seasons: ["all_season" as const],
  material: "cotton",
  formality: "casual" as const,
  fit: "regular" as const,
  warmthLevel: 2,
  confidence: 0.9,
};

const mockApi = createMockApiClient({
  uploadMedia: vi.fn().mockResolvedValue({
    media: {
      id: "00000000-0000-4000-8000-000000000050",
      processingStatus: "ready",
      mimeType: "image/jpeg",
      sizeBytes: 3,
      contentUrl: "/v1/wardrobe/media/x/content",
      detections: [garment],
      error: null,
      createdAt: "2026-11-01T10:00:00.000Z",
    },
  }),
  confirmMedia: vi.fn().mockResolvedValue({
    items: [{ id: "00000000-0000-4000-8000-000000000032", name: "Detected shirt" }],
  }),
});

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

vi.mock("@/features/user-auth-controls", () => ({
  UserAuthControls: () => null,
}));

describe("ClosetPage upload", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
    vi.clearAllMocks();
  });

  it("uploads media from the add sheet and opens stylist chat", async () => {
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

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();
    if (fileInput) {
      await user.upload(
        fileInput as HTMLInputElement,
        new File([new Uint8Array([1, 2, 3])], "look.jpg", { type: "image/jpeg" }),
      );
    }

    expect(mockApi.uploadMedia).toHaveBeenCalled();
    expect(mockApi.confirmMedia).toHaveBeenCalled();

    const reopen = screen.getAllByRole("button", { name: /^add clothing$/i })[0];
    expect(reopen).toBeTruthy();
    if (reopen) {
      await user.click(reopen);
    }
    await user.click(screen.getByRole("button", { name: /ask the stylist|stylist/i }));
    expect(await screen.findByRole("textbox")).toBeInTheDocument();
  });
});
