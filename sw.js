// 固有のキャッシュ名を設定
const CACHE_NAME = 'tokyo-tourism-app-v1';

// キャッシュするリソース
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'icon-72x72.jpg',
  'icon-96x96.jpg',
  'icon-128x128.jpg',
  'icon-144x144.jpg',
  'icon-152x152.jpg',
  'icon-192x192.jpg',
  'icon-384x384.jpg',
  'icon-512x512.jpg'
];

// インストールイベント
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチイベント
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがある場合はそれを返す
        if (response) {
          return response;
        }
        
        // キャッシュがない場合はネットワークリクエスト
        return fetch(event.request).then(
          response => {
            // レスポンスが有効かチェック
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // レスポンスをクローン
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// アクティベートイベント
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // ホワイトリストにないキャッシュを削除
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
