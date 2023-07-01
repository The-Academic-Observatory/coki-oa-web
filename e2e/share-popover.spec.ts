import { expect, test } from "@playwright/test";

test("Should check that the share popover window opens", async ({ page, isMobile }) => {
  // Get platform
  let platform = "desktop";
  if (isMobile) {
    platform = "mobile";
  }

  await page.goto("/");

  // Nagivate to a page with the share button
  await page.locator("tr[data-test='IDN'] > td:first-of-type > a").click();

  // Click the share button
  await page.locator(`button[data-test="${platform}-share-button"]`).click();

  // Make sure that the popover has expanded
  await expect(page.locator(`section[data-test="${platform}-share-popover-content"]`)).toBeVisible();
});

test("Should check that social share links have the correct URLs", async ({ page, isMobile }) => {
  // Get platform
  let platform = "desktop";
  if (isMobile) {
    platform = "mobile";
  }

  await page.goto("/");

  // Nagivate to a page with the share button
  await page.locator("tr[data-test='IDN'] > td:first-of-type > a").click();

  // Click the share button to open the popup
  await page.locator(`button[data-test="${platform}-share-button"]`).click();

  // Find share popover
  const sharePopoverContent = page.locator(`section[data-test='${platform}-share-popover-content']`);

  // Check that hrefs are set to correct values for each sharing link
  const twitter = await sharePopoverContent.locator(`a[data-test='share-twitter']`);
  expect(await twitter.getAttribute("href")).toEqual(
    "https://twitter.com/intent/tweet?text=Check%20out%20the%20Open%20Access%20statistics%20for%20Indonesia%20on%20the%20COKI%20Open%20Access%20Dashboard%3A&url=http%3A%2F%2Flocalhost%3A3000%2Fcountry%2FIDN%2F&hashtags=OpenAccess,COKI&via=COKIproject",
  );

  const facebook = await sharePopoverContent.locator(`a[data-test='share-facebook']`);
  expect(await facebook.getAttribute("href")).toEqual(
    "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Flocalhost%3A3000%2Fcountry%2FIDN%2F",
  );

  const linkedin = await sharePopoverContent.locator(`a[data-test='share-linkedin']`);
  expect(await linkedin.getAttribute("href")).toEqual(
    "https://www.linkedin.com/shareArticle?mini=true&url=http%3A%2F%2Flocalhost%3A3000%2Fcountry%2FIDN%2F",
  );
});

test("Should check that copy link button actually copies link to clipboard", async ({
  page,
  isMobile,
  browserName,
}) => {
  test.skip(browserName === "webkit", "This test does not run on Safari");
  test.skip(browserName === "firefox", "This test does not run for Firefox");

  // Get platform
  let platform = "desktop";
  if (isMobile) {
    platform = "mobile";
  }

  // Go to homepage
  await page.goto("/");

  // Navigate to a page with the share button
  await page.locator("tr[data-test='IDN'] > td:first-of-type > a").click();

  // Click on the share button
  await page.locator(`button[data-test="${platform}-share-button"]`).click();

  // Set a new value in the clipboard
  await page.evaluate(() => navigator.clipboard.writeText("Not a link"));

  // Click share link button
  const sharePopoverContent = page.locator(`section[data-test='${platform}-share-popover-content']`);
  await sharePopoverContent.locator(`button[data-test='share-link']`).click();

  // Check that clipboard content is the URL of the page
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toEqual(page.url());
});
