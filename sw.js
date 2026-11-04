const CACHE = 'nexus-09-mobile-v2';
const SHELL = [
  './', './index.html', './style.css', './mobile.css', './app.js',
  './manifest.webmanifest', './vendor/three.module.js',
  './assets/favicon.svg', './assets/icon-192.png', './assets/icon-512.png',
  './assets/fonts/space-grotesk-regular.ttf', './assets/fonts/space-grotesk-semibold.ttf',
  './assets/fonts/syne-bold.ttf', './assets/fonts/syne-extrabold.ttf'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone(); caches.open(CACHE).then(cache => cache.put('./index.html', copy)); return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
    return response;
  })));
});
