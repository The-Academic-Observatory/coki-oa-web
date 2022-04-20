module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  testPathIgnorePatterns: ["<rootDir>/e2e/", "<rootDir>/workers-api/"],
};
