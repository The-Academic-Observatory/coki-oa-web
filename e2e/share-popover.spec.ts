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

test("Should check that social share links open new tabs with correct URLs", async ({ page, isMobile, context }) => {
  // Get platform
  let platform = "desktop";
  if (isMobile) {
    platform = "mobile";
  }

  await page.goto("/");

  // Nagivate to a page with the share button
  await page.locator("tr[data-test='IDN'] > td:first-of-type > a").click();

  const openShareLink = async (dataTest: string) => {
    await page.bringToFront();

    const newTabPromise = new Promise((resolve) => context.once("page", resolve));

    // Click the share button to open the popup
    await page.locator(`button[data-test="${platform}-share-button"]`).click();

    // Click link button
    const sharePopoverContent = page.locator(`section[data-test='${platform}-share-popover-content']`);
    await sharePopoverContent.locator(`button[data-test='${dataTest}']`).click();

    // Return new tab
    const newTab = await newTabPromise;
    await newTab.waitForTimeout(1000);
    await newTab.bringToFront();

    return newTab;
  };

  // Check that correct tabs are opened
  let newTab = await openShareLink("share-twitter");
  expect(newTab.url()).toEqual(
    "https://twitter.com/intent/tweet?text=Check%20out%20the%20Open%20Access%20statistics%20for%20Indonesia%20on%20the%20COKI%20Open%20Access%20Dashboard%3A&url=http%3A%2F%2Flocalhost%3A3000%2Fcountry%2FIDN%2F&hashtags=OpenAccess,COKI&via=COKIproject",
  );
  await newTab.close();

  newTab = await openShareLink("share-linkedin");
  let params = new URLSearchParams(new URL(newTab.url()).search);
  expect(params.get("session_redirect")).toEqual(
    "https://www.linkedin.com/shareArticle?mini=true&url=http%3A%2F%2Flocalhost%3A3000%2Fcountry%2FIDN%2F",
  );
  await newTab.close();

  newTab = await openShareLink("share-facebook");
  params = new URLSearchParams(new URL(newTab.url()).search);
  let expected = "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Flocalhost%3A3000%2Fcountry%2FIDN%2F";
  if (isMobile) {
    expected = "https://m.facebook.com/sharer/sharer.php?u=http%3A%2F%2Flocalhost%3A3000%2Fcountry%2FIDN%2F";
  }
  expect(params.get("next")).toEqual(expected);
  await newTab.close();
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
