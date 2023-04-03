import { expect, test } from "@playwright/test";
import fs from "fs";
import { randomUUID } from "crypto";
import decompress from "decompress";

test("Should download ZIP file containing the entity data and peep contents", async ({ page, isMobile }) => {
  test.skip(isMobile, "This feature is not implemented for Mobile version of the website.");

  // Go to AUS page
  await page.goto("/country/AUS/");

  // Click download link
  const [download] = await Promise.all([
    page.waitForEvent("download"), // wait for download to start
    page.click('div[data-test="metadata-link-download"]'),
  ]);

  // Save the ZIP file.
  const testZipPath = `Australia COKI Dataset-${randomUUID()}.zip`;
  await download.saveAs(testZipPath);

  // Read a zip file and peep contents
  const expectedZippedFiles = ["years.csv", "repositories.csv", "README.md"];
  await decompress(testZipPath, "dist")
    .then((files: any) => {
      for (const file of files) {
        expect(expectedZippedFiles.includes(file.path)).toBeTruthy();
      }
    })
    .catch((error: any) => {
      console.log(error);
    });

  // Delete file downloaded files
  fs.rmSync(testZipPath, { force: true });
});
