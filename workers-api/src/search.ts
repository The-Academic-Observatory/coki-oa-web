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

import { SearchRequest } from "./types";
import { searchEntities } from "@/database";

const minLimit = 1;
const maxLimit = 20;

export const searchHandler = async (req: SearchRequest, env: Bindings, ctx: ExecutionContext) => {
  // Parse parameters and query
  const text = decodeURIComponent(req.params.text);
  let limit = parseInt(req.query.limit) || maxLimit;
  limit = Math.max(Math.min(limit, maxLimit), minLimit);

  // Convert returned ids to objects
  const results = await searchEntities(env.DB, text, limit);

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
