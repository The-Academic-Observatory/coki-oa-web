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

// TODO: Flesh out this test
test("Resolve Australia from multi-select individual country filtering", async ({ page, isMobile }) => {
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

  // Click on the individual country panel

  // Type in value "Aus"

  // Click on result in the muli-select panel

  // Click apply

  // Check that country is in the results list
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

// TODO: Flesh out this test
test("Resolve Australian Astronomical Observatory multi-select individual institution filtering", async ({
  page,
  isMobile,
}) => {
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

  if (isMobile) {
    // Click the filtering button for mobile.
    await page.locator("button[data-test='tab-filter-button']").click();
  }

  // Get country form
  const form = page.locator(`form[data-test='${platform}-institution-form']`);

  // Click on the individual institution panel

  // Type in value "Australian Astronomical Observatory"

  // Click on result in the muli-select panel

  // Click Apply button

  // Check that country is in the results list
});

// TODO: Flesh out this test
test("Resolve list of Australian institutions from multi-select individual country filtering", async ({
  page,
  isMobile,
}) => {
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

  if (isMobile) {
    // Click the filtering button for mobile.
    await page.locator("button[data-test='tab-filter-button']").click();
  }

  // Get country form
  const form = page.locator(`form[data-test='${platform}-institution-form']`);

  // Click on the country panel

  // Type in value "Australia"

  // Click on result in the muli-select panel

  // Click Apply button

  // Check that "ARC centre of excellence for all-sky astrophysics" is at the top of the list - will change with each version of backend data.
  // OR check against a call from the API to ensure the entities are being rendered / filtered okay on the page.
});
