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

import path from "path";
import fs from "fs";
import { Entity, FlexSearchIndex } from "@/types";
import flexsearch from "flexsearch";
import pako from "pako";

const { Index } = flexsearch;

export function indexEntities(index: FlexSearchIndex, data: Array<Entity>) {
  data.forEach((entity: Entity, i: number) => {
    const acronyms = new Array<string>();
    if (entity.acronyms !== undefined) {
      acronyms.push(...entity.acronyms);
    }
    const keywords = [entity.name];
    keywords.push(...acronyms.join(" "));
    if (entity.country_name !== undefined) {
      keywords.push(entity.country_name);
    }
    keywords.push(entity.region);
    const text = keywords.join(" ");
    // Integer ids are used rather than strings because this reduces the size of the index by half and increases
    // search and indexing speed.
    index.add(i, text);
  });
}

export function exportIndex(index: FlexSearchIndex): Promise<Array<Array<Object>>> {
  const expectedNumIndexes = 4; // Assumes that there are four types of index to export
  return new Promise((resolve, _) => {
    const ex: Array<Array<Object>> = [];
    index.export((key: string, value: string) => {
      const parts = `${key}`.split(".");
      ex.push([parts[parts.length - 1], JSON.parse(value)]);
      if (ex.length >= expectedNumIndexes) {
        resolve(ex);
      }
    });
  });
}

export function loadEntityIndexes(dataPath: string): Array<Entity> {
  let entities: Array<Entity> = [];
  ["country", "institution"].forEach((category: string) => {
    const filePath = path.join(dataPath, `${category}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    entities.push(...data);
  });
  return entities;
}

export async function saveIndexToFile(dataPath: string, outputPath: string) {
  // Create index from scratch
  const index = new Index({
    language: "en",
    tokenize: "forward",
  }) as FlexSearchIndex;
  const entities = loadEntityIndexes(dataPath);
  indexEntities(index, entities);

  // Export index
  const exported = await exportIndex(index).then((data) => {
    return data;
  });

  // Save gzip compressed file
  const data = JSON.stringify(exported);
  const buffer = pako.gzip(data);
  fs.writeFileSync(outputPath, buffer);
}

export async function importIndex(index: FlexSearchIndex, data: Array<Array<Object>>) {
  for (let i = 0; i < data.length; i++) {
    const key = data[i][0] as string;
    const value = data[i][1] as Object;
    await index.import(key, value);
  }
}
