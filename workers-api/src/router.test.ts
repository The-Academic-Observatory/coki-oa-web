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

import { beforeAll, expect, test } from "vitest";
// @ts-ignore
import fs from "fs";
import tmp from "tmp";
import { handleRequest } from "@/router";
import decompress from "decompress";
import { Entity } from "@/types";
import { entitiesToSQL, loadEntities } from "@/database";
import path from "path";
import { toBeSorted } from "../vitestToBeSorted";

// Extend with toBeSorted
expect.extend({
  toBeSorted: toBeSorted,
});

const describe = setupMiniflareIsolatedStorage();
const env = getMiniflareBindings();

const host = "http://localhost";
const institutionTestTimeout = 1000000;
const ctx = {} as ExecutionContext;

beforeAll(async () => {
  const db = env.__D1_BETA__DB;
  const entities = loadEntities(path.resolve(__dirname, "../fixtures"));
  const sql = entitiesToSQL(entities);
  await db.exec(sql);
});

const fetchPages = async (origin: string, pathname: string, params: URLSearchParams): Promise<Array<Entity>> => {
  const results: Array<Entity> = [];
  let page = 0;
  while (true) {
    // Set new page
    params.set("page", `${page}`);

    // Construct and log URL
    const url = `${origin}/${pathname}?${params}`;
    console.log(`fetchPages: url=${url}`);

    // Fetch data and append to results
    const res = await handleRequest(new Request(url), env, ctx);
    if (res.status !== 200) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    let json = await res.json();
    results.push(...json.items);

    // Break if we are at the end
    if (json.items.length == 0) {
      break;
    }

    // Go-to next page
    page += 1;
  }

  return results;
};

const assertEntityProperties = (entities: Array<Entity>) => {
  entities.forEach((entity) => {
    // Properties on all entities
    expect(entity).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      logo_sm: expect.any(String),
      entity_type: expect.any(String),
      subregion: expect.any(String),
      region: expect.any(String),
      stats: {
        n_outputs: expect.any(Number),
        n_outputs_open: expect.any(Number),
        n_outputs_black: expect.any(Number),
        p_outputs_open: expect.any(Number),
        p_outputs_publisher_open_only: expect.any(Number),
        p_outputs_both: expect.any(Number),
        p_outputs_other_platform_open_only: expect.any(Number),
        p_outputs_closed: expect.any(Number),
        p_outputs_black: expect.any(Number),
      },
    });

    // Properties conditional on entity_type
    if (entity.entity_type == "country") {
      expect(entity.country_name).toBeUndefined();
      expect(entity.country_code).toBeUndefined();
      expect(entity.institution_type).toBeUndefined();
    } else if (entity.entity_type == "institution") {
      expect(entity.country_name).toBeDefined();
      expect(entity.country_code).toBeDefined();
      expect(entity.institution_type).toBeDefined();
    }
  });
};

const fetchAll = async (path: string, otherQueryParams: string = ""): Promise<Array<Entity>> => {
  let results: Array<Entity> = [];
  let i = 0;

  while (true) {
    let res = await handleRequest(new Request(`${host}/${path}?page=${i}${otherQueryParams}`), env, ctx);

    if (res.status !== 200) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    let json = await res.json();
    results = results.concat(json.items);

    // Break if we are at the end
    if (json.items.length == 0) {
      break;
    }

    i += 1;
  }

  return results;
};

const localeCompare = (a: string, b: string) => {
  return a.localeCompare(b, "en", { sensitivity: "base" });
};

describe("404 API endpoints", () => {
  test("calling api", async () => {
    const res = await handleRequest(new Request(`${host}/api`), env, ctx);
    expect(res.status).toBe(404);
  });
});

describe("entity API endpoint", () => {
  test("get a country", async () => {
    // Put data into KV namespace for testing
    await env.__STATIC_CONTENT.put("country/NZL.json", fs.readFileSync("./public/country/NZL.json", "utf-8"));

    let res = await handleRequest(new Request(`${host}/country/NZL`), env, ctx);
    let json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toMatchObject({ id: "NZL" });
  });

  test("get an institution", async () => {
    // Put data into KV namespace for testing
    await env.__STATIC_CONTENT.put(
      "institution/030cszc07.json",
      fs.readFileSync("./public/institution/030cszc07.json", "utf-8"),
    );
    let res = await handleRequest(new Request(`${host}/institution/030cszc07`), env, ctx);
    let json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toMatchObject({ id: "030cszc07" });
  });
});

describe("countries API endpoint", () => {
  test("widest filters", async () => {
    let entities = await fetchPages(host, "countries", new URLSearchParams({}));
    assertEntityProperties(entities);
    expect(entities.length).toBe(221);
    for (const entity of entities) {
      expect(entity.entity_type).toBe("country");
    }
  });

  test("ids filter", async () => {
    let entities = await fetchPages(
      host,
      "countries",
      new URLSearchParams({
        ids: "NZL,AUS",
      }),
    );
    assertEntityProperties(entities);

    // Assert that we only have NZL and AUS
    expect(entities.length).toBe(2);
    entities.forEach((entity) => {
      expect(entity).toMatchObject({ id: expect.stringMatching(/NZL|AUS/) });
    });
  });

  test("regions filter", async () => {
    const entities = await fetchPages(
      host,
      "countries",
      new URLSearchParams({
        regions: "Oceania,Americas",
      }),
    );
    assertEntityProperties(entities);

    // Assert all results sorted
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.p_outputs_open)).toBeSorted({ descending: true });

    // Assert that we only have entities from Oceania and Americas
    entities.forEach((entity) => {
      expect(entity).toMatchObject({ region: expect.stringMatching(/Oceania|Americas/) });
    });
  });

  test("subregions filter", async () => {
    const entities = await fetchPages(
      host,
      "countries",
      new URLSearchParams({
        subregions: "Southern Asia,Latin America and the Caribbean",
      }),
    );
    assertEntityProperties(entities);

    // Assert all results sorted
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.p_outputs_open)).toBeSorted({ descending: true });

    // Assert that we only have entities from Southern Asia or Latin America and the Caribbean
    entities.forEach((entity) => {
      expect(entity).toMatchObject({
        subregion: expect.stringMatching(/Southern Asia|Latin America and the Caribbean/),
      });
    });
  });

  test("minNOutputs, maxNOutputs filter", async () => {
    const minNOutputs = 100000;
    const maxNOutputs = 200000;
    const entities = await fetchPages(
      host,
      "countries",
      new URLSearchParams({
        minNOutputs: minNOutputs.toString(),
        maxNOutputs: maxNOutputs.toString(),
      }),
    );
    assertEntityProperties(entities);

    // Assert all results sorted
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.p_outputs_open)).toBeSorted({ descending: true });

    // Check that results are within expected range
    entities.forEach((entity) => {
      expect(entity.stats.n_outputs).toBeGreaterThanOrEqual(minNOutputs);
      expect(entity.stats.n_outputs).toBeLessThanOrEqual(maxNOutputs);
    });
  });

  test("minPOutputsOpen, maxPOutputsOpen", async () => {
    const minPOutputsOpen = 50;
    const maxPOutputsOpen = 90;
    const entities = await fetchPages(
      host,
      "countries",
      new URLSearchParams({
        minPOutputsOpen: minPOutputsOpen.toString(),
        maxPOutputsOpen: maxPOutputsOpen.toString(),
      }),
    );
    assertEntityProperties(entities);

    // Assert all results sorted
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.p_outputs_open)).toBeSorted({ descending: true });

    // Assert that we only have entities from Oceania and Americas
    entities.forEach((entity) => {
      expect(entity.stats.p_outputs_open).toBeGreaterThanOrEqual(minPOutputsOpen);
      expect(entity.stats.p_outputs_open).toBeLessThanOrEqual(maxPOutputsOpen);
    });
  });

  test("orderBy string, orderDir asc", async () => {
    const entities = await fetchPages(
      host,
      "countries",
      new URLSearchParams({
        orderBy: "name",
        orderDir: "asc",
      }),
    );
    assertEntityProperties(entities);

    // Check sorted in ascending order after fetching all pages
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.name)).toBeSorted({ descending: false, compare: localeCompare });
  });

  test("orderBy string, orderDir dsc", async () => {
    const entities = await fetchPages(
      host,
      "countries",
      new URLSearchParams({
        orderBy: "name",
        orderDir: "dsc",
      }),
    );
    assertEntityProperties(entities);

    // Check sorted in descending order after fetching all pages
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.name)).toBeSorted({ descending: true, compare: localeCompare });
  });

  test("orderBy numeric, orderDir asc", async () => {
    const entities = await fetchPages(
      host,
      "countries",
      new URLSearchParams({
        orderBy: "n_outputs",
        orderDir: "asc",
      }),
    );
    assertEntityProperties(entities);

    // Check sorted in ascending order after fetching all pages
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.n_outputs)).toBeSorted({ descending: false });
  });

  test("orderBy numeric, orderDir dsc", async () => {
    const entities = await fetchPages(
      host,
      "countries",
      new URLSearchParams({
        orderBy: "n_outputs",
        orderDir: "dsc",
      }),
    );
    assertEntityProperties(entities);

    // Check sorted in descending order after fetching all pages
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.n_outputs)).toBeSorted({ descending: true });
  });
});

describe("institutions API endpoint", () => {
  test("widest filters", async () => {
    let entities = await fetchPages(host, "institutions", new URLSearchParams({}));
    assertEntityProperties(entities);
    expect(entities.length).toBe(200);
    for (const entity of entities) {
      expect(entity.entity_type).toBe("institution");
    }
  });

  test("ids filter", async () => {
    let entities = await fetchPages(
      host,
      "institutions",
      new URLSearchParams({
        ids: "050gfgn67,04v9m3h35",
      }),
    );
    assertEntityProperties(entities);

    // Assert that we only have 050gfgn67 and 04v9m3h35
    expect(entities.length).toBe(2);
    entities.forEach((entity) => {
      expect(entity).toMatchObject({ id: expect.stringMatching(/050gfgn67|04v9m3h35/) });
    });
  });

  test("regions filter", async () => {
    const entities = await fetchPages(
      host,
      "institutions",
      new URLSearchParams({
        regions: "Oceania,Americas",
      }),
    );
    assertEntityProperties(entities);

    // Assert all results sorted
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.p_outputs_open)).toBeSorted({ descending: true });

    // Assert that we only have entities from Oceania and Americas
    entities.forEach((entity) => {
      expect(entity).toMatchObject({ region: expect.stringMatching(/Oceania|Americas/) });
    });
  });

  test("subregions filter", async () => {
    const entities = await fetchPages(
      host,
      "institutions",
      new URLSearchParams({
        subregions: "Southern Asia,Latin America and the Caribbean",
      }),
    );
    assertEntityProperties(entities);

    // Assert all results sorted
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.p_outputs_open)).toBeSorted({ descending: true });

    // Assert that we only have entities from Southern Asia or Latin America and the Caribbean
    entities.forEach((entity) => {
      expect(entity).toMatchObject({
        subregion: expect.stringMatching(/Southern Asia|Latin America and the Caribbean/),
      });
    });
  });

  test("minNOutputs, maxNOutputs filter", async () => {
    const minNOutputs = 1705;
    const maxNOutputs = 3252;
    const entities = await fetchPages(
      host,
      "institutions",
      new URLSearchParams({
        minNOutputs: minNOutputs.toString(),
        maxNOutputs: maxNOutputs.toString(),
      }),
    );
    assertEntityProperties(entities);

    // Assert all results sorted
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.p_outputs_open)).toBeSorted({ descending: true });

    // Check that results are within expected range
    entities.forEach((entity) => {
      expect(entity.stats.n_outputs).toBeGreaterThanOrEqual(minNOutputs);
      expect(entity.stats.n_outputs).toBeLessThanOrEqual(maxNOutputs);
    });
  });

  test("minPOutputsOpen, maxPOutputsOpen filter", async () => {
    const minPOutputsOpen = 98;
    const maxPOutputsOpen = 99;
    const entities = await fetchPages(
      host,
      "institutions",
      new URLSearchParams({
        minPOutputsOpen: minPOutputsOpen.toString(),
        maxPOutputsOpen: maxPOutputsOpen.toString(),
      }),
    );
    assertEntityProperties(entities);

    // Assert all results sorted
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.p_outputs_open)).toBeSorted({ descending: true });

    // Assert that we only have entities from Oceania and Americas
    entities.forEach((entity) => {
      expect(entity.stats.p_outputs_open).toBeGreaterThanOrEqual(minPOutputsOpen);
      expect(entity.stats.p_outputs_open).toBeLessThanOrEqual(maxPOutputsOpen);
    });
  });

  test(
    "countries filter",
    async () => {
      const endpoint = "institutions";
      let results = await fetchAll(endpoint, "&countries=AUS,NZL");

      // Assert all results sorted
      expect(results.length).toBeGreaterThan(0);
      expect(results.map((x) => x.stats.p_outputs_open)).toBeSorted({ descending: true });

      // Assert that we only have entities from Oceania and Americas
      results.forEach((entity) => {
        expect(entity).toMatchObject({ country_name: expect.stringMatching(/Australia|New Zealand/) });
      });
    },
    institutionTestTimeout,
  );

  test(
    "institution_type filter",
    async () => {
      const endpoint = "institutions";
      let results = await fetchAll(endpoint, "&institutionTypes=Education,Government");

      // Assert all results sorted
      expect(results.length).toBeGreaterThan(0);
      expect(results.map((x) => x.stats.p_outputs_open)).toBeSorted({ descending: true });

      // Assert that we only have entities from Oceania and Americas
      results.forEach((entity) => {
        expect(entity.institution_type).toBeDefined();
        expect(entity.institution_type).toMatch(/Education|Government/);
      });
    },
    institutionTestTimeout,
  );

  test("orderBy string, orderDir asc", async () => {
    const entities = await fetchPages(
      host,
      "institutions",
      new URLSearchParams({
        orderBy: "name",
        orderDir: "asc",
      }),
    );
    assertEntityProperties(entities);

    // Check sorted in ascending order after fetching all pages
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.name)).toBeSorted({ descending: false, compare: localeCompare });
  });

  test("orderBy string, orderDir dsc", async () => {
    const entities = await fetchPages(
      host,
      "institutions",
      new URLSearchParams({
        orderBy: "name",
        orderDir: "dsc",
      }),
    );
    assertEntityProperties(entities);

    // Check sorted in descending order after fetching all pages
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.name)).toBeSorted({
      descending: true,
      compare: localeCompare,
    });
  });

  test("orderBy numeric, orderDir asc", async () => {
    const entities = await fetchPages(
      host,
      "institutions",
      new URLSearchParams({
        orderBy: "n_outputs",
        orderDir: "asc",
      }),
    );
    assertEntityProperties(entities);

    // Check sorted in ascending order after fetching all pages
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.n_outputs)).toBeSorted({ descending: false });
  });

  test("orderBy numeric, orderDir dsc", async () => {
    const entities = await fetchPages(
      host,
      "institutions",
      new URLSearchParams({
        orderBy: "n_outputs",
        orderDir: "dsc",
      }),
    );
    assertEntityProperties(entities);

    // Check sorted in descending order after fetching all pages
    expect(entities.length).toBeGreaterThan(0);
    expect(entities.map((x) => x.stats.n_outputs)).toBeSorted({ descending: true });
  });
});

describe("search API endpoint", () => {
  test("search with no :text parameter returns 404 not found", async () => {
    const res = await handleRequest(new Request(`${host}/search`), env, ctx); // no :text parameter
    expect(res.status).toBe(404);
  });

  test("search country", async () => {
    const res = await handleRequest(new Request(`${host}/search/australia?limit=1`), env, ctx);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.items.length).toBe(1);
    expect(json).toMatchObject({
      items: [
        {
          id: "AUS",
          name: "Australia",
          logo_sm: "logos/country/sm/AUS.svg",
          entity_type: "country",
          subregion: "Australia and New Zealand",
          region: "Oceania",
          stats: {
            n_outputs: expect.any(Number),
            n_outputs_open: expect.any(Number),
            n_outputs_black: expect.any(Number),
            p_outputs_open: expect.any(Number),
            p_outputs_publisher_open_only: expect.any(Number),
            p_outputs_both: expect.any(Number),
            p_outputs_other_platform_open_only: expect.any(Number),
            p_outputs_closed: expect.any(Number),
            p_outputs_black: expect.any(Number),
          },
        },
      ],
      nItems: expect.any(Number),
      page: expect.any(Number),
      limit: 1,
    });
  });

  test("search institution", async () => {
    const res = await handleRequest(new Request(`${host}/search/astro%203d?limit=1`), env, ctx);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.items.length).toBe(1);
    expect(json).toMatchObject({
      items: [
        {
          id: "00e7apb48",
          name: "ASTRO-3D",
          logo_sm: "logos/institution/sm/00e7apb48.jpg",
          entity_type: "institution",
          country_name: "Australia",
          country_code: "AUS",
          subregion: "Australia and New Zealand",
          region: "Oceania",
          institution_type: "Facility",
          stats: {
            n_outputs: expect.any(Number),
            n_outputs_open: expect.any(Number),
            n_outputs_black: expect.any(Number),
            p_outputs_open: expect.any(Number),
            p_outputs_publisher_open_only: expect.any(Number),
            p_outputs_both: expect.any(Number),
            p_outputs_other_platform_open_only: expect.any(Number),
            p_outputs_closed: expect.any(Number),
            p_outputs_black: expect.any(Number),
          },
        },
      ],
      nItems: expect.any(Number),
      page: expect.any(Number),
      limit: 1,
    });
  });

  test("paginate", async () => {
    const entities = await fetchPages(host, "search/a", new URLSearchParams({ limit: "10" }));
    expect(entities.length).toBeGreaterThan(20);
    assertEntityProperties(entities);
  });

  test("no text", async () => {
    const res = await handleRequest(new Request(`${host}/search/%20`), env, ctx);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toMatchObject({
      items: [],
    });
  });

  test("ascii folding: curacao ascii search returns Curaçao", async () => {
    const res = await handleRequest(new Request(`${host}/search/curacao?limit=1`), env, ctx);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toMatchObject({
      items: [
        {
          id: "CUW",
        },
      ],
    });
  });

  test("ascii folding: curaçao diacritic search returns Curaçao", async () => {
    const res = await handleRequest(new Request(`${host}/search/curaçao?limit=1`), env, ctx);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toMatchObject({
      items: [
        {
          id: "CUW",
        },
      ],
    });
  });
});

describe("download ZIP API endpoint", () => {
  test("download zip for country", async () => {
    // Get entity from local file
    const testEntity: Entity = JSON.parse(fs.readFileSync("./public/country/NZL.json", "utf-8"));

    // //Put data into KV namespace for testing
    await env.__STATIC_CONTENT.put("country/NZL.json", fs.readFileSync("./public/country/NZL.json", "utf-8"));

    // Make download request
    let res = await handleRequest(new Request(`${host}/download/country/NZL`), env, ctx);
    expect(res.status).toBe(200);

    // Decompress response.
    // Have to change to correct format for decompress package.
    const resBlob = await res.blob();
    const buffer = Buffer.from(await resBlob.arrayBuffer(), "binary");
    const tmpDir = tmp.dirSync();
    const zippedFiles: any = await decompress(buffer, tmpDir.name);

    // Check that all files are present.
    const expectedZippedFiles = ["README.md", "repositories.csv", "years.csv"];
    zippedFiles.forEach((file: any) => {
      expect(expectedZippedFiles.includes(file.path)).toBeTruthy();

      // Quickly check that the markdown file has the correct information.
      if (file.path.toString().includes("README.md")) {
        expect(file.data.toString().includes(testEntity.name)).toBeTruthy();
        expect(file.data.toString().includes(testEntity.start_year)).toBeTruthy();
        expect(file.data.toString().includes(testEntity.end_year)).toBeTruthy();
      }
    });
  });

  test("download zip for institution", async () => {
    // Get entity from local file
    const testEntity: Entity = JSON.parse(fs.readFileSync("./public/institution/030cszc07.json", "utf-8"));

    // // Put data into KV namespace for testing
    await env.__STATIC_CONTENT.put(
      "institution/030cszc07.json",
      fs.readFileSync("./public/institution/030cszc07.json", "utf-8"),
    );

    // Make download request
    let res = await handleRequest(new Request(`${host}/download/institution/030cszc07`), env, ctx);
    expect(res.status).toBe(200);

    // Decompress response.
    // Have to change to correct format for decompress package.
    const resBlob = await res.blob();
    const buffer = Buffer.from(await resBlob.arrayBuffer(), "binary");
    const tmpDir = tmp.dirSync();
    const zippedFiles: any = await decompress(buffer, tmpDir.name);

    // Check that all files are present.
    const expectedZippedFiles = ["README.md", "repositories.csv", "years.csv"];
    zippedFiles.forEach((file: any) => {
      expect(expectedZippedFiles.includes(file.path)).toBeTruthy();

      // Quickly check that the markdown file has the correct information.
      if (file.path.toString().includes("README.md")) {
        expect(file.data.toString().includes(testEntity.name)).toBeTruthy();
        expect(file.data.toString().includes(testEntity.start_year)).toBeTruthy();
        expect(file.data.toString().includes(testEntity.end_year)).toBeTruthy();
      }
    });
  });

  test("country 404 not found", async () => {
    // Put example country data into KVNamespace.
    await env.__STATIC_CONTENT.put("country/NZL.json", fs.readFileSync("./public/country/NZL.json", "utf-8"));

    // Assert that API returns a 404 for a bad country ID
    let resCountry = await handleRequest(new Request(`${host}/download/country/ABC`), env, ctx);
    expect(resCountry.status).toBe(404);
  });

  test("institution 404 not found", async () => {
    // Put example data into KVNamespace.
    await env.__STATIC_CONTENT.put(
      "institution/030cszc07.json",
      fs.readFileSync("./public/institution/030cszc07.json", "utf-8"),
    );

    // Assert that API returns a 404 for a bad institution ID
    let resInstitution = await handleRequest(new Request(`${host}/download/institution/123abcd45`), env, ctx);
    expect(resInstitution.status).toBe(404);
  });
});
