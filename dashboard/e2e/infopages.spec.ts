import { expect, test } from "@playwright/test";

test("Should navigate to the licenses page", async ({ page, isMobile }) => {
  await page.goto("/licenses/");
  await page.waitForURL("/licenses/");
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

  await expect(page).toHaveURL("/licenses/");
  await expect(page.locator("h1")).toContainText("Third Party Licenses");
});
