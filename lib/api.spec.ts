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

test("test makeFilterUrl: country", () => {
  let url = makeFilterUrl(host, "country", {
    page: 0,
    limit: 20,
    orderBy: "p_outputs_open",
    orderDir: "asc",
    subregions: ["Africa", "Oceania"],
    minNOutputs: 0,
    maxNOutputs: 100,
    minNOutputsOpen: 0,
    maxNOutputsOpen: 100,
    minPOutputsOpen: 0,
    maxPOutputsOpen: 100,
  });
  expect(url).toEqual(
    `${host}/countries?page=0&limit=20&orderBy=p_outputs_open&orderDir=asc&subregions=Africa%2COceania&minNOutputs=0&maxNOutputs=100&minNOutputsOpen=0&maxNOutputsOpen=100&minPOutputsOpen=0&maxPOutputsOpen=100&build=${buildId}`,
  );
});

test("test makeFilterUrl: institution", () => {
  let url = makeFilterUrl(host, "institution", {
    page: 0,
    limit: 20,
    orderBy: "p_outputs_open",
    orderDir: "asc",
    subregions: ["Africa", "Oceania"],
    institutionTypes: ["Education", "Government"],
    minNOutputs: 0,
    maxNOutputs: 100,
    minNOutputsOpen: 0,
    maxNOutputsOpen: 100,
    minPOutputsOpen: 0,
    maxPOutputsOpen: 100,
  });
  expect(url).toEqual(
    `${host}/institutions?page=0&limit=20&orderBy=p_outputs_open&orderDir=asc&subregions=Africa%2COceania&institutionTypes=Education%2CGovernment&minNOutputs=0&maxNOutputs=100&minNOutputsOpen=0&maxNOutputsOpen=100&minPOutputsOpen=0&maxPOutputsOpen=100&build=${buildId}`,
  );
});

test("test makeDownloadDataUrl", () => {
  const url = makeDownloadDataUrl(host, "country", "NZL");
  expect(url).toEqual(`${host}/download/country/NZL?build=${buildId}`);
});

test("test makeSocialCardUrl", () => {
  const url = makeSocialCardUrl("NZL");
  expect(url).toEqual(`https://images.open.coki.ac/social-cards/NZL.jpg?build=${buildId}`);
});

test("test cokiImageLoader", () => {
  const url = cokiImageLoader("path/to/image.jpg");
  expect(url).toEqual(`https://images.open.coki.ac/path/to/image.jpg`);
});
