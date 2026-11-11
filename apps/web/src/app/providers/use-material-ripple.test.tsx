import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useMaterialRipple } from "@/app/providers/use-material-ripple.js";

function Demo({ disabled = false }: { disabled?: boolean }) {
  useMaterialRipple();
  return (
    <button className="md-state-layer" disabled={disabled}>
      Save
    </button>
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("Material ink feedback", () => {
  it("responds to keyboard activation and removes ink after the animation", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const { unmount } = render(<Demo />);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(document.querySelector(".md-ripple")).toHaveAttribute("aria-hidden", "true");
    vi.advanceTimersByTime(650);
    expect(document.querySelector(".md-ripple")).toBeNull();
    unmount();
  });
  it("respects reduced motion and disabled controls", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const { rerender } = render(<Demo />);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(document.querySelector(".md-ripple")).toBeNull();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    rerender(<Demo disabled />);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(document.querySelector(".md-ripple")).toBeNull();
  });
});
