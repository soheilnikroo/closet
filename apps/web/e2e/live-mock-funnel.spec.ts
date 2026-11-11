import { expect, test } from "@playwright/test";

test("complete local mock-auth closet funnel", async ({ page, request }) => {
  test.skip(process.env["CLOSET_LIVE_E2E"] !== "1", "Requires the local mock API and PostgreSQL");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Try a ready-made closet" }).click();
  await expect(page).toHaveURL(/\/today/);
  await expect(page.getByText("Swap a piece").first()).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("closet-today.png"), fullPage: true });
  await page.getByText("Swap a piece").first().click();
  await page.locator("details").first().getByRole("button").first().click();
  await expect(page.getByText("A fresh combination, just for you.")).toBeVisible();
  await page.getByRole("button", { name: "Preview this look" }).first().click();
  await expect(page.getByRole("img", { name: "Illustrated outfit on a mannequin" })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("closet-preview.png"), fullPage: true });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Ask stylist" }).click();
  await page.getByRole("textbox").fill("A minimal outfit for work without jeans");
  await page.getByRole("button", { name: "Ask", exact: true }).click();
  await expect(page.getByRole("dialog").getByText("Swap a piece").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "Discover" }).click();
  await expect(page.getByRole("heading", { name: "A little inspiration" })).toBeVisible();
  const save = page.getByRole("button", { name: "Save idea", exact: true }).first();
  if (await save.count()) {
    await save.click();
  }
  await expect(page.getByRole("button", { name: "Saved", exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Saved", exact: true }).first()).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("closet-discover.png"), fullPage: true });
  await page.getByRole("button", { name: "I own something similar" }).first().click();
  await expect(page.getByRole("dialog", { name: "Add clothing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What color is it?" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "You", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Make it yours" })).toBeVisible();
  await page.getByLabel("Favourite fit").selectOption("oversized");
  await page.getByRole("button", { name: "Save my preferences" }).click();
  await expect(page.getByText("Your preferences are saved.")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Favourite fit")).toHaveValue("oversized");
  await page.getByLabel("Language").selectOption("fa-IR");
  await page.getByRole("button", { name: "Save my preferences" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.screenshot({ path: test.info().outputPath("closet-settings-fa.png"), fullPage: true });
  // Restore English for the shared demonstration identity.
  await request.patch("http://127.0.0.1:8080/v1/users/me/preferences", {
    headers: { Authorization: "Bearer mock:dev-user" },
    data: { locale: "en-GB" },
  });
});
