export default {
  testEnvironment: "miniflare",
  testEnvironmentOptions: {
    modules: true,
    bindings: { KEY: "value" },
    kvNamespaces: ["__STATIC_CONTENT"],
  },
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json", useESM: true }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
    __STATIC_CONTENT_MANIFEST: "<rootDir>/manifest.ts",

    // To map the json2csv formatters JavaScript files to the correct directories
    // See issue: https://github.com/juanjoDiaz/json2csv/issues/21
    "^@json2csv/formatters/(.*)\\.js$": "<rootDir>/node_modules/@json2csv/formatters/src/$1.js",
  },
  setupFilesAfterEnv: ["./setupJestSorted.js"],
  testTimeout: 30000,
};
