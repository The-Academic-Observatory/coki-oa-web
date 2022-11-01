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

import pako from "pako";
import { SearchRequest } from "./types";
import { importIndex } from "./searchIndex";
import flexsearch from "flexsearch";
import { selectEntities } from "@/database";

const { Index } = flexsearch;

let searchIndexLoaded = false;
const flexSearchIndexKVKey = "flexsearchIndex.json.gz";
export const searchIndex = new Index({
  language: "en",
  tokenize: "forward",
});

const minLimit = 1;
const maxLimit = 20;

//@ts-ignore
export const search = async (db: D1Database, index, text: string, limit: number) => {
  // Search index
  const ids = index.search(text, limit);

  // Select entities from database
  return await selectEntities(db, ids);
};

export const searchHandler = async (req: SearchRequest, env: Bindings, ctx: ExecutionContext) => {
  if (searchIndexLoaded) {
    console.log("Using globally cached search index.");
  } else {
    console.log("Loading search index from KV storage into global memory.");

    // Fetch from KV
    const data = await env.__STATIC_CONTENT.get(flexSearchIndexKVKey, { type: "arrayBuffer" });

    if (data != null) {
      // Decompress file, convert to JSON and load into search index
      const flexSearchIndex = JSON.parse(pako.ungzip(data, { to: "string" }));
      await importIndex(searchIndex, flexSearchIndex);
      searchIndexLoaded = true;
    } else {
      console.error(`searchHandler error: KV key ${flexSearchIndexKVKey} not found.`);
    }
  }

  // Parse parameters and search
  const text = decodeURIComponent(req.params.text);
  let limit = parseInt(req.query.limit) || maxLimit;
  limit = Math.max(Math.min(limit, maxLimit), minLimit);
  const results = await search(env.DB, searchIndex, text, limit);

  // Convert to JSON, returning results
  const json = JSON.stringify(results);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
  };
  return new Response(json, {
    headers: headers,
  });
};
