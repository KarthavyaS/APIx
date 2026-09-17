// Service Worker for APIx Government of India PWA (Network-First Strategy)
const CACHE_NAME = 'apix-gov-cache-v4';

self.addEventListener('install', (event) => {
  // Activate new worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Purge all old caches immediately
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First strategy: Always fetch latest files from server
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache only when completely offline
        return caches.match(event.request);
      })
  );
});
