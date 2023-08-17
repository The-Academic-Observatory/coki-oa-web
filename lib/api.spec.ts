import { makeSearchUrl } from "./api";

const buildId = "9wunlCAp5nAMZGCCOIDUx";
const host = "http://localhost";

test("test makeSearchUrl", () => {
  const text = "Curtin University";

  // Default limit
  let url = makeSearchUrl(host, text);
  expect(url).toEqual(`${host}/search/Curtin%20University?limit=10&build=${buildId}`);

  // Custom limit
  url = makeSearchUrl(host, text, 15);
  expect(url).toEqual(`${host}/search/Curtin%20University?limit=15&build=${buildId}`);
});
