import { handleRequest } from "./router";

const maxAge = 604800; // cache data for 7 days

export function makeCacheKey(request: Request): Request {
  //@ts-ignore
  // BUILD_ID is replaced at compile time with a nanoid random id, this is so that when a new build is made with
  // different data, the old cached requests are not returned.
  const cacheUrl = new URL(`${request.url}&build=${BUILD_ID}`);
  return new Request(cacheUrl.toString(), request);
}

//@ts-ignore
export async function fetchData(request: Request, env, ctx) {
  const cache = caches.default;
  const cacheKey = makeCacheKey(request);
  let response = await cache.match(cacheKey);

  if (!response) {
    console.log(`Request ${cacheKey.url} not in cache, fetching and caching.`);
    response = await handleRequest(request);
    //@ts-ignore
    response.headers.append("Cache-Control", `s-maxage=${maxAge}`);

    // @ts-ignore
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  } else {
    console.log(`Cache hit: ${cacheKey.url}.`);
  }

  return response;
}

//@ts-ignore
const worker: ExportedHandler = { fetch: fetchData };
export default worker;
