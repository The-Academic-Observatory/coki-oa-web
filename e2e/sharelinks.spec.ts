import { expect, test } from "@playwright/test";

// Packages for checking clipboard strings
import assert from 'assert';
var ReadFrom = new (require('readfrom'))();


test("Should check that the share popover window opens", async ({
  page,
  isMobile,
}) => {

  await page.goto("/");

  // Nagivate to a page with the share button
  await page.locator("tr[data-test='MLI'] > td:first-of-type > a").click();
  
  if (isMobile) {
        
    // Click on the text of the Share button
    const shareButton = page.locator("div[data-test='Mobile Share Button']")
    await shareButton.locator("p", {hasText: "Share" }).click()
    
    // Make sure that the popover has expanded
    await expect(shareButton.locator("button[data-test='Popover Share button']") ).toHaveAttribute("aria-expanded", "true");

  } else {
  
    // Click on the text of the Share button
    const shareButton = page.locator("div[data-test='Desktop Share Button']")
    await shareButton.locator("p", {hasText: "Share" }).click()
    
    // Make sure that the popover has expanded
    await expect(shareButton.locator("button[data-test='Popover Share button']") ).toHaveAttribute("aria-expanded", "true");
  }

});

test("Should check that copy link button actually copys link to clipboard", async ({
  page,
  isMobile,
}) => {

  await page.goto("/");

  // Nagivate to a page with the share button
  await page.locator("tr[data-test='MLI'] > td:first-of-type > a").click();
  
  if (isMobile) {
    
    // Locate popover panel
    const sharePopoverPanel = page.locator("section[data-test='Mobile share popover panel']");

    // Click on the text of the Share button - needs it to appear on the page
    const shareButton = page.locator("div[data-test='Mobile Share Button']")
    await shareButton.locator("p", {hasText: "Share" }).click()

    // Click on the copy link button
    await sharePopoverPanel.locator("button[id='copy-link-button']").click();

  } else {

    // Locate popover panel
    const sharePopoverPanel = page.locator("section[data-test='Desktop share popover panel']");

    // Click on the text of the Share button - needs it to appear on the page
    const shareButton = page.locator("div[data-test='Desktop Share Button']")
    await shareButton.locator("p", {hasText: "Share" }).click()

    // Click on the copy link button
    await sharePopoverPanel.locator("button[id='copy-link-button']").click();

  }

  // Read from clipboard and ensure it's the correct url that's copied.
  await ReadFrom.clipboard().then((data: string) => {
    assert.equal(data, "https://open.coki.ac/country/MLI");
  })

});

test("Should check social share links are present on popover panel", async ({
  page,
  isMobile,
}) => {

  await page.goto("/");

  // Nagivate to a page with the share button
  await page.locator("tr[data-test='MLI'] > td:first-of-type > a").click();
  
  // Popover panels are hidden depending if they are mobile or not and are not located after the share button. 

  if (isMobile) {
        
    // Check that share links are present
    const sharePopoverPanel = page.locator("section[data-test='Mobile share popover panel']");

    const facebookLink = sharePopoverPanel.locator("a[data-test='facebook']");
    const twitterLink = sharePopoverPanel.locator("a[data-test='twitter']");
    const linkedinLink = sharePopoverPanel.locator("a[data-test='linkedin']");

    // Click on the text of the Share button - needs it to appear on the page?
    const shareButton = page.locator("div[data-test='Mobile Share Button']")
    await shareButton.locator("p", {hasText: "Share" }).click()
    
    await expect(facebookLink).toHaveAttribute("href", 'https://www.facebook.com/sharer/sharer.php?u=https://open.coki.ac/country/MLI');
    await expect(twitterLink).toHaveAttribute("href", 'https://twitter.com/intent/tweet?text=Open%20Access%20Research%20Performance%20for%20Mali%0A&url=https://open.coki.ac/country/MLI');
    await expect(linkedinLink).toHaveAttribute("href", 'https://www.linkedin.com/shareArticle?mini=true&url=https://open.coki.ac/country/MLI');

  } else {
  
    // Check that share links are present
    const sharePopoverPanel = page.locator("section[data-test='Desktop share popover panel']");

    const facebookLink = sharePopoverPanel.locator("a[data-test='facebook']");
    const twitterLink = sharePopoverPanel.locator("a[data-test='twitter']");
    const linkedinLink = sharePopoverPanel.locator("a[data-test='linkedin']");

    // Click on the text of the Share button - needs it to appear on the page?
    const shareButton = page.locator("div[data-test='Desktop Share Button']")
    await shareButton.locator("p", {hasText: "Share" }).click()
    
    await expect(facebookLink).toHaveAttribute("href", 'https://www.facebook.com/sharer/sharer.php?u=https://open.coki.ac/country/MLI');
    await expect(twitterLink).toHaveAttribute("href", 'https://twitter.com/intent/tweet?text=Open%20Access%20Research%20Performance%20for%20Mali%0A&url=https://open.coki.ac/country/MLI');
    await expect(linkedinLink).toHaveAttribute("href", 'https://www.linkedin.com/shareArticle?mini=true&url=https://open.coki.ac/country/MLI');
  }

});

