const CACHE_NAME = 'psl-hub-v1';

const STATIC_CACHE = [
  '/',
  '/standings',
  '/matches',
  '/teams',
  '/top-scorers',
  '/news',
];

const CACHEABLE_API = [
  '/api/standings/',
  '/api/matches/',
  '/api/standings/top-scorers',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PSL Hub SW] Pre-caching app shell');
      return Promise.allSettled(
        STATIC_CACHE.map(url =>
          cache.add(url).catch(err => console.warn(`Cache miss for ${url}:`, err))
        )
      );
    })
  );
  self.skipWaiting();
});


self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME) // Delete all other versions
          .map(name => {
            console.log('[PSL Hub SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const path = url.pathname;

  if (CACHEABLE_API.some(api => path.startsWith(api))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(cached => {
            if (cached) return cached;
            return new Response(
              JSON.stringify({ error: 'Offline — showing last known data', offline: true }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  if (
    event.request.destination === 'script' ||
    event.request.destination === 'style' ||
    event.request.destination === 'image' ||
    event.request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }
});