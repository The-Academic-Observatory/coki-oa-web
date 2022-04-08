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

import { Entity, Stats } from "./model";
import fs from "fs";
import { join } from "path";

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
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getIndexTableData(category: string) {
  const filePath = join(dataPath, `${category}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getStatsData(): Stats {
  const filePath = join(dataPath, `stats.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function makeSearchUrl(text: string, limit: number = 10): string {
  let url = `${process.env.NEXT_PUBLIC_API_HOST}/api/search/${encodeURIComponent(text)}`;
  if (limit) {
    url += `?limit=${limit}`;
  }
  return url;
}
