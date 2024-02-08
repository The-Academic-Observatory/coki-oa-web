import { expect, Page, test } from "@playwright/test";

async function testInfoPageNavigation(path: string, expectedTitle: string, page: Page) {
  await page.goto(path);
  await page.waitForURL(path);
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

  await expect(page).toHaveURL(path);
  await expect(page.locator("h1")).toContainText(expectedTitle);
}

test("Should navigate to the open page", async ({ page, isMobile }) => {
  await testInfoPageNavigation("/open/", "Open Access", page);
});

test("Should navigate to the data page", async ({ page, isMobile }) => {
  await testInfoPageNavigation("/data/", "Data", page);
});

test("Should navigate to the about page", async ({ page, isMobile }) => {
  await testInfoPageNavigation("/about/", "About", page);
});

test("Should navigate to the contact page", async ({ page, isMobile }) => {
  await testInfoPageNavigation("/contact/", "Contact", page);
});

test("Should navigate to the licenses page", async ({ page, isMobile }) => {
  await testInfoPageNavigation("/licenses/", "Third Party Licenses", page);
});
