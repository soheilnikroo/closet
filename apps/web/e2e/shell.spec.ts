import { expect, test } from "@playwright/test";

test.describe("closet foundation shell", () => {
  test("home renders and locale switches to RTL", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: /Get started|شروع کن/ })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Loading Closet…")).toHaveCount(0);

    const switcher = page.getByRole("button", { name: /فارسی|English/ });
    await switcher.click();

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "fa-IR");
  });

  test("protected shell routes redirect guests to sign-in", async ({ page }) => {
    await page.goto("/today");

    await expect(page).toHaveURL(/\/sign-in/, { timeout: 15_000 });
  });

  test("sign-in route is reachable", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page).toHaveURL(/\/sign-in/);
    // Clerk SignIn mounts under .cl-rootBox when keys are configured
    await expect(page.locator(".cl-rootBox").first()).toBeVisible({ timeout: 15_000 });
  });
});
