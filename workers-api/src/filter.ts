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

import dataRaw from "../../latest/data/index.json";
import lodashGet from "lodash.get";
import { Entity, FilterQuery, FilterRequest, PageSettings, Query } from "./types";

const data = dataRaw as Array<Entity>;

export class ArrayView<Type> {
  startIdx: number;
  endIdx: number;
  length: number;
  array: Array<Type>;

  constructor(array: Array<Type>, startIdx: number, endIdx: number) {
    this.startIdx = startIdx;
    this.endIdx = endIdx;
    this.length = endIdx - startIdx;
    this.array = array;
  }

  set(index: number, value: Type) {
    this.array[index + this.startIdx] = value;
  }

  get(index: number) {
    return this.array[index + this.startIdx];
  }
}

// Make country and institution array views
const minLimit = 1;
const maxLimit = 100;
const minOutputs = 0;
const minOutputsOpen = 0;

const firstInstitutionIndex = data.findIndex((entity: Entity) => {
  return entity.category === "institution";
});
const lastCountryIndex = firstInstitutionIndex - 1;
export const countries = new ArrayView<Entity>(data, 0, lastCountryIndex);
export const institutions = new ArrayView<Entity>(data, firstInstitutionIndex, data.length);

export const parsePageSettings = (q: FilterQuery): PageSettings => {
  let page = q.page === undefined ? 0 : parseInt(q.page);
  let limit = q.limit === undefined ? maxLimit : parseInt(q.limit);
  page = Math.max(page, 0);
  limit = Math.max(Math.min(limit, maxLimit), minLimit);

  let orderBy = q.orderBy || "stats.p_outputs_open";
  let orderDir = q.orderDir || "dsc";

  return {
    page: page,
    limit: limit,
    orderBy: orderBy,
    orderDir: orderDir,
  };
};

export const parseQuery = (q: FilterQuery): Query => {
  let countries = q.countries === undefined ? new Set<string>() : new Set<string>(q.countries.split(","));
  let subregions = q.subregions === undefined ? new Set<string>() : new Set<string>(q.subregions.split(","));
  let regions = q.regions === undefined ? new Set<string>() : new Set<string>(q.regions.split(","));
  let institutionTypes =
    q.institutionTypes === undefined ? new Set<string>() : new Set<string>(q.institutionTypes.split(","));

  let minNOutputs = q.minNOutputs === undefined ? minOutputs : parseInt(q.minNOutputs);
  minNOutputs = Math.max(minNOutputs, minOutputs);
  let maxNOutputs = q.maxNOutputs === undefined ? Number.MAX_VALUE : parseInt(q.maxNOutputs);
  maxNOutputs = Math.max(maxNOutputs, minOutputs);
  let minNOutputsOpen = q.minNOutputsOpen === undefined ? minOutputsOpen : parseInt(q.minNOutputsOpen);
  minNOutputsOpen = Math.max(minNOutputsOpen, minOutputsOpen);
  let maxNOutputsOpen = q.maxNOutputsOpen === undefined ? Number.MAX_VALUE : parseInt(q.maxNOutputsOpen);
  maxNOutputsOpen = Math.max(maxNOutputsOpen, minOutputsOpen);
  let minPOutputsOpen = q.minPOutputsOpen === undefined ? 0 : parseInt(q.minPOutputsOpen);
  minPOutputsOpen = Math.min(Math.max(minPOutputsOpen, 0), 100);
  let maxPOutputsOpen = q.maxPOutputsOpen === undefined ? 100 : parseInt(q.maxPOutputsOpen);
  maxPOutputsOpen = Math.max(Math.min(maxPOutputsOpen, 100), 0);

  return {
    countries: countries,
    subregions: subregions,
    regions: regions,
    institutionTypes: institutionTypes,
    minNOutputs: minNOutputs,
    maxNOutputs: maxNOutputs,
    minNOutputsOpen: minNOutputsOpen,
    maxNOutputsOpen: maxNOutputsOpen,
    minPOutputsOpen: minPOutputsOpen,
    maxPOutputsOpen: maxPOutputsOpen,
  };
};

// Filtering functions
export function filterResults(array: ArrayView<Entity>, query: Query): Entity[] {
  let results = [];

  // Filter items
  for (let i = 0; i < array.length; i++) {
    // Must call array.get as this is the interface for ArrayView
    const entity = array.get(i);
    let include = true;

    // Include if countries parameter specified and matches
    if (entity.country !== undefined && entity.country !== null && query.countries.size) {
      include = include && query.countries.has(entity.country);
    }

    // Include if subregions parameter specified and matches
    if (query.subregions.size) {
      include = include && query.subregions.has(entity.subregion);
    }

    // Include if regions parameter specified and matches
    if (query.regions.size) {
      include = include && query.regions.has(entity.region);
    }

    // Check if any institutionTypes match types in entity.institution_types
    if (entity.institution_types !== undefined && entity.institution_types !== null && query.institutionTypes.size) {
      let institutionTypesMatch = false;

      for (let j = 0; j < entity.institution_types.length; j++) {
        const type = entity.institution_types[j];
        if (query.institutionTypes.has(type)) {
          institutionTypesMatch = true;
          break;
        }
      }
      include = include && institutionTypesMatch;
    }

    // Include if n_outputs is between filter values
    include = include && query.minNOutputs <= entity.stats.n_outputs && entity.stats.n_outputs <= query.maxNOutputs;

    // Include if n_outputs_open is between filter values
    include =
      include &&
      query.minNOutputsOpen <= entity.stats.n_outputs_open &&
      entity.stats.n_outputs_open <= query.maxNOutputsOpen;

    // Include if p_outputs_open is between filter values
    include =
      include &&
      query.minPOutputsOpen <= entity.stats.p_outputs_open &&
      entity.stats.p_outputs_open <= query.maxPOutputsOpen;

    if (include) {
      // Add to result list
      results.push(entity);
    }
  }

  return results;
}

export function paginateResults<Type>(array: Array<Type>, pageSettings: PageSettings): Array<Type> {
  // Check we are sorting numbers or strings
  const isNumber = pageSettings.orderBy !== "name";

  // Sort
  let results = array.sort((a, b) => {
    // lodash.get enables us to retrieve nested properties via a string
    const aSortProp = lodashGet(a, pageSettings.orderBy);
    const bSortProp = lodashGet(b, pageSettings.orderBy);

    // If number
    if (isNumber) {
      return aSortProp - bSortProp;
    }

    // If string
    if (aSortProp < bSortProp) {
      return -1;
    }
    if (aSortProp > bSortProp) {
      return 1;
    }

    // Strings equal
    return 0;
  });

  // Change to descending order
  if (pageSettings.orderDir === "dsc") {
    results.reverse();
  }

  // Paginate
  const start = pageSettings.page * pageSettings.limit;
  const end = (pageSettings.page + 1) * pageSettings.limit;
  return results.slice(start, end);
}

export const countriesHandler = (req: FilterRequest, env?: Bindings, ctx?: ExecutionContext) => {
  const q = req["query"];
  const query = parseQuery(q);
  const pageSettings = parsePageSettings(q);

  // Filter
  const results = filterResults(countries, query);

  // Paginate
  const subset = paginateResults(results, pageSettings);

  // Make final search object
  let obj = {
    items: subset,
    nItems: results.length,
    page: pageSettings.page,
    limit: pageSettings.limit,
    orderBy: pageSettings.orderBy,
    orderDir: pageSettings.orderDir,
  };

  // Convert to JSON, returning results
  const json = JSON.stringify(obj);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
  };
  return new Response(json, {
    headers: headers,
  });
};

export const institutionsHandler = (req: FilterRequest, env?: Bindings, ctx?: ExecutionContext) => {
  const q = req["query"];
  const query = parseQuery(q);
  const pageSettings = parsePageSettings(q);

  // Filter
  const results = filterResults(institutions, query);

  // Paginate
  const subset = paginateResults(results, pageSettings);

  // Make final search object
  let obj = {
    items: subset,
    nItems: results.length,
    page: pageSettings.page,
    limit: pageSettings.limit,
    orderBy: pageSettings.orderBy,
    orderDir: pageSettings.orderDir,
  };

  // Convert to JSON, returning results
  const json = JSON.stringify(obj);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
  };
  return new Response(json, {
    headers: headers,
  });
};
