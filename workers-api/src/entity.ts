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

import manifestJSON from "__STATIC_CONTENT_MANIFEST";
import { EntityRequest } from "@/types";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-type": "application/json",
};

export const fetchEntityHandler = async (req: EntityRequest, env: Bindings, ctx: ExecutionContext) => {
  const url = new URL(req.url);
  const entityType = req.params.entityType;
  if (!["country", "institution"].includes(entityType)) {
    throw Error(`fetchEntityHandler invalid entityType: ${entityType}`);
  }
  const entityId = req.params.id;
  const assetPath = `${entityType}/${entityId}.json`;
  const kvKey = JSON.parse(manifestJSON)[assetPath];

  console.log(
    `fetchEntityHandler: pathname=${url.pathname}, entityType=${entityType}, entityId=${entityId}, assetPath=${assetPath}, kvKey=${kvKey}`,
  );

  // Fetch data from KV
  // Use a stream because it is the fastest, and we don't need to parse the JSON data
  const data = await env.__STATIC_CONTENT.get(kvKey, { type: "stream" });
  if (data !== null) {
    // Return response with data
    return new Response(data, {
      headers: headers,
    });
  }

  // No data file found, return 404 not found
  return new Response("Not found", {
    status: 404,
    headers: headers,
  });
};
