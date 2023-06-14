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

import {
  ArrayView,
  countries,
  filterResults,
  institutions,
  paginateResults,
  parsePageSettings,
  parseQuery,
} from "./filter";
import { Entity, FilterQuery, Query } from "./types";
import deepcopy from "deepcopy";

test("test parsePageSettings", () => {
  // Default values
  let input = {};
  let settings = parsePageSettings(input);
  let expected = {
    page: 0,
    limit: 100,
    orderBy: "stats.p_outputs_open",
    orderDir: "dsc",
  };
  expect(settings).toMatchObject(expected);

  // String input values
  input = {
    page: "0",
    limit: "100",
    orderBy: "stats.p_outputs_open",
    orderDir: "dsc",
  };
  settings = parsePageSettings(input);
  expect(settings).toMatchObject(expected);

  // Set minimum values
  input = {
    page: "-1",
    limit: "0",
    orderBy: "stats.p_outputs_open",
    orderDir: "dsc",
  };
  expected = {
    page: 0,
    limit: 1,
    orderBy: "stats.p_outputs_open",
    orderDir: "dsc",
  };
  settings = parsePageSettings(input);
  expect(settings).toMatchObject(expected);

  // Set maximum values
  input = {
    page: "1",
    limit: "101",
    orderBy: "stats.p_outputs_open",
    orderDir: "dsc",
  };
  expected = {
    page: 1,
    limit: 100,
    orderBy: "stats.p_outputs_open",
    orderDir: "dsc",
  };
  settings = parsePageSettings(input);
  expect(settings).toMatchObject(expected);
});

test("test parseQuery", () => {
  // Default values
  let input = {};
  let settings = parseQuery(input);
  let expected = {
    ids: new Set<string>(),
    countries: new Set<string>(),
    subregions: new Set<string>(),
    regions: new Set<string>(),
    institutionTypes: new Set<string>(),
    minNOutputs: 0,
    maxNOutputs: Number.MAX_VALUE,
    minPOutputsOpen: 0,
    maxPOutputsOpen: 100,
  };
  expect(settings).toMatchObject(expected);

  // String input values
  input = {
    ids: "02n415q13,03b94tp07",
    countries: "NZL,AUS",
    subregions: "Australia and New Zealand",
    regions: "Oceania",
    institutionTypes: "Education",
    minNOutputs: "1000",
    maxNOutputs: "10000",
    minPOutputsOpen: "0",
    maxPOutputsOpen: "100",
  } as FilterQuery;
  settings = parseQuery(input);
  expected = {
    ids: new Set(["02n415q13", "03b94tp07"]),
    countries: new Set(["NZL", "AUS"]),
    subregions: new Set(["Australia and New Zealand"]),
    regions: new Set(["Oceania"]),
    institutionTypes: new Set(["Education"]),
    minNOutputs: 1000,
    maxNOutputs: 10000,
    minPOutputsOpen: 0,
    maxPOutputsOpen: 100,
  } as Query;
  expect(settings).toMatchObject(expected);

  // Min values
  input = {
    minNOutputs: "-1",
    maxNOutputs: "-1",
    minPOutputsOpen: "-1",
    maxPOutputsOpen: "-1",
  } as FilterQuery;
  settings = parseQuery(input);
  expected = {
    countries: new Set<string>(),
    subregions: new Set<string>(),
    regions: new Set<string>(),
    institutionTypes: new Set<string>(),
    minNOutputs: 0,
    maxNOutputs: 0,
    minPOutputsOpen: 0,
    maxPOutputsOpen: 0,
  } as Query;
  expect(settings).toMatchObject(expected);

  // Max values
  input = {
    minPOutputsOpen: "101",
    maxPOutputsOpen: "101",
  } as FilterQuery;
  settings = parseQuery(input);
  expected = {
    countries: new Set<string>(),
    subregions: new Set<string>(),
    regions: new Set<string>(),
    institutionTypes: new Set<string>(),
    minNOutputs: 0,
    maxNOutputs: Number.MAX_VALUE,
    minPOutputsOpen: 100,
    maxPOutputsOpen: 100,
  } as Query;
  expect(settings).toMatchObject(expected);
});

test("test countries", () => {
  // Test that only country type in countries
  expect(countries).toBeDefined();
  for (let i = 0; i < countries.length; i++) {
    let entity = countries.get(i);
    expect(entity.entity_type).toBeDefined();
    expect(entity.entity_type).toBe("country");
  }
});

test("test institutions", () => {
  // Test that only institution type in institutions
  expect(institutions).toBeDefined();
  for (let i = 0; i < institutions.length; i++) {
    let entity = institutions.get(i);
    expect(entity.entity_type).toBeDefined();
    expect(entity.entity_type).toBe("institution");
  }
});

const entities = [
  {
    name: "A",
    open: 1,
  },
  {
    name: "B",
    open: 10,
  },
  {
    name: "C",
    open: 7,
  },
  {
    name: "D",
    open: 3,
  },
  {
    name: "E",
    open: 100,
  },
  {
    name: "F",
    open: 4,
  },
];

test("test paginateResults dsc", () => {
  let pageSettings = {
    page: 0,
    limit: 2,
    orderBy: "open",
    orderDir: "dsc",
  };

  // Page 0 descending
  let results = paginateResults(entities, pageSettings);
  let expected = [
    {
      name: "E",
      open: 100,
    },
    {
      name: "B",
      open: 10,
    },
  ];
  expect(results).toMatchObject(expected);

  // Page 1 descending
  pageSettings.page = 1;
  results = paginateResults(entities, pageSettings);
  expected = [
    {
      name: "C",
      open: 7,
    },
    {
      name: "F",
      open: 4,
    },
  ];
  expect(results).toMatchObject(expected);

  // Page 2 descending
  pageSettings.page = 2;
  results = paginateResults(entities, pageSettings);
  expected = [
    {
      name: "D",
      open: 3,
    },
    {
      name: "A",
      open: 1,
    },
  ];
  expect(results).toMatchObject(expected);

  // Page 2 descending
  pageSettings.page = 3;
  results = paginateResults(entities, pageSettings);
  expected = [];
  expect(results).toMatchObject(expected);
});

test("test paginateResults dsc name", () => {
  let pageSettings = {
    page: 0,
    limit: 2,
    orderBy: "name",
    orderDir: "dsc",
  };

  // Page 0 dsc
  let results = paginateResults(entities, pageSettings);
  let expected = [
    {
      name: "F",
      open: 4,
    },
    {
      name: "E",
      open: 100,
    },
  ];
  expect(results).toMatchObject(expected);

  // Page 1 dsc
  pageSettings.page = 1;
  results = paginateResults(entities, pageSettings);
  expected = [
    {
      name: "D",
      open: 3,
    },
    {
      name: "C",
      open: 7,
    },
  ];
  expect(results).toMatchObject(expected);

  // Page 2 dsc
  pageSettings.page = 2;
  results = paginateResults(entities, pageSettings);
  expected = [
    {
      name: "B",
      open: 10,
    },
    {
      name: "A",
      open: 1,
    },
  ];
  expect(results).toMatchObject(expected);

  // Page 3 dsc
  pageSettings.page = 3;
  results = paginateResults(entities, pageSettings);
  expected = [];
  expect(results).toMatchObject(expected);
});

test("test paginateResults asc", () => {
  let pageSettings = {
    page: 0,
    limit: 2,
    orderBy: "open",
    orderDir: "asc",
  };

  // Page 0 asc
  let results = paginateResults(entities, pageSettings);
  let expected = [
    {
      name: "A",
      open: 1,
    },
    {
      name: "D",
      open: 3,
    },
  ];
  expect(results).toMatchObject(expected);

  // Page 1 asc
  pageSettings.page = 1;
  results = paginateResults(entities, pageSettings);
  expected = [
    {
      name: "F",
      open: 4,
    },
    {
      name: "C",
      open: 7,
    },
  ];
  expect(results).toMatchObject(expected);

  // Page 2 asc
  pageSettings.page = 2;
  results = paginateResults(entities, pageSettings);
  expected = [
    {
      name: "B",
      open: 10,
    },
    {
      name: "E",
      open: 100,
    },
  ];
  expect(results).toMatchObject(expected);

  // Page 3 asc
  pageSettings.page = 3;
  results = paginateResults(entities, pageSettings);
  expected = [];
  expect(results).toMatchObject(expected);
});

test("test paginateResults nested orderBy", () => {
  let pageSettings = {
    page: 0,
    limit: 2,
    orderBy: "stats.open",
    orderDir: "dsc",
  };

  const entities = [
    {
      name: "A",
      stats: {
        open: 1,
      },
    },
    {
      name: "B",
      stats: {
        open: 10,
      },
    },
    {
      name: "C",
      stats: {
        open: 7,
      },
    },
    {
      name: "D",
      stats: {
        open: 3,
      },
    },
    {
      name: "E",
      stats: {
        open: 100,
      },
    },
    {
      name: "F",
      stats: {
        open: 4,
      },
    },
  ];

  // Page 0 dsc
  let results = paginateResults(entities, pageSettings);
  let expected = [
    {
      name: "E",
      stats: {
        open: 100,
      },
    },
    {
      name: "B",
      stats: {
        open: 10,
      },
    },
  ];
  expect(results).toMatchObject(expected);
});

const testCountries = [
  {
    id: "ALB",
    name: "Albania",
    logo_sm: "/logos/country/s/ALB.svg",
    entity_type: "country",
    subregion: "Southern Europe",
    region: "Europe",
    acronyms: [],
    stats: {
      n_outputs: 3252,
      n_outputs_open: 1735,
      p_outputs_open: 53.35178351783518,
      p_outputs_publisher_open_only: 22.0,
      p_outputs_both: 23.0,
      p_outputs_other_platform_open_only: 8.0,
      p_outputs_closed: 47.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "ARE",
    name: "United Arab Emirates",
    logo_sm: "/logos/country/s/ARE.svg",
    entity_type: "country",
    subregion: "Western Asia",
    region: "Asia",
    acronyms: [],
    stats: {
      n_outputs: 53121,
      n_outputs_open: 18712,
      p_outputs_open: 35.22524048869562,
      p_outputs_publisher_open_only: 12.0,
      p_outputs_both: 16.0,
      p_outputs_other_platform_open_only: 7.0,
      p_outputs_closed: 65.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "ARG",
    name: "Argentina",
    logo_sm: "/logos/country/s/ARG.svg",
    entity_type: "country",
    subregion: "Latin America and the Caribbean",
    region: "Americas",
    acronyms: [],
    stats: {
      n_outputs: 167906,
      n_outputs_open: 82878,
      p_outputs_open: 49.35976081855324,
      p_outputs_publisher_open_only: 13.0,
      p_outputs_both: 26.0,
      p_outputs_other_platform_open_only: 11.0,
      p_outputs_closed: 50.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "ARM",
    name: "Armenia",
    logo_sm: "/logos/country/s/ARM.svg",
    entity_type: "country",
    subregion: "Western Asia",
    region: "Asia",
    acronyms: [],
    stats: {
      n_outputs: 11081,
      n_outputs_open: 4500,
      p_outputs_open: 40.61005324429203,
      p_outputs_publisher_open_only: 8.0,
      p_outputs_both: 21.0,
      p_outputs_other_platform_open_only: 12.0,
      p_outputs_closed: 59.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "ATG",
    name: "Antigua & Barbuda",
    logo_sm: "/logos/country/s/ATG.svg",
    entity_type: "country",
    subregion: "Latin America and the Caribbean",
    region: "Americas",
    acronyms: [],
    stats: {
      n_outputs: 11620,
      n_outputs_open: 6237,
      p_outputs_open: 53.67469879518072,
      p_outputs_publisher_open_only: 17.0,
      p_outputs_both: 31.0,
      p_outputs_other_platform_open_only: 6.0,
      p_outputs_closed: 46.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "AUS",
    name: "Australia",
    logo_sm: "/logos/country/s/AUS.svg",
    entity_type: "country",
    subregion: "Australia and New Zealand",
    region: "Oceania",
    acronyms: [],
    stats: {
      n_outputs: 1397711,
      n_outputs_open: 554280,
      p_outputs_open: 39.65626656726605,
      p_outputs_publisher_open_only: 10.0,
      p_outputs_both: 17.0,
      p_outputs_other_platform_open_only: 13.0,
      p_outputs_closed: 60.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "AUT",
    name: "Austria",
    logo_sm: "/logos/country/s/AUT.svg",
    entity_type: "country",
    subregion: "Western Europe",
    region: "Europe",
    acronyms: [],
    stats: {
      n_outputs: 323803,
      n_outputs_open: 143818,
      p_outputs_open: 44.415277190143385,
      p_outputs_publisher_open_only: 12.0,
      p_outputs_both: 22.0,
      p_outputs_other_platform_open_only: 11.0,
      p_outputs_closed: 55.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "AZE",
    name: "Azerbaijan",
    logo_sm: "/logos/country/s/AZE.svg",
    entity_type: "country",
    subregion: "Western Asia",
    region: "Asia",
    acronyms: [],
    stats: {
      n_outputs: 9420,
      n_outputs_open: 3017,
      p_outputs_open: 32.0276008492569,
      p_outputs_publisher_open_only: 13.0,
      p_outputs_both: 15.0,
      p_outputs_other_platform_open_only: 4.0,
      p_outputs_closed: 68.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "BEL",
    name: "Belgium",
    logo_sm: "/logos/country/s/BEL.svg",
    entity_type: "country",
    subregion: "Western Europe",
    region: "Europe",
    acronyms: [],
    stats: {
      n_outputs: 432510,
      n_outputs_open: 207849,
      p_outputs_open: 48.056461122286194,
      p_outputs_publisher_open_only: 9.0,
      p_outputs_both: 21.0,
      p_outputs_other_platform_open_only: 18.0,
      p_outputs_closed: 52.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "BEN",
    name: "Benin",
    logo_sm: "/logos/country/s/BEN.svg",
    entity_type: "country",
    subregion: "Sub-Saharan Africa",
    region: "Africa",
    acronyms: [],
    stats: {
      n_outputs: 9227,
      n_outputs_open: 5282,
      p_outputs_open: 57.245041725371195,
      p_outputs_publisher_open_only: 10.0,
      p_outputs_both: 35.0,
      p_outputs_other_platform_open_only: 12.0,
      p_outputs_closed: 43.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "BFA",
    name: "Burkina Faso",
    logo_sm: "/logos/country/s/BFA.svg",
    entity_type: "country",
    subregion: "Sub-Saharan Africa",
    region: "Africa",
    acronyms: [],
    stats: {
      n_outputs: 1705,
      n_outputs_open: 881,
      p_outputs_open: 51.671554252199414,
      p_outputs_publisher_open_only: 13.0,
      p_outputs_both: 31.0,
      p_outputs_other_platform_open_only: 8.0,
      p_outputs_closed: 48.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "BGD",
    name: "Bangladesh",
    logo_sm: "/logos/country/s/BGD.svg",
    entity_type: "country",
    subregion: "Southern Asia",
    region: "Asia",
    acronyms: [],
    stats: {
      n_outputs: 71381,
      n_outputs_open: 35836,
      p_outputs_open: 50.20383575461257,
      p_outputs_publisher_open_only: 25.0,
      p_outputs_both: 20.0,
      p_outputs_other_platform_open_only: 5.0,
      p_outputs_closed: 50.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "BGR",
    name: "Bulgaria",
    logo_sm: "/logos/country/s/BGR.svg",
    entity_type: "country",
    subregion: "Eastern Europe",
    region: "Europe",
    acronyms: [],
    stats: {
      n_outputs: 53275,
      n_outputs_open: 19850,
      p_outputs_open: 37.25950258094791,
      p_outputs_publisher_open_only: 16.0,
      p_outputs_both: 14.0,
      p_outputs_other_platform_open_only: 7.0,
      p_outputs_closed: 63.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "BHR",
    name: "Bahrain",
    logo_sm: "/logos/country/s/BHR.svg",
    entity_type: "country",
    subregion: "Western Asia",
    region: "Asia",
    acronyms: [],
    stats: {
      n_outputs: 5869,
      n_outputs_open: 2047,
      p_outputs_open: 34.87817345373999,
      p_outputs_publisher_open_only: 13.0,
      p_outputs_both: 16.0,
      p_outputs_other_platform_open_only: 6.0,
      p_outputs_closed: 65.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "BIH",
    name: "Bosnia",
    logo_sm: "/logos/country/s/BIH.svg",
    entity_type: "country",
    subregion: "Southern Europe",
    region: "Europe",
    acronyms: [],
    stats: {
      n_outputs: 10790,
      n_outputs_open: 5762,
      p_outputs_open: 53.40129749768304,
      p_outputs_publisher_open_only: 20.0,
      p_outputs_both: 24.0,
      p_outputs_other_platform_open_only: 9.0,
      p_outputs_closed: 47.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "BLR",
    name: "Belarus",
    logo_sm: "/logos/country/s/BLR.svg",
    entity_type: "country",
    subregion: "Eastern Europe",
    region: "Europe",
    acronyms: [],
    stats: {
      n_outputs: 22751,
      n_outputs_open: 6547,
      p_outputs_open: 28.77675706562349,
      p_outputs_publisher_open_only: 12.0,
      p_outputs_both: 11.0,
      p_outputs_other_platform_open_only: 6.0,
      p_outputs_closed: 71.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "BOL",
    name: "Bolivia",
    logo_sm: "/logos/country/s/BOL.svg",
    entity_type: "country",
    subregion: "Latin America and the Caribbean",
    region: "Americas",
    acronyms: [],
    stats: {
      n_outputs: 2319,
      n_outputs_open: 1335,
      p_outputs_open: 57.56791720569211,
      p_outputs_publisher_open_only: 27.0,
      p_outputs_both: 24.0,
      p_outputs_other_platform_open_only: 7.0,
      p_outputs_closed: 42.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "BRA",
    name: "Brazil",
    logo_sm: "/logos/country/s/BRA.svg",
    entity_type: "country",
    subregion: "Latin America and the Caribbean",
    region: "Americas",
    acronyms: [],
    stats: {
      n_outputs: 1249450,
      n_outputs_open: 806107,
      p_outputs_open: 64.51694745688103,
      p_outputs_publisher_open_only: 29.0,
      p_outputs_both: 30.0,
      p_outputs_other_platform_open_only: 5.0,
      p_outputs_closed: 36.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
];

const countriesArrayView = new ArrayView<Entity>(testCountries, 0, testCountries.length);

const testInstitutions = [
  {
    id: "00013q465",
    name: "Pontifical Catholic University of Peru",
    logo_sm: "logos/institution/sm/00013q465.jpg",
    entity_type: "institution",
    country_name: "Peru",
    country_code: "PER",
    subregion: "Latin America and the Caribbean",
    region: "Americas",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 5046,
      n_outputs_open: 3205,
      p_outputs_open: 63.515655965120885,
      p_outputs_publisher_open_only: 16.0,
      p_outputs_both: 41.0,
      p_outputs_other_platform_open_only: 7.0,
      p_outputs_closed: 36.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0001fmy77",
    name: "University of Macerata",
    logo_sm: "logos/institution/sm/0001fmy77.jpg",
    entity_type: "institution",
    country_name: "Italy",
    country_code: "ITA",
    subregion: "Southern Europe",
    region: "Europe",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 1513,
      n_outputs_open: 609,
      p_outputs_open: 40.25115664243226,
      p_outputs_publisher_open_only: 7.0,
      p_outputs_both: 15.0,
      p_outputs_other_platform_open_only: 18.0,
      p_outputs_closed: 60.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0001ke483",
    name: "St George's Hospital",
    logo_sm: "logos/institution/sm/0001ke483.jpg",
    entity_type: "institution",
    country_name: "United Kingdom",
    country_code: "GBR",
    subregion: "Northern Europe",
    region: "Europe",
    institution_type: "Healthcare",
    acronyms: [],
    stats: {
      n_outputs: 14083,
      n_outputs_open: 5853,
      p_outputs_open: 41.560746999928995,
      p_outputs_publisher_open_only: 18.0,
      p_outputs_both: 17.0,
      p_outputs_other_platform_open_only: 7.0,
      p_outputs_closed: 58.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0002pcv65",
    name: "National University of R\u00edo Cuarto",
    logo_sm: "unknown.svg",
    entity_type: "institution",
    country_name: "Argentina",
    country_code: "ARG",
    subregion: "Latin America and the Caribbean",
    region: "Americas",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 3341,
      n_outputs_open: 1112,
      p_outputs_open: 33.28344806944028,
      p_outputs_publisher_open_only: 11.0,
      p_outputs_both: 16.0,
      p_outputs_other_platform_open_only: 6.0,
      p_outputs_closed: 67.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0003e4m70",
    name: "Hull York Medical School",
    logo_sm: "unknown.svg",
    entity_type: "institution",
    country_name: "United Kingdom",
    country_code: "GBR",
    subregion: "Northern Europe",
    region: "Europe",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 3759,
      n_outputs_open: 2555,
      p_outputs_open: 67.97020484171323,
      p_outputs_publisher_open_only: 11.0,
      p_outputs_both: 40.0,
      p_outputs_other_platform_open_only: 17.0,
      p_outputs_closed: 32.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0003zy991",
    name: "York Hospital",
    logo_sm: "unknown.svg",
    entity_type: "institution",
    country_name: "United Kingdom",
    country_code: "GBR",
    subregion: "Northern Europe",
    region: "Europe",
    institution_type: "Healthcare",
    acronyms: [],
    stats: {
      n_outputs: 1029,
      n_outputs_open: 388,
      p_outputs_open: 37.70651117589893,
      p_outputs_publisher_open_only: 14.0,
      p_outputs_both: 17.0,
      p_outputs_other_platform_open_only: 7.0,
      p_outputs_closed: 62.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0004wsx81",
    name: "Telkom University",
    logo_sm: "logos/institution/sm/0004wsx81.jpg",
    entity_type: "institution",
    country_name: "Indonesia",
    country_code: "IDN",
    subregion: "South-eastern Asia",
    region: "Asia",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 4715,
      n_outputs_open: 2476,
      p_outputs_open: 52.51325556733828,
      p_outputs_publisher_open_only: 43.0,
      p_outputs_both: 8.0,
      p_outputs_other_platform_open_only: 1.0,
      p_outputs_closed: 48.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0005w8d69",
    name: "University of Camerino",
    logo_sm: "logos/institution/sm/0005w8d69.jpg",
    entity_type: "institution",
    country_name: "Italy",
    country_code: "ITA",
    subregion: "Southern Europe",
    region: "Europe",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 8029,
      n_outputs_open: 3399,
      p_outputs_open: 42.33403910823266,
      p_outputs_publisher_open_only: 5.0,
      p_outputs_both: 20.0,
      p_outputs_other_platform_open_only: 17.0,
      p_outputs_closed: 58.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "00088z429",
    name: "Kobe Pharmaceutical University",
    logo_sm: "logos/institution/sm/00088z429.jpg",
    entity_type: "institution",
    country_name: "Japan",
    country_code: "JPN",
    subregion: "Eastern Asia",
    region: "Asia",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 1757,
      n_outputs_open: 818,
      p_outputs_open: 46.556630620375635,
      p_outputs_publisher_open_only: 30.0,
      p_outputs_both: 14.0,
      p_outputs_other_platform_open_only: 3.0,
      p_outputs_closed: 53.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0008wzh48",
    name: "Royal Marsden NHS Foundation Trust",
    logo_sm: "logos/institution/sm/0008wzh48.jpg",
    entity_type: "institution",
    country_name: "United Kingdom",
    country_code: "GBR",
    subregion: "Northern Europe",
    region: "Europe",
    institution_type: "Healthcare",
    acronyms: [],
    stats: {
      n_outputs: 11100,
      n_outputs_open: 5231,
      p_outputs_open: 47.12612612612613,
      p_outputs_publisher_open_only: 16.0,
      p_outputs_both: 24.0,
      p_outputs_other_platform_open_only: 7.0,
      p_outputs_closed: 53.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0009t4v78",
    name: "Anglia Ruskin University",
    logo_sm: "logos/institution/sm/0009t4v78.jpg",
    entity_type: "institution",
    country_name: "United Kingdom",
    country_code: "GBR",
    subregion: "Northern Europe",
    region: "Europe",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 6009,
      n_outputs_open: 3478,
      p_outputs_open: 57.879846896322185,
      p_outputs_publisher_open_only: 6.0,
      p_outputs_both: 25.0,
      p_outputs_other_platform_open_only: 27.0,
      p_outputs_closed: 42.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000b7ms85",
    name: "Zhongkai University of Agriculture and Engineering",
    logo_sm: "unknown.svg",
    entity_type: "institution",
    country_name: "China",
    country_code: "CHN",
    subregion: "Eastern Asia",
    region: "Asia",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 1844,
      n_outputs_open: 578,
      p_outputs_open: 31.344902386117134,
      p_outputs_publisher_open_only: 12.0,
      p_outputs_both: 18.0,
      p_outputs_other_platform_open_only: 1.0,
      p_outputs_closed: 69.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000cyem11",
    name: "Donald Danforth Plant Science Center",
    logo_sm: "logos/institution/sm/000cyem11.jpg",
    entity_type: "institution",
    country_name: "United States",
    country_code: "USA",
    subregion: "Northern America",
    region: "Americas",
    institution_type: "Nonprofit",
    acronyms: [],
    stats: {
      n_outputs: 1605,
      n_outputs_open: 1143,
      p_outputs_open: 71.21495327102804,
      p_outputs_publisher_open_only: 14.0,
      p_outputs_both: 45.0,
      p_outputs_other_platform_open_only: 12.0,
      p_outputs_closed: 29.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000cytz87",
    name: "Weatherford (Switzerland)",
    logo_sm: "logos/institution/sm/000cytz87.jpg",
    entity_type: "institution",
    country_name: "Switzerland",
    country_code: "CHE",
    subregion: "Western Europe",
    region: "Europe",
    institution_type: "Company",
    acronyms: [],
    stats: {
      n_outputs: 1715,
      n_outputs_open: 71,
      p_outputs_open: 4.139941690962099,
      p_outputs_publisher_open_only: 2.0,
      p_outputs_both: 2.0,
      p_outputs_other_platform_open_only: 0.0,
      p_outputs_closed: 96.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000e0be47",
    name: "Northwestern University",
    logo_sm: "logos/institution/sm/000e0be47.jpg",
    entity_type: "institution",
    country_name: "United States",
    country_code: "USA",
    subregion: "Northern America",
    region: "Americas",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 134403,
      n_outputs_open: 65381,
      p_outputs_open: 48.64549154408756,
      p_outputs_publisher_open_only: 11.0,
      p_outputs_both: 21.0,
      p_outputs_other_platform_open_only: 17.0,
      p_outputs_closed: 51.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000h6jb29",
    name: "Helmholtz Centre for Environmental Research",
    logo_sm: "logos/institution/sm/000h6jb29.jpg",
    entity_type: "institution",
    country_name: "Germany",
    country_code: "DEU",
    subregion: "Western Europe",
    region: "Europe",
    institution_type: "Facility",
    acronyms: [],
    stats: {
      n_outputs: 9528,
      n_outputs_open: 4098,
      p_outputs_open: 43.01007556675063,
      p_outputs_publisher_open_only: 11.0,
      p_outputs_both: 24.0,
      p_outputs_other_platform_open_only: 8.0,
      p_outputs_closed: 57.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000hdh770",
    name: "Dalarna University",
    logo_sm: "logos/institution/sm/000hdh770.jpg",
    entity_type: "institution",
    country_name: "Sweden",
    country_code: "SWE",
    subregion: "Northern Europe",
    region: "Europe",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 2209,
      n_outputs_open: 1141,
      p_outputs_open: 51.65233137166139,
      p_outputs_publisher_open_only: 6.0,
      p_outputs_both: 36.0,
      p_outputs_other_platform_open_only: 10.0,
      p_outputs_closed: 48.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000hzy098",
    name: "Saint Petersburg State Pediatric Medical University",
    logo_sm: "unknown.svg",
    entity_type: "institution",
    country_name: "Russia",
    country_code: "RUS",
    subregion: "Eastern Europe",
    region: "Europe",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 1059,
      n_outputs_open: 514,
      p_outputs_open: 48.536355051935786,
      p_outputs_publisher_open_only: 38.0,
      p_outputs_both: 10.0,
      p_outputs_other_platform_open_only: 1.0,
      p_outputs_closed: 51.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000k1q888",
    name: "Netherlands Institute for Radio Astronomy",
    logo_sm: "logos/institution/sm/000k1q888.jpg",
    entity_type: "institution",
    country_name: "Netherlands",
    country_code: "NLD",
    subregion: "Western Europe",
    region: "Europe",
    institution_type: "Other",
    acronyms: [],
    stats: {
      n_outputs: 3558,
      n_outputs_open: 2448,
      p_outputs_open: 68.8026981450253,
      p_outputs_publisher_open_only: 3.0,
      p_outputs_both: 32.0,
      p_outputs_other_platform_open_only: 34.0,
      p_outputs_closed: 31.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000pfrh90",
    name: "Baptist Hospital of Miami",
    logo_sm: "logos/institution/sm/000pfrh90.jpg",
    entity_type: "institution",
    country_name: "United States",
    country_code: "USA",
    subregion: "Northern America",
    region: "Americas",
    institution_type: "Healthcare",
    acronyms: [],
    stats: {
      n_outputs: 1090,
      n_outputs_open: 489,
      p_outputs_open: 44.862385321100916,
      p_outputs_publisher_open_only: 19.0,
      p_outputs_both: 20.0,
      p_outputs_other_platform_open_only: 6.0,
      p_outputs_closed: 55.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000pmrk50",
    name: "Islamic University of Indonesia",
    logo_sm: "logos/institution/sm/000pmrk50.jpg",
    entity_type: "institution",
    country_name: "Indonesia",
    country_code: "IDN",
    subregion: "South-eastern Asia",
    region: "Asia",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 3898,
      n_outputs_open: 3175,
      p_outputs_open: 81.4520266803489,
      p_outputs_publisher_open_only: 67.0,
      p_outputs_both: 14.0,
      p_outputs_other_platform_open_only: 1.0,
      p_outputs_closed: 18.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000prga03",
    name: "Guilin Medical University",
    logo_sm: "unknown.svg",
    entity_type: "institution",
    country_name: "China",
    country_code: "CHN",
    subregion: "Eastern Asia",
    region: "Asia",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 1934,
      n_outputs_open: 1102,
      p_outputs_open: 56.98035160289555,
      p_outputs_publisher_open_only: 13.0,
      p_outputs_both: 41.0,
      p_outputs_other_platform_open_only: 3.0,
      p_outputs_closed: 43.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  // Deliberately added "Facility" to institution_types to test multiple institution_type instances
  {
    id: "000qzf213",
    name: "Korea University of Science and Technology",
    logo_sm: "unknown.svg",
    entity_type: "institution",
    country_name: "South Korea",
    country_code: "KOR",
    subregion: "Eastern Asia",
    region: "Asia",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 6822,
      n_outputs_open: 2324,
      p_outputs_open: 34.06625622984462,
      p_outputs_publisher_open_only: 9.0,
      p_outputs_both: 19.0,
      p_outputs_other_platform_open_only: 6.0,
      p_outputs_closed: 66.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000xsnr85",
    name: "University of the Basque Country",
    logo_sm: "logos/institution/sm/000xsnr85.jpg",
    entity_type: "institution",
    country_name: "Spain",
    country_code: "ESP",
    subregion: "Southern Europe",
    region: "Europe",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 41115,
      n_outputs_open: 17910,
      p_outputs_open: 43.560744253921925,
      p_outputs_publisher_open_only: 10.0,
      p_outputs_both: 21.0,
      p_outputs_other_platform_open_only: 13.0,
      p_outputs_closed: 56.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "000zhpw23",
    name: "Institut de la Vision",
    logo_sm: "unknown.svg",
    entity_type: "institution",
    country_name: "France",
    country_code: "FRA",
    subregion: "Western Europe",
    region: "Europe",
    institution_type: "Facility",
    acronyms: [],
    stats: {
      n_outputs: 1751,
      n_outputs_open: 1064,
      p_outputs_open: 60.76527698458024,
      p_outputs_publisher_open_only: 9.0,
      p_outputs_both: 38.0,
      p_outputs_other_platform_open_only: 14.0,
      p_outputs_closed: 39.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0010b6s72",
    name: "Tianjin Agricultural University",
    logo_sm: "unknown.svg",
    entity_type: "institution",
    country_name: "China",
    country_code: "CHN",
    subregion: "Eastern Asia",
    region: "Asia",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 1368,
      n_outputs_open: 376,
      p_outputs_open: 27.485380116959064,
      p_outputs_publisher_open_only: 13.0,
      p_outputs_both: 13.0,
      p_outputs_other_platform_open_only: 2.0,
      p_outputs_closed: 72.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0010jkx06",
    name: "Indira Gandhi Institute of Technology",
    logo_sm: "unknown.svg",
    entity_type: "institution",
    country_name: "India",
    country_code: "IND",
    subregion: "Southern Asia",
    region: "Asia",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 1240,
      n_outputs_open: 188,
      p_outputs_open: 15.161290322580644,
      p_outputs_publisher_open_only: 8.0,
      p_outputs_both: 3.0,
      p_outputs_other_platform_open_only: 4.0,
      p_outputs_closed: 85.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
  {
    id: "0011qv509",
    name: "University of Tennessee Health Science Center",
    logo_sm: "logos/institution/sm/0011qv509.jpg",
    entity_type: "institution",
    country_name: "United States",
    country_code: "USA",
    subregion: "Northern America",
    region: "Americas",
    institution_type: "Education",
    acronyms: [],
    stats: {
      n_outputs: 20309,
      n_outputs_open: 10563,
      p_outputs_open: 52.01142350681963,
      p_outputs_publisher_open_only: 12.0,
      p_outputs_both: 25.0,
      p_outputs_other_platform_open_only: 15.0,
      p_outputs_closed: 48.0,
    },
    years: [],
    repositories: [],
    start_year: 0,
    end_year: 0,
  },
];

const institutionsArrayView = new ArrayView<Entity>(testInstitutions, 0, testInstitutions.length);

test("test filterResults", async () => {
  // Test that all countries are returned with the widest filters
  let defaultQuery = {
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
  };
  let results = filterResults(countriesArrayView, defaultQuery);
  expect(results.length).toBe(countriesArrayView.length);

  // ids filter
  let query = deepcopy(defaultQuery);
  query.ids.add("BGR");
  query.ids.add("AUS");
  results = filterResults(countriesArrayView, query);
  let expectedLength = 2;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject([{ id: "AUS" }, { id: "BGR" }]);

  // Subregion filter
  query = deepcopy(defaultQuery);
  query.subregions.add("Western Asia");
  results = filterResults(countriesArrayView, query);
  expectedLength = 4;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject(Array(expectedLength).fill({ subregion: "Western Asia" }));
  // Array(n).fill(x): creates an array with n elements, then fills it with the value (x) passed to fill.

  query.subregions.add("Eastern Europe");
  results = filterResults(countriesArrayView, query);
  expectedLength = 6;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject([
    { subregion: "Western Asia" },
    { subregion: "Western Asia" },
    { subregion: "Western Asia" },
    { subregion: "Eastern Europe" },
    { subregion: "Western Asia" },
    { subregion: "Eastern Europe" },
  ]);

  // Region
  query = deepcopy(defaultQuery);
  query.regions.add("Americas");
  results = filterResults(countriesArrayView, query);
  expectedLength = 4;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject(Array(expectedLength).fill({ region: "Americas" }));

  query.regions.add("Europe");
  results = filterResults(countriesArrayView, query);
  expectedLength = 10;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject([
    { region: "Europe" },
    { region: "Americas" },
    { region: "Americas" },
    { region: "Europe" },
    { region: "Europe" },
    { region: "Europe" },
    { region: "Europe" },
    { region: "Europe" },
    { region: "Americas" },
    { region: "Americas" },
  ]);

  // Number of outputs
  query = deepcopy(defaultQuery);
  query.minNOutputs = 1705;
  query.maxNOutputs = 3252;
  results = filterResults(countriesArrayView, query);
  expectedLength = 3;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject([{ id: "ALB" }, { id: "BFA" }, { id: "BOL" }]);

  query.maxNOutputs = 3251;
  results = filterResults(countriesArrayView, query);
  expectedLength = 2;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject([{ id: "BFA" }, { id: "BOL" }]);

  query.minNOutputs = 1706;
  results = filterResults(countriesArrayView, query);
  expectedLength = 1;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject([{ id: "BOL" }]);

  // Percentage of outputs
  query = deepcopy(defaultQuery);
  query.minPOutputsOpen = 28;
  query.maxPOutputsOpen = 40;
  results = filterResults(countriesArrayView, query);
  expectedLength = 6;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject([
    { id: "ARE" },
    { id: "AUS" },
    { id: "AZE" },
    { id: "BGR" },
    { id: "BHR" },
    { id: "BLR" },
  ]);

  query.minPOutputsOpen = 30;
  query.maxPOutputsOpen = 35;
  results = filterResults(countriesArrayView, query);
  expectedLength = 2;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject([{ id: "AZE" }, { id: "BHR" }]);

  // Test that all institutions are returned  with the widest filters
  results = filterResults(institutions, defaultQuery);
  expect(results.length).toBe(institutions.length);

  // ids filter
  query = deepcopy(defaultQuery);
  query.ids.add("0010jkx06");
  query.ids.add("000qzf213");
  results = filterResults(institutionsArrayView, query);
  expectedLength = 2;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject([{ id: "000qzf213" }, { id: "0010jkx06" }]);

  // Countries
  query = deepcopy(defaultQuery);
  query.countries.add("GBR");
  results = filterResults(institutionsArrayView, query);
  expectedLength = 5;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject(Array(expectedLength).fill({ country_name: "United Kingdom", country_code: "GBR" }));

  query.countries.add("USA");
  results = filterResults(institutionsArrayView, query);
  expect(results.length).toBe(9);
  expect(results).toMatchObject([
    { country_name: "United Kingdom", country_code: "GBR" },
    { country_name: "United Kingdom", country_code: "GBR" },
    { country_name: "United Kingdom", country_code: "GBR" },
    { country_name: "United Kingdom", country_code: "GBR" },
    { country_name: "United Kingdom", country_code: "GBR" },
    { country_name: "United States", country_code: "USA" },
    { country_name: "United States", country_code: "USA" },
    { country_name: "United States", country_code: "USA" },
    { country_name: "United States", country_code: "USA" },
  ]);

  // Institution types
  query = deepcopy(defaultQuery);
  query.institutionTypes.add("Education");
  results = filterResults(institutionsArrayView, query);
  expectedLength = 19;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject([
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
  ]);

  query.institutionTypes.add("Facility");
  results = filterResults(institutionsArrayView, query);
  expectedLength = 21;
  expect(results.length).toBe(expectedLength);
  expect(results).toMatchObject([
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Facility" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Facility" },
    { institution_type: "Education" },
    { institution_type: "Education" },
    { institution_type: "Education" },
  ]);

  // Test that countries and institution type filters do nothing to countries
  query = deepcopy(defaultQuery);
  query.countries.add("GBR");
  query.institutionTypes.add("Facility");
  results = filterResults(countries, query);
  expect(results.length).toBe(countries.length);
});
