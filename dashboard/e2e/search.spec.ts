import { expect, test } from "@playwright/test";

test("Should search for Curtin", async ({ page, isMobile }) => {
  const route = "/";
  await page.goto(route);
  await expect(page).toHaveURL(route);

  if (isMobile) {
    // On mobile: click search box and enter into searchInputMobile
    await page.waitForSelector("button[data-test='search']");
    await page.locator("button[data-test='search']").click();
    await page.fill("input[data-test='searchInputMobile']", "Curtin");
    await page.locator("div[data-test='searchResultsMobile'] > div:first-of-type > a").click();
  } else {
    // On desktop: enter into
    await page.fill("input[data-test='searchInputDesktop']", "Curtin");
    await page.locator("div[data-test='searchResultsDesktop'] > div:first-of-type > a").click();
  }

  await expect(page).toHaveURL("/institution/02n415q13/");
  await expect(page.locator("h1")).toContainText("Curtin University");
});
