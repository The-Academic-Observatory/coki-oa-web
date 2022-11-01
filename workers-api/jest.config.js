export default {
  preset: "ts-jest/presets/default-esm",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "miniflare",
  testEnvironmentOptions: {
    scriptPath: "dist/index.mjs",
    // Miniflare doesn't support main field in wrangler
    modules: true,
    kvNamespaces: ["TEST_NAMESPACE"],
  },
  setupFilesAfterEnv: ["jest-sorted"],
};
