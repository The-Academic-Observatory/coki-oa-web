import {
  cokiImageLoader,
  makeDownloadDataUrl,
  makeEntityUrl,
  makeFilterUrl,
  makeSearchUrl,
  makeSocialCardUrl,
} from "./api";

const buildId = "9wunlCAp5nAMZGCCOIDUx";
const host = "http://localhost";

test("test makeEntityUrl", () => {
  let url = makeEntityUrl(host, "country", "NZL");
  expect(url).toEqual(`${host}/country/NZL?build=${buildId}`);

  url = makeEntityUrl(host, "institution", "01pp5tt34");
  expect(url).toEqual(`${host}/institution/01pp5tt34?build=${buildId}`);
});

test("test makeSearchUrl", () => {
  const url = makeSearchUrl(host, "Curtin University", 0, 10, false);
  expect(url).toEqual(`${host}/search/Curtin%20University?acronym=false&page=0&limit=10&build=${buildId}`);
});

test("test makeFilterUrl", () => {
  // const url = makeFilterUrl(host, "country", { page: 0, limit: 10 });
  // expect(url).toEqual(`${host}/countries?build=${buildId}`);
  //   maxPOutputsOpen?: number;
});

test("test makeDownloadDataUrl", () => {
  // const url = makeDownloadDataUrl("NZL");
  // expect(url).toEqual(`https://images.open.coki.ac/social-cards/NZL.jpg?build=${buildId}`);
});

test("test makeSocialCardUrl", () => {
  const url = makeSocialCardUrl("NZL");
  expect(url).toEqual(`https://images.open.coki.ac/social-cards/NZL.jpg?build=${buildId}`);
});

test("test cokiImageLoader", () => {
  // const url = cokiImageLoader("NZL");
  // expect(url).toEqual(`https://images.open.coki.ac/social-cards/NZL.jpg?build=${buildId}`);
});
