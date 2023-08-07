// Copyright 2023 Curtin University
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

import { expect, test, beforeAll, beforeEach } from "vitest";
import { searchEntities, entitiesToSQL, loadEntities, filterEntities } from "@/database";
import path from "path";
import deepcopy from "deepcopy";

const describe = setupMiniflareIsolatedStorage();
const env = getMiniflareBindings();

beforeAll(async () => {
  const db = env.__D1_BETA__DB;
  const entities = loadEntities(path.resolve(__dirname, "../fixtures"));
  const sql = entitiesToSQL(entities);
  await db.exec(sql);
});

describe("searchEntities", () => {
  const db = env.__D1_BETA__DB;
  test("1 result", async () => {
    const text = "south";
    const limit = 1;
    const results = await searchEntities(db, text, 0, 1);
    expect(results.items.length).toBe(limit);
  });

  test("5 results", async () => {
    const text = "south";
    const limit = 5;
    const results = await searchEntities(db, text, 0, limit);
    expect(results.items.length).toBe(limit);
  });

  test("paginate", async () => {
    const text = "south";
    const limit = 5;

    let results = await searchEntities(db, text, 0, limit);
    const nItems = results.nItems;
    expect(results.items.length).toBe(limit);

    results = await searchEntities(db, text, 1, limit);
    expect(results.items.length).toBe(limit);
    expect(results.nItems).toBe(nItems);

    results = await searchEntities(db, text, 2, limit);
    expect(results.items.length).toBe(limit);
    expect(results.nItems).toBe(nItems);
  });

  test("no text", async () => {
    const text = "";
    const limit = 5;
    const results = await searchEntities(db, text, 0, limit);
    expect(results.items.length).toBe(0);
  });

  test("ascii folding", async () => {
    expect(false).toBe(true);
  });

  test("search australia", async () => {
    // Check country results schema
    const text = "australia";
    const limit = 1;
    const result = await searchEntities(db, text, 0, limit);
    const expectedCountry = {
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
    };
    expect(result.items[0]).toMatchObject(expectedCountry);
  });

  test("search curtin", async () => {
    // Check institution results schema
    const text = "astro 3d";
    const limit = 1;
    const result = await searchEntities(db, text, 0, limit);
    const expectedInstitution = {
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
    };
    expect(result.items[0]).toMatchObject(expectedInstitution);
  });
});

describe("filterEntities", () => {
  const db = env.__D1_BETA__DB;
  const defaultQuery = {
    ids: new Set<string>(),
    countries: new Set<string>(),
    subregions: new Set<string>(),
    regions: new Set<string>(),
    institutionTypes: new Set<string>(),
    minNOutputs: 0,
    maxNOutputs: Number.MAX_VALUE,
    minPOutputsOpen: 0,
    maxPOutputsOpen: 100,
    minNOutputsOpen: 0,
    maxNOutputsOpen: Number.MAX_VALUE,
    page: 0,
    limit: 1000,
    orderBy: "p_outputs_open",
    orderDir: "asc",
  };

  test("country: widest filters", async () => {
    const results = await filterEntities("country", db, defaultQuery);
    expect(results.items.length).toBe(221);
    expect(results.nItems).toBe(221);
    for (const entity of results.items) {
      expect(entity.entity_type).toBeDefined();
      expect(entity.entity_type).toBe("country");
    }
  });

  test("country: ids filter", async () => {
    const query = deepcopy(defaultQuery);
    query.ids.add("BGR");
    query.ids.add("AUS");
    const results = await filterEntities("country", db, query);
    const expectedLength = 2;
    expect(results.items.length).toBe(expectedLength);
    expect(results.items).toMatchObject([{ id: "AUS" }, { id: "BGR" }]);
  });

  test("country: subregion filter", async () => {
    // Western Asia
    const query = deepcopy(defaultQuery);
    query.subregions.add("Western Asia");
    let results = await filterEntities("country", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.subregion).toBeDefined();
      expect(entity.subregion).toBe("Western Asia");
    }

    // Western Asia or Eastern Europe
    query.subregions.add("Eastern Europe");
    results = await filterEntities("country", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.subregion).toBeDefined();
      expect(["Western Asia", "Eastern Europe"]).toContain(entity.subregion);
    }
  });

  test("country: region filter", async () => {
    // Americas
    const query = deepcopy(defaultQuery);
    query.regions.add("Americas");
    let results = await filterEntities("country", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.region).toBeDefined();
      expect(entity.region).toBe("Americas");
    }

    // Americas or Europe
    query.regions.add("Europe");
    results = await filterEntities("country", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.region).toBeDefined();
      expect(["Americas", "Europe"]).toContain(entity.region);
    }
  });

  test("country: number of outputs filter", async () => {
    const query = deepcopy(defaultQuery);
    query.minNOutputs = 1705;
    query.maxNOutputs = 3252;
    let results = await filterEntities("country", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.stats.n_outputs).toBeDefined();
      expect(entity.stats.n_outputs).toBeGreaterThanOrEqual(query.minNOutputs);
      expect(entity.stats.n_outputs).toBeLessThanOrEqual(query.maxNOutputs);
    }
  });

  test("country: percentage of outputs filter", async () => {
    const query = deepcopy(defaultQuery);
    query.minPOutputsOpen = 28;
    query.maxPOutputsOpen = 40;
    const results = await filterEntities("country", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.stats.p_outputs_open).toBeDefined();
      expect(entity.stats.p_outputs_open).toBeGreaterThanOrEqual(query.minPOutputsOpen);
      expect(entity.stats.p_outputs_open).toBeLessThanOrEqual(query.maxPOutputsOpen);
    }
  });

  test("institution: widest filters", async () => {
    const results = await filterEntities("institution", db, defaultQuery);
    expect(results.items.length).toBe(200);
    expect(results.nItems).toBe(200);
    for (const entity of results.items) {
      expect(entity.entity_type).toBeDefined();
      expect(entity.entity_type).toBe("institution");
    }
  });

  test("institution: ids filter", async () => {
    const query = deepcopy(defaultQuery);
    query.ids.add("050gfgn67");
    query.ids.add("04v9m3h35");
    const results = await filterEntities("institution", db, query);
    const expectedLength = 2;
    expect(results.items.length).toBe(expectedLength);
    expect(results.items).toMatchObject([{ id: "04v9m3h35" }, { id: "050gfgn67" }]);
  });

  test("institution: subregion filter", async () => {
    // Western Asia
    const query = deepcopy(defaultQuery);
    query.subregions.add("Western Asia");
    let results = await filterEntities("country", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.subregion).toBeDefined();
      expect(entity.subregion).toBe("Western Asia");
    }

    // Western Asia or Eastern Europe
    query.subregions.add("Eastern Europe");
    results = await filterEntities("country", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.subregion).toBeDefined();
      expect(["Western Asia", "Eastern Europe"]).toContain(entity.subregion);
    }
  });

  test("institution: region filter", async () => {
    // Americas
    const query = deepcopy(defaultQuery);
    query.regions.add("Americas");
    let results = await filterEntities("institution", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.region).toBeDefined();
      expect(entity.region).toBe("Americas");
    }

    // Americas or Europe
    query.regions.add("Europe");
    results = await filterEntities("institution", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.region).toBeDefined();
      expect(["Americas", "Europe"]).toContain(entity.region);
    }
  });

  test("institution: number of outputs filter", async () => {
    const query = deepcopy(defaultQuery);
    query.minNOutputs = 1705;
    query.maxNOutputs = 3252;
    let results = await filterEntities("institution", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.stats.n_outputs).toBeDefined();
      expect(entity.stats.n_outputs).toBeGreaterThanOrEqual(query.minNOutputs);
      expect(entity.stats.n_outputs).toBeLessThanOrEqual(query.maxNOutputs);
    }
  });

  test("institution: percentage of outputs filter", async () => {
    const query = deepcopy(defaultQuery);
    query.minPOutputsOpen = 98;
    query.maxPOutputsOpen = 99;
    const results = await filterEntities("institution", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.stats.p_outputs_open).toBeDefined();
      expect(entity.stats.p_outputs_open).toBeGreaterThanOrEqual(query.minPOutputsOpen);
      expect(entity.stats.p_outputs_open).toBeLessThanOrEqual(query.maxPOutputsOpen);
    }
  });

  test("institution: countries filter", async () => {
    // GBR
    const query = deepcopy(defaultQuery);
    query.countries.add("GBR");
    let results = await filterEntities("institution", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.country_name).toBeDefined();
      expect(entity.country_code).toBeDefined();
      expect(entity.country_name).toBe("United Kingdom");
      expect(entity.country_code).toBe("GBR");
    }

    // GBR or USA
    query.countries.add("USA");
    results = await filterEntities("institution", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.country_name).toBeDefined();
      expect(entity.country_code).toBeDefined();
      expect(["United Kingdom", "United States"]).toContain(entity.country_name);
      expect(["GBR", "USA"]).toContain(entity.country_code);
    }
  });

  test("institution: institution types filter", async () => {
    // Education
    let query = deepcopy(defaultQuery);
    query.institutionTypes.add("Education");
    let results = await filterEntities("institution", db, query);
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.institution_type).toBeDefined();
      expect(entity.institution_type).toBe("Education");
    }

    // Education or Facility
    query.institutionTypes.add("Facility");
    expect(results.items.length).toBeGreaterThan(0);
    for (const entity of results.items) {
      expect(entity.institution_type).toBeDefined();
      expect(["Education", "Facility"]).toContain(entity.institution_type);
    }

    // Test that countries and institution type filters do nothing to countries
    query = deepcopy(defaultQuery);
    query.countries.add("GBR");
    query.institutionTypes.add("Facility");
    results = await filterEntities("country", db, query);
    expect(results.items.length).toBe(221);
  });

  test("paginate: orderBy string, orderDir dsc", () => {
    expect(false).toBe(true);
  });

  test("paginate: orderBy string, orderDir asc", () => {
    expect(false).toBe(true);
  });

  test("paginate: orderBy numeric, orderDir dsc", () => {
    expect(false).toBe(true);
  });

  test("paginate: orderBy numeric, orderDir asc", () => {
    expect(false).toBe(true);
  });

  // test("paginate: orderDir dsc", () => {
  //   let pageSettings = {
  //     page: 0,
  //     limit: 2,
  //     orderBy: "open",
  //     orderDir: "dsc",
  //   };
  //
  //   // Page 0 descending
  //   let results = paginateResults(entities, pageSettings);
  //   let expected = [
  //     {
  //       name: "E",
  //       open: 100,
  //     },
  //     {
  //       name: "B",
  //       open: 10,
  //     },
  //   ];
  //   expect(results).toMatchObject(expected);
  //
  //   // Page 1 descending
  //   pageSettings.page = 1;
  //   results = paginateResults(entities, pageSettings);
  //   expected = [
  //     {
  //       name: "C",
  //       open: 7,
  //     },
  //     {
  //       name: "F",
  //       open: 4,
  //     },
  //   ];
  //   expect(results).toMatchObject(expected);
  //
  //   // Page 2 descending
  //   pageSettings.page = 2;
  //   results = paginateResults(entities, pageSettings);
  //   expected = [
  //     {
  //       name: "D",
  //       open: 3,
  //     },
  //     {
  //       name: "A",
  //       open: 1,
  //     },
  //   ];
  //   expect(results).toMatchObject(expected);
  //
  //   // Page 2 descending
  //   pageSettings.page = 3;
  //   results = paginateResults(entities, pageSettings);
  //   expected = [];
  //   expect(results).toMatchObject(expected);
  // });
  //
  // test("test paginateResults dsc name", () => {
  //   let pageSettings = {
  //     page: 0,
  //     limit: 2,
  //     orderBy: "name",
  //     orderDir: "dsc",
  //   };
  //
  //   // Page 0 dsc
  //   let results = paginateResults(entities, pageSettings);
  //   let expected = [
  //     {
  //       name: "F",
  //       open: 4,
  //     },
  //     {
  //       name: "E",
  //       open: 100,
  //     },
  //   ];
  //   expect(results).toMatchObject(expected);
  //
  //   // Page 1 dsc
  //   pageSettings.page = 1;
  //   results = paginateResults(entities, pageSettings);
  //   expected = [
  //     {
  //       name: "D",
  //       open: 3,
  //     },
  //     {
  //       name: "C",
  //       open: 7,
  //     },
  //   ];
  //   expect(results).toMatchObject(expected);
  //
  //   // Page 2 dsc
  //   pageSettings.page = 2;
  //   results = paginateResults(entities, pageSettings);
  //   expected = [
  //     {
  //       name: "B",
  //       open: 10,
  //     },
  //     {
  //       name: "A",
  //       open: 1,
  //     },
  //   ];
  //   expect(results).toMatchObject(expected);
  //
  //   // Page 3 dsc
  //   pageSettings.page = 3;
  //   results = paginateResults(entities, pageSettings);
  //   expected = [];
  //   expect(results).toMatchObject(expected);
  // });
  //
  // test("test paginateResults asc", () => {
  //   let pageSettings = {
  //     page: 0,
  //     limit: 2,
  //     orderBy: "open",
  //     orderDir: "asc",
  //   };
  //
  //   // Page 0 asc
  //   let results = paginateResults(entities, pageSettings);
  //   let expected = [
  //     {
  //       name: "A",
  //       open: 1,
  //     },
  //     {
  //       name: "D",
  //       open: 3,
  //     },
  //   ];
  //   expect(results).toMatchObject(expected);
  //
  //   // Page 1 asc
  //   pageSettings.page = 1;
  //   results = paginateResults(entities, pageSettings);
  //   expected = [
  //     {
  //       name: "F",
  //       open: 4,
  //     },
  //     {
  //       name: "C",
  //       open: 7,
  //     },
  //   ];
  //   expect(results).toMatchObject(expected);
  //
  //   // Page 2 asc
  //   pageSettings.page = 2;
  //   results = paginateResults(entities, pageSettings);
  //   expected = [
  //     {
  //       name: "B",
  //       open: 10,
  //     },
  //     {
  //       name: "E",
  //       open: 100,
  //     },
  //   ];
  //   expect(results).toMatchObject(expected);
  //
  //   // Page 3 asc
  //   pageSettings.page = 3;
  //   results = paginateResults(entities, pageSettings);
  //   expected = [];
  //   expect(results).toMatchObject(expected);
  // });
  //
  // test("test paginateResults nested orderBy", () => {
  //   let pageSettings = {
  //     page: 0,
  //     limit: 2,
  //     orderBy: "stats.open",
  //     orderDir: "dsc",
  //   };
  //
  //   const entities = [
  //     {
  //       name: "A",
  //       stats: {
  //         open: 1,
  //       },
  //     },
  //     {
  //       name: "B",
  //       stats: {
  //         open: 10,
  //       },
  //     },
  //     {
  //       name: "C",
  //       stats: {
  //         open: 7,
  //       },
  //     },
  //     {
  //       name: "D",
  //       stats: {
  //         open: 3,
  //       },
  //     },
  //     {
  //       name: "E",
  //       stats: {
  //         open: 100,
  //       },
  //     },
  //     {
  //       name: "F",
  //       stats: {
  //         open: 4,
  //       },
  //     },
  //   ];
  //
  //   // Page 0 dsc
  //   let results = paginateResults(entities, pageSettings);
  //   let expected = [
  //     {
  //       name: "E",
  //       stats: {
  //         open: 100,
  //       },
  //     },
  //     {
  //       name: "B",
  //       stats: {
  //         open: 10,
  //       },
  //     },
  //   ];
  //   expect(results).toMatchObject(expected);
  // });
});
