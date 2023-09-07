import { expect, test } from "@playwright/test";

test("Should navigate to the country tab when clicking on country breadcrumb", async ({ page, isMobile }) => {
  test.skip(isMobile, "This feature is not implemented for Mobile viewports");
  await page.goto("/country/AUS/");
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });
  await page.locator("li a[href='/country/']").click();
  // Check the url
  await expect(page).toHaveURL("/country/");
  // Check the selected tab
  await expect(page.locator("button[data-test='tab-country']")).toHaveAttribute("aria-selected", "true");
  // Check the dashboard text
  await expect(page.locator("h1 + p")).toContainText("Open Access by country");
});

test("Should navigate to the institution tab when clicking on institution breadcrumb", async ({ page, isMobile }) => {
  test.skip(isMobile, "This feature is not implemented for Mobile viewports");
  await page.goto("/institution/02n415q13/");
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });
  await page.locator("li a[href='/institution/']").click();
  // Check the url
  await expect(page).toHaveURL("/institution/");
  // Check the selected tab
  await expect(page.locator("button[data-test='tab-institution']")).toHaveAttribute("aria-selected", "true");
  // Check the dashboard text
  await expect(page.locator("h1 + p")).toContainText("Open Access by institution");
});

test("Should navigate to the country tab when clicking on return to dashboard", async ({ page }) => {
  await page.goto("/country/AUS/");
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

  await page.locator("a[href='/country/'] button").click();
  // Check the url
  await expect(page).toHaveURL("/country/");
  // Check the selected tab
  await expect(page.locator("button[data-test='tab-country']")).toHaveAttribute("aria-selected", "true");
  // Check the dashboard text
  await expect(page.locator("h1 + p")).toContainText("Open Access by country");
});

test("Should navigate to the institution tab when clicking on return to dashboard", async ({ page }) => {
  await page.goto("/institution/02n415q13/");
  await page.locator("a[href='/institution/'] button").click();
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

  // Check the url
  await expect(page).toHaveURL("/institution/");
  // Check the selected tab
  await expect(page.locator("button[data-test='tab-institution']")).toHaveAttribute("aria-selected", "true");
  // Check the dashboard text
  await expect(page.locator("h1 + p")).toContainText("Open Access by institution");
});
