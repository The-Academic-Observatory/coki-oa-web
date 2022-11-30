import { handleRequest } from "./router";

const maxAge = 604800; // cache data for 7 days

export function makeCacheKey(request: Request): Request {
  return new Request(request.url, request);
}

//@ts-ignore
export async function fetchData(request: Request, env, ctx) {
  const cache = caches.default;
  const cacheKey = makeCacheKey(request);
  let response = await cache.match(cacheKey);

  if (response) {
    console.log(`Cache hit: ${cacheKey.url}.`);
  } else {
    console.log(`Request ${cacheKey.url} not in cache, fetching and caching.`);
    response = await handleRequest(request);

    if (response?.status === 200) {
      // If 200 code then cache response, else return error
      response.headers.append("Cache-Control", `s-maxage=${maxAge}`);
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }
  }

  return response;
}

//@ts-ignore
const worker: ExportedHandler = { fetch: fetchData };
export default worker;
