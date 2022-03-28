export default {
  testEnvironment: "miniflare",
  testEnvironmentOptions: {
    kvNamespaces: ["TEST_NAMESPACE"],
  },
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
  setupFilesAfterEnv: ["jest-sorted"],
};
