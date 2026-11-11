import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

import { DemoWelcome } from "./auth-welcome.js";
const api = createMockApiClient();
vi.mock("@/shared/hooks/use-api-client.js", () => ({ useApiClient: () => api }));
function welcome() {
  render(
    <MemoryRouter initialEntries={["/sign-up"]}>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path="/sign-up" element={<DemoWelcome signup redirectTo="/today" />} />
          <Route path="/today" element={<h1>Your closet</h1>} />
        </Routes>
      </I18nextProvider>
    </MemoryRouter>,
  );
}
describe("demo welcome", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await initI18n();
    await i18n.changeLanguage("en-GB");
  });
  afterEach(cleanup);
  it("lets a visitor continue without giving a name", async () => {
    welcome();
    fireEvent.click(screen.getByRole("button", { name: "Explore my closet" }));
    expect(await screen.findByRole("heading", { name: "Your closet" })).toBeInTheDocument();
    expect(api.updateMe).not.toHaveBeenCalled();
  });
  it("saves the optional name before continuing", async () => {
    vi.mocked(api.updateMe).mockResolvedValue({} as Awaited<ReturnType<typeof api.updateMe>>);
    welcome();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: " Alex " } });
    fireEvent.click(screen.getByRole("button", { name: "Explore my closet" }));
    await waitFor(() => expect(api.updateMe).toHaveBeenCalledWith({ displayName: "Alex" }));
    expect(await screen.findByRole("heading", { name: "Your closet" })).toBeInTheDocument();
  });
});
