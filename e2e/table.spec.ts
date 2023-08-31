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

test("Should navigate to Institution: Science Council of Japan", async ({ page }) => {
  const route = "/";
  await page.goto(route);
  await expect(page).toHaveURL(route);

  // Click Institution tab
  await page.locator("button[data-test='tab-institution']").click();

  // Click OSTI
  await page.locator("tr[data-test='01pp5tt34'] > td:first-of-type > a").click();

  await expect(page).toHaveURL("/institution/01pp5tt34/");
  await expect(page.locator("h1")).toContainText("Science Council of Japan");
});
