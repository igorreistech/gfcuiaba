const CACHE = 'monitor-cba-v3';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add('/gfcuiaba/')));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(c => { try { c.navigate(c.url); } catch(ex) {} }))
  );
});

self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/gfcuiaba/')));
  }
});
