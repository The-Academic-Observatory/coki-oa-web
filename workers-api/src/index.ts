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

import { handleRequest } from "./router";

const maxAge = 604800; // cache data for 7 days

export function makeCacheKey(request: Request): Request {
  return new Request(request.url, request);
}

export async function fetchData(request: Request, env: Bindings, ctx: ExecutionContext) {
  const cache = caches.default;
  const cacheKey = makeCacheKey(request);
  let response = await cache.match(cacheKey);

  if (response) {
    console.log(`Cache hit: ${cacheKey.url}.`);
  } else {
    console.log(`Request ${cacheKey.url} not in cache, fetching and caching.`);
    response = await handleRequest(request, env, ctx);

    if (response?.status === 200) {
      // If 200 code then cache response, else return error
      //@ts-ignore
      response.headers.append("Cache-Control", `s-maxage=${maxAge}`);

      // @ts-ignore
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }
  }

  return response;
}

// https://github.com/cloudflare/miniflare/issues/239

const worker: ExportedHandler<Bindings> = { fetch: fetchData };
export default worker;
