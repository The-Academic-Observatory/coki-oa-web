import { test, expect } from "@playwright/test";

test("Should navigate to the Open Access Dashboard page", async ({ page }) => {
  await page.goto("/open/");
  await page.locator("button[data-test='menu']").click();
  await page
    .locator("#sidebar-mobile a[data-test='open-access-dashboard']")
    .click();
  await expect(page).toHaveURL("/");
  await expect(page.locator("h1")).toContainText("Open Access Dashboard");
});

test("Should navigate to the Open Access page", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-test='menu']").click();
  await page.locator("#sidebar-mobile a[data-test='open-access']").click();
  await expect(page).toHaveURL("/open/");
  await expect(page.locator("h1")).toContainText("Open Access");
});

test("Should navigate to the How it Works page", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-test='menu']").click();
  await page.locator("#sidebar-mobile a[data-test='how-it-works']").click();
  await expect(page).toHaveURL("/how/");
  await expect(page.locator("h1")).toContainText("How it Works");
});

test("Should navigate to the Data page", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-test='menu']").click();
  await page.locator("#sidebar-mobile a[data-test='data']").click();
  await expect(page).toHaveURL("/data/");
  await expect(page.locator("h1")).toContainText("Data");
});

test("Should navigate to the About page", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-test='menu']").click();
  await page.locator("#sidebar-mobile a[data-test='about']").click();
  await expect(page).toHaveURL("/about/");
  await expect(page.locator("h1")).toContainText("About");
});

test("Should navigate to the Contact page", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-test='menu']").click();
  await page.locator("#sidebar-mobile a[data-test='contact']").click();
  await expect(page).toHaveURL("/contact/");
  await expect(page.locator("h1")).toContainText("Contact");
});
