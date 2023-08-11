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
});
