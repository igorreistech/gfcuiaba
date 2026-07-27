const CACHE = 'monitor-cba-v18-nfimport';
const BASE = new URL('./', self.location).pathname;
const LOCAL_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'styles.css',
  BASE + 'app.js',
  BASE + 'manifest.json',
  BASE + 'nf-import.js',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png',
  BASE + 'icon-192-maskable.png',
  BASE + 'icon-512-maskable.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(LOCAL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Ignora esquemas que o Cache API não suporta (ex.: extensões do Chrome
  // injetando requisições chrome-extension://) — deixa o navegador tratar.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request, {cache:'reload'}).catch(() => caches.match(BASE))
    );
    return;
  }

  // Só tenta cache em requisições realmente do mesmo domínio do site (GET) —
  // antes isso incluía por engano chamadas ao Supabase (login, leituras,
  // escritas), e tentar cachear um POST derruba com erro do Cache API.
  const isLocal = url.origin === self.location.origin;
  if (isLocal && e.request.method === 'GET' && url.pathname.startsWith(BASE)) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
