import { expect, test } from "@playwright/test";

test.describe("closet foundation shell", () => {
  test("home renders and locale switches to RTL", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: /Get started|شروع کن/ })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Loading Closet…")).toHaveCount(0);

    const switcher = page.getByRole("button", { name: /فارسی|English/ });
    await switcher.click();

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "fa-IR");
  });

  test("guest mode can open shell routes", async ({ page }) => {
    await page.goto("/today", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Today|امروز/ })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page).toHaveURL(/\/today/);
  });

  test("sign-in route is reachable", async ({ page }) => {
    await page.goto("/sign-in", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(
      page.getByText(/Clerk|sign in|ورود|configure|set up|VITE_CLERK_PUBLISHABLE_KEY/i).first(),
    ).toBeVisible({
      timeout: 15_000,
    });
  });
});
