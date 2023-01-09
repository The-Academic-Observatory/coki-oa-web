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

import { ArrayView, filterResults, institutions, paginateResults } from "@/filter";
import { Entity, Query } from "@/types";
import now from "performance-now";
import { makeMemoizer } from "@glenstack/cf-workers-function-memoizer";

//@ts-ignore
const { TEST_NAMESPACE } = getMiniflareBindings();
//@ts-ignore
const memoize = makeMemoizer(TEST_NAMESPACE);
const expirationTtl = 60 * 60; // 60 minutes
const iterations = 5000;
const defaultQuery = {
  countries: new Set<string>(),
  subregions: new Set<string>(),
  regions: new Set<string>(),
  institutionTypes: new Set<string>(),
  minNOutputs: 0,
  maxNOutputs: Number.MAX_VALUE,
  minNOutputsOpen: 0,
  maxNOutputsOpen: Number.MAX_VALUE,
  minPOutputsOpen: 0,
  maxPOutputsOpen: 100,
};

export function keyGenerator(category: string, array: ArrayView<Entity>, query: Query): string {
  return `${category}:${JSON.stringify(query)}`;
}

const filterResultsAsync = async (category: string, array: ArrayView<Entity>, query: Query) => {
  return filterResults(array, query);
};

const filterResultsAsyncMemo = memoize(
  filterResultsAsync,
  {
    keyGenerator: keyGenerator,
    resultTransformer: JSON.stringify,
    type: "json",
  },
  {
    expirationTtl: expirationTtl,
  },
);

test.skip("benchmark filterResults with institution list", async () => {
  const start = now();
  for (let i = 0; i < iterations; i++) {
    filterResults(institutions, defaultQuery);
  }
  const end = now();
  let avg = (end - start) / iterations;
  console.log(`Mean time filterResults: ${avg.toFixed(2)}ms`);
});

test.skip("benchmark paginateResults with institution list", async () => {
  let pageSettings = {
    page: 0,
    limit: 18,
    orderBy: "stats.p_outputs_open",
    orderDir: "dsc",
  };
  let results = filterResults(institutions, defaultQuery);
  const start = now();
  for (let i = 0; i < iterations; i++) {
    paginateResults(results, pageSettings);
  }
  const end = now();
  let avg = (end - start) / iterations;
  console.log(`Mean time paginateResults: ${avg.toFixed(2)}ms`);
});

test.skip("benchmark filterResultsAsyncMemo with institution list", async () => {
  const start = now();
  for (let i = 0; i < iterations; i++) {
    await filterResultsAsyncMemo("institution", institutions, defaultQuery);
  }
  const end = now();
  let avg = (end - start) / iterations;
  console.log(`Mean time filterResultsAsyncMemo: ${avg.toFixed(2)}ms`);
});
