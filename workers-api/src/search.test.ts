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

import { search, searchIndex } from "./search";
import { importIndex, indexEntities, exportIndex } from "./searchIndex";
import dataRaw from "../../latest/data/index.json";
import flexsearch, { Tokenizer } from "flexsearch";
import { Entity } from "./types";
import now from "performance-now";

const { Index } = flexsearch;

test("test search", () => {
  let text = "south";

  // 1 result
  let limit = 1;
  let results = search(searchIndex, text, limit);
  expect(results.length).toBe(limit);

  // 5 result
  limit = 5;
  results = search(searchIndex, text, limit);
  expect(results.length).toBe(limit);

  // All results
  limit = 0;
  results = search(searchIndex, text, limit);
  expect(results.length).toBeGreaterThan(40);

  // No text
  text = "";
  limit = 5;
  results = search(searchIndex, text, limit);
  expect(results.length).toBe(0);

  // Check country results schema
  text = "australia";
  limit = 1;
  let result = search(searchIndex, text, limit)[0];
  const expectedCountry = {
    id: "AUS",
    name: "Australia",
    logo_sm: "logos/country/sm/AUS.svg",
    entityType: "country",
    subregion: "Australia and New Zealand",
    region: "Oceania",
    stats: {
      n_outputs: expect.any(Number),
      n_outputs_open: expect.any(Number),
      p_outputs_open: expect.any(Number),
      p_outputs_publisher_open_only: expect.any(Number),
      p_outputs_both: expect.any(Number),
      p_outputs_other_platform_open_only: expect.any(Number),
      p_outputs_closed: expect.any(Number),
    },
  };
  expect(result).toMatchObject(expectedCountry);

  // Check institution results schema
  text = "curtin university";
  limit = 1;
  result = search(searchIndex, text, limit)[0];
  const expectedInstitution = {
    id: "02n415q13",
    name: "Curtin University",
    logo_sm: "logos/institution/sm/02n415q13.jpg",
    entityType: "institution",
    country: "Australia",
    subregion: "Australia and New Zealand",
    region: "Oceania",
    institution_types: ["Education"],
    stats: {
      n_outputs: expect.any(Number),
      n_outputs_open: expect.any(Number),
      p_outputs_open: expect.any(Number),
      p_outputs_publisher_open_only: expect.any(Number),
      p_outputs_both: expect.any(Number),
      p_outputs_other_platform_open_only: expect.any(Number),
      p_outputs_closed: expect.any(Number),
    },
  };
  expect(result).toMatchObject(expectedInstitution);
});

async function benchmarkSearch(tokenize: Tokenizer) {
  // Index
  let start = now();
  const entities = dataRaw as Array<Entity>;
  const preset = {
    language: "en",
    tokenize: tokenize,
  };
  let index = new Index(preset);
  indexEntities(index, entities);
  let end = now();
  let diff = end - start;
  console.log(`Time to index tokenize=${tokenize}: ${diff.toFixed(2)}ms`);

  // Export index
  let exported = await exportIndex(index).then((data) => {
    return data;
  });

  // Load pre-built index
  start = now();
  index = new Index(preset);
  await importIndex(index, exported);
  end = now();
  diff = end - start;
  console.log(`Time to load index tokenize=${tokenize}: ${diff.toFixed(2)}ms`);
  return index;
}

test("benchmark search indexing", async () => {
  // Benchmarks how long it takes to index from scratch vs importing an existing index
  // and also tests that the index works when imported from an export
  //
  // Experiment with 5260 entities. Importing an exported index is thousands of times faster and more
  // suitable for the Cloudflare Workers global context as it won't cause startup timeouts.
  //
  // | Tokenize Type | Build    | Import |
  // |---------------|----------|--------|
  // | strict        | 39.83ms  | 0.02ms |
  // | forward       | 73.79ms  | 0.02ms |
  // | reverse       | 139.96ms | 0.03ms |
  // | full          | 241.47ms | 0.03ms |

  const text = "Curtin";
  const expected = [{ id: "02n415q13" }];

  let index = await benchmarkSearch("strict");
  let results = search(index, text, 1);
  expect(results).toMatchObject(expected);

  index = await benchmarkSearch("forward");
  results = search(index, text, 1);
  expect(results).toMatchObject(expected);

  index = await benchmarkSearch("reverse");
  results = search(index, text, 1);
  expect(results).toMatchObject(expected);

  index = await benchmarkSearch("full");
  results = search(index, text, 1);
  expect(results).toMatchObject(expected);
});
