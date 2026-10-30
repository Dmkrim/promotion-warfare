// Simple offline cache: app shell + runtime caching of CDN files (Tailwind, FontAwesome)
const CACHE = 'promotion-warfare-v5';
const SHELL = ['./', './index.html', './privacy.html', './manifest.webmanifest', './bank.js', './js/avatars.js', './js/adviser.js', './js/app2.js', './js/strategies.js', './js/extras.js', './app-icon.png', './hiprogress-logo.png', './004.jpg', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // never cache or intercept web-search calls (Wikipedia): they must always be live
  if (/wikipedia\.org$/.test(url.hostname)) return;
  const fresh = (req) => fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  });
  if (url.origin === self.location.origin) {
    // own files: newest version first (so updates show up), cached copy when offline
    e.respondWith(fresh(e.request).catch(() => caches.match(e.request).then(hit => hit || (e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
  } else {
    // CDN files (Tailwind, Font Awesome): cached copy first
    e.respondWith(caches.match(e.request).then(hit => hit || fresh(e.request).catch(() => Response.error())));
  }
});
