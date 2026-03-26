// ============================================================
//  sw.js  —  Tokyo 2026 PWA Service Worker
//  部署位置：與 index.html 同層（根目錄）
// ============================================================

const CACHE_NAME = 'tokyo-2026-v6';

const PRECACHE_URLS = [
  './',
  './index.html',
  // ── pdf/ ──
  './pdf/holidaypackage.pdf',
  // ── img/ ──
  './img/0331_01.JPG',
  './img/03_30_view.png',
  './img/0405_01_01.png',
  './img/0405_01_02.png',
  './img/04_08_01.png',
  './img/3_28_0900.png',
  './img/4_6_1720_1.png',
  './img/4_6_1720_2.png',
  './img/day_1_airbnb_pdf.png',
  './img/day_8_airbnb_pdf.png',
  './img/g01_f4481e57a4.png',
  './img/g02_1ba2935666.png',
  './img/g03_b79b5ea740.png',
  './img/g04_03ec62fd36.png',
  './img/g05_1a1557c0e4.webp',
  './img/g07_f8ddaf6174.jpg',
  './img/g08_3e0400ec4d.jpg',
  './img/g09_3bd4270814.jpg',
  './img/g10_2b6d34411e.jpg',
  './img/g11_8d5e3dc066.jpg',
  './img/g12_c8e8236875.jpg',
  './img/g13_ea02941ecf.jpg',
  './img/g14_13e11c48db.jpg',
  './img/g15_c0efbdd0c2.jpg',
  './img/g16_b863ffd46a.jpg',
  './img/g17_8238d50fd5.jpg',
  './img/g18_294043add8.jpg',
  './img/g19_db48722a0f.jpg',
  './img/g20_c6e794a1c7.jpg',
  './img/g21_2b82224f1f.jpg',
  './img/g22_84d3474354.jpg',
  './img/g37_94f2ec8f45.png',
  './img/hagi_no_shirabe_yu.jpeg',
  './img/mille_feuille_maison.jpg',
];

// ── Install：預先快取所有指定資源 ──
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] Pre-caching:', PRECACHE_URLS);
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// ── Activate：清除舊版快取 ──
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ── Fetch：Cache First（離線優先） ──
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) {
        const fetchPromise = fetch(event.request).then(function(networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(function() {});

        return cached;
      }

      return fetch(event.request).then(function(networkResponse) {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      }).catch(function() {
        return new Response('目前離線，請稍後再試。', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      });
    })
  );
});
