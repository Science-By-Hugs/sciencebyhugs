const CACHE_NAME = 'sbh-hub-v7-hugs';
const APP_SHELL = ['/', '/index.html', '/styles.css', '/script.js', '/manifest.webmanifest',
  '/assets/hugs-ring.svg', '/assets/favicon.svg', '/assets/nexus.svg', '/assets/pulse.svg', '/assets/core.svg',
  '/assets/icon-192.png', '/assets/icon-512.png', '/assets/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first, cache as offline fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, copy)); return res;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('/index.html'))));
});
