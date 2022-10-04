import { expect, test } from "@playwright/test";

test("Resolve Australia from the country filtering", async ({ page, isMobile }) => {
  const route = "/";
  await page.goto(route);
  await expect(page).toHaveURL(route);

    // Confirm it can find one of the first contries in the unfiltered list
    await expect(page.locator("div[class='chakra-stack css-84zodg']", {hasText: 'Indonesia'})).toContainText('Indonesia');

  if (isMobile) {

    // Navigate to correct filtering section for the div that holds the filter box for Mobile
    await page.locator("div[class='chakra-modal__body css-cm4awq]'").locator("button[data-test='region-accordion-button']", {hasText: 'Region'}).click();

    // Mark Oceania checkbox as true
    await page.check("input[id='Oceania']")
    
    // Make sure panels are working by having the panel open by marking Oceania as checked
    const pageLocatorContent = page.locator("span[class='chakra-checkbox__label css-1y69cvc']").locator("p[class='chakra-text css-0']", { hasText: 'Australia'});
    await expect(pageLocatorContent).toContainText('Australia and New Zealand');

    // Expect that Australia and New Zealand checked is true
    expect(await page.isChecked("input[id='Australia and New Zealand']")).toBeTruthy();

    // Locate the "Apply" button
    const mobileApplyDiv = page.locator("div[class='css-v9b9hc']")
    await mobileApplyDiv.locator("button[type='submit']", {hasText: 'Apply'}).click();

  } else {

    // Navigate to correct filtering section for the div that holds the filter box for Desktop
    await page.locator("div[class='css-g4elsx']").locator("button[data-test='region-accordion-button']", {hasText: 'Region'}).click();

    // Mark Oceania checkbox as true
    await page.check("input[id='Oceania']")

    // Make sure panels are working by having the panel open by marking Oceania as checked
    const pageLocatorContent = page.locator("span[class='chakra-checkbox__label css-1y69cvc']").locator("p[class='chakra-text css-0']", { hasText: 'Australia'});
    await expect(pageLocatorContent).toContainText('Australia and New Zealand');

    // Expect that Australia and New Zealand checked is true
    expect(await page.isChecked("input[id='Australia and New Zealand']")).toBeTruthy();

    // Locate the "Apply" button
    const desktopApplyDiv = page.locator("div[class='css-g4elsx']")
    await desktopApplyDiv.locator("button[type='submit']", {hasText: 'Apply'}).click();
  }

  // Expect to see Australia in the list of countries after the filtering has been applied.
  await expect(page.locator("div[class='chakra-stack css-84zodg']", {hasText: 'Australia'})).toContainText('Australia');

});

test("Resolve Australian Astronomical Observatory from the institution filtering", async ({ page, isMobile }) => {
  const route = "/";
  await page.goto(route);
  await expect(page).toHaveURL(route);

  // To have the institution button clicked to see the list of instititions
  await page.locator("button[data-test='tab-institution']").click();

  // Confirm it worked by finding first one in list without any filtering
  await expect(page.locator("div[class='chakra-stack css-84zodg']", {hasText: 'Science Council of Japan'})).toContainText('Science Council of Japan');

  if (isMobile) {

    // Navigate to correct filtering section for the div that holds the filter box for Mobile
    await page.locator("div[class='chakra-modal__body css-cm4awq']").locator("button[data-test='region-accordion-button']", {hasText: 'Region'}).click();

    // Mark Oceania checkbox as true
    await page.check("input[id='Oceania']")
    
    // Make sure panels are working by having the panel open by marking Oceania as checked
    const pageLocatorContent = page.locator("span[class='chakra-checkbox__label css-1y69cvc']").locator("p[class='chakra-text css-0']", { hasText: 'Australia'});
    await expect(pageLocatorContent).toContainText('Australia and New Zealand');

    // Expect that Australia and New Zealand checked is true
    await expect(page.isChecked("input[id='Australia and New Zealand']")).toBeTruthy();

    // Locate the "Apply" button
    const mobileApplyDiv = page.locator("div[class='css-v9b9hc']")
    await mobileApplyDiv.locator("button[type='submit']", {hasText: 'Apply'}).click();

  } else {

    // Navigate to correct filtering section for the div that holds the filter box for Desktop
    await page.locator("div[class='css-g4elsx']").locator("button[data-test='region-accordion-button']", {hasText: 'Region'}).click();

    // Mark Oceania checkbox as true
    await page.check("input[id='Oceania']")

    // Make sure panels are working by having the panel open by marking Oceania as checked
    const pageLocatorContent = page.locator("span[class='chakra-checkbox__label css-1y69cvc']").locator("p[class='chakra-text css-0']", { hasText: 'Australia'});
    await expect(pageLocatorContent).toContainText('Australia and New Zealand');

    // Expect that Australia and New Zealand checked is true
    await expect(page.isChecked("input[id='Australia and New Zealand']")).toBeTruthy();

    // Locate the "Apply" button
    const desktopApplyDiv = page.locator("div[class='css-g4elsx']")
    await desktopApplyDiv.locator("button[type='submit']", {hasText: 'Apply'}).click();
  }

  // Expect to see Australian Astronomical Observatory in the list of institutions after the filtering has been applied.
  await expect(page.locator("div[class='chakra-stack css-84zodg']", {hasText: 'Australian Astronomical Observatory'})).toContainText('Australian Astronomical Observatory');

});