// Copyright 2022 Curtin University
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Author: James Diprose

// @ts-ignore
import fs from "fs";
import { handleRequest } from "./router";
import lodashGet from "lodash.get";

const institutionTestTimeout = 100000;
const env = getMiniflareBindings();
const ctx = {} as ExecutionContext;

test("test handleRequest 404", async () => {
  let res = await handleRequest(new Request("http://localhost/api"), env, ctx);
  expect(res.status).toBe(404);

  res = await handleRequest(new Request("http://localhost/api/search"), env, ctx); // no :text parameter
  expect(res.status).toBe(404);
});

test("test handleRequest search", async () => {
  // Search
  let res = await handleRequest(new Request("http://localhost/api/search/curtin"), env, ctx);
  let json = await res.json();
  expect(res.status).toBe(200);
  expect(json.length).toBe(2);
  expect(json).toMatchObject([{ id: "02n415q13" }, { id: "024fm2y42" }]);

  // Search: text with spaces
  res = await handleRequest(new Request("http://localhost/api/search/auckland%20university"), env, ctx);
  json = await res.json();
  expect(res.status).toBe(200);
  expect(json.length).toBe(2);
  expect(json).toMatchObject([{ id: "03b94tp07" }, { id: "01zvqw119" }]);

  // Limit: 1
  res = await handleRequest(new Request("http://localhost/api/search/south%20korea?limit=1"), env, ctx);
  json = await res.json();
  expect(res.status).toBe(200);
  expect(json.length).toBe(1);
  expect(json).toMatchObject([{ id: "KOR" }]);

  // Limit > 20 still returns 20
  res = await handleRequest(new Request("http://localhost/api/search/s?limit=21"), env, ctx);
  json = await res.json();
  expect(res.status).toBe(200);
  expect(json.length).toBe(20);
});

test("test handleRequest country", async () => {
  // Put data into KV namespace for testing
  await env.__STATIC_CONTENT.put("country/NZL.json", fs.readFileSync("./public/country/NZL.json", "utf-8"));

  let res = await handleRequest(new Request("http://localhost/api/country/NZL"), env, ctx);
  let json = await res.json();
  expect(res.status).toBe(200);
  expect(json).toMatchObject({ id: "NZL" });
});

test("test handleRequest institution", async () => {
  // Put data into KV namespace for testing
  await env.__STATIC_CONTENT.put(
    "institution/030cszc07.json",
    fs.readFileSync("./public/institution/030cszc07.json", "utf-8"),
  );
  let res = await handleRequest(new Request("http://localhost/api/institution/030cszc07"), env, ctx);
  let json = await res.json();
  expect(res.status).toBe(200);
  expect(json).toMatchObject({ id: "030cszc07" });
});

const fetchAll = async (endpoint: string, otherQueryParams: string = "") => {
  //@ts-ignore
  let results = [];
  let i = 0;
  while (true) {
    let res = await handleRequest(
      new Request(`http://localhost/api/${endpoint}?page=${i}${otherQueryParams}`),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    let json = await res.json();
    expect(json).toHaveProperty("items");
    expect(json).toHaveProperty("nItems");
    expect(json).toHaveProperty("page");
    expect(json).toHaveProperty("limit");
    expect(json).toHaveProperty("orderBy");
    expect(json).toHaveProperty("orderDir");
    expect(json.items).toBeInstanceOf(Array);

    //@ts-ignore
    results = results.concat(json.items);
    if (json.items.length == 0) {
      break;
    }
    i += 1;
  }

  return results;
};

test("test handleRequest countries: order key stats.p_outputs_open", async () => {
  const endpoint = "countries";
  let orderByKey = "stats.p_outputs_open";

  // Check sorted in descending order, with default params, after fetching all pages
  let results = await fetchAll(endpoint);
  expect(results.length).toBeGreaterThan(0);
  //@ts-ignore
  expect(results.map((x) => lodashGet(x, orderByKey))).toBeSorted({ descending: true });

  // Check sorted in descending order after fetching all pages
  results = await fetchAll(endpoint, "&orderDir=dsc");
  expect(results.length).toBeGreaterThan(0);
  //@ts-ignore
  expect(results.map((x) => lodashGet(x, orderByKey))).toBeSorted({ descending: true });

  // Check sorted in ascending order after fetching all pages
  expect(results.length).toBeGreaterThan(0);
  results = await fetchAll(endpoint, "&orderDir=asc");
  //@ts-ignore
  expect(results.map((x) => lodashGet(x, orderByKey))).toBeSorted({ descending: false });
});

test("test handleRequest countries: order key name", async () => {
  const endpoint = "countries";
  let orderByKey = "name";

  // Check sorted in descending order, with default params, after fetching all pages
  let results = await fetchAll(endpoint, `&orderBy=${orderByKey}`);
  expect(results.length).toBeGreaterThan(0);
  //@ts-ignore
  expect(results.map((x) => lodashGet(x, orderByKey))).toBeSorted({ descending: true });

  // Check sorted in descending order after fetching all pages
  results = await fetchAll(endpoint, `&orderBy=${orderByKey}&orderDir=dsc`);
  expect(results.length).toBeGreaterThan(0);
  //@ts-ignore
  expect(results.map((x) => lodashGet(x, orderByKey))).toBeSorted({ descending: true });

  // Check sorted in ascending order after fetching all pages
  expect(results.length).toBeGreaterThan(0);
  results = await fetchAll(endpoint, `&orderBy=${orderByKey}&orderDir=asc`);
  //@ts-ignore
  expect(results.map((x) => lodashGet(x, orderByKey))).toBeSorted({ descending: false });
});

test("test handleRequest countries: subregions", async () => {
  const endpoint = "countries";
  let results = await fetchAll(endpoint, "&subregions=Southern%20Asia,Latin%20America%20and%20the%20Caribbean");

  // Assert all results sorted
  expect(results.length).toBeGreaterThan(0);
  //@ts-ignore
  expect(results.map((x) => lodashGet(x, "stats.p_outputs_open"))).toBeSorted({ descending: true });

  // Assert that we only have entities from Southern Asia or Latin America and the Caribbean
  results.forEach((entity) => {
    expect(entity).toMatchObject({ subregion: expect.stringMatching(/Southern Asia|Latin America and the Caribbean/) });
  });
});

test("test handleRequest countries: regions", async () => {
  const endpoint = "countries";
  let results = await fetchAll(endpoint, "&regions=Oceania,Americas");

  // Assert all results sorted
  expect(results.length).toBeGreaterThan(0);
  //@ts-ignore
  expect(results.map((x) => lodashGet(x, "stats.p_outputs_open"))).toBeSorted({ descending: true });

  // Assert that we only have entities from Oceania and Americas
  results.forEach((entity) => {
    expect(entity).toMatchObject({ region: expect.stringMatching(/Oceania|Americas/) });
  });
});

test("test handleRequest countries: minNOutputs, maxNOutputs", async () => {
  const endpoint = "countries";
  let results = await fetchAll(endpoint, "&minNOutputs=100000&maxNOutputs=200000");

  // Assert all results sorted
  expect(results.length).toBeGreaterThan(0);
  //@ts-ignore
  expect(results.map((x) => lodashGet(x, "stats.p_outputs_open"))).toBeSorted({ descending: true });

  // Assert that we only have entities from Oceania and Americas
  results.forEach((entity) => {
    expect(lodashGet(entity, "stats.n_outputs")).toBeGreaterThanOrEqual(100000);
    expect(lodashGet(entity, "stats.n_outputs")).toBeLessThanOrEqual(200000);
  });
});

test("test handleRequest countries: stats.p_outputs", async () => {
  const endpoint = "countries";
  let results = await fetchAll(endpoint, "&minPOutputsOpen=50&maxPOutputsOpen=100");

  // Assert all results sorted
  expect(results.length).toBeGreaterThan(0);
  //@ts-ignore
  expect(results.map((x) => lodashGet(x, "stats.p_outputs_open"))).toBeSorted({ descending: true });

  // Assert that we only have entities from Oceania and Americas
  results.forEach((entity) => {
    expect(lodashGet(entity, "stats.p_outputs_open")).toBeGreaterThanOrEqual(50);
    expect(lodashGet(entity, "stats.p_outputs_open")).toBeLessThanOrEqual(100);
  });
});

test(
  "test handleRequest institutions: order",
  async () => {
    const endpoint = "institutions";
    const orderByKey = "stats.p_outputs_open";

    // Check sorted in descending order, with default params, after fetching all pages
    let results = await fetchAll(endpoint);
    expect(results.length).toBeGreaterThan(0);
    //@ts-ignore
    expect(results.map((x) => lodashGet(x, orderByKey))).toBeSorted({ descending: true });

    // Check sorted in descending order after fetching all pages
    results = await fetchAll(endpoint, "&orderDir=dsc");
    expect(results.length).toBeGreaterThan(0);
    //@ts-ignore
    expect(results.map((x) => lodashGet(x, orderByKey))).toBeSorted({ descending: true });

    // Check sorted in ascending order after fetching all pages
    results = await fetchAll(endpoint, "&orderDir=asc");
    expect(results.length).toBeGreaterThan(0);
    //@ts-ignore
    expect(results.map((x) => lodashGet(x, orderByKey))).toBeSorted({ descending: false });
  },
  institutionTestTimeout,
);

test(
  "test handleRequest institutions: countries",
  async () => {
    const endpoint = "institutions";
    let results = await fetchAll(endpoint, "&countries=Australia,New%20Zealand");

    // Assert all results sorted
    expect(results.length).toBeGreaterThan(0);
    //@ts-ignore
    expect(results.map((x) => lodashGet(x, "stats.p_outputs_open"))).toBeSorted({ descending: true });

    // Assert that we only have entities from Oceania and Americas
    results.forEach((entity) => {
      expect(entity).toMatchObject({ country: expect.stringMatching(/Australia|New Zealand/) });
    });
  },
  institutionTestTimeout,
);

test(
  "test handleRequest institutions: institution_type",
  async () => {
    const endpoint = "institutions";
    let results = await fetchAll(endpoint, "&institutionTypes=Education,Government");

    // Assert all results sorted
    expect(results.length).toBeGreaterThan(0);
    //@ts-ignore
    expect(results.map((x) => lodashGet(x, "stats.p_outputs_open"))).toBeSorted({ descending: true });

    // Assert that we only have entities from Oceania and Americas
    results.forEach((entity) => {
      expect(entity.institution_type).toMatch(/Education|Government/);
    });
  },
  institutionTestTimeout,
);
