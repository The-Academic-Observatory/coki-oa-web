import { expect, test } from "@playwright/test";

test("Resolve Australia from the country filtering", async ({ page, isMobile }) => {

  // Get platform
  let platform = "desktop";
  if (isMobile) {
    platform = "mobile";
  }
  
  await page.goto("/");
  
  // Confirm it can find one of the first contries in the unfiltered list
  await expect(page.locator("tr[data-test='IDN']", { hasText: "Indonesia" })).toContainText("Indonesia");

  if (isMobile){ 
    // Click the filtering button for mobile.
    await page.locator("button[data-test='tab-filter-button']").click();
  }
  
  // Navigate to correct filtering section for the div that holds the filter box for Mobile
  await page.locator(`button[data-test='${platform}-country-form.Region & Subregion']`, { hasText: "Region & Subregion" }).click();

  // Mark Oceania checkbox as true
  try { 
    await page.check("input[id='Oceania']", {timeout: 2000}) //timeout in milliseconds
  } catch {
    // Having to click the span area of the checkbox because Safari is a pain.
    const checkboxSpan = page
      .locator("div[data-test='checkbox.region.Oceania']")
      .locator("button[data-test='region.Oceania']")
      .locator("span[class='chakra-checkbox__control css-1x7a2v0']");

    // Delay is needed for the checkboxes to respond.
    await page.waitForTimeout(2000);

    // Position is required to make it click the centre of the span, 16x16 pixels
    await checkboxSpan.click({position: {x: 8, y: 8}});
  }

  // Expect that Australia and New Zealand checked is true
  expect(await page.isChecked("input[type='checkbox'][id='Australia and New Zealand']")).toBeTruthy();

  // Locate the "Apply" button
  await page.locator(`button[data-test='${platform}-country-form.Apply']`, { hasText: "Apply" }).click();

  // Expect to see Australia in the list of countries after the filtering has been applied.
  await expect(page.locator("tr[data-test='AUS']")).toContainText("Australia");

});

test("Resolve Australian Astronomical Observatory from the institution filtering", async ({ page, isMobile }) => {

  // Get platform
  let platform = "desktop";
  if (isMobile) {
    platform = "mobile";
  }
  
  await page.goto("/");

  // To have the institution button clicked to see the list of instititions
  await page.locator("button[data-test='tab-institution']").click();

  // Confirm it can first one in list without any filtering
  await expect(page.locator("tr[data-test='01pp5tt34']", { hasText: "Science Council of Japan" })).toContainText(
    "Science Council of Japan",
  );

  if (isMobile){ 
    // Click the filtering button for mobile.
    await page.locator("button[data-test='tab-filter-button']").click();
  }

  // Navigate to correct filtering section for the div that holds the filter box for Desktop
  await page.locator(`button[data-test='${platform}-institution-form.Region & Subregion']`, { hasText: "Region & Subregion" }).click();

  // Mark Oceania checkbox as true
  try { 
    await page.check("input[id='Oceania']", {timeout: 2000}) //timeout in milliseconds
  } catch {
    // Having to click the span area of the checkbox because Safari is a pain.
    const checkboxSpan = page
      .locator("div[data-test='checkbox.region.Oceania']")
      .locator("button[data-test='region.Oceania']")
      .locator("span[class='chakra-checkbox__control css-1x7a2v0']");

    // Delay is needed for the checkboxes to respond.
    await page.waitForTimeout(2000);

    // Position is required to make it click the centre of the span, 16x16 pixels
    await checkboxSpan.click({position: {x: 8, y: 8}});
  }

  // Expect that Australia and New Zealand checked is true
  await expect(page.isChecked("input[id='Australia and New Zealand']")).toBeTruthy();

  // Locate the "Apply" button
  await page.locator(`button[data-test='${platform}-institution-form.Apply']`, { hasText: "Apply" }).click();

  // Expect to see Australian Astronomical Observatory in the list of institutions after the filtering has been applied.
  await expect(
    page.locator("tr[data-test='030cszc07']", { hasText: "Australian Astronomical Observatory" }),
  ).toContainText("Australian Astronomical Observatory");

});