import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

const plausibleScriptName = "script.js";
const plausibleEndpointName = "/site-api/event";

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});

async function handleEvent(event) {
  const url = new URL(event.request.url);
  const pathname = url.pathname;
  const options = {};

  try {
    if (pathname.endsWith(plausibleScriptName)) {
      return proxyPlausibleScript(event);
    } else if (pathname.endsWith(plausibleEndpointName)) {
      return proxyPlausibleEvent(event);
    } else {
      return await getAssetFromKV(event, options);
    }
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    try {
      let notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: (req) => new Request(`${new URL(req.url).origin}/404.html`, req),
      });

      return new Response(notFoundResponse.body, {
        ...notFoundResponse,
        status: 404,
      });
    } catch (e) {}

    return new Response(e.message || e.toString(), { status: 500 });
  }
}

async function proxyPlausibleScript(event) {
  if (ANALYTICS_ENABLED === "true") {
    let r = await caches.default.match(event.request);
    if (!r) {
      r = await fetch("https://plausible.io/js/plausible.js");
      event.waitUntil(caches.default.put(event.request, r.clone()));
    }
    return r;
  }
  return new Response(null, { status: 404 });
}

async function proxyPlausibleEvent(event) {
  if (ANALYTICS_ENABLED === "true") {
    const r = new Request(event.request);
    r.headers.delete("cookie");
    return await fetch("https://plausible.io/api/event", r);
  }
  return new Response(null, { status: 404 });
}
