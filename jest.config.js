const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    "^@/components/(.*)$": "<rootDir>/components/$1",

    "^@/pages/(.*)$": "<rootDir>/pages/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/e2e/", "<rootDir>/workers-api/", "<rootDir>/workers-site/"],
  globals: {
    BUILD_ID: "9wunlCAp5nAMZGCCOIDUx",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
