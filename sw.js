// PeachFit offline cache
// Pages: network first (new versions show up when online), saved app as fallback without signal.
// Files (scripts, styles, fonts, icons): saved copy first.
const CACHE = 'peachfit-1.6';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      const res = await fetch('/', { cache: 'no-store' });
      const html = await res.clone().text();
      await cache.put('/', res);
      const files = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map(m => m[1]);
      await Promise.all(files.map(f => cache.add(f).catch(() => {})));
    } catch (e) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// The page sends what its first visit already loaded (fonts, icons) so those are kept too
self.addEventListener('message', event => {
  const d = event.data;
  if (!d || d.type !== 'cache' || !Array.isArray(d.urls)) return;
  event.waitUntil(caches.open(CACHE).then(cache =>
    Promise.all(d.urls.map(u => cache.match(u).then(hit => hit || cache.add(u).catch(() => {}))))));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await Promise.race([
          fetch(req),
          new Promise((_, reject) => setTimeout(() => reject(new Error('slow network')), 4000)),
        ]);
        if (res && res.ok) cache.put('/', res.clone());
        return res;
      } catch (e) {
        return (await cache.match('/')) || (await cache.match(req)) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  })());
});
