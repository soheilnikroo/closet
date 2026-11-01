import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

import { StylistChatSheet } from "./stylist-chat-sheet.js";

const mockApi = createMockApiClient();

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

describe("StylistChatSheet", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
    vi.clearAllMocks();
  });

  it("sends a chat message", async () => {
    const user = userEvent.setup();
    render(
      <I18nextProvider i18n={i18n}>
        <StylistChatSheet open onClose={vi.fn()} />
      </I18nextProvider>,
    );

    await user.type(screen.getByRole("textbox"), "University outfit");
    await user.click(screen.getByRole("button", { name: /^ask$/i }));
    expect(await screen.findByText(/here is an idea/i)).toBeInTheDocument();
  });
});
