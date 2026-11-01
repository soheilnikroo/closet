import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

import { OnboardingFlow } from "./onboarding-flow.js";

const mockApi = createMockApiClient();

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

describe("OnboardingFlow full path", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
    vi.clearAllMocks();
  });

  it("selects city and seeds sample catalog through first outfit feedback", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <OnboardingFlow onComplete={onComplete} />
      </I18nextProvider>,
    );

    await user.click(screen.getByRole("button", { name: /get started/i }));
    expect(await screen.findByText(/which styles/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^minimal$/i }));
    await user.click(screen.getByRole("button", { name: /^continue$/i }));

    expect(await screen.findByText(/which city/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^tehran$/i }));
    await user.click(screen.getByRole("button", { name: /^continue$/i }));

    expect(await screen.findByText(/add a few clothes/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /use sample/i }));

    expect(await screen.findByText(/your first outfit/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^like$/i }));
    expect(onComplete).toHaveBeenCalled();
  });
});
