import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BottomSheet } from "./bottom-sheet.js";

describe("BottomSheet", () => {
  it("renders nothing meaningful when closed", () => {
    render(
      <BottomSheet open={false} title="Ask stylist" onClose={vi.fn()}>
        <p>Hidden sheet</p>
      </BottomSheet>,
    );
    expect(screen.queryByText("Hidden sheet")).not.toBeInTheDocument();
  });

  it("renders content when open and closes", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <BottomSheet open title="Ask stylist" onClose={onClose}>
        <p>Hello sheet</p>
      </BottomSheet>,
    );

    expect(screen.getByText("Hello sheet")).toBeInTheDocument();
    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    const closeButton = closeButtons.at(-1);
    expect(closeButton).toBeTruthy();
    if (closeButton) {
      await user.click(closeButton);
    }
    expect(onClose).toHaveBeenCalled();
  });
});
