```javascript
const CACHE_NAME = 'butcem-v2';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
];

// Service Worker Yükleniyor ve Cache Hazırlanıyor
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Uygulama dosyaları önbelleğe alınıyor...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Çevrimdışı Çalışma Rutini (Önce Cache, Hata Durumunda Ağ)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request).catch(() => {
        // Eğer istek bir sayfa ise ve çevrimdışıysak ana sayfayı dön
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Eski Önbellekleri Temizleme Rutini
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('Eski önbellek temizleniyor:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

```