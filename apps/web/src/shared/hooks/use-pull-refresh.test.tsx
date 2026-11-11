import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { usePullRefresh } from "@/shared/hooks/use-pull-refresh.js";

function Demo({ refresh }: { refresh: () => Promise<void> }) {
  const node = useRef<HTMLDivElement>(null);
  const state = usePullRefresh(node, refresh);
  return (
    <div ref={node} data-testid="scroll">
      <div data-testid="content">Clothes</div>
      <button
        type="button"
        onClick={() => {
          void state.run();
        }}
      >
        Refresh
      </button>
      <output>{state.refreshing ? "refreshing" : state.result}</output>
    </div>
  );
}
function pull(x = 0, y = 180) {
  const content = screen.getByTestId("content");
  fireEvent.touchStart(content, { touches: [{ clientX: 0, clientY: 0 }] });
  fireEvent.touchMove(content, { touches: [{ clientX: x, clientY: y }], cancelable: true });
  fireEvent.touchEnd(content, { touches: [] });
}
describe("pull to refresh", () => {
  afterEach(cleanup);
  it("refreshes once at the threshold and prevents overlapping requests", async () => {
    let complete!: () => void;
    const refresh = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          complete = resolve;
        }),
    );
    render(<Demo refresh={refresh} />);
    pull();
    pull();
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(screen.getByText("refreshing")).toBeInTheDocument();
    await act(async () => complete());
    expect(screen.getByText("success")).toBeInTheDocument();
  });
  it("ignores short, horizontal, scrolled and cancelled gestures", () => {
    const refresh = vi.fn().mockResolvedValue(undefined);
    render(<Demo refresh={refresh} />);
    pull(0, 40);
    pull(200, 30);
    screen.getByTestId("scroll").scrollTop = 20;
    pull();
    screen.getByTestId("scroll").scrollTop = 0;
    const content = screen.getByTestId("content");
    fireEvent.touchStart(content, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(content, { touches: [{ clientX: 0, clientY: 200 }], cancelable: true });
    fireEvent.touchCancel(content);
    fireEvent.touchEnd(content, { touches: [] });
    expect(refresh).not.toHaveBeenCalled();
  });
  it("keeps content available when refreshing fails", async () => {
    render(<Demo refresh={vi.fn().mockRejectedValue(new Error("offline"))} />);
    await act(async () => pull());
    expect(screen.getByText("error")).toBeInTheDocument();
    expect(screen.getByText("Clothes")).toBeInTheDocument();
  });
});
