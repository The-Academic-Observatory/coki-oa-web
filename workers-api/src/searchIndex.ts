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

//@ts-ignore
import fs from "fs";
import { Entity } from "./types";
import flexsearch from "flexsearch";
const { Index } = flexsearch;

//@ts-ignore
export function indexEntities(index, data: Array<Entity>) {
  data.forEach((entity: Entity, i: number) => {
    let acronyms = new Array<string>();
    if (entity.acronyms != undefined) {
      // not null or undefined
      acronyms = entity.acronyms;
    }
    let keywords = [entity.name];
    keywords = keywords.concat(acronyms.join(" "));
    if (entity.country_name != null) {
      // not null or undefined
      keywords.push(entity.country_name);
    }
    keywords.push(entity.region);
    const text = keywords.join(" ");
    index.add(i, text);
  });
}

//@ts-ignore
export function exportIndex(index): Promise<Array<Array<Object>>> {
  const expectedNumIndexes = 4; // Assumes that there are four types of index to export
  return new Promise((resolve, _) => {
    let ex: Array<Array<Object>> = [];
    index.export((key: string, data: string) => {
      const parts = `${key}`.split(".");
      ex.push([parts[parts.length - 1], JSON.parse(data)]);
      if (ex.length >= expectedNumIndexes) {
        resolve(ex);
      }
    });
  });
}

export async function saveIndexToFile(inputPath: string, outputPath: string) {
  // Create index from scratch
  const index = new Index({
    language: "en",
    tokenize: "forward",
  });
  // @ts-ignore
  const entities = JSON.parse(fs.readFileSync(inputPath));
  indexEntities(index, entities);

  // Export index
  let exported = await exportIndex(index).then((data) => {
    return data;
  });

  // Save to file
  fs.writeFileSync(outputPath, JSON.stringify(exported));
}

//@ts-ignore
export async function importIndex(index, data: Array<Array<Object>>) {
  for (let i = 0; i < data.length; i++) {
    let key = data[i][0] as string;
    let value = data[i][1] as Object;
    //@ts-ignore
    await index.import(key, value);
  }
}
