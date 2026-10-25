/* Cache only the self-contained game. Waitlist submissions always use the network. */
const OFFLINE_CACHE = "peyyfi-offline-v3";
const OFFLINE_PAGE = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(OFFLINE_CACHE);
    await cache.add(new Request(OFFLINE_PAGE, { cache: "reload" }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("peyyfi-offline-") && key !== OFFLINE_CACHE)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (url.pathname === OFFLINE_PAGE) {
    event.respondWith((async () => {
      const cache = await caches.open(OFFLINE_CACHE);
      return (await cache.match(OFFLINE_PAGE)) || fetch(request);
    })());
  } else if (request.mode === "navigate" && !url.pathname.startsWith("/api/")) {
    event.respondWith((async () => {
      try {
        return await fetch(request);
      } catch {
        const cache = await caches.open(OFFLINE_CACHE);
        return (await cache.match(OFFLINE_PAGE)) || Response.error();
      }
    })());
  }
});
