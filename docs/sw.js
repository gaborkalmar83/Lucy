// LinguaMap service worker — offline-first shell, network-first for APIs.
const CACHE = 'linguamap-202607242012';
const PRECACHE = [
  "./",
  "index.html",
  "assets/app.js?v=202607242012",
  "assets/app.css?v=202607242012",
  "assets/sw-register.js?v=202607242012",
  "assets/icon.svg",
  "manifest.webmanifest",
  "vendor/react.production.min.js",
  "vendor/react-dom.production.min.js",
  "assets/fonts/023295f0-7f5c-4353-a1e0-2c25a335e358.woff2",
  "assets/fonts/02693af8-ad70-4c7b-bb57-3e04029ddcf0.woff2",
  "assets/fonts/09b314c5-c972-4994-9630-742744f67dca.woff2",
  "assets/fonts/270c6655-19ed-4377-a0eb-ce29133a02b7.woff2",
  "assets/fonts/2768cd68-2a35-4212-b3e8-6a2950a4e234.woff2",
  "assets/fonts/30472876-178b-48ab-b0ee-3e7f5efa1dd6.woff2",
  "assets/fonts/4b9638e4-a49f-42ed-86d6-5e7c66667ff7.woff2",
  "assets/fonts/6a34db41-0547-4223-a80c-68799a5ea404.woff2",
  "assets/fonts/6ce6bee4-780a-461a-8320-174fcbdc3586.woff2",
  "assets/fonts/76d08c80-5330-4e16-91fe-26135321d838.woff2",
  "assets/fonts/af953ca7-97f0-47e5-aa53-d1bdedcd4447.woff2",
  "assets/fonts/ee46bd83-4337-4b60-bbc2-55db63f9d020.woff2"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Never touch model providers — those must always hit the network.
  if (url.origin !== location.origin) return;

  // Navigations are network-first so a new deploy is picked up immediately,
  // with the cached shell as the offline fallback.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('index.html', copy));
        return res;
      }).catch(() => caches.match('index.html').then(hit => hit || caches.match('./')))
    );
    return;
  }

  // Assets: serve from cache for instant loads, refresh in the background.
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
