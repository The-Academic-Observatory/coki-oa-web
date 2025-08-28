import {
  cokiImageLoader,
  getDomain,
  makeDownloadDataUrl,
  makeEntityUrl,
  makeFilterUrl,
  makeSearchUrl,
  makeSocialCardUrl,
  IMAGES_HOST,
} from "@/lib/api";

const buildId = "9wunlCAp5nAMZGCCOIDUx";
const host = "http://localhost";

test("test makeEntityUrl", () => {
  let url = makeEntityUrl(host, "country", "NZL");
  expect(url).toEqual(`${host}/country/NZL?build=${buildId}`);

  url = makeEntityUrl(host, "institution", "01pp5tt34");
  expect(url).toEqual(`${host}/institution/01pp5tt34?build=${buildId}`);
});

test("test makeSearchUrl", () => {
  const url = makeSearchUrl(host, "Curtin University", null, 0, 10, false);
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
  expect(url).toEqual(`${IMAGES_HOST}/social-cards/NZL.jpg?build=${buildId}`);
});

test("test cokiImageLoader", () => {
  const url = cokiImageLoader("path/to/image.jpg");
  expect(url).toEqual(`${IMAGES_HOST}/path/to/image.jpg`);
});

describe("getDomain", () => {
  test("should correctly extract the domain from a valid URL", () => {
    // Test a standard URL with 'www.'
    let domain = getDomain("http://www.guc-asic.com/en-global");
    expect(domain).toBe("guc-asic.com");

    // Test a URL without 'www.'
    domain = getDomain("https://example.com/path/to/page");
    expect(domain).toBe("example.com");

    // Test a different protocol like FTP
    domain = getDomain("ftp://ftp.server.org/file.zip");
    expect(domain).toBe("ftp.server.org");

    // Test a URL with a subdomain
    domain = getDomain("https://sub.domain.co.uk");
    expect(domain).toBe("sub.domain.co.uk");
  });

  test("should return null for invalid or malformed URLs", () => {
    // Test a completely invalid string
    let domain = getDomain("this is not a url");
    expect(domain).toBeNull();

    // Test an empty string
    domain = getDomain("");
    expect(domain).toBeNull();

    // Test a URL with no protocol
    domain = getDomain("www.test.com");
    expect(domain).toBe("test.com");
  });
});
