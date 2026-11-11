import type { Recommendation } from "@closet/shared";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CollectionPicker } from "@/features/collection-picker/collection-picker.js";
import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

const recommendation: Recommendation = {
  id: "00000000-0000-4000-8000-000000000001",
  outfit: {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Sunday look",
    description: null,
    style: null,
    items: [],
    createdAt: "2026-11-01T10:00:00.000Z",
  },
  recommendationType: "daily",
  occasionId: null,
  occasionName: null,
  score: 1,
  explanation: "Easy layers",
  generatedAt: "2026-11-01T10:00:00.000Z",
};
const api = createMockApiClient();
vi.mock("@/shared/hooks/use-api-client.js", () => ({ useApiClient: () => api }));
beforeEach(async () => {
  await initI18n();
  await i18n.changeLanguage("en-GB");
  vi.clearAllMocks();
});
describe("collection quick creation", () => {
  it("requires only a name and preserves the draft after a failed save", async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();
    vi.mocked(api.createCollection)
      .mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValueOnce({
        collection: {
          id: "00000000-0000-4000-8000-000000000003",
          name: "Weekends",
          description: "",
          occasion: "",
          season: "any",
          color: "forest",
          count: 1,
          createdAt: "2026-11-01T10:00:00.000Z",
        },
      });
    render(
      <I18nextProvider i18n={i18n}>
        <CollectionPicker
          recommendation={recommendation}
          action="like"
          onClose={vi.fn()}
          onSaved={onSaved}
        />
      </I18nextProvider>,
    );
    await user.click(await screen.findByRole("button", { name: /new collection/i }));
    const submit = screen.getByRole("button", { name: /create & save outfit/i });
    expect(submit).toBeDisabled();
    await user.type(screen.getByRole("textbox", { name: /collection name/i }), "Weekends");
    await user.click(submit);
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /collection name/i })).toHaveValue("Weekends");
    expect(onSaved).not.toHaveBeenCalled();
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);
    await waitFor(() =>
      expect(onSaved).toHaveBeenCalledWith("Weekends", "00000000-0000-4000-8000-000000000003"),
    );
    expect(api.createCollection).toHaveBeenLastCalledWith({
      name: "Weekends",
      description: "",
      occasion: "",
      season: "any",
      color: "forest",
      recommendationId: recommendation.id,
      action: "like",
    });
  });
});
