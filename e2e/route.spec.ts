import { test, expect } from "@playwright/test";

// Open Access Dashboard: by default the country tab should be opened
test("Should navigate to the Open Access Dashboard page", async ({ page }) => {
  const route = "/";
  await page.goto(route);
  await expect(page).toHaveURL(route);
  await expect(page.locator("h1")).toContainText("Open Access Dashboard");
  await expect(page.locator("button[data-test='tab-country']")).toHaveAttribute(
    "aria-selected",
    "true"
  );
});

test("Should navigate to Open Access Dashboard: Country Tab", async ({
  page,
}) => {
  const route = "/country/";
  await page.goto(route);
  await expect(page).toHaveURL(route);
  await expect(page.locator("button[data-test='tab-country']")).toHaveAttribute(
    "aria-selected",
    "true"
  );
});

test("Should navigate to Open Access Dashboard: Institution Tab", async ({
  page,
}) => {
  const route = "/institution/";
  await page.goto(route);
  await expect(page).toHaveURL(route);
  await expect(
    page.locator("button[data-test='tab-institution']")
  ).toHaveAttribute("aria-selected", "true");
});

// Country
test("Should navigate to Australia", async ({ page }) => {
  const route = "/country/AUS/";
  await page.goto(route);
  await expect(page).toHaveURL(route);
  await expect(page.locator("h1")).toContainText("Australia");
});

// Institution
test("Should navigate to Curtin University", async ({ page }) => {
  const route = "/institution/02n415q13/";
  await page.goto(route);
  await expect(page).toHaveURL(route);
  await expect(page.locator("h1")).toContainText("Curtin University");
});
