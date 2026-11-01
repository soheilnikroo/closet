import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: () => ({
    needRefresh: [false, vi.fn()],
    offlineReady: [false, vi.fn()],
    updateServiceWorker: vi.fn(),
  }),
}));

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal();
  if (typeof actual !== "object" || actual === null) {
    return { useReducedMotion: () => false };
  }
  return {
    ...actual,
    useReducedMotion: () => false,
  };
});
