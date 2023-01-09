export default {
  testEnvironment: "miniflare",
  testEnvironmentOptions: {
    modules: true,
    kvNamespaces: ["__STATIC_CONTENT"],
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
    __STATIC_CONTENT_MANIFEST: "<rootDir>/manifest.ts",
  },
  setupFilesAfterEnv: ["jest-sorted"],
};
