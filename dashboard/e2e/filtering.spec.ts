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

  if (isMobile) {
    // Click the filtering button for mobile.
    await page.locator("button[data-test='tab-filter-button']").click();
  }

  // Get country form
  const form = page.locator(`form[data-test='${platform}-country-form']`);

  // Mark Oceania checkbox as true
  // Have to click on label, which is the parent of the checkbox, rather than input
  await form.locator("label[data-test='Oceania'][type='checkbox']").click();

  // Expect that Australia and New Zealand checked is true
  expect(await form.locator("input[type='checkbox'][id='Australia and New Zealand']").isChecked()).toBeTruthy();

  // Locate the "Apply" button
  await form.locator(`button`, { hasText: "Apply" }).click();

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
  await expect(
    page.locator("tr[data-test='04v9m3h35']", { hasText: "ARC Centre of Excellence for All-sky Astrophysics" }),
  ).toContainText("ARC Centre of Excellence for All-sky Astrophysics");

  if (isMobile) {
    // Click the filtering button for mobile.
    await page.locator("button[data-test='tab-filter-button']").click();
  }

  // Get country form
  const form = page.locator(`form[data-test='${platform}-institution-form']`);

  // Mark Oceania checkbox as true
  // Have to click on label, which is the parent of the checkbox, rather than input
  await form.locator("label[data-test='Oceania'][type='checkbox']").click();

  // Expect that Australia and New Zealand checked is true
  expect(await form.locator("input[type='checkbox'][id='Australia and New Zealand']").isChecked()).toBeTruthy();

  // Locate the "Apply" button
  await form.locator(`button`, { hasText: "Apply" }).click();

  // Expect to see Australian Astronomical Observatory in the list of institutions after the filtering has been applied.
  await expect(
    page.locator("tr[data-test='030cszc07']", { hasText: "Australian Astronomical Observatory" }),
  ).toContainText("Australian Astronomical Observatory");
});
