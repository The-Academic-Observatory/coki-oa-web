import { expect, test } from "@playwright/test";

test("Should navigate to Country: Indonesia", async ({ page }) => {
  const route = "/";
  await page.goto(route);
  await expect(page).toHaveURL(route);

  // Click Indonesia
  await page.locator("tr[data-test='IDN'] > td:first-of-type > a").click();

  await expect(page).toHaveURL("/country/IDN/");
  await expect(page.locator("h1")).toContainText("Indonesia");
});

test("Should navigate to Institution: Creative Research Enterprises (United States)", async ({ page }) => {
  const route = "/";
  await page.goto(route);
  await expect(page).toHaveURL(route);

  // Click Institution tab
  await page.locator("button[data-test='tab-institution']").click();

  // Click 04v9m3h35
  await page.locator("tr[data-test='0579h7m09'] > td:first-of-type > a").click();

  await expect(page).toHaveURL("/institution/04v9m3h35/");
  await expect(page.locator("h1")).toContainText("Creative Research Enterprises (United States)");
});
