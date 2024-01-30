import { expect, Page, test } from "@playwright/test";

test("Country tab region filter: Africa", async ({ page, isMobile }) => {
  await testRegionFilter("country", "Africa", [{ id: "STP", name: "São Tomé and Príncipe" }], page, isMobile);
});

test("Country tab region filter: Americas", async ({ page, isMobile }) => {
  await testRegionFilter("country", "Americas", [{ id: "NIC", name: "Nicaragua" }], page, isMobile);
});

test("Country tab region filter: Asia", async ({ page, isMobile }) => {
  await testRegionFilter("country", "Asia", [{ id: "IDN", name: "Indonesia" }], page, isMobile);
});
test("Country tab region filter: Europe", async ({ page, isMobile }) => {
  await testRegionFilter("country", "Europe", [{ id: "XKX", name: "Kosovo" }], page, isMobile);
});

test("Country tab region filter: Oceania", async ({ page, isMobile }) => {
  await testRegionFilter("country", "Oceania", [{ id: "PYF", name: "French Polynesia" }], page, isMobile);
});

test("Institution tab region filter: Africa", async ({ page, isMobile }) => {
  await testRegionFilter("institution", "Africa", [{ id: "046w98q07", name: "Ministério da Saúde" }], page, isMobile);
});

test("Institution tab region filter: Americas", async ({ page, isMobile }) => {
  await testRegionFilter(
    "institution",
    "Americas",
    [{ id: "04b6ahj46", name: "Universidad Independiente" }],
    page,
    isMobile,
  );
});

test("Institution tab region filter: Asia", async ({ page, isMobile }) => {
  await testRegionFilter(
    "institution",
    "Asia",
    [{ id: "00tas1680", name: "North Sumatra Islamic University" }],
    page,
    isMobile,
  );
});

test("Institution tab region filter: Europe", async ({ page, isMobile }) => {
  await testRegionFilter(
    "institution",
    "Europe",
    [{ id: "00p574j49", name: "Institut za filozofiju" }],
    page,
    isMobile,
  );
});

test("Institution tab region filter: Oceania", async ({ page, isMobile }) => {
  await testRegionFilter(
    "institution",
    "Oceania",
    [{ id: "04v9m3h35", name: "ARC Centre of Excellence for All-sky Astrophysics" }],
    page,
    isMobile,
  );
});

test("Country tab select countries filter", async ({ page, isMobile }) => {
  await testSelectEntitiesFilter(
    "country",
    "select-countries-accordion-item",
    "select-countries-autocomplete",
    ["Australia", "New Zealand", "United States"],
    [
      { id: "AUS", name: "Australia" },
      { id: "NZL", name: "New Zealand" },
      { id: "USA", name: "United States" },
    ],
    page,
    isMobile,
  );
});

test("Institution tab select institutions filter", async ({ page, isMobile }) => {
  await testSelectEntitiesFilter(
    "institution",
    "select-institutions-accordion-item",
    "select-institutions-autocomplete",
    ["Massachusetts Institute of Technology", "Curtin University", "Harvard University"],
    [
      {
        id: "042nb2s44",
        name: "Massachusetts Institute of Technology",
      },
      { id: "02n415q13", name: "Curtin University" },
      { id: "03vek6s52", name: "Harvard University" },
    ],
    page,
    isMobile,
  );
});

test("Institution tab country filter", async ({ page, isMobile }) => {
  await testSelectEntitiesFilter(
    "institution",
    "institution-country-filter-accordion-item",
    "institution-country-filter-autocomplete",
    ["New Zealand", "Papua New Guinea"],
    [
      {
        id: "01x6n0t15",
        name: "Papua New Guinea Institute of Medical Research",
      },
      {
        id: "048macv48",
        name: "Pharmac",
      },
      { id: "0327mmx61", name: "Maurice Wilkins Centre" },
      { id: "04sh9kd82", name: "Starship Children's Health" },
    ],
    page,
    isMobile,
  );
});

function getPlatform(isMobile: boolean) {
  let platform = "desktop";
  if (isMobile) {
    platform = "mobile";
  }
  return platform;
}

async function openFiltersForm(platform: string, entityType: string, page: Page, isMobile: boolean) {
  await page.goto("/");

  // Click country or institution tab
  await page.locator(`button[data-test='tab-${entityType}']`).click();

  // Check that list contains expected item
  if (entityType == "country") {
    await expect(page.locator("tr[data-test='IDN']", { hasText: "Indonesia" })).toContainText("Indonesia");
  } else if (entityType == "institution") {
    await expect(page.locator("tr[data-test='04v9m3h35']", { hasText: "ARC Centre of Excellence" })).toContainText(
      "ARC Centre of Excellence",
    );
  }

  // Click the filtering button for mobile.
  if (isMobile) {
    await page.locator("button[data-test='tab-filter-button']").click();
  }

  // Get form
  return page.locator(`form[data-test='${platform}-${entityType}-form']`);
}

async function testRegionFilter(
  entityType: string,
  region: string,
  expectedEntities: Array<{
    id: string;
    name: string;
  }>,
  page: Page,
  isMobile: boolean,
) {
  const platform = getPlatform(isMobile);
  const form = await openFiltersForm(platform, entityType, page, isMobile);

  // Mark checkbox as true
  // Have to click on label, which is the parent of the checkbox, rather than input
  await form.locator(`label[data-test='region.${region}.value'][type='checkbox']`).click();

  // Test that value is true
  expect(await form.locator(`input[type='checkbox'][id='region.${region}.value']`).isChecked()).toBeTruthy();

  // Locate the "Apply" button
  await form.locator(`button`, { hasText: "Apply" }).click();

  // Assert that expected entities are in our list
  for (const { id, name } of expectedEntities) {
    await expect(page.locator(`tr[data-test='${id}']`)).toContainText(name);
  }
}

async function testSelectEntitiesFilter(
  entityType: string,
  accordionItemDataTest: string,
  autocompleteDataTest: string,
  textInputs: Array<string>,
  expectedEntities: Array<{
    id: string;
    name: string;
  }>,
  page: Page,
  isMobile: boolean,
) {
  const platform = getPlatform(isMobile);
  const form = await openFiltersForm(platform, entityType, page, isMobile);

  // Open accordion item
  const plurals = {
    country: "countries",
    institution: "institutions",
  } as { [key: string]: string };

  await form.locator(`div[data-test='${accordionItemDataTest}'] > button`).click();

  // Get autocomplete
  const autocomplete = form.locator(`div[data-test='${autocompleteDataTest}']`);

  // Select entities in autocomplete
  for (const text of textInputs) {
    await page.waitForTimeout(1000);

    // Click autocomplete
    await form.locator(`div[data-test='${autocompleteDataTest}'] > div > div > div:nth-of-type(2)`).click();

    // Wait for 1 second
    await page.waitForTimeout(1000);

    // Type text
    await autocomplete.type(text);

    // Wait for 1 second
    await page.waitForTimeout(1000);

    // Find first item in list box
    const firstResult = autocomplete.locator('div[id^="react-select-"][id$="-option-0"]');

    // Click
    await firstResult.click();
  }

  // Wait for 1 second
  await page.waitForTimeout(1000);

  // Locate the "Apply" button
  await form.locator(`button`, { hasText: "Apply" }).click();

  // Assert that expected entities are in our list
  for (const { id, name } of expectedEntities) {
    await expect(page.locator(`tr[data-test='${id}']`)).toContainText(name);
  }
}
