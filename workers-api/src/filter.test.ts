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

import { expect, test, describe } from "vitest";
import { parseQuery } from "@/filter";

describe("parseQuery", () => {
  test("test default values", () => {
    const input = {};
    const settings = parseQuery(input);
    const expected = {
      ids: new Set<string>(),
      countries: new Set<string>(),
      subregions: new Set<string>(),
      regions: new Set<string>(),
      institutionTypes: new Set<string>(),
      minNOutputs: 0,
      maxNOutputs: Number.MAX_VALUE,
      minPOutputsOpen: 0,
      maxPOutputsOpen: 100,
      page: 0,
      limit: 100,
      orderBy: "stats.p_outputs_open",
      orderDir: "dsc",
    };
    expect(settings).toMatchObject(expected);
  });

  test("test string input values", () => {
    const input = {
      ids: "02n415q13,03b94tp07",
      countries: "NZL,AUS",
      subregions: "Australia and New Zealand",
      regions: "Oceania",
      institutionTypes: "Education",
      minNOutputs: "1000",
      maxNOutputs: "10000",
      minPOutputsOpen: "0",
      maxPOutputsOpen: "100",
      page: "0",
      limit: "100",
      orderBy: "stats.p_outputs_open",
      orderDir: "dsc",
    };
    const settings = parseQuery(input);
    const expected = {
      ids: new Set(["02n415q13", "03b94tp07"]),
      countries: new Set(["NZL", "AUS"]),
      subregions: new Set(["Australia and New Zealand"]),
      regions: new Set(["Oceania"]),
      institutionTypes: new Set(["Education"]),
      minNOutputs: 1000,
      maxNOutputs: 10000,
      minPOutputsOpen: 0,
      maxPOutputsOpen: 100,
      page: 0,
      limit: 100,
      orderBy: "stats.p_outputs_open",
      orderDir: "dsc",
    };
    expect(settings).toMatchObject(expected);
  });

  test("test set minimum values", () => {
    const input = {
      minNOutputs: "-1",
      maxNOutputs: "-1",
      minPOutputsOpen: "-1",
      maxPOutputsOpen: "-1",
      page: "-1",
      limit: "0",
      orderBy: "stats.p_outputs_open",
      orderDir: "dsc",
    };
    const expected = {
      countries: new Set<string>(),
      subregions: new Set<string>(),
      regions: new Set<string>(),
      institutionTypes: new Set<string>(),
      minNOutputs: 0,
      maxNOutputs: 0,
      minPOutputsOpen: 0,
      maxPOutputsOpen: 0,
      page: 0,
      limit: 1,
      orderBy: "stats.p_outputs_open",
      orderDir: "dsc",
    };
    const settings = parseQuery(input);
    expect(settings).toMatchObject(expected);
  });

  test("test set maximum values", () => {
    const input = {
      minPOutputsOpen: "101",
      maxPOutputsOpen: "101",
      page: "1",
      limit: "101",
      orderBy: "stats.p_outputs_open",
      orderDir: "dsc",
    };
    const expected = {
      countries: new Set<string>(),
      subregions: new Set<string>(),
      regions: new Set<string>(),
      institutionTypes: new Set<string>(),
      minNOutputs: 0,
      maxNOutputs: Number.MAX_VALUE,
      minPOutputsOpen: 100,
      maxPOutputsOpen: 100,
      page: 1,
      limit: 100,
      orderBy: "stats.p_outputs_open",
      orderDir: "dsc",
    };
    const settings = parseQuery(input);
    expect(settings).toMatchObject(expected);
  });
});
