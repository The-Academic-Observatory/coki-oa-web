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

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosRetry, { exponentialDelay } from "axios-retry";
import { Dict, Entity, QueryParams, QueryResult, Stats } from "./model";
import lodashGet from "lodash.get";
import lodashSet from "lodash.set";
import fs from "fs";
import { join } from "path";
import { largestRemainder, sum } from "./utils";
import statsRaw from "../../data/data/stats.json";

export const API_HOST = process.env.COKI_API_URL || "https://api.coki.ac";
export const IMAGES_HOST = process.env.COKI_IMAGES_URL || "https://images.open.coki.ac";

export class OADataAPI {
  host: string;
  private api: AxiosInstance;

  constructor(host: string = API_HOST) {
    this.host = host;
    this.api = axios.create();
    axiosRetry(this.api, {
      retryDelay: exponentialDelay,
      retries: 3,
    });
  }

  getStats(): Stats {
    return statsRaw as unknown as Stats;
  }

  async getEntity(entityType: string, id: string): Promise<Entity> {
    const url = makeEntityUrl(this.host, entityType, id);
    const response = await fetch(url);
    const entity = await response.json();
    quantizeEntityPercentages(entity);
    return entity;
  }

  async getEntities(entityType: string, filterQuery: QueryParams): Promise<QueryResult> {
    const url = makeFilterUrl(this.host, entityType, filterQuery);
    return fetch(url).then((response) => response.json());
  }

  async searchEntities(
    query: string,
    page: number,
    limit: number,
    controller: AbortController | null = null,
  ): Promise<AxiosResponse<QueryResult>> {
    const acronym = query.length >= 2 && query === query.toUpperCase();
    const url = makeSearchUrl(this.host, query, page, limit, acronym);
    const options: AxiosRequestConfig = {};
    if (controller != null) {
      options.signal = controller.signal;
    }
    return this.api.get(url, options);
  }
}

export class OADataLocal {
  dataPath: string;

  constructor(dataPath: string = "../data/data") {
    this.dataPath = dataPath;
  }

  getEntity(entityType: string, id: string): Entity {
    const filePath = join(this.dataPath, entityType, `${id}.json`);
    const entity = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    quantizeEntityPercentages(entity);
    return entity;
  }

  getEntities(entityType: string): Array<Entity> {
    const filePath = join(this.dataPath, `${entityType}.json`);
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
}

export function quantizeGroup(entity: Object, keys: Array<string>) {
  // Get samples
  let samples = keys.map((key) => {
    return lodashGet(entity, key);
  });

  // Make samples sum to 100
  let total = sum(samples);
  samples = samples.map((sample) => {
    return (sample / total) * 100;
  });

  // Round to integers using the largest remainder method and apply results to entity
  let results = largestRemainder(samples);
  results.forEach((val, i) => {
    const key = keys[i];
    lodashSet(entity, key, val);
  });
}

export function quantizeEntityPercentages(entity: Entity) {
  // Make percentage publisher open only, both, other platform open only and closed add to 100
  const oaKeys = [
    "stats.p_outputs_publisher_open_only",
    "stats.p_outputs_both",
    "stats.p_outputs_other_platform_open_only",
    "stats.p_outputs_closed",
  ];
  if (entity.stats.n_outputs > 0) {
    quantizeGroup(entity, oaKeys);
  }

  // Make percentage oa_journal, hybrid and no_guarantees add to 100
  const pubKeys = ["stats.p_outputs_oa_journal", "stats.p_outputs_hybrid", "stats.p_outputs_no_guarantees"];
  if (entity.stats.n_outputs_publisher_open > 0) {
    quantizeGroup(entity, pubKeys);
  }

  entity.years.forEach((year) => {
    if (year.stats.n_outputs > 0) {
      quantizeGroup(year, oaKeys);
    }

    if (year.stats.n_outputs_publisher_open > 0) {
      quantizeGroup(year, pubKeys);
    }
  });
}

export function makeEntityUrl(host: string, entityType: string, id: string): string {
  const url = new URL(`${host}/${entityType}/${id}`);
  const params = new URLSearchParams();
  params.append("build", BUILD_ID);
  url.search = params.toString();
  return url.toString();
}

export function makeSearchUrl(host: string, text: string, page: number, limit: number, acronym: boolean): string {
  const url = new URL(`${host}/search/${encodeURIComponent(text)}`);
  const params = new URLSearchParams();
  params.append("acronym", acronym.toString());
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  params.append("build", BUILD_ID);
  url.search = params.toString();
  return url.toString();
}

export function makeFilterUrl(host: string, entityType: string, filterQuery: QueryParams): string {
  let endpoint = "";
  if (entityType === "country") {
    endpoint = "countries";
  } else if (entityType === "institution") {
    endpoint = "institutions";
  } else {
    throw Error(`makeFilterUrl: unknown entity type ${entityType}`);
  }

  // Make base URL
  const url = new URL(`${host}/${endpoint}`);
  const params = new URLSearchParams();

  // Convert filterQuery into URL query parameters
  Object.keys(filterQuery).forEach((key) => {
    // Return null when property does not belong on this endpoint
    if (entityType !== "institution" && ["institutionTypes"].includes(key)) {
      return;
    }

    // Get the value of the key
    const property = filterQuery[key as keyof typeof filterQuery];

    if (property === undefined || property === null) {
      return;
    }
    if (Array.isArray(property) && property.length == 0) {
      // If empty array then do nothing
      return;
    } else if (Array.isArray(property)) {
      // If the property is a non-empty array, URI encode each value in the array and then join them with commas
      const value = property.join(",");
      params.append(key, value);
    } else {
      // If any other type then convert to string and URI encode
      const value = property.toLocaleString("fullwide", { useGrouping: false });
      params.append(key, value);
    }
  });

  params.append("build", BUILD_ID);
  url.search = params.toString();
  return url.toString();
}

export function makeDownloadDataUrl(host: string, entityType: string, id: string): string {
  const url = new URL(`${host}/download/${entityType}/${id}`);
  const params = new URLSearchParams();
  params.append("build", BUILD_ID);
  url.search = params.toString();
  return url.toString();
}

export function makeSocialCardUrl(entityId: string): string {
  const url = new URL(`${IMAGES_HOST}/social-cards/${entityId}.jpg`);
  const params = new URLSearchParams();
  params.append("build", BUILD_ID);
  url.search = params.toString();
  return url.toString();
}

export function cokiImageLoader(src: string) {
  return `${IMAGES_HOST}/${src}`;
}

export function idsToStaticPaths(ids: Array<string>, entityType?: string) {
  return ids.map((entityId) => {
    const params: Dict = {
      id: entityId,
    };

    if (entityType !== undefined) {
      params["entityType"] = entityType;
    }

    return {
      params: params,
    };
  });
}
