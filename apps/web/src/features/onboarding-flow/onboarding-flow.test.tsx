import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OnboardingFlow } from "@/features/onboarding-flow/onboarding-flow.js";
import { i18n, initI18n } from "@/shared/i18n/i18n.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

vi.mock("@/shared/hooks/use-api-client.js", () => ({
  useApiClient: () => mockApi,
}));

const mockApi = createMockApiClient();

describe("OnboardingFlow", () => {
  beforeEach(async () => {
    await initI18n();
    await i18n.changeLanguage("en-GB");
    vi.clearAllMocks();
  });

  it("walks through welcome to styles and can skip city", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <OnboardingFlow onComplete={onComplete} />
      </I18nextProvider>,
    );

    expect(screen.getByText(/personal AI stylist/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /get started/i }));
    expect(await screen.findByText(/which styles/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^casual$/i }));
    await user.click(screen.getByRole("button", { name: /^continue$/i }));
    expect(await screen.findByText(/which city/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^skip$/i }));
    expect(await screen.findByText(/add a few clothes/i)).toBeInTheDocument();
  });
});
