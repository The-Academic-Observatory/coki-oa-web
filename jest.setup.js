// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

process.env.NEXT_PUBLIC_HOST = "http://127.0.0.1:3000";
process.env.NEXT_PUBLIC_API_HOST = "http://127.0.0.1:8787";
