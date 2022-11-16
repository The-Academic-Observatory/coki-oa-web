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

import { FilterRequest, Query } from "@/types";
import { filterEntities } from "@/database";

const minLimit = 1;
const maxLimit = 18;
const minOutputs = 0;
const minOutputsOpen = 0;

export const parseFilterRequest = (filterRequest: FilterRequest): Query => {
  // Parse pathname
  const pathName = new URL(filterRequest.url).pathname;
  let category = "";
  if (pathName.includes("countries")) {
    category = "country";
  } else if (pathName.includes("institutions")) {
    category = "institution";
  }

  // Parse query
  const q = filterRequest["query"];
  let ids = q.ids === undefined ? new Set<string>() : new Set<string>(q.ids.split(","));
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

  // Parse page settings
  let page = q.page === undefined ? 0 : parseInt(q.page);
  let limit = q.limit === undefined ? maxLimit : parseInt(q.limit);
  page = Math.max(page, 0);
  limit = Math.max(Math.min(limit, maxLimit), minLimit);

  let orderBy = q.orderBy || "p_outputs_open";
  let orderDir = q.orderDir || "dsc";

  return {
    category: category,
    ids: ids,
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
    page: page,
    limit: limit,
    orderBy: orderBy,
    orderDir: orderDir,
  };
};

export const filterEntitiesHandler = async (req: FilterRequest, env: Bindings, ctx: ExecutionContext) => {
  // Parse query
  const query = parseFilterRequest(req);

  // Run query
  const results = await filterEntities(env.DB, query);

  // Convert to JSON, returning response
  const json = JSON.stringify(results);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
  };
  return new Response(json, {
    headers: headers,
  });
};
