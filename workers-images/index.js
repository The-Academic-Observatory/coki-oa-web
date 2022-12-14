import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    event.respondWith(new Response(e.message || e.toString(), { status: 500 }));
  }
});

async function handleEvent(event) {
  try {
    const options = {
      cacheControl: {
        browserTTL: 14400, // 4 hours
        edgeTTL: 604800, // 7 days
        bypassCache: false, // Don't bypass CF cache
      },
    };
    return await getAssetFromKV(event, options);
  } catch (e) {
    new Response("Not found", {
      status: 404,
    });
  }
}
