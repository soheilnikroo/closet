import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OutfitCard } from "@/features/outfit-card/outfit-card.js";
import { i18n, initI18n } from "@/shared/i18n/i18n.js";

describe("OutfitCard", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
  });

  it("renders outfit details and fires actions", async () => {
    const user = userEvent.setup();
    const onLike = vi.fn();
    const onDislike = vi.fn();
    const onSave = vi.fn();
    const onRegenerate = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <OutfitCard
          recommendation={{
            id: "00000000-0000-4000-8000-000000000001",
            outfit: {
              id: "00000000-0000-4000-8000-000000000002",
              name: "Easy smart casual",
              description: null,
              style: "smart_casual",
              createdAt: "2026-11-01T10:00:00.000Z",
              items: [
                {
                  clothingItemId: "00000000-0000-4000-8000-000000000003",
                  role: "top",
                  position: 0,
                  item: {
                    id: "00000000-0000-4000-8000-000000000003",
                    wardrobeId: "00000000-0000-4000-8000-000000000004",
                    categoryId: "00000000-0000-4000-8000-000000000005",
                    categorySlug: "shirt",
                    slot: "top",
                    name: "White shirt",
                    primaryColor: "white",
                    colors: ["white"],
                    pattern: "solid",
                    styleTags: ["smart_casual"],
                    seasons: ["all_season"],
                    material: null,
                    formality: "smart_casual",
                    fit: "regular",
                    cut: null,
                    length: null,
                    warmthLevel: 2,
                    size: null,
                    brand: null,
                    sourceType: "manual",
                    status: "active",
                    imageUrl: null,
                    createdAt: "2026-11-01T10:00:00.000Z",
                    updatedAt: "2026-11-01T10:00:00.000Z",
                    lastWornAt: null,
                  },
                },
              ],
            },
            recommendationType: "daily",
            occasionId: null,
            occasionName: null,
            score: 0.9,
            explanation: "Neutral colours work well together.",
            generatedAt: "2026-11-01T10:00:00.000Z",
          }}
          onLike={onLike}
          onDislike={onDislike}
          onSave={onSave}
          onRegenerate={onRegenerate}
        />
      </I18nextProvider>,
    );

    expect(screen.getByText("Easy smart casual")).toBeInTheDocument();
    expect(screen.getByText(/neutral colours/i)).toBeInTheDocument();
    expect(screen.getByText(/swipe to find/i)).toBeInTheDocument();

    await user.click(screen.getByText("Details & more options"));
    await user.click(screen.getByRole("button", { name: /like/i }));
    await user.click(screen.getByRole("button", { name: /not for me/i }));
    await user.click(screen.getByRole("button", { name: /save/i }));
    await user.click(screen.getByRole("button", { name: /regenerate/i }));

    expect(onLike).toHaveBeenCalledOnce();
    expect(onDislike).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledOnce();
    expect(onRegenerate).toHaveBeenCalledOnce();
  });

  it("supports non-swipeable cards without style chips", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <OutfitCard
          swipeable={false}
          recommendation={{
            id: "00000000-0000-4000-8000-000000000011",
            outfit: {
              id: "00000000-0000-4000-8000-000000000012",
              name: null,
              description: null,
              style: null,
              createdAt: "2026-11-01T10:00:00.000Z",
              items: [
                {
                  clothingItemId: "00000000-0000-4000-8000-000000000013",
                  role: "shoes",
                  position: 0,
                  item: undefined,
                },
              ],
            },
            recommendationType: "daily",
            occasionId: null,
            occasionName: null,
            score: 0.5,
            explanation: "Fallback item labels.",
            generatedAt: "2026-11-01T10:00:00.000Z",
          }}
        />
      </I18nextProvider>,
    );

    expect(screen.getByText(/fallback item labels/i)).toBeInTheDocument();
    expect(screen.getByText("00000000")).toBeInTheDocument();
  });
});
