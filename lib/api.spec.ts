import { addBuildId, makeSearchUrl } from "./api";

const buildId = "9wunlCAp5nAMZGCCOIDUx";
const publicApiHost = "http://127.0.0.1:8787";

test("test addBuildId", () => {
  // Adding build to URL with no parameters
  let url = addBuildId("http://localhost");
  expect(url).toEqual(`http://localhost?build=${buildId}`);

  // Adding build to URL that already has parameters
  url = addBuildId("http://localhost?hello=world");
  expect(url).toEqual(`http://localhost?hello=world&build=${buildId}`);
});

test("test makeSearchUrl", () => {
  const text = "Curtin University";

  // Default limit
  let url = makeSearchUrl(text);
  expect(url).toEqual(`${publicApiHost}/api/search/Curtin%20University?limit=10&build=${buildId}`);

  // Custom limit
  url = makeSearchUrl(text, 15);
  expect(url).toEqual(`${publicApiHost}/api/search/Curtin%20University?limit=15&build=${buildId}`);
});
