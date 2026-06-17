const CACHE = 'monitor-cba-v11';
const RUNTIME_CACHE = 'monitor-cba-runtime-v11';
const BASE = new URL('./', self.location).pathname;
const LOCAL_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'fichas-opme.html',
  BASE + 'styles.css',
  BASE + 'app.js',
  BASE + 'firebase-config.js',
  BASE + 'monitor-domain.js',
  BASE + 'pwa-register.js',
  BASE + 'manifest.json',
  BASE + 'icon.svg',
];

const RUNTIME_HOSTS = new Set([
  'www.gstatic.com',
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
]);

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(LOCAL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => ![CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function cacheFirst(request) {
  return caches.match(request).then(cached => cached || fetch(request).then(res => {
    const clone = res.clone();
    caches.open(CACHE).then(c => c.put(request, clone));
    return res;
  }));
}

function staleWhileRevalidate(request) {
  return caches.open(RUNTIME_CACHE).then(cache => (
    cache.match(request).then(cached => {
      const fetched = fetch(request).then(res => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  ));
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Ignora esquemas que o Cache API não suporta (ex.: extensões do Chrome
  // injetando requisições chrome-extension://) — deixa o navegador tratar.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request, {cache:'reload'}).catch(() => caches.match(BASE + 'index.html') || caches.match(BASE))
    );
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith(BASE)) {
    e.respondWith(cacheFirst(e.request));
    return;
  }

  if (RUNTIME_HOSTS.has(url.hostname)) {
    e.respondWith(staleWhileRevalidate(e.request));
    return;
  }

  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
