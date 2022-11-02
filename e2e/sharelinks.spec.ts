import { expect, test } from "@playwright/test";
import msg from "@playwright/test";

// Packages for checking clipboard strings
import assert from 'assert';
var ncp = require('node-clipboardy');

test("Should check that the share popover window opens", async ({
  page,
  isMobile,
}) => {

  await page.goto("/");

  // Nagivate to a page with the share button
  await page.locator("tr[data-test='MLI'] > td:first-of-type > a").click();
  
  if (isMobile) {
        
    // Click on the text of the Share button
    const shareButton = page.locator("div[data-test='mobile-share-button']");
    await shareButton.locator('button[data-test="mobile-popover-share-button"]').locator("svg").click()
    
    // Make sure that the popover has expanded
    await expect(shareButton.locator('div[data-test="popover-trigger-div"]')).toHaveAttribute("aria-expanded", "true");

  } else {
  
    // Click on the text of the Share button
    const shareButton = page.locator("div[data-test='desktop-share-button']");
    await shareButton.locator('button[data-test="desktop-popover-share-button"]').locator("p", {hasText: "Share" }).click()
    
    // Make sure that the popover has expanded
    await expect(shareButton.locator('div[data-test="popover-trigger-div"]')).toHaveAttribute("aria-expanded", "true");
  }

});

test("Should check that copy link button actually copys link to clipboard", async ({
  page,
  isMobile,
}) => {

  await page.goto("/");

  // Nagivate to a page with the share button
  await page.locator("tr[data-test='MLI'] > td:first-of-type > a").click();
  
  // String in clipboard that will be replaced with link from the copy link button.
  await ncp.write('NA');

  if (isMobile) {
    
    // Locate popover panel
    const sharePopoverPanel = page.locator("section[data-test='mobile-share-popover-panel']");

    // Click on the text of the Share button - needs it to appear on the page
    const shareButton = page.locator("div[data-test='mobile-share-button']").locator('button[data-test="mobile-popover-share-button"]');
    await shareButton.locator("svg").click()

    // Click on the copy link button
    await sharePopoverPanel.locator("button[id='copy-link-button']").click();

  } else {

    // Locate popover panel
    const sharePopoverPanel = page.locator("section[data-test='desktop-share-popover-panel']");

    // Click on the text of the Share button - needs it to appear on the page
    const shareButton = page.locator("div[data-test='desktop-share-button']").locator('button[data-test="desktop-popover-share-button"]');
    await shareButton.locator("p", {hasText: "Share" }).click()

    // Click on the copy link button
    await sharePopoverPanel.locator("button[id='copy-link-button']").click();
  }
  
  async function spyClipboard(page) {
    const log: string[] = []
  
    await page.exposeFunction('logValue', (value: string) => log.push(value))
    await page.addInitScript(() => {
      const originalImplementation = window.navigator.clipboard.writeText
      window.navigator.clipboard.writeText = async (...args) => {
        // @ts-expect-error Injected function
        logValue(args[0])
        await originalImplementation(...args)
      }
    })
  
    return log
  }
  const clipboardCalls = await spyClipboard(page);
  await expect(clipboardCalls[0]).toEqual('https://open.coki.ac/country/MLI')

  // Read from clipboard and ensure the correct URL has been copied.
  //const data = await ncp.read();
  //assert.equal(data, "https://open.coki.ac/country/MLI");



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
    const sharePopoverPanel = page.locator("section[data-test='mobile-share-popover-panel']");

    const facebookLink = sharePopoverPanel.locator("a[data-test='facebook']");
    const twitterLink = sharePopoverPanel.locator("a[data-test='twitter']");
    const linkedinLink = sharePopoverPanel.locator("a[data-test='linkedin']");

    // Click on the text of the Share button - needs it to appear on the page?
    const shareButton = page.locator("div[data-test='mobile-share-button']").locator('button[data-test="mobile-popover-share-button"]');
    await shareButton.locator("svg").click()
    
    await expect(facebookLink).toHaveAttribute("href", 'https://www.facebook.com/sharer/sharer.php?u=https://open.coki.ac/country/MLI');
    await expect(twitterLink).toHaveAttribute("href", 'https://twitter.com/intent/tweet?text=Open%20Access%20Research%20Performance%20for%20Mali%0A&url=https://open.coki.ac/country/MLI');
    await expect(linkedinLink).toHaveAttribute("href", 'https://www.linkedin.com/shareArticle?mini=true&url=https://open.coki.ac/country/MLI');

  } else {
  
    // Check that share links are present
    const sharePopoverPanel = page.locator("section[data-test='desktop-share-popover-panel']");

    const facebookLink = sharePopoverPanel.locator("a[data-test='facebook']");
    const twitterLink = sharePopoverPanel.locator("a[data-test='twitter']");
    const linkedinLink = sharePopoverPanel.locator("a[data-test='linkedin']");

    // Click on the text of the Share button - needs it to appear on the page?
    const shareButton = page.locator("div[data-test='desktop-share-button']").locator('button[data-test="desktop-popover-share-button"]');
    await shareButton.locator("p", {hasText: "Share" }).click()
    
    await expect(facebookLink).toHaveAttribute("href", 'https://www.facebook.com/sharer/sharer.php?u=https://open.coki.ac/country/MLI');
    await expect(twitterLink).toHaveAttribute("href", 'https://twitter.com/intent/tweet?text=Open%20Access%20Research%20Performance%20for%20Mali%0A&url=https://open.coki.ac/country/MLI');
    await expect(linkedinLink).toHaveAttribute("href", 'https://www.linkedin.com/shareArticle?mini=true&url=https://open.coki.ac/country/MLI');
  }

});

