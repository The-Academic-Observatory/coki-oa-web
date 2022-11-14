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

import fs from "fs";
import { Entity, FlexSearchIndex } from "./types";
import flexsearch from "flexsearch";
import pako from "pako";

const { Index } = flexsearch;

export function indexEntities(index: FlexSearchIndex, data: Array<Entity>) {
  data.forEach((entity: Entity, i: number) => {
    let acronyms = new Array<string>();
    if (entity.acronyms !== undefined) {
      acronyms = entity.acronyms;
    }
    let keywords = [entity.name];
    keywords = keywords.concat(acronyms.join(" "));
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
    let ex: Array<Array<Object>> = [];
    index.export((key: string, value: string) => {
      const parts = `${key}`.split(".");
      ex.push([parts[parts.length - 1], JSON.parse(value)]);
      if (ex.length >= expectedNumIndexes) {
        resolve(ex);
      }
    });
  });
}

export async function saveIndexToFile(countryPath: string, institutionPath: string, outputPath: string) {
  // Create index from scratch
  const index = new Index({
    language: "en",
    tokenize: "forward",
  }) as FlexSearchIndex;
  let entities = JSON.parse(fs.readFileSync(countryPath, "utf8"));
  entities = entities.concat(JSON.parse(fs.readFileSync(institutionPath, "utf8")));
  indexEntities(index, entities);

  // Export index
  let exported = await exportIndex(index).then((data) => {
    return data;
  });

  // Save gzip compressed file
  const data = JSON.stringify(exported);
  const buffer = pako.gzip(data);
  fs.writeFileSync(outputPath, buffer);
}

export async function importIndex(index: FlexSearchIndex, data: Array<Array<Object>>) {
  for (let i = 0; i < data.length; i++) {
    let key = data[i][0] as string;
    let value = data[i][1] as Object;
    await index.import(key, value);
  }
}
