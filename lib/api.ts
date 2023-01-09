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

import { Dict, Entity, QueryParams, QueryResult, Stats } from "./model";
import lodashGet from "lodash.get";
import lodashSet from "lodash.set";
import fs from "fs";
import { join } from "path";
import { largestRemainder, sum } from "./utils";
import statsRaw from "../data/stats.json";

export const DEFAULT_N_OUTPUTS = 1000;
const IMAGES_HOST_NAME = "https://images.open.coki.ac";

export class OADataAPI {
  host: string;

  constructor(host: string = process.env.NEXT_PUBLIC_API_HOST || "https://open.coki.ac") {
    this.host = host;
  }

  getStats(): Stats {
    return statsRaw as unknown as Stats;
  }

  async getEntity(entityType: string, id: string): Promise<Entity> {
    const response = await fetch(`${this.host}/api/${entityType}/${id}`);
    const entity = await response.json();
    quantizeEntityPercentages(entity);
    return entity;
  }

  async searchEntities(text: string, limit: number): Promise<Array<Entity>> {
    const url = makeSearchUrl(this.host, text, limit);
    return fetch(url).then((response) => response.json());
  }

  async filterEntities(entityType: string, filterQuery: QueryParams): Promise<QueryResult> {
    const url = makeFilterUrl(this.host, entityType, filterQuery);
    return fetch(url).then((response) => response.json());
  }
}

export class OADataLocal {
  dataPath: string;

  constructor(dataPath: string = "./data") {
    this.dataPath = dataPath;
  }

  getStats(): Stats {
    return statsRaw as unknown as Stats;
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

export function addBuildId(url: string): string {
  let parts = [url];
  if (url.indexOf("?") !== -1) {
    parts.push("&");
  } else {
    parts.push("?");
  }
  //@ts-ignore
  parts.push(`build=${BUILD_ID}`);

  return parts.join("");
}

export function makeSearchUrl(host: string, text: string, limit: number = 10): string {
  let url = `${host}/api/search/${encodeURIComponent(text)}`;
  if (limit) {
    url += `?limit=${limit}`;
  }
  return addBuildId(url);
}

function makeFilterUrl(host: string, entityType: string, filterQuery: QueryParams): string {
  // Make base URL
  let url = `${host}/api/${entityType}`;

  // Convert filterQuery into URL query parameters
  const query = Object.keys(filterQuery)
    .map((key) => {
      // Return null when property does not belong on this endpoint
      if (entityType !== "institutions" && ["institutionTypes"].includes(key)) {
        return null;
      }

      // Get the value of the key
      const property = filterQuery[key as keyof typeof filterQuery];

      if (property === undefined || property === null) {
        return null;
      }
      if (Array.isArray(property) && property.length == 0) {
        // If empty array then return empty string
        return null;
      } else if (Array.isArray(property)) {
        // If the property is a non-empty array, URI encode each value in the array and then join them with commas
        let value = property
          .map((v) => {
            return encodeURIComponent(v);
          })
          .join(",");
        return `${key}=${value}`;
      } else {
        // If any other type then convert to string and URI encode
        let value = encodeURIComponent(property.toLocaleString("fullwide", { useGrouping: false }));
        return `${key}=${value}`;
      }
    })
    .filter((v) => v !== null)
    .join("&");

  if (query) {
    url += `?${query}`;
  }
  return addBuildId(url);
}

export function cokiImageLoader(src: string) {
  return `${IMAGES_HOST_NAME}/${src}`;
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
