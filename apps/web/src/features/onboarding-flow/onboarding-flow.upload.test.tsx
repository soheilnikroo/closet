import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

import { OnboardingFlow } from "./onboarding-flow.js";

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

describe("OnboardingFlow upload path", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
    vi.clearAllMocks();
  });

  it("uploads a photo, confirms detections, and regenerates the first outfit", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <OnboardingFlow onComplete={onComplete} />
      </I18nextProvider>,
    );

    await user.click(screen.getByRole("button", { name: /get started/i }));
    await user.click(await screen.findByRole("button", { name: /^skip$/i }));
    await user.click(await screen.findByRole("button", { name: /^skip$/i }));

    const fileInput = await screen.findByLabelText(/upload photos/i);
    const file = new File([new Uint8Array([1, 2, 3])], "look.jpg", { type: "image/jpeg" });
    await user.upload(fileInput, file);

    expect(await screen.findByText(/detected shirt/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    expect(await screen.findByText(/your first outfit/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /try another/i }));
    expect(mockApi.createRecommendations).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /not for me/i }));
    expect(onComplete).toHaveBeenCalled();
  });
});
