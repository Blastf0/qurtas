// Service Worker for Qurtas
// Currently a placeholder. Will be implemented in Phase 4 for offline capabilities.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
  // Pass through all requests for now
  event.respondWith(fetch(event.request));
});
