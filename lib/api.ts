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

import { Entity, QueryParams, Stats } from "./model";
import fs from "fs";
import { join } from "path";
import lodashGet from "lodash.get";
import lodashSet from "lodash.set";
import { largestRemainder, sum } from "./utils";

const dataPath: string = <string>process.env.DATA_PATH;

export function getEntityIds(category: string) {
  const path = join(dataPath, category);
  return fs.readdirSync(path).map((fileName) => fileName.replace(/\.json$/, ""));
}

export function idsToStaticPaths(ids: Array<string>) {
  return ids.map((entityId) => {
    return {
      params: {
        id: entityId,
      },
    };
  });
}

export function getEntity(category: string, id: string): Entity {
  const filePath = join(dataPath, category, `${id}.json`);
  const entity = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  quantizeEntityPercentages(entity);
  return entity;
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

export function getIndexTableData(category: string) {
  const filePath = join(dataPath, `${category}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getStatsData(): Stats {
  const filePath = join(dataPath, `stats.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
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

export function makeSearchUrl(text: string, limit: number = 10): string {
  let url = `${process.env.NEXT_PUBLIC_API_HOST}/api/search/${encodeURIComponent(text)}`;
  if (limit) {
    url += `?limit=${limit}`;
  }
  return addBuildId(url);
}

export function makeFilterUrl(endpoint: string, filterQuery: QueryParams): string {
  // Make base URL
  let url = `${process.env.NEXT_PUBLIC_API_HOST}/api/${endpoint}`;

  // Convert filterQuery into URL query parameters
  const query = Object.keys(filterQuery)
    .map((key) => {
      // Return null when property does not belong on this endpoint
      if (endpoint !== "institutions" && ["institutionTypes"].includes(key)) {
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
