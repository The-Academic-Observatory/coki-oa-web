import { expect, test } from "@playwright/test";

test("Should navigate to Country: MALI", async ({ page }) => {
  const route = "/";
  await page.goto(route);
  await expect(page).toHaveURL(route);

  // Click Mali
  await page.locator("tr[data-test='MLI'] > td:first-of-type > a").click();

  await expect(page).toHaveURL("/country/MLI/");
  await expect(page.locator("h1")).toContainText("Mali");
});

test("Should navigate to Institution: Office of Scientific and Technical Information", async ({
  page,
}) => {
  const route = "/";
  await page.goto(route);
  await expect(page).toHaveURL(route);

  // Click Institution tab
  await page.locator("button[data-test='tab-institution']").click();

  // Click OSTI
  await page
    .locator("tr[data-test='031478740'] > td:first-of-type > a")
    .click();

  await expect(page).toHaveURL("/institution/031478740/");
  await expect(page.locator("h1")).toContainText(
    "Office of Scientific and Technical Information"
  );
});
