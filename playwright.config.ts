import { devices, PlaywrightTestConfig } from "@playwright/test";
import path from "path";

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  timeout: 60 * 1000,
  testDir: path.join(__dirname, "e2e"),
  retries: 2,
  outputDir: "test-results/",
  webServer: {
    command: "yarn run dev",
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    trace: "retry-with-trace",
    video: "on-first-retry",
    contextOptions: {
      ignoreHTTPSErrors: true,
    },
  },
  expect: {
    timeout: 30000,
  },
  projects: [
    // Desktop viewports
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1310, height: 1080 },
        permissions: ["clipboard-read", "clipboard-write"],
      },
    },
    {
      name: "Desktop Firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1310, height: 1080 },
      },
    },
    {
      name: "Desktop Safari",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1310, height: 1080 },
      },
    },
    {
      name: "Microsoft Edge",
      use: {
        channel: "msedge",
        viewport: { width: 1310, height: 1080 },
        permissions: ["clipboard-read", "clipboard-write"],
      },
    },
    // Mobile viewports.
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
        permissions: ["clipboard-read", "clipboard-write"],
      },
    },
    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 13"],
      },
    },
  ],
};
export default config;
