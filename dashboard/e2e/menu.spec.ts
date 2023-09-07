import { ElementHandle, expect, test } from "@playwright/test";

test("Should navigate to the Open Access Dashboard page", async ({ page, isMobile }) => {
  await page.goto("/open/");
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

  if (isMobile) {
    // On mobile: need to click the menu button and then the nav item
    await page.locator("button[data-test='menu']").click();
    await page.locator("#sidebar-mobile a[data-test='open-access-dashboard']").click();
  } else {
    // On desktop: can click the sidebar
    await page.locator("#sidebar a[data-test='open-access-dashboard']").click();
  }

  await expect(page).toHaveURL("/");
  await expect(page.locator("h1")).toContainText("Open Access Dashboard");
});

test("Should navigate to the Open Access page", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

  if (isMobile) {
    // On mobile: need to click the menu button and then the nav item
    await page.locator("button[data-test='menu']").click();
    await page.locator("#sidebar-mobile a[data-test='open-access']").click();
  } else {
    // On desktop: can click the sidebar
    await page.locator("#sidebar a[data-test='open-access']").click();
  }

  await page.waitForURL("/open/");
  await expect(page).toHaveURL("/open/");
  await expect(page.locator("h1")).toContainText("Open Access");
});

test("Should navigate to the How it Works page", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

  if (isMobile) {
    // On mobile: need to click the menu button and then the nav item
    await page.locator("button[data-test='menu']").click();
    await page.locator("#sidebar-mobile a[data-test='how-it-works']").click();
  } else {
    // On desktop: can click the sidebar
    await page.locator("#sidebar a[data-test='how-it-works']").click();
  }

  await page.waitForURL("/how/");
  await expect(page).toHaveURL("/how/");
  await expect(page.locator("h1")).toContainText("How it Works");
});

test("Should navigate to the Data page", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

  if (isMobile) {
    // On mobile: need to click the menu button and then the nav item
    await page.locator("button[data-test='menu']").click();
    await page.locator("#sidebar-mobile a[data-test='data']").click();
  } else {
    // On desktop: can click the sidebar
    await page.locator("#sidebar a[data-test='data']").click();
  }

  await page.waitForURL("/data/");
  await expect(page).toHaveURL("/data/");
  await expect(page.locator("h1")).toContainText("Data");
});

test("Should navigate to the About page", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });
  await page.locator("button[data-test='menu']").isHidden();

  if (isMobile) {
    // On mobile: need to click the menu button and then the nav item
    await page.locator("button[data-test='menu']").click();
    await page.locator("#sidebar-mobile a[data-test='about']").click();
  } else {
    // On desktop: can click the sidebar
    await page.locator("#sidebar a[data-test='about']").click();
  }

  await page.waitForURL("/about/");
  await expect(page).toHaveURL("/about/");
  await expect(page.locator("h1")).toContainText("About");
});

test("Should navigate to the Contact page", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded", { timeout: 15000 });

  if (isMobile) {
    // On mobile: need to click the menu button and then the nav item
    await page.locator("button[data-test='menu']").click();
    await page.locator("#sidebar-mobile a[data-test='contact']").click();
  } else {
    // On desktop: can click the sidebar
    await page.locator("#sidebar a[data-test='contact']").click();
  }

  await page.waitForURL("/contact/");
  await expect(page).toHaveURL("/contact/");
  await expect(page.locator("h1")).toContainText("Contact");
});
